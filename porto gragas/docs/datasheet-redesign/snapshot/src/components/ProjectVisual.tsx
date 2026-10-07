import type { VisualKind } from "../data/content";

/* deterministic PRNG so every render is identical */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(rng: () => number) {
  const u = Math.max(rng(), 1e-6);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const MONO: React.CSSProperties = {
  fontFamily: "var(--ff-mono)",
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fill: "currentColor",
};
const FAINT: React.CSSProperties = { ...MONO, fillOpacity: 0.65 };
const ACC: React.CSSProperties = { ...MONO, fill: "var(--accent)" };
/* small mixed-case annotations: 11.5 in the 400-wide viewBox is still >= 10px at a 358px frame */
const SMALL: React.CSSProperties = { ...FAINT, fontSize: 11.5, letterSpacing: "0.02em", textTransform: "none" };

const W = 400;
const H = 500;

/* shared plot frame: L-axes + labels */
function Axes({ x = "", y = "", top = 60, bottom = 420 }: { x?: string; y?: string; top?: number; bottom?: number }) {
  return (
    <>
      <line x1={30} y1={bottom} x2={370} y2={bottom} stroke="currentColor" strokeOpacity={0.6} />
      <line x1={30} y1={top} x2={30} y2={bottom} stroke="currentColor" strokeOpacity={0.6} />
      {x && (
        <text x={370} y={bottom + 34} textAnchor="end" style={FAINT}>
          {x}
        </text>
      )}
      {y && (
        <text x={30} y={top - 10} style={FAINT}>
          {y.replace(/\s*→\s*$/, " ↑")}
        </text>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

function Auditor() {
  const score = 82;
  const rows = [
    { name: "ChatGPT", v: 0.86 },
    { name: "Perplexity", v: 0.74 },
    { name: "AI Overviews", v: 0.61 },
  ];
  const sx = (v: number) => 30 + (v / 100) * 340;
  return (
    <>
      <text x={30} y={66} style={MONO}>
        Blended GEO score
      </text>
      <text x={370} y={66} textAnchor="end" style={FAINT}>
        illustrative
      </text>
      <line x1={30} y1={150} x2={370} y2={150} stroke="currentColor" strokeOpacity={0.6} />
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={sx(v)} y1={150} x2={sx(v)} y2={158} stroke="currentColor" strokeOpacity={0.6} />
          <text x={sx(v)} y={174} textAnchor="middle" style={SMALL}>
            {v}
          </text>
        </g>
      ))}
      <line className="draw" x1={30} y1={150} x2={sx(score)} y2={150} stroke="var(--accent)" strokeWidth={3} pathLength={1} />
      <line x1={sx(score)} y1={112} x2={sx(score)} y2={158} stroke="var(--accent)" strokeWidth={1.5} />
      <text x={sx(score)} y={106} textAnchor="middle" style={{ ...MONO, fontSize: 30, letterSpacing: "-0.03em" }}>
        {score}
      </text>
      <text x={30} y={226} style={FAINT}>
        citation likelihood per engine, 0 to 100
      </text>
      {rows.map((row, i) => {
        const y = 262 + i * 54;
        return (
          <g key={row.name}>
            <text x={30} y={y} style={MONO}>
              {row.name}
            </text>
            <text x={370} y={y} textAnchor="end" style={FAINT}>
              {Math.round(row.v * 100)}
            </text>
            <line x1={30} y1={y + 12} x2={370} y2={y + 12} stroke="currentColor" strokeOpacity={0.28} />
            <line className="draw" x1={30} y1={y + 12} x2={30 + 340 * row.v} y2={y + 12} stroke="currentColor" strokeWidth={2} pathLength={1} />
          </g>
        );
      })}
      <text x={30} y={446} style={FAINT}>
        Llama 3.1 local via Ollama, FastAPI backend
      </text>
    </>
  );
}

function Dataset() {
  const rng = mulberry32(1182);
  const cols = 18,
    rows = 20,
    pitch = 18,
    size = 12;
  const x0 = (W - cols * pitch) / 2 + 3;
  const y0 = 60;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = rng();
      const x = x0 + c * pitch,
        y = y0 + r * pitch;
      const op = v < 0.5 ? 0.14 : v < 0.84 ? 0.35 + rng() * 0.55 : 0;
      cells.push(
        v >= 0.84 ? (
          <rect key={`${r}-${c}`} x={x} y={y} width={size} height={size} fill="var(--accent)" fillOpacity={0.7 + rng() * 0.3} />
        ) : (
          <rect key={`${r}-${c}`} x={x} y={y} width={size} height={size} fill="currentColor" fillOpacity={op} />
        ),
      );
    }
  }
  return (
    <>
      {cells}
      <text x={x0} y={y0 + rows * pitch + 26} style={MONO}>
        Accepted · filtered
      </text>
      <text x={W - x0} y={y0 + rows * pitch + 26} textAnchor="end" style={FAINT}>
        0 API calls
      </text>
    </>
  );
}

