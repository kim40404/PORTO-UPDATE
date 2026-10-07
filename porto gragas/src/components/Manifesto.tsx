import { useEffect, useRef } from "react";
import { useReveal } from "../hooks/useReveal";
import { gsap, reduceMotion, tokenize } from "../lib/motion";
import { manifesto, stats } from "../data/content";

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = parseFloat(value.replace(/,/g, ""));
    if (Number.isNaN(target) || reduceMotion()) {
      el.textContent = value;
      return;
    }
    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: target,
      duration: 2,
      ease: "expo.out",
      onUpdate: () => {
        el.textContent = Math.round(state.v).toLocaleString("en-US");
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);

  return (
    <span className="num">
      <span ref={ref}>0</span>
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function Manifesto() {
  const ref = useReveal<HTMLElement>();
  const copy = useRef<HTMLParagraphElement>(null);
  const tokens = tokenize(manifesto);

  useEffect(() => {
    const el = copy.current;
    if (!el || reduceMotion()) return;
    const words = el.querySelectorAll(".word");
    const tween = gsap.to(words, {
      opacity: 1,
      ease: "none",
      stagger: 0.06,
      scrollTrigger: {
        trigger: el,
        start: "top 78%",
        end: "bottom 45%",
        scrub: 0.5,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
      <section
        id="manifesto"
        ref={ref}
        className="relative"
        style={{ padding: "var(--section) var(--gutter)" }}
        data-bg="dark"
      >
      <div className="grid gap-10 md:grid-cols-12">
        <div className="label flex items-start gap-3 md:col-span-3" data-reveal>
          <span className="opacity-50">01</span>
          <span>Approach</span>
        </div>

        <p
          ref={copy}
          className="md:col-span-9 md:col-start-4 text-[clamp(1.75rem,3.9vw,3.75rem)] leading-[1.12] tracking-[-0.03em] font-medium"
          style={{ textWrap: "pretty" }}
        >
          {tokens.map((t, i) => (
            <span key={i}>
              <span className={t.serif ? "word serif font-normal" : "word"}>{t.text}</span>{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-[clamp(4rem,9vw,8rem)] grid gap-10 md:grid-cols-12">
        <div className="md:col-span-9 md:col-start-4">
          <div className="h-px w-full bg-current/20" data-reveal-line />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 pt-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} data-reveal={String(i * 0.08)}>
                <dt className="label mb-5 opacity-60">{s.label}</dt>
                <dd className="text-[clamp(2.4rem,4.6vw,4.5rem)] leading-none tracking-[-0.05em] font-light">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
