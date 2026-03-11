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
            <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filtered.map((p, i) => (
                    <motion.div key={p.title}
                        className={`project-card ${p.wide ? "md:col-span-2" : ""}`}
                        style={{
                            borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(232,160,32,0.11)',
                            background: 'rgba(14,10,3,0.9)', transition: 'transform .3s, border-color .3s'
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
                        <div className="relative w-full overflow-hidden" style={{ height: p.imageHeight || 180 }}>
                            <Image src={p.image} alt={p.title} fill
                                className="object-cover transition-all duration-600 hover:scale-105"
                                style={{ filter: "brightness(0.75) contrast(1.1) saturate(0.9)", objectPosition: p.imagePosition || "center" }}
                                loading="lazy" />
                            {/* Category badge */}
                            <span className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm border border-molten-gold/40 rounded-full font-mono text-[10px] text-molten-gold tracking-wider uppercase z-10">
                                {p.category}
                            </span>
                            {/* Arrow */}
                            {p.url !== "#" && (
                                <span className="absolute top-3 right-3 w-8 h-8 bg-molten-gold/15 border border-molten-gold/30 rounded-full flex items-center justify-center text-molten-gold text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">↗</span>
                            )}
                            {/* Live badge */}
                            {p.liveBadge && (
                                <span className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm border rounded-full font-mono text-[10px] tracking-wider z-10 flex items-center gap-1.5" style={{ borderColor: "rgba(0,212,255,0.25)", color: "#00d4ff" }}>
                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", animation: "pulse-ring 2s infinite", display: "inline-block" }} />
                                    LIVE
                                </span>
                            )}
                            {/* Special badge */}
                            {p.badge && (
                                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full font-mono text-[10px] tracking-wider z-10"
                                    style={{ background: p.badge.bg, border: `1px solid ${p.badge.border}`, color: p.badge.color }}>
                                    {p.badge.text}
                                </span>
                            )}
                        </div>

                        {/* Body */}
                        <div style={{ padding: '18px' }}>
                            <h3 className="font-display text-[24px] tracking-wider text-text-primary leading-none mb-2" style={{ fontSize: 22 }}>{p.title}</h3>
                            <p className="font-body text-[13.5px] leading-[1.65] text-text-secondary mb-4 line-clamp-3">{p.desc}</p>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {p.tags.map(t => (<span key={t} className="tag">{t}</span>))}
                            </div>
                            {p.links && (
                                <div className="flex gap-3 flex-wrap">
                                    {p.links.map(l => (
                                        <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()} className="exp-link"
                                            style={l.style} data-hoverable>{l.label}</a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
