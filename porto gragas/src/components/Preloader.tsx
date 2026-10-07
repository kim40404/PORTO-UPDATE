import { useEffect, useRef, useState } from "react";
import { EASE_INOUT, gsap, reduceMotion } from "../lib/motion";
import { profile } from "../data/content";

const SEEN_KEY = "ks:intro";

interface Props {
  onDone: () => void;
}

export default function Preloader({ onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* private mode */
    }

    if (seen || reduceMotion()) {
      setMounted(false);
      doneRef.current();
      return;
    }

    const root = rootRef.current;
    const num = numRef.current;
    const bar = barRef.current;
    const body = bodyRef.current;
    if (!root || !num || !bar || !body) return;

    window.scrollTo(0, 0);

    const state = { v: 0 };
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => setMounted(false),
    });

    tl.to(state, {
      v: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(state.v);
        num.textContent = String(v).padStart(3, "0");
        bar.style.transform = `scaleX(${state.v / 100})`;
      },
    })
      .to(body, { opacity: 0, y: -16, duration: 0.45, ease: "power2.in" }, "+=0.1")
      .call(
        () => {
          try {
            sessionStorage.setItem(SEEN_KEY, "1");
          } catch {
            /* ignore */
          }
          doneRef.current();
        },
        [],
        "-=0.05",
      )
      .to(root, { yPercent: -100, duration: 1.15, ease: EASE_INOUT }, "<+0.08");

    return () => {
      tl.kill();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div ref={bodyRef} className="grid h-full grid-rows-[auto_1fr_auto]">
        <div className="flex items-start justify-between">
          <span className="label">{profile.name}</span>
          <span className="label opacity-60">{profile.location}</span>
        </div>

        <div className="flex items-end">
          <span
            ref={numRef}
            className="num text-[clamp(4rem,14vw,11rem)] leading-none tracking-[-0.06em] font-light"
          >
            000
          </span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <span className="label opacity-60">Fitting k = 4 — loading figures</span>
          <div className="h-px w-[min(40vw,16rem)] bg-fg/20">
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
