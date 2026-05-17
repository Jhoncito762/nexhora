"use client";

import { useEffect, useRef } from "react";
import Icon from "@/src/app/shared/Icon";

const { CalendarsIcon } = Icon;

export default function HeroEvents({ eventCount }: { eventCount: number }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            containerRef.current.style.setProperty("--mouse-x", `${x}%`);
            containerRef.current.style.setProperty("--mouse-y", `${y}%`);
        };
        const el = containerRef.current;
        el?.addEventListener("mousemove", handleMouseMove);
        return () => el?.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full overflow-hidden py-24 md:py-32"
            style={
                {
                    "--mouse-x": "50%",
                    "--mouse-y": "50%",
                    background:
                        "linear-gradient(180deg, #f3f6fb 0%, rgba(199,214,240,0.65) 40%, #4f79c7 100%)",
                } as React.CSSProperties
            }
        >
            {/* Mouse radial glow */}
            <div
                className="pointer-events-none absolute inset-0 opacity-30 transition-opacity"
                style={{
                    background:
                        "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(7,100,144,0.18), transparent 60%)",
                }}
            />

            {/* Decorative blobs */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#4f79c7]/10 blur-[100px]" />
                <div className="absolute bottom-0 -left-16 h-72 w-72 rounded-full bg-[#076490]/8 blur-[80px]" />
            </div>

            <div className="relative mx-auto max-w-5xl px-6 text-center">
                {/* Badge */}
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c7d6f0]/60 bg-white px-4 py-1.5 text-xs font-medium text-[#076490] shadow-[0_1px_3px_rgba(7,100,144,0.06)]">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#076490]/50" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#076490]" />
                    </span>
                    Eventos y Foros
                </span>

                {/* Heading */}
                <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    <span className="text-foreground">Eventos que </span>
                    <span
                        className="bg-clip-text text-transparent"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, rgb(7,100,144), rgb(34,64,171))",
                        }}
                    >
                        conectan
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                    Webinars, foros y encuentros donde compartimos conocimiento, experiencias y
                    avanzamos juntos en la transformación digital.
                </p>

                {/* Stats */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {[
                        { label: "Eventos realizados", value: `${eventCount}+`, icon: CalendarsIcon },
                        { label: "Comunidad activa", value: "120+" },
                    ].map((stat) => (
                        <span
                            key={stat.label}
                            className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-2 text-sm font-medium text-card-foreground backdrop-blur-sm"
                        >
                            <span
                                className="text-base font-bold"
                                style={{ color: "rgb(7,100,144)" }}
                            >
                                {stat.value}
                            </span>
                            {stat.label}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
