"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { StepIndicator } from "../../components/StepIndicator"
import { useStepper } from "@/src/hooks/useStepper"
import Icon from "@/src/app/shared/Icon"
import axiosPublic from "@/src/apis/axiosPublic"

const {
    MailIcon,
    ShieldCheckIcon,
    LockIcon,
    CheckCircle2Icon,
    EyeIcon,
    EyeOff,
    ArrowRightIcon,
    ArrowLeftIcon,
    Loader2Icon
} = Icon;

export default function page() {

    const { step, next, goTo } = useStepper()

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await axiosPublic.post(
                process.env.NEXT_PUBLIC_REQUEST_RECOVER_CODE!,
                { email }
            )
            next()
        } catch (err: any) {
            const msg = err?.response?.data?.error
            setError(msg ?? "No fue posible enviar el código de recuperación. Inténtalo de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        if (code.length !== 6) { setError("El código debe tener 6 dígitos."); return }
        setLoading(true)
        setError(null)

        try {
            await axiosPublic.post(
                process.env.NEXT_PUBLIC_VERIFY_RECOVER_CODE!,
                { codigo: code }
            )
            next()
        } catch (err: any) {
            const msg = err?.response?.data?.error
            setError(msg ?? "Código inválido o expirado. Inténtalo de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return }
        if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return }
        setLoading(true)
        setError(null)

        try {
            await axiosPublic.post(
                process.env.NEXT_PUBLIC_RESET_PASSWORD!,
                { codigo: code, newPassword: password }
            )
            next()
        } catch (err: any) {
            const msg = err?.response?.data?.error
            setError(msg ?? "No fue posible restablecer la contraseña. Inténtalo de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    const inputClass =
        "w-full h-12 px-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"

    const btnPrimary =
        "w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    return (
        <main className="min-h-screen flex bg-background">
            <div className="hidden lg:flex relative w-[52%] flex-col overflow-hidden">
                <Image
                    src="/login-ilustration.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    priority
                    aria-hidden="true"
                />

                <div className="absolute inset-0 bg-primary/80" aria-hidden="true" />

                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                    aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col justify-between h-full px-14 py-12">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
                            <Image
                                src="/LogoWebp.webp"
                                alt="Nexhora"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-white font-bold tracking-wide text-xl">Nexhora SAS</span>
                    </div>

                    <div className="space-y-5">
                        <span className="inline-flex items-center gap-2 text-white/50 text-xs font-medium tracking-widest uppercase">
                            <span className="w-6 h-px bg-white/30 inline-block" aria-hidden="true" />
                            Portal interno
                        </span>
                        <h1 className="text-white text-5xl font-bold leading-tight text-balance">
                            Tecnología<br />con propósito
                        </h1>
                        <p className="text-white/55 text-sm leading-relaxed max-w-[320px]">
                            Accede al panel de gestión de Nexhora. Consultoría, IA responsable y desarrollo tecnológico alineado con los ODS.
                        </p>
                    </div>

                    <p className="text-white/25 text-xs">
                        &copy; {new Date().getFullYear()} Nexhora SAS. Todos los derechos reservados.
                    </p>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-95">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2.5 mb-10 lg:hidden">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                            <Image src="/LogoWebp.webp" alt="Nexhora" width={22} height={22} className="object-contain" />
                        </div>
                        <span className="text-primary font-bold text-lg">Nexhora SAS</span>
                    </div>


                    <div className="flex justify-center items-center">

                        {step !== 4 && <StepIndicator current={step} />}
                    </div>

                    {/* ── STEP 1: Email ── */}
                    {step === 1 && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <MailIcon size={20} strokeWidth={1.8} aria-hidden="true" />
                                </div>
                                <div>
                                    <h1 className="text-foreground text-xl font-bold leading-tight">Ingresa tu correo</h1>
                                    <p className="text-muted-foreground text-xs mt-0.5">Te enviaremos un código de 6 dígitos.</p>
                                </div>
                            </div>

                            <form onSubmit={handleRequestCode} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="text-foreground text-sm font-medium">
                                        Correo electrónico
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@nexhora.com"
                                        className={inputClass}
                                    />
                                </div>

                                {error && <p className="text-destructive text-center text-xs">{error}</p>}

                                <div className="pt-1" />
                                <button type="submit" disabled={loading} className={btnPrimary}>
                                    {loading
                                        ? <><Loader2Icon size={16} className="animate-spin" /> Enviando...</>
                                        : <>Enviar código <ArrowRightIcon size={15} strokeWidth={2.5} /></>
                                    }
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ── STEP 2: Verify code ── */}
                    {step === 2 && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <ShieldCheckIcon size={20} strokeWidth={1.8} aria-hidden="true" />
                                </div>
                                <div>
                                    <h1 className="text-foreground text-xl font-bold leading-tight">Verifica tu código</h1>
                                    <p className="text-muted-foreground text-xs mt-0.5">
                                        Enviamos un código a <span className="font-medium text-foreground">{email}</span>
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleVerifyCode} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="code" className="text-foreground text-sm font-medium">
                                        Código de verificación
                                    </label>
                                    <input
                                        id="code"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        required
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        placeholder="000000"
                                        className={[inputClass, "text-center tracking-[0.5em] text-xl font-bold"].join(" ")}
                                    />
                                    <p className="text-muted-foreground text-xs text-center">
                                        ¿No lo recibiste?{" "}
                                        <button
                                            type="button"
                                            className="text-accent hover:underline underline-offset-2"
                                            onClick={() => goTo(1)}
                                        >
                                            Reenviar
                                        </button>
                                    </p>
                                </div>

                                {error && <p className="text-destructive text-xs">{error}</p>}

                                <div className="pt-1" />
                                <button type="submit" disabled={loading} className={btnPrimary}>
                                    {loading
                                        ? <><Loader2Icon size={16} className="animate-spin" /> Verificando...</>
                                        : <>Verificar código <ArrowRightIcon size={15} strokeWidth={2.5} /></>
                                    }
                                </button>
                            </form>

                            <button
                                onClick={() => { goTo(1); setError(null) }}
                                className="mt-4 w-full text-center text-muted-foreground text-xs hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
                            >
                                <ArrowLeftIcon size={12} /> Cambiar correo
                            </button>
                        </div>
                    )}

                    {/* ── STEP 3: New password ── */}
                    {step === 3 && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <LockIcon size={20} strokeWidth={1.8} aria-hidden="true" />
                                </div>
                                <div>
                                    <h1 className="text-foreground text-xl font-bold leading-tight">Nueva contraseña</h1>
                                    <p className="text-muted-foreground text-xs mt-0.5">Elige una contraseña segura.</p>
                                </div>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="password" className="text-foreground text-sm font-medium">
                                        Nueva contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mínimo 8 caracteres"
                                            className={[inputClass, "pr-11"].join(" ")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label={showPassword ? "Ocultar" : "Mostrar"}
                                        >
                                            {showPassword
                                                ? <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                                                : <EyeIcon size={16} strokeWidth={2} aria-hidden="true" />
                                            }
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="confirmPassword" className="text-foreground text-sm font-medium">
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirm ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repite la contraseña"
                                            className={[
                                                inputClass,
                                                "pr-11",
                                                confirmPassword && password !== confirmPassword
                                                    ? "border-destructive focus:ring-destructive/20"
                                                    : "",
                                            ].join(" ")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label={showConfirm ? "Ocultar" : "Mostrar"}
                                        >
                                            {showConfirm
                                                ? <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                                                : <EyeIcon size={16} strokeWidth={2} aria-hidden="true" />
                                            }
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-destructive text-xs">Las contraseñas no coinciden.</p>
                                    )}
                                </div>

                                {/* Password strength */}
                                {password.length > 0 && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={[
                                                        "h-1 flex-1 rounded-full transition-all duration-300",
                                                        password.length >= i * 3
                                                            ? password.length >= 12 ? "bg-green-500"
                                                                : password.length >= 8 ? "bg-accent"
                                                                    : "bg-yellow-400"
                                                            : "bg-border",
                                                    ].join(" ")}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground text-[10px]">
                                            {password.length < 6 ? "Muy corta" : password.length < 8 ? "Débil" : password.length < 12 ? "Aceptable" : "Fuerte"}
                                        </p>
                                    </div>
                                )}

                                {error && <p className="text-destructive text-xs">{error}</p>}

                                <div className="pt-1" />
                                <button type="submit" disabled={loading} className={btnPrimary}>
                                    {loading
                                        ? <><Loader2Icon size={16} className="animate-spin" /> Guardando...</>
                                        : <>Guardar contraseña <ArrowRightIcon size={15} strokeWidth={2.5} /></>
                                    }
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ── STEP 4: Success ── */}
                    {step === 4 && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2Icon size={28} strokeWidth={2} aria-hidden="true" />
                            </div>
                            <h1 className="text-foreground text-2xl font-bold">Contraseña actualizada</h1>
                            <p className="text-muted-foreground text-sm mt-2 leading-relaxed max-w-70 mx-auto">
                                Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
                            </p>
                            <Link
                                href="/login"
                                className="mt-8 inline-flex items-center gap-2 w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all justify-center"
                            >
                                Ir al inicio de sesión <ArrowRightIcon size={15} strokeWidth={2.5} />
                            </Link>
                        </div>
                    )}

                    {/* Back to login */}
                    {step !== 4 && (
                        <div className="mt-8 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 text-muted-foreground text-xs hover:text-foreground transition-colors"
                            >
                                <ArrowLeftIcon size={12} /> Volver al inicio de sesión
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </main>
    )
}
