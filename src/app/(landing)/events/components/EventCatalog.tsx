"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axiosPublic from "@/src/apis/axiosPublic";
import Icon from "@/src/app/shared/Icon";
import EventModal from "./EventModal";

const { CalendarsIcon, ChevronLeftIcon, ChevronRightIcon } = Icon;

export interface EventoImagen {
    evento_imagen_id?: number;
    url_imagen: string;
    alt?: string;
}

export interface Evento {
    evento_id: number;
    titulo: string;
    resumen: string;
    descripcion: string;
    fecha_evento: string;
    created_at?: string;
    updated_at?: string;
    imagenes: EventoImagen[];
}

export interface Pagination {
    totalCount: number;
    limit: number;
    offset: number;
    totalPages: number;
    currentPage: number;
}

function formatDateParts(dateStr: string) {
    const d = new Date(dateStr);
    return {
        day: d.getDate().toString().padStart(2, "0"),
        month: d.toLocaleString("es-CO", { month: "short" }).toUpperCase(),
        year: d.getFullYear(),
    };
}

function isFuture(dateStr: string) {
    return new Date(dateStr) > new Date();
}

function EventCard({
    evento,
    index,
    onOpenModal,
}: {
    evento: Evento;
    index: number;
    onOpenModal: (id: number) => void;
}) {
    const date = formatDateParts(evento.fecha_evento);
    const upcoming = isFuture(evento.fecha_evento);

    const cover = evento.imagenes?.[0];

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
            {/* Cover image */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                {cover ? (
                    <Image
                        src={cover.url_imagen}
                        alt={cover.alt ?? evento.titulo}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-[#076490]/10 to-[#1a5fb4]/10">
                        <CalendarsIcon size={36} className="text-[#076490]/30" />
                    </div>
                )}
            </div>

            {/* Date band */}
            <div className="flex items-center gap-4 bg-linear-to-r from-[#076490] to-[#1a5fb4] px-5 py-4">
                <div className="flex flex-col items-center justify-center rounded-xl bg-white/20 px-3 py-2 min-w-13 text-white text-center backdrop-blur-sm">
                    <span className="text-2xl font-bold leading-none">{date.day}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90 mt-0.5">
                        {date.month}
                    </span>
                    <span className="text-[10px] opacity-70 mt-0.5">{date.year}</span>
                </div>

                {upcoming ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 px-3 py-1 text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse inline-block" />
                        Próximo evento
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                        Realizado
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-[#1a2847] transition-colors duration-200 group-hover:text-[#076490] line-clamp-2 leading-snug">
                    {evento.titulo}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-500 text-pretty">
                    {evento.resumen}
                </p>

                <div className="mt-auto pt-6">
                    <button
                        onClick={() => onOpenModal(evento.evento_id)}
                        className="w-full inline-flex items-center justify-center rounded-lg border border-[#1a5fb4] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#1a5fb4] transition-all hover:bg-blue-50 active:scale-[0.98] hover:cursor-pointer"
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
        </motion.article>
    );
}

const LIMIT = 9;

export default function EventCatalog({
    initialEvents,
    initialPagination,
    initialError,
}: {
    initialEvents: Evento[];
    initialPagination: Pagination | null;
    initialError: boolean;
}) {
    const [eventos, setEventos] = useState<Evento[]>(initialEvents);
    const [pagination, setPagination] = useState<Pagination | null>(initialPagination);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(
        initialError ? "No se pudieron cargar los eventos. Intente de nuevo." : null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchEvents = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const offset = (page - 1) * LIMIT;
            const res = await axiosPublic.get<{ data: Evento[]; pagination: Pagination }>(
                process.env.NEXT_PUBLIC_EVENTS_PUBLIC!,
                { params: { limit: LIMIT, offset } }
            );
            setEventos(res.data.data);
            setPagination(res.data.pagination);
            setCurrentPage(page);
        } catch {
            setError("No se pudieron cargar los eventos. Intente de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (id: number) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedId(null), 300);
    };

    const totalPages = pagination?.totalPages ?? 1;

    return (
        <section className="w-full bg-[#f8fafd] py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section header */}
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-pretty text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Nuestros Eventos
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 text-pretty">
                        Participa en nuestros webinars, foros y encuentros, o revive los que ya ocurrieron.
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <svg viewBox="0 0 57 60" xmlns="http://www.w3.org/2000/svg" stroke="#076490" width={57} height={60}>
                            <g fill="none" fillRule="evenodd">
                                <g transform="translate(1 1)" strokeWidth="3">
                                    <circle cx="5" cy="50" r="5">
                                        <animate attributeName="cy" begin="0s" dur="2.2s" values="50;5;50;50" calcMode="linear" repeatCount="indefinite" />
                                        <animate attributeName="cx" begin="0s" dur="2.2s" values="5;27;49;5" calcMode="linear" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="27" cy="5" r="5">
                                        <animate attributeName="cy" begin="0s" dur="2.2s" values="5;50;50;5" calcMode="linear" repeatCount="indefinite" />
                                        <animate attributeName="cx" begin="0s" dur="2.2s" values="27;49;5;27" calcMode="linear" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="49" cy="50" r="5">
                                        <animate attributeName="cy" begin="0s" dur="2.2s" values="50;50;5;50" calcMode="linear" repeatCount="indefinite" />
                                        <animate attributeName="cx" begin="0s" dur="2.2s" values="49;5;27;49" calcMode="linear" repeatCount="indefinite" />
                                    </circle>
                                </g>
                            </g>
                        </svg>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-red-500 font-semibold mb-4">{error}</p>
                        <button
                            onClick={() => fetchEvents(1)}
                            className="rounded-lg bg-[#076490] px-5 py-2 text-sm font-semibold text-white hover:bg-[#065a82] transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && eventos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                        <CalendarsIcon size={44} className="opacity-35" />
                        <p className="text-sm">No hay eventos registrados aún.</p>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && eventos.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {eventos.map((evento, i) => (
                                <EventCard
                                    key={evento.evento_id}
                                    evento={evento}
                                    index={i}
                                    onOpenModal={handleOpenModal}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-3">
                                <button
                                    disabled={currentPage <= 1}
                                    onClick={() => fetchEvents(currentPage - 1)}
                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeftIcon size={16} />
                                    Anterior
                                </button>

                                <span className="rounded-lg border border-[#c7d6f0] bg-white px-5 py-2 text-sm font-semibold text-[#076490]">
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    disabled={currentPage >= totalPages}
                                    onClick={() => fetchEvents(currentPage + 1)}
                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                    <ChevronRightIcon size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <EventModal eventoId={selectedId} isOpen={isModalOpen} onClose={handleCloseModal} />
        </section>
    );
}
