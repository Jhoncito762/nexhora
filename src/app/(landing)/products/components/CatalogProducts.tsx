"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Icon from "../../../shared/Icon";
import { motion, AnimatePresence } from "framer-motion";
import ProductModal from "./ProductModal";
import axiosPublic from "@/src/apis/axiosPublic";

const { ExternalLink } = Icon;

export interface ModuleSchema {
    name: string,
    description: string
}

export interface Product {
    producto_id: string;
    nombre: string;
    eslogan: string;
    descripcion: string;
    link_web: string;
    imagenes: string[];
}

type Modulo = {
    producto_modulo_id: number;
    producto_id: number;
    nombre: string;
    descripcion: string;
}

type Caracteristica = {
    producto_caracteristica_id: number;
    producto_id: number;
    descripcion: string;
    created_at: string;
    updated_at: string;
}

type Imagen = {
    producto_imagen_id: number;
    producto_id: number;
    url_imagen: string;
    alt: string;
    created_at: string;
    updated_at: string;
}

export interface ProductDetail {
    producto_id: string;
    nombre: string;
    eslogan: string;
    descripcion: string;
    link_web: string;
    created_at: string;
    updated_at: string;
    modulos: Modulo[];
    caracteristicas: Caracteristica[];
    imagenes: Imagen[];
}


function ProductCard({ products, onOpenModal }: { products: Product; onOpenModal: (products: Product) => void }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (!products.imagenes || products.imagenes.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === products.imagenes.length - 1 ? 0 : prev + 1
            );
        }, 5000);
        return () => clearInterval(interval);
    }, [products.imagenes]);

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {products.imagenes && products.imagenes.length > 0 ? (
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
                                src={products.imagenes[currentImageIndex]}
                                alt={products.nombre}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="flex h-full items-center justify-center bg-slate-200 text-slate-400">
                        NO HAY IMÁGENES
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-slate-900 transition-colors duration-200 group-hover:text-blue-700">
                    {products.nombre}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#076490]">
                    {products.eslogan}
                </p>
                <p className="mt-4 line-clamp-4 text-pretty text-sm leading-relaxed text-slate-600">
                    {products.descripcion}
                </p>

                <div className="mt-auto flex items-center gap-3 pt-6">
                    {products.link_web ? (
                        <a
                            href={products.link_web}
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
                        onClick={() => onOpenModal(products)}
                        className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#1a5fb4] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#1a5fb4] transition-all hover:bg-blue-50 active:scale-[0.98] hover:cursor-pointer"
                    >
                        Ver características
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function CatalogProducts({ initialProducts, initialError }: { initialProducts: Product[], initialError: boolean }) {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [loading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<String | null>(initialError ? "No se pudieron cargar los productos. Intente de nuevo" : null)


    const fetchProducts = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPublic.get<{ products: Product[] }>(process.env.NEXT_PUBLIC_PRODUCTS_PUBLIC!)

            const { products } = response.data

            setProducts(products);
        } catch (error) {
            setError("No se pudieron cargar los productos. Intente de nuevo")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = async (product: Product) => {
        setIsModalOpen(true);
        setLoadingDetail(true)
        try {
            const response = await axiosPublic.get<ProductDetail>(
                `${process.env.NEXT_PUBLIC_PRODUCTS_PUBLIC!}/${product.producto_id}`
            )

            setProductDetail(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingDetail(false)
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setProductDetail(null), 300);
    };

    return (
        <section className="w-full bg-[#f8fafd] py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-pretty text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Nuestros Productos
                    </h2>
                    <p className="text-pretty mt-4 text-lg text-slate-600">
                        Soluciones tecnológicas especializadas diseñadas para transformar la gestión y operación de tu negocio.
                    </p>
                </div>

                {loading ? (
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
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-red-500 font-semibold mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="rounded-lg bg-[#076490] px-5 py-2 text-sm font-semibold text-white hover:bg-[#065a82] transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard
                                key={product.producto_id}
                                products={product}
                                onOpenModal={handleOpenModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ProductModal
                product={productDetail}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                loading={loadingDetail}
            />
        </section>
    );
}
