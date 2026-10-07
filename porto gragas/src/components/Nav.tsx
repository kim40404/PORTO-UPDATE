import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EASE, ScrollTrigger, getLenis, gsap, reduceMotion, scramble, scrollTo } from "../lib/motion";
import { profile } from "../data/content";
import { cn } from "../utils/cn";

export const NAV_LINKS = [
  { label: "Work", href: "#work", n: "02" },
  { label: "Method", href: "#method", n: "03" },
  { label: "About", href: "#about", n: "04" },
  { label: "Writing", href: "#writing", n: "05" },
  { label: "Contact", href: "#contact", n: "07" },
];

interface Props {
  ready: boolean;
}

export default function Nav({ ready }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);
  /** solid bar + border once the page has moved at all */
  const [solid, setSolid] = useState(false);
  /** the hero already shows the name huge — only show the wordmark after it */
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [
      ScrollTrigger.create({
        start: 24,
        end: "max",
        onToggle: (self) => setSolid(self.isActive),
      }),
    ];
    const hero = document.getElementById("top");
    if (hero) {
      triggers.push(
        ScrollTrigger.create({
          trigger: hero,
          start: "bottom 72px",
          end: "max",
          onToggle: (self) => setPastHero(self.isActive),
        }),
      );
    }
    return () => triggers.forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;
    if (reduceMotion()) {
      gsap.set(ref.current, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(ref.current, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 1.3, ease: EASE, delay: 0.8 });
  }, [ready]);

  useEffect(() => {
    if (!menu) return;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    if (!reduceMotion()) {
      gsap.fromTo(".menu-item", { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: EASE, stagger: 0.05 });
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    };
  }, [menu]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenu(false);
    window.setTimeout(() => scrollTo(href), menu ? 60 : 0);
  };

  return (
    <>
      <header ref={ref} className={cn("site-nav", solid && "is-solid")} style={{ opacity: 0 }}>
        <nav className="site-nav-inner" aria-label="Primary">
          <a href="#top" onClick={(e) => go(e, "#top")} className="brand" aria-label={profile.name}>
            <span className={cn("brand-mark", pastHero && "is-out")} aria-hidden="true">
              {profile.monogram}
              <span className="brand-dot">.</span>
            </span>
            <span className={cn("brand-full", pastHero && "is-in")} aria-hidden="true">
              {profile.name}
              <span className="brand-dot">.</span>
            </span>
          </a>

          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  onMouseEnter={(e) => scramble(e.currentTarget, l.label, 0.4)}
                  className="nav-link"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="nav-btn nav-cv">
              CV <span aria-hidden="true">↗</span>
            </a>
            <button type="button" onClick={() => setMenu(true)} className="nav-btn nav-menu" aria-haspopup="dialog">
              Menu
            </button>
          </div>
        </nav>
      </header>

      {menu &&
        createPortal(
          <div className="nav-overlay" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="nav-overlay-top">
              <span className="brand-static">
                {profile.name}
                <span className="brand-dot">.</span>
              </span>
              <button type="button" onClick={() => setMenu(false)} className="nav-btn" autoFocus>
                Close ✕
              </button>
            </div>
            <ul className="nav-overlay-list">
              {[{ label: "Index", href: "#top", n: "01" }, ...NAV_LINKS].map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => go(e, l.href)} className="menu-item">
                    <span>{l.label}</span>
                    <span className="label num opacity-40">{l.n}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav-overlay-foot label">
              <a href={profile.cvUrl} target="_blank" rel="noreferrer">
                CV ↗
              </a>
              <a href={`mailto:${profile.email}`}>Email ↗</a>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
