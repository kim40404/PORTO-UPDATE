import { useState } from "react";
import SectionBar from "./SectionBar";
import Frame from "./Frame";
import FigurePlate from "./FigurePlate";
import Drawer from "./Drawer";
import { link, useLinked } from "./Characteristics";
import { projects, type Project } from "../data/content";
import { assetMeta, assets, srcSet, type AssetKey } from "../data/assets";
import { finePointer } from "../lib/motion";

const FIRST = 2; // Figure 1 is the typical application; the curves run 2 to 11
const LETTERS = "abcdefghij";

/** asset path -> manifest key, so a Shot's src resolves to its width/height and srcset */
const keyBySrc = Object.fromEntries((Object.keys(assetMeta) as AssetKey[]).map((k) => [assets[k], k])) as Record<string, AssetKey | undefined>;

const keyboardFocus = (e: React.FocusEvent<HTMLElement>) => e.currentTarget.matches(":focus-visible");

/* ------------------------------------------------------------------ */
/*  Detail sheet: everything the project has, nothing hidden            */
/* ------------------------------------------------------------------ */

function DetailSheet({ p, n, onMove }: { p: Project; n: number; onMove: (d: 1 | -1, e: React.MouseEvent<HTMLElement>) => void }) {
  return (
    <article>
      <h3 className="h">{p.title}</h3>
      <p className="small mt-1">
        {p.subtitle}. {p.year}, {p.group}, {p.category}
      </p>
      <p className="measure mt-5">{p.summary}</p>
      <p className="measure mt-3 text-ink-2">{p.detail}</p>

      <table className="ds-table mt-6">
        <caption>Facts from the README</caption>
        <tbody>
          {p.facts.map((f) => (
            <tr key={f.k}>
              <th scope="row">{f.k}</th>
              <td data-label={f.k}>{f.v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="small mt-8 mb-2 font-semibold">
        {p.figures.length > 1 ? `Figures ${n}.a to ${n}.${LETTERS[p.figures.length - 1]}` : `Figure ${n}.a`}
      </h4>
      <div className={`grid gap-6${p.figures.length > 1 ? " sm:grid-cols-2" : ""}`}>
        {p.figures.map((f, i) => (
          <Frame key={`${f.kind}-${i}`} n={`${n}.${LETTERS[i]}`} title={f.caption} aside={p.year} illustrative={f.illustrative} className="min-w-0">
            <FigurePlate kind={f.kind} label={f.caption} active />
          </Frame>
        ))}
      </div>

      {p.shots && p.shots.length > 0 && (
        <>
          <h4 className="small mt-8 mb-2 font-semibold">Screenshots from the repository</h4>
          <div className="grid gap-6">
            {p.shots.map((s) => {
              const key = keyBySrc[s.src];
              const m = key && assetMeta[key];
              return (
                <figure key={s.src}>
                  <img
                    className="shot"
                    src={s.src}
                    alt={s.caption}
                    loading="lazy"
                    decoding="async"
                    width={m ? m.width : undefined}
                    height={m ? m.height : undefined}
                    srcSet={key ? srcSet(key) : undefined}
                    sizes="(min-width:1024px) 56rem, 100vw"
                  />
                  <figcaption className="small mt-2">{s.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        </>
      )}

      <p className="measure mt-8">
        <b>Stack:</b> {p.stack.join(", ")}
      </p>

      {(p.href || p.demo) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {p.href && (
            <a href={p.href} target="_blank" rel="noreferrer" className="plate-btn">
              {p.linkLabel ?? "Repository"}
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" className="plate-btn">
              {p.demoLabel ?? "Demo"}
            </a>
          )}
        </div>
      )}

      {p.note && <p className="note-text measure mt-6">{p.note}</p>}

      <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-ink pt-4">
        <button type="button" className="plate-btn ghost" onClick={(e) => onMove(-1, e)}>
          Previous figure
        </button>
        <button type="button" className="plate-btn ghost" onClick={(e) => onMove(1, e)}>
          Next figure
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  CHARACTERISTIC CURVES: Figures 2 to 11                              */
/* ------------------------------------------------------------------ */

export default function Curves() {
  const [openId, setOpenId] = useState<string | null>(null);
  const linked = useLinked();

  const openIdx = projects.findIndex((p) => p.id === openId);
  const open = openIdx >= 0 ? projects[openIdx] : null;

  const move = (d: 1 | -1, e: React.MouseEvent<HTMLElement>) => {
    setOpenId(projects[(openIdx + d + projects.length) % projects.length].id);
    e.currentTarget.closest(".drawer")?.scrollTo({ top: 0 });
  };

  return (
    <section>
      <SectionBar id="curves" label="Characteristic curves" aside={`Figures ${FIRST} to ${FIRST + projects.length - 1}`} />
      <p className="small mb-5">Open a figure for its detail sheet: all figures, screenshots, facts and the repository.</p>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => {
          const n = FIRST + i;
          const fig = p.figures[0];
          return (
            <button
              key={p.id}
              type="button"
              className="frame-open min-w-0"
              onClick={() => setOpenId(p.id)}
              onPointerEnter={() => finePointer() && link(p.id, true)}
              onPointerLeave={() => finePointer() && link(p.id, false)}
              onFocus={(e) => keyboardFocus(e) && link(p.id, true)}
              onBlur={() => link(p.id, false)}
            >
              <Frame
                n={String(n)}
                title={p.title}
                aside={p.year}
                conditions={p.conditions}
                illustrative={fig?.illustrative}
                figureId={p.id}
                className={`lazy${linked[p.id] ? " is-linked" : ""}`}
              >
                <FigurePlate kind={fig.kind} label={fig.caption} />
              </Frame>
              <span className="visually-hidden">, open detail sheet</span>
            </button>
          );
        })}
      </div>

      <Drawer open={!!open} onClose={() => setOpenId(null)} label={open ? `Figure ${openIdx + FIRST} detail sheet` : ""}>
        {open && <DetailSheet p={open} n={openIdx + FIRST} onMove={move} />}
      </Drawer>
    </section>
  );
}
