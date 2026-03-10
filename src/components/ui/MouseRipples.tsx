"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const cur = useRef({ x: 0, y: 0 });
    const lag = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            cur.current = { x: e.clientX, y: e.clientY };
            if (dotRef.current) {
                dotRef.current.style.left = e.clientX + "px";
                dotRef.current.style.top = e.clientY + "px";
            }
        };

        const over = (e: MouseEvent) => {
            if ((e.target as Element)?.closest?.("a,button,[role=link],[role=button],[data-hoverable]")) {
                ringRef.current?.classList.add("ring-hover");
                dotRef.current?.classList.add("dot-hover");
            }
        };
        const out = (e: MouseEvent) => {
            if ((e.target as Element)?.closest?.("a,button,[role=link],[role=button],[data-hoverable]")) {
                ringRef.current?.classList.remove("ring-hover");
                dotRef.current?.classList.remove("dot-hover");
            }
        };
        const down = () => ringRef.current?.classList.add("ring-click");
        const up = () => ringRef.current?.classList.remove("ring-click");

        function animate() {
            lag.current.x += (cur.current.x - lag.current.x) * 0.12;
            lag.current.y += (cur.current.y - lag.current.y) * 0.12;
            if (ringRef.current) {
                ringRef.current.style.left = (lag.current.x - 20) + "px";
                ringRef.current.style.top = (lag.current.y - 20) + "px";
            }
            rafRef.current = requestAnimationFrame(animate);
        }
        rafRef.current = requestAnimationFrame(animate);

        window.addEventListener("mousemove", move, { passive: true });
        window.addEventListener("mouseover", over, { passive: true });
        window.addEventListener("mouseout", out, { passive: true });
        window.addEventListener("mousedown", down, { passive: true });
        window.addEventListener("mouseup", up, { passive: true });

        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseover", over);
            window.removeEventListener("mouseout", out);
            window.removeEventListener("mousedown", down);
            window.removeEventListener("mouseup", up);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            <div ref={ringRef} className="cursor-ring" />
            <div ref={dotRef} className="cursor-dot" />
        </>
    );
}
