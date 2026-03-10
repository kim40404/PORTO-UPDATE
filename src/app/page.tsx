"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import portfolioData from "../../data.json";
import { Preloader } from "@/components/ui/Preloader";
import { Navbar } from "@/components/ui/Navbar";
import { CustomCursor } from "@/components/ui/MouseRipples";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection, EducationSection } from "@/components/sections/ContentSections";
import { ChessCanvas, SkillsCanvas } from "@/components/canvas/Canvases";
import { ChatBot } from "@/components/ui/ChatBot";
import {
    Download, Mail, Linkedin, ExternalLink,
    Award, Phone, X, BrainCircuit, Send
} from "lucide-react";

// ── Cycling Roles ──
const ROLES = ["AI-Native Full-Stack Developer", "Building Intelligent & Interactive Web Apps", "AI Agents · Web3 · Game Developer", "Pushing Compute Boundaries Since 2021"];

// ── Skills Data ──
const SKILLS_DATA: Record<string, { icon: string; color: string; items: { name: string; desc: string }[] }> = {
    "AI & ENGINEERING": {
        icon: "🧠", color: "#e8a020", items: [
            { name: "K-Means / DBSCAN", desc: "Thesis: ML clustering for Mobile Legends player segmentation analytics" },
            { name: "cGANs / PyTorch", desc: "Generative AI model training and deep learning implementations" },
            { name: "ESP32 + Sensors", desc: "IoT honey quality monitoring — DHT22, pH, MQ-135, TDS, LDR @ 88.25% accuracy" },
            { name: "Firebase", desc: "Real-time cloud database for IoT sensor data streaming & alerts" },
            { name: "Web3 / ICP APIs", desc: "Internet Computer blockchain — Decodream hackathon & CareerVerse" },
            { name: "K-NN Classification", desc: "ML model for automated honey quality scoring and classification" },
        ]
    },
    "DEVELOPMENT": {
        icon: "⚙️", color: "#00d4ff", items: [
            { name: "Python", desc: "Data science pipelines, ML models, Pandas, Scikit-learn, Matplotlib" },
            { name: "PHP 8.2", desc: "Backend APIs, CodeIgniter4 — internship at Kemenkumham & freelance projects" },
            { name: "PostgreSQL", desc: "Secure relational DB design with robust security protocols" },
            { name: "ReactJS / Next.js", desc: "Full-stack web apps — analytics dashboards, IoT UI, portfolio" },
            { name: "Lua (Roblox Studio)", desc: "Advanced game scripting — Gunung Gila RPG token economy system" },
            { name: "Git", desc: "Version control, collaborative development, GitHub project management" },
        ]
    },
    "MANAGEMENT": {
        icon: "📋", color: "#a78bfa", items: [
            { name: "Agile Delivery", desc: "Sprint-based development cycles and iterative product delivery" },
            { name: "Sprint Coordination", desc: "Team lead on Decodream Hackathon 11 — ICP Indonesia" },
            { name: "Technical Writing", desc: "White paper, documentation, and thesis writing (GPA 3.78)" },
        ]
    },
};

// ── Certifications Data ──
const CERTS = [
    { name: "Junior Web Programmer (260 Hours)", issuer: "KEMNAKER RI", year: "Oct 2025" },
    { name: "Hackathon 11 — Web3 Ecosystem", issuer: "ICP Indonesia", year: "2024" },
    { name: "Full Stack Web Development", issuer: "Udemy", year: "Oct 2024" },
    { name: "Machine Learning A-Z & Data Science", issuer: "Udemy", year: "Dec 2024" },
    { name: "English for IT", issuer: "CISCO", year: "Jan 2025" },
];
const CERT_LINK = "https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/details/certifications/";

// ── Variants ──
const staggerContainer: any = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const staggerItem: any = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

