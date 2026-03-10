"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import Image from "next/image";

const SYSTEM_PROMPT = `You are an AI assistant on Kimsang Silalahi's portfolio website.

You can answer ANYTHING the user asks — math, science, cooking, jokes, motivation,
general knowledge, coding, life advice — just like ChatGPT or Gemini normally would.

You also know everything about Kim:
- Full name: Kimsang Silalahi
- Role: AI-Oriented Software Engineer, Full Stack, Web3, Game Developer
- From: Medan, North Sumatra, Indonesia
- GPA: 3.78/4.00 — Universitas Sumatera Utara, Computer Science (2021-2025)
- Skills: Python, PHP 8.2, PostgreSQL, ReactJS, PyTorch, K-Means, DBSCAN,
  cGANs, Lua, Web3/ICP, Firebase, ESP32, Git, CodeIgniter4, Next.js
- Projects: Mobile Legends Player Analytics (S1 thesis + ML),
  Decodream (Web3+AI hackathon, team lead),
  IoT Honey Quality Monitor (ESP32, 88.25% accuracy),
  CareerVerse (blockchain hackathon),
  Corkcicle Scrollytelling,
  Secure Task Management Platform (PHP 8.2 + PostgreSQL)
- Experience: Game Developer at Exstore.id (Roblox),
  Freelance Full Stack & AI Engineer,
  Software Engineer Intern at Ministry of Law and Human Rights Indonesia
- Education exchange: INTI University Malaysia (MBKM 2023-2024)
- Hobbies: Chess (chess.com/member/kim_766), guitar, indie/lo-fi music
- Available for work: YES, immediately
- Email: kimsilalahi@gmail.com
- LinkedIn: https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/
- GitHub: https://github.com/KimiSilalahi766

RULES:
- Reply in SAME language as user (Indonesian → Indonesian, English → English)
- Answer ANY question naturally and helpfully
- For Kim questions → answer enthusiastically from facts above
- Tone: friendly, smart, slightly witty`;

