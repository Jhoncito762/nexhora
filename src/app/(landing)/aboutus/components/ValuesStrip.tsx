import React, { ReactNode } from "react";

import Icon from "@/src/app/shared/Icon";

const { Globe, Leaf, Lock, Lightbulb } = Icon;

const values: Array<{
    icon: ReactNode;
    title: string;
    description: string;
    color: string;
}> = [
        {
            icon: <Lock className="h-5 w-5" />,
            title: "Seguridad",
            description: "Ciberseguridad en cada capa de nuestras soluciones.",
            color: "rgb(7,100,144)",
        },
        {
            icon: <Lightbulb className="h-5 w-5" />,
            title: "Innovación",
            description: "Soluciones de vanguardia con IA y tecnología emergente.",
            color: "rgb(24,98,190)",
        },
        {
            icon: <Leaf className="h-5 w-5" />,
            title: "Sostenibilidad",
            description: "Prácticas verdes alineadas con los ODS.",
            color: "rgb(16,132,170)",
        },
        {
            icon: <Globe className="h-5 w-5" />,
            title: "Impacto",
            description: "Transformación digital que beneficia a Colombia y al mundo.",
            color: "rgb(34,64,171)",
        },
    ];

export default function ValuesStrip() {
    return (
        <section className="w-full border-y border-border bg-gray-100/40 py-16">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
                    {values.map((v) => {
                        const rgb = v.color.replace("rgb(", "").replace(")", "");

                        return (
                            <div key={v.title} className="flex flex-col items-center gap-3 text-center">
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: `rgba(${rgb}, 0.12)`,
                                        color: v.color,
                                    }}
                                >
                                    {v.icon}
                                </div>
                                <h4 className="text-lg font-bold text-foreground">{v.title}</h4>
                                <p className="max-w-45 text-sm leading-relaxed text-muted-foreground">
                                    {v.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
