import Icon from '@/src/app/shared/Icon'
import Image from 'next/image'
import React from 'react'

const { IoLogoWhatsapp } = Icon;

const ConsultancyContainer = () => {
    return (
        <div className='bg-grid-consultancy w-full flex flex-col md:flex-row items-center 
                justify-start md:justify-between min-h-screen p-6 md:p-10 gap-10'>
            <div className='md:w-[57%] flex flex-col gap-5 justify-center'>
                <h1 className='text-4xl md:text-5xl font-bold'>¿Listo para Transformar tu  Organización con Nexhora?</h1>
                <p className='mdw-[80%] text-lg text-justify'>Da el siguiente paso hacia la innovación digital sostenible, mejor gestión tecnológica y decisiones basadas en datos.</p>
                <button className='flex items-center gap-2 px-5 py-2 bg-black rounded-full text-white w-fit z-50 shadow-md hover:cursor-pointer hover:scale-105 transition duration-400'>
                    <IoLogoWhatsapp size={20} />
                    Agendar consultoria gratuita
                </button>
            </div>
            <Image
                src='/logo23d.webp'
                alt='Nexhora de frente'
                width={450}
                height={400}
            />
        </div>
    )
}

export default ConsultancyContainer