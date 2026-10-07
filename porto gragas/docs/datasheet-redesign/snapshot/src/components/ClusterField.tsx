import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { reduceMotion } from "../lib/motion";

interface Props {
  className?: string;
  /** called on every K-Means step with iteration + inertia */
  onStep?: (iter: number, inertia: number, converged: boolean) => void;
}

export interface ClusterFieldHandle {
  /** reseed with the next seed and restart the fit */
  reseed(): void;
  /** advance one Lloyd iteration now (the automatic cadence continues) */
  step(): void;
}

export const DEFAULT_SEED = 7;

const K = 4;
type RGB = [number, number, number];
/* sRGB fallbacks for the paper tokens, used only if the CSS variables are missing
   or the browser cannot parse oklch() in canvas */
const FB = {
  paper: [252, 252, 251] as RGB,
  ink: [23, 25, 30] as RGB,
  band: [20, 70, 190] as RGB,
  limit: [143, 143, 143] as RGB,
  grid: [226, 230, 240] as RGB,
};

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

/* let the canvas parse any CSS colour (oklch included) and read it back as rgb */
function cssRGB(ctx: CanvasRenderingContext2D, css: string, fb: RGB): RGB {
  if (!css) return fb;
  ctx.fillStyle = "#010203";
  ctx.fillStyle = css;
  const s = String(ctx.fillStyle);
  if (s === "#010203") return fb;
  const hex = /^#([0-9a-f]{6})$/i.exec(s);
  if (hex) return [parseInt(hex[1].slice(0, 2), 16), parseInt(hex[1].slice(2, 4), 16), parseInt(hex[1].slice(4, 6), 16)];
  const fn = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(s);
  return fn ? [+fn[1], +fn[2], +fn[3]] : fb;
}

