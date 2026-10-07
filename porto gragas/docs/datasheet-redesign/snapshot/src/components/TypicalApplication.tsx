import { useEffect, useRef, useState } from "react";
import SectionBar from "./SectionBar";
import Frame from "./Frame";
import ClusterField, { DEFAULT_SEED, type ClusterFieldHandle } from "./ClusterField";
import { finePointer, reduceMotion } from "../lib/motion";

interface Fit {
  iter: number;
  inertia: number;
  converged: boolean;
}

/** Page 1, right column: TYPICAL APPLICATION and Figure 1, the live K-Means fit. */
export default function TypicalApplication() {
  const field = useRef<ClusterFieldHandle>(null);
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [fit, setFit] = useState<Fit>({ iter: 0, inertia: 0, converged: false });
  const [announce, setAnnounce] = useState("");
  /* announce only the consequence of a press, through to convergence; the auto cycle stays silent */
  const armed = useRef(false);
  const lastAnnounce = useRef(0);
  /* the probe is a hover affordance and ClusterField skips it under reduced motion */
  const probe = finePointer() && !reduceMotion();

  const onStep = (iter: number, inertia: number, converged: boolean) => {
    /* ClusterField bumps its seed by one before every iteration-0 callback (Re-test and its own cycle) */
    if (iter === 0) setSeed((s) => s + 1);
    setFit({ iter, inertia, converged });
  };

  const iterText = String(fit.iter).padStart(2, "0");
  const inertiaText = fit.iter === 0 ? "-" : fit.inertia.toFixed(4);
  const stateText = fit.iter === 0 ? "reseed" : fit.converged ? "converged" : "fitting";

  useEffect(() => {
    if (!armed.current) return;
    const due = Math.max(0, lastAnnounce.current + 2000 - Date.now());
    const t = window.setTimeout(() => {
      lastAnnounce.current = Date.now();
      setAnnounce(`Iteration ${fit.iter}, inertia ${inertiaText}, ${stateText}`);
      if (stateText === "converged") armed.current = false;
    }, due);
    return () => clearTimeout(t);
  }, [fit.iter, inertiaText, stateText]);

  const press = (fn: "step" | "reseed") => {
    armed.current = true;
    field.current?.[fn]();
  };

  const foot = (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px 16px" }}>
        <div className="readouts">
          <span>
            <span className="k">Iteration</span> {iterText}
          </span>
          <span>
            <span className="k">Inertia</span> {inertiaText}
          </span>
          <span>
            <span className="k">State</span> {stateText}
          </span>
        </div>
        <div className="seg" role="group" aria-label="Figure 1 controls">
          <button type="button" style={{ minHeight: 44 }} onClick={() => press("step")}>
            Step
          </button>
          <button type="button" style={{ minHeight: 44 }} onClick={() => press("reseed")}>
            Re-test
          </button>
        </div>
      </div>
      {probe && <p className="small">Move the pointer over the plot to probe a point.</p>}
      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>
    </>
  );

  return (
    <div>
      <div style={{ marginTop: -24 }}>
        <SectionBar id="typical" label="Typical application" aside="Figure 1, live" />
      </div>
      <Frame
        n="1"
        title="Player segmentation, K-Means, k = 4"
        aside="live"
        live
        figureId="mobile-legends"
        conditions={`Synthetic points, seed ${seed}, k = 4. The thesis measured 245 surveyed players (Figure 8).`}
        foot={foot}
      >
        <ClusterField ref={field} className="block h-full w-full" onStep={onStep} />
      </Frame>
    </div>
  );
}
