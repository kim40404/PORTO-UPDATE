import { useState } from "react";
import Drawer from "./Drawer";
import { useReveal } from "../hooks/useReveal";
import { articles } from "../data/content";

export default function WritingSection() {
  const ref = useReveal<HTMLElement>();
  const [openId, setOpenId] = useState<string | null>(null);
  const article = articles.find((x) => x.id === openId);

  return (
    <section
      id="writing"
      ref={ref}
      className="relative"
      style={{ padding: "var(--section) var(--gutter)" }}
      data-bg="light"
    >
      <header className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <div className="label flex items-center gap-3" data-reveal>
            <span className="opacity-50">05</span>
            <span>Writing</span>
          </div>
          <h2 className="h1 mt-6" data-mask>
            <span className="mask"><span className="line">Notes from</span></span>
            <span className="mask"><span className="line serif">the build.</span></span>
          </h2>
        </div>
        <p className="max-w-[40ch] text-muted md:col-span-4 md:col-start-9" data-reveal="0.08">
          Five field notes, each paired with its original project evidence.
        </p>
      </header>

      <ul className="mt-16 border-t border-line">
        {articles.map((art, i) => (
          <li key={art.id} className="writing-index-item" data-reveal={String(i * 0.05)}>
            <button
              type="button"
              onClick={() => setOpenId(art.id)}
              className="writing-index group"
              aria-label={`Read ${art.title}`}
            >
              <span className="label num pt-1 text-accent">{art.number}</span>
              <span className="min-w-0">
                <span className="label block opacity-45">{art.category}</span>
                <span className="mt-3 block text-[clamp(1.35rem,2.5vw,2.2rem)] font-medium leading-[1.05] tracking-[-0.03em]">
                  <span className="work-title">{art.title}</span>
                </span>
                <span className="mt-4 block max-w-[50ch] text-muted">{art.description}</span>
                <span className="label mt-5 flex items-center gap-4 opacity-45">
                  <span>{art.date}</span><span>{art.read}</span>
                </span>
              </span>
              <span className="writing-index-visual" aria-hidden="true">
                <span className="plate block aspect-[4/3] overflow-hidden p-2">
                  <img src={art.visual.image} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                </span>
              </span>
              <span className="work-arrow label" aria-hidden="true">↗</span>
            </button>
          </li>
        ))}
      </ul>

      <Drawer open={!!article} onClose={() => setOpenId(null)} label={article ? `${article.category} · ${article.read}` : ""}>
        {article && (
          <article>
            <span className="label text-accent">{article.date}</span>
            <h3 className="h2 mt-4">{article.title}</h3>
            <p className="mt-6 border-l border-accent pl-5 text-[1.05rem] leading-relaxed">{article.premise}</p>

            <div className="mt-8 grid grid-cols-3 border-y border-line">
              {article.metrics.map((m, i) => (
                <div key={m.label} className={i ? "border-l border-line p-4" : "p-4"}>
                  <div className="num text-[clamp(1.2rem,3vw,2rem)] font-light tracking-[-0.03em]">{m.value}</div>
                  <div className="label mt-2 opacity-50">{m.label}</div>
                </div>
              ))}
            </div>

            <figure className="mt-10">
              <div className="flex items-baseline justify-between">
                <figcaption className="label text-accent">Project evidence</figcaption>
                <span className="label opacity-40">Select to open</span>
              </div>
              <a
                href={article.visual.image}
                target="_blank"
                rel="noreferrer"
                className="plate writing-evidence group mt-4 overflow-hidden px-4 py-4"
                aria-label={`Open screenshot: ${article.visual.caption}`}
              >
                <img src={article.visual.image} alt={article.visual.caption} loading="lazy" className="max-h-[32rem] w-full object-contain" />
              </a>
              <p className="label mt-3 flex items-center justify-between gap-4 opacity-50">
                <span>{article.visual.caption}</span>
                <a href={article.visual.image} target="_blank" rel="noreferrer" className="shrink-0 text-accent">Open ↗</a>
              </p>
            </figure>

            <div className="mt-12 space-y-9">
              {article.sections.map((s, i) => (
                <section key={s.title}>
                  <h4 className="flex gap-3 text-lg font-medium tracking-[-0.015em]">
                    <span className="label num mt-1.5 text-accent">0{i + 1}</span>{s.title}
                  </h4>
                  <p className="mt-3 pl-8 leading-relaxed text-muted">{s.body}</p>
                </section>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-6 border-t border-line pt-6">
              {article.sources.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="label u-link text-accent">{s.label} ↗</a>
              ))}
            </div>
          </article>
        )}
      </Drawer>
    </section>
  );
}