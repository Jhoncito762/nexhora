import Icon from "@/src/app/shared/Icon";
import React, { ReactNode } from "react";

const { LuUsers, Sparkles, Target, LuLeaf } = Icon;

interface InformationCards {
    id: number;
    title: string;
    subtitle: string;
    icon: ReactNode;
    color: string;
}

const AboutUsInformation: InformationCards[] = [
    {
        id: 1,
        title: "+50",
        subtitle: "proyectos implementados",
        icon: <Sparkles size={24} />,
        color: "rgb(7,100,144)",
    },
    {
        id: 2,
        title: "Aliados:",
        subtitle: "AmITIC, USCO, SENA",
        icon: <LuUsers size={24} />,
        color: "rgb(16,132,170)",
    },
    {
        id: 3,
        title: "Alineados",
        subtitle: "con ODS y ética digital",
        icon: <Target size={24} />,
        color: "rgb(24,98,190)",
    },
    {
        id: 4,
        title: "Enfoque",
        subtitle: "humanista y sostenible",
        icon: <LuLeaf size={24} />,
        color: "rgb(34,64,171)",
    },
];

const AboutUs = () => {
    return (
        <section className="w-full mb-10">
            <div className="mx-auto max-w-6xl px-4 flex flex-col gap-6 items-center text-center">
                {/* Headline */}
                <div className="font-bold leading-tight">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl">Más que tecnología,</h1>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl bg-linear-to-r from-[rgb(7,100,144)] to-[rgb(34,64,171)] bg-clip-text text-transparent">
                        transformación
                    </h1>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl">con propósito</h1>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl">
                    Somos un equipo interdisciplinario de expertos en innovación, IA y sostenibilidad tecnológica.
                    Acompañamos a empresas, instituciones y gobiernos en su transformación digital responsable.
                </p>

                {/* Cards: 2 columnas en móvil, 4 en desktop */}
                <div className="w-full mt-2 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 place-items-center">
                    {AboutUsInformation.map((info) => {
                        const rgb = info.color.replace("rgb(", "").replace(")", ""); // "7,100,144"

                        return (
                            <div
                                key={info.id}
                                className="w-full max-w-55 flex flex-col items-center text-center gap-3"
                            >
                                <div
                                    className="h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor: `rgba(${rgb}, 0.14)`,
                                        color: info.color,
                                    }}
                                >
                                    {info.icon}
                                </div>

                                <h3 className="text-xl md:text-2xl font-extrabold" style={{ color: info.color }}>
                                    {info.title}
                                </h3>

                                <p className="text-sm md:text-base text-gray-500 leading-snug">
                                    {info.subtitle}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
