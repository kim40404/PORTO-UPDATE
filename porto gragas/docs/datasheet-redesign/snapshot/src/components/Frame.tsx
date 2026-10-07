import type { ReactNode } from "react";
import { useDraw } from "../hooks/useOnce";

interface Props {
  /** figure number as printed, e.g. "1" or "7.1" */
  n: string;
  title: string;
  /** right side of the head: a year, a reference, a figure id */
  aside?: string;
  /** the conditions line printed in the frame's lower margin */
  conditions?: string;
  /** NOT TESTED watermark + hatched edge for illustrative figures */
  illustrative?: boolean;
  /** the live figure (Figure 1) */
  live?: boolean;
  /** extra controls or readouts rendered inside the foot, after the conditions line */
  foot?: ReactNode;
  /** id used by the characteristics table to link row <-> frame */
  figureId?: string;
  className?: string;
  children: ReactNode;
}

/** A graticule figure frame: head (Figure N. Title), body, foot (conditions). */
export default function Frame({ n, title, aside, conditions, illustrative, live, foot, figureId, className, children }: Props) {
  const drawRef = useDraw<HTMLElement>();
  const cls = ["frame", illustrative && "is-illustrative", live && "is-live", className].filter(Boolean).join(" ");
  return (
    <figure ref={drawRef} className={cls} data-figure={figureId} aria-label={`Figure ${n}. ${title}`}>
      <figcaption className="frame-head">
        <span>
          <b>Figure {n}.</b> {title}
        </span>
        {aside && <span className="frame-ref">{aside}</span>}
      </figcaption>
      <div className="frame-body">{children}</div>
      {(conditions || foot) && (
        <div className="frame-foot">
          {conditions && <p className="frame-conditions">{conditions}</p>}
          {foot}
        </div>
      )}
    </figure>
  );
}
