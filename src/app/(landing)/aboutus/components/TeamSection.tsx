import Image from "next/image";
import React from "react";

import Icon from "@/src/app/shared/Icon";

const { FaGithub, FaLinkedin } = Icon;

interface TeamMember {
    name: string;
    role: string;
    image: string;
    linkedin?: string;
    github?: string;
}

const team: TeamMember[] = [
    {
        name: "Irlesa",
        role: "CEO & Fundador",
        image: "/fotoJhon.webp",
        linkedin: "#",
    },
    {
        name: "Jorge Martinez",
        role: "CTO & Arquitecta de Software",
        image: "/fotoJhon.webp",
        linkedin: "#",
    },
    {
        name: "Andres Trivino",
        role: "Partner & Developer",
        image: "/fotoJhon.webp",
        linkedin: "#",
        github: "#",
    },
    {
        name: "Cristian Alvira",
        role: "Partner & Developer",
        image: "/fotoJhon.webp",
        linkedin: "#",
        github: "#",
    },
    {
        name: "Manuel Navarro",
        role: "Partner & Developer",
        image: "/fotoJhon.webp",
        linkedin: "#",
        github: "#",
    },
    {
        name: "Jhon Pulido",
        role: "Partner & Developer",
        image: "/fotoJhon.webp",
        linkedin: "#",
        github: "#",
    },

];

export default function TeamSection() {
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
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {team.map((member, i) => {
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
                                key={member.name}
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
                                    <Image
                                        src={member.image}
                                        alt={`Foto de ${member.name}`}
                                        width={120}
                                        height={120}
                                        className="h-28 w-28 rounded-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <h3 className="text-lg font-bold text-card-foreground">{member.name}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>

                                {/* Social links */}
                                <div className="mt-4 flex items-center gap-3">
                                    {member.linkedin && (
                                        <a
                                            href={member.linkedin}
                                            aria-label={`LinkedIn de ${member.name}`}
                                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                                            style={{
                                                backgroundColor: `rgba(${rgb}, 0.1)`,
                                                color: color,
                                            }}
                                        >
                                            <FaLinkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {member.github && (
                                        <a
                                            href={member.github}
                                            aria-label={`GitHub de ${member.name}`}
                                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                                            style={{
                                                backgroundColor: `rgba(${rgb}, 0.1)`,
                                                color: color,
                                            }}
                                        >
                                            <FaGithub className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