function Embedding() {
  const rng = mulberry32(77);
  const topics = [
    { x: 120, y: 150, label: "Plan" },
    { x: 285, y: 135, label: "Tool call", accent: true },
    { x: 140, y: 320, label: "Reflect" },
    { x: 290, y: 315, label: "Retrieve" },
  ];
  return (
    <>
      <Axes x="dim 1 →" y="dim 2 →" top={60} bottom={410} />
      {topics.map((t, ti) => {
        const pairs = Array.from({ length: 13 }).map(() => {
          const ix = t.x + gauss(rng) * 24;
          const iy = t.y + gauss(rng) * 22;
          const ex = ix + (rng() - 0.5) * 22;
          const ey = iy + (rng() - 0.5) * 22;
          return { ix, iy, ex, ey };
        });
        return (
          <g key={ti}>
            <circle cx={t.x} cy={t.y} r={50} fill="none" stroke="var(--limit)" strokeDasharray="2 6" />
            {pairs.map((p, i) => (
              <g key={i}>
                <line x1={p.ix} y1={p.iy} x2={p.ex} y2={p.ey} stroke="currentColor" strokeOpacity={0.45} strokeWidth={0.8} />
                <circle cx={p.ix} cy={p.iy} r={2.5} fill={t.accent ? "var(--accent)" : "currentColor"} fillOpacity={0.9} />
                <circle cx={p.ex} cy={p.ey} r={2.6} fill="none" stroke={t.accent ? "var(--accent)" : "currentColor"} strokeOpacity={0.8} />
              </g>
            ))}
            <text x={t.x} y={t.y - 60} textAnchor="middle" style={t.accent ? ACC : MONO}>
              {t.label}
            </text>
          </g>
        );
      })}
      <circle cx={36} cy={462} r={2.5} fill="currentColor" />
      <text x={46} y={466} style={MONO}>
        ID
      </text>
      <circle cx={84} cy={462} r={2.6} fill="none" stroke="currentColor" />
      <text x={94} y={466} style={MONO}>
        EN
      </text>
      <text x={370} y={466} textAnchor="end" style={FAINT}>
        944 rows
      </text>
    </>
  );
}

function Mlops() {
  const rng = mulberry32(7);
  const n = 44;
  const x0 = 30,
    x1 = 370,
    yTop = 80,
    yBot = 290;
  const yFor = (v: number) => yBot - (v - 0.6) * ((yBot - yTop) / 0.4);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    let v = 0.86 + (rng() - 0.5) * 0.04;
    if (i >= 26 && i <= 32) v -= Math.sin(((i - 26) / 6) * Math.PI) * 0.15;
    pts.push([x0 + (i / (n - 1)) * (x1 - x0), yFor(v)]);
  }
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${d} L${x1} ${yBot} L${x0} ${yBot} Z`;
  const dip = pts[29];
  const panels = [
    { k: "p95", v: "42 ms" },
    { k: "req/min", v: "1.2k" },
    { k: "model", v: "v1.4" },
  ];
  return (
    <>
      {[0.6, 0.7, 0.8, 0.9, 1].map((v) => (
        <g key={v}>
          <line x1={x0} y1={yFor(v)} x2={x1} y2={yFor(v)} stroke="currentColor" strokeOpacity={0.12} />
          <text x={x1} y={yFor(v) - 4} textAnchor="end" style={SMALL}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <line x1={x0} y1={yFor(0.8)} x2={x1} y2={yFor(0.8)} stroke="var(--accent)" strokeOpacity={0.7} strokeDasharray="3 5" />
      <path d={area} fill="currentColor" fillOpacity={0.07} />
      <path className="draw" d={d} fill="none" stroke="currentColor" strokeWidth={1.5} pathLength={1} strokeLinejoin="round" />
      <circle cx={dip[0]} cy={dip[1]} r={5} fill="var(--accent)" />
      <circle cx={dip[0]} cy={dip[1]} r={12} fill="none" stroke="var(--accent)" strokeOpacity={0.6} />
      <text x={dip[0] - 14} y={dip[1] + 28} textAnchor="end" style={ACC}>
        drift → alert
      </text>
      <text x={x0} y={yTop - 22} style={MONO}>
        Precision · 30 days
      </text>
      {panels.map((p, i) => {
        const pw = (x1 - x0 - 16) / 3;
        const px = x0 + i * (pw + 8);
        return (
          <g key={p.k}>
            <rect x={px} y={340} width={pw} height={100} fill="none" stroke="currentColor" strokeOpacity={0.45} />
            <text x={px + 12} y={364} style={FAINT}>
              {p.k}
            </text>
            <text x={px + 12} y={416} style={{ ...MONO, fontSize: 16, letterSpacing: "-0.02em", textTransform: "none" }}>
              {p.v}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Histogram() {
  const bins = 20;
  const base = 390;
  const counts = Array.from({ length: bins }).map((_, i) => {
    const s = i * 5 + 2.5;
    return Math.exp(-((s - 64) ** 2) / (2 * 13 ** 2));
  });
  const bw = 340 / bins;
  let acc = 0;
  const total = counts.reduce((a, b) => a + b, 0);
  const cdf = counts.map((c, i) => {
    acc += c;
    return [30 + (i + 1) * bw, base - (acc / total) * 280] as const;
  });
  const cdfPath = `M30 ${base} ` + cdf.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const tx = 30 + (70 / 100) * 340;
  return (
    <>
      <Axes x="score →" y="candidates →" top={70} bottom={base} />
      {counts.map((c, i) => {
        const h = c * 250;
        const pass = i * 5 >= 70;
        return (
          <rect
            key={i}
            x={30 + i * bw + 2}
            y={base - h}
            width={bw - 4}
            height={h}
            fill={pass ? "var(--accent)" : "currentColor"}
            fillOpacity={pass ? 0.95 : 0.5}
          />
        );
      })}
      <path className="draw" d={cdfPath} fill="none" stroke="currentColor" strokeWidth={1.2} pathLength={1} />
      <line x1={tx} y1={80} x2={tx} y2={base} stroke="var(--accent)" strokeDasharray="3 5" />
      <text x={tx + 6} y={104} style={ACC}>
        pass ≥ 70
      </text>
      {[0, 25, 50, 75, 100].map((v) => (
        <text key={v} x={30 + (v / 100) * 340} y={base + 18} textAnchor="middle" style={SMALL}>
          {v}
        </text>
      ))}
      <text x={30} y={466} style={MONO}>
        120+ candidates · 3 days
      </text>
      <text x={370} y={466} textAnchor="end" style={FAINT}>
        μ 64
      </text>
    </>
  );
}

function Growth() {
  const n = 84;
  const pts: [number, number][] = [];
  const events: [number, number][] = [];
  let m = 0.72;
  const yFor = (v: number) => 360 - v * 280;
  for (let i = 0; i < n; i++) {
    m -= 0.012 + (Math.sin(i * 0.5) + 1) * 0.004;
    const x = 30 + (i / (n - 1)) * 340;
    if (m < 0.35) {
      events.push([x, yFor(0.35)]);
      m = 0.8;
    }
    pts.push([x, yFor(m)]);
  }
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const temp = pts
    .map(([x], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${(yFor(0.55 + Math.sin(i * 0.3) * 0.08)).toFixed(1)}`)
    .join(" ");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <>
      <Axes y="moisture →" top={70} bottom={380} />
      <line x1={30} y1={yFor(0.35)} x2={370} y2={yFor(0.35)} stroke="var(--accent)" strokeDasharray="3 5" />
      <text x={370} y={yFor(0.35) + 16} textAnchor="end" style={ACC}>
        irrigate &lt; 35%
      </text>
      <path d={temp} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeDasharray="1 4" />
      <path className="draw" d={d} fill="none" stroke="currentColor" strokeWidth={1.5} pathLength={1} />
      {events.map(([x, y], i) => (
        <path key={i} d={`M${x} ${y + 4} l5 9 h-10 z`} fill="var(--accent)" />
      ))}
      {days.map((dname, i) => (
        <text key={dname} x={30 + (i + 0.5) * (340 / 7)} y={400} textAnchor="middle" style={SMALL}>
          {dname}
        </text>
      ))}
      <text x={30} y={466} style={MONO}>
        Soil moisture · 7 days
      </text>
      <text x={370} y={466} textAnchor="end" style={FAINT}>
        {events.length} events
      </text>
    </>
  );
}

