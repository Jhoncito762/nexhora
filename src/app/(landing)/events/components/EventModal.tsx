"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosPublic from "@/src/apis/axiosPublic";
import Icon from "@/src/app/shared/Icon";

const { CalendarsIcon } = Icon;

interface Imagen {
    evento_imagen_id?: number;
    evento_id?: number;
    url_imagen: string;
    alt?: string;
    created_at?: string;
    updated_at?: string;
}

export interface EventoDetalle {
    evento_id: number;
    titulo: string;
    resumen: string;
    descripcion: string;
    fecha_evento: string;
    created_at: string;
    updated_at: string;
    imagenes: Imagen[];
}

interface EventModalProps {
    eventoId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(dateStr));
}

function isFuture(dateStr: string) {
    return new Date(dateStr) > new Date();
}

export default function EventModal({ eventoId, isOpen, onClose }: EventModalProps) {
    const [evento, setEvento] = useState<EventoDetalle | null>(null);
    const [loading, setLoading] = useState(false);
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        if (!isOpen || !eventoId) return;
        setEvento(null);
        setImgIndex(0);
        setLoading(true);
        axiosPublic
            .get<EventoDetalle>(`${process.env.NEXT_PUBLIC_EVENTS_PUBLIC}/${eventoId}`)
            .then((r) => setEvento(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [isOpen, eventoId]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const images = evento?.imagenes ?? [];
    const upcoming = evento ? isFuture(evento.fecha_evento) : false;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2">
                        {!loading && upcoming && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                Próximo
                            </span>
                        )}
                        {!loading && !upcoming && evento && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                Realizado
                            </span>
                        )}
                        <h2 className="font-bold text-base text-[#1a2847] line-clamp-1">
                            {loading ? "Cargando..." : (evento?.titulo ?? "Detalle del evento")}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                        aria-label="Cerrar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {loading && (
                        <div className="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Cargando evento...
                        </div>
                    )}

                    {!loading && evento && (
                        <>
                            {/* Image carousel */}
                            {images.length > 0 && (
                                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-100">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={imgIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="relative h-full w-full"
                                        >
                                            <Image
                                                src={images[imgIndex].url_imagen}
                                                alt={images[imgIndex].alt ?? evento.titulo}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 672px"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                    {images.length > 1 && (
                                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                                            {images.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setImgIndex(i)}
                                                    className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                                                    aria-label={`Imagen ${i + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Date */}
                            <div className="flex items-center gap-2 text-[#076490] text-sm font-medium">
                                <CalendarsIcon size={15} />
                                <span className="capitalize">{formatDate(evento.fecha_evento)}</span>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-slate-100" />

                            {/* Summary */}
                            {evento.resumen && (
                                <p className="text-sm font-semibold text-[#1a5fb4] italic leading-relaxed">
                                    {evento.resumen}
                                </p>
                            )}

                            {/* Description */}
                            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                {evento.descripcion}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
