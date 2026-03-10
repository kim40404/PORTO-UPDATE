"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";

const MountainPreviewDynamic = dynamic(() => import("../canvas/Scene").then(m => ({ default: m.MountainPreview })), { ssr: false });

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        >{children}</motion.div>
    );
}

export function ExperienceSection() {
    const [isMobile] = useState(() => typeof window !== "undefined" && (window.innerWidth < 768 || /iPhone|iPad|Android/i.test(navigator.userAgent)));
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <section style={{ padding: "96px 0" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

                {/* Section header */}
                <ScrollReveal>
                    <div style={{ marginBottom: 56 }}>
                        <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#e8a020", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 12px" }}>PROFESSIONAL JOURNEY</p>
                        <h2 style={{
                            fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 7vw, 80px)",
                            lineHeight: 0.92, letterSpacing: "0.03em", margin: 0,
                            background: "linear-gradient(180deg, #f0f0f0 0%, #888 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        }}>
                            Experience &amp;{" "}
                            <span style={{ background: "linear-gradient(135deg, #e8a020, #f5c842)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                Projects
                            </span>
                        </h2>
                    </div>
                </ScrollReveal>

                {/* Vertical stack */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* ── CARD 1: Game Developer ── */}
                    <ScrollReveal>
                        <div className="exp-card" onClick={() => window.open("https://www.roblox.com/games/89937206445659/GUNUNG-GILA", "_blank", "noopener,noreferrer")} role="link" tabIndex={0} data-hoverable>
                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 360px", gap: 40, alignItems: "start" }}>
                                <div>
                                    <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "rgba(232,160,32,0.4)", letterSpacing: "0.2em", margin: "0 0 16px" }}>01 / GAME DEVELOPER</p>
                                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 4vw, 52px)", color: "#f0f0f0", lineHeight: 0.95, margin: "0 0 10px", letterSpacing: "0.04em" }}>Game Developer</h3>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <img src="/roblox.jpg" alt="" style={{ width: 14, height: 14, borderRadius: 3, objectFit: "cover" }} loading="lazy" />
                                        <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#e8a020" }}>Exstore.id</span>
                                    </div>
                                    <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#555", letterSpacing: "0.08em", margin: "0 0 24px" }}>NOV 2025 – JAN 2026</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                                        {["Engineered core mechanics for \"Gunung Gila\" — climbing RPG with custom token economy and advanced Lua scripting",
                                            "Developed \"Mall\" — large-scale interactive map integrating SuperBiz SDK for in-game advertising and analytics"
                                        ].map((t, i) => (
                                            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                                <span style={{ color: "#e8a020", fontSize: 10, marginTop: 5, flexShrink: 0 }}>▸</span>
                                                <p style={{ fontFamily: "Syne", fontSize: 14, color: "#888", lineHeight: 1.65, margin: 0 }}>{t}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                        {["Lua", "Roblox Studio", "Game Design", "SuperBiz SDK"].map(t => (
                                            <span key={t} style={{ padding: "4px 10px", background: "rgba(232,160,32,0.07)", border: "1px solid rgba(232,160,32,0.2)", borderRadius: 6, fontFamily: "JetBrains Mono", fontSize: 10, color: "#b0b8c8" }}>{t}</span>
                                        ))}
                                        <a href="https://www.roblox.com/games/89937206445659/GUNUNG-GILA" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                            style={{ padding: "4px 12px", background: "rgba(232,160,32,0.12)", border: "1px solid rgba(232,160,32,0.4)", borderRadius: 6, fontFamily: "JetBrains Mono", fontSize: 10, color: "#e8a020", textDecoration: "none" }} data-hoverable>
                                            Play ↗
                                        </a>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div style={{ height: 200, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(232,160,32,0.15)" }}>
                                        <img src="/gununggila.jpeg" alt="Gunung Gila" loading="lazy" decoding="async"
                                            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82) contrast(1.1)", transition: "transform 0.4s" }}
                                            onMouseEnter={e => (e.target as HTMLImageElement).style.transform = "scale(1.04)"}
                                            onMouseLeave={e => (e.target as HTMLImageElement).style.transform = "scale(1)"} />
                                    </div>
                                    {mounted && !isMobile && (
                                        <div style={{ height: 130, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(232,160,32,0.1)", background: "#0a0703" }}>
                                            <MountainPreviewDynamic />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* ── ROW: Freelance + ToDoList ── */}
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                        {/* CARD 2: Freelance */}
                        <ScrollReveal delay={0.1}>
                            <div className="exp-card" onClick={() => window.open("https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/", "_blank", "noopener,noreferrer")} role="link" tabIndex={0} data-hoverable>
                                <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "rgba(232,160,32,0.4)", letterSpacing: "0.2em", margin: "0 0 16px" }}>02 / FREELANCE</p>
                                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 3vw, 40px)", color: "#f0f0f0", lineHeight: 0.95, margin: "0 0 8px", letterSpacing: "0.04em" }}>Full Stack &amp;<br />AI Engineer</h3>
                                <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#555", letterSpacing: "0.06em", margin: "0 0 20px" }}>INDEPENDENT · AUG 2024 – FEB 2026</p>
                                <div style={{ width: "100%", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(232,160,32,0.12)", marginBottom: 20, position: "relative" }}>
                                    <img src="/freelance.png" alt="Kimsang Silalahi" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block", filter: "brightness(0.88) contrast(1.05)" }} />
                                    <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", border: "1px solid rgba(232,160,32,0.3)", borderRadius: 20, fontFamily: "JetBrains Mono", fontSize: 9, color: "#e8a020" }}>AVAILABLE</div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                                    {["End-to-end web + AI solutions", "Secure DB architecture & APIs", "Full project lifecycle"].map((t, i) => (
                                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                            <span style={{ color: "#e8a020", fontSize: 10, marginTop: 4, flexShrink: 0 }}>▸</span>
                                            <p style={{ fontFamily: "Syne", fontSize: 13, color: "#777", lineHeight: 1.5, margin: 0 }}>{t}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {["PHP 8.2", "PostgreSQL", "ReactJS", "AI"].map(t => (
                                        <span key={t} style={{ padding: "3px 8px", background: "rgba(232,160,32,0.07)", border: "1px solid rgba(232,160,32,0.18)", borderRadius: 5, fontFamily: "JetBrains Mono", fontSize: 10, color: "#b0b8c8" }}>{t}</span>
                                    ))}
                                    <a href="https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                        style={{ padding: "3px 10px", background: "rgba(0,119,181,0.1)", border: "1px solid rgba(0,119,181,0.3)", borderRadius: 5, fontFamily: "JetBrains Mono", fontSize: 10, color: "#4da6d9", textDecoration: "none" }} data-hoverable>
                                        LinkedIn ↗
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* CARD 3: To-Do List */}
                        <ScrollReveal delay={0.15}>
                            <div className="exp-card" onClick={() => window.open("https://github.com/KimiSilalahi766/To-do-list-Project", "_blank", "noopener,noreferrer")} role="link" tabIndex={0} data-hoverable>
                                <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "rgba(232,160,32,0.4)", letterSpacing: "0.2em", margin: "0 0 16px" }}>03 / PROJECT</p>
                                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 3vw, 40px)", color: "#f0f0f0", lineHeight: 0.95, margin: "0 0 8px", letterSpacing: "0.04em" }}>Secure Task<br />Platform</h3>
                                <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#555", letterSpacing: "0.06em", margin: "0 0 20px" }}>PHP 8.2 + POSTGRESQL · 2024</p>
                                <div style={{ width: "100%", height: 200, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(232,160,32,0.12)", marginBottom: 20 }}>
                                    <img src="/todolist.jpg" alt="To-Do List" loading="lazy" decoding="async"
                                        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8) contrast(1.1)", transition: "transform 0.4s" }}
                                        onMouseEnter={e => (e.target as HTMLImageElement).style.transform = "scale(1.04)"}
                                        onMouseLeave={e => (e.target as HTMLImageElement).style.transform = "scale(1)"} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                                    {["Role-based access control + secure sessions", "PHP 8.2 + PostgreSQL architecture", "Full CRUD with security protocols"].map((t, i) => (
                                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                            <span style={{ color: "#e8a020", fontSize: 10, marginTop: 4, flexShrink: 0 }}>▸</span>
                                            <p style={{ fontFamily: "Syne", fontSize: 13, color: "#777", lineHeight: 1.5, margin: 0 }}>{t}</p>
                                        </div>
                                    ))}
                                </div>
                                <a href="https://github.com/KimiSilalahi766/To-do-list-Project" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                    style={{ display: "inline-block", padding: "6px 14px", background: "rgba(232,160,32,0.08)", border: "1px solid rgba(232,160,32,0.28)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 11, color: "#e8a020", textDecoration: "none" }} data-hoverable>
                                    GitHub ↗
                                </a>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* ── CARD 4: Intern ── */}
                    <ScrollReveal delay={0.2}>
                        <div className="exp-card" onClick={() => window.open("https://github.com/KimiSilalahi766/Intern_Project_at_KEMENKUMHAM", "_blank", "noopener,noreferrer")} role="link" tabIndex={0} data-hoverable>
                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: 40, alignItems: "start" }}>
                                <div>
                                    <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "rgba(232,160,32,0.4)", letterSpacing: "0.2em", margin: "0 0 16px" }}>04 / INTERNSHIP</p>
                                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 4vw, 52px)", color: "#f0f0f0", lineHeight: 0.95, margin: "0 0 10px", letterSpacing: "0.04em" }}>Software Engineer<br />Intern</h3>
                                    <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#e8a020", margin: "0 0 4px" }}>Ministry of Law and Human Rights</p>
                                    <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#555", letterSpacing: "0.06em", margin: "0 0 24px" }}>JUL 2024 – AUG 2024</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                                        {["Developed document paraphrasing tool using CodeIgniter4 + PHP for automated government document processing",
                                            "Integrated REST APIs for backend automation, reducing manual document handling time",
                                            "Worked in professional government IT environment — agile delivery, code review, documentation"
                                        ].map((t, i) => (
                                            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                                <span style={{ color: "#e8a020", fontSize: 10, marginTop: 5, flexShrink: 0 }}>▸</span>
                                                <p style={{ fontFamily: "Syne", fontSize: 14, color: "#888", lineHeight: 1.65, margin: 0 }}>{t}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        {["CodeIgniter4", "PHP", "REST API", "Document Processing"].map(t => (
                                            <span key={t} style={{ padding: "4px 10px", background: "rgba(232,160,32,0.07)", border: "1px solid rgba(232,160,32,0.2)", borderRadius: 6, fontFamily: "JetBrains Mono", fontSize: 10, color: "#b0b8c8" }}>{t}</span>
                                        ))}
                                        <a href="https://github.com/KimiSilalahi766/Intern_Project_at_KEMENKUMHAM" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                            style={{ padding: "4px 12px", background: "rgba(232,160,32,0.12)", border: "1px solid rgba(232,160,32,0.4)", borderRadius: 6, fontFamily: "JetBrains Mono", fontSize: 10, color: "#e8a020", textDecoration: "none" }} data-hoverable>
                                            GitHub ↗
                                        </a>
                                    </div>
                                </div>
                                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(232,160,32,0.12)", height: "100%", minHeight: 280 }}>
                                    <img src="/magang.jpeg" alt="Internship" loading="lazy" decoding="async"
                                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "brightness(0.8) contrast(1.1) saturate(0.9)" }} />
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                </div>
            </div>
        </section>
    );
}

