"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const FILTERS = ["ALL", "AI/ML", "WEB", "IoT", "WEB3", "HACKATHON", "CREATIVE"] as const;

type Project = {
    title: string;
    desc: string;
    image: string;
    category: string;
    filters: string[];
    tags: string[];
    url: string;
    badge?: { text: string; bg: string; border: string; color: string };
    links?: { label: string; url: string; style?: React.CSSProperties }[];
    wide?: boolean;
    imageHeight?: number;
    imagePosition?: string;
    liveBadge?: boolean;
};

const PROJECTS: Project[] = [
    {
        title: "Mobile Legends Player Analytics",
        desc: "Advanced data science project comparing K-Means and DBSCAN clustering algorithms for strategic player segmentation. Built a comprehensive analytics dashboard with interactive visualizations, analyzing KDA ratios, win rates, gold-per-minute, hero picks, and role preferences.",
        image: "/skripsi_program.png",
        category: "AI/ML · Thesis",
        filters: ["AI/ML"],
        tags: ["Python", "React", "Scikit-learn", "Pandas", "Matplotlib", "K-Means", "DBSCAN"],
        url: "https://github.com/kim40404/MobileLegendsUnique",
        badge: { text: "🎓 S1 THESIS PROJECT", bg: "rgba(124,58,237,0.3)", border: "rgba(124,58,237,0.5)", color: "#a78bfa" },
        links: [
            { label: "GitHub ↗", url: "https://github.com/kim40404/MobileLegendsUnique" },
            { label: "View Thesis ↗", url: "http://repositori.usu.ac.id:8080/handle/123456789/108104", style: { background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.3)", color: "#a78bfa" } },
        ],
        wide: true,
        imageHeight: 260,
        imagePosition: "top center",
    },
    {
        title: "Decodream — Dream Analysis on ICP",
        desc: "AI-powered dream interpretation platform on the Internet Computer blockchain. Led team as project lead — built NLP-driven dream symbolism analysis, emotional context recognition, and community sharing features.",
        image: "/hackathon11.jpeg",
        category: "Web3 · AI · Hackathon",
        filters: ["WEB3", "AI/ML", "HACKATHON"],
        tags: ["React", "TypeScript", "AI/NLP", "Node.js", "MongoDB", "ICP Blockchain"],
        url: "https://github.com/sngbd/decodream",
        badge: { text: "👑 TEAM LEAD", bg: "rgba(0,212,255,0.2)", border: "rgba(0,212,255,0.4)", color: "#00d4ff" },
        links: [{ label: "GitHub ↗", url: "https://github.com/sngbd/decodream" }],
    },
    {
        title: "IoT Honey Quality Monitoring",
        desc: "Real-time honey quality monitoring system using ESP32 with DHT22, pH sensor, MQ-135, TDS meter, and LDR sensors. Firebase backend, K-NN classification achieving 88.25% accuracy.",
        image: "/IoT.png",
        category: "IoT · Hardware · ML",
        filters: ["IoT", "AI/ML"],
        tags: ["ESP32", "IoT", "Firebase", "Next.js", "K-NN", "Sensor Integration"],
        url: "https://beemy-fe0b9.web.app/",
        badge: { text: "⚡ 88.25% ACCURACY", bg: "rgba(232,160,32,0.2)", border: "rgba(232,160,32,0.4)", color: "#f5c842" },
        liveBadge: true,
    },
    {
        title: "CareerVerse — Decentralized Job Marketplace",
        desc: "Blockchain-powered decentralized job and talent marketplace. Complete submission with technical white paper, system architecture diagrams, and strategic partnership roadmap.",
        image: "/hackathon16.png",
        category: "Blockchain · Web3",
        filters: ["WEB3", "HACKATHON"],
        tags: ["Blockchain", "Web3", "Hackathon", "Project Management", "Documentation"],
        url: "https://dorahacks.io/buidl/31489",
        links: [{ label: "DoraHacks ↗", url: "https://dorahacks.io/buidl/31489" }],
    },
    {
        title: "Secure Task Management Platform",
        desc: "Full-stack task management platform with enterprise-grade security. Built with PHP 8.2 and PostgreSQL featuring role-based access control, session management, and secure CRUD operations.",
        image: "/todolist.png",
        category: "WEB · Full Stack",
        filters: ["WEB"],
        tags: ["PHP 8.2", "PostgreSQL", "Authentication", "Security", "Full Stack"],
        url: "https://mytodolist.infinityfree.me/?i=1",
        links: [{ label: "GitHub ↗", url: "https://github.com/KimiSilalahi766/To-do-list-Project" }],
        liveBadge: true,
    },
    {
        title: "Corkcicle — Scrollytelling Rebuild",
        desc: "A cinematic brand experience rebuilt from the ground up. Silky scroll-driven animations, immersive product storytelling, and micro-interactions that make every pixel feel intentional. Built solo with AI-augmented development workflow.",
        image: "/corkcicle.png",
        category: "Creative · Scrollytelling",
        filters: ["CREATIVE", "WEB"],
        tags: ["Scrollytelling", "React", "GSAP", "Animation", "Creative Dev", "Brand Experience", "UI/UX"],
        url: "https://corkcicle-hd-app.vercel.app/",
        links: [{ label: "View Live Site ↗", url: "https://corkcicle-hd-app.vercel.app/", style: { borderColor: "rgba(0,212,255,0.3)", color: "#00d4ff" } }],
        badge: { text: "SCROLLYTELLING", bg: "rgba(0,212,255,0.2)", border: "rgba(0,212,255,0.4)", color: "#00d4ff" },
        liveBadge: true,
        imagePosition: "top center",
    },
];

export function ProjectsSection() {
    const [activeFilter, setActiveFilter] = useState("ALL");

    const filtered = activeFilter === "ALL" ? PROJECTS : PROJECTS.filter(p => p.filters.includes(activeFilter));

    return (
        <div>
            {/* Filter bar */}
            <div className="flex gap-2 flex-wrap mb-10">
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)}
                        className={`filter-btn ${activeFilter === f ? "filter-btn-active" : ""}`}
                        data-hoverable>{f}</button>
                ))}
            </div>

            {/* Project grid */}
            <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
                {filtered.map((p, i) => {
                    const spans = ['span 7', 'span 5', 'span 4', 'span 4', 'span 4', 'span 12'];
                    const gridColumn = spans[i % spans.length];

                    const getHeight = (index: number) => {
                        if (index === 0) return 260; // Thesis hero
                        if (index === 1) return 260; // Decodream tall
                        if (index === 5) return 300; // Corkcicle cinematic
                        return 180; // Default
                    };
                    const imgHeight = getHeight(i);

                    return (
                        <motion.div key={p.title}
                            className="project-card exp-card" // Added exp-card for shared hover/border logic
                            style={{
                                gridColumn,
                                borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(232,160,32,0.11)',
                                background: 'rgba(14,10,3,0.9)', cursor: 'pointer', padding: 0
                            }}
                            onClick={() => p.url !== "#" && window.open(p.url, "_blank", "noopener,noreferrer")}
                            role="link" tabIndex={0}
                            onKeyDown={e => e.key === "Enter" && p.url !== "#" && window.open(p.url, "_blank")}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Preview image */}
                            <div className="relative w-full overflow-hidden" style={{ height: imgHeight }}>
                                <Image src={p.image} alt={p.title} fill
                                    className="object-cover transition-all duration-700 hover:scale-105"
                                    style={{ filter: "brightness(0.85) contrast(1.1) saturate(1.05)", objectPosition: p.imagePosition || "center" }}
                                    loading="lazy" />
                                {/* Category badge */}
                                <span className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md border border-molten-gold/40 rounded-full font-mono text-[10px] text-molten-gold tracking-widest uppercase z-10">
                                    {p.category}
                                </span>
                                {/* Live badge */}
                                {p.liveBadge && (
                                    <span className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md border rounded-full font-mono text-[10px] tracking-wider z-10 flex items-center gap-1.5"
                                        style={{ borderColor: "rgba(0,212,255,0.3)", color: "#00d4ff" }}>
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", animation: "pulse-ring 2s infinite", display: "inline-block" }} />
                                        LIVE
                                    </span>
                                )}
                                {/* Special badge (if no live badge) */}
                                {p.badge && !p.liveBadge && (
                                    <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full font-mono text-[10px] tracking-widest z-10 font-bold"
                                        style={{ background: p.badge.bg, border: `1px solid ${p.badge.border}`, color: p.badge.color, backdropFilter: 'blur(4px)' }}>
                                        {p.badge.text}
                                    </span>
                                )}
                            </div>

                            {/* Body */}
                            <div style={{ padding: '24px' }}>
                                <h3 className="font-display tracking-wider text-[#f0f0f0] leading-[1.1] mb-3" style={{ fontSize: 'clamp(22px, 2.5vw, 28px)' }}>{p.title}</h3>
                                <p className="font-mono text-[12px] leading-[1.6] text-[#888] mb-5 line-clamp-3">{p.desc}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {p.tags.slice(0, 5).map(t => (
                                        <span key={t} style={{
                                            padding: '4px 10px', background: 'rgba(232,160,32,0.07)',
                                            border: '1px solid rgba(232,160,32,0.18)', borderRadius: 6,
                                            fontFamily: 'JetBrains Mono', fontSize: 10, color: '#b0b8c8'
                                        }}>{t}</span>
                                    ))}
                                    {p.tags.length > 5 && (
                                        <span style={{
                                            padding: '4px 8px', background: 'transparent',
                                            fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555'
                                        }}>+{p.tags.length - 5}</span>
                                    )}
                                </div>
                                
                                {p.links && (
                                    <div className="flex gap-2 flex-wrap">
                                        {p.links.map(l => (
                                            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                style={{
                                                    padding: '4px 12px', background: l.style?.background || 'rgba(232,160,32,0.1)',
                                                    border: `1px solid ${l.style?.borderColor || 'rgba(232,160,32,0.35)'}`, borderRadius: 6,
                                                    fontFamily: 'JetBrains Mono', fontSize: 10, color: l.style?.color || '#e8a020', textDecoration: 'none'
                                                }} data-hoverable>
                                                {l.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