function Clusters() {
  const rng = mulberry32(42);
  const groups = [
    { cx: 125, cy: 170, r: 52, n: 34, fill: "currentColor", op: 0.85 },
    { cx: 275, cy: 140, r: 44, n: 28, fill: "currentColor", op: 0.55 },
    { cx: 215, cy: 325, r: 60, n: 38, fill: "var(--accent)", op: 0.9 },
  ];
  return (
    <>
      <Axes x="KDA →" y="Win rate →" />
      {groups.map((g, gi) => (
        <g key={gi}>
          <ellipse cx={g.cx} cy={g.cy} rx={g.r + 14} ry={(g.r + 14) * 0.85} fill="none" stroke="var(--limit)" strokeDasharray="2 6" />
          {Array.from({ length: g.n }).map((_, i) => {
            const a = rng() * Math.PI * 2;
            const rr = Math.sqrt(rng()) * g.r;
            return <circle key={i} cx={g.cx + Math.cos(a) * rr} cy={g.cy + Math.sin(a) * rr * 0.85} r={2.6} fill={g.fill} fillOpacity={g.op} />;
          })}
          <line x1={g.cx - 7} y1={g.cy} x2={g.cx + 7} y2={g.cy} stroke="currentColor" strokeWidth={1.2} />
          <line x1={g.cx} y1={g.cy - 7} x2={g.cx} y2={g.cy + 7} stroke="currentColor" strokeWidth={1.2} />
          <text x={g.cx + 10} y={g.cy - 10} style={FAINT}>
            C{gi + 1}
          </text>
        </g>
      ))}
      <text x={30} y={470} style={MONO}>
        k = 3 · K-Means vs DBSCAN
      </text>
    </>
  );
}

