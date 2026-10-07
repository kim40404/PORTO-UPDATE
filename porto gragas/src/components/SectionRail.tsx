import { useEffect, useRef, useState } from "react";
import { EASE, ScrollTrigger, gsap, reduceMotion, scrollTo } from "../lib/motion";
import { cn } from "../utils/cn";

const SECTIONS = [
  { id: "top", label: "Index" },
  { id: "manifesto", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "method", label: "Method" },
  { id: "about", label: "About" },
  { id: "writing", label: "Writing" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function SectionRail({ ready }: { ready: boolean }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const triggers = SECTIONS.map((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setActive(i),
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;
    if (reduceMotion()) gsap.set(ref.current, { opacity: 1 });
    else gsap.to(ref.current, { opacity: 1, duration: 1.1, ease: EASE, delay: 1.1 });
  }, [ready]);

  return (
    <nav ref={ref} aria-label="Sections" className="rail" style={{ opacity: 0 }}>
      <ul>
        {SECTIONS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => scrollTo(`#${s.id}`)}
              className={cn("rail-item", i === active && "is-active")}
              aria-current={i === active ? "true" : undefined}
            >
              <span className="rail-label label">{s.label}</span>
              <span className="rail-tick" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
