"use client";

import { useEffect, useRef } from "react";
import Icon from "@/src/app/shared/Icon";

const { Package } = Icon;

export default function HeroCatalog() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            containerRef.current.style.setProperty("--mouse-x", `${x}%`)
            containerRef.current.style.setProperty("--mouse-y", `${y}%`)
        }
        const el = containerRef.current
        el?.addEventListener("mousemove", handleMouseMove)
        return () => el?.removeEventListener("mousemove", handleMouseMove)
    }, [])



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
            <div
                className="pointer-events-none absolute inset-0 opacity-30 transition-opacity"
                style={{
                    background:
                        "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(7,100,144,0.18), transparent 60%)",
                }}
            />

            <div className="relative mx-auto max-w-5xl px-6 text-center">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c7d6f0]/60 bg-white px-4 py-1.5 text-xs font-medium text-[#076490] shadow-[0_1px_3px_rgba(7,100,144,0.06)]">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#076490]/50" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#076490]" />
                    </span>
                    Catalogo de productos
                </span>

                <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    <span className="text-foreground">Software que </span>
                    <span
                        className="bg-clip-text text-transparent"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, rgb(7,100,144), rgb(34,64,171))",
                        }}
                    >
                        transforma
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                    {"Soluciones de software innovadoras, seguras y sostenibles dise\u00f1adas para impulsar la transformaci\u00f3n digital de tu organizaci\u00f3n."}
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {[
                        { label: "Productos activos", value: "6+" },
                        { label: "Clientes satisfechos", value: "120+" }
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

    )
}
