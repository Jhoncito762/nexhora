"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Icon from "@/src/app/shared/Icon";
import axiosPublic from "@/src/apis/axiosPublic";

const { RiGlobalFill } = Icon;

interface TeamMember {
    nombre: string;
    foto: string;
    cargo: string;
    link_web: string;
}


export default function TeamSection() {
    const [admin, setAdmin] = useState<TeamMember[]>([])
    const [error, setError] = useState<String | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchAdmins = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPublic<{ users: TeamMember[] }>(
                process.env.NEXT_PUBLIC_ADMIN_USERS!
            )

            const { users } = response.data

            setAdmin(users)
        } catch (error) {
            setError('No se pudieron traer los admins')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

    return (
        <section className="w-full bg-white py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-6">
                {/* Heading */}
                <div className="mb-16 text-center">
                    <p className="mx-auto mb-4 w-fit rounded-lg border border-border bg-card px-4 py-1.5 text-sm font-semibold text-card-foreground">
                        Nuestro Equipo
                    </p>
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
                        <span className="text-balance">Las personas detrás de Nexhora</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
                        Un equipo interdisciplinario comprometido con la innovación, la seguridad y el impacto social positivo.
                    </p>
                </div>

                {/* Team grid */}
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
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-red-500 font-semibold mb-4">{error}</p>
                        <button
                            onClick={fetchAdmins}
                            className="rounded-lg bg-[#076490] px-5 py-2 text-sm font-semibold text-white hover:bg-[#065a82] transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {admin.map((admin, i) => {
                            const colors = [
                                "rgb(7,100,144)",
                                "rgb(16,132,170)",
                                "rgb(24,98,190)",
                                "rgb(34,64,171)",
                            ];
                            const color = colors[i % colors.length];
                            const rgb = color.replace("rgb(", "").replace(")", "");

                            return (
                                <article
                                    key={admin.nombre}
                                    className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-card p-6 pt-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg"
                                >
                                    {/* Top accent */}
                                    <div
                                        className="absolute left-0 top-0 h-1 w-full"
                                        style={{
                                            background: `linear-gradient(90deg, ${color}, rgba(${rgb}, 0.3))`,
                                        }}
                                    />

                                    {/* Avatar */}
                                    <div
                                        className="mb-5 overflow-hidden rounded-full border-[3px] p-0.5"
                                        style={{ borderColor: `rgba(${rgb}, 0.35)` }}
                                    >
                                        {admin.foto ? (
                                            <Image
                                                src={admin.foto}
                                                alt={`Foto de ${admin.nombre}`}
                                                width={120}
                                                height={120}
                                                className="h-28 w-28 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-28 w-28 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                                                {admin.nombre?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <h3 className="text-lg font-bold text-card-foreground">{admin.nombre}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{admin.cargo}</p>

                                    {/* Social links */}
                                    <div className="mt-4 flex items-center gap-3">

                                        {admin.link_web && (
                                            <a
                                                href={admin.link_web}
                                                aria-label={`GitHub de ${admin.link_web}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                                                style={{
                                                    backgroundColor: `rgba(${rgb}, 0.1)`,
                                                    color: color,
                                                }}
                                            >
                                                <RiGlobalFill className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
