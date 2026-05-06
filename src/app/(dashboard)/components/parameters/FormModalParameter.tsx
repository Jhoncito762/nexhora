"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Modal from "@/src/app/shared/Modal"

interface FormData {
    clave: string
    valor: string
    descripcion: string
}

export interface FormModalParameterProps {
    isOpen: boolean
    parametroId?: number
    onClose: () => void
    onSuccess?: () => void
}


const emptyForm = (): FormData => ({
    clave: "",
    valor: "",
    descripcion: "",
})

const inputClass =
    "w-full h-10 px-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"

const textareaClass =
    "w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"

const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"

export default function FormModalParameter({ isOpen, parametroId, onClose, onSuccess }: FormModalParameterProps) {
    const isEdit = !!parametroId
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

            if (isEdit && parametroId) {
                setIsFetching(true)
                axiosPrivate
                    .get<Record<string, unknown>>(`${process.env.NEXT_PUBLIC_PARAMETERS}/${parametroId}`)
                    .then((res) => {
                        const d = (res.data.data ?? res.data) as Record<string, unknown>
                        setForm({
                            clave: (d.clave as string) ?? "",
                            valor: (d.valor as string) ?? "",
                            descripcion: (d.descripcion as string) ?? "",
                        })
                    })
                    .catch(() => setError("No se pudo cargar el parámetro para editar."))
                    .finally(() => setIsFetching(false))
            } else {
                setForm(emptyForm())
            }
        }
    }, [isOpen, isEdit, parametroId])

    if (!isOpen) return null


    const setField = (field: keyof FormData, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const payload = { ...form }

            if (isEdit && parametroId) {
                await axiosPrivate.patch(
                    `${process.env.NEXT_PUBLIC_PARAMETERS}/${parametroId}`,
                    payload
                )
            } else {
                await axiosPrivate.post(
                    process.env.NEXT_PUBLIC_PARAMETERS!,
                    payload
                )
            }

            setShowSuccess(true)
        } catch {
            setError("Ocurrió un error al guardar el parámetro. Intenta de nuevo.")
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
                                {isEdit ? "Editar parámetro" : "Nuevo parámetro"}
                            </h2>
                            <p className="text-muted-foreground text-xs mt-0.5">
                                {isEdit
                                    ? "Modifica la información del parámetro."
                                    : "Completa la información del parámetro a registrar."}
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
                                            <label className={labelClass}>Clave *</label>
                                            <input
                                                required
                                                value={form.clave}
                                                onChange={e => setField("clave", e.target.value)}
                                                placeholder="Titulo"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Valor</label>
                                            <input
                                                value={form.valor}
                                                onChange={e => setField("valor", e.target.value)}
                                                placeholder="Nexhora SAS"
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
                                                placeholder="Describe el parámetro..."
                                                className={textareaClass}
                                            />
                                        </div>
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
                                    {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Guardar parámetro"}
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
                title={isEdit ? "¡Parámetro actualizado!" : "¡Parámetro creado!"}
                message={isEdit ? "Los cambios fueron guardados exitosamente." : "El parámetro fue registrado exitosamente."}
                confirmText="Aceptar"
            />
        </>
    )
}
