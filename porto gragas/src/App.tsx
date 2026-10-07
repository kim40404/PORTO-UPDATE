import { useCallback, useEffect, useState } from "react";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import SectionRail from "./components/SectionRail";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Manifesto from "./components/Manifesto";
import Work from "./components/Work";
import Capabilities from "./components/Capabilities";
import AboutStage from "./components/AboutStage";
import SearchDiscovery from "./components/SearchDiscovery";
import WritingSection from "./components/WritingSection";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import { ScrollTrigger, destroyLenis, getLenis, gsap, initLenis } from "./lib/motion";

type Theme = "dark" | "light";
const THEME_COLOR: Record<Theme, string> = { dark: "#121110", light: "#ece7dc" };

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

export default function App() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    const lenis = initLenis();
    lenis?.stop();

    const triggers = gsap.utils.toArray<HTMLElement>("[data-bg]").map((sec) =>
      ScrollTrigger.create({
        trigger: sec,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && applyTheme((sec.dataset.bg as Theme) || "dark"),
      }),
    );

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("load", onLoad);
      destroyLenis();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    getLenis()?.start();
    ScrollTrigger.refresh();
  }, [ready]);

  return (
    <>
      <a href="#work" className="skip-link label">
        Skip to work
      </a>
      <Preloader onDone={onDone} />
      <Cursor />
      <Nav ready={ready} />
      <SectionRail ready={ready} />

      <main>
        <Hero ready={ready} />
        <Ticker />
        <Manifesto />
        <Work />
        <Capabilities />
        <AboutStage />
        <SearchDiscovery />
        <WritingSection />
        <Experience />
      </main>
      <Contact />

      <div className="grain" aria-hidden="true" />
    </>
  );
}
