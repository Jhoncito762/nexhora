"use client"

import Image from "next/image"
import Link from "next/link"
import Icon from "../../shared/Icon"
import axiosPublic from "@/src/apis/axiosPublic"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/hooks/authStore"

const { EyeIcon, EyeClosed, ArrowRight, ArrowLeft } = Icon;


export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const setTokens = useAuthStore((state) => state.setTokens)

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember_me: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPublic.post(
                process.env.NEXT_PUBLIC_LOGIN_AUTH!, formData
            )

            const { token, refreshToken } = response.data.data;
            setTokens(token, refreshToken)
            router.push("/dashboard")
        } catch (err) {
            console.error("Error al iniciar sesión:", err)
            setError("Credenciales inválidas. Por favor, intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex bg-background">
            <div className="hidden lg:flex relative w-[52%] flex-col overflow-hidden">
                <Image
                    src="/login-ilustration.jpg"
                    alt=""
                    fill
                    sizes="52vw"
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
                <div className="w-full max-w-90">

                    <div className="flex items-center gap-2.5 mb-10 lg:hidden">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                            <Image src="/LogoWebp.webp" alt="Nexhora" width={22} height={22} className="object-contain" />
                        </div>
                        <span className="text-primary font-bold text-lg">Nexhora SAS</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-foreground text-[1.95rem] font-bold tracking-tight leading-tight">
                            Bienvenido de vuelta
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                            Ingresa tus credenciales para acceder al panel.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-foreground text-sm font-medium">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="tu@nexhora.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-foreground text-sm font-medium">
                                    Contraseña
                                </label>
                                <a
                                    href="/login/recover-password"
                                    className="text-accent text-xs hover:underline underline-offset-2 transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 pr-12 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                    suppressHydrationWarning
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    suppressHydrationWarning
                                >
                                    {showPassword ? (
                                        <EyeClosed size={20} />
                                    ) : (
                                        <EyeIcon size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <input
                                id="remember_me"
                                name="remember_me"
                                type="checkbox"
                                checked={formData.remember_me}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                                suppressHydrationWarning
                            />
                            <label htmlFor="remember_me" className="text-muted-foreground text-sm cursor-pointer select-none">
                                Recuérdame
                            </label>
                        </div>

                        {error && (
                            <p role="alert" className="text-red-500 text-xs text-center">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] hover:cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            suppressHydrationWarning
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    Acceder
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/home"
                            className="inline-flex items-center gap-1.5 text-muted-foreground text-xs hover:text-foreground transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Volver al sitio
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
