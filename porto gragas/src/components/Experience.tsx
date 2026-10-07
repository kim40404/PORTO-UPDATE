import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { ScrollTrigger } from "../lib/motion";
import { certifications, experience, profile } from "../data/content";
import { cn } from "../utils/cn";

export default function Experience() {
  const ref = useReveal<HTMLElement>();
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpen((o) => (o === i ? null : i));
    window.setTimeout(() => ScrollTrigger.refresh(), 650);
  };

  return (
    <section id="experience" ref={ref} className="relative" style={{ padding: "0 var(--gutter) var(--section)" }} data-bg="light">
      <div className="grid gap-10 border-t border-line pt-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="label flex items-center gap-3" data-reveal>
            <span className="opacity-50">06</span>
            <span>Experience</span>
          </div>
          <h2 className="h2 mt-6" data-mask>
            <span className="mask">
              <span className="line">Where the work</span>
            </span>
            <span className="mask">
              <span className="line serif">happened.</span>
            </span>
          </h2>
          <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="btn-ghost label mt-8" data-reveal="0.1">
            Full CV <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="md:col-span-8">
          <ul>
            {experience.map((job, i) => {
              const isOpen = open === i;
              return (
                <li key={job.company} className="border-b border-line first:border-t" data-reveal={String(i * 0.05)}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`exp-${i}`}
                    className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-6 text-left sm:grid-cols-[10rem_1fr_auto]"
                  >
                    <span className="label num hidden opacity-60 sm:block">{job.period}</span>
                    <span>
                      <span className="block text-[clamp(1.2rem,2vw,1.6rem)] font-medium tracking-[-0.025em]">{job.company}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {job.role}
                        <span className="sm:hidden"> · {job.period}</span>
                      </span>
                    </span>
                    <span className={cn("plus", isOpen && "is-open")} aria-hidden="true" />
                  </button>
                  <div id={`exp-${i}`} className={cn("expand", isOpen && "is-open")}>
                    <div>
                      <ul className="space-y-3 pb-8 sm:pl-[10rem]">
                        {job.highlights.map((h, hi) => (
                          <li key={hi} className="flex gap-4 text-muted">
                            <span className="label num mt-1.5 text-accent">0{hi + 1}</span>
                            <span className="max-w-[56ch]">{h}</span>
                          </li>
                        ))}
                        <li className="label pt-2 opacity-40">{job.place}</li>
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-14 grid gap-px border border-line bg-[var(--line)] sm:grid-cols-3" data-reveal>
            {certifications.map((c) => (
              <div key={c.name} className="bg-[var(--bg)] p-5 transition-colors duration-[900ms]">
                <div className="font-medium">{c.name}</div>
                <div className="label mt-2 opacity-50">{c.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
