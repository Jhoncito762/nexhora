"use client"

import { useEffect, useRef, useState } from "react"
import { X, Upload, ImageIcon, CalendarDays } from "lucide-react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Icon from "@/src/app/shared/Icon"
import Modal from "@/src/app/shared/Modal"
import DatePicker from "react-datepicker"
import { es } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css"


interface ImageFile {
    file: File
    preview: string
    alt: string
}

interface ExistingImage {
    evento_imagen_id?: number
    evento_id?: number
    url_imagen: string
    alt?: string
}

interface FormData {
    titulo: string
    resumen: string
    descripcion: string
    fecha_evento: Date | null
}

export interface FormModalEventProps {
    isOpen: boolean
    eventoId?: number
    onClose: () => void
    onSuccess?: () => void
}


const emptyForm = (): FormData => ({
    titulo: "",
    resumen: "",
    descripcion: "",
    fecha_evento: null,

})

const inputClass =
    "w-full h-10 px-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"

const textareaClass =
    "w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"

const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"

export default function FormModalEvent({ isOpen, eventoId, onClose, onSuccess }: FormModalEventProps) {

    const isEdit = !!eventoId
    const [form, setForm] = useState<FormData>(emptyForm())
    const [images, setImages] = useState<ImageFile[]>([])
    const [existingImages, setExistingImages] = useState<ExistingImage[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Escape key + body scroll lock
    useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        document.addEventListener("keydown", onKey)
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", onKey)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen) {
            setImages([])
            setExistingImages([])
            setError(null)
            scrollRef.current?.scrollTo(0, 0)

            if (isEdit && eventoId) {
                setIsFetching(true)
                axiosPrivate
                    .get<Record<string, unknown>>(`${process.env.NEXT_PUBLIC_EVENTS}/${eventoId}`)
                    .then((res) => {
                        const d = (res.data.data ?? res.data) as Record<string, unknown>
                        setForm({
                            titulo: (d.titulo as string) ?? "",
                            resumen: (d.resumen as string) ?? "",
                            descripcion: (d.descripcion as string) ?? "",
                            fecha_evento: d.fecha_evento ? new Date(d.fecha_evento as string) : null,

                        })
                        setExistingImages((d.imagenes as ExistingImage[]) ?? [])
                    })
                    .catch(() => setError("No se pudo cargar el evento para editar."))
                    .finally(() => setIsFetching(false))
            } else {
                setForm(emptyForm())
            }
        }
    }, [isOpen, isEdit, eventoId])

    if (!isOpen) return null


    const setField = (field: keyof FormData, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const MAX_IMAGES = 3

    const handleFiles = (files: FileList | null) => {
        if (!files) return
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
        const maxSize = 5 * 1024 * 1024
        const incoming: ImageFile[] = []

        for (const file of Array.from(files)) {
            if (!allowed.includes(file.type)) continue
            if (file.size > maxSize) continue
            incoming.push({
                file,
                preview: URL.createObjectURL(file),
                alt: "",
            })
        }
        setImages(prev => {
            const combined = [...prev, ...incoming]
            return combined.slice(0, MAX_IMAGES)
        })
    }

    const setImageAlt = (index: number, alt: string) =>
        setImages(prev => prev.map((img, i) => i === index ? { ...img, alt } : img))

    const removeImage = (index: number) =>
        setImages(prev => {
            URL.revokeObjectURL(prev[index].preview)
            return prev.filter((_, i) => i !== index)
        })

    const deleteExistingImage = async (img: ExistingImage) => {
        const imgId = img.evento_imagen_id
        if (!imgId) return
        try {
            await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_PRODUCT_IMAGES}/${imgId}`)
            setExistingImages(prev => prev.filter(i => (i.evento_imagen_id) !== imgId))
        } catch {
            setError("No se pudo eliminar la imagen. Intenta de nuevo.")
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        if (!form.fecha_evento) {
            setError("La fecha del evento es obligatoria.")
            setIsSubmitting(false)
            return
        }

        try {
            const fechaStr = form.fecha_evento.toISOString().split("T")[0]

            if (isEdit && eventoId) {
                // Update: PATCH JSON then upload images separately
                await axiosPrivate.patch(
                    `${process.env.NEXT_PUBLIC_EVENTS}/${eventoId}`,
                    {
                        titulo: form.titulo,
                        resumen: form.resumen,
                        descripcion: form.descripcion,
                        fechaEvento: fechaStr,
                    }
                )

                for (const img of images) {
                    const fd = new globalThis.FormData()
                    fd.append("imagenes", img.file)
                    if (img.alt.trim()) fd.append("alt", img.alt.trim())
                    await axiosPrivate.post(
                        `${process.env.NEXT_PUBLIC_EVENTS}/${eventoId}/imagenes`,
                        fd,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    )
                }
            } else {
                // Create: single multipart/form-data request
                const fd = new globalThis.FormData()
                fd.append("titulo", form.titulo)
                fd.append("descripcion", form.descripcion)
                if (form.resumen.trim()) fd.append("resumen", form.resumen)
                fd.append("fechaEvento", fechaStr)
                for (const img of images.slice(0, MAX_IMAGES)) {
                    fd.append("imagenes", img.file)
                }
                await axiosPrivate.post(
                    process.env.NEXT_PUBLIC_EVENTS!,
                    fd,
                    { headers: { "Content-Type": "multipart/form-data" } }
                )
            }

            setShowSuccess(true)
        } catch {
            setError("Ocurrió un error al guardar el evento. Intenta de nuevo.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            >
                <div
                    className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                    onClick={e => e.stopPropagation()}
                >
                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                        <div>
                            <h2 className="text-foreground font-bold text-lg">
                                {isEdit ? "Editar Evento" : "Nuevo Evento"}
                            </h2>
                            <p className="text-muted-foreground text-xs mt-0.5">
                                {isEdit
                                    ? "Modifica la información del evento."
                                    : "Completa la información del evento a registrar."}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            aria-label="Cerrar"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {isFetching ? (
                        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                            <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Cargando datos...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-7">

                                <section>
                                    <h3 className="text-foreground font-semibold text-sm mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                                        Información básica
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Título *</label>
                                            <input
                                                required
                                                value={form.titulo}
                                                onChange={e => setField("titulo", e.target.value)}
                                                placeholder="Congreso AmiTIC"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Resumen</label>
                                            <input
                                                required
                                                value={form.resumen}
                                                onChange={e => setField("resumen", e.target.value)}
                                                placeholder="Participamos del décimoavo encuentro..."
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Descripción *</label>
                                            <textarea
                                                required
                                                rows={8}
                                                value={form.descripcion}
                                                onChange={e => setField("descripcion", e.target.value)}
                                                placeholder="Escribe el contenido completo del evento..."
                                                className={textareaClass + " resize-y min-h-30"}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Fecha y Hora del Evento *</label>
                                            <DatePicker
                                                selected={form.fecha_evento}
                                                onChange={(date: Date | null) => setForm(prev => ({ ...prev, fecha_evento: date }))}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                dateFormat="dd/MM/yyyy  HH:mm"
                                                timeCaption="Hora"
                                                locale={es}
                                                placeholderText="Selecciona fecha y hora"
                                                popperProps={{ strategy: "fixed" }}
                                                customInput={
                                                    <button
                                                        type="button"
                                                        className={inputClass + " flex items-center gap-2 text-left cursor-pointer"}
                                                    >
                                                        <CalendarDays size={15} className="text-muted-foreground shrink-0" />
                                                        <span className={form.fecha_evento ? "text-foreground" : "text-muted-foreground"}>
                                                            {form.fecha_evento
                                                                ? form.fecha_evento.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
                                                                : "Selecciona fecha y hora"}
                                                        </span>
                                                    </button>
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-foreground font-semibold text-sm mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                                        Imágenes
                                        <span className="text-muted-foreground font-normal normal-case tracking-normal">
                                            (jpeg, png, webp, gif, avif — máx 5 MB · máx {MAX_IMAGES} imágenes)
                                        </span>
                                    </h3>

                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={e => e.preventDefault()}
                                        onClick={() => (!isEdit && images.length >= MAX_IMAGES) ? undefined : fileInputRef.current?.click()}
                                        className={`flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed transition-colors group ${!isEdit && images.length >= MAX_IMAGES
                                                ? "border-border opacity-50 cursor-not-allowed"
                                                : "border-border hover:border-accent hover:bg-accent/5 cursor-pointer"
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                            <Upload size={18} className="text-muted-foreground group-hover:text-accent transition-colors" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium text-accent">Haz clic</span> o arrastra imágenes aquí
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                                            multiple
                                            className="hidden"
                                            onChange={e => handleFiles(e.target.files)}
                                        />
                                    </div>

                                    {isEdit && existingImages.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Imágenes actuales</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {existingImages.map((img) => {
                                                    const imgId = img.evento_imagen_id
                                                    return (
                                                        <div key={imgId} className="relative group rounded-xl overflow-hidden border border-border bg-secondary">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={img.url_imagen}
                                                                alt={img.alt ?? "Imagen"}
                                                                className="w-full h-28 object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteExistingImage(img)}
                                                                className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                                aria-label="Eliminar imagen"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {images.length > 0 && (
                                        <div className="mt-4">
                                            {isEdit && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nuevas imágenes</p>}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {images.map((img, i) => (
                                                    <div key={i} className="relative group rounded-xl overflow-hidden border border-border bg-secondary">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={img.preview}
                                                            alt={img.alt || `Imagen ${i + 1}`}
                                                            className="w-full h-28 object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(i)}
                                                            className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                            aria-label="Eliminar imagen"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                        <div className="p-2">
                                                            <input
                                                                value={img.alt}
                                                                onChange={e => setImageAlt(i, e.target.value)}
                                                                placeholder="Texto alternativo"
                                                                className="w-full h-7 px-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!isEdit && images.length < MAX_IMAGES) || isEdit ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="flex flex-col items-center justify-center gap-1 h-28 rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-colors text-muted-foreground hover:text-accent"
                                                    >
                                                        <ImageIcon size={20} />
                                                        <span className="text-xs">Añadir más</span>
                                                    </button>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {error && (
                                    <p className="text-destructive text-sm text-center px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="h-9 px-5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-9 px-5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting && (
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                        </svg>
                                    )}
                                    {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear evento"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <Modal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false)
                    onSuccess?.()
                    onClose()
                }}
                type="success"
                title={isEdit ? "Evento actualizado!" : "¡Evento creado!"}
                message={isEdit ? "Los cambios fueron guardados exitosamente." : "El evento fue registrado exitosamente."}
                confirmText="Aceptar"
            />
        </>
    )
}
