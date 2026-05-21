"use client"

import { useEffect, useRef, useState } from "react"
import { DashboardSidebar } from "./DashboardSidebar"
import Icon from "@/src/app/shared/Icon"
import { useAuthStore } from "@/src/hooks/authStore"
import { useRouter } from "next/navigation"
import { User, LogOut } from "lucide-react"
import ProfileModal from "../profile/ProfileModal"

interface DashboardShellProps {
    children: React.ReactNode
}

const { Search } = Icon;

export function DashboardShell({ children }: DashboardShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [today, setToday] = useState("")
    const dropdownRef = useRef<HTMLDivElement>(null)
    const initAuth = useAuthStore((state) => state.initAuth)
    const logout = useAuthStore((state) => state.logout)
    const logoutAsync = useAuthStore((state) => state.logoutAsync)
    const { decodedToken, profileData } = useAuthStore();
    const displayName = profileData?.nombre ?? decodedToken?.nombre
    const displayEmail = profileData?.correo ?? decodedToken?.correo
    const displayFoto = profileData?.foto ?? decodedToken?.foto
    const router = useRouter()

    useEffect(() => {
        initAuth()
    }, [initAuth])

    useEffect(() => {
        setToday(new Date().toLocaleDateString("es-MX", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }))
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
        if (!dropdownOpen) return
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [dropdownOpen])

    const handleLogout = async () => {
        setDropdownOpen(false)
        await logoutAsync()
        router.push("/login")
    }

    return (
        <div className="flex h-screen bg-background">
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <DashboardSidebar
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-foreground text-lg font-bold">Panel de control</h1>
                            <p className="text-muted-foreground text-xs capitalize" suppressHydrationWarning>{today}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                placeholder="Buscar..."
                                aria-label="Buscar en el panel"
                                className="h-9 pl-9 pr-4 w-52 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>

                        {/* Avatar + dropdown */}
                        <div ref={dropdownRef} className="relative">
                            <button
                                onClick={() => setDropdownOpen(v => !v)}
                                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-transparent hover:ring-accent transition-all focus:outline-none focus:ring-accent"
                                aria-label="Menú de usuario"
                                aria-expanded={dropdownOpen}
                            >
                                {decodedToken?.foto ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={displayFoto}
                                        alt="Foto de usuario"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-white text-xs font-bold">
                                        {displayName?.charAt(0)}
                                    </span>
                                )}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 top-11 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-border">
                                        <p className="text-foreground text-sm font-semibold truncate">{displayName}</p>
                                        <p className="text-muted-foreground text-xs truncate">{displayEmail}</p>
                                    </div>
                                    {/* Options */}
                                    <div className="py-1">
                                        <button
                                            onClick={() => { setDropdownOpen(false); setProfileOpen(true) }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                                        >
                                            <User size={15} className="text-muted-foreground" />
                                            Mi perfil
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <LogOut size={15} />
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            {decodedToken?.usuario_id && (
                <ProfileModal
                    isOpen={profileOpen}
                    userId={decodedToken.usuario_id}
                    onClose={() => setProfileOpen(false)}
                />
            )}
        </div>
    )
}

