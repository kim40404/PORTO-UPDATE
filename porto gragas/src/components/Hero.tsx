import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import ClusterField from "./ClusterField";
import { useMagnetic } from "../hooks/useMagnetic";
import { EASE, gsap, reduceMotion, scrollTo } from "../lib/motion";
import { profile } from "../data/content";

interface Props {
  ready: boolean;
}

export default function Hero({ ready }: Props) {
  const section = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const iterRef = useRef<HTMLSpanElement>(null);
  const inertiaRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.22);

  const onStep = useCallback((iter: number, inertia: number, converged: boolean) => {
    if (iterRef.current) iterRef.current.textContent = String(iter).padStart(2, "0");
    if (inertiaRef.current) inertiaRef.current.textContent = iter ? inertia.toFixed(4) : "—";
    if (stateRef.current) stateRef.current.textContent = converged ? "converged" : iter ? "fitting" : "reseed";
  }, []);

  useLayoutEffect(() => {
    const root = section.current;
    if (!root || reduceMotion()) return;
    gsap.set(root.querySelectorAll(".line"), { yPercent: 112 });
    gsap.set(root.querySelectorAll("[data-intro]"), { opacity: 0, y: 16 });
    gsap.set(plate.current, { opacity: 0, clipPath: "inset(0 0 100% 0)" });
  }, []);

  useEffect(() => {
    const root = section.current;
    if (!root || !ready || reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE } })
        .to(root.querySelectorAll(".line"), { yPercent: 0, duration: 1.6, stagger: 0.12 }, 0.1)
        .to(plate.current, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 1.8 }, 0.3)
        .to(root.querySelectorAll("[data-intro]"), { opacity: 1, y: 0, duration: 1.3, stagger: 0.07 }, 0.6);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="top"
      ref={section}
      className="relative flex min-h-[100svh] flex-col"
      style={{ padding: "clamp(6rem, 13vh, 8.5rem) var(--gutter) var(--gutter)" }}
      data-bg="dark"
    >
      <div className="grid flex-1 gap-12 lg:grid-cols-12 lg:gap-10">
        {/* copy */}
        <div className="flex flex-col justify-end lg:col-span-5 lg:pb-4">
          <span className="label flex items-center gap-2.5 opacity-80" data-intro>
            <i className="pulse inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {profile.role} — {profile.location}
          </span>

          <h1 className="display mt-6" style={{ fontSize: "clamp(3.4rem, 8.4vw, 9rem)" }}>
            <span className="mask">
              <span className="line">{profile.first}</span>
            </span>
            <span className="mask">
              <span className="line">
                {profile.last}
                <span className="text-accent">.</span>
              </span>
            </span>
          </h1>

          <p className="lead mt-8 max-w-[24ch] text-fg/85" data-intro>
            I build LLM apps, retrieval systems and MLOps that reach <span className="serif">production.</span>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3" data-intro>
            <a
              ref={ctaRef}
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#work");
              }}
              className="cta label text-[0.75rem]!"
            >
              <span className="cta-dot" />
              View work
            </a>
            <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="btn-ghost label">
              CV <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* live figure plate */}
        <div className="flex flex-col lg:col-span-7">
          <div ref={plate} className="relative flex min-h-[340px] flex-1 flex-col border border-line sm:min-h-[420px]">
            <div className="label flex items-center justify-between border-b border-line px-4 py-3 opacity-80">
              <span>Fig. 01 — Player segmentation</span>
              <span className="hidden sm:inline">K-Means · k = 4</span>
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-3 sm:inset-5">
                <ClusterField className="block h-full w-full" onStep={onStep} />
              </div>
            </div>
            <div className="label grid grid-cols-3 border-t border-line text-[0.625rem]">
              <span className="border-r border-line px-4 py-3">
                <span className="opacity-50">Iter </span>
                <span ref={iterRef} className="num">
                  00
                </span>
              </span>
              <span className="border-r border-line px-4 py-3">
                <span className="opacity-50">Inertia </span>
                <span ref={inertiaRef} className="num">
                  —
                </span>
              </span>
              <span className="px-4 py-3 text-accent">
                <span ref={stateRef}>reseed</span>
              </span>
            </div>
          </div>
          <p className="label mt-3 hidden opacity-45 lg:block" data-intro>
            Move the cursor over the plot to probe a point.
          </p>
        </div>
      </div>
    </section>
  );
}
