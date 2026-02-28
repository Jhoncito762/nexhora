"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Icon from "../../../shared/Icon";
import { motion, AnimatePresence } from "framer-motion";

const { ShieldCheck, Layers, BarChart3, ExternalLink } = Icon;

export interface ModuleSchema {
    name: string,
    description: string
}

export interface Product {
    id: string;
    name: string;
    tagline: string;
    description: string;
    image: string[];
    icon: React.ElementType;
    color: string;
    modules: ModuleSchema[];
    features: string[];
    link: string;
}

const nexhoraColors = [
    "rgb(7,100,144)",
    "rgb(16,132,170)",
    "rgb(24,98,190)",
    "rgb(34,64,171)",
];

const products: Product[] = [
    {
        id: "nexhora_reservas",
        name: "NexHora Reservas",
        tagline: "Gestión integral de reservas multisede",
        description:
            "Plataforma B2B para administrar negocios con múltiples sitios (canchas, salones), gestionar sus horarios, configuración de reservas, inventario y permisos granulares de usuarios.",
        image: [
            "/Products/canchas/canchas.webp",
            "/Products/canchas/dashboard.webp",
            "/Products/canchas/dashboard2.webp",
        ],
        icon: ShieldCheck,
        color: nexhoraColors[1],
        "modules": [
            {
                "name": "Gestión Multisitio",
                "description": "Administración de múltiples negocios y sitios de forma independiente pero centralizada."
            },
            {
                "name": "Generación Dinámica de Slots",
                "description": "Generación automática de horarios disponibles según reglas de negocio evitando solapamientos."
            },
            {
                "name": "Precios Dinámicos (Hora Pico)",
                "description": "Precios diferenciados para horarios regulares y de alta demanda."
            },
            {
                "name": "Control de Acceso Basado en Roles (RBAC)",
                "description": "Sistema de permisos granulares con categorías extensibles desde la base de datos."
            },
            {
                "name": "Calendario Interactivo",
                "description": "Visualización y gestión centralizada de reservas en tiempo real."
            },
            {
                "name": "Panel de Estadísticas y Analítica",
                "description": "Dashboard con métricas clave: reservas, ocupación, cancelaciones y clientes frecuentes."
            },
            {
                "name": "Módulo de Inventario e Invoices",
                "description": "Control de recursos adicionales y sistema de facturación."
            }
        ],
        features: [
            "Gestión de múltiples negocios y sitios",
            "Generación dinámica de horarios sin solapamientos",
            "Precios diferenciados para horas pico",
            "Control de acceso por roles y permisos granulares",
            "Calendario interactivo para gestión en tiempo real",
            "Panel de estadísticas con métricas clave",
            "Gestión de inventarios y facturación"
        ],
        link: "https://canchitas.nexhora.co/",
    },
    {
        id: "parkia",
        name: "ParkIA",
        tagline: "Sistema de gestión de parqueaderos SaaS",
        description:
            "Sistema ERP modular en la nube que integra finanzas, inventario, talento humano y operaciones en una sola plataforma, con analítica predictiva y automatización.",
        image: [
            "/Products/canchas/canchas.webp",
            "/Products/canchas/dashboard.webp",
            "/Products/canchas/dashboard2.webp",
        ],
        icon: Layers,
        color: nexhoraColors[2],
        "modules": [
            {
                "name": "Gestión Multisitio",
                "description": "Administración de múltiples negocios y sitios de forma independiente pero centralizada."
            },
            {
                "name": "Generación Dinámica de Slots",
                "description": "Generación automática de horarios disponibles según reglas de negocio evitando solapamientos."
            },
            {
                "name": "Precios Dinámicos (Hora Pico)",
                "description": "Precios diferenciados para horarios regulares y de alta demanda."
            },
            {
                "name": "Control de Acceso Basado en Roles (RBAC)",
                "description": "Sistema de permisos granulares con categorías extensibles desde la base de datos."
            },
            {
                "name": "Calendario Interactivo",
                "description": "Visualización y gestión centralizada de reservas en tiempo real."
            },
            {
                "name": "Panel de Estadísticas y Analítica",
                "description": "Dashboard con métricas clave: reservas, ocupación, cancelaciones y clientes frecuentes."
            },
            {
                "name": "Módulo de Inventario e Invoices",
                "description": "Control de recursos adicionales y sistema de facturación."
            }
        ],
        features: [
            "Control de entrada/salida",
            "Tarifas dinámicas",
            "Facturación electrónica",
            "Analítica de ocupación",
            "Cierres de caja",
            "Gestión de mensualidades",
        ],
        link: "",
    },

];

import ProductModal from "./ProductModal";

function ProductCard({ product, onOpenModal }: { product: Product; onOpenModal: (product: Product) => void }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (!product.image || product.image.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === product.image.length - 1 ? 0 : prev + 1
            );
        }, 5000);
        return () => clearInterval(interval);
    }, [product.image]);

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {product.image && product.image.length > 0 ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative h-full w-full"
                        >
                            <Image
                                src={product.image[currentImageIndex]}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="flex h-full items-center justify-center bg-slate-200 text-slate-400">
                        <product.icon size={48} />
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-slate-900 transition-colors duration-200 group-hover:text-blue-700">
                    {product.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#076490]">
                    {product.tagline}
                </p>
                <p className="mt-4 line-clamp-4 text-pretty text-sm leading-relaxed text-slate-600">
                    {product.description}
                </p>

                <div className="mt-auto flex items-center gap-3 pt-6">
                    {product.link ? (
                        <a
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1a5fb4] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#164d91] hover:shadow-md active:scale-[0.98]"
                        >
                            Visitar sitio
                            <ExternalLink size={14} className="ml-0.5" />
                        </a>
                    ) : (
                        <button
                            disabled
                            className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
                        >
                            Visitar sitio
                            <ExternalLink size={14} className="ml-0.5" />
                        </button>
                    )}

                    <button
                        onClick={() => onOpenModal(product)}
                        className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#1a5fb4] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#1a5fb4] transition-all hover:bg-blue-50 active:scale-[0.98] hover:cursor-pointer"
                    >
                        Ver características
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function CatalogProducts() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 300); // Esperar a que termine la animación
    };

    return (
        <section className="w-full bg-[#f8fafd] py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-pretty text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Nuestras Plataformas
                    </h2>
                    <p className="text-pretty mt-4 text-lg text-slate-600">
                        Soluciones tecnológicas especializadas diseñadas para transformar la gestión y operación de tu negocio.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onOpenModal={handleOpenModal}
                        />
                    ))}
                </div>
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </section>
    );
}
