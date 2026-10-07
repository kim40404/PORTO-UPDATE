import { useEffect, useRef } from "react";
import { reduceMotion } from "../lib/motion";

/**
 * Adds `className` to the element once, the first time it enters the viewport.
 * Under reduced motion the class is added immediately (final state, no transition).
 *
 *   useDraw()  -> ".is-drawn"   curves draw along their path once
 *   usePrint() -> ".is-printed" a section bar prints across once
 */
function useOnce<T extends HTMLElement>(className: string, rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion() || !("IntersectionObserver" in window)) {
      el.classList.add(className);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add(className);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [className, rootMargin]);
  return ref;
}

export const useDraw = <T extends HTMLElement>() => useOnce<T>("is-drawn");
export const usePrint = <T extends HTMLElement>() => useOnce<T>("is-printed", "0px 0px -8% 0px");
