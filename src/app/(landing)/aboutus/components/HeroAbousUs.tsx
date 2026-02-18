import React from 'react'



const HeroAbousUs = () => {
    return (
        <div className='w-full  bg-linear-to-b from-[#f3f6fb] via-[#c7d6f0]/65 to-[#4f79c7]'>
            <div className="flex flex-col items-center gap-6 py-20">
                <p className=" w-fit bg-white border border-gray-300 rounded-xl px-5 py-2 text-sm font-medium">
                    Sobre Nosotros
                </p>
                <h1 className='flex gap-3 text-7xl font-bold'>Conoce a <p className='bg-linear-to-r from-[rgb(7,100,144)] to-[rgb(34,64,171)] bg-clip-text text-transparent'>Nexhora</p></h1>
                <p className='w-[65%] text-center text-xl text-gray-600'>
                    Seguridad, innovación y sostenibilidad en un mismo código. Construimos un futuro digital confiable, accesible y humano.
                </p>
                <div className="flex gap-3 mt-5">
                    <p className='w-fit bg-white border border-gray-300 rounded-full px-7 py-2 text-sm font-medium'>
                        Seguridad, innovación y sostenibilidad en un mismo código.
                    </p>
                    <p className='w-fit bg-white border border-gray-300 rounded-full px-7 py-2 text-sm font-medium'>
                        Tecnología confiable para un futuro sostenible.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HeroAbousUs