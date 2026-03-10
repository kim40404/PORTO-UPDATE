"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";

// ── Dynamic imports (SSR disabled) ──
const HeroSceneDynamic = dynamic(() => import("./Scene").then(m => ({ default: m.HeroScene })), { ssr: false });
const AboutSceneDynamic = dynamic(() => import("./Scene").then(m => ({ default: m.AboutScene })), { ssr: false });
// Self-contained (own canvas / pure three.js)
const BrainCanvasDynamic = dynamic(() => import("./Scene").then(m => ({ default: m.BrainCanvas })), { ssr: false });
const ChessSceneDynamic = dynamic(() => import("./Scene").then(m => ({ default: m.ChessScene })), { ssr: false });

function CanvasSkeleton() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-molten-gold/20 animate-pulse" />
        </div>
    );
}

// ── IntersectionObserver-powered lazy canvas (for scene-only components) ──
function LazyCanvas({
    children,
    className = "",
    interactive = false,
}: {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.05, rootMargin: "200px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`}>
            {isVisible ? (
                <Suspense fallback={<CanvasSkeleton />}>
                    <Canvas
                        frameloop={interactive ? "always" : "demand"}
                        dpr={[1, 1.5]}
                        gl={{ antialias: false, alpha: true, stencil: false, depth: true, powerPreference: "high-performance" }}
                        performance={{ min: 0.5 }}
                        style={{ background: "transparent", touchAction: "none" }}
                    >
                        {children}
                    </Canvas>
                </Suspense>
            ) : (
                <CanvasSkeleton />
            )}
        </div>
    );
}

// ── Exports ──
export function HeroCanvas() {
    return <LazyCanvas interactive><HeroSceneDynamic /></LazyCanvas>;
}
export function AboutCanvas() {
    return <LazyCanvas><AboutSceneDynamic /></LazyCanvas>;
}
// Self-contained — render directly (have own Canvas or pure Three.js)
export function SkillsCanvas() {
    return <BrainCanvasDynamic />;
}
export function ChessCanvas() {
    return <ChessSceneDynamic />;
}
