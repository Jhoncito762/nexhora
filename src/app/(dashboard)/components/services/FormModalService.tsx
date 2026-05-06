"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, X } from "lucide-react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Modal from "@/src/app/shared/Modal"


interface FormData {
    nombre: string
    descripcion: string
    caracteristicas: string[]
    estado: boolean
}

export interface FormModalProductProps {
    isOpen: boolean
    servicioId?: number
    onClose: () => void
    onSuccess?: () => void
}


const emptyForm = (): FormData => ({
    nombre: "",
    descripcion: "",
    caracteristicas: [""],
    estado: true,
})

const inputClass =
    "w-full h-10 px-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"

const textareaClass =
    "w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"

const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"


export default function FormModalService({ isOpen, servicioId, onClose, onSuccess }: FormModalProductProps) {
    const isEdit = !!servicioId
    const [form, setForm] = useState<FormData>(emptyForm())
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
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
            setError(null)
            scrollRef.current?.scrollTo(0, 0)

            if (isEdit && servicioId) {
                setIsFetching(true)
                axiosPrivate
                    .get<Record<string, unknown>>(`${process.env.NEXT_PUBLIC_SERVICE}/${servicioId}`)
                    .then((res) => {
                        const d = (res.data.data ?? res.data) as Record<string, unknown>
                        setForm({
                            nombre: (d.nombre as string) ?? "",
                            descripcion: (d.descripcion as string) ?? "",
                            caracteristicas: (d.caracteristicas as { descripcion: string }[])?.length
                                ? (d.caracteristicas as { descripcion: string }[]).map(c => c.descripcion)
                                : [""],
                            estado: (d.estado as boolean) ?? true,
                        })
                    })
                    .catch(() => setError("No se pudo cargar el producto para editar."))
                    .finally(() => setIsFetching(false))
            } else {
                setForm(emptyForm())
            }
        }
    }, [isOpen, isEdit, servicioId])

    if (!isOpen) return null


    const setField = (field: keyof FormData, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }))

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



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const payload = {
                nombre: form.nombre,
                descripcion: form.descripcion,
                estado: form.estado,
                caracteristicas: form.caracteristicas.filter(c => c.trim()),
            }

            if (isEdit && servicioId) {
                await axiosPrivate.patch(
                    `${process.env.NEXT_PUBLIC_SERVICE}/${servicioId}`,
                    payload
                )
            } else {
                await axiosPrivate.post(
                    process.env.NEXT_PUBLIC_SERVICE!,
                    payload
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
                                                placeholder="Inteligencia Artificial"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Estado</label>
                                            <select
                                                value={form.estado ? "true" : "false"}
                                                onChange={e => setForm(prev => ({ ...prev, estado: e.target.value === "true" }))}
                                                className={inputClass}
                                            >
                                                <option value="true">Activo</option>
                                                <option value="false">Inactivo</option>
                                            </select>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Descripción *</label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={form.descripcion}
                                                onChange={e => setField("descripcion", e.target.value)}
                                                placeholder="Describe el servicio..."
                                                className={textareaClass}
                                            />
                                        </div>
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
                                    {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Guardar servicio"}
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
                title={isEdit ? "Servicio actualizado!" : "Servicio creado!"}
                message={isEdit ? "Los cambios fueron guardados exitosamente." : "El servicio fue registrado exitosamente."}
                confirmText="Aceptar"
            />
        </>
    )
}

