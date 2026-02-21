"use client";

import React, { useState } from "react";
import Icon from "@/src/app/shared/Icon";

const { LuUsers, Sparkles, Target, Globe, Lightbulb, Lock, Leaf } = Icon;

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
            "Enfoque humanista y sostenible",
            "Integración de inteligencia artificial responsable",
            "Alineación con los Objetivos de Desarrollo Sostenible (ODS)",
            "Resultados medibles y desarrollo competitivo",
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

function ServiceCard({
    category,
    icon,
}: {
    category: ServiceCategory;
    icon: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <article className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg flex flex-col">
            <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-[#f3f6fb] via-[#c7d6f0] to-[#4f79c7]" />

            <div className="mt-2 flex items-center justify-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#f3f6fb] via-[#c7d6f0]/70 to-[#4f79c7]/25">
                    {icon}
                </div>
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-900">
                {category.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
                {category.description}
            </p>

            {category.differential && (
                <div className="mt-5">
                    <span className="inline-flex items-center text-xs font-semibold text-[rgb(7,100,144)] bg-[rgba(7,100,144,0.08)] border border-[rgba(7,100,144,0.14)] rounded-lg px-4 py-2">
                        {category.differential}
                    </span>
                </div>
            )}

            <div className="mt-auto pt-6">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer select-none text-sm font-semibold text-[rgb(34,64,171)] inline-flex items-center gap-2"
                >
                    <span>{isOpen ? "Ocultar" : "Ver servicios"}</span>
                    <span
                        aria-hidden="true"
                        className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                    >
                        ›
                    </span>
                </button>

                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                        }`}
                >
                    <ul className="space-y-2">
                        {category.services.map((item) => (
                            <li
                                key={item}
                                className="flex items-start gap-3 text-sm text-gray-700"
                            >
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-linear-to-r from-[rgb(7,100,144)] to-[rgb(34,64,171)]" />
                                <span className="leading-6">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    );
}

export default function Page() {
    return (
        <main className="w-full min-h-screen bg-background">
            {/* Header */}
            <section className="w-full pt-20 pb-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="flex flex-col items-center text-center gap-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
                            Soluciones que transforman
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 max-w-4xl">
                            {content.portfolio.mission}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4 justify-center">
                            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-semibold text-gray-800">
                                <LuUsers size={18} className="text-[rgb(7,100,144)]" />
                                {content.portfolio.differentialValue[0]}
                            </span>
                            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-semibold text-gray-800">
                                <Sparkles size={18} className="text-[rgb(7,100,144)]" />
                                {content.portfolio.differentialValue[1]}
                            </span>
                            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-semibold text-gray-800">
                                <Target size={18} className="text-[rgb(7,100,144)]" />
                                {content.portfolio.differentialValue[2]}
                            </span>
                            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-semibold text-gray-800">
                                <Globe size={18} className="text-[rgb(7,100,144)]" />
                                {content.portfolio.differentialValue[3]}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cards */}
            <section className="w-full pb-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.services.map((category) => {
                            const iconById: Record<number, React.ReactNode> = {
                                1: <Lightbulb size={22} className="text-[rgb(7,100,144)]" />,
                                2: <Sparkles size={22} className="text-[rgb(7,100,144)]" />,
                                3: <Target size={22} className="text-[rgb(7,100,144)]" />,
                                4: <Leaf size={22} className="text-[rgb(7,100,144)]" />,
                                5: <Globe size={22} className="text-[rgb(7,100,144)]" />,
                                6: <LuUsers size={22} className="text-[rgb(7,100,144)]" />,
                                7: <Lightbulb size={22} className="text-[rgb(7,100,144)]" />,
                                8: <Lock size={22} className="text-[rgb(7,100,144)]" />,
                            };

                            return (
                                <ServiceCard
                                    key={category.id}
                                    category={category}
                                    icon={iconById[category.id]}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}