import { useEffect, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { useMagnetic } from "../hooks/useMagnetic";
import { scrollTo } from "../lib/motion";
import { profile } from "../data/content";

const LINKS = [
  { label: "LinkedIn", href: profile.linkedin, meta: "kimsang-silalahi" },
  { label: "GitHub", href: profile.github, meta: "kim40404" },
  { label: "Hugging Face", href: profile.huggingface, meta: "kimsangsilalahi" },
  { label: "WhatsApp", href: profile.whatsapp, meta: profile.phone },
];

function useLocalTime(timeZone: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

export default function Contact() {
  const ref = useReveal<HTMLElement>();
  const cta = useMagnetic<HTMLAnchorElement>(0.18);
  const time = useLocalTime(profile.timezone);

  return (
    <footer
      id="contact"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between"
      style={{ padding: "var(--section) var(--gutter) calc(var(--gutter) * 0.8)" }}
      data-bg="dark"
    >
      <div>
        <div className="label flex items-center gap-3" data-reveal>
          <span className="opacity-50">07</span>
          <span>Contact</span>
        </div>
        <h2 className="display mt-8" data-mask style={{ fontSize: "clamp(3rem, 9vw, 9rem)" }}>
          <span className="mask">
            <span className="line">Let&apos;s build</span>
          </span>
          <span className="mask">
            <span className="line">
              something that <span className="serif">thinks.</span>
            </span>
          </span>
        </h2>

        <div className="mt-12 flex flex-wrap items-center gap-3" data-reveal>
          <a ref={cta} href={`mailto:${profile.email}`} className="cta text-[clamp(1rem,1.5vw,1.3rem)] font-medium tracking-[-0.01em]">
            <span className="cta-dot" />
            {profile.email}
          </a>
          <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="btn-ghost label">
            CV <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="label mt-6 opacity-50" data-reveal="0.1">
          {profile.availability} · Remote-first
        </p>
      </div>

      <div className="mt-24">
        <ul className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {LINKS.map((l, i) => (
            <li key={l.label} className={i % 2 ? "border-l border-line md:border-l" : i ? "md:border-l md:border-line" : ""} data-reveal={String(i * 0.05)}>
              <a href={l.href} target="_blank" rel="noreferrer" className="group flex flex-col gap-2 px-1 py-6 md:px-5">
                <span className="flex items-center justify-between font-medium">
                  {l.label}
                  <span aria-hidden="true" className="arrow">
                    ↗
                  </span>
                </span>
                <span className="label truncate opacity-45">{l.meta}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="label flex flex-col gap-3 border-t border-line pt-6 opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="flex items-center gap-2">
            <i className="pulse inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Medan <span className="num">{time || "--:--"}</span> {profile.tzLabel}
          </span>
          <button type="button" onClick={() => scrollTo(0)} className="u-link self-start sm:self-auto">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