function Dendrogram() {
  const leaves = 12;
  const lx = (i: number) => 46 + i * (308 / (leaves - 1));
  const base = 390;
  type N = { x: number; h: number };
  const leaf = (i: number): N => ({ x: lx(i), h: base });
  const lines: React.ReactNode[] = [];
  let k = 0;
  const merge = (a: N, b: N, h: number, color = "currentColor", op = 0.7): N => {
    lines.push(
      <path
        key={k++}
        d={`M${a.x} ${a.h} V${h} H${b.x} V${b.h}`}
        fill="none"
        stroke={color}
        strokeOpacity={op}
        strokeWidth={1.2}
      />,
    );
    return { x: (a.x + b.x) / 2, h };
  };
  const A = "var(--accent)";
  const a1 = merge(leaf(0), leaf(1), 360, A, 1);
  const a2 = merge(leaf(2), leaf(3), 350, A, 1);
  const a = merge(a1, a2, 300, A, 1);
  const b1 = merge(leaf(4), leaf(5), 365);
  const b2 = merge(leaf(6), leaf(7), 340);
  const b = merge(b1, b2, 285);
  const c1 = merge(leaf(8), leaf(9), 355, "currentColor", 0.5);
  const c2 = merge(leaf(10), leaf(11), 330, "currentColor", 0.5);
  const c = merge(c1, c2, 270, "currentColor", 0.5);
  const ab = merge(a, b, 170, "currentColor", 0.6);
  merge(ab, c, 100, "currentColor", 0.6);
  return (
    <>
      <line x1={30} y1={80} x2={30} y2={base} stroke="currentColor" strokeOpacity={0.6} />
      {[100, 170, 240, 310, 380].map((y, i) => (
        <text key={y} x={24} y={y + 3} textAnchor="end" style={SMALL}>
          {(4 - i).toFixed(0)}
        </text>
      ))}
      {lines}
      <line x1={30} y1={230} x2={370} y2={230} stroke="var(--accent)" strokeDasharray="3 5" />
      <text x={370} y={222} textAnchor="end" style={ACC}>
        cut → k = 3
      </text>
      {Array.from({ length: leaves }).map((_, i) => (
        <g key={i}>
          <circle cx={lx(i)} cy={base + 2} r={3} fill={i < 4 ? "var(--accent)" : "currentColor"} fillOpacity={i < 8 ? 1 : 0.6} />
          <text x={lx(i)} y={base + 22} textAnchor="middle" style={SMALL}>
            P{String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
      <text x={30} y={466} style={MONO}>
        Ward linkage · 12 players
      </text>
    </>
  );
}

function Radar() {
  const cx = 200,
    cy = 225,
    R = 130;
  const axes = ["KDA", "GPM", "Win %", "Damage", "Vision", "Teamfight"];
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
  const poly = (vals: number[]) =>
    vals.map((v, i) => `${(cx + Math.cos(ang(i)) * R * v).toFixed(1)},${(cy + Math.sin(ang(i)) * R * v).toFixed(1)}`).join(" ");
  const A = [0.82, 0.58, 0.7, 0.88, 0.32, 0.6];
  const B = [0.42, 0.8, 0.55, 0.38, 0.9, 0.78];
  return (
    <>
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon key={s} points={poly(axes.map(() => s))} fill="none" stroke="currentColor" strokeOpacity={s === 1 ? 0.5 : 0.2} strokeDasharray={s === 1 ? undefined : "2 4"} />
      ))}
      {axes.map((a, i) => (
        <g key={a}>
          <line x1={cx} y1={cy} x2={cx + Math.cos(ang(i)) * R} y2={cy + Math.sin(ang(i)) * R} stroke="currentColor" strokeOpacity={0.25} />
          <text
            x={cx + Math.cos(ang(i)) * (R + 22)}
            y={cy + Math.sin(ang(i)) * (R + 22) + 3}
            textAnchor={Math.abs(Math.cos(ang(i))) < 0.2 ? "middle" : Math.cos(ang(i)) > 0 ? "start" : "end"}
            style={FAINT}
          >
            {a}
          </text>
        </g>
      ))}
      <polygon points={poly(A)} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeWidth={1.4} />
      <polygon points={poly(B)} fill="var(--accent)" fillOpacity={0.14} stroke="var(--accent)" strokeWidth={1.4} />
      {B.map((v, i) => (
        <circle key={i} cx={cx + Math.cos(ang(i)) * R * v} cy={cy + Math.sin(ang(i)) * R * v} r={3} fill="var(--accent)" />
      ))}
      <rect x={30} y={440} width={10} height={10} fill="currentColor" fillOpacity={0.8} />
      <text x={48} y={449} style={MONO}>
        C1 Carry
      </text>
      <rect x={150} y={440} width={10} height={10} fill="var(--accent)" />
      <text x={168} y={449} style={MONO}>
        C3 Support
      </text>
    </>
  );
}

function Dream() {
  const rng = mulberry32(99);
  const cx = 200,
    cy = 235;
  const rings = Array.from({ length: 9 }).map((_, i) => 32 + i * 19);
  const nodes = Array.from({ length: 9 }).map((_, i) => {
    const a = rng() * Math.PI * 2;
    const r = rings[(i * 2 + 1) % rings.length];
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
  return (
    <>
      <g>
        {rings.map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.6 - i * 0.04}
            strokeDasharray={`${18 + i * 11} ${7 + i * 5}`}
            transform={`rotate(${i * 23} ${cx} ${cy})`}
          />
        ))}
      </g>
      {nodes.map((n, i) => {
        const m = nodes[(i + 1) % nodes.length];
        return <line key={i} x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke="currentColor" strokeOpacity={0.5} strokeWidth={0.8} />;
      })}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i % 3 === 0 ? 4 : 2.6} fill={i % 3 === 0 ? "var(--accent)" : "currentColor"} />
      ))}
      <text x={30} y={470} style={MONO}>
        Symbol graph
      </text>
      <text x={370} y={470} textAnchor="end" style={FAINT}>
        ICP
      </text>
    </>
  );
}

