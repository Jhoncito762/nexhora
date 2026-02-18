'use client';
import Link from 'next/link'
import React, { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

const NavBar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white/30 backdrop-blur-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center border border-gray-400 rounded-lg p-1">
                        <img
                            src="/LogoWebp.webp"
                            alt="Logo NexHora"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    <nav className="hidden md:flex space-x-6 items-center">
                        <a href="/home" className="text-black hover:cursor-pointer">
                            Inicio
                        </a>
                        <Link href="/services" className="text-black hover:cursor-pointer">
                            Servicios
                        </Link>
                        <a href="/aboutus" className="text-black hover:cursor-pointer">
                            Sobre Nosotros
                        </a>
                        <Link href="/contactus" className="text-white bg-black px-3 py-2 rounded-lg hover:cursor-pointer">
                            Contacto
                        </Link>
                    </nav>

                    {/* Botón hamburguesa para móvil */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
                        aria-label="Abrir menú"
                    >
                        <span
                            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                                }`}
                        ></span>
                        <span
                            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : ''
                                }`}
                        ></span>
                        <span
                            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                                }`}
                        ></span>
                    </button>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="md:hidden overflow-hidden bg-white/10 backdrop-blur-md"
                        >
                            <a className="block py-3 px-4">Inicio</a>
                            <a className="block py-3 px-4">Servicios</a>
                            <a className="block py-3 px-4">Contacto</a>
                        </motion.nav>
                    )}
                </AnimatePresence>
                {/* <div
                    className={`md:hidden overflow-hidden
                    transition-[max-height,opacity] duration-300 ease-in-out
                    ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
                >
                    <nav className="py-4 space-y-3 bg-white">
                        <a className="block">Inicio</a>
                        <a className="block">Servicios</a>
                        <a className="block">Contacto</a>
                    </nav>
                </div> */}
            </div>
        </header>

    )
}

export default NavBar