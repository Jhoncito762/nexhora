import Image from "next/image";
import Icon from "@/src/app/shared/Icon";

const { Linkedin, Github, IoLogoWhatsapp } = Icon;

export default function Page() {
    return (
        <main className="w-full min-h-screen bg-background">
            <section className="relative w-full overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-35" />

                <div
                    aria-hidden="true"
                    className="absolute -top-24 -right-35 h-105 w-105 rounded-full bg-linear-to-br from-[#f3f6fb] via-[#c7d6f0]/70 to-[#4f79c7] blur-3xl opacity-70"
                />
                <div
                    aria-hidden="true"
                    className="absolute -bottom-55 -left-45 h-130 w-130 rounded-full bg-linear-to-br from-[#f3f6fb] via-[#c7d6f0]/70 to-[#4f79c7] blur-3xl opacity-40"
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
                        <div className="w-full">
                            <div className="h-full bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl overflow-hidden">
                                <div className="h-2 w-full bg-linear-to-r from-[#f3f6fb] via-[#c7d6f0] to-[#4f79c7]" />

                                <div className="p-6 md:p-8 h-full flex flex-col">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center justify-center border border-gray-300 rounded-xl p-2 bg-white">
                                            <Image
                                                src="/LogoWebp.webp"
                                                width={150}
                                                height={48}
                                                alt="Logo NexHora"
                                                className="h-10 w-auto object-contain"
                                                priority
                                            />
                                        </div>

                                        <span className="hidden sm:inline-flex text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1">
                                            Atención comercial
                                        </span>
                                    </div>

                                    <h1 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900">
                                        Contáctanos
                                    </h1>

                                    <p className="mt-3 text-base md:text-lg text-gray-700 max-w-xl">
                                        Envíanos tu solicitud a nuestro correo y te respondemos lo antes posible.
                                    </p>

                                    <div className="mt-6 h-1 w-28 rounded-full bg-linear-to-r from-[rgb(7,100,144)] to-[rgb(34,64,171)]" />

                                    <div className="mt-6">
                                        <p className="text-sm font-semibold text-gray-900">Síguenos</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <a
                                                href="#"
                                                aria-label="LinkedIn"
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 transition hover:border-gray-400"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                            <a
                                                href="#"
                                                aria-label="GitHub"
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 transition hover:border-gray-400"
                                            >
                                                <Github className="h-5 w-5" />
                                            </a>
                                            <a
                                                href="#"
                                                aria-label="WhatsApp"
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 transition hover:border-gray-400"
                                            >
                                                <IoLogoWhatsapp className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mt-10 relative flex-1">
                                        <div className="absolute bottom-0 right-0">
                                            <Image
                                                src="/logobueno3d.webp"
                                                width={320}
                                                height={240}
                                                alt="Marca NexHora"
                                                className="object-contain opacity-95"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl overflow-hidden">
                                <div className="h-2 w-full bg-linear-to-r from-[#f3f6fb] via-[#c7d6f0] to-[#4f79c7]" />

                                <form
                                    className="p-6 md:p-8 flex flex-col gap-5"
                                    method="post"
                                    action="#"
                                >
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="fullName"
                                            className="text-sm font-medium text-gray-900"
                                        >
                                            Nombre completo
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900"
                                            placeholder="Tu nombre y apellido"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="phone"
                                            className="text-sm font-medium text-gray-900"
                                        >
                                            Teléfono
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            required
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900"
                                            placeholder="Ej: +57 300 000 0000"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="email"
                                            className="text-sm font-medium text-gray-900"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900"
                                            placeholder="tu@correo.com"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="message"
                                            className="text-sm font-medium text-gray-900"
                                        >
                                            Mensaje
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            required
                                            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900"
                                            placeholder="Escribe tu mensaje aquí..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-1 w-full bg-black px-4 py-3 text-white rounded-xl hover:bg-gray-700 transition"
                                    >
                                        Enviar mensaje
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