function Sensor() {
  const rng = mulberry32(2023);
  const R = 21;
  const hw = Math.sqrt(3) * R * 0.5;
  const hexes: React.ReactNode[] = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 8; c++) {
      const x = 48 + c * hw * 2 + (r % 2) * hw;
      const y = 78 + r * R * 1.5;
      if (x > W - 30) continue;
      const pts = Array.from({ length: 6 })
        .map((_, i) => {
          const a = Math.PI / 6 + (i * Math.PI) / 3;
          return `${(x + Math.cos(a) * (R - 1.5)).toFixed(1)},${(y + Math.sin(a) * (R - 1.5)).toFixed(1)}`;
        })
        .join(" ");
      const v = rng();
      if (v < 0.62) hexes.push(<polygon key={`${r}-${c}`} points={pts} fill="none" stroke="currentColor" strokeOpacity={0.45} />);
      else if (v < 0.9) hexes.push(<polygon key={`${r}-${c}`} points={pts} fill="currentColor" fillOpacity={0.3 + rng() * 0.55} />);
      else hexes.push(<polygon key={`${r}-${c}`} points={pts} fill="var(--accent)" fillOpacity={0.85} />);
    }
  }
  const wave: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const x = 30 + (i / 80) * 340;
    const y = 400 + Math.sin(i * 0.35) * 10 * Math.sin(i * 0.07) + (rng() - 0.5) * 4;
    wave.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return (
    <>
      {hexes}
      <path className="draw" d={wave.join(" ")} fill="none" stroke="currentColor" strokeWidth={1.2} pathLength={1} />
      <text x={30} y={460} style={MONO}>
        ESP32 · k-NN
      </text>
      <text x={370} y={460} textAnchor="end" style={ACC}>
        88.25%
      </text>
    </>
  );
}

function Rag() {
  const nodes = [
    { y: 70, label: "Query" },
    { y: 140, label: "Embed" },
    { y: 210, label: "Retrieve" },
    { y: 330, label: "Rerank" },
    { y: 400, label: "Generate" },
  ];
  const nx = 40,
    nw = 120,
    nh = 30;
  const docs = [0.91, 0.87, 0.82, 0.61, 0.54, 0.4];
  const dy = (i: number) => 160 + i * 30;
  return (
    <>
      {nodes.map((n, i) => (
        <g key={n.label}>
          <rect x={nx} y={n.y} width={nw} height={nh} fill="currentColor" fillOpacity={i === 4 ? 0 : 0.06} stroke={i === 4 ? "var(--accent)" : "currentColor"} strokeOpacity={i === 4 ? 1 : 0.6} />
          <text x={nx + 12} y={n.y + 19} style={i === 4 ? ACC : MONO}>
            {n.label}
          </text>
          {i < nodes.length - 1 && (
            <line x1={nx + nw / 2} y1={n.y + nh} x2={nx + nw / 2} y2={nodes[i + 1].y} stroke="currentColor" strokeOpacity={0.5} />
          )}
        </g>
      ))}
      {docs.map((s, i) => {
        const top = i < 3;
        return (
          <g key={i}>
            <path
              d={`M${nx + nw} ${225} C ${nx + nw + 40} ${225}, ${215} ${dy(i) + 10}, ${240} ${dy(i) + 10}`}
              fill="none"
              stroke={top ? "var(--accent)" : "currentColor"}
              strokeOpacity={top ? 0.8 : 0.35}
            />
            <rect x={240} y={dy(i)} width={130} height={20} fill="none" stroke="currentColor" strokeOpacity={0.45} />
            <rect x={240} y={dy(i)} width={130 * s} height={20} fill={top ? "var(--accent)" : "currentColor"} fillOpacity={top ? 1 : 0.3} />
            <text x={248} y={dy(i) + 14} style={{ ...MONO, fontSize: 11.5, fill: top ? "var(--paper)" : "currentColor" }}>
              doc_{i + 1} · {s.toFixed(2)}
            </text>
            {top && (
              <path d={`M240 ${dy(i) + 10} C 200 ${dy(i) + 10}, 200 345, ${nx + nw} 345`} fill="none" stroke="var(--accent)" strokeOpacity={0.6} strokeDasharray="2 4" />
            )}
          </g>
        );
      })}
      <text x={240} y={140} style={FAINT}>
        Top-k candidates
      </text>
      <text x={30} y={470} style={MONO}>
        k = 6 → 3 · cite sources
      </text>
    </>
  );
}

function Heatmap() {
  const rng = mulberry32(6);
  const tokens = ["sys", "find", "churn", "in", "q3", "logs", "→", "tool", "sql", "run", "ok", "eos"];
  const n = tokens.length;
  const cs = 23;
  const x0 = 76,
    y0 = 84;
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    let best = 0,
      bj = 0;
    const row: number[] = [];
    for (let j = 0; j <= i; j++) {
      const v = Math.min(1, Math.exp(-((i - j) ** 2) / 5) * 0.75 + (j === 2 ? 0.45 : 0) + (j === 7 && i > 7 ? 0.4 : 0) + rng() * 0.12);
      row.push(v);
      if (v > best) {
        best = v;
        bj = j;
      }
    }
    for (let j = 0; j < n; j++) {
      const x = x0 + j * cs,
        y = y0 + i * cs;
      if (j > i) {
        cells.push(<rect key={`${i}-${j}`} x={x + 1} y={y + 1} width={cs - 2} height={cs - 2} fill="none" stroke="currentColor" strokeOpacity={0.12} />);
      } else {
        cells.push(<rect key={`${i}-${j}`} x={x + 1} y={y + 1} width={cs - 2} height={cs - 2} fill={j === bj ? "var(--accent)" : "currentColor"} fillOpacity={j === bj ? 1 : 0.12 + row[j] * 0.8} />);
      }
    }
  }
  return (
    <>
      {cells}
      {tokens.map((t, i) => (
        <g key={i}>
          <text x={x0 - 8} y={y0 + i * cs + 15} textAnchor="end" style={SMALL}>
            {t}
          </text>
          <text
            x={0}
            y={0}
            transform={`translate(${x0 + i * cs + 15} ${y0 - 8}) rotate(-60)`}
            style={SMALL}
          >
            {t}
          </text>
        </g>
      ))}
      <text x={30} y={470} style={MONO}>
        Causal attention · L6 H3
      </text>
      <text x={370} y={470} textAnchor="end" style={ACC}>
        ■ argmax
      </text>
    </>
  );
}