const ClusterField = forwardRef<ClusterFieldHandle, Props>(function ClusterField({ className, onStep }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRef = useRef(onStep);
  stepRef.current = onStep;
  const api = useRef<ClusterFieldHandle>({ reseed() {}, step() {} });
  useImperativeHandle(ref, () => ({ reseed: () => api.current.reseed(), step: () => api.current.step() }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    /* palette from the frame's CSS tokens */
    const cs = getComputedStyle(canvas);
    const v = (name: string) => cs.getPropertyValue(name).trim();
    const PAPER = cssRGB(ctx, v("--paper"), FB.paper);
    const INK = cssRGB(ctx, v("--ink"), FB.ink);
    const BAND = cssRGB(ctx, v("--band"), FB.band);
    const LIMIT = cssRGB(ctx, v("--limit"), FB.limit);
    const GRID = cssRGB(ctx, v("--grid") || "oklch(0.93 0.02 262)", FB.grid);
    const MONO = `400 11px ${v("--ff-mono") || "ui-monospace, monospace"}`;
    const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    /* per-cluster colour + alpha: first cluster in band, the rest ink */
    const UNSET = { c: INK, a: 0.55 };
    const CLUSTER = [{ c: BAND, a: 0.95 }, UNSET, UNSET, UNSET];

    /* Scale the simulation to the device: fewer points and a lower pixel
       ceiling on phones keeps the plot at 60fps without changing how it reads. */
    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const narrow = window.innerWidth < 760;
    const N = coarse || narrow ? 300 : 560;
    const DPR_CAP = coarse || narrow ? 1.5 : 2;

    let seed = DEFAULT_SEED;
    let rng = mulberry32(seed);
    const gauss = () => {
      const u = Math.max(rng(), 1e-6);
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
    };

    /* data, normalised to [0,1] */
    const tx = new Float32Array(N); // target
    const ty = new Float32Array(N);
    const x = new Float32Array(N); // displayed
    const y = new Float32Array(N);
    const ox = new Float32Array(N); // cursor displacement
    const oy = new Float32Array(N);
    const label = new Uint8Array(N);
    const col = new Float32Array(N * 4); // r g b a, eased

    const cx = new Float32Array(K); // centroid display
    const cy = new Float32Array(K);
    const ctx_ = new Float32Array(K); // centroid target
    const cty = new Float32Array(K);
    const ell = Array.from({ length: K }, () => ({ rx: 0, ry: 0, rot: 0, n: 0 }));

    const genBlobs = () => {
      const blobs = Array.from({ length: K }, () => ({
        x: 0.18 + rng() * 0.64,
        y: 0.18 + rng() * 0.64,
        sx: 0.05 + rng() * 0.05,
        sy: 0.05 + rng() * 0.05,
      }));
      for (let i = 0; i < N; i++) {
        if (i < N * 0.06) {
          tx[i] = 0.05 + rng() * 0.9;
          ty[i] = 0.05 + rng() * 0.9;
        } else {
          const b = blobs[i % K];
          tx[i] = Math.min(0.98, Math.max(0.02, b.x + gauss() * b.sx));
          ty[i] = Math.min(0.98, Math.max(0.02, b.y + gauss() * b.sy));
        }
      }
    };

    const initCentroids = () => {
      for (let k = 0; k < K; k++) {
        const i = Math.floor(rng() * N);
        ctx_[k] = tx[i];
        cty[k] = ty[i];
      }
    };

    let iter = 0;
    let converged = false;

    const step = () => {
      // assign
      let inertia = 0;
      for (let i = 0; i < N; i++) {
        let best = 0,
          bd = Infinity;
        for (let k = 0; k < K; k++) {
          const d = (tx[i] - ctx_[k]) ** 2 + (ty[i] - cty[k]) ** 2;
          if (d < bd) {
            bd = d;
            best = k;
          }
        }
        label[i] = best;
        inertia += bd;
      }
      // update + covariance
      let moved = 0;
      for (let k = 0; k < K; k++) {
        let sx = 0,
          sy = 0,
          n = 0;
        for (let i = 0; i < N; i++)
          if (label[i] === k) {
            sx += tx[i];
            sy += ty[i];
            n++;
          }
        if (!n) continue;
        const mx = sx / n,
          my = sy / n;
        moved += Math.abs(mx - ctx_[k]) + Math.abs(my - cty[k]);
        ctx_[k] = mx;
        cty[k] = my;
        let a = 0,
          b = 0,
          c = 0;
        for (let i = 0; i < N; i++)
          if (label[i] === k) {
            const dx = tx[i] - mx,
              dy = ty[i] - my;
            a += dx * dx;
            b += dx * dy;
            c += dy * dy;
          }
        a /= n;
        b /= n;
        c /= n;
        const tr = (a + c) / 2;
        const det = Math.sqrt(Math.max(0, ((a - c) / 2) ** 2 + b * b));
        ell[k] = { rx: 2.1 * Math.sqrt(tr + det), ry: 2.1 * Math.sqrt(Math.max(tr - det, 1e-6)), rot: 0.5 * Math.atan2(2 * b, a - c), n };
      }
      iter++;
      converged = moved < 0.002;
      stepRef.current?.(iter, inertia / N, converged);
    };

    const reseed = () => {
      seed += 1;
      rng = mulberry32(seed);
      genBlobs();
      initCentroids();
      iter = 0;
      converged = false;
    };

    /* jump the eased display state to the simulation state (static renders) */
    const snap = () => {
      for (let i = 0; i < N; i++) {
        x[i] = tx[i];
        y[i] = ty[i];
        const c = iter === 0 ? UNSET : CLUSTER[label[i]];
        col.set([c.c[0], c.c[1], c.c[2], c.a], i * 4);
      }
      for (let k = 0; k < K; k++) {
        cx[k] = ctx_[k];
        cy[k] = cty[k];
      }
    };

    /* first data set */
    genBlobs();
    initCentroids();
    snap();

    /* layout */
    let w = 0,
      h = 0,
      dpr = 1;
    const plot = { x: 0, y: 0, w: 0, h: 0 };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const padL = 44,
        padB = 40,
        padT = 16,
        padR = 12;
      plot.x = padL;
      plot.y = padT;
      plot.w = Math.max(10, w - padL - padR);
      plot.h = Math.max(10, h - padT - padB);
    };
    const PX = (v: number) => plot.x + v * plot.w;
    const PY = (v: number) => plot.y + (1 - v) * plot.h;

    const mouse = { x: -1, y: -1, on: false };

    const draw = () => {
      ctx.fillStyle = rgba(PAPER, 1);
      ctx.fillRect(0, 0, w, h);
      ctx.font = MONO;
      ctx.textBaseline = "alphabetic";

      /* grid + axes */
      ctx.strokeStyle = rgba(GRID, 1);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let g = 1; g < 5; g++) {
        const gx = Math.round(PX(g / 5)) + 0.5;
        const gy = Math.round(PY(g / 5)) + 0.5;
        ctx.moveTo(gx, plot.y);
        ctx.lineTo(gx, plot.y + plot.h);
        ctx.moveTo(plot.x, gy);
        ctx.lineTo(plot.x + plot.w, gy);
      }
      ctx.stroke();
      ctx.strokeStyle = rgba(INK, 0.8);
      ctx.beginPath();
      ctx.moveTo(plot.x + 0.5, plot.y);
      ctx.lineTo(plot.x + 0.5, plot.y + plot.h + 0.5);
      ctx.lineTo(plot.x + plot.w, plot.y + plot.h + 0.5);
      ctx.stroke();

      ctx.fillStyle = rgba(INK, 0.8);
      ctx.textAlign = "center";
      for (let g = 0; g <= 5; g++) ctx.fillText((g / 5).toFixed(1), PX(g / 5), plot.y + plot.h + 18);
      ctx.textAlign = "right";
      for (let g = 1; g <= 5; g++) ctx.fillText((g / 5).toFixed(1), plot.x - 8, PY(g / 5) + 3);
      ctx.textAlign = "right";
      ctx.fillText("KDA  →", plot.x + plot.w, plot.y + plot.h + 34);
      ctx.save();
      ctx.translate(plot.x - 30, plot.y);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "right";
      ctx.fillText("WIN RATE  →", 0, 0);
      ctx.restore();

      /* ellipses */
      ctx.setLineDash([2, 6]);
      ctx.strokeStyle = rgba(LIMIT, 1);
      for (let k = 0; k < K; k++) {
        const e = ell[k];
        if (!e.n) continue;
        ctx.beginPath();
        ctx.ellipse(PX(cx[k]), PY(cy[k]), e.rx * plot.w, e.ry * plot.h, -e.rot, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      /* points */
      for (let i = 0; i < N; i++) {
        const o = i * 4;
        ctx.fillStyle = `rgba(${col[o] | 0},${col[o + 1] | 0},${col[o + 2] | 0},${col[o + 3].toFixed(3)})`;
        const s = label[i] === 0 && iter > 0 ? 2.6 : 2.2;
        ctx.fillRect(PX(x[i]) + ox[i] - s / 2, PY(y[i]) + oy[i] - s / 2, s, s);
      }

      /* centroids */
      ctx.strokeStyle = rgba(BAND, 1);
      ctx.fillStyle = rgba(BAND, 1);
      ctx.lineWidth = 1.2;
      ctx.textAlign = "left";
      for (let k = 0; k < K; k++) {
        const px = PX(cx[k]),
          py = PY(cy[k]);
        ctx.beginPath();
        ctx.moveTo(px - 9, py);
        ctx.lineTo(px + 9, py);
        ctx.moveTo(px, py - 9);
        ctx.lineTo(px, py + 9);
        ctx.stroke();
        ctx.strokeRect(px - 4, py - 4, 8, 8);
        ctx.fillText(`C${k + 1}`, px + 12, py - 10);
      }
      ctx.lineWidth = 1;

      /* probe */
      if (mouse.on && mouse.x >= plot.x && mouse.x <= plot.x + plot.w && mouse.y >= plot.y && mouse.y <= plot.y + plot.h) {
        const vx = (mouse.x - plot.x) / plot.w;
        const vy = 1 - (mouse.y - plot.y) / plot.h;
        let best = 0,
          bd = Infinity;
        for (let k = 0; k < K; k++) {
          const d = (vx - cx[k]) ** 2 + (vy - cy[k]) ** 2;
          if (d < bd) {
            bd = d;
            best = k;
          }
        }
        ctx.strokeStyle = rgba(INK, 0.5);
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(mouse.x, plot.y + plot.h);
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(plot.x, mouse.y);
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(PX(cx[best]), PY(cy[best]));
        ctx.stroke();
        ctx.setLineDash([]);
        const txt = `${vx.toFixed(2)}, ${vy.toFixed(2)} → C${best + 1}`;
        ctx.font = MONO;
        const tw = ctx.measureText(txt).width;
        const bx = Math.min(mouse.x + 14, plot.x + plot.w - tw - 16);
        const by = Math.max(mouse.y - 30, plot.y + 4);
        ctx.fillStyle = rgba(PAPER, 0.94);
        ctx.fillRect(bx, by, tw + 14, 20);
        ctx.strokeStyle = best === 0 ? rgba(BAND, 1) : rgba(INK, 0.6);
        ctx.strokeRect(bx + 0.5, by + 0.5, tw + 13, 19);
        ctx.fillStyle = best === 0 ? rgba(BAND, 1) : rgba(INK, 1);
        ctx.textAlign = "left";
        ctx.fillText(txt, bx + 7, by + 14);
      }
    };

    /* simulation */
    const still = reduceMotion();
    let last = performance.now();
    let acc = 0;
    let hold = 0;
    let raf = 0;
    let visible = true;

    const update = (dt: number) => {
      // ease positions, colours, centroids
      const kp = 1 - Math.pow(0.02, dt);
      const kc = 1 - Math.pow(0.004, dt);
      for (let i = 0; i < N; i++) {
        x[i] += (tx[i] - x[i]) * kp;
        y[i] += (ty[i] - y[i]) * kp;
        // cursor repulsion (in px)
        let fx = 0,
          fy = 0;
        if (mouse.on) {
          const dx = PX(x[i]) - mouse.x;
          const dy = PY(y[i]) - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 3600 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / 60) * 16;
            fx = (dx / d) * f;
            fy = (dy / d) * f;
          }
        }
        ox[i] += (fx - ox[i]) * kp;
        oy[i] += (fy - oy[i]) * kp;
        const target = iter === 0 ? UNSET : CLUSTER[label[i]];
        const o = i * 4;
        col[o] += (target.c[0] - col[o]) * kc;
        col[o + 1] += (target.c[1] - col[o + 1]) * kc;
        col[o + 2] += (target.c[2] - col[o + 2]) * kc;
        col[o + 3] += (target.a - col[o + 3]) * kc;
      }
      for (let k = 0; k < K; k++) {
        cx[k] += (ctx_[k] - cx[k]) * kc;
        cy[k] += (cty[k] - cy[k]) * kc;
      }
      // discrete K-Means rhythm
      acc += dt;
      if (!converged && acc > 1.15) {
        acc = 0;
        step();
      } else if (converged) {
        hold += dt;
        if (hold > 4.5) {
          hold = 0;
          acc = 0;
          reseed();
          stepRef.current?.(0, 0, false);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      draw();
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on = true;
    };
    const onLeave = () => {
      mouse.on = false;
    };

    /* static solve for reduced motion: run to convergence, then paint once */
    const solveStill = () => {
      for (let s = 0; s < 20 && !converged; s++) step();
      snap();
      draw();
    };

    /* controls (Re-test / Step) */
    api.current = {
      reseed() {
        hold = 0;
        acc = 0;
        reseed();
        stepRef.current?.(0, 0, false);
        if (still) solveStill();
      },
      step() {
        hold = 0;
        acc = 0;
        step();
        if (still) {
          snap();
          draw();
        }
      },
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (still) draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(canvas);

    if (still) {
      solveStill();
    } else {
      // hover probing is a desktop affordance; skip the work on touch
      if (!coarse) {
        canvas.addEventListener("pointermove", onMove, { passive: true });
        canvas.addEventListener("pointerleave", onLeave);
      }
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      api.current = { reseed() {}, step() {} };
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-label="Live K-Means clustering of player telemetry" role="img" />;
});

export default ClusterField;
