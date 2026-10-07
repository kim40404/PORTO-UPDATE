import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Exponential ease-out: fast start, long soft settle. The house easing. */
export const EASE = "expo.out";
export const EASE_INOUT = "expo.inOut";

export function reduceMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function finePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches
  );
}

/* ------------------------------------------------------------------ */
/*  Lenis singleton                                                    */
/* ------------------------------------------------------------------ */

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

/** Touch devices already have hardware-accelerated momentum scrolling.
 *  Running a JS scroll loop on top of it costs frames and gains nothing. */
export function touchDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );
}

export function initLenis(): Lenis | null {
  if (lenis) return lenis;
  if (reduceMotion() || touchDevice()) return null;

  lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    syncTouch: false,
    autoRaf: false,
  });

  lenis.on("scroll", ScrollTrigger.update);
  tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis(): void {
  if (tickerFn) gsap.ticker.remove(tickerFn);
  lenis?.destroy();
  lenis = null;
  tickerFn = null;
}

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/** Height of the fixed bar, so anchored headings never land under it. */
function navOffset(target: string | HTMLElement | number): number {
  if (target === 0 || target === "#top") return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  const rem = parseFloat(raw) || 4.25;
  return -(rem * 16 + 8);
}

export function scrollTo(target: string | HTMLElement | number, offset?: number): void {
  const off = offset ?? navOffset(target);
  if (lenis) {
    lenis.scrollTo(target, { offset: off, duration: 1.4, easing: easeOutQuart });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------------------------------------------ */
/*  Scramble / decode effect for mono labels                           */
/* ------------------------------------------------------------------ */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/—";
const running = new WeakMap<HTMLElement, number>();

export function scramble(el: HTMLElement, text: string, duration = 0.5): void {
  if (reduceMotion()) {
    el.textContent = text;
    return;
  }
  const prev = running.get(el);
  if (prev) cancelAnimationFrame(prev);

  const start = performance.now();
  const len = text.length;
  const tick = (now: number) => {
    const p = Math.min((now - start) / (duration * 1000), 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const reveal = Math.floor(eased * len);
    let out = "";
    for (let i = 0; i < len; i++) {
      const ch = text[i];
      out += i < reveal || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) {
      running.set(el, requestAnimationFrame(tick));
    } else {
      el.textContent = text;
      running.delete(el);
    }
  };
  running.set(el, requestAnimationFrame(tick));
}

/* ------------------------------------------------------------------ */
/*  Text splitting (no plugin needed)                                  */
/* ------------------------------------------------------------------ */

export interface WordToken {
  text: string;
  serif: boolean;
}

/** Splits "a *b c* d" into word tokens, where *…* marks serif-italic words. */
export function tokenize(text: string): WordToken[] {
  const out: WordToken[] = [];
  let serif = false;
  for (const raw of text.split(/\s+/)) {
    if (!raw) continue;
    let word = raw;
    if (word.startsWith("*")) {
      serif = true;
      word = word.slice(1);
    }
    let closes = false;
    if (word.endsWith("*")) {
      closes = true;
      word = word.slice(0, -1);
    }
    out.push({ text: word, serif });
    if (closes) serif = false;
  }
  return out;
}
