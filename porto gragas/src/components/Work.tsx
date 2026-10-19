import { useEffect, useMemo, useState } from "react";
import FigurePlate from "./FigurePlate";
import Drawer from "./Drawer";
import { useReveal } from "../hooks/useReveal";
import { ScrollTrigger } from "../lib/motion";
import { groups, projects, type Project, type ProjectGroup } from "../data/content";
import { cn } from "../utils/cn";

function ProjectDetail({ p, n }: { p: Project; n: number }) {
  const letters = "abcdefgh";

  return (
    <article>
      {/* heading */}
      <div className="label flex items-center gap-4 opacity-70">
        <span className="text-accent">{p.index}</span>
        <span>{p.group}</span>
        <span className="num ml-auto">{p.year}</span>
      </div>
      <h3 className="h2 mt-4">{p.title}</h3>
      <p className="mt-2 text-muted">{p.subtitle}</p>

      <p className="mt-7 text-[1.08rem] leading-relaxed">{p.summary}</p>

      {/* headline metric */}
      <div className="mt-8 flex items-end gap-5 border-y border-line py-5">
        <span className="num text-[2.6rem] font-light leading-none tracking-[-0.04em] text-accent">{p.metric.value}</span>
        <span className="label pb-1.5 opacity-60">{p.metric.label}</span>
      </div>

      {/* every figure, nothing hidden */}
      <section className="mt-12">
        <header className="mb-5 flex items-baseline justify-between">
          <h4 className="label text-accent">Figures</h4>
          <span className="label num opacity-40">{String(p.figures.length).padStart(2, "0")}</span>
        </header>
        <div className={cn("grid gap-6", p.figures.length > 1 && "sm:grid-cols-2")}>
          {p.figures.map((f, i) => (
            <FigurePlate
              key={`${f.kind}-${i}`}
              kind={f.kind}
              fig={`${n}.${letters[i]}`}
              meta={p.year}
              caption={f.caption}
              active
              compact={p.figures.length > 1}
            />
          ))}
        </div>
      </section>

      {/* every screenshot, nothing hidden */}
      {p.shots && p.shots.length > 0 && (
        <section className="mt-12">
          <header className="mb-5 flex items-baseline justify-between">
            <h4 className="label text-accent">Screenshots</h4>
            <span className="label num opacity-40">{String(p.shots.length).padStart(2, "0")}</span>
          </header>
          <div className={cn("grid gap-6", p.shots.length > 1 && "sm:grid-cols-2")}>
            {p.shots.map((s, i) => (
              <figure key={s.src} className="plate overflow-hidden">
                <div className="label flex items-center justify-between px-4 pt-4 opacity-70">
                  <span>Shot {String(i + 1).padStart(2, "0")}</span>
                  <span className="num">{p.year}</span>
                </div>
                <div className="px-4 py-3">
                  <img
                    src={s.src}
                    alt={s.caption}
                    loading="lazy"
                    className="block max-h-[22rem] w-full rounded-sm object-contain"
                  />
                </div>
                <figcaption className="label border-t border-white/10 px-4 py-3 opacity-60">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* how it works */}
      <section className="mt-12">
        <h4 className="label text-accent">How it works</h4>
        <p className="mt-4 leading-relaxed text-muted">{p.detail}</p>
      </section>

      {/* verified facts */}
      <section className="mt-10">
        <h4 className="label text-accent">Details</h4>
        <dl className="mt-4">
          {p.facts.map((f) => (
            <div key={f.k} className="grid grid-cols-[9rem_1fr] gap-4 border-t border-line py-3.5 last:border-b">
              <dt className="label pt-1 opacity-50">{f.k}</dt>
              <dd className="text-[0.95rem]">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* stack */}
      <section className="mt-10">
        <h4 className="label text-accent">Stack</h4>
        <ul className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <li key={s} className="chip pointer-events-none">
              {s}
            </li>
          ))}
        </ul>
      </section>

      {p.note && (
        <p className="mt-10 border-l border-accent bg-surface px-5 py-4 text-sm leading-relaxed text-muted">{p.note}</p>
      )}

      {(p.href || p.demo) && (
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {p.href && (
            <a href={p.href} target="_blank" rel="noreferrer" className="cta label text-[0.75rem]!">
              <span className="cta-dot" />
              {p.linkLabel ?? "GitHub"} <span aria-hidden="true">↗</span>
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" className="btn-ghost label">
              {p.demoLabel ?? "Live"} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default function Work() {
  const ref = useReveal<HTMLElement>();
  const [filter, setFilter] = useState<"All" | ProjectGroup>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.group === filter)), [filter]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    projects.forEach((p) => (c[p.group] = (c[p.group] ?? 0) + 1));
    return c;
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [filter]);

  const openIdx = projects.findIndex((p) => p.id === openId);
  const open = openIdx >= 0 ? projects[openIdx] : null;

  const totalFigures = projects.reduce((a, p) => a + p.figures.length, 0);

  return (
    <section id="work" ref={ref} className="relative" style={{ padding: "var(--section) var(--gutter)" }} data-bg="light">
      <header className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <div className="label flex items-center gap-3" data-reveal>
            <span className="opacity-50">02</span>
            <span>Selected work</span>
          </div>
          <h2 className="h1 mt-6" data-mask>
            <span className="mask">
              <span className="line">Ten projects,</span>
            </span>
            <span className="mask">
              <span className="line">
                {totalFigures} <span className="serif">figures.</span>
              </span>
            </span>
          </h2>
        </div>
        <p className="text-muted md:col-span-4 md:col-start-9" data-reveal="0.1">
          Open a plate to see every figure, every screenshot, and how the system actually works.
        </p>
      </header>

      {/* filters */}
      <div
        className="mt-14 flex flex-wrap items-center gap-2 border-b border-line pb-6"
        role="tablist"
        aria-label="Filter projects"
        data-reveal
      >
        {groups.map((g) => (
          <button
            key={g}
            type="button"
            role="tab"
            aria-selected={filter === g}
            onClick={() => setFilter(g)}
            className={cn("chip", filter === g && "is-on")}
          >
            {g}
            <span className="num opacity-50">{counts[g] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* grid */}
      <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((p) => {
          const n = projects.indexOf(p) + 1;
          const shots = p.shots?.length ?? 0;
          return (
            <li key={p.id} className="card-in min-w-0">
              <button
                type="button"
                onClick={() => setOpenId(p.id)}
                className="work-card group block w-full text-left"
                aria-label={`Open ${p.title}`}
              >
                <FigurePlate kind={p.figures[0].kind} fig={`${n}.a`} meta={p.year} compact className="aspect-[4/5]" />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="label block truncate opacity-50">
                      {p.index} · {p.group}
                    </span>
                    <h3 className="mt-2 text-[1.2rem] font-medium leading-tight tracking-[-0.02em]">
                      <span className="work-title">{p.title}</span>
                    </h3>
                    <span className="label mt-2.5 block opacity-40">
                      {p.figures.length} fig{p.figures.length > 1 ? "s" : ""}
                      {shots > 0 && ` · ${shots} shot${shots > 1 ? "s" : ""}`}
                    </span>
                  </div>
                  <span className="work-arrow label mt-6 shrink-0" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Drawer open={!!open} onClose={() => setOpenId(null)} label={open ? `Project ${open.index} / 10` : ""}>
        {open && <ProjectDetail key={open.id} p={open} n={openIdx + 1} />}
      </Drawer>
    </section>
  );
}
