"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Icon from "@/src/app/shared/Icon"
import { useAuthStore } from "@/src/hooks/authStore"

const {
    ShieldUser,
    LayoutDashboard,
    CalendarsIcon,
    UsersRoundIcon,
    MonitorCloudIcon,
    SlidersVerticalIcon,
    FolderCodeIcon,
    FiLogOut,
    CiMenuFries,
    FaAnglesRight
} = Icon;

const navItems = [
    {
        label: "Inicio",
        href: "/dashboard",
        icon: (
            <LayoutDashboard size={22} />
        ),
    },
    {
        label: "Roles",
        href: "/dashboard/roles",
        icon: (
            <ShieldUser size={22} />
        ),
    },
    {
        label: "Usuarios",
        href: "/dashboard/users",
        icon: (
            <UsersRoundIcon size={22} />
        ),
    },
    {
        label: "Productos",
        href: "/dashboard/products",
        icon: (
            <FolderCodeIcon size={22} />
        ),
    },
    {
        label: "Servicios",
        href: "/dashboard/services",
        icon: (
            <MonitorCloudIcon size={22} />
        ),
    },
    {
        label: "Eventos",
        href: "/dashboard/events",
        icon: (
            <CalendarsIcon size={22} />
        ),
    },
    {
        label: "Parámetros",
        href: "/dashboard/parameters",
        icon: (
            <SlidersVerticalIcon size={22} />
        ),
    },
]

interface DashboardSidebarProps {
    mobileOpen: boolean
    onMobileClose: () => void
}

export function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const { decodedToken, profileData } = useAuthStore()
    const displayName = profileData?.nombre ?? decodedToken?.nombre
    const displayEmail = profileData?.correo ?? decodedToken?.correo
    const displayFoto = profileData?.foto ?? decodedToken?.foto

    useEffect(() => {
        onMobileClose()
    }, [pathname])

    return (
        <aside
            className={[
                "flex flex-col bg-sidebar border-r border-sidebar-border shrink-0 transition-all duration-300",
                collapsed ? "w-17" : "w-60",
                "fixed inset-y-0 left-0 z-50 md:relative md:inset-auto md:z-auto",
                mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                "md:min-h-screen",
            ].join(" ")}
            aria-label="Sidebar de navegación"
        >
            {/* Logo + collapse button */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
                {!collapsed && (
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden">
                            <Image src="/LogoWebp.webp" alt="Nexhora" width={20} height={20} className="object-contain" />
                        </div>
                        <span className="text-sidebar-foreground font-bold text-sm tracking-wide whitespace-nowrap">
                            Nexhora SAS
                        </span>
                    </div>
                )}

                {collapsed && (
                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center mx-auto overflow-hidden">
                        <Image src="/LogoWebp.webp" alt="Nexhora" width={20} height={20} className="object-contain" />
                    </div>
                )}

                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors p-1 rounded-lg hover:bg-sidebar-accent/50"
                        aria-label="Colapsar sidebar"
                    >
                        <CiMenuFries size={20} />
                    </button>
                )}

                {collapsed && (
                    <button
                        onClick={() => setCollapsed(false)}
                        className="sr-only"
                        aria-label="Expandir sidebar"
                    />
                )}
            </div>

            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="mx-auto mt-3 mb-1 text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors p-2 rounded-lg hover:bg-sidebar-accent/50"
                    aria-label="Expandir sidebar"
                >
                    <FaAnglesRight size={14} />
                </button>
            )}

            <nav className="flex-1 px-2.5 py-3 space-y-0.5" aria-label="Navegación principal">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                } ${collapsed ? "justify-center" : ""}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            {!collapsed && (
                                <span className="truncate">{item.label}</span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* User footer */}
            <div className="px-2.5 py-4 border-t border-sidebar-border">
                <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sidebar-accent/50 cursor-pointer transition-colors group ${collapsed ? "justify-center" : ""
                        }`}
                >
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 overflow-hidden">
                        {displayFoto ? (
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
                    </div>
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sidebar-foreground text-xs font-medium truncate">{displayName}</p>
                                <p className="text-sidebar-foreground/40 text-xs truncate">{displayEmail}</p>
                            </div>
                            <Link
                                href="/login"
                                className="text-sidebar-foreground/30 group-hover:text-sidebar-foreground/60 transition-colors"
                                aria-label="Cerrar sesión"
                                title="Cerrar sesión"
                            >
                                <FiLogOut size={18} />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}
