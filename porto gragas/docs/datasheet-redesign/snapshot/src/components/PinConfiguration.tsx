import { Fragment, useState } from "react";
import SectionBar from "./SectionBar";
import { pins, projects, type Pin, type PinGroup } from "../data/content";
import { finePointer } from "../lib/motion";

/* Package drawing geometry (viewBox 360 x 420, renders 1:1 at a 358px phone width). */
const BODY = { x: 132, w: 96, y: 34, h: 366 };
const PITCH = 44;
const Y0 = 58;
const LEG = 14;
const yAt = (i: number) => Y0 + i * PITCH;

type Slot = { n: number; name: string; group?: PinGroup };
const NC: Slot = { n: pins.length + 1, name: "NC" };
/** pins 1..8 down the left edge, 9..15 up the right edge; NC keeps the sides symmetric */
const left: Slot[] = pins.slice(0, 8);
const right: Slot[] = [NC, ...pins.slice(8).reverse()];

/** consecutive runs of one group per side, top to bottom, for the brackets */
function runs(side: Slot[]) {
  const out: { group: PinGroup; from: number; to: number }[] = [];
  side.forEach((s, i) => {
    if (!s.group) return;
    const last = out[out.length - 1];
    if (last && last.group === s.group) last.to = yAt(i);
    else out.push({ group: s.group, from: yAt(i), to: yAt(i) });
  });
  return out;
}

const groups: PinGroup[] = ["RETRIEVE", "EVALUATE", "SHIP"];
const titleOf = Object.fromEntries(projects.map((p) => [p.id, p.title]));
const usedIn = (p: Pin) => p.projects.map((id) => titleOf[id] ?? id).join(", ");

export default function PinConfiguration() {
  const [active, setActive] = useState<number | null>(null);
  const hover = (n: number | null) => finePointer() && setActive(n);

  const side = (slots: Slot[], dir: -1 | 1) => {
    const edge = dir < 0 ? BODY.x : BODY.x + BODY.w; // body edge the legs leave from
    const bracketX = dir < 0 ? 24 : 336;
    return (
      <>
        {slots.map((s, i) => {
          const y = yAt(i);
          const on = active === s.n;
          return (
            <g
              key={s.n}
              data-pin={s.n}
              style={on ? { color: "var(--band)" } : undefined}
              onMouseEnter={s.group ? () => hover(s.n) : undefined}
              onMouseLeave={s.group ? () => hover(null) : undefined}
            >
              <rect
                x={dir < 0 ? edge - LEG : edge}
                y={y - 4}
                width={LEG}
                height={8}
                fill={on ? "currentColor" : "var(--paper)"}
                stroke="currentColor"
                strokeWidth={1.25}
              />
              <text className="num" x={edge - dir * 6} y={y + 4} fontSize={11} textAnchor={dir < 0 ? "start" : "end"} fill="currentColor">
                {s.n}
              </text>
              <text
                x={edge + dir * (LEG + 6)}
                y={y + 4}
                fontSize={11}
                fontWeight={on ? 700 : 400}
                textAnchor={dir < 0 ? "end" : "start"}
                fill="currentColor"
              >
                {s.name}
              </text>
            </g>
          );
        })}
        {runs(slots).map((r) => {
          const mid = (r.from + r.to) / 2;
          const lx = bracketX + dir * 10;
          return (
            <g key={r.group}>
              <path
                d={`M${bracketX - dir * 5} ${r.from - 16} H${bracketX} V${r.to + 16} H${bracketX - dir * 5}`}
                fill="none"
                stroke="var(--band)"
                strokeWidth={1.25}
              />
              <text
                x={lx}
                y={mid}
                fontSize={10}
                fontWeight={700}
                letterSpacing="0.06em"
                fill="var(--band)"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${dir * 90} ${lx} ${mid})`}
              >
                {r.group}
              </text>
            </g>
          );
        })}
      </>
    );
  };

  return (
    <section>
      <SectionBar id="pins" label="Pin configuration" aside={`${pins.length} pins, ${groups.length} functions`} />
      <div className="pins-grid">
        <svg
          viewBox="0 0 360 420"
          role="img"
          aria-label={`Package drawing: ${pins.length + 1} pins, 1 to 8 down the left edge, 9 to ${pins.length + 1} up the right edge, grouped ${groups.join(", ").toLowerCase()}. Pin functions are listed in the table.`}
          style={{ width: "100%", maxWidth: 440, height: "auto" }}
          strokeLinecap="square"
        >
          {/* body with the orientation notch at the top */}
          <path
            d={`M${BODY.x} ${BODY.y} H171 A9 9 0 0 0 189 ${BODY.y} H${BODY.x + BODY.w} V${BODY.y + BODY.h} H${BODY.x} Z`}
            fill="var(--paper)"
            stroke="currentColor"
            strokeWidth={1.25}
          />
          <text
            x={BODY.x + BODY.w / 2}
            y={BODY.y + BODY.h / 2}
            fontSize={10}
            fontWeight={700}
            letterSpacing="0.08em"
            fill="var(--ink-2)"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90 ${BODY.x + BODY.w / 2} ${BODY.y + BODY.h / 2})`}
          >
            KIMSANG SILALAHI
          </text>
          {side(left, -1)}
          {side(right, 1)}
        </svg>

        <table className="ds-table stack">
          <caption>Pin functions</caption>
          <thead>
            <tr>
              <th scope="col">Pin</th>
              <th scope="col">Name</th>
              <th scope="col">Function</th>
              <th scope="col">Used in</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g}>
                <tr>
                  <th scope="colgroup" colSpan={4} style={{ gridColumn: "1 / -1" }}>
                    {g}
                  </th>
                </tr>
                {pins
                  .filter((p) => p.group === g)
                  .map((p) => {
                    const used = usedIn(p);
                    return (
                      <tr
                        key={p.n}
                        data-pin={p.n}
                        tabIndex={0}
                        className={active === p.n ? "is-linked" : undefined}
                        onMouseEnter={() => hover(p.n)}
                        onMouseLeave={() => hover(null)}
                        onFocus={() => setActive(p.n)}
                        onBlur={() => setActive(null)}
                      >
                        <td data-label="Pin">
                          <span className="pin-n">{p.n}</span>
                        </td>
                        <td data-label="Name">{p.name}</td>
                        <td data-label="Function" className="span">
                          {p.fn}
                        </td>
                        <td data-label="Used in" className={used ? "span" : "span dash"}>
                          {used || "-"}
                        </td>
                      </tr>
                    );
                  })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
