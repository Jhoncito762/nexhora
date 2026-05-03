"use client"

import { useEffect, useState } from "react"
import { X, ExternalLink } from "lucide-react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Icon from "@/src/app/shared/Icon"

const { SquarePenIcon } = Icon

// ─── Types ────────────────────────────────────────────────────────────────────

interface Modulo {
    modulo_id?: number
    nombre: string
    descripcion: string
}

interface Imagen {
    producto_imagen_id?: number
    producto_id?: number
    url_imagen: string
    alt?: string
    created_at: string
    updated_at: string
}

interface Caracteristica {
    producto_caracteristica_id: number
    descripcion: string
}

interface ProductoDetalle {
    producto_id: number
    nombre: string
    eslogan: string
    descripcion: string
    link_web: string
    modulos: Modulo[]
    caracteristicas: Caracteristica[]
    imagenes: Imagen[]
    created_at: string
    updated_at: string
}

export interface ViewModalProductProps {
    isOpen: boolean
    productoId?: number
    onClose: () => void
    onEdit: (id: number) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ViewModalProduct({ isOpen, productoId, onClose, onEdit }: ViewModalProductProps) {
    const [producto, setProducto] = useState<ProductoDetalle | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen || !productoId) return
        setProducto(null)
        setError(null)
        setIsLoading(true)

        axiosPrivate
            .get<ProductoDetalle | { data: ProductoDetalle }>(`${process.env.NEXT_PUBLIC_GET_PRODUCTS}/${productoId}`)
            .then((res) => {
                const d = res.data as Record<string, unknown>
                setProducto((d.data ?? d) as ProductoDetalle)
            })
            .catch(() => setError("No se pudo cargar el producto."))
            .finally(() => setIsLoading(false))
    }, [isOpen, productoId])

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

    if (!isOpen) return null

    return (
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
                            {isLoading ? "Cargando..." : (producto?.nombre ?? "Detalle del producto")}
                        </h2>
                        {producto?.eslogan && (
                            <p className="text-muted-foreground text-xs mt-0.5">{producto.eslogan}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {producto && (
                            <button
                                onClick={() => onEdit(producto.producto_id)}
                                className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs font-medium"
                            >
                                <SquarePenIcon size={13} />
                                Editar
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            aria-label="Cerrar"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {isLoading && (
                        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
                            <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Cargando producto...
                        </div>
                    )}

                    {error && (
                        <p className="text-center text-destructive text-sm py-10">{error}</p>
                    )}

                    {producto && (
                        <>
                            {/* Info básica */}
                            <section>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                    Información básica
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Nombre</p>
                                        <p className="text-foreground font-medium text-sm">{producto.nombre}</p>
                                    </div>
                                    {producto.eslogan && (
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">Eslogan</p>
                                            <p className="text-foreground text-sm">{producto.eslogan}</p>
                                        </div>
                                    )}
                                    {producto.link_web && (
                                        <div className="sm:col-span-2">
                                            <p className="text-xs text-muted-foreground mb-0.5">Link Web</p>
                                            <a
                                                href={producto.link_web}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-accent hover:underline text-sm"
                                            >
                                                {producto.link_web}
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    )}
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-muted-foreground mb-0.5">Descripción</p>
                                        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                            {producto.descripcion}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Creado</p>
                                        <p className="text-foreground text-sm">
                                            {new Date(producto.created_at).toLocaleString("es-CO", {
                                                year: "numeric", month: "long", day: "2-digit",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Última edición</p>
                                        <p className="text-foreground text-sm">
                                            {new Date(producto.updated_at).toLocaleString("es-CO", {
                                                year: "numeric", month: "long", day: "2-digit",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Módulos */}
                            {producto.modulos?.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                        Módulos ({producto.modulos.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {producto.modulos.map((mod, i) => (
                                            <div key={mod.modulo_id ?? i} className="flex gap-3 p-3 rounded-xl bg-secondary border border-border">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-foreground font-medium text-sm">{mod.nombre}</p>
                                                    {mod.descripcion && (
                                                        <p className="text-muted-foreground text-xs mt-0.5">{mod.descripcion}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Características */}
                            {producto.caracteristicas?.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                        Características
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {producto.caracteristicas.map((car) => (
                                            <span
                                                key={car.producto_caracteristica_id}
                                                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                                            >
                                                {car.descripcion}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Imágenes */}
                            {producto.imagenes?.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                        Imágenes ({producto.imagenes.length})
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {producto.imagenes.map((img, i) => (
                                            <div key={img.producto_imagen_id} className="rounded-xl overflow-hidden border border-border bg-secondary">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={img.url_imagen}
                                                    alt={img.alt ?? producto.nombre}
                                                    className="w-full h-32 object-cover"
                                                />
                                                {img.alt && (
                                                    <p className="px-2 py-1.5 text-xs text-muted-foreground truncate">{img.alt}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
