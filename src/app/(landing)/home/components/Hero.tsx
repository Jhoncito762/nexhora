'use client';
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';

const information = {
    description: 'Acompañamos empresas, instituciones y gobiernos en su transformación digital sostenible. Consultoría, IA responsable y desarrollo tecnológico alineado con los ODS.'
}

const Hero = () => {
    return (
        <div className="w-full bg-linear-to-b from-[#f3f6fb] via-[#c7d6f0]/65 to-[#4f79c7]">
            <div className="flex flex-col md:flex-row gap-10 mx-10 my-20">

                <div className="flex flex-col gap-6 w-full md:w-[43%] md: mt-10">

                    <p className=" w-fit bg-white border border-gray-300 rounded-lg px-4 py-1 text-sm font-medium">
                        Bienvenido a Nexhora!
                    </p>

                    <h1 className="text-5xl md:text-7xl font-bold
                        bg-linear-to-b from-[rgb(7,100,144)] to-[rgb(34,64,171)]
                        bg-clip-text text-transparent"
                    >
                        Tecnología con propósito

                    </h1>

                    <p className="text-lg text-gray-700 my-6">
                        {information.description}
                    </p>

                    <div className="flex items-center gap-5">
                        <Link href={"/aboutus"}>
                            <button className="bg-black px-4 py-2 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 hover:cursor-pointer">
                                Conocer más
                            </button>
                        </Link>

                        <Link href={"/services"}>
                            <button className="text-black hover:underline hover:cursor-pointer">
                                Nuestros servicios
                            </button>

                        </Link>
                    </div>

                </div>
                <div className="md:w-[57%]  flex items-center justify-center">
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Image
                            src="/logobueno3d.webp"
                            width={500}
                            height={300}
                            alt='Logo 3D Nexhora'
                        />
                    </motion.div>

                </div>
            </div>
        </div>

    )
}

export default Hero