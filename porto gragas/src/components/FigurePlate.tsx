import { useEffect, useRef, useState } from "react";
import ProjectVisual from "./ProjectVisual";
import type { VisualKind } from "../data/content";
import { cn } from "../utils/cn";

interface Props {
  kind: VisualKind;
  fig: string;
  caption?: string;
  meta?: string;
  className?: string;
  /** force active (e.g. inside a drawer) */
  active?: boolean;
  compact?: boolean;
}

export default function FigurePlate({ kind, fig, caption, meta, className, active, compact }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (active) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.isIntersecting;
        if (e.isIntersecting) {
          setSeen(true);
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  /*
   * Card thumbnails replay a quiet analytical motion every 6–11 seconds.
   * Each plate gets its own phase and alternates direction, so the grid
   * never moves in lockstep. Off-screen and reduced-motion plates sleep.
   */
  useEffect(() => {
    const el = ref.current;
    const ambient = compact && !active;
    if (!el || !ambient || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    let raf = 0;
    let disposed = false;
    let reverse = Math.random() > 0.5;

    const schedule = (first = false) => {
      const delay = first ? 4500 + Math.random() * 3500 : 6200 + Math.random() * 4800;
      timer = window.setTimeout(run, delay);
    };

    const run = () => {
      if (disposed) return;
      if (!visibleRef.current || document.hidden) {
        schedule();
        return;
      }

      el.classList.remove("is-cycling", "cycle-forward", "cycle-reverse");
      raf = requestAnimationFrame(() => {
        if (disposed) return;
        reverse = !reverse;
        el.classList.add("is-cycling", reverse ? "cycle-reverse" : "cycle-forward");
        window.setTimeout(() => {
          if (disposed) return;
          el.classList.remove("is-cycling", "cycle-forward", "cycle-reverse");
        }, 4300);
        schedule();
      });
    };

    schedule(true);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      el.classList.remove("is-cycling", "cycle-forward", "cycle-reverse");
    };
  }, [active, compact]);

  return (
    <div ref={ref} className={cn("plate fig", (active || seen) && "is-active", className)}>
      <div className={cn("label flex items-center justify-between opacity-75", compact ? "px-3 pt-3" : "px-4 pt-4")}>
        <span>Fig. {fig}</span>
        {meta && <span className="num">{meta}</span>}
      </div>
      <div className="plate-figure">
        <div className={cn("absolute", compact ? "inset-x-2 inset-y-1" : "inset-x-4 inset-y-2")}>
          <ProjectVisual kind={kind} className="block h-full w-full" label={caption} />
        </div>
      </div>
      {caption && (
        <div className={cn("label border-t border-white/10 opacity-60", compact ? "px-3 py-2.5" : "px-4 py-3")}>
          {caption}
        </div>
      )}
    </div>
  );
}
