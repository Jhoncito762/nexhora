"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Modal from "@/src/app/shared/Modal"

export interface FormModalRolProps {
    isOpen: boolean
    rolId?: number
    onClose: () => void
    onSuccess?: () => void
}

const inputClass =
    "w-full h-10 px-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"

const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"

export default function FormModalRol({ isOpen, rolId, onClose, onSuccess }: FormModalRolProps) {
    const isEdit = !!rolId
    const [nombre, setNombre] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

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
        if (!isOpen) return
        setError(null)

        if (isEdit && rolId) {
            setIsFetching(true)
            axiosPrivate
                .get<{ rol_id: number; nombre: string } | { data: { rol_id: number; nombre: string } }>(
                    `${process.env.NEXT_PUBLIC_GET_ROLES}/${rolId}`
                )
                .then((res) => {
                    const d = (res.data as Record<string, unknown>).data
                        ? (res.data as { data: { nombre: string } }).data
                        : (res.data as { nombre: string })
                    setNombre(d.nombre ?? "")
                })
                .catch(() => setError("No se pudo cargar el rol para editar."))
                .finally(() => {
                    setIsFetching(false)
                    setTimeout(() => inputRef.current?.focus(), 50)
                })
        } else {
            setNombre("")
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen, isEdit, rolId])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) return
        setError(null)
        setIsSubmitting(true)

        try {
            if (isEdit && rolId) {
                await axiosPrivate.patch(
                    `${process.env.NEXT_PUBLIC_GET_ROLES}/${rolId}`,
                    { nombre: nombre.trim() }
                )
            } else {
                await axiosPrivate.post(
                    process.env.NEXT_PUBLIC_GET_ROLES!,
                    { nombre: nombre.trim() }
                )
            }
            setShowSuccess(true)
        } catch {
            setError("Ocurrió un error al guardar el rol. Intenta de nuevo.")
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
                    className="relative w-full max-w-sm bg-card rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div>
                            <h2 className="text-foreground font-bold text-lg">
                                {isEdit ? "Editar Rol" : "Nuevo Rol"}
                            </h2>
                            <p className="text-muted-foreground text-xs mt-0.5">
                                {isEdit ? "Modifica el nombre del rol." : "Ingresa el nombre del nuevo rol."}
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
                        <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                            <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Cargando...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                            <div>
                                <label className={labelClass}>Nombre *</label>
                                <input
                                    ref={inputRef}
                                    required
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    placeholder="Ej: administrador"
                                    className={inputClass}
                                />
                            </div>

                            {error && (
                                <p className="text-destructive text-sm text-center px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
                                    {error}
                                </p>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-1">
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
                                    {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Guardar rol"}
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
                title={isEdit ? "¡Rol actualizado!" : "¡Rol creado!"}
                message={isEdit ? "Los cambios fueron guardados exitosamente." : "El rol fue registrado exitosamente."}
                confirmText="Aceptar"
            />
        </>
    )
}
