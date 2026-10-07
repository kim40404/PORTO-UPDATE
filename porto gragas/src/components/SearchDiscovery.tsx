import { useState } from "react";
import Drawer from "./Drawer";
import { useReveal } from "../hooks/useReveal";
import { searchDiscovery } from "../data/content";

export default function SearchDiscovery() {
  const ref = useReveal<HTMLElement>();
  const [open, setOpen] = useState(false);

  return (
    <section
      id="discovery"
      ref={ref}
      className="relative"
      style={{ padding: "0 var(--gutter) var(--section)" }}
      data-bg="dark"
    >
      <div className="border-t border-line pt-16">
        {/* headline row */}
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <span className="label opacity-50">Signal</span>
            <div className="num mt-5 text-[clamp(5.5rem,13vw,11rem)] font-light leading-[0.82] tracking-[-0.06em] text-accent">
              #1
            </div>
          </div>

          <div className="lg:col-span-8" data-reveal="0.08">
            <h3 className="h2 max-w-[18ch]">First of 20 in a ChatGPT search for AI talent in Medan.</h3>
            <p className="mt-8 max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.55] text-muted">
              {searchDiscovery.note}
            </p>
          </div>
        </div>

        {/* full-width evidence preview */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group mt-14 block w-full text-left"
          aria-label="Enlarge the screenshot evidence"
          data-reveal="0.14"
        >
          <figure className="plate overflow-hidden">
            <figcaption className="label flex items-center justify-between border-b border-white/10 px-5 py-4 opacity-75 sm:px-7">
              <span>Evidence — screenshot</span>
              <span className="num hidden sm:inline">ChatGPT · Medan query</span>
            </figcaption>

            <div className="px-4 py-4 sm:px-7 sm:py-6">
              <img
                src={searchDiscovery.image}
                alt={searchDiscovery.imageAlt}
                loading="lazy"
                className="mx-auto block max-h-[72vh] w-full rounded-sm object-contain transition-transform duration-[900ms] ease-[var(--e-out)] group-hover:scale-[1.012]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-5 sm:px-7">
              <p className="max-w-[62ch] text-[0.98rem] leading-relaxed text-muted">
                The response listed twenty AI engineer and AI talent profiles in Medan. Mine appeared first.
              </p>
              <span className="label shrink-0 text-accent">
                Enlarge <span aria-hidden="true">↗</span>
              </span>
            </div>
          </figure>
        </button>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} label="Screenshot · ChatGPT response">
        <img
          src={searchDiscovery.image}
          alt={searchDiscovery.imageAlt}
          className="w-full border border-line"
        />
        <p className="mt-6 text-[1.02rem] leading-relaxed text-muted">{searchDiscovery.note}</p>
      </Drawer>
    </section>
  );
}
