import { useEffect, useRef } from "react";
import { finePointer, gsap, reduceMotion } from "../lib/motion";

/** Pulls an element gently toward the cursor while hovered. */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion() || !finePointer()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "expo.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return ref;
}
