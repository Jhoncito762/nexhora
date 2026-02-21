"use client";

import { useEffect } from "react";

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: "success" | "error" | "warning" | "info";
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    showCancel?: boolean;
};

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    type = "info",
    confirmText = "Aceptar",
    cancelText = "Cerrar",
    onConfirm,
    showCancel = false,
}: ModalProps) {
    // Cerrar con tecla Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        // Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const iconConfig = {
        success: {
            bg: "bg-linear-to-br from-[#f3f6fb] via-[#c7d6f0]/70 to-[#4f79c7]/30",
            icon: (
                <svg
                    className="h-12 w-12 text-[#076490]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            ),
        },
        error: {
            bg: "bg-red-100",
            icon: (
                <svg
                    className="h-12 w-12 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            ),
        },
        warning: {
            bg: "bg-yellow-100",
            icon: (
                <svg
                    className="h-12 w-12 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            ),
        },
        info: {
            bg: "bg-blue-100",
            icon: (
                <svg
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
    };

    const config = iconConfig[type];

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Cerrar"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Barra superior de color */}
                <div
                    className={`h-2 w-full rounded-t-2xl ${type === "success"
                        ? "bg-linear-to-r from-[#f3f6fb] via-[#c7d6f0] to-[#4f79c7]"
                        : type === "error"
                            ? "bg-red-500"
                            : type === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                        }`}
                />

                <div className="p-6 sm:p-8">
                    {/* Icono */}
                    <div className="flex justify-center mb-4">
                        <div
                            className={`flex items-center justify-center w-20 h-20 rounded-full ${config.bg}`}
                        >
                            {config.icon}
                        </div>
                    </div>

                    {/* Título */}
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                        {title}
                    </h2>

                    {/* Mensaje */}
                    <p className="text-gray-700 text-center mb-6 whitespace-pre-line">
                        {message}
                    </p>

                    {/* Botones */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
                        {showCancel && (
                            <button
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={handleConfirm}
                            className={`px-6 py-3 text-white rounded-xl font-medium transition ${type === "error"
                                ? "bg-red-600 hover:bg-red-700"
                                : type === "warning"
                                    ? "bg-yellow-600 hover:bg-yellow-700"
                                    : type === "success"
                                        ? "bg-linear-to-r from-[rgb(7,100,144)] to-[rgb(34,64,171)] hover:opacity-90"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
