import Icon from '@/src/app/shared/Icon';
import React, { ReactNode } from 'react'

const { Rocket, Eye } = Icon;


interface InformationCards {
    id: number;
    title: string;
    subtitle: string;
    icon: ReactNode;
    color: string;

}

const Information: InformationCards[] = [
    {
        id: 1,
        title: "Misión",
        subtitle: "Nexhora contribuye con tecnologías funcionales para las personas y el planeta, donde la empresa desarrolla soluciones innovadoras que van desde software y ciberseguridad hasta dispositivos inteligentes e infraestructura digital, ayudando a organizaciones, emprendedores, entidades públicas y privadas a crecer de manera responsable y sostenible. Integra los Objetivos de Desarrollo Sostenible en cada proyecto, evalúa la madurez tecnológica (TRL) para asegurar viabilidad, y apuesta por prácticas verdes que cuiden el entorno. Su compromiso es con la innovación técnica: la organización trabaja para construir un futuro digital confiable, accesible y humano, donde la tecnología sea una herramienta de transformación que beneficie a Colombia y al mundo.",
        icon: <Rocket size={24} />,
        color: "rgb(7,100,144)",
    },
    {
        id: 2,
        title: "Visión",
        subtitle: "Para 2035, Nexhora será reconocida como referente latinoamericano en transformación digital sostenible, donde cada proyecto tecnológico que desarrolle habrá contribuido tangiblemente a fortalecer la calidad de vida de las personas y la salud del planeta. La empresa aspira a que sus soluciones están presentes en organizaciones de toda Colombia y la región, impulsando economías circulares, reduciendo brechas digitales y democratizando el acceso a tecnología segura y responsable.",
        icon: <Eye size={24} />,
        color: "rgb(34,64,171)",
    },

]

const MissionVission = () => {
    return (
        <div className='w-full'>
            <div className="flex flex-col items-center gap-6 py-20">
                <div className="flex flex-col gap-4 items-center">
                    <h1 className='text-4xl font-bold'>
                        Nuestra esencia
                    </h1>
                    <p className='text-gray-400 w-[70%] text-center'>La brújula que guía cada proyecto, cada línea de código y cada decisión en Nexhora.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 w-[83%]">
                    {Information.map((info) => {
                        const rgb = info.color.replace("rgb(", "").replace(")", "")
                        return (
                            <article
                                key={info.id}
                                className="group relative overflow-hidden rounded-2xl border border-gray-200 p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg md:p-10"
                            >
                                <div
                                    className="absolute left-0 top-0 h-1 w-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${info.color}, rgba(${rgb}, 0.3))`,
                                    }}
                                />
                                <div className="mb-6 flex items-center gap-3">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: `rgba(${rgb}, 0.12)`,
                                            color: info.color,
                                        }}
                                    >
                                        {info.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold">
                                        {info.title}
                                    </h3>
                                </div>

                                <p className="text-pretty leading-7 text-gray-500">
                                    {info.subtitle}
                                </p>
                            </article>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default MissionVission