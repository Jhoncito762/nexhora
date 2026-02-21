"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Icon from "@/src/app/shared/Icon";
import Modal from "@/src/app/shared/Modal";

const { FaLinkedin, FaGithub, IoLogoWhatsapp } = Icon;

type ApiResponse = {
    ok: boolean;
    error?: string;
};

function parseApiResponse(raw: string): ApiResponse | null {
    if (!raw) return null;

    try {
        const data: unknown = JSON.parse(raw);
        if (typeof data !== "object" || data === null) return null;

        const record = data as Record<string, unknown>;
        if (typeof record.ok !== "boolean") return null;

        return {
            ok: record.ok,
            error: typeof record.error === "string" ? record.error : undefined,
        };
    } catch {
        return null;
    }
}

const COOLDOWN_TIME = 60000; // 60 segundos entre envíos
const LAST_SUBMIT_KEY = "nexhora_last_contact_submit";

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: "info" as "success" | "error" | "warning" | "info",
        title: "",
        message: "",
    });
    const [remainingTime, setRemainingTime] = useState(0);

    // Verificar cooldown al montar el componente y actualizar cada segundo
    useEffect(() => {
        const checkCooldown = () => {
            const lastSubmit = localStorage.getItem(LAST_SUBMIT_KEY);
            if (lastSubmit) {
                const elapsed = Date.now() - parseInt(lastSubmit, 10);
                const remaining = Math.max(0, COOLDOWN_TIME - elapsed);
                setRemainingTime(remaining);
            } else {
                setRemainingTime(0);
            }
        };

        checkCooldown();
        const interval = setInterval(checkCooldown, 1000);

        return () => clearInterval(interval);
    }, []);

    const showModal = (
        type: "success" | "error" | "warning" | "info",
        title: string,
        message: string
    ) => {
        setModalConfig({ type, title, message });
        setIsModalOpen(true);
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Verificar cooldown
        if (remainingTime > 0) {
            const seconds = Math.ceil(remainingTime / 1000);
            showModal(
                "warning",
                "Espera un momento",
                `Por favor espera ${seconds} segundos antes de enviar otro mensaje. Esto nos ayuda a prevenir spam.`
            );
            return;
        }

        const formEl = e.currentTarget;

        setLoading(true);

        const form = new FormData(formEl);

        const payload = {
            fullName: String(form.get("fullName") ?? ""),
            phone: String(form.get("phone") ?? ""),
            email: String(form.get("email") ?? ""),
            message: String(form.get("message") ?? ""),
            company: String(form.get("company") ?? ""),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const raw = await res.text();
            const data = parseApiResponse(raw);

            if (!res.ok) {
                showModal(
                    "error",
                    "Algo salió mal",
                    data?.error ||
                    "No pudimos procesar tu solicitud en este momento. Por favor verifica tu conexión a internet e inténtalo nuevamente. Si el problema persiste, contáctanos directamente."
                );
                return;
            }

            if (!data?.ok) {
                showModal(
                    "error",
                    "Error al enviar",
                    data?.error || "La solicitud no pudo ser procesada correctamente."
                );
                return;
            }

            // Éxito: guardar timestamp y limpiar formulario
            localStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());
            setRemainingTime(COOLDOWN_TIME);
            formEl.reset();

            showModal(
                "success",
                "¡Mensaje enviado!",
                "Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible."
            );
        } catch {
            showModal(
                "error",
                "Error de conexión",
                "No pudimos conectar con el servidor. Por favor verifica tu conexión a internet e inténtalo nuevamente."
            );
        } finally {
            setLoading(false);
        }
    }

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

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-12 sm:pb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-stretch">
                        <div className="w-full">
                            <div className="h-full bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl overflow-hidden">
                                <div className="h-2 w-full bg-linear-to-r from-[#f3f6fb] via-[#c7d6f0] to-[#4f79c7]" />

                                <div className="p-6 md:p-8 h-full flex flex-col">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex items-center justify-center border border-gray-300 rounded-xl p-2 bg-white">
                                            <Image
                                                src="/LogoWebp.webp"
                                                width={150}
                                                height={48}
                                                alt="Logo NexHora"
                                                className="h-8 sm:h-10 w-auto object-contain"
                                                priority
                                            />
                                        </div>

                                        <span className="hidden sm:inline-flex text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1">
                                            Atención comercial
                                        </span>
                                    </div>

                                    <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                                        Contáctanos
                                    </h1>

                                    <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-700 max-w-xl">
                                        Envíanos tu solicitud a nuestro correo y te respondemos lo
                                        antes posible.
                                    </p>

                                    <div className="mt-4 sm:mt-6 h-1 w-20 sm:w-28 rounded-full bg-linear-to-r from-[rgb(7,100,144)] to-[rgb(34,64,171)]" />

                                    <div className="mt-6 mb-6 md:mb-0">
                                        <p className="text-sm font-semibold text-gray-900">
                                            Síguenos
                                        </p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <a
                                                href="#"
                                                aria-label="LinkedIn"
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 transition hover:border-gray-400"
                                            >
                                                <FaLinkedin className="h-5 w-5" />
                                            </a>
                                            <a
                                                href="#"
                                                aria-label="GitHub"
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 transition hover:border-gray-400"
                                            >
                                                <FaGithub className="h-5 w-5" />
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

                                    <div className="hidden md:block mt-10 relative flex-1 min-h-50">
                                        <div className="absolute bottom-0 right-0">
                                            <Image
                                                src="/logobueno3d.webp"
                                                width={280}
                                                height={210}
                                                alt="Marca NexHora"
                                                className="object-contain opacity-95 w-70 h-auto"
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
                                    onSubmit={onSubmit}
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
                                            disabled={loading}
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
                                            disabled={loading}
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
                                            disabled={loading}
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
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Honeypot invisible (bots lo llenan) */}
                                    <input
                                        name="company"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        className="hidden"
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading || remainingTime > 0}
                                        className="mt-1 w-full bg-black px-4 py-3 text-white rounded-xl hover:bg-gray-700 transition disabled:opacity-60 disabled:hover:bg-black disabled:cursor-not-allowed"
                                    >
                                        {loading
                                            ? "Enviando..."
                                            : remainingTime > 0
                                                ? `Espera ${Math.ceil(remainingTime / 1000)}s`
                                                : "Enviar mensaje"}
                                    </button>

                                    <p className="text-xs text-gray-500 text-center">
                                        Al enviar aceptas que te contactemos para responder tu
                                        solicitud.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de retroalimentación */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.type === "error" ? "Reintentar" : "Aceptar"}
            />
        </main>
    );
}