// ══════════════ EDUCATION ══════════════
export function EducationSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ScrollReveal>
                <div className="education-card h-full" onClick={() => window.open("http://repositori.usu.ac.id:8080/handle/123456789/108104", "_blank", "noopener,noreferrer")} role="link" tabIndex={0}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(232,160,32,0.3)", flexShrink: 0, background: "#fff" }}>
                            <img src="/USU.png" alt="USU Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                        </div>
                        <div>
                            <h3 className="font-display text-[28px] tracking-wider text-text-primary leading-none">Universitas Sumatera Utara</h3>
                            <p className="font-body text-sm text-liquid-silver mt-1">Bachelor of Computer Science</p>
                            <p className="font-mono text-[11px] text-text-muted tracking-wider mt-0.5">July 2021 – July 2025</p>
                        </div>
                    </div>
                    <div className="gpa-badge" style={{ marginBottom: 20 }}>🏆 GPA: 3.78 / 4.00</div>
                    <div style={{ width: "100%", height: 200, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(232,160,32,0.15)", marginBottom: 16, position: "relative" }}>
                        <img src="/kampus.jpeg" alt="USU Campus" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75) contrast(1.1) saturate(0.85)", transition: "transform 0.5s ease" }} onMouseEnter={e => (e.target as HTMLImageElement).style.transform = "scale(1.04)"} onMouseLeave={e => (e.target as HTMLImageElement).style.transform = "scale(1)"} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,5,0,0.7) 0%, transparent 50%)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: 10, left: 12, fontFamily: "JetBrains Mono", fontSize: 10, color: "rgba(232,160,32,0.8)", letterSpacing: "0.1em" }}>MEDAN, NORTH SUMATRA</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">{["Data Structures", "Algorithms", "OOP", "Machine Learning", "Software Engineering", "Database Management"].map(c => <span key={c} className="tag">{c}</span>)}</div>
                    <a href="http://repositori.usu.ac.id:8080/handle/123456789/108104" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="exp-link" data-hoverable>📄 View Thesis ↗</a>
                </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
                <div className="education-card h-full" onClick={() => window.open("https://iao.usu.ac.id/id/berita/mahasiswa-usu-berpartisipasi-dalam-program-kemanusiaan-di-malaysia", "_blank", "noopener,noreferrer")} role="link" tabIndex={0}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(0,212,255,0.3)", flexShrink: 0, background: "#fff" }}>
                            <img src="/INTI.png" alt="INTI Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                        </div>
                        <div>
                            <h3 className="font-display text-[22px] tracking-wider text-text-primary leading-none">INTI International University</h3>
                            <p className="font-body text-sm text-liquid-silver mt-1">Student Mobility / MBKM Humanitarian Project</p>
                            <p className="font-mono text-[11px] text-text-muted tracking-wider mt-0.5">October 2023 – January 2024</p>
                        </div>
                    </div>
                    <span className="inline-block mb-4 px-3 py-1 rounded-full font-mono text-[10px] tracking-wider" style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff" }}>🇲🇾 MALAYSIA EXCHANGE PROGRAM</span>
                    <div style={{ width: "100%", height: 200, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(0,212,255,0.15)", marginBottom: 16, position: "relative" }}>
                        <img src="/malaysia.jpeg" alt="MBKM at INTI Malaysia" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8) contrast(1.1) saturate(0.9)", transition: "transform 0.5s ease" }} onMouseEnter={e => (e.target as HTMLImageElement).style.transform = "scale(1.04)"} onMouseLeave={e => (e.target as HTMLImageElement).style.transform = "scale(1)"} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,5,10,0.7) 0%, transparent 50%)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: 10, left: 12, fontFamily: "JetBrains Mono", fontSize: 10, color: "rgba(0,212,255,0.7)", letterSpacing: "0.1em" }}>NILAI, MALAYSIA</div>
                    </div>
                    <p className="font-body text-[13.5px] text-text-secondary leading-[1.7] mb-4">Cross-Cultural Business &amp; Digital Literacy for Social Impact. Led tech workshops bridging Indonesian and Malaysian student communities.</p>
                    <a href="https://iao.usu.ac.id/id/berita/mahasiswa-usu-berpartisipasi-dalam-program-kemanusiaan-di-malaysia" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="exp-link" style={{ borderColor: "rgba(0,212,255,0.3)", color: "#00d4ff" }} data-hoverable>🌏 MBKM Program Article ↗</a>
                </div>
            </ScrollReveal>
        </div>
    );
}
