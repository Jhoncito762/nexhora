"use client"

import React, { useEffect, useRef, useState } from "react"
import { X, Upload, UserCircle } from "lucide-react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Modal from "@/src/app/shared/Modal"

interface Rol {
    rol_id: number
    nombre: string
}

interface FormData {
    nombre_completo: string
    correo: string
    telefono: string
    password: string
    foto_link: string
    estado: boolean
    rol_id: number
}

export interface FormModalUserProps {
    isOpen: boolean
    userId?: number
    onClose: () => void
    onSuccess?: () => void
}

const emptyForm = (): FormData => ({
    nombre_completo: "",
    correo: "",
    telefono: "",
    password: "",
    foto_link: "",
    estado: true,
    rol_id: 1,
})

const inputClass =
    "w-full h-10 px-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"

const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"

export default function FormModalUser({ isOpen, userId, onClose, onSuccess }: FormModalUserProps) {
    const isEdit = !!userId
    const [form, setForm] = useState<FormData>(emptyForm())
    const [roles, setRoles] = useState<Rol[]>([])
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const photoInputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Fetch roles for select (once)
    useEffect(() => {
        axiosPrivate
            .get<{ total: number; roles: Rol[] }>(process.env.NEXT_PUBLIC_GET_ROLES!)
            .then((res) => {
                const list = res.data.roles ?? []
                setRoles(list)
                if (!isEdit && list.length > 0) {
                    setForm(prev => ({ ...prev, rol_id: list[0].rol_id }))
                }
            })
            .catch(() => { })
    }, [isEdit])

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
        if (!isOpen) return
        setError(null)
        setPhotoFile(null)
        setPhotoPreview(null)
        scrollRef.current?.scrollTo(0, 0)

        if (isEdit && userId) {
            setIsFetching(true)
            axiosPrivate
                .get<Record<string, unknown>>(`${process.env.NEXT_PUBLIC_GET_USERS}/${userId}`)
                .then((res) => {
                    const d = (res.data.data ?? res.data) as Record<string, unknown>
                    setForm({
                        nombre_completo: (d.nombre_completo as string) ?? "",
                        correo: (d.correo as string) ?? "",
                        telefono: (d.telefono as string) ?? "",
                        password: "",
                        foto_link: (d.foto_link as string) ?? "",
                        estado: (d.estado as boolean) ?? true,
                        rol_id: (d.rol_id as number),
                    })
                    if (d.foto_link) setPhotoPreview(d.foto_link as string)
                })
                .catch(() => setError("No se pudo cargar el usuario para editar."))
                .finally(() => setIsFetching(false))
        } else {
            setForm({ ...emptyForm(), rol_id: roles[0]?.rol_id ?? 0 })
        }
    }, [isOpen, isEdit, userId])

    if (!isOpen) return null

    const setField = <K extends keyof FormData>(field: K, value: FormData[K]) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const handlePhotoFile = (file: File | null) => {
        if (!file) return
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
        if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) return
        if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview)
        setPhotoFile(file)
        setPhotoPreview(URL.createObjectURL(file))
    }

    const removePhoto = () => {
        if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview)
        setPhotoFile(null)
        setPhotoPreview(null)
        setField("foto_link", "")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const payload: Record<string, unknown> = {
                nombre_completo: form.nombre_completo,
                correo: form.correo,
                telefono: form.telefono,
                estado: form.estado,
                rol_id: Number(form.rol_id),
            }
            if (!isEdit && form.password) payload.password = form.password

            let targetId: number

            if (isEdit && userId) {
                await axiosPrivate.patch(`${process.env.NEXT_PUBLIC_GET_USERS}/${userId}`, payload)
                targetId = userId
            } else {
                const res = await axiosPrivate.post<Record<string, unknown>>(
                    process.env.NEXT_PUBLIC_GET_USERS!,
                    payload
                )
                const rd = res.data
                targetId = ((rd.usuario_id ?? rd.userId ?? (rd.data as Record<string, unknown>)?.usuario_id)) as number
            }

            // Upload photo separately if a new file was selected
            if (photoFile && targetId) {
                const fd = new globalThis.FormData()
                fd.append("foto", photoFile)
                await axiosPrivate.patch(
                    `${process.env.NEXT_PUBLIC_GET_USERS}/${targetId}`,
                    fd,
                    { headers: { "Content-Type": "multipart/form-data" } }
                )
            }

            setShowSuccess(true)
        } catch {
            setError("Ocurrió un error al guardar el usuario. Intenta de nuevo.")
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
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                        <div>
                            <h2 className="text-foreground font-bold text-lg">
                                {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
                            </h2>
                            <p className="text-muted-foreground text-xs mt-0.5">
                                {isEdit
                                    ? "Modifica la información del usuario."
                                    : "Completa la información del usuario a registrar."}
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

                                {/* ── Sección 1: Foto ── */}
                                <section>
                                    <h3 className="text-foreground font-semibold text-sm mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                                        Foto de perfil
                                        <span className="text-muted-foreground font-normal normal-case tracking-normal">(jpeg, png, webp — máx 5 MB)</span>
                                    </h3>
                                    <div className="flex items-start gap-4">
                                        {/* Preview */}
                                        <div className="relative shrink-0">
                                            {photoPreview ? (
                                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border group">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={photoPreview} alt="Foto de perfil" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={removePhoto}
                                                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                                        aria-label="Quitar foto"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 rounded-full border-2 border-dashed border-border bg-secondary flex items-center justify-center text-muted-foreground">
                                                    <UserCircle size={40} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Upload zone */}
                                        <div
                                            onDrop={e => { e.preventDefault(); handlePhotoFile(e.dataTransfer.files?.[0] ?? null) }}
                                            onDragOver={e => e.preventDefault()}
                                            onClick={() => photoInputRef.current?.click()}
                                            className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                                <Upload size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                                            </div>
                                            <p className="text-sm text-muted-foreground text-center">
                                                <span className="font-medium text-accent">Haz clic</span> o arrastra una foto aquí
                                            </p>
                                            <input
                                                ref={photoInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                                                className="hidden"
                                                onChange={e => handlePhotoFile(e.target.files?.[0] ?? null)}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* ── Sección 2: Información básica ── */}
                                <section>
                                    <h3 className="text-foreground font-semibold text-sm mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                                        Información básica
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Nombre completo *</label>
                                            <input
                                                required
                                                value={form.nombre_completo}
                                                onChange={e => setField("nombre_completo", e.target.value)}
                                                placeholder="Pepito Pérez"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Correo *</label>
                                            <input
                                                required
                                                type="email"
                                                value={form.correo}
                                                onChange={e => setField("correo", e.target.value)}
                                                placeholder="pepito@nexhora.co"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Teléfono</label>
                                            <input
                                                value={form.telefono}
                                                onChange={e => setField("telefono", e.target.value)}
                                                placeholder="3103450974"
                                                className={inputClass}
                                            />
                                        </div>
                                        {!isEdit && (
                                            <div className="sm:col-span-2">
                                                <label className={labelClass}>Contraseña *</label>
                                                <input
                                                    required={!isEdit}
                                                    type="password"
                                                    value={form.password}
                                                    onChange={e => setField("password", e.target.value)}
                                                    placeholder="Mínimo 8 caracteres"
                                                    className={inputClass}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* ── Sección 3: Rol y estado ── */}
                                <section>
                                    <h3 className="text-foreground font-semibold text-sm mb-4 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                                        Rol y estado
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Rol *</label>
                                            <select
                                                required
                                                value={form.rol_id}
                                                onChange={e => setField("rol_id", Number(e.target.value) as unknown as FormData["rol_id"])}
                                                className={inputClass}
                                            >
                                                {roles.map(r => (
                                                    <option key={r.rol_id} value={r.rol_id}>
                                                        {r.nombre.charAt(0).toUpperCase() + r.nombre.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col justify-end pb-0.5">
                                            <label className={labelClass}>Estado</label>
                                            <button
                                                type="button"
                                                onClick={() => setField("estado", !form.estado as unknown as FormData["estado"])}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.estado ? "bg-primary" : "bg-border"}`}
                                                role="switch"
                                                aria-checked={form.estado}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.estado ? "translate-x-6" : "translate-x-1"}`}
                                                />
                                            </button>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {form.estado ? "Activo" : "Inactivo"}
                                            </span>
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
                                    {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Guardar usuario"}
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
                title={isEdit ? "¡Usuario actualizado!" : "¡Usuario creado!"}
                message={isEdit ? "Los cambios fueron guardados exitosamente." : "El usuario fue registrado exitosamente."}
                confirmText="Aceptar"
            />
        </>
    )
}


interface FormData {
    nombre_completo: string
    correo: string
    telefono: string
    foto_link: string
    rol_id: number
}

