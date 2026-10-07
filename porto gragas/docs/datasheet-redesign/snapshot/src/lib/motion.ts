import Lenis from "lenis";

export function reduceMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function finePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Touch devices already have hardware momentum scrolling; a JS scroll loop costs frames there. */
export function touchDevice(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/* ------------------------------------------------------------------ */
/*  Lenis singleton (desktop only): the paper feed                     */
/* ------------------------------------------------------------------ */

let lenis: Lenis | null = null;
let raf = 0;

export function getLenis(): Lenis | null {
  return lenis;
}

export function initLenis(): Lenis | null {
  if (lenis) return lenis;
  if (reduceMotion() || touchDevice()) return null;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, syncTouch: false, autoRaf: false });
  const loop = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return lenis;
}

export function destroyLenis(): void {
  cancelAnimationFrame(raf);
  lenis?.destroy();
  lenis = null;
}

/** Height of the fixed contents strip, so anchored bars never land under it. */
function stripOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--strip-h");
  return -((parseFloat(raw) || 44) + 12);
}

export function scrollTo(target: string | HTMLElement | number): void {
  const offset = typeof target === "number" ? 0 : stripOffset();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: reduceMotion() ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: reduceMotion() ? "auto" : "smooth" });
}
