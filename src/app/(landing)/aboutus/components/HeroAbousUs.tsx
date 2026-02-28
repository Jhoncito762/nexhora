import React from 'react'

const HeroAbousUs = () => {
    return (
        <div className='w-full bg-linear-to-b from-[#f3f6fb] via-[#c7d6f0]/65 to-[#4f79c7]'>
            <div className="flex flex-col items-center gap-6 py-20 px-4 sm:px-8 md:px-16">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c7d6f0]/60 bg-white px-4 py-1.5 text-xs font-medium text-[#076490] shadow-[0_1px_3px_rgba(7,100,144,0.06)]">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#076490]/50" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#076490]" />
                    </span>
                    Sobre Nosotros
                </span>
                <h1 className='flex flex-col md:flex-row gap-3 text-6xl sm:text-4xl md:text-7xl font-bold text-center md:text-left'>
                    Conoce a <span className='bg-linear-to-r from-[rgb(7,100,144)] to-[rgb(34,64,171)] bg-clip-text text-transparent'>Nexhora</span>
                </h1>
                <p className='w-full md:w-[65%] text-center text-lg sm:text-xl text-gray-600 px-2 md:px-0'>
                    Seguridad, innovación y sostenibilidad en un mismo código. Construimos un futuro digital confiable, accesible y humano.
                </p>
                <div className="flex flex-wrap gap-3 justify-center mt-5 px-10 md:px-0">
                    <p className='w-fit bg-white border border-gray-300 rounded-full px-7 py-2 text-sm font-medium text-center'>
                        Seguridad, innovación y sostenibilidad en un mismo código.
                    </p>
                    <p className='w-fit bg-white border border-gray-300 rounded-full px-7 py-2 text-sm font-medium text-center'>
                        Tecnología confiable para un futuro sostenible.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HeroAbousUs