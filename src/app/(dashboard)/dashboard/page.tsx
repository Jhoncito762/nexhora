"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axiosPrivate from "@/src/apis/axiosPrivate"
import { useAuthStore } from "@/src/hooks/authStore"
import Icon from "@/src/app/shared/Icon"

const {
    FolderCodeIcon,
    MonitorCloudIcon,
    CalendarsIcon,
    UsersRoundIcon,
    ArrowRightIcon,
    ShieldUser,
    SlidersVerticalIcon,
} = Icon

interface StatCard {
    label: string
    value: number | null
    icon: React.ElementType
    href: string
    color: string
    bg: string
}

const quickLinks = [
    { label: "Roles", href: "/dashboard/roles", icon: ShieldUser, description: "Gestiona roles y permisos" },
    { label: "Usuarios", href: "/dashboard/users", icon: UsersRoundIcon, description: "Administra los usuarios" },
    { label: "Productos", href: "/dashboard/products", icon: FolderCodeIcon, description: "Gestiona el catálogo de productos" },
    { label: "Servicios", href: "/dashboard/services", icon: MonitorCloudIcon, description: "Administra los servicios ofrecidos" },
    { label: "Eventos", href: "/dashboard/events", icon: CalendarsIcon, description: "Controla webinars y foros" },
    { label: "Parámetros", href: "/dashboard/parameters", icon: SlidersVerticalIcon, description: "Configura parámetros globales" },
]

function StatSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-10 w-10 rounded-xl bg-muted" />
            </div>
            <div className="h-8 w-16 rounded bg-muted" />
        </div>
    )
}

export default function DashboardPage() {
    const { decodedToken, profileData, initAuth } = useAuthStore()
    const displayName = profileData?.nombre ?? decodedToken?.nombre ?? "Admin"

    const [stats, setStats] = useState<Record<string, number | null>>({
        productos: null,
        servicios: null,
        eventos: null,
        usuarios: null,
    })
    const [statsLoaded, setStatsLoaded] = useState(false)

    useEffect(() => {
        initAuth()
    }, [initAuth])

    useEffect(() => {
        const endpoints = [
            { key: "productos", url: process.env.NEXT_PUBLIC_GET_PRODUCTS! },
            { key: "servicios", url: process.env.NEXT_PUBLIC_GET_SERVICES! },
            { key: "eventos", url: process.env.NEXT_PUBLIC_EVENTS! },
            { key: "usuarios", url: process.env.NEXT_PUBLIC_GET_USERS! },
        ]

        Promise.allSettled(
            endpoints.map(({ key, url }) =>
                axiosPrivate
                    .get<{ pagination?: { totalCount: number }; meta?: { total: number }; total?: number }>(
                        url, { params: { limit: 1, offset: 0 } }
                    )
                    .then((r) => ({
                        key,
                        value:
                            r.data?.pagination?.totalCount ??
                            r.data?.meta?.total ??
                            r.data?.total ??
                            0,
                    }))
            )
        ).then((results) => {
            const next: Record<string, number | null> = {}
            results.forEach((r) => {
                if (r.status === "fulfilled") next[r.value.key] = r.value.value
                else next[(endpoints.find((_, i) => i === results.indexOf(r))?.key) ?? ""] = null
            })
            setStats(next)
            setStatsLoaded(true)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const statCards: StatCard[] = [
        {
            label: "Productos",
            value: stats.productos,
            icon: FolderCodeIcon,
            href: "/dashboard/products",
            color: "text-[#076490]",
            bg: "bg-[#076490]/10",
        },
        {
            label: "Servicios",
            value: stats.servicios,
            icon: MonitorCloudIcon,
            href: "/dashboard/services",
            color: "text-[#1a5fb4]",
            bg: "bg-[#1a5fb4]/10",
        },
        {
            label: "Eventos",
            value: stats.eventos,
            icon: CalendarsIcon,
            href: "/dashboard/events",
            color: "text-violet-600",
            bg: "bg-violet-100",
        },
        {
            label: "Usuarios",
            value: stats.usuarios,
            icon: UsersRoundIcon,
            href: "/dashboard/users",
            color: "text-emerald-600",
            bg: "bg-emerald-100",
        },
    ]

    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches"

    return (
        <div className="space-y-8">
            {/* ── Welcome banner ── */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div
                    className="px-6 py-7 relative"
                    style={{
                        background: "linear-gradient(135deg, #076490 0%, #1a5fb4 60%, #4f79c7 100%)",
                    }}
                >
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                        <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-white/5 blur-xl" />
                    </div>

                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-white/70 text-sm font-medium">{greeting} 👋</p>
                            <h2 className="text-white text-2xl font-bold mt-0.5">{displayName}</h2>
                            <p className="text-white/60 text-sm mt-1">
                                Este es tu resumen general del sistema.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 backdrop-blur-sm w-fit">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-white text-xs font-medium">Sistema activo</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stat cards ── */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 text-muted-foreground">
                    Resumen general
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {!statsLoaded
                        ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
                        : statCards.map((card) => {
                            const CardIcon = card.icon
                            return (
                                <Link
                                    key={card.label}
                                    href={card.href}
                                    className="group rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 transition-all hover:shadow-md hover:border-[#4f79c7]/40 hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm font-medium">
                                            {card.label}
                                        </span>
                                        <span className={`${card.bg} ${card.color} rounded-xl p-2.5`}>
                                            <CardIcon size={18} />
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-foreground text-3xl font-bold leading-none">
                                            {card.value ?? "—"}
                                        </span>
                                        <ArrowRightIcon
                                            size={16}
                                            className="text-muted-foreground/40 group-hover:text-[#076490] group-hover:translate-x-0.5 transition-all"
                                        />
                                    </div>
                                </Link>
                            )
                        })}
                </div>
            </div>

            {/* ── Quick access ── */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 text-muted-foreground">
                    Acceso rápido
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickLinks.map((item) => {
                        const ItemIcon = item.icon
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-all hover:border-[#4f79c7]/40 hover:shadow-sm hover:-translate-y-0.5"
                            >
                                <span className="flex items-center justify-center rounded-lg bg-secondary p-2.5 text-muted-foreground group-hover:bg-[#076490]/10 group-hover:text-[#076490] transition-colors shrink-0">
                                    <ItemIcon size={18} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-foreground text-sm font-semibold leading-tight">
                                        {item.label}
                                    </p>
                                    <p className="text-muted-foreground text-xs mt-0.5 truncate">
                                        {item.description}
                                    </p>
                                </div>
                                <ArrowRightIcon
                                    size={14}
                                    className="ml-auto text-muted-foreground/30 group-hover:text-[#076490] group-hover:translate-x-0.5 transition-all shrink-0"
                                />
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
