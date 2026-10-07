import FigurePlate from "./FigurePlate";
import { useReveal } from "../hooks/useReveal";
import { method } from "../data/content";

export default function Capabilities() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="method" ref={ref} className="relative" style={{ padding: "var(--section) var(--gutter)" }} data-bg="dark">
      <header className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <div className="label flex items-center gap-3" data-reveal>
            <span className="opacity-50">03</span>
            <span>Method</span>
          </div>
          <h2 className="h1 mt-6" data-mask>
            <span className="mask">
              <span className="line">Retrieve. Evaluate.</span>
            </span>
            <span className="mask">
              <span className="line serif">Ship.</span>
            </span>
          </h2>
        </div>
        <p className="text-muted md:col-span-4 md:col-start-9" data-reveal="0.1">
          One person from retrieval design to the dashboard that keeps it honest.
        </p>
      </header>

      <ol className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-3">
        {method.map((m, i) => (
          <li key={m.title} data-reveal={String(i * 0.08)}>
            <FigurePlate kind={m.figure} fig={`3.${i + 1}`} meta={m.index} className="aspect-[4/5]" />
            <div className="mt-6 flex items-baseline justify-between">
              <h3 className="h3">{m.title}</h3>
              <span className="label num opacity-40">{m.index}</span>
            </div>
            <p className="mt-3 max-w-[34ch] text-muted">{m.blurb}</p>
            <p className="label mt-5 leading-[1.9] opacity-60">{m.tools.join("  ·  ")}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