const STARTERS = [
    "Is Kim available for hire?",
    "Ceritain project Kim 🔥",
    "Kasih motivasi 💪",
    "Tell me a joke 😄",
    "1 + 1 berapa? 😄",
    "Kim suka musik apa?",
];

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatBot() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hey! I'm Kim's AI 👋 Tanya apa saja — soal Kim, coding, atau ngobrol santai!" },
    ]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatRef = useRef<any>(null);

    // Init Gemini chat session ONCE
    useEffect(() => {
        try {
            const ai = new GoogleGenAI({
                apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
            });

            chatRef.current = ai.chats.create({
                model: "gemini-2.0-flash-lite",
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                    maxOutputTokens: 600,
                    temperature: 0.85,
                },
            });

            console.log("[ChatBot] Gemini chat session initialized");
        } catch (err) {
            console.error("[ChatBot] Init error:", err);
        }
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 120);
    }, [open]);

    const send = useCallback(async (text: string) => {
        const msg = text.trim();
        if (!msg || loading || !chatRef.current) return;

        setMessages(prev => [...prev, { role: "user", content: msg }]);
        setInput("");
        setLoading(true);

        try {
            const response = await chatRef.current.sendMessage({
                message: msg,
            });

            const reply = response.text ?? "Hmm, coba lagi ya!";
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (err: any) {
            console.error("[ChatBot] Send error:", err);
            setMessages(prev => [...prev, {
                role: "assistant" as const,
                content: "😅 Ada gangguan koneksi. Coba lagi, atau hubungi Kim: kimsilalahi@gmail.com",
            }]);
        }

        setLoading(false);
    }, [loading]);

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send(input);
        }
    };

    // Profile picture for assistant avatar
    const ProfilePic = ({ size = 36 }: { size?: number }) => (
        <div style={{
            width: size, height: size, borderRadius: "50%", overflow: "hidden",
            border: "2px solid rgba(232,160,32,0.5)", flexShrink: 0,
        }}>
            <Image
                src="/my photo.png" alt="Kim" width={size} height={size}
                style={{ objectFit: "cover", objectPosition: "top center", width: "100%", height: "100%" }}
            />
        </div>
    );

    return (
        <>
            {/* ── FAB Button — minimalist brain icon ── */}
            <div
                onClick={() => setOpen(o => !o)}
                style={{
                    position: "fixed", bottom: 28, right: 28, zIndex: 99999,
                    width: 48, height: 48,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(10,7,2,0.94)",
                    border: "1px solid rgba(232,160,32,0.35)",
                    borderRadius: "50%", cursor: "pointer",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(232,160,32,0.08)",
                    transition: "all 0.25s ease", userSelect: "none",
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232,160,32,0.7)";
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.08)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 28px rgba(0,0,0,0.6), 0 0 20px rgba(232,160,32,0.15)";
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232,160,32,0.35)";
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(232,160,32,0.08)";
                }}
                data-hoverable
                title="Ask Kim's AI"
            >
                {open ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.2 4.8-3 6.2V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1.8C6.2 13.8 5 11.5 5 9a7 7 0 0 1 7-7z" />
                        <path d="M9 21h6" /><path d="M10 21v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1" />
                        <path d="M12 6v4" /><path d="M10 8h4" />
                    </svg>
                )}
                <div style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#00d4ff", boxShadow: "0 0 4px #00d4ff", border: "1.5px solid rgba(10,7,2,0.94)" }} />
            </div>

            {/* ── Chat Panel ── */}
            {open && (
                <div
                    onWheel={e => e.stopPropagation()}
                    style={{
                        position: "fixed", bottom: 86, right: 28,
                        width: 390, height: 540, zIndex: 99998,
                        display: "flex", flexDirection: "column",
                        background: "rgba(10,7,2,0.96)",
                        border: "1px solid rgba(232,160,32,0.2)",
                        borderRadius: 20, overflow: "hidden",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(232,160,32,0.06)",
                        animation: "slideUp 0.28s cubic-bezier(0.16,1,0.3,1)",
                    }}>

                    {/* Header */}
                    <div style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid rgba(232,160,32,0.12)",
                        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
                    }}>
                        <ProfilePic size={36} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 600, color: "#f0f0f0" }}>
                                Kim&apos;s AI Assistant
                            </div>
                            <div style={{
                                fontFamily: "JetBrains Mono", fontSize: 10, color: "#00d4ff",
                                display: "flex", alignItems: "center", gap: 5,
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", display: "inline-block", boxShadow: "0 0 4px #00d4ff" }} />
                                Online
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                width: 32, height: 32, borderRadius: 8,
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: "rgba(255,255,255,0.04)",
                                color: "#888", display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", fontSize: 16,
                            }}
                            data-hoverable
                        >✕</button>
                    </div>

                    {/* Messages */}
                    <div
                        onWheel={e => e.stopPropagation()}
                        style={{
                            flex: 1, overflowY: "auto", padding: 16,
                            display: "flex", flexDirection: "column", gap: 12,
                            scrollbarWidth: "thin", scrollbarColor: "rgba(232,160,32,0.2) transparent",
                            overscrollBehavior: "contain",
                            WebkitOverflowScrolling: "touch",
                            touchAction: "pan-y",
                        }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                display: "flex", gap: 8,
                                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                                alignItems: "flex-end",
                            }}>
                                {m.role === "assistant" && <ProfilePic size={24} />}
                                <div style={{
                                    maxWidth: "78%", padding: "10px 14px",
                                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                    background: m.role === "user"
                                        ? "linear-gradient(135deg, rgba(232,160,32,0.2), rgba(245,200,66,0.12))"
                                        : "rgba(255,255,255,0.04)",
                                    border: m.role === "user"
                                        ? "1px solid rgba(232,160,32,0.3)"
                                        : "1px solid rgba(255,255,255,0.07)",
                                    fontFamily: "Syne", fontSize: 13, lineHeight: 1.6,
                                    color: m.role === "user" ? "#f5e8c0" : "#d0d0d0",
                                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                                }}>{m.content}</div>
                            </div>
                        ))}

                        {/* Typing dots */}
                        {loading && (
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-start", alignItems: "flex-end" }}>
                                <ProfilePic size={24} />
                                <div style={{
                                    padding: "12px 18px",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: "16px 16px 16px 4px",
                                    display: "flex", gap: 5, alignItems: "center",
                                }}>
                                    {[0, 1, 2].map(j => (
                                        <div key={j} style={{
                                            width: 7, height: 7, borderRadius: "50%", background: "#e8a020",
                                            animation: `typingDot 1.2s ease-in-out ${j * 0.2}s infinite`,
                                        }} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Starter chips — first message only */}
                    {messages.length === 1 && (
                        <div style={{ padding: "0 16px 8px", display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
                            {STARTERS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => send(s)}
                                    style={{
                                        padding: "5px 12px",
                                        background: "rgba(232,160,32,0.08)",
                                        border: "1px solid rgba(232,160,32,0.22)",
                                        borderRadius: 20,
                                        fontFamily: "JetBrains Mono", fontSize: 10,
                                        color: "#c8a060", cursor: "pointer",
                                        transition: "all 0.2s", whiteSpace: "nowrap",
                                    }}
                                    onMouseEnter={e => {
                                        (e.target as HTMLButtonElement).style.background = "rgba(232,160,32,0.16)";
                                        (e.target as HTMLButtonElement).style.borderColor = "rgba(232,160,32,0.45)";
                                        (e.target as HTMLButtonElement).style.color = "#e8a020";
                                    }}
                                    onMouseLeave={e => {
                                        (e.target as HTMLButtonElement).style.background = "rgba(232,160,32,0.08)";
                                        (e.target as HTMLButtonElement).style.borderColor = "rgba(232,160,32,0.22)";
                                        (e.target as HTMLButtonElement).style.color = "#c8a060";
                                    }}
                                    data-hoverable
                                >{s}</button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{
                        padding: "12px 16px",
                        borderTop: "1px solid rgba(232,160,32,0.1)",
                        display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0,
                    }}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Tanya apa saja..."
                            rows={1}
                            style={{
                                flex: 1,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(232,160,32,0.2)",
                                borderRadius: 12, padding: "10px 14px",
                                fontFamily: "Syne", fontSize: 13, color: "#f0f0f0",
                                resize: "none", outline: "none",
                                lineHeight: 1.5, maxHeight: 100, overflowY: "auto",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "rgba(232,160,32,0.5)"}
                            onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "rgba(232,160,32,0.2)"}
                        />
                        <button
                            onClick={() => send(input)}
                            disabled={loading || !input.trim()}
                            style={{
                                width: 40, height: 40, flexShrink: 0,
                                borderRadius: "50%",
                                background: input.trim() && !loading
                                    ? "linear-gradient(135deg, #e8a020, #f5c842)"
                                    : "rgba(232,160,32,0.15)",
                                border: "none",
                                cursor: input.trim() && !loading ? "pointer" : "default",
                                fontSize: 18,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s",
                            }}
                            data-hoverable
                        >➤</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1); }
                }
                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
                    30%            { transform: translateY(-5px); opacity: 1; }
                }
                @keyframes chatPulse {
                    0%   { transform: scale(1);   opacity: 0.8; }
                    100% { transform: scale(2.8); opacity: 0; }
                }
            `}</style>
        </>
    );
}
