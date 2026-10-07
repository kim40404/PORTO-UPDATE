import { useEffect, useState } from "react";
import SectionBar from "./SectionBar";
import { characteristics, notes } from "../data/content";
import { finePointer } from "../lib/motion";

/* ------------------------------------------------------------------ */
/*  Row <-> curve link: one window event, one state map in each party  */
/* ------------------------------------------------------------------ */

export interface LinkDetail {
  /** project id (Project.id / Characteristic.project) */
  project: string;
  on: boolean;
}

declare global {
  interface WindowEventMap {
    "ds:link": CustomEvent<LinkDetail>;
  }
}

/** Light (or unlight) every row and frame that belongs to `project`. */
export function link(project: string, on: boolean) {
  window.dispatchEvent(new CustomEvent<LinkDetail>("ds:link", { detail: { project, on } }));
}

/** Map of project id -> linked, kept in sync with `ds:link` events. */
export function useLinked(): Record<string, boolean> {
  const [linked, setLinked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const onLink = (e: CustomEvent<LinkDetail>) => {
      const { project, on } = e.detail;
      setLinked((m) => ((m[project] ?? false) === on ? m : { ...m, [project]: on }));
    };
    window.addEventListener("ds:link", onLink);
    return () => window.removeEventListener("ds:link", onLink);
  }, []);
  return linked;
}

/** keyboard focus only: a tap or mouse click on a button never matches :focus-visible */
const keyboardFocus = (e: React.FocusEvent<HTMLElement>) => e.currentTarget.matches(":focus-visible");

/* ------------------------------------------------------------------ */
/*  ELECTRICAL CHARACTERISTICS                                          */
/* ------------------------------------------------------------------ */

const cell = (v: string, typ = false) => (v === "-" ? "dash" : typ ? "typ r" : "r");

export default function Characteristics() {
  const linked = useLinked();

  return (
    <section>
      <SectionBar id="characteristics" label="Electrical characteristics" aside="TA = 2024 to 2026 unless noted" />
      <table className="ds-table stack stack-num">
        <caption>Values measured on each project's own data; "-" means not measured or not stated.</caption>
        <thead>
          <tr>
            <th scope="col">Parameter</th>
            <th scope="col">Test conditions</th>
            <th scope="col" className="r">
              Min
            </th>
            <th scope="col" className="r">
              Typ
            </th>
            <th scope="col" className="r">
              Max
            </th>
            <th scope="col">Unit</th>
          </tr>
        </thead>
        <tbody>
          {characteristics.map((c, i) => {
            const id = c.project;
            const on = !!id && !!linked[id];
            return (
              <tr
                key={i}
                data-figure={id}
                className={on ? "is-linked" : undefined}
                onPointerEnter={id ? () => finePointer() && link(id, true) : undefined}
                onPointerLeave={id ? () => finePointer() && link(id, false) : undefined}
              >
                <td data-label="Parameter" className="span">
                  {id ? (
                    <button
                      type="button"
                      className="-my-2 inline-block min-h-11 py-2 text-left font-semibold"
                      onClick={() => !finePointer() && link(id, !on)}
                      onFocus={(e) => keyboardFocus(e) && link(id, true)}
                      onBlur={() => link(id, false)}
                    >
                      {c.parameter}
                    </button>
                  ) : (
                    <span className="font-semibold">{c.parameter}</span>
                  )}
                  {c.note && (
                    <sup>
                      <a className="note-ref" href={`#note-${c.note}`} aria-label={`Note ${c.note}`}>
                        ({c.note})
                      </a>
                    </sup>
                  )}
                </td>
                <td data-label="Test conditions" className="span">
                  {c.conditions}
                </td>
                <td data-label="Min" className={cell(c.min)}>
                  {c.min}
                </td>
                <td data-label="Typ" className={cell(c.typ, true)}>
                  {c.typ}
                </td>
                <td data-label="Max" className={cell(c.max)}>
                  {c.max}
                </td>
                <td data-label="Unit" className={c.unit === "-" ? "unit dash" : "unit"}>
                  {c.unit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ol className="note-list" aria-label="Notes">
        {notes.map((n) => (
          <li key={n.n} id={`note-${n.n}`}>
            <span className="n">({n.n})</span>
            <span>{n.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
