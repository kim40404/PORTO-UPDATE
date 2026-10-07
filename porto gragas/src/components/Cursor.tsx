import { useEffect, useRef } from "react";
import { finePointer, gsap, reduceMotion } from "../lib/motion";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reduceMotion()) return;

    document.documentElement.classList.add("has-cursor");
    el.classList.add("is-hidden");

    const xTo = gsap.quickTo(el, "x", { duration: 0.32, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.32, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.remove("is-hidden");
      const target = e.target as Element | null;
      const interactive = target?.closest("a, button, [data-hover]");
      el.classList.toggle("is-hover", !!interactive);
    };
    const onDown = () => el.classList.add("is-press");
    const onUp = () => el.classList.remove("is-press");
    const onLeave = () => el.classList.add("is-hidden");
    const onEnter = () => el.classList.remove("is-hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <div className="cursor-dot" />
    </div>
  );
}
