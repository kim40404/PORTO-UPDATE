"use client";

import { motion } from "framer-motion";

export function SectionHeading({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) {
    return (
        <div className="mb-12">
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2"
            >
                {children}
            </motion.h2>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-white/60 text-lg max-w-2xl"
                >
                    {subtitle}
                </motion.p>
            )}

            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "circOut" }}
                className="h-[1px] w-full max-w-xs bg-gradient-to-r from-white/40 to-transparent mt-6 origin-left"
            />
        </div>
    )
}
