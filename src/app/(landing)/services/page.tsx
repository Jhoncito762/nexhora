"use client";

import React from "react";
import Icon from "../../shared/Icon";
import ServiceCard from "./components/ServiceCard";
import Link from "next/link";

type ServiceCategory = {
    id: number;
    title: string;
    description: string;
    services: string[];
    differential?: string;
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
    },
    services: [
        {
            id: 1,
            title: "Consultoría en Innovación y Transformación Digital",
            description:
                "Modernización estratégica de procesos mediante transformación digital sostenible.",
            services: [
                "Diagnóstico de madurez digital (TRL, TDM)",
                "Estrategias de transformación digital",
                "Gestión tecnológica y automatización",
                "Gobernanza de datos y ética digital",
                "Transición a economía circular digital",
            ],
            differential: "Enfoque sostenible con IA responsable",
        },
        {
            id: 2,
            title: "Desarrollo de Software e Inteligencia Artificial",
            description:
                "Soluciones tecnológicas a medida con IA aplicada y arquitecturas modernas.",
            services: [
                "Software web, móvil y escritorio",
                "Plataformas de IA y analítica avanzada",
                "Modelos predictivos e IA generativa",
                "Arquitecturas cloud-native (AWS, Azure, GCP)",
                "IoT, Big Data y ciberseguridad",
            ],
        },
        {
            id: 3,
            title: "IoT, Automatización e Infraestructura Digital",
            description:
                "Ecosistemas inteligentes conectando personas, procesos y dispositivos.",
            services: [
                "Redes de sensores agrícolas e industriales",
                "Automatización industria 4.0",
                "Monitoreo de clima, suelo, agua y energía",
                "Integración hardware/software segura",
                "Conectividad rural (4G, 5G, LoRa, NB-IoT)",
            ],
        },
        {
            id: 4,
            title: "Sostenibilidad e Innovación Verde",
            description: "Soluciones ambientales digitales y economía circular.",
            services: [
                "Medición de huella de carbono",
                "Análisis de ciclo de vida",
                "Gestión ambiental digital",
                "Bioeconomía y energía limpia",
                "Responsabilidad social corporativa",
            ],
        },
        {
            id: 5,
            title: "Análisis de Datos y Gestión del Conocimiento",
            description: "Transformación de datos en decisiones estratégicas.",
            services: [
                "Minería de datos y BI",
                "Modelos predictivos y prescriptivos",
                "Capacitación en Python, Power BI, Tableau, R",
                "Gestión de información y datos abiertos",
            ],
        },
        {
            id: 6,
            title: "Capacitación e Inclusión Digital STEAM",
            description: "Formación práctica para cerrar brechas tecnológicas.",
            services: [
                "Formación en IA ética y habilidades digitales",
                "Cursos para docentes y emprendedores",
                "Programas para mujeres y comunidades rurales",
                "Alianzas con universidades y redes",
            ],
        },
        {
            id: 7,
            title: "Ecosistemas de Innovación Abierta",
            description:
                "Cocreación tecnológica entre academia, empresa y sociedad.",
            services: [
                "Laboratorios de innovación y fablabs",
                "Aceleración de startups",
                "Alianzas con clústeres y cámaras",
                "Proyectos alineados a ODS",
            ],
        },
        {
            id: 8,
            title: "Ciberseguridad y Protección de Datos",
            description: "Seguridad integral para sistemas digitales.",
            services: [
                "Auditorías y pruebas de penetración",
                "Cumplimiento ISO 27001, GDPR, Ley 1581",
                "Firewalls y encriptación avanzada",
                "Seguridad IoT y formación empresarial",
            ],
        },
    ] satisfies ServiceCategory[],
};

export default function Page() {
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
                        <div>
                            <h2 className="text-2xl font-bold text-[#1a2847] sm:text-3xl">
                                Nuestros Servicios
                            </h2>
                            <p className="mt-1.5 text-sm text-[#64748b]">
                                8 areas de especializacion para tu transformacion digital
                            </p>
                        </div>
                    </div>
                    <div className="h-px w-full bg-linear-to-r from-[#c7d6f0]/60 via-[#4f79c7]/20 to-transparent" />
                </div>
            </section>

            {/* ── Cards grid ── */}
            <section className="relative pt-8 pb-20">
                <div className="mx-auto max-w-6xl px-5 sm:px-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {content.services.map((category) => (
                            <ServiceCard key={category.id} category={category} />
                        ))}
                    </div>
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
