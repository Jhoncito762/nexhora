"use client";

import React, { useEffect } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "./CatalogProducts";
import Icon from "../../../shared/Icon";

const { Sparkles } = Icon;

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    // Bloquear scroll cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="fixed inset-0 z-50 m-auto flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                        // Detener propagación para que click dentro no cierre
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header con gradiente */}
                        <div className="relative shrink-0 overflow-hidden bg-linear-to-r from-[#1a5fb4] to-[#0d3d7a] p-6 sm:p-8 text-white">
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

                            <div className="relative z-10 pr-8">
                                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                                    <Sparkles size={12} />
                                    <span>Producto NexHora</span>
                                </div>
                                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                                    {product.name}
                                </h2>
                                <p className="mt-2 text-base text-blue-100 sm:text-lg">
                                    {product.tagline}
                                </p>
                            </div>

                            {/* Botón Cerrar */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
                                aria-label="Cerrar modal"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Contenido con scroll */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">

                            {/* Descripción */}
                            <section className="mb-10">
                                <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                                    Descripción
                                </h3>
                                <p className="text-[15px] leading-relaxed text-slate-600 sm:text-base">
                                    {product.description}
                                </p>
                            </section>

                            {/* Módulos (Grid Cards) */}
                            {product.modules && product.modules.length > 0 && (
                                <section className="mb-10">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Icon.Layers size={18} className="text-[#1a5fb4]" />
                                        <h3 className="text-sm font-bold tracking-wide text-slate-700 uppercase">
                                            Módulos
                                        </h3>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {product.modules.map((module, idx) => (
                                            <div
                                                key={idx}
                                                className="group relative flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm"
                                            >
                                                <div className="mb-2 flex items-center gap-3">
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#1a5fb4] text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-110">
                                                        {idx + 1}
                                                    </span>
                                                    <h4 className="font-semibold text-slate-800 text-sm">
                                                        {module.name}
                                                    </h4>
                                                </div>
                                                <p className="pl-9 text-bs leading-snug text-slate-600">
                                                    {module.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Características Principales (Lista) */}
                            {product.features && product.features.length > 0 && (
                                <section>
                                    <div className="mb-4 flex items-center gap-2">
                                        <Check size={18} className="text-[#1a5fb4]" />
                                        <h3 className="text-sm font-bold tracking-wide text-slate-700 uppercase">
                                            Características Principales
                                        </h3>
                                    </div>
                                    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                                        {product.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5">
                                                <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
                                                    <Check size={10} className="text-[#1a5fb4]" strokeWidth={3} />
                                                </div>
                                                <span className="text-[14px] text-slate-600">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>

                        {/* Footer Sticky */}
                        <div className="shrink-0 border-t border-slate-100 bg-white p-4 sm:px-8 sm:py-5">
                            <div className="flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
