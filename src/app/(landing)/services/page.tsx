"use client";

import React, { useEffect, useState } from "react";
import Icon from "../../shared/Icon";
import ServiceCard from "./components/ServiceCard";
import Link from "next/link";
import axiosPublic from "@/src/apis/axiosPublic";

type Servicio = {
    servicio_id: number;
    nombre: string;
    descripcion: string;
    caracteristicas: string[];
};

const content = {
    portfolio: {
        mission:
            "Impulsar la transformación digital responsable integrando innovación, sostenibilidad, ética e impacto social.",
        differentialValue: [
            { label: "Enfoque humanista y sostenible", icon: Icon.LuUsers },
            { label: "Inteligencia artificial responsable", icon: Icon.Sparkles },
            { label: "Alineación con los ODS", icon: Icon.Target },
            { label: "Resultados medibles", icon: Icon.Globe },
        ],
    }
};

export default function Page() {
    const [services, setServices] = useState<Servicio[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<String | null>(null)

    const fetchServices = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPublic.get<{ services: Servicio[] }>(
                process.env.NEXT_PUBLIC_PUBLIC_SERVICES!
            )

            const { services } = response.data;

            setServices(services)
        } catch (error) {
            setError("No se pudieron cargar los productos. Intente de nuevo")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])



    return (
        <main className="relative min-h-screen w-full bg-[#f8fafd]">
            {/* Subtle background accents */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 right-0 h-125 w-125 rounded-full bg-[#4f79c7]/4 blur-[120px]" />
                <div className="absolute top-[40%] -left-32 h-100 w-100 rounded-full bg-[#076490]/3 blur-[100px]" />
            </div>

            {/* ── Hero ── */}
            <section className="relative pt-20 pb-14 sm:pt-28 sm:pb-20">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Badge */}
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c7d6f0]/60 bg-white px-4 py-1.5 text-xs font-medium text-[#076490] shadow-[0_1px_3px_rgba(7,100,144,0.06)]">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#076490]/50" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#076490]" />
                            </span>
                            Portafolio de Servicios
                        </span>

                        {/* Heading */}
                        <h1 className="text-4xl font-bold tracking-tight text-[#1a2847] sm:text-5xl lg:text-6xl text-balance">
                            Soluciones que{" "}
                            <span className="bg-linear-to-r from-[#076490] via-[#2240ab] to-[#4f79c7] bg-clip-text text-transparent">
                                transforman
                            </span>
                        </h1>

                        {/* Mission */}
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#64748b] sm:text-lg text-pretty">
                            {content.portfolio.mission}
                        </p>

                        {/* Differential values */}
                        <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
                            {content.portfolio.differentialValue.map((item) => {
                                const DIcon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="flex items-center gap-3 rounded-xl border border-[#c7d6f0]/40 bg-white px-4 py-3 transition-all duration-200 hover:border-[#4f79c7]/30 hover:shadow-sm"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f6fb]">
                                            <DIcon size={15} className="text-[#076490]" />
                                        </div>
                                        <span className="text-[13px] font-medium text-[#2d3748]">
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section heading ── */}
            <section className="relative">
                <div className="mx-auto max-w-6xl px-5 sm:px-8">
                    <div className="flex items-end justify-between pb-6">
                        <div className="flex gap-7 items-center">

                            <div>
                                <h2 className="text-2xl font-bold text-[#1a2847] sm:text-3xl">
                                    Nuestros Servicios
                                </h2>
                                <p className="mt-1.5 text-sm text-[#64748b]">
                                    8 areas de especializacion para tu transformacion digital
                                </p>
                            </div>
                            <div className="bg-[#c7d6f0] h-15 w-px" />

                            <a
                                href="/Portafolio_Servicios_Nexhora.pdf"
                                download
                                className="inline-flex items-center gap-2 bg-[#2240ab] text-white px-5 py-3 rounded-xl shadow-md hover:shadow-[#2240ab] transition duration-300"
                            >
                                <Icon.AiOutlineFilePdf size={20} />
                                Descárgalo en PDF aquí
                            </a>

                        </div>
                    </div>
                    <div className="h-px w-full bg-linear-to-r from-[#c7d6f0]/60 via-[#4f79c7]/20 to-transparent" />
                </div>
            </section>

            {/* ── Cards grid ── */}
            <section className="relative pt-8 pb-20">
                <div className="mx-auto max-w-6xl px-5 sm:px-8">
                    {isLoading ? (
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
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                            {services.map((servicio) => (
                                <ServiceCard key={servicio.servicio_id} servicio={servicio} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="relative pb-16">
                <div className="mx-auto max-w-6xl px-5 sm:px-8">
                    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#1a2847] via-[#2240ab] to-[#076490] px-8 py-10 sm:px-12 sm:py-14">
                        {/* Dot pattern */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-[0.07]"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                                backgroundSize: "20px 20px",
                            }}
                        />
                        {/* Glow */}
                        <div
                            aria-hidden="true"
                            className="absolute -top-20 right-0 h-60 w-60 rounded-full bg-[#4f79c7]/20 blur-[80px]"
                        />

                        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="max-w-lg">
                                <h3 className="text-xl font-bold text-white sm:text-2xl text-balance">
                                    {"¿Listo para transformar tu organización?"}
                                </h3>
                                <p className="mt-2.5 text-sm leading-relaxed text-[#c7d6f0]/80">
                                    Conectemos para diseñar juntos una estrategia de innovación
                                    alineada a tus objetivos y los ODS.
                                </p>
                            </div>
                            <Link href={"/contactus"}>
                                <button
                                    type="button"
                                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#2240ab] shadow-lg transition-all duration-200 hover:cursor-pointer hover:shadow-xl active:scale-[0.98]"
                                >
                                    Contáctanos
                                    <Icon.ArrowRight size={15} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
