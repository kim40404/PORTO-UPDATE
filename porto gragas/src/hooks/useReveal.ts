import { useLayoutEffect, useRef } from "react";
import { EASE, gsap, reduceMotion } from "../lib/motion";

/**
 * Declarative scroll reveals for a section.
 *
 *   data-mask            → children `.line` slide up from behind a mask
 *   data-reveal="0.15"   → fade + rise (optional delay in seconds)
 *   data-reveal-line     → horizontal rule grows from the left
 *
 * All animations are transform/opacity only and fire once.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || reduceMotion()) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-mask]").forEach((mask) => {
        const lines = mask.querySelectorAll<HTMLElement>(".line");
        if (!lines.length) return;
        gsap.fromTo(
          lines,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: 2,
            ease: EASE,
            stagger: 0.09,
            scrollTrigger: { trigger: mask, start: "top 90%", once: true },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const delay = parseFloat(el.dataset.reveal || "0") || 0;
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.75,
          delay,
          ease: EASE,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      root.querySelectorAll<HTMLElement>("[data-reveal-line]").forEach((el) => {
        gsap.to(el, {
          scaleX: 1,
          duration: 2.2,
          ease: EASE,
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return ref;
}