function Layers() {
  const plates = [
    { k: "Client", v: "Streamlit dashboard" },
    { k: "API", v: "FastAPI" },
    { k: "Model", v: "XGBoost + SHAP" },
    { k: "Store", v: "MLflow registry" },
    { k: "Observe", v: "Prometheus + Grafana" },
  ];
  return (
    <>
      <line x1={131} y1={70} x2={131} y2={420} stroke="var(--accent)" strokeOpacity={0.8} strokeDasharray="2 4" />
      {plates.map((p, i) => {
        const y = 80 + i * 70;
        const pts = `36,${y + 28} 86,${y} 226,${y} 176,${y + 28}`;
        return (
          <g key={p.k}>
            <polygon points={pts} fill="currentColor" fillOpacity={i === 2 ? 0.16 : 0.07} stroke={i === 2 ? "var(--accent)" : "currentColor"} strokeOpacity={i === 2 ? 1 : 0.6} />
            <circle cx={131} cy={y + 14} r={3.5} fill="var(--accent)" />
            <line x1={228} y1={y + 14} x2={248} y2={y + 14} stroke="currentColor" strokeOpacity={0.5} />
            <text x={254} y={y + 10} style={i === 2 ? ACC : MONO}>
              {p.k}
            </text>
            <text x={254} y={y + 25} style={SMALL}>
              {p.v}
            </text>
          </g>
        );
      })}
      <text x={30} y={470} style={MONO}>
        Request → trace
      </text>
      <text x={370} y={470} textAnchor="end" style={FAINT}>
        5 layers
      </text>
    </>
  );
}

/* ---- new figures -------------------------------------------------- */

function Pillars() {
  const rows = [
    { k: "Authority", v: 0.78, d: "Expert credibility" },
    { k: "Fact density", v: 0.64, d: "Data & citations" },
    { k: "Clarity", v: 0.88, d: "Directness of answer" },
  ];
  const blended = Math.round(((0.78 + 0.64 + 0.88) / 3) * 100);
  return (
    <>
      <text x={30} y={76} style={MONO}>
        Semantic pillars
      </text>
      <text x={370} y={76} textAnchor="end" style={FAINT}>
        Llama 3.1 local
      </text>
      {rows.map((r, i) => {
        const y = 110 + i * 86;
        const w = 340 * r.v;
        return (
          <g key={r.k}>
            <text x={30} y={y} style={MONO}>
              {r.k}
            </text>
            <text x={370} y={y} textAnchor="end" style={{ ...MONO, fill: "var(--accent)" }}>
              {Math.round(r.v * 100)}
            </text>
            <rect x={30} y={y + 10} width={340} height={14} fill="currentColor" fillOpacity={0.1} />
            <rect className="grow" x={30} y={y + 10} width={w} height={14} fill={i === 2 ? "var(--accent)" : "currentColor"} fillOpacity={i === 2 ? 0.95 : 0.55} />
            {[0.25, 0.5, 0.75].map((t) => (
              <line key={t} x1={30 + 340 * t} y1={y + 10} x2={30 + 340 * t} y2={y + 24} stroke="currentColor" strokeOpacity={0.4} />
            ))}
            <text x={30} y={y + 40} style={SMALL}>
              {r.d}
            </text>
          </g>
        );
      })}
      <line x1={30} y1={382} x2={370} y2={382} stroke="currentColor" strokeOpacity={0.5} />
      <text x={30} y={412} style={MONO}>
        Blended GEO
      </text>
      <text x={370} y={424} textAnchor="end" style={{ ...MONO, fontSize: 40, letterSpacing: "-0.04em" }}>
        {blended}
      </text>
      <text x={30} y={432} style={SMALL}>
        technical + semantic
      </text>
    </>
  );
}

function Funnel() {
  const stages = [
    { k: "Ingest", n: 945, w: 1 },
    { k: "Drop nulls", n: 944, w: 0.93 },
    { k: "Dedupe", n: 944, w: 0.86 },
    { k: "Validate", n: 944, w: 0.79 },
    { k: "Publish", n: 944, w: 0.72 },
  ];
  return (
    <>
      <text x={30} y={74} style={MONO}>
        Polars pipeline
      </text>
      {stages.map((s, i) => {
        const y = 96 + i * 62;
        const w = 300 * s.w;
        const x = 30 + (300 - w) / 2;
        const last = i === stages.length - 1;
        return (
          <g key={s.k}>
            <path
              d={`M${x} ${y} h${w} l-14 34 h-${w - 28} z`}
              fill={last ? "var(--accent)" : "currentColor"}
              fillOpacity={last ? 1 : 0.1 + i * 0.06}
              stroke={last ? "var(--accent)" : "currentColor"}
              strokeOpacity={last ? 1 : 0.6}
            />
            <text x={x + 18} y={y + 22} style={{ ...MONO, fill: last ? "var(--paper)" : "currentColor" }}>
              {s.k}
            </text>
            <text x={348} y={y + 22} textAnchor="end" style={{ ...MONO, fill: i === 1 ? "var(--accent)" : "currentColor", fillOpacity: i === 1 ? 1 : 0.75 }}>
              {s.n}
            </text>
            {i < stages.length - 1 && <path d={`M200 ${y + 38} l6 10 h-12 z`} fill="currentColor" fillOpacity={0.6} />}
          </g>
        );
      })}
      <text x={30} y={432} style={ACC}>
        −1 garbage row
      </text>
      <text x={370} y={432} textAnchor="end" style={FAINT}>
        0 nulls · 0 dupes
      </text>
    </>
  );
}

