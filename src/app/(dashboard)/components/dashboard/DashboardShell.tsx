"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "./DashboardSidebar"
import Icon from "@/src/app/shared/Icon"
import { useAuthStore } from "@/src/hooks/authStore"

interface DashboardShellProps {
    children: React.ReactNode
    today: string
}

const { Search } = Icon;

export function DashboardShell({ children, today }: DashboardShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const initAuth = useAuthStore((state) => state.initAuth)
    const { decodedToken } = useAuthStore();

    useEffect(() => {
        initAuth()
    }, [initAuth])

    return (
        <div className="flex min-h-screen bg-background">
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

            <div className="flex-1 flex flex-col min-w-0">
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
                            <p className="text-muted-foreground text-xs capitalize">{today}</p>
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

                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                            <span className="text-white text-xs font-bold" aria-label="Usuario: Admin">{decodedToken?.nombre.slice(0, 1)}</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
