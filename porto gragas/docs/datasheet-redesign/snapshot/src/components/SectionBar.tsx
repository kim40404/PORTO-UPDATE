import { usePrint } from "../hooks/useOnce";

interface Props {
  /** section anchor id, e.g. "characteristics" */
  id: string;
  /** bar label in datasheet caps, e.g. "Electrical characteristics" */
  label: string;
  /** optional right-aligned note, e.g. "Figures 2 to 11" */
  aside?: string;
}

/** The datasheet section bar: cobalt fill, Bold caps, prints across once. */
export default function SectionBar({ id, label, aside }: Props) {
  const ref = usePrint<HTMLHeadingElement>();
  return (
    <h2 id={id} ref={ref} className="bar" data-print>
      <span className="bar-label">{label}</span>
      {aside && <span className="bar-aside">{aside}</span>}
    </h2>
  );
}