function Shap() {
  const feats = [
    { k: "Contract: month-to-month", v: 0.34 },
    { k: "Tenure < 6 mo", v: 0.27 },
    { k: "Fiber optic internet", v: 0.18 },
    { k: "Electronic check", v: 0.11 },
    { k: "Tech support: no", v: 0.07 },
    { k: "Monthly charges", v: -0.09 },
    { k: "Two-year contract", v: -0.21 },
    { k: "Tenure > 48 mo", v: -0.31 },
  ];
  const mid = 210;
  const scale = 300;
  return (
    <>
      <text x={30} y={70} style={MONO}>
        SHAP impact
      </text>
      <text x={370} y={70} textAnchor="end" style={FAINT}>
        P(churn) 0.81
      </text>
      <line x1={mid} y1={86} x2={mid} y2={404} stroke="currentColor" strokeOpacity={0.6} />
      {feats.map((f, i) => {
        const y = 100 + i * 38;
        const w = Math.abs(f.v) * scale;
        const pos = f.v > 0;
        return (
          <g key={f.k}>
            <rect
              className={pos ? "grow" : "grow-r"}
              x={pos ? mid : mid - w}
              y={y}
              width={w}
              height={16}
              fill={pos ? "var(--accent)" : "currentColor"}
              fillOpacity={pos ? 0.95 : 0.5}
            />
            <text
              x={pos ? mid - 8 : mid + 8}
              y={y + 12}
              textAnchor={pos ? "end" : "start"}
              style={SMALL}
            >
              {f.k}
            </text>
          </g>
        );
      })}
      <text x={mid + 8} y={424} style={ACC}>
        → pushes to churn
      </text>
      <text x={mid - 8} y={424} textAnchor="end" style={FAINT}>
        retains ←
      </text>
    </>
  );
}

function Precision() {
  const ks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const model = [0.9, 0.86, 0.82, 0.78, 0.74, 0.69, 0.63, 0.58, 0.53, 0.49];
  const rule = [0.3, 0.29, 0.27, 0.26, 0.24, 0.23, 0.23, 0.22, 0.21, 0.2];
  const x = (i: number) => 40 + (i / (ks.length - 1)) * 320;
  const y = (v: number) => 370 - v * 280;
  const path = (arr: number[]) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <>
      <Axes x="k →" y="precision@k →" top={70} bottom={370} />
      {[0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line x1={40} y1={y(v)} x2={360} y2={y(v)} stroke="currentColor" strokeOpacity={0.12} />
          <text x={34} y={y(v) + 3} textAnchor="end" style={SMALL}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <line x1={x(4)} y1={y(rule[4])} x2={x(4)} y2={y(model[4])} stroke="var(--accent)" strokeDasharray="2 3" />
      <text x={x(4) + 8} y={(y(rule[4]) + y(model[4])) / 2} style={ACC}>
        ≈3× lift
      </text>
      <path d={path(rule)} fill="none" stroke="var(--limit)" strokeWidth={1.3} strokeDasharray="4 4" />
      <path className="draw" d={path(model)} fill="none" stroke="var(--accent)" strokeWidth={1.8} pathLength={1} />
      {model.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={2.4} fill="var(--accent)" />
      ))}
      <circle cx={x(4)} cy={y(model[4])} r={5} fill="none" stroke="var(--accent)" />
      {[0, 4, 9].map((i) => (
        <text key={i} x={x(i)} y={388} textAnchor="middle" style={SMALL}>
          {ks[i]}
        </text>
      ))}
      <line x1={30} y1={440} x2={48} y2={440} stroke="var(--accent)" strokeWidth={1.8} />
      <text x={56} y={444} style={MONO}>
        model
      </text>
      <line x1={150} y1={440} x2={168} y2={440} stroke="var(--limit)" strokeDasharray="4 4" />
      <text x={176} y={444} style={FAINT}>
        hand rule
      </text>
    </>
  );
}

function Chunks() {
  const total = 26;
  const perRow = 13;
  const cw = 23;
  const ch = 30;
  const x0 = 36;
  const y0 = 92;
  return (
    <>
      <text x={30} y={74} style={MONO}>
        Pass 1 — 15 pp per chunk
      </text>
      {Array.from({ length: total }).map((_, i) => {
        const r = Math.floor(i / perRow);
        const c = i % perRow;
        const x = x0 + c * cw;
        const y = y0 + r * ch;
        return (
          <g key={i}>
            <rect x={x} y={y} width={cw - 5} height={ch - 7} fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeOpacity={0.5} />
            {[0, 1, 2].map((l) => (
              <line key={l} x1={x + 4} y1={y + 7 + l * 5} x2={x + cw - 10} y2={y + 7 + l * 5} stroke="currentColor" strokeOpacity={0.45} />
            ))}
          </g>
        );
      })}
      <text x={370} y={74} textAnchor="end" style={FAINT}>
        384 pp
      </text>
      {Array.from({ length: 6 }).map((_, i) => {
        const x = x0 + 10 + i * 56;
        return (
          <g key={i}>
            <path d={`M${x} 158 V178`} stroke="currentColor" strokeOpacity={0.5} />
            <rect x={x - 22} y={178} width={44} height={26} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.5} />
            <text x={x} y={195} textAnchor="middle" style={SMALL}>
              ch{i + 1}
            </text>
            <path d={`M${x} 204 V226`} stroke="var(--accent)" strokeOpacity={0.7} />
          </g>
        );
      })}
      <rect x={36} y={226} width={328} height={48} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.5} />
      <text x={48} y={246} style={MONO}>
        Template
      </text>
      <text x={48} y={262} style={SMALL}>
        concepts · mermaid · tables · code · insights
      </text>
      <path d="M200 274 V300" stroke="var(--accent)" />
      <path d="M200 300 l6 -9 h-12 z" fill="var(--accent)" transform="translate(0 9)" />
      <text x={30} y={326} style={ACC}>
        Pass 2 — meta-summary
      </text>
      <rect x={36} y={338} width={328} height={62} fill="var(--accent)" fillOpacity={0.14} stroke="var(--accent)" />
      <text x={48} y={360} style={MONO}>
        Executive overview
      </text>
      <text x={48} y={382} style={SMALL}>
        + top 5 takeaways on the cover page
      </text>
      <text x={30} y={432} style={FAINT}>
        100% offline · Ollama
      </text>
    </>
  );
}

