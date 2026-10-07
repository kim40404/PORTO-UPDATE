import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { assets } from "../data/assets";
import { profile } from "../data/content";
import { getLenis, reduceMotion, scrollTo } from "../lib/motion";

export const SECTIONS = [
  { id: "features", label: "Features" },
  { id: "characteristics", label: "Characteristics" },
  { id: "curves", label: "Curves" },
  { id: "pins", label: "Pins" },
  { id: "package", label: "Package" },
  { id: "notes", label: "Notes" },
  { id: "revisions", label: "Revisions" },
  { id: "ordering", label: "Ordering" },
];

/** The section whose bar last crossed the reading band (top quarter of the viewport). One observer, no scroll listener. */
function useCurrentSection(): string {
  const [current, setCurrent] = useState("");
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    let last = "";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id;
          if (e.isIntersecting) last = id;
          // the current bar slid back below the band: the reader is in the section above it
          else if (id === last && e.boundingClientRect.top > 0) {
            const i = SECTIONS.findIndex((s) => s.id === id);
            last = i > 0 ? SECTIONS[i - 1].id : "";
          }
        }
        setCurrent(last);
      },
      { rootMargin: "0px 0px -75% 0px" },
    );
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return current;
}

type Go = (e: MouseEvent<HTMLAnchorElement>) => void;

/** Fixed contents strip: name, section links with the current one marked, CV plate. Phones get a "Contents" button and a plain full-screen list. */
export default function Contents() {
  const current = useCurrentSection();
  const [open, setOpen] = useState(false);
  const go: Go = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href")!;
    setOpen(false);
    // next frame: the menu has unmounted and the scroll lock is lifted
    requestAnimationFrame(() => scrollTo(href));
  };
  return (
    <>
      <nav className="strip" aria-label="Contents">
        <span>{profile.name}</span>
        <div className="strip-links items-center">
          {SECTIONS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={go} aria-current={current === id ? "true" : undefined}>
              {label}
            </a>
          ))}
          <a className="plate-btn" href={assets.cvPdf} target="_blank" rel="noreferrer" style={{ minHeight: 36 }}>
            CV (PDF)
          </a>
        </div>
        <button type="button" className="strip-toggle" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
          Contents
        </button>
      </nav>
      {open && <ContentsMenu current={current} onGo={go} onClose={() => setOpen(false)} />}
    </>
  );
}

const tap = "link inline-flex min-h-11 items-center";
const menuLink =
  "block min-h-11 py-2 text-[1.75rem] font-bold uppercase leading-tight aria-[current=true]:text-band aria-[current=true]:underline aria-[current=true]:underline-offset-[6px]";

function ContentsMenu({ current, onGo, onClose }: { current: string; onGo: Go; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;
    // native focus trap: everything outside the menu is inert while it is open
    const outside = Array.from(document.body.children).filter((n) => n !== el);
    outside.forEach((n) => n.setAttribute("inert", ""));
    if (!reduceMotion()) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      outside.forEach((n) => n.removeAttribute("inert"));
      document.documentElement.style.overflow = "";
      lenis?.start();
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Contents"
      className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-paper text-ink"
      data-lenis-prevent
    >
      <div className="strip">
        <span>{profile.name}</span>
        <button ref={closeBtn} type="button" className="strip-toggle" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="px-[var(--gutter)] pt-[calc(var(--strip-h)+24px)] pb-12">
        <ul className="m-0 list-none p-0">
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={onGo} aria-current={current === id ? "true" : undefined} className={menuLink}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-3 border-t-[0.75px] border-ink pt-5">
          <a className="plate-btn" href={assets.cvPdf} target="_blank" rel="noreferrer">
            CV (PDF)
          </a>
          <a className={tap} href={`mailto:${profile.email}`}>
            Email {profile.email}
          </a>
          <a className={tap} href={profile.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp {profile.phone}
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
