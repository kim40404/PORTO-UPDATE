import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { aboutFacts, portraits } from "../data/content";
import { cn } from "../utils/cn";

export default function AboutStage() {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState(1);

  return (
    <section id="about" ref={ref} className="relative" style={{ padding: "var(--section) var(--gutter)" }} data-bg="dark">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* portrait */}
        <div className="lg:col-span-5" data-reveal>
          <div className="plate relative aspect-[4/5] overflow-hidden">
            {portraits.map((p, i) => (
              <img
                key={p.label}
                src={p.image}
                alt={`Kimsang Silalahi — ${p.label.toLowerCase()} portrait`}
                loading="lazy"
                className={cn(
                  "portrait absolute inset-0 h-full w-full object-cover object-top",
                  i === active ? "is-on" : "",
                )}
              />
            ))}
            <div className="portrait-meta label absolute inset-x-0 top-0 flex justify-between p-4">
              <span>Fig. 4.1</span>
              <span className="num">0{active + 1} / 03</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2" role="tablist" aria-label="Portraits">
            {portraits.map((p, i) => (
              <button
                key={p.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn("chip", i === active && "is-on")}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* text */}
        <div className="flex flex-col lg:col-span-6 lg:col-start-7">
          <div className="label flex items-center gap-3" data-reveal>
            <span className="opacity-50">04</span>
            <span>About</span>
          </div>
          <h2 className="h1 mt-6" data-mask>
            <span className="mask">
              <span className="line">A generalist</span>
            </span>
            <span className="mask">
              <span className="line">
                leaning <span className="serif">deep.</span>
              </span>
            </span>
          </h2>

          <blockquote className="mt-10 border-l border-accent pl-5" data-reveal="0.05">
            <p className="serif text-[1.5rem] leading-snug">“The limits of my language mean the limits of my world.”</p>
            <footer className="label mt-3 opacity-50">Ludwig Wittgenstein</footer>
          </blockquote>

          <div className="mt-10 max-w-[52ch] space-y-4 text-muted" data-reveal="0.1">
            <p>I translate complex human problems into intelligent, intuitive systems — technology that feels invisible yet makes a real impact.</p>
            <p>From game analytics and IoT to LLM agents: I build things that think, then make them reliable.</p>
          </div>

          <dl className="mt-auto pt-12">
            {aboutFacts.map((f, i) => (
              <div key={f.k} className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line py-4 last:border-b" data-reveal={String(0.1 + i * 0.04)}>
                <dt className="label pt-1 opacity-50">{f.k}</dt>
                <dd className="text-[0.95rem]">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
