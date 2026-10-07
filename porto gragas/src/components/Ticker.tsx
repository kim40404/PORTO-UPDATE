import { tickerItems } from "../data/content";

export default function Ticker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div
      className="relative overflow-hidden border-y border-line py-4"
      aria-label="Focus areas"
      data-bg="dark"
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="label flex items-center gap-8 pr-8 whitespace-nowrap opacity-80">
            {item}
            <span className="inline-block h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
