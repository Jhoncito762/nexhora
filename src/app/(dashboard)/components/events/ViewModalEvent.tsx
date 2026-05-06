"use client"

import { useEffect, useState } from "react"
import { X, ExternalLink } from "lucide-react"
import axiosPrivate from "@/src/apis/axiosPrivate"
import Icon from "@/src/app/shared/Icon"

const { SquarePenIcon } = Icon

interface Imagen {
    evento_imagen_id?: number
    evento_id?: number
    url_imagen: string
    alt?: string
    created_at: string
    updated_at: string
}

interface EventoDetalle {
    evento_id: number
    titulo: string
    resumen: string
    descripcion: string
    fecha_evento: string
    created_at: string
    updated_at: string
    imagenes: Imagen[]
}

export interface ViewModalEventProps {
    isOpen: boolean
    eventoId?: number
    onClose: () => void
    onEdit: (id: number) => void
}

export default function ViewModalEvent({ isOpen, eventoId, onClose, onEdit }: ViewModalEventProps) {

    const [evento, setEvento] = useState<EventoDetalle | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen || !eventoId) return
        setEvento(null)
        setError(null)
        setIsLoading(true)

        axiosPrivate
            .get<EventoDetalle | { data: EventoDetalle }>(`${process.env.NEXT_PUBLIC_EVENTS}/${eventoId}`)
            .then((res) => {
                const d = res.data as Record<string, unknown>
                setEvento((d.data ?? d) as EventoDetalle)
            })
            .catch(() => setError("No se pudo cargar el producto."))
            .finally(() => setIsLoading(false))
    }, [isOpen, eventoId])

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
                            {isLoading ? "Cargando..." : (evento?.titulo ?? "Detalle del producto")}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {evento && (
                            <button
                                onClick={() => onEdit(evento.evento_id)}
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
                            Cargando evento...
                        </div>
                    )}

                    {error && (
                        <p className="text-center text-destructive text-sm py-10">{error}</p>
                    )}

                    {evento && (
                        <>
                            {/* Info básica */}
                            <section>
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                    Información básica
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Título</p>
                                        <p className="text-foreground font-medium text-sm">{evento.titulo}</p>
                                    </div>
                                    {evento.resumen && (
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-0.5">Eslogan</p>
                                            <p className="text-foreground text-sm">{evento.resumen}</p>
                                        </div>
                                    )}
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-muted-foreground mb-0.5">Descripción</p>
                                        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                            {evento.descripcion}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Fecha Evento</p>
                                        <p className="text-foreground text-sm">
                                            {new Date(evento.fecha_evento).toLocaleString("es-CO", {
                                                year: "numeric", month: "long", day: "2-digit",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Creado</p>
                                        <p className="text-foreground text-sm">
                                            {new Date(evento.created_at).toLocaleString("es-CO", {
                                                year: "numeric", month: "long", day: "2-digit",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">Última edición</p>
                                        <p className="text-foreground text-sm">
                                            {new Date(evento.updated_at).toLocaleString("es-CO", {
                                                year: "numeric", month: "long", day: "2-digit",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {evento.imagenes?.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                        Imágenes ({evento.imagenes.length})
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {evento.imagenes.map((img, i) => (
                                            <div key={img.evento_imagen_id} className="rounded-xl overflow-hidden border border-border bg-secondary">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={img.url_imagen}
                                                    alt={img.alt ?? evento.titulo}
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
