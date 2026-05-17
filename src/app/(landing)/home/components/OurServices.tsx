"use client"

import { useEffect, useState } from "react";
import axiosPublic from "@/src/apis/axiosPublic";
import Link from "next/link";

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
                <div className="mt-10 px-10">
                    <div className="
                        flex gap-6 overflow-x-auto pb-4 -mx-4 px-4
                        snap-x snap-mandatory scroll-smooth
                        md:grid md:overflow-visible md:mx-0 md:px-0
                        md:grid-cols-2 lg:grid-cols-4
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
                </div>
                <Link href="/services" className="text-white bg-black px-5 py-2 rounded-lg hover:cursor-pointer">
                    Ver todos
                </Link>
            </div>
        </section>
    );
};

export default OurServices;
