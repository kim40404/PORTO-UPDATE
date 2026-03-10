"use client";
import { useState, useEffect, useRef } from "react";

function easeOutExpo(t: number) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function Preloader({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [textPhase, setTextPhase] = useState(0);
    // 0=hidden, 1=name, 2=subtitle, 3=tagline, 4=fadeout

    useEffect(() => {
        let start: number | null = null;
        const duration = 2400;
        function step(ts: number) {
            if (!start) start = ts;
            const t = Math.min((ts - start) / duration, 1);
            setProgress(Math.round(easeOutExpo(t) * 100));
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);

        const t1 = setTimeout(() => setTextPhase(1), 200);
        const t2 = setTimeout(() => setTextPhase(2), 700);
        const t3 = setTimeout(() => setTextPhase(3), 1200);
        const t4 = setTimeout(() => setTextPhase(4), 2200);
        const t5 = setTimeout(() => onComplete(), 2900);
        return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "#080808",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            opacity: textPhase === 4 ? 0 : 1,
            transform: textPhase === 4 ? "scale(1.02)" : "scale(1)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            pointerEvents: textPhase === 4 ? "none" : "all",
            overflow: "hidden",
        }}>
            {/* Breathing ambient glow */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,134,10,0.07) 0%, transparent 70%)",
                animation: "preloaderBreath 2.5s ease-in-out infinite",
            }} />

            {/* Horizontal scan line */}
            <div style={{
                position: "absolute", left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent, rgba(232,160,32,0.4), transparent)",
                animation: "scanLine 2.4s ease forwards",
                pointerEvents: "none",
            }} />

            {/* Main content */}
            <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                {/* Small label */}
                <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    letterSpacing: "0.3em", color: "rgba(232,160,32,0.5)",
                    textTransform: "uppercase", marginBottom: 20,
                    opacity: textPhase >= 1 ? 1 : 0,
                    transform: textPhase >= 1 ? "translateY(0)" : "translateY(6px)",
                    transition: "all 0.6s ease",
                }}>CREATIVE DEVELOPER · 2026</div>

                {/* Name */}
                <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(64px, 11vw, 130px)", lineHeight: 0.88,
                    letterSpacing: "0.04em",
                    opacity: textPhase >= 1 ? 1 : 0,
                    transform: textPhase >= 1 ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                }}>
                    <div style={{
                        background: "linear-gradient(180deg, #f8f8f8 0%, #a8a8a8 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>KIMSANG</div>
                    <div style={{
                        background: "linear-gradient(135deg, #c8860a 0%, #f5c842 45%, #e8a020 80%, #c8860a 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        backgroundSize: "200% 100%", animation: "goldShimmer 2s linear infinite",
                    }}>SILALAHI</div>
                </div>

                {/* Divider */}
                <div style={{
                    width: textPhase >= 2 ? 120 : 0, height: 1,
                    background: "linear-gradient(90deg, transparent, #e8a020, transparent)",
                    margin: "22px auto", transition: "width 0.6s ease 0.1s",
                }} />

                {/* Subtitle */}
                <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(13px, 1.6vw, 17px)", color: "#b0b8c8",
                    letterSpacing: "0.06em",
                    opacity: textPhase >= 2 ? 1 : 0,
                    transform: textPhase >= 2 ? "translateY(0)" : "translateY(8px)",
                    transition: "all 0.7s ease",
                }}>AI-Oriented Software Engineer</div>

                {/* Tagline */}
                <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "clamp(10px, 1vw, 12px)", color: "rgba(232,160,32,0.45)",
                    letterSpacing: "0.18em", marginTop: 10, textTransform: "uppercase",
                    opacity: textPhase >= 3 ? 1 : 0, transition: "opacity 0.6s ease",
                }}>Full Stack · AI Agents · Web3 · Game Dev</div>
            </div>

            {/* Progress bar */}
            <div style={{
                position: "absolute", bottom: 48, left: "50%",
                transform: "translateX(-50%)", width: "min(320px, 60vw)",
                opacity: textPhase >= 2 ? 1 : 0, transition: "opacity 0.5s ease",
            }}>
                <div style={{
                    display: "flex", justifyContent: "space-between", marginBottom: 10,
                    fontFamily: "JetBrains Mono", fontSize: 11,
                    color: "rgba(232,160,32,0.35)", letterSpacing: "0.1em",
                }}>
                    <span>LOADING</span><span>{progress}%</span>
                </div>
                <div style={{
                    width: "100%", height: 1, background: "rgba(255,255,255,0.06)",
                    borderRadius: 1, overflow: "hidden", position: "relative",
                }}>
                    <div style={{
                        position: "absolute", top: 0, left: 0,
                        width: `${progress}%`, height: "100%",
                        background: "linear-gradient(90deg, #c8860a, #f5c842)",
                        boxShadow: "0 0 8px rgba(245,200,66,0.7)",
                        transition: "width 0.08s linear",
                    }} />
                    <div style={{
                        position: "absolute", top: -2,
                        left: `calc(${progress}% - 4px)`,
                        width: 8, height: 5, background: "#fff8e0",
                        borderRadius: "50%", filter: "blur(3px)",
                        boxShadow: "0 0 6px #f5c842", transition: "left 0.08s linear",
                    }} />
                </div>
            </div>

            {/* Stamp */}
            <div style={{
                position: "absolute", bottom: 20, right: 24,
                fontFamily: "JetBrains Mono", fontSize: 10,
                color: "rgba(232,160,32,0.2)", letterSpacing: "0.08em",
            }}>PORTO · KIM © 2026</div>

            <style>{`
                @keyframes preloaderBreath {
                    0%,100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.08); }
                }
                @keyframes scanLine {
                    0% { top: -2px; opacity: 0; }
                    5% { opacity: 1; }
                    95% { opacity: 0.4; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes goldShimmer {
                    0% { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
            `}</style>
        </div>
    );
}
