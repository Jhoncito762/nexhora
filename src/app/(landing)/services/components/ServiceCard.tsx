"use client";

import React, { useState } from "react";
import Icon from "../../../shared/Icon";
import { ChevronDown } from "lucide-react";

type ServiceCategory = {
    id: number;
    title: string;
    description: string;
    services: string[];
    differential?: string;
};

const iconMap: Record<number, React.ElementType> = {
    1: Icon.Lightbulb,
    2: Icon.Cpu,
    3: Icon.Target,
    4: Icon.Leaf,
    5: Icon.BarChart3,
    6: Icon.GraduationCap,
    7: Icon.Network,
    8: Icon.ShieldCheck,
};

export default function ServiceCard({ category }: { category: ServiceCategory }) {
    const [isOpen, setIsOpen] = useState(false);
    const IconComponent = iconMap[category.id];

    return (
        <article className="group relative flex flex-col rounded-2xl border border-[#c7d6f0]/50 bg-white transition-all duration-300 hover:border-[#4f79c7]/40 hover:shadow-[0_12px_48px_-8px_rgba(34,64,171,0.1)]">
            <div className="flex flex-1 flex-col p-6">
                {/* Header row */}
                <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f6fb] transition-colors duration-300 group-hover:bg-[#c7d6f0]/40">
                        <IconComponent size={20} className="text-[#076490]" />
                    </div>
                    <span className="font-mono text-[11px] font-medium tracking-widest text-[#c7d6f0]">
                        {String(category.id).padStart(2, "0")}
                    </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 text-[15px] font-semibold leading-snug text-[#1a2847] text-balance">
                    {category.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-[13px] leading-relaxed text-[#64748b]">
                    {category.description}
                </p>

                {/* Differential badge */}
                {category.differential && (
                    <div className="mt-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#076490]/10 bg-[#076490]/5 px-3 py-1 text-[11px] font-medium text-[#076490]">
                            <Icon.Sparkles size={10} />
                            {category.differential}
                        </span>
                    </div>
                )}

                {/* Expandable services */}
                <div className="mt-auto pt-5">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#c7d6f0]/40 bg-[#f3f6fb]/60 px-4 py-2.5 text-[13px] font-medium text-[#2240ab] transition-all duration-200 hover:border-[#4f79c7]/30 hover:bg-[#f3f6fb]"
                        aria-expanded={isOpen}
                    >
                        <span>{isOpen ? "Ocultar servicios" : "Ver servicios"}</span>
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    <div
                        className={`grid transition-all duration-400 ease-in-out ${isOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                    >
                        <div className="overflow-hidden">
                            <ul className="mt-4 flex flex-col gap-2.5">
                                {category.services.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5">
                                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#076490]/8">
                                            <Icon.Check
                                                size={9}
                                                className="text-[#076490]"
                                                strokeWidth={3}
                                            />
                                        </span>
                                        <span className="text-[13px] leading-relaxed text-[#475569]">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
