"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, X, Upload, ImageIcon } from "lucide-react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Icon from "@/src/app/shared/Icon"
import Modal from "@/src/app/shared/Modal"

const { Trash2Icon } = Icon


interface Modulo {
    nombre: string
    descripcion: string
}

interface ImageFile {
    file: File
    preview: string
    alt: string
}

interface ExistingImage {
    producto_imagen_id?: number
    producto_id?: number
    url_imagen: string
    alt?: string
}

interface FormData {
    nombre: string
    eslogan: string
    descripcion: string
    linkWeb: string
    modulos: Modulo[]
    caracteristicas: string[]
}

export interface FormModalProductProps {
    isOpen: boolean
    productoId?: number
    onClose: () => void
    onSuccess?: () => void
}


const emptyForm = (): FormData => ({
    nombre: "",
    eslogan: "",
    descripcion: "",
    linkWeb: "",
    modulos: [{ nombre: "", descripcion: "" }],
    caracteristicas: [""],
})

const inputClass =
    "w-full h-10 px-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"

const textareaClass =
    "w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"

const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"


export default function FormModalProduct({ isOpen, productoId, onClose, onSuccess }: FormModalProductProps) {
    const isEdit = !!productoId
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

            if (isEdit && productoId) {
                setIsFetching(true)
                axiosPrivate
                    .get<Record<string, unknown>>(`${process.env.NEXT_PUBLIC_GET_PRODUCTS}/${productoId}`)
                    .then((res) => {
                        const d = (res.data.data ?? res.data) as Record<string, unknown>
                        setForm({
                            nombre: (d.nombre as string) ?? "",
                            eslogan: (d.eslogan as string) ?? "",
                            descripcion: (d.descripcion as string) ?? "",
                            linkWeb: (d.link_web as string) ?? "",
                            modulos: (d.modulos as Modulo[])?.length
                                ? (d.modulos as Modulo[])
                                : [{ nombre: "", descripcion: "" }],
                            caracteristicas: (d.caracteristicas as { descripcion: string }[])?.length
                                ? (d.caracteristicas as { descripcion: string }[]).map(c => c.descripcion)
                                : [""],
                        })
                        setExistingImages((d.imagenes as ExistingImage[]) ?? [])
                    })
                    .catch(() => setError("No se pudo cargar el producto para editar."))
                    .finally(() => setIsFetching(false))
            } else {
                setForm(emptyForm())
            }
        }
    }, [isOpen, isEdit, productoId])

    if (!isOpen) return null


    const setField = (field: keyof FormData, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const setModulo = (index: number, key: keyof Modulo, value: string) =>
        setForm(prev => {
            const modulos = [...prev.modulos]
            modulos[index] = { ...modulos[index], [key]: value }
            return { ...prev, modulos }
        })

    const addModulo = () =>
        setForm(prev => ({ ...prev, modulos: [...prev.modulos, { nombre: "", descripcion: "" }] }))

    const removeModulo = (index: number) =>
        setForm(prev => ({ ...prev, modulos: prev.modulos.filter((_, i) => i !== index) }))

    const setCaracteristica = (index: number, value: string) =>
        setForm(prev => {
            const caracteristicas = [...prev.caracteristicas]
            caracteristicas[index] = value
            return { ...prev, caracteristicas }
        })

    const addCaracteristica = () =>
        setForm(prev => ({ ...prev, caracteristicas: [...prev.caracteristicas, ""] }))

    const removeCaracteristica = (index: number) =>
        setForm(prev => ({ ...prev, caracteristicas: prev.caracteristicas.filter((_, i) => i !== index) }))


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
        setImages(prev => [...prev, ...incoming])
    }

    const setImageAlt = (index: number, alt: string) =>
        setImages(prev => prev.map((img, i) => i === index ? { ...img, alt } : img))

    const removeImage = (index: number) =>
        setImages(prev => {
            URL.revokeObjectURL(prev[index].preview)
            return prev.filter((_, i) => i !== index)
        })

    const deleteExistingImage = async (img: ExistingImage) => {
        const imgId = img.producto_imagen_id
        if (!imgId) return
        try {
            await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_PRODUCT_IMAGES}/${imgId}`)
            setExistingImages(prev => prev.filter(i => (i.producto_imagen_id) !== imgId))
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

        try {
            const payload = {
                ...form,
                modulos: form.modulos.filter(m => m.nombre.trim()),
                caracteristicas: form.caracteristicas.filter(c => c.trim()),
            }

            let targetId: number

            if (isEdit && productoId) {
                // Update existing product
                await axiosPrivate.patch(
                    `${process.env.NEXT_PUBLIC_GET_PRODUCTS}/${productoId}`,
                    payload
                )
                targetId = productoId
            } else {
                // Create new product
                const response = await axiosPrivate.post<Record<string, unknown>>(
                    process.env.NEXT_PUBLIC_GET_PRODUCTS!,
                    payload
                )
                const responseData = response.data
                targetId = ((responseData.producto_id ?? (responseData.data as Record<string, unknown>)?.producto_id)) as number
            }

            // Upload new images
            for (const img of images) {
                const formData = new globalThis.FormData()
                formData.append("imagen", img.file)
                if (img.alt.trim()) formData.append("alt", img.alt.trim())

                await axiosPrivate.post(
                    `${process.env.NEXT_PUBLIC_GET_PRODUCTS}/${targetId}/imagenes`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                )
            }

            setShowSuccess(true)
        } catch {
            setError("Ocurrió un error al guardar el producto. Intenta de nuevo.")
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
                                {isEdit ? "Editar Producto" : "Nuevo Producto"}
                            </h2>
                            <p className="text-muted-foreground text-xs mt-0.5">
                                {isEdit
                                    ? "Modifica la información del producto."
                                    : "Completa la información del producto a registrar."}
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
                                            <label className={labelClass}>Nombre *</label>
                                            <input
                                                required
                                                value={form.nombre}
                                                onChange={e => setField("nombre", e.target.value)}
                                                placeholder="Ej: CanchitasCO"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Link Web</label>
                                            <input
                                                type="url"
                                                value={form.linkWeb}
                                                onChange={e => setField("linkWeb", e.target.value)}
                                                placeholder="https://ejemplo.com"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Eslogan</label>
                                            <input
                                                value={form.eslogan}
                                                onChange={e => setField("eslogan", e.target.value)}
                                                placeholder="Ej: Excelencia Deportiva Al Alcance de tu Mano"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Descripción *</label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={form.descripcion}
                                                onChange={e => setField("descripcion", e.target.value)}
                                                placeholder="Describe el producto..."
                                                className={textareaClass}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-foreground font-semibold text-sm mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                                        Módulos
                                    </h3>
                                    <div className="space-y-3">
                                        {form.modulos.map((mod, i) => (
                                            <div key={i} className="flex gap-3 items-start p-3.5 rounded-xl bg-secondary border border-border">
                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className={labelClass}>Nombre</label>
                                                        <input
                                                            value={mod.nombre}
                                                            onChange={e => setModulo(i, "nombre", e.target.value)}
                                                            placeholder="Módulo 1"
                                                            className={inputClass}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Descripción</label>
                                                        <input
                                                            value={mod.descripcion}
                                                            onChange={e => setModulo(i, "descripcion", e.target.value)}
                                                            placeholder="Descripción del módulo"
                                                            className={inputClass}
                                                        />
                                                    </div>
                                                </div>
                                                {form.modulos.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeModulo(i)}
                                                        className="mt-6 w-8 h-8 flex items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                                                        aria-label="Eliminar módulo"
                                                    >
                                                        <Trash2Icon size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addModulo}
                                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-accent hover:bg-accent/5 transition-colors text-sm"
                                        >
                                            <Plus size={15} />
                                            Agregar módulo
                                        </button>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-foreground font-semibold text-sm mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                                        Características
                                    </h3>
                                    <div className="space-y-2">
                                        {form.caracteristicas.map((car, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input
                                                    value={car}
                                                    onChange={e => setCaracteristica(i, e.target.value)}
                                                    placeholder={`Característica ${i + 1}`}
                                                    className={inputClass}
                                                />
                                                {form.caracteristicas.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCaracteristica(i)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                                                        aria-label="Eliminar característica"
                                                    >
                                                        <X size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addCaracteristica}
                                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-accent hover:bg-accent/5 transition-colors text-sm"
                                        >
                                            <Plus size={15} />
                                            Agregar característica
                                        </button>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-foreground font-semibold text-sm mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
                                        Imágenes
                                        <span className="text-muted-foreground font-normal normal-case tracking-normal">
                                            (jpeg, png, webp, gif, avif — máx 5 MB)
                                        </span>
                                    </h3>

                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={e => e.preventDefault()}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group"
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
                                                    const imgId = img.producto_imagen_id
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
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex flex-col items-center justify-center gap-1 h-28 rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-colors text-muted-foreground hover:text-accent"
                                                >
                                                    <ImageIcon size={20} />
                                                    <span className="text-xs">Añadir más</span>
                                                </button>
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
                                    {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Guardar producto"}
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
                title={isEdit ? "¡Producto actualizado!" : "¡Producto creado!"}
                message={isEdit ? "Los cambios fueron guardados exitosamente." : "El producto fue registrado exitosamente."}
                confirmText="Aceptar"
            />
        </>
    )
}

