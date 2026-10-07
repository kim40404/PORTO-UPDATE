import { useState } from "react";
import Drawer from "./Drawer";
import SectionBar from "./SectionBar";
import { articles } from "../data/content";
import { assetMeta, srcSet, type AssetKey } from "../data/assets";

const keys = Object.keys(assetMeta) as AssetKey[];
/** manifest key for an image src, so the <img> reserves its box and carries a srcset */
const keyOf = (src: string) => keys.find((k) => assetMeta[k].src === src);

/** 44px tap box around an inline text control without changing the row height */
const tap = { display: "inline-block", padding: "13px 0", margin: "-13px 0", textAlign: "left" } as const;

/** APPLICATION NOTES: AN-1 to AN-5, each opening its full note in the detail sheet. */
export default function ApplicationNotes() {
  const [open, setOpen] = useState<number | null>(null);
  const a = open === null ? null : articles[open];
  const key = a ? keyOf(a.visual.image) : undefined;
  const meta = key ? assetMeta[key] : undefined;

  return (
    <section>
      <SectionBar id="notes" label="Application notes" aside="AN-1 to AN-5" />
      <table className="ds-table stack">
        <thead>
          <tr>
            <th scope="col">Note</th>
            <th scope="col">Title</th>
            <th scope="col">Summary</th>
            <th scope="col">Date</th>
            <th scope="col">Read</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((art, i) => (
            <tr key={art.id}>
              <td data-label="Note" className="num">
                AN-{i + 1}
              </td>
              <td data-label="Title" className="span">
                <button type="button" className="link" style={tap} onClick={() => setOpen(i)}>
                  {art.title}
                </button>
              </td>
              <td data-label="Summary" className="span">
                {art.description}
              </td>
              <td data-label="Date">{art.date}</td>
              <td data-label="Read">{art.read}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Drawer open={a !== null} onClose={() => setOpen(null)} label={`Application note AN-${open === null ? 0 : open + 1}`}>
        {a && (
          <article style={{ display: "grid", gap: 24 }}>
            <div>
              <h3 className="h">{a.title}</h3>
              <p className="small" style={{ marginTop: 8 }}>
                {a.date}, {a.read} read. {a.category}.
              </p>
            </div>
            <p className="lead">{a.premise}</p>
            {a.metrics.length > 0 && (
              <table className="ds-table" style={{ maxWidth: "32rem" }}>
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {a.metrics.map((m) => (
                    <tr key={m.label}>
                      <td data-label="Metric">{m.label}</td>
                      <td data-label="Value" className="typ">
                        {m.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <figure>
              <img
                className="shot"
                src={a.visual.image}
                alt={a.visual.caption}
                loading="lazy"
                decoding="async"
                width={meta?.width}
                height={meta?.height}
                srcSet={key && srcSet(key)}
                sizes="(min-width: 56rem) 50rem, 100vw"
              />
              <figcaption className="small" style={{ marginTop: 6 }}>
                {a.visual.caption}
              </figcaption>
            </figure>
            {a.sections.map((s) => (
              <section key={s.title}>
                <h4 style={{ fontWeight: 600 }}>{s.title}</h4>
                <p className="measure">{s.body}</p>
              </section>
            ))}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {a.sources.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="plate-btn">
                  {s.label}
                </a>
              ))}
            </div>
          </article>
        )}
      </Drawer>
    </section>
  );
}
