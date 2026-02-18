import React from "react";

interface Services {
    id: number;
    title: string;
    description: string;
}

interface Information {
    description: string;
    services: Services[];
}

const information: Information = {
    description:
        "Tecnología, consultoría y capacitación en un solo ecosistema de transformación digital",
    services: [
        {
            id: 1,
            title: "Consultoría Digital",
            description:
                "Evaluamos la madurez tecnológica de tu organización con metodologías TRL/TDM. Diseñamos estrategias personalizadas de transformación digital, gobernanza de datos y arquitectura tecnológica. Del análisis a la implementación guiada.",
        },
        {
            id: 2,
            title: "IoT & Automatización",
            description:
                "Implementamos redes de sensores IoT para agricultura, industria y ciudades inteligentes. Automatización de procesos con Industry 4.0. Monitoreo en tiempo real de variables ambientales, productivas y operacionales. Conectividad rural y urbana.",
        },
        {
            id: 3,
            title: "Desarrolo de Software a medida",
            description:
                "Desarrollamos software web, móvil y de escritorio adaptado a tus procesos únicos. Integramos IA predictiva y generativa, analítica avanzada y arquitecturas cloud-native. Desde MVPs hasta sistemas enterprise escalables y seguros.",
        },
        {
            id: 4,
            title: "Campañas marketing",
            description:
                "Diseñamos campañas digitales completas que conectan con tu audiencia. Producción de videos, renders 3D, motion graphics y contenido para redes sociales. Estrategia de marca, SEO y publicidad digital. De la creatividad a la conversión.",
        },
    ],
};

const OurServices = () => {
    return (
        <section className="w-full my-15">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex flex-col items-center text-center">
                    <p className="bg-white px-3 py-2 border border-gray-300 rounded-lg mb-5 text-sm font-semibold w-fit">
                        Todo lo que necesitas
                    </p>

                    <div className="flex flex-col gap-5 items-center max-w-3xl">
                        <h1 className="text-3xl md:text-5xl font-bold">NUESTROS SERVICIOS</h1>
                        <p className="text-base md:text-lg text-gray-700">
                            {information.description}
                        </p>
                    </div>
                </div>

                {/* Mobile: carrusel con scroll | Desktop: grid */}
                <div className="mt-10 px-10">
                    <div className="
                        flex gap-6 overflow-x-auto pb-4 -mx-4 px-4
                        snap-x snap-mandatory scroll-smooth
                        md:grid md:overflow-visible md:mx-0 md:px-0
                        md:grid-cols-2 lg:grid-cols-4
                ">
                        {information.services.map((service) => (
                            <article
                                key={service.id}
                                className="
                                    snap-start
                                    min-w-70 md:min-w-0
                                    bg-white p-7 border border-gray-200 rounded-2xl shadow-md
                                    flex flex-col gap-3
                                    transition duration-300 hover:scale-[1.02]
                                    "
                            >
                                <h2 className="text-xl font-bold text-center">{service.title}</h2>
                                <p className="text-sm leading-6 text-gray-700 text-center">
                                    {service.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurServices;
