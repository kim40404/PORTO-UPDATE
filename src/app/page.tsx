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
import ChatBot from "@/components/ui/ChatBot";
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
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export default function Home() {
    const { certifications } = portfolioData as any;
    const [loaded, setLoaded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const isMobile = useIsMobile();
    const [roleIdx, setRoleIdx] = useState(0);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const t = setInterval(() => setRoleIdx(p => (p + 1) % ROLES.length), 3000);
        return () => clearInterval(t);
    }, []);



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
                            <ScrollReveal delay={0.2}>
                                {!mounted || isMobile ? (
                                  <div style={{
                                    width: '100%', height: 320,
                                    borderRadius: 16, overflow: 'hidden',
                                    border: '1px solid rgba(232,160,32,0.1)',
                                    background: 'radial-gradient(ellipse at 50% 45%, #1c0d00 0%, #080808 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexDirection: 'column', gap: 16,
                                  }}>
                                    <div style={{ fontSize: 64 }}>🧠</div>
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10,
                                      color: 'rgba(232,160,32,0.4)', letterSpacing: '0.2em' }}>
                                      NEURAL ARCHITECTURE
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ width: "100%", maxWidth: 460, margin: "0 auto" }}>
                                      {loaded && <SkillsCanvas />}
                                  </div>
                                )}
                            </ScrollReveal>
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
                                    {!mounted || isMobile ? (
                                      <div style={{
                                        width: '100%', height: 240,
                                        borderRadius: 16,
                                        background: 'radial-gradient(ellipse at 50% 70%, #120e04 0%, #080604 100%)',
                                        border: '1px solid rgba(232,160,32,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexDirection: 'column', gap: 12,
                                      }}>
                                        <div style={{ fontSize: 56 }}>♟️</div>
                                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10,
                                          color: 'rgba(232,160,32,0.4)', letterSpacing: '0.15em' }}>
                                          CHESS · kim_766
                                        </div>
                                      </div>
                                    ) : (
                                        loaded ? <ChessCanvas /> : <div style={{ width: "100%", height: 500, borderRadius: 20, border: "1px solid rgba(232,160,32,0.1)", background: "#080604", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="w-32 h-32 rounded-full bg-molten-gold/10 border border-molten-gold/20 flex items-center justify-center text-4xl">♟</div></div>
                                    )}
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
                <section id="contact" style={{
                  position: 'relative',
                  padding: '100px 40px 60px',
                  overflow: 'hidden',
                  background: '#080808',
                }}>

                  {/* Animated background glow */}
                  <div style={{
                    position: 'absolute', top: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%', height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.4), transparent)',
                  }} />
                  <div style={{
                    position: 'absolute', top: '-20%', left: '50%',
                    transform: 'translateX(-50%)',
                    width: 600, height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(232,160,32,0.04) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />

                  <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>

                    {/* Eyebrow */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      padding: '6px 16px',
                      border: '1px solid rgba(232,160,32,0.2)',
                      borderRadius: 50, marginBottom: 32,
                      background: 'rgba(232,160,32,0.04)',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%',
                        background: '#00d4ff', boxShadow: '0 0 6px #00d4ff',
                        display: 'inline-block', animation: 'footerPulse 2s ease-in-out infinite' }} />
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10,
                        color: '#e8a020', letterSpacing: '0.2em' }}>AVAILABLE FOR HIRE</span>
                    </div>

                    {/* Main headline */}
                    <h2 style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(40px, 7vw, 88px)',
                      lineHeight: 0.92, letterSpacing: '0.02em',
                      margin: '0 0 8px',
                    }}>
                      <span style={{
                        background: 'linear-gradient(180deg, #f0f0f0 0%, #999 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>Let's Build</span>
                      <br />
                      <span style={{
                        background: 'linear-gradient(135deg, #e8a020 0%, #f5c842 50%, #e8a020 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        backgroundSize: '200% 200%',
                        animation: 'goldShimmer 3s ease-in-out infinite',
                      }}>Something Remarkable</span>
                    </h2>

                    {/* Subtext */}
                    <p style={{
                      fontFamily: 'Syne', fontSize: 16, color: '#555',
                      maxWidth: 480, margin: '20px auto 40px', lineHeight: 1.7,
                    }}>
                      AI engineer, full stack developer, and creative builder —
                      ready to turn your boldest idea into reality.
                    </p>

                    {/* Primary CTA */}
                    <div style={{
                      display: 'flex', gap: 14, justifyContent: 'center',
                      flexWrap: 'wrap', marginBottom: 48,
                    }}>
                      <a href="mailto:kimsilalahi@gmail.com" style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '14px 32px',
                        background: 'linear-gradient(135deg, #e8a020, #f5c842)',
                        borderRadius: 50,
                        fontFamily: 'JetBrains Mono', fontSize: 12,
                        color: '#080808', fontWeight: 700,
                        textDecoration: 'none', letterSpacing: '0.08em',
                        boxShadow: '0 8px 32px rgba(232,160,32,0.3)',
                        transition: 'transform .2s, box-shadow .2s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(232,160,32,0.45)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(232,160,32,0.3)'
                      }}>
                        ✉ kimsilalahi@gmail.com
                      </a>

                      <a href="https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/"
                        target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '14px 32px',
                        background: 'transparent',
                        border: '1px solid rgba(232,160,32,0.3)',
                        borderRadius: 50,
                        fontFamily: 'JetBrains Mono', fontSize: 12,
                        color: '#e8a020', textDecoration: 'none',
                        letterSpacing: '0.08em',
                        transition: 'border-color .2s, background .2s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,160,32,0.7)'
                        ;(e.currentTarget as HTMLElement).style.background = 'rgba(232,160,32,0.06)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,160,32,0.3)'
                        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                      }}>
                        LinkedIn ↗
                      </a>
                    </div>

                    {/* Divider with center diamond */}
                    <div style={{ position: 'relative', margin: '0 auto 32px', maxWidth: 400 }}>
                      <div style={{
                        height: 1,
                        background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.2), transparent)',
                      }} />
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%) rotate(45deg)',
                        width: 6, height: 6,
                        background: '#e8a020',
                        boxShadow: '0 0 8px rgba(232,160,32,0.6)',
                      }} />
                    </div>

                    {/* Social links */}
                    <div style={{
                      display: 'flex', gap: 8, justifyContent: 'center',
                      flexWrap: 'wrap', marginBottom: 40,
                    }}>
                      {[
                        { label: 'GitHub', url: 'https://github.com/KimiSilalahi766' },
                        { label: 'Chess.com', url: 'https://www.chess.com/member/kim_766' },
                        { label: 'DoraHacks', url: 'https://dorahacks.io/buidl/31489' },
                        { label: '+62 812-4689-4985', url: 'tel:+6281246894985' },
                      ].map(l => (
                        <a key={l.label} href={l.url}
                          target="_blank" rel="noopener noreferrer"
                          style={{
                            padding: '7px 16px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 50,
                            fontFamily: 'JetBrains Mono', fontSize: 10,
                            color: '#555', textDecoration: 'none',
                            letterSpacing: '0.08em',
                            transition: 'color .2s, border-color .2s, background .2s',
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement
                            el.style.color = '#e8a020'
                            el.style.borderColor = 'rgba(232,160,32,0.3)'
                            el.style.background = 'rgba(232,160,32,0.05)'
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement
                            el.style.color = '#555'
                            el.style.borderColor = 'rgba(255,255,255,0.07)'
                            el.style.background = 'rgba(255,255,255,0.03)'
                          }}
                        >{l.label}</a>
                      ))}
                    </div>

                    {/* Bottom bar */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                    }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10,
                        color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' }}>
                        © 2025 KIMSANG SILALAHI
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10,
                        color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' }}>
                        MEDAN · INDONESIA
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10,
                        color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' }}>
                        BUILT WITH PASSION ♦
                      </span>
                    </div>
                  </div>

                  <style>{`
                    @keyframes footerPulse {
                      0%, 100% { opacity: 1; transform: scale(1); }
                      50%       { opacity: 0.5; transform: scale(1.3); }
                    }
                    @keyframes goldShimmer {
                      0%   { background-position: 0% 50%; }
                      50%  { background-position: 100% 50%; }
                      100% { background-position: 0% 50%; }
                    }

                    @media (max-width: 768px) {
                      /* Footer */
                      .footer-section { padding: 64px 20px 40px !important; }
                      .footer-headline { font-size: clamp(36px, 11vw, 56px) !important; }
                      .footer-cta { flex-direction: column; align-items: center; }
                      .footer-cta a { width: 100%; text-align: center; justify-content: center; }
                    }
                  `}</style>
                </section>
            </main>
            <ChatBot />
        </>
    );
}
