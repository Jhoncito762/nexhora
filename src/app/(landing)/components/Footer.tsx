import Image from "next/image";
import Link from "next/link";
import Icon from "@/src/app/shared/Icon";

const { FaFacebookF, FaLinkedin, IoLogoWhatsapp, RiInstagramFill, FaTiktok } = Icon;

export default function Footer() {
    return (
        <footer className="w-full bg-black text-white">
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        <div className="md:col-span-6">
                            <Link
                                href="/home"
                                className="inline-flex items-center border border-white/15 rounded-xl p-2 bg-white"
                                aria-label="Ir al inicio"
                            >
                                <Image
                                    src="/LogoWebp.webp"
                                    width={160}
                                    height={52}
                                    alt="Logo NexHora"
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>

                            <p className="mt-5 text-sm text-white/80 max-w-lg">
                                Tecnología con propósito: consultoría, IA responsable y desarrollo
                                tecnológico para organizaciones que buscan impacto.
                            </p>

                            <div className="mt-6 flex items-center gap-3">
                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/90 transition hover:bg-white/10 hover:text-white"
                                >
                                    <FaFacebookF className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="GitHub"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/90 transition hover:bg-white/10 hover:text-white"
                                >
                                    <FaLinkedin className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="WhatsApp"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/90 transition hover:bg-white/10 hover:text-white"
                                >
                                    <IoLogoWhatsapp className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Sitio web"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/90 transition hover:bg-white/10 hover:text-white"
                                >
                                    <RiInstagramFill className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Sitio web"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/90 transition hover:bg-white/10 hover:text-white"
                                >
                                    <FaTiktok className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        <div className="md:col-span-6 md:justify-self-end">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-sm font-semibold tracking-wide">Navegación</p>
                                    <nav className="mt-4 flex flex-col gap-3 text-sm">
                                        <Link href="/home" className="text-white/80 hover:text-white">
                                            Inicio
                                        </Link>
                                        <Link
                                            href="/services"
                                            className="text-white/80 hover:text-white"
                                        >
                                            Servicios
                                        </Link>
                                        <Link
                                            href="/aboutus"
                                            className="text-white/80 hover:text-white"
                                        >
                                            Sobre Nosotros
                                        </Link>
                                        <Link
                                            href="/products"
                                            className="text-white/80 hover:text-white"
                                        >
                                            Productos
                                        </Link>
                                        <Link
                                            href="/contactus"
                                            className="text-white/80 hover:text-white"
                                        >
                                            Contacto
                                        </Link>
                                    </nav>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold tracking-wide">NexHora</p>
                                    <p className="mt-4 text-sm text-white/80">
                                        NexHora SAS
                                        <br />
                                        Transformación digital sostenible.
                                    </p>

                                    <p className="mt-6 text-sm font-semibold tracking-wide">Síguenos</p>
                                    <p className="mt-2 text-xs text-white/60">
                                        Links
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2 sm:gap-6 sm:items-center sm:justify-between">
                        <p className="text-xs text-white/60">
                            © NexHora SAS. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-white/60">Hecho en Colombia.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}