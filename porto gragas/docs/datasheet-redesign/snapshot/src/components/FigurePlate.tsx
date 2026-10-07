import { useEffect, useRef, useState } from "react";
import ProjectVisual from "./ProjectVisual";
import type { VisualKind } from "../data/content";
import { reduceMotion } from "../lib/motion";

interface Props {
  kind: VisualKind;
  /** force active (inside the drawer, where the figure is already in view) */
  active?: boolean;
  className?: string;
  /** accessible name of the figure, usually its caption */
  label?: string;
}

/** The figure itself: `.fig` gets `is-active` once, the first time it enters view, so its curves draw. */
export default function FigurePlate({ kind, active, className, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (active || seen) return;
    const el = ref.current;
    if (!el) return;
    if (reduceMotion() || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active, seen]);

  return (
    <div ref={ref} className={`fig${active || seen ? " is-active" : ""}${className ? ` ${className}` : ""}`}>
      <ProjectVisual kind={kind} className="block h-full w-full" label={label} />
    </div>
  );
}
