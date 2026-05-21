"use client"

import { useEffect, useState } from "react";
import axiosPublic from "@/src/apis/axiosPublic";
import Link from "next/link";
import Icon from "@/src/app/shared/Icon";

type Servicio = {
    servicio_id: number;
    nombre: string;
    descripcion: string;
    caracteristicas: string[];
};

interface Information {
    description: string;
}

const information: Information = {
    description:
        "Tecnología, consultoría y capacitación en un solo ecosistema de transformación digital",

};

const OurServices = () => {

    const [services, setServices] = useState<Servicio[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<String | null>(null)

    const fetchServices = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axiosPublic.get<{ services: Servicio[] }>(
                process.env.NEXT_PUBLIC_PUBLIC_SERVICES!
            )

            const { services } = response.data;

            setServices(services)
        } catch (error) {
            setError("No se pudieron cargar los productos. Intente de nuevo")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])
    return (
        <section className="w-full my-15">
            <div className="mx-auto max-w-6xl px-4 flex flex-col items-center">
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
                <div className="mt-10 px-10 w-full">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <Icon.Loader2Icon size={48} className="animate-spin text-[#076490]" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <Icon.AlertCircle size={40} className="text-red-500" />
                            <p className="text-red-500 font-semibold">{error}</p>
                            <button
                                onClick={fetchServices}
                                className="rounded-lg bg-[#076490] px-5 py-2 text-sm font-semibold text-white hover:bg-[#065a82] transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <Icon.Briefcase size={48} className="text-gray-400" />
                            <p className="text-gray-500 font-medium text-base">No hay servicios disponibles en el momento</p>
                            <p className="text-gray-400 text-sm">Vuelve a intentarlo más tarde</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5 items-center">

                            <div className="
                                flex gap-6 overflow-x-auto pb-4 -mx-4 px-4
                                snap-x snap-mandatory scroll-smooth
                                md:grid md:overflow-visible md:mx-0 md:px-0
                                md:grid-cols-2 lg:grid-cols-4
                                w-full
                            ">
                                {services.slice(0, 4).map((service) => (
                                    <article
                                        key={service.servicio_id}
                                        className="
                                            snap-start
                                            min-w-70 md:min-w-0
                                            bg-white p-7 border border-gray-200 rounded-2xl shadow-md
                                            flex flex-col gap-3
                                            transition duration-300 hover:scale-[1.02]
                                            "
                                    >
                                        <h2 className="text-xl font-bold text-center">{service.nombre}</h2>
                                        <p className="text-sm leading-6 text-gray-700 text-center">
                                            {service.descripcion}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            {services.length > 0 && (
                                <Link href="/services" className="text-white bg-black px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors w-fit">
                                    Ver todos
                                </Link>
                            )}
                        </div>

                    )}
                </div>

            </div>
        </section>
    );
};

export default OurServices;
