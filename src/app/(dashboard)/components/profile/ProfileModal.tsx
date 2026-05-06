"use client"

import { useEffect, useRef, useState } from "react"
import { X, User, Lock, Eye, EyeOff, Pencil } from "lucide-react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Modal from "@/src/app/shared/Modal"
import { useAuthStore } from "@/src/hooks/authStore"

interface ProfileForm {
    nombre_completo: string
    correo: string
    telefono: string
}


export interface ProfileModalProps {
    isOpen: boolean
    userId: number
    onClose: () => void
    onSuccess?: () => void
}

const inputClass =
    "w-full h-10 px-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"

const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"

export default function ProfileModal({ isOpen, userId, onClose, onSuccess }: ProfileModalProps) {
    const { setProfileData } = useAuthStore()
    const [form, setForm] = useState<ProfileForm>({ nombre_completo: "", correo: "", telefono: "" })
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [isFetching, setIsFetching] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    // Password change
    const [pwOpen, setPwOpen] = useState(false)
    const [pwForm, setPwForm] = useState({ password: "", confirm: "" })
    const [showPw, setShowPw] = useState(false)
    const [pwError, setPwError] = useState<string | null>(null)
    const [isChangingPw, setIsChangingPw] = useState(false)
    const [showPwSuccess, setShowPwSuccess] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)
    const photoInputRef = useRef<HTMLInputElement>(null)

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
        if (!isOpen || !userId) return
        setError(null)
        setPwForm({ password: "", confirm: "" })
        setPwOpen(false)
        setPhotoFile(null)
        setPhotoPreview(null)
        scrollRef.current?.scrollTo(0, 0)
        setIsFetching(true)
        axiosPrivate
            .get<Record<string, unknown>>(`${process.env.NEXT_PUBLIC_GET_USERS}/${userId}`)
            .then((res) => {
                const d = (res.data.data ?? res.data) as Record<string, unknown>
                setForm({
                    nombre_completo: (d.nombre_completo as string) ?? "",
                    correo: (d.correo as string) ?? "",
                    telefono: (d.telefono as string) ?? "",
                })
                if (d.foto_link) setPhotoPreview(d.foto_link as string)
            })
            .catch(() => setError("No se pudo cargar el perfil."))
            .finally(() => setIsFetching(false))
    }, [isOpen, userId])

    if (!isOpen) return null

    const setField = (field: keyof ProfileForm, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setPhotoFile(file)
        setPhotoPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)
        try {
            const fd = new globalThis.FormData()
            fd.append("nombre_completo", form.nombre_completo)
            fd.append("correo", form.correo)
            if (form.telefono) fd.append("telefono", form.telefono)
            if (photoFile) fd.append("foto", photoFile)

            await axiosPrivate.patch(
                `${process.env.NEXT_PUBLIC_GET_USERS}/me`,
                fd,
                { headers: { "Content-Type": "multipart/form-data" } }
            )

            // Actualiza el store directamente — sin depender del token
            setProfileData({
                nombre: form.nombre_completo,
                correo: form.correo,
                ...(photoPreview ? { foto: photoPreview } : {}),
            })

            setShowSuccess(true)
        } catch {
            setError("No se pudo actualizar el perfil. Intenta de nuevo.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPwError(null)
        if (pwForm.password.length < 6) {
            setPwError("La contraseña debe tener al menos 6 caracteres.")
            return
        }
        if (pwForm.password !== pwForm.confirm) {
            setPwError("Las contraseñas no coinciden.")
            return
        }
        setIsChangingPw(true)
        try {
            await axiosPrivate.patch(
                `${process.env.NEXT_PUBLIC_GET_USERS}/${userId}/password`,
                { newPassword: pwForm.password }
            )
            setShowPwSuccess(true)
            setPwForm({ password: "", confirm: "" })
            setPwOpen(false)
        } catch {
            setPwError("No se pudo cambiar la contraseña. Intenta de nuevo.")
        } finally {
            setIsChangingPw(false)
        }
    }

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            >
                <div
                    className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                        <div>
                            <h2 className="text-foreground font-bold text-lg">Mi perfil</h2>
                            <p className="text-muted-foreground text-xs mt-0.5">Actualiza tu información personal</p>
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
                        <>
                            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                                {/* Avatar upload */}
                                <div className="flex justify-center">
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center overflow-hidden border-4 border-secondary shadow-md">
                                            {photoPreview ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={photoPreview}
                                                    alt="Foto de perfil"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User size={32} className="text-primary-foreground" />
                                            )}
                                        </div>
                                        {/* Pencil overlay */}
                                        <button
                                            type="button"
                                            onClick={() => photoInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-card flex items-center justify-center shadow-md hover:bg-accent transition-colors"
                                            aria-label="Cambiar foto de perfil"
                                        >
                                            <Pencil size={12} className="text-primary-foreground" />
                                        </button>
                                        <input
                                            ref={photoInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/avif"
                                            className="hidden"
                                            onChange={handlePhotoSelect}
                                        />
                                    </div>
                                </div>

                                {/* Profile form */}
                                <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Nombre completo *</label>
                                            <input
                                                required
                                                value={form.nombre_completo}
                                                onChange={e => setField("nombre_completo", e.target.value)}
                                                placeholder="Juan Pérez"
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
                                                placeholder="juan@nexhora.com"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Teléfono</label>
                                            <input
                                                value={form.telefono}
                                                onChange={e => setField("telefono", e.target.value)}
                                                placeholder="+57 300 000 0000"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-destructive text-sm text-center px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
                                            {error}
                                        </p>
                                    )}
                                </form>

                                {/* Password change accordion */}
                                <div className="border border-border rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setPwOpen(v => !v)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Lock size={15} className="text-muted-foreground" />
                                            Cambiar contraseña
                                        </span>
                                        <svg
                                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${pwOpen ? "rotate-180" : ""}`}
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        >
                                            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    {pwOpen && (
                                        <form onSubmit={handlePasswordChange} className="px-4 pb-4 pt-3 border-t border-border space-y-3">
                                            <div>
                                                <label className={labelClass}>Nueva contraseña *</label>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        type={showPw ? "text" : "password"}
                                                        value={pwForm.password}
                                                        onChange={e => setPwForm(prev => ({ ...prev, password: e.target.value }))}
                                                        placeholder="Mínimo 6 caracteres"
                                                        className={inputClass + " pr-10"}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPw(v => !v)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                        tabIndex={-1}
                                                    >
                                                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelClass}>Confirmar contraseña *</label>
                                                <input
                                                    required
                                                    type="password"
                                                    value={pwForm.confirm}
                                                    onChange={e => setPwForm(prev => ({ ...prev, confirm: e.target.value }))}
                                                    placeholder="Repite la contraseña"
                                                    className={inputClass}
                                                />
                                            </div>

                                            {pwError && (
                                                <p className="text-destructive text-sm px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
                                                    {pwError}
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isChangingPw}
                                                className="h-9 px-5 rounded-xl bg-secondary text-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isChangingPw && (
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                                    </svg>
                                                )}
                                                {isChangingPw ? "Guardando..." : "Actualizar contraseña"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
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
                                    form="profile-form"
                                    disabled={isSubmitting}
                                    className="h-9 px-5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting && (
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                        </svg>
                                    )}
                                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                                </button>
                            </div>
                        </>
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
                title="¡Perfil actualizado!"
                message="Tus datos fueron actualizados exitosamente."
                confirmText="Aceptar"
            />

            <Modal
                isOpen={showPwSuccess}
                onClose={() => setShowPwSuccess(false)}
                type="success"
                title="¡Contraseña actualizada!"
                message="Tu contraseña fue cambiada exitosamente."
                confirmText="Aceptar"
            />
        </>
    )
}