function Validation() {
  const metrics = [
    { k: "Silhouette", v: 0.72 },
    { k: "Calinski-H", v: 0.88 },
    { k: "Davies-B", v: 0.64 },
    { k: "ANOVA F", v: 0.91 },
    { k: "Kruskal-W", v: 0.83 },
    { k: "CV stability", v: 0.79 },
    { k: "F-ratio", v: 0.86 },
    { k: "Inter-cluster", v: 0.75 },
  ];
  const bw = 34;
  const x0 = 38;
  const base = 360;
  return (
    <>
      <Axes y="score →" top={76} bottom={base} />
      {metrics.map((m, i) => {
        const h = m.v * 250;
        const x = x0 + i * (bw + 7);
        const top = m.v > 0.85;
        return (
          <g key={m.k}>
            <rect className="grow-y" x={x} y={base - h} width={bw} height={h} fill={top ? "var(--accent)" : "currentColor"} fillOpacity={top ? 0.95 : 0.5} />
            <text x={x + bw / 2} y={base - h - 8} textAnchor="middle" style={SMALL}>
              {m.v.toFixed(2)}
            </text>
            <text
              x={0}
              y={0}
              transform={`translate(${x + bw / 2 + 4} ${base + 10}) rotate(-55)`}
              textAnchor="end"
              style={SMALL}
            >
              {m.k}
            </text>
          </g>
        );
      })}
      <text x={30} y={448} style={MONO}>
        8 metrics
      </text>
      <text x={370} y={448} textAnchor="end" style={ACC}>
        92% research validity
      </text>
    </>
  );
}

function MatchGraph() {
  const rng = mulberry32(21);
  const cx = 200;
  const cy = 215;
  const rings = [60, 110, 160];
  const people = Array.from({ length: 22 }).map(() => {
    const a = rng() * Math.PI * 2;
    const r = 34 + Math.sqrt(rng()) * 150;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.92, r, match: false };
  });
  people.forEach((p, i) => (p.match = i % 5 === 0 && p.r < 150));
  return (
    <>
      {rings.map((r, ri) => (
        <g key={r}>
          <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.92} fill="none" stroke="var(--limit)" strokeDasharray="2 6" />
          <text x={cx + r * 0.7} y={cy - r * 0.64} style={SMALL}>
            {(ri + 1) * 33} km
          </text>
        </g>
      ))}
      {people.map((p, i) =>
        p.match ? <line key={`l${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--accent)" strokeOpacity={0.7} /> : null,
      )}
      {people.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.match ? 5 : 3.2} fill={p.match ? "var(--accent)" : "currentColor"} fillOpacity={p.match ? 1 : 0.55} />
          {p.match && <circle cx={p.x} cy={p.y} r={11} fill="none" stroke="var(--accent)" strokeOpacity={0.5} />}
        </g>
      ))}
      <circle cx={cx} cy={cy} r={7} fill="none" stroke="currentColor" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={2.5} fill="currentColor" />
      <text x={cx + 14} y={cy + 4} style={MONO}>
        you
      </text>
      <text x={30} y={436} style={MONO}>
        Mutual matches
      </text>
      <text x={370} y={436} textAnchor="end" style={ACC}>
        radius 1–100 km
      </text>
      <text x={30} y={456} style={SMALL}>
        coordinates rounded — exact location never exposed
      </text>
    </>
  );
}

/* ------------------------------------------------------------------ */

const FIGURES: Record<VisualKind, () => React.ReactNode> = {
  auditor: Auditor,
  pillars: Pillars,
  funnel: Funnel,
  shap: Shap,
  precision: Precision,
  chunks: Chunks,
  validation: Validation,
  matchgraph: MatchGraph,
  dataset: Dataset,
  embedding: Embedding,
  mlops: Mlops,
  histogram: Histogram,
  growth: Growth,
  clusters: Clusters,
  dendrogram: Dendrogram,
  radar: Radar,
  dream: Dream,
  sensor: Sensor,
  rag: Rag,
  heatmap: Heatmap,
  layers: Layers,
};

interface Props {
  kind: VisualKind;
  className?: string;
  label?: string;
}

export default function ProjectVisual({ kind, className, label }: Props) {
  const Figure = FIGURES[kind];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={label ?? `Figure: ${kind}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <Figure />
    </svg>
  );
}
