"use client";

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { wrap } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SPEED = 80; // px/seg (ajusta a tu gusto)

export default function LogoCarousel() {
    const logos = [
        { src: "/Carousel/reina.webp", alt: "Reina" },
        { src: "/Carousel/amitic.webp", alt: "AmITIC" },
        { src: "/Carousel/elojim.webp", alt: "Elojim" },
    ];

    const direction = -1;

    const x = useMotionValue(0);
    const setRef = useRef<HTMLDivElement>(null);
    const [setWidth, setSetWidth] = useState(0);

    useEffect(() => {
        const el = setRef.current;
        if (!el) return;

        const measure = () => setSetWidth(el.scrollWidth);

        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(el);

        // por si las imágenes cargan después
        const t = setTimeout(measure, 250);

        return () => {
            clearTimeout(t);
            ro.disconnect();
        };
    }, []);

    // Movimiento continuo sin reset (cero cortes)
    useAnimationFrame((t, delta) => {
        if (!setWidth) return;

        const moveBy = (direction * SPEED * delta) / 1000; // px por frame
        const next = x.get() + moveBy;

        // wrap entre -setWidth y 0 para loop perfecto
        x.set(wrap(-setWidth, 0, next));
    });

    return (
        <div
            className="
                w-full overflow-hidden py-10
                mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
                [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
                mask-size-[100%_100%] [-webkit-mask-size:100%_100%]
                mask-no-repeat [-webkit-mask-repeat:no-repeat]
            "
        >
            <motion.div className="flex w-max items-center gap-32" style={{ x }}>
                {/* Set 1 (medido) */}
                <div ref={setRef} className="flex items-center gap-32">
                    {logos.map((logo, i) => (
                        <img
                            key={`a-${i}`}
                            src={logo.src}
                            alt={logo.alt}
                            className="h-16 w-auto shrink-0 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                            draggable={false}
                        />
                    ))}
                </div>

                {/* Set 2 (copia exacta) */}
                <div className="flex items-center gap-32">
                    {logos.map((logo, i) => (
                        <img
                            key={`b-${i}`}
                            src={logo.src}
                            alt={logo.alt}
                            className="h-16 w-auto shrink-0 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                            draggable={false}
                        />
                    ))}
                </div>

                {/* Set 3 */}
                <div className="flex items-center gap-32">
                    {logos.map((logo, i) => (
                        <img
                            key={`c-${i}`}
                            src={logo.src}
                            alt={logo.alt}
                            className="h-16 w-auto shrink-0 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                            draggable={false}
                        />
                    ))}
                </div>

                {/* Set 4 */}
                <div className="flex items-center gap-32">
                    {logos.map((logo, i) => (
                        <img
                            key={`d-${i}`}
                            src={logo.src}
                            alt={logo.alt}
                            className="h-16 w-auto shrink-0 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                            draggable={false}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