// ── Reusable ──
function SectionLabel({ children }: { children: React.ReactNode }) {
    return <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-molten-gold opacity-80">{children}</span>;
}
function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <motion.h2 ref={ref} className={`font-display tracking-wider uppercase text-gradient-metal ${className}`}
            style={{ fontSize: "clamp(48px, 7vw, 96px)", letterSpacing: "0.03em" }}
            initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.h2>
    );
}
function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
    );
}
function GoldDotDivider() { return <div className="section-divider" />; }
function AnimatedCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!isInView) return;
        let start = 0; const step = target / 40;
        const t = setInterval(() => { start += step; if (start >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(start * 100) / 100); }, 30);
        return () => clearInterval(t);
    }, [isInView, target]);
    return (<div ref={ref} className="glass-card rounded-xl px-6 py-4 text-center"><p className="font-display text-3xl text-molten-gold">{count}{suffix}</p><p className="font-mono text-[10px] text-text-muted mt-1 uppercase tracking-wider">{label}</p></div>);
}



// ════════════════════════════════
// MAIN PAGE
// ════════════════════════════════
export default function Home() {
    const { certifications } = portfolioData as any;
    const [loaded, setLoaded] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const [isMobile, setIsMobile] = useState(false);
    const [roleIdx, setRoleIdx] = useState(0);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    useEffect(() => {
        const t = setInterval(() => setRoleIdx(p => (p + 1) % ROLES.length), 3000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => { const c = () => setIsMobile(window.innerWidth < 768 || /iPhone|iPad|Android/i.test(navigator.userAgent)); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

    useEffect(() => {
        let st: ReturnType<typeof setTimeout>;
        const onScroll = () => { const t = document.documentElement.scrollHeight - window.innerHeight; setScrollProgress(t > 0 ? window.scrollY / t : 0); document.body.classList.add("is-scrolling"); clearTimeout(st); st = setTimeout(() => document.body.classList.remove("is-scrolling"), 150); };
        const onMouse = (e: MouseEvent) => { document.body.style.setProperty("--mx", `${(e.clientX / window.innerWidth) * 100}%`); document.body.style.setProperty("--my", `${(e.clientY / window.innerHeight) * 100}%`); };
        window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("mousemove", onMouse, { passive: true });
        return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); clearTimeout(st); };
    }, []);

    return (
        <>
            <AnimatePresence>{!loaded && <Preloader onComplete={() => setLoaded(true)} />}</AnimatePresence>
            {!isMobile && <CustomCursor />}
            <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />
            <div className="grain-overlay" />
            <Navbar />



            <main className="relative z-[1]">
                {/* ═══ HERO ═══ */}
                <section className="relative min-h-screen flex items-center section-contained" style={{ background: "radial-gradient(ellipse 100% 80% at 70% 50%, rgba(200,134,10,0.05) 0%, transparent 70%), linear-gradient(180deg, #080808 0%, #0a0805 100%)" }}>
                    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-molten-gold/5 blur-[200px] rounded-full pointer-events-none" />
                    <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
                        <div className="space-y-8">
                            <motion.div initial={{ opacity: 0 }} animate={loaded ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}><SectionLabel>Creative Developer — Est. 2021</SectionLabel></motion.div>
                            <div className="overflow-hidden">{"KIMSANG".split("").map((c, i) => (<motion.span key={`k-${i}`} className="font-display inline-block text-gradient-metal" style={{ fontSize: "clamp(60px, 12vw, 140px)", lineHeight: 0.9 }} initial={{ opacity: 0, y: 80, filter: "blur(10px)" }} animate={loaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ delay: 0.7 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>{c}</motion.span>))}</div>
                            <div className="overflow-hidden -mt-2">{"SILALAHI".split("").map((c, i) => (<motion.span key={`s-${i}`} className="font-display inline-block text-gradient-gold" style={{ fontSize: "clamp(60px, 12vw, 140px)", lineHeight: 0.9 }} initial={{ opacity: 0, y: 80, filter: "blur(10px)" }} animate={loaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ delay: 1.1 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>{c}</motion.span>))}</div>
                            <motion.div className="hero-bio" initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.6 }}>
                                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px, 2.2vw, 22px)", color: "#e8a020", letterSpacing: "0.02em", display: "block", marginBottom: 6 }}>AI-Oriented Software Engineer</span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(12px, 1.4vw, 15px)", color: "#666", letterSpacing: "0.08em", display: "block" }}>Building Intelligent &amp; Interactive Web Applications</span>
                                <AnimatePresence mode="wait"><motion.span key={roleIdx} className="font-mono text-[11px] text-text-muted tracking-wider mt-3 block" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 0.7, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>{ROLES[roleIdx]}</motion.span></AnimatePresence>
                            </motion.div>
                            <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.8 }}>
                                <a href="/CV Kim.pdf" download className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm tracking-wider text-bg-void bg-molten-gold rounded-full hover:bg-molten-glow transition-colors" data-hoverable><Download className="w-4 h-4" /> Download CV</a>
                                <a href="mailto:kimsilalahi@gmail.com" className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm tracking-wider text-text-primary border border-white/10 rounded-full hover:border-molten-gold/40 hover:text-molten-gold transition-all" data-hoverable><Mail className="w-4 h-4" /> Email</a>
                                <a href="https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm tracking-wider text-text-primary border border-white/10 rounded-full hover:border-molten-gold/40 hover:text-molten-gold transition-all" data-hoverable><Linkedin className="w-4 h-4" /> LinkedIn</a>
                            </motion.div>
                        </div>
                        {/* Static photo with rings */}
                        <motion.div className="flex items-center justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={loaded ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                            <div className="hero-photo-wrapper">
                                <div className="ring ring-1" /><div className="ring ring-2" />
                                <div className="relative w-full h-full rounded-full overflow-hidden z-[2]"><Image src="/my photo.png" alt="Kimsang Silalahi" fill className="hero-photo" priority draggable={false} /></div>
                                <span className="hero-badge badge-tl">Full Stack</span><span className="hero-badge badge-tr">AI/ML</span><span className="hero-badge badge-bl">Web3</span><span className="hero-badge badge-br">Game Dev</span>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={loaded ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
                        <div className="flex flex-col items-center gap-2"><span className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Scroll</span><div className="w-[1px] h-8 bg-gradient-to-b from-molten-gold/50 to-transparent animate-pulse" /></div>
                    </motion.div>
                </section>

                <GoldDotDivider />

                {/* ═══ ABOUT ═══ */}
                <section id="about" className="py-24 md:py-32 relative section-contained" style={{ background: "linear-gradient(180deg, #0a0805 0%, #0d0d0d 100%)" }}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-molten-gold/30 to-transparent" />
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal><SectionLabel>Philosophy & Perspective</SectionLabel></ScrollReveal>
                        <ScrollReveal delay={0.1}><SectionTitle className="mt-4 mb-16">About</SectionTitle></ScrollReveal>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <ScrollReveal delay={0.2}><div className="space-y-6">
                                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px, 1.4vw, 16px)", lineHeight: 1.8, color: "#b0b8c8", marginBottom: 20 }}>A Computer Science graduate <span className="text-molten-gold">(GPA: 3.78/4.00)</span> from Universitas Sumatera Utara — bridging immersive gaming experiences with advanced intelligent systems.</p>
                                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px, 1.4vw, 16px)", lineHeight: 1.8, color: "#777", marginBottom: 20 }}>Deeply passionate about AI Agents, Continual Learning in LLMs, and tackling complex data structure problems in C++ and Python. I build things that think — from clustering algorithms that decode player behavior in Mobile Legends, to IoT systems that classify honey quality at 88.25% accuracy.</p>
                                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px, 1.4vw, 16px)", lineHeight: 1.8, color: "#777", marginBottom: 20 }}>My journey spans game development on Roblox, blockchain hackathons on the Internet Computer, full-stack freelance engineering, and a government internship at Indonesia&apos;s Ministry of Law and Human Rights.</p>
                                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px, 1.4vw, 16px)", lineHeight: 1.8, color: "#777", marginBottom: 20 }}>Ultimate ambition: push the boundaries of computing at industry leaders like <span className="text-electric-cyan">NVIDIA</span> — where hardware meets intelligence.</p>
                                <div className="pt-4 flex gap-4 flex-wrap"><AnimatedCounter target={3.78} label="GPA" /><AnimatedCounter target={3} suffix="+" label="Years" /><AnimatedCounter target={10} suffix="+" label="Projects" /><AnimatedCounter target={5} label="Certs" /></div>
                            </div></ScrollReveal>
                            <ScrollReveal delay={0.3}><div className="glass-card molten-border rounded-2xl p-2 overflow-hidden"><div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden"><Image src="/my photo2.jpeg" alt="Kimsang Silalahi" fill className="object-cover" loading="lazy" /></div></div></ScrollReveal>
                        </div>
                    </div>
                </section>

                <GoldDotDivider />

                {/* ═══ SKILLS ═══ */}
                <section id="skills" className="py-24 md:py-32 relative section-contained" style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #111111 100%)" }}>
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal><SectionLabel>Technologies · Frameworks · Methodologies</SectionLabel></ScrollReveal>
                        <ScrollReveal delay={0.1}><SectionTitle className="mt-4 mb-16">Core Expertise</SectionTitle></ScrollReveal>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" style={{ maxWidth: 1200, margin: "0 auto" }}>
                            {!isMobile && <ScrollReveal delay={0.2}><div style={{ width: "100%", maxWidth: 460, margin: "0 auto" }}>
                                {loaded && <SkillsCanvas />}
                            </div></ScrollReveal>}
                            <div className="space-y-8">
                                {Object.entries(SKILLS_DATA).map(([cat, { icon, color, items }], ci) => (
                                    <ScrollReveal key={cat} delay={0.2 + ci * 0.1}><div>
                                        <h3 className="font-mono text-[11px] tracking-[0.2em] uppercase mb-5 opacity-80 flex items-center gap-2" style={{ color }}><span>{icon}</span> {cat}</h3>
                                        <div className="space-y-1">
                                            {items.map(s => (
                                                <div key={s.name} onMouseEnter={() => setHoveredSkill(s.name)} onMouseLeave={() => setHoveredSkill(null)} className="px-4 py-3 rounded-lg transition-all duration-300" style={{ background: hoveredSkill === s.name ? "rgba(232,160,32,0.05)" : "transparent", borderLeft: hoveredSkill === s.name ? `2px solid ${color}` : "2px solid transparent" }} data-hoverable>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono text-[13px] text-text-primary">{s.name}</span>
                                                        <span className="text-[10px] text-text-muted">→</span>
                                                    </div>
                                                    <AnimatePresence>{hoveredSkill === s.name && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="font-body text-[12px] text-text-secondary mt-1 leading-relaxed">{s.desc}</motion.p>}</AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </div></ScrollReveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <GoldDotDivider />

                {/* ═══ EXPERIENCE ═══ */}
                <div id="experience" className="relative section-contained" style={{ background: "radial-gradient(ellipse 60% 40% at 10% 50%, rgba(200,134,10,0.04) 0%, transparent 60%), linear-gradient(180deg, #111111 0%, #0d0d0d 100%)" }}>
                    <ExperienceSection />
                </div>

                <GoldDotDivider />

                {/* ═══ PROJECTS ═══ */}
                <section id="projects" className="py-24 md:py-32 relative section-contained" style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)" }}>
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal><SectionLabel>Built with Purpose</SectionLabel></ScrollReveal>
                        <ScrollReveal delay={0.1}><SectionTitle className="mt-4 mb-16">Projects</SectionTitle></ScrollReveal>
                        <ProjectsSection />
                    </div>
                </section>

                <GoldDotDivider />

                {/* ═══ EDUCATION ═══ */}
                <section id="education" className="py-24 md:py-32 relative section-contained" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 100%)" }}>
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal><SectionLabel>Knowledge Architecture</SectionLabel></ScrollReveal>
                        <ScrollReveal delay={0.1}><SectionTitle className="mt-4 mb-16">Education</SectionTitle></ScrollReveal>
                        <EducationSection />
                    </div>
                </section>

                <GoldDotDivider />

                {/* ═══ CERTIFICATIONS ═══ */}
                <section className="py-24 md:py-32 relative section-contained" style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)" }}>
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal><SectionLabel>Validated Knowledge</SectionLabel></ScrollReveal>
                        <ScrollReveal delay={0.1}><SectionTitle className="mt-4 mb-16">Certifications</SectionTitle></ScrollReveal>
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            {CERTS.map((cert, i) => (
                                <motion.a key={i} href={CERT_LINK} target="_blank" rel="noopener noreferrer" className="glass-card molten-border rounded-2xl p-6 block" style={{ textDecoration: "none" }} variants={staggerItem} data-hoverable>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-body text-[14px] font-semibold text-text-primary leading-tight">{cert.name}</h4>
                                            <p className="font-mono text-[11px] text-molten-gold mt-1">{cert.issuer} · {cert.year}</p>
                                        </div>
                                        <span className="text-lg transition-all" style={{ color: "rgba(232,160,32,0.4)" }}>↗</span>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                        <ScrollReveal delay={0.2}><a href={CERT_LINK} target="_blank" rel="noopener noreferrer" className="block text-center mt-8 py-3 px-8 rounded-xl font-mono text-[12px] text-molten-gold transition-all hover:bg-molten-gold/15" style={{ background: "rgba(232,160,32,0.08)", border: "1px solid rgba(232,160,32,0.3)" }} data-hoverable>View All Certifications on LinkedIn ↗</a></ScrollReveal>
                    </div>
                </section>

                <GoldDotDivider />

                {/* ═══ HOBBIES ═══ */}
                <section className="py-24 md:py-32 relative section-contained" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #080808 100%)" }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-molten-gold/5 blur-[200px] rounded-full pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal><SectionLabel>Off the Clock</SectionLabel></ScrollReveal>
                        <ScrollReveal delay={0.1}><SectionTitle className="mt-4 mb-16">Hobbies</SectionTitle></ScrollReveal>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <ScrollReveal delay={0.2}>
                                <div onClick={() => window.open("https://www.chess.com/member/kim_766", "_blank", "noopener,noreferrer")} role="link" tabIndex={0} data-hoverable style={{ cursor: "pointer" }}>
                                    {loaded && !isMobile ? <ChessCanvas /> : <div style={{ width: "100%", height: 500, borderRadius: 20, border: "1px solid rgba(232,160,32,0.1)", background: "#080604", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="w-32 h-32 rounded-full bg-molten-gold/10 border border-molten-gold/20 flex items-center justify-center text-4xl">♟</div></div>}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, fontFamily: "JetBrains Mono", fontSize: 11, color: "rgba(232,160,32,0.5)", letterSpacing: "0.1em" }}>
                                        <span>♟</span><span>chess.com/member/kim_766</span><span style={{ fontSize: 13 }}>↗</span>
                                    </div>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.3}><div className="glass-card molten-border rounded-2xl p-8 space-y-6">
                                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "0.05em", color: "#f0f0f0", marginBottom: 16, lineHeight: 1 }}>Hobbies<br /><span style={{ color: "#e8a020" }}>Chess</span></h3>
                                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: 1.8, color: "#b0b8c8", marginBottom: 16 }}>Chess is where I feel most alive outside of code. There&apos;s something deeply satisfying about seeing 10 moves ahead — the board becomes a system, every piece a variable, every game a new algorithm to break.</p>
                                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: 1.8, color: "#777", marginBottom: 16 }}>I&apos;ve played since high school and still lose track of time in a good match. Opening theory, endgame technique, the psychology of bluffing under pressure — chess teaches patience, calculated risk, and the courage to sacrifice short-term gains for a winning position.</p>
                                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: 1.8, color: "#777" }}>The same mindset I bring to every system I architect.</p>
                            </div></ScrollReveal>
                        </div>
                    </div>
                </section>

                <GoldDotDivider />

                {/* ═══ CONTACT / FOOTER ═══ */}
                <section id="contact" className="py-24 md:py-32 relative section-contained">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-br from-electric-cyan/10 via-cool-accent/5 to-molten-gold/10 blur-[150px] rounded-full" /></div>
                    <div className="max-w-5xl mx-auto px-6 relative z-10">
                        <ScrollReveal><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                            <a href="mailto:kimsilalahi@gmail.com" className="glass-card molten-border rounded-2xl p-6 flex items-center gap-4 group" data-hoverable><div className="w-12 h-12 rounded-full bg-molten-gold/10 border border-molten-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform"><Mail className="w-5 h-5 text-molten-gold" /></div><div><p className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Email</p><p className="text-text-primary text-sm">kimsilalahi@gmail.com</p></div></a>
                            <a href="tel:+6281246894985" className="glass-card molten-border rounded-2xl p-6 flex items-center gap-4 group" data-hoverable><div className="w-12 h-12 rounded-full bg-molten-gold/10 border border-molten-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform"><Phone className="w-5 h-5 text-molten-gold" /></div><div><p className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Phone</p><p className="text-text-primary text-sm">+62 812-4689-4985</p></div></a>
                            <a href="https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/" target="_blank" rel="noopener noreferrer" className="glass-card molten-border rounded-2xl p-6 flex items-center gap-4 group" data-hoverable><div className="w-12 h-12 rounded-full bg-molten-gold/10 border border-molten-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform"><Linkedin className="w-5 h-5 text-molten-gold" /></div><div><p className="font-mono text-[10px] text-text-muted uppercase tracking-wider">LinkedIn</p><p className="text-text-primary text-sm">Kimsang Silalahi</p></div></a>
                        </div></ScrollReveal>
                        <ScrollReveal delay={0.15}><div className="glass-card rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-molten-gold/10 blur-[120px] rounded-full pointer-events-none" />
                            <div className="relative z-10 space-y-8"><SectionLabel>Next Chapter</SectionLabel><h2 className="font-display tracking-wider text-text-primary leading-tight" style={{ fontSize: "clamp(48px, 8vw, 108px)" }}>Let&apos;s Create<br /><span className="text-gradient-gold">Excellence.</span></h2>
                                <div className="pt-4"><MagneticButton href="mailto:kimsilalahi@gmail.com" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 font-mono text-sm tracking-wider text-bg-void bg-molten-gold rounded-full hover:bg-molten-glow transition-colors overflow-hidden"><span className="relative z-10 flex items-center gap-3">Start a Conversation <Mail className="w-5 h-5" /></span></MagneticButton></div>
                            </div>
                        </div></ScrollReveal>
                        <footer className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 text-text-muted">
                            <p className="font-mono text-[11px] tracking-wider">© {new Date().getFullYear()} Kimsang Silalahi. All rights reserved.</p>
                            <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider">
                                <a href="mailto:kimsilalahi@gmail.com" className="hover:text-molten-gold transition-colors link-animate" data-hoverable>kimsilalahi@gmail.com</a>
                                <span className="text-text-muted/30">·</span><a href="https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/" target="_blank" rel="noopener noreferrer" className="hover:text-molten-gold transition-colors link-animate flex items-center gap-1" data-hoverable>LinkedIn <ExternalLink className="w-3 h-3" /></a>
                                <span className="text-text-muted/30">·</span><a href="https://github.com/KimiSilalahi766" target="_blank" rel="noopener noreferrer" className="hover:text-molten-gold transition-colors link-animate flex items-center gap-1" data-hoverable>GitHub <ExternalLink className="w-3 h-3" /></a>
                            </div>
                        </footer>
                    </div>
                </section>
            </main>
            <ChatBot />
        </>
    );
}
