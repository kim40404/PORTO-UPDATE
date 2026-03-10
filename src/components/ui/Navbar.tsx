"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Work", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{
                y: scrolled ? 0 : -80,
                opacity: scrolled ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-[100]"
        >
            <div
                className="mx-auto transition-all duration-500"
                style={{
                    backgroundColor: "rgba(8,8,8,0.85)",
                    backdropFilter: "blur(20px)",
                    borderBottom: scrolled ? "1px solid rgba(200,134,10,0.2)" : "1px solid transparent",
                }}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <a href="#" className="font-display text-2xl tracking-wider text-text-primary hover:text-molten-gold transition-colors" data-hoverable>
                        Kim
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="font-mono text-xs tracking-widest uppercase text-text-secondary hover:text-molten-gold transition-colors"
                                data-hoverable
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA */}
                    <a
                        href="#contact"
                        className="hidden md:flex items-center gap-2 font-mono text-xs tracking-wider text-molten-gold border border-molten-gold/30 px-4 py-2 rounded-full hover:bg-molten-gold/10 transition-all"
                        data-hoverable
                    >
                        Hire Me <ArrowRight className="w-3 h-3" />
                    </a>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        data-hoverable
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-[1px] bg-text-primary transition-all ${menuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
                        <span className={`w-6 h-[1px] bg-text-primary transition-all ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`w-6 h-[1px] bg-text-primary transition-all ${menuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/5 px-6 py-6 space-y-4"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="block font-mono text-sm tracking-wider text-text-secondary hover:text-molten-gold transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
