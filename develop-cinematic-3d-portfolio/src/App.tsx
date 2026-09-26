import Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { ShaderScramble } from "./ShaderScramble";
import { ToolkitPage, WritingPage } from "./WritingToolkit";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CustomCursor({ enabled }: { enabled: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!enabled || !cursor) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let targetStretch = 0;
    let currentStretch = 0;
    let lastPointerX = Number.NaN;
    let lastPointerY = Number.NaN;
    let animationFrame = 0;

    const animate = () => {
      animationFrame = 0;
      currentX += (targetX - currentX) * 0.32;
      currentY += (targetY - currentY) * 0.32;
      currentStretch += (targetStretch - currentStretch) * 0.24;
      targetStretch *= 0.78;
      if (targetStretch < 0.005) targetStretch = 0;
      if (currentStretch < 0.005 && targetStretch === 0) currentStretch = 0;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      cursor.style.setProperty("--cursor-stretch-x", (1 + currentStretch * 0.7).toFixed(3));
      cursor.style.setProperty("--cursor-stretch-y", (1 - currentStretch * 0.28).toFixed(3));

      const pointerIsSettling = Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2;
      if (pointerIsSettling || Math.abs(targetStretch - currentStretch) > 0.005) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        cursor.classList.remove("is-moving");
      }
    };
    const scheduleAnimation = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animate);
    };
    const move = (event: PointerEvent) => {
      document.documentElement.classList.add("has-custom-cursor");
      const movement = Number.isFinite(lastPointerX) && Number.isFinite(lastPointerY)
        ? Math.hypot(event.clientX - lastPointerX, event.clientY - lastPointerY)
        : 0;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      targetX = event.clientX;
      targetY = event.clientY;
      targetStretch = Math.min(movement / 250, 0.3);
      if (movement > 0.5) cursor.classList.add("is-moving");

      const target = event.target instanceof Element ? event.target : null;
      const onPhoto = Boolean(target?.closest(".portrait-frame"));
      const interactive = onPhoto || Boolean(target?.closest("a, button, [role='button'], .project-visual"));
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-on-photo", onPhoto);
      cursor.classList.toggle("is-interactive", interactive);
      cursor.dataset.label = onPhoto ? "" : interactive ? "OPEN" : "";
      scheduleAnimation();
    };
    const pointerDown = () => cursor.classList.add("is-pressed");
    const pointerUp = () => cursor.classList.remove("is-pressed");
    const pointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        cursor.classList.remove("is-visible", "is-pressed", "is-moving");
        lastPointerX = Number.NaN;
        lastPointerY = Number.NaN;
        targetStretch = 0;
        document.documentElement.classList.remove("has-custom-cursor");
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointerout", pointerOut);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointerout", pointerOut);
      document.documentElement.classList.remove("has-custom-cursor");
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span className="cursor-ring" />
      <span className="cursor-label" />
    </div>
  );
}

type View = "home" | "projects" | "about" | "notes" | "toolkit";

type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  detail: string;
  technology: string[];
  image?: string;
  art?: "lolos" | "growmate" | "roblox";
  previewHref?: string;
  previewLabel?: string;
  accent: string;
  featured?: boolean;
  links?: { label: string; href: string }[];
  disclaimer?: string;
};

const canonicalUrl = "https://kimsilalahi.vercel.app";
const cvUrl = `${canonicalUrl}/Kimsang_Silalahi_CV.pdf`;
const githubUrl = "https://github.com/kim40404";
const huggingFaceUrl = "https://huggingface.co/kimsangsilalahi";
const linkedInUrl = "https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/";
const certificationsUrl = "https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/details/certifications/";
const email = "kimsilalahi@gmail.com";

const projects: Project[] = [
  {
    id: "lolos-pcpm",
    number: "01",
    title: "LolosPCPM",
    category: "Independent AI product",
    summary: "PCPM candidates lacked realistic practice; built an AI platform for diagnostics, tailored feedback, and case simulations.",
    detail:
      "From fragmented exam prep to a guided practice loop: shipped the full-stack product in under 24 hours. The launch article reports 120+ active users in the first three days.",
    technology: ["Next.js", "Supabase", "Hugging Face", "AI"],
    image: "/images/LolosPCPM.png",
    previewHref: "https://lolos-pcpm-ai.vercel.app/",
    previewLabel: "Open live product",
    accent: "#ff5d24",
    featured: true,
    links: [
      { label: "Visit product", href: "https://lolos-pcpm-ai.vercel.app/" },
      { label: "See detail", href: "https://github.com/kim40404/lolos-pcpm-ai" },
      {
        label: "See Article",
        href: "https://www.linkedin.com/pulse/building-ai-web-app-24-hours-getting-120-users-zero-budget-silalahi-8fexc/",
      },
    ],
    disclaimer: "Independent project. Not affiliated with, endorsed by, or connected to Bank Indonesia.",
  },
  {
    id: "citeready",
    number: "02",
    title: "CiteReady",
    category: "AI search visibility auditor",
    summary: "Web content is hard for AI engines to cite; built a SaaS audit workflow that flags gaps and structures pages for LLM visibility.",
    detail:
      "Evaluates page content and turns its findings into citation-ready recommendations through a Next.js and OpenAI workflow, making optimization steps actionable.",
    technology: ["Next.js", "OpenAI API", "Prompt Engineering", "Vercel"],
    image: "/images/citeready.png",
    previewHref: "https://cite-ready.vercel.app",
    previewLabel: "Open live product",
    accent: "#cfe4ff",
    featured: true,
    links: [
      { label: "Live product", href: "https://cite-ready.vercel.app" },
      { label: "See detail", href: "https://github.com/kim40404/CiteReady" },
      { label: "Backend repo", href: "https://github.com/kim40404/citeready-backend" },
    ],
  },
  {
    id: "mlops-churn",
    number: "03",
    title: "MLOps Churn Prediction",
    category: "MLOps pipeline",
    summary: "Churn models need more than a notebook; built a containerized training-to-inference pipeline with experiment tracking and monitoring.",
    detail:
      "Moves Telco churn data through model training, FastAPI serving, and Docker deployment, with MLflow tracking, Prometheus/Grafana monitoring, and drift checks. The CV reports 99% uptime.",
    technology: ["MLflow", "FastAPI", "Docker", "Grafana"],
    image: "/images/churn.png",
    previewHref: "https://github.com/kim40404/mlops-churn-dicoding",
    previewLabel: "Open GitHub repository",
    accent: "#d6efc9",
    featured: true,
    links: [
      { label: "See detail", href: "https://github.com/kim40404/mlops-churn-dicoding" },
      {
        label: "See Article",
        href: "https://dev.to/kim40404/from-jupyter-notebook-to-production-building-an-enterprise-mlops-pipeline-for-churn-prediction-jk3",
      },
    ],
  },
  {
    id: "agentic-dataset",
    number: "04",
    title: "Bilingual Agentic AI Dataset",
    category: "Open dataset",
    summary: "Open Indonesian agentic-AI data was scarce; released a cleaned 944-row bilingual dataset across eight categories.",
    detail:
      "Generated Indonesian–English pairs locally with Ollama, then cleaned and validated the corpus with Polars before publishing it on Hugging Face. The current public snapshot contains 944 rows.",
    technology: ["Python", "Ollama", "Hugging Face", "NLP"],
    image: "/images/huggingface.avif",
    accent: "#f4c744",
    links: [
      { label: "Hugging Face dataset", href: "https://huggingface.co/datasets/Kimsang766/agentic-ai-instructions-id-en" },
    ],
  },
  {
    id: "honey-quality",
    number: "05",
    title: "IoT Honey Quality Monitoring",
    category: "IoT and machine learning",
    summary: "Manual honey checks were slow; built an ESP32 and K-NN classifier using readings from five sensors.",
    detail:
      "Streams DHT22, pH, MQ-135, TDS, and LDR readings to Firebase for classification; reported 88.25% predictive accuracy across test batches.",
    technology: ["ESP32", "K-NN", "Firebase", "C++"],
    image: "/images/Honey_Quality.png",
    accent: "#f5b640",
  },
  {
    id: "growmate",
    number: "06",
    title: "GrowMate",
    category: "Collaboration platform",
    summary: "Finding compatible collaborators was difficult; built a platform matching people by shared skills, goals, and roles.",
    detail:
      "A React and PostgreSQL app combines real-time matchmaking, REST APIs, and role-based access to help users find project partners.",
    technology: ["React", "PostgreSQL", "REST APIs", "Matchmaking"],
    image: "/images/growmate.png",
    accent: "#bcd8ff",
    links: [
      { label: "Live app", href: "https://growmate-app.vercel.app" },
      { label: "GitHub repo", href: "https://github.com/kim40404/growmate-app" },
    ],
  },
  {
    id: "roblox-gunung-gila",
    number: "07",
    title: "Gunung Gila — Roblox",
    category: "Game development",
    summary: "Built a Roblox climbing RPG centered on player progression, a custom token economy, and live analytics.",
    detail:
      "Developed core mechanics over three sprints at Exstore.id with Lua and the SuperBiz SDK; project materials report analytics for 1,000+ daily active users.",
    technology: ["Lua", "Roblox Studio", "SuperBiz SDK", "Analytics"],
    image: "/images/roblox.png",
    accent: "#ffc2b0",
    links: [{ label: "Roblox game page", href: "https://www.roblox.com/games/89937206445659/GUNUNG-GILA" }],
  },
  {
    id: "pdf-summarizer",
    number: "08",
    title: "PDF Summarizer",
    category: "AI SaaS · Document intelligence",
    summary: "Dense PDFs hide key insights; this Python and LLM app condenses documents into concise summaries.",
    detail:
      "A Python/NLP pipeline processes PDF text and generates short, useful summaries in a Streamlit interface, helping users move from page-by-page review to quicker insight extraction.",
    technology: ["Python", "NLP", "LLM", "Streamlit"],
    image: "/images/pdf_Summarize.jpg",
    accent: "#8edff0",
    links: [{ label: "GitHub source", href: "https://github.com/kim40404/PDF-SUMMARY" }],
  },
];

const quickFacts = [
  { label: "Credential", value: "FlyRank AI × Anthropic" },
  { label: "Open work", value: "AI engineering roles, LLM products, and freelance consulting" },
  { label: "Currently", value: "AI Consultant (Freelance) · Open to work" },
];

const experience = [
  {
    role: "AI Engineer (Internship)",
    org: "FlyRank AI",
    period: "Jul – Aug 2026",
    sentence: "Automated LLM workflows that turned large reports into channel-native AIO content, cutting manual drafting time by over 80%.",
    detail: "Built LLM automations to turn lengthy reports into AIO content ready for different channels. The workflows reduced manual drafting time by over 80%.",
    highlights: ["LLM workflow automation", "Channel-native AIO", "80%+ less drafting"],
  },
  {
    role: "AI & Software Engineering Consultant",
    org: "Independent",
    period: "Aug 2024 – Jun 2026",
    sentence: "Delivered four end-to-end AI applications using RAG architectures and Claude/OpenAI APIs for freelance clients.",
    detail: "Delivered four end-to-end AI applications for freelance clients, using retrieval-augmented generation architectures and integrations with Claude and OpenAI APIs.",
    highlights: ["4 AI applications", "RAG architectures", "Claude & OpenAI APIs"],
  },
  {
    role: "Game Developer",
    org: "Exstore.id",
    period: "Nov 2025 – Jan 2026",
    sentence: "Led two large-scale Roblox titles with custom token economies and analytics for 1,000+ daily active users.",
    detail: "Led two large-scale Roblox titles and developed gameplay around custom token economies. Project analytics reported more than 1,000 daily active users.",
    highlights: ["Roblox development", "Custom token economies", "1,000+ daily active users"],
  },
  {
    role: "Software Engineer Intern",
    org: "Ministry of Law & Human Rights",
    period: "Jul – Aug 2024",
    sentence: "Built a government document automation tool with CodeIgniter4 and PHP, cutting manual processing time by 40% in four weeks.",
    detail: "Built a government document automation tool using CodeIgniter4 and PHP. The project reduced manual processing time by 40% in four weeks.",
    highlights: ["CodeIgniter4", "PHP", "40% less manual processing"],
  },
];

const certifications = [
  { name: "FlyRank AI Internship", detail: "AI Fluency" },
  { name: "AWS AI Academy", detail: "2026" },
  { name: "ICP Hackathon 11", detail: "Web3 & blockchain development" },
];


const navItems: { id: View; label: string; index: string }[] = [
  { id: "home", label: "Profile", index: "01" },
  { id: "projects", label: "Project", index: "02" },
  { id: "about", label: "About Experience", index: "03" },
  { id: "notes", label: "Writing", index: "04" },
  { id: "toolkit", label: "Toolkit", index: "05" },
];


function ArrowUpRight({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 16 4M7 4h9v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function HeroGlitch({ reducedMotion }: { reducedMotion: boolean }) {
  const glitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = glitchRef.current;
    if (reducedMotion || !overlay) return;

    const blocks = Array.from(overlay.querySelectorAll<HTMLElement>(".hero-glitch-block"));
    const colors = ["#0b0d10", "#171a1f", "#27343a", "#40252d", "#59353d", "#3b4650", "#5b5146", "#81878a"];
    const hero = overlay.closest<HTMLElement>(".hero");
    const portrait = hero?.querySelector<HTMLElement>(".portrait-frame");
    let burstTimer = 0;
    let finishTimer = 0;
    let animationFrame = 0;
    let disposed = false;
    const activeAnimations: Animation[] = [];

    const cancelAnimations = () => {
      activeAnimations.forEach((animation) => animation.cancel());
      activeAnimations.length = 0;
    };
    const clearPortraitGlitch = () => {
      blocks.forEach((block) => {
        const photo = block.querySelector<HTMLImageElement>(".hero-glitch-photo");
        photo?.classList.remove("has-fragments");
        ["left", "top", "width", "height"].forEach((property) => photo?.style.removeProperty(property));
      });
      portrait?.classList.remove("is-glitch-hit");
    };
    const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
    const makeFragmentFrames = (maxOpacity: number): Keyframe[] => {
      const still = "translate3d(0px, 0px, 0) skewX(0deg) scaleX(1)";
      const step = "steps(1, end)";
      const frames: Keyframe[] = [{ offset: 0, opacity: 0, transform: still, filter: "brightness(.72) saturate(.9) contrast(1.28)", easing: step }];
      const pulseCount = 3 + Math.floor(Math.random() * 3);
      const firstPulse = randomBetween(.035, .075);
      const pulseSlot = (.93 - firstPulse) / pulseCount;

      for (let pulse = 0; pulse < pulseCount; pulse += 1) {
        const cursor = firstPulse + pulseSlot * (pulse + randomBetween(.08, .72));
        const pulseLength = randomBetween(.012, .032);
        if (cursor + pulseLength >= .97) continue;

        const opacity = Math.min(maxOpacity, randomBetween(.72, .92));
        const x = Math.round(randomBetween(-54, 54));
        const y = Math.round(randomBetween(-5, 5));
        const secondX = Math.round(randomBetween(-48, 48));
        const skew = Math.round(randomBetween(-9, 9));
        const scale = randomBetween(.88, 1.18).toFixed(2);
        const hue = Math.round(randomBetween(-12, 12));
        const firstJolt = `translate3d(${x}px, ${y}px, 0) skewX(${skew}deg) scaleX(${scale})`;
        const secondJolt = `translate3d(${secondX}px, ${-y}px, 0) skewX(${-skew}deg) scaleX(${randomBetween(.9, 1.14).toFixed(2)})`;
        const joltFilter = `brightness(.9) saturate(1.2) contrast(1.32) hue-rotate(${hue}deg)`;

        frames.push({ offset: cursor, opacity: 0, transform: still, easing: step });
        frames.push({ offset: cursor + .002, opacity, transform: firstJolt, filter: joltFilter, easing: step });
        frames.push({ offset: cursor + pulseLength * .56, opacity: opacity * .78, transform: secondJolt, filter: joltFilter, easing: step });
        frames.push({ offset: cursor + pulseLength * .8, opacity: opacity * .38, transform: firstJolt, easing: step });
        frames.push({ offset: cursor + pulseLength, opacity: 0, transform: still, easing: step });

      }

      frames.push({ offset: 1, opacity: 0, transform: still });
      return frames;
    };

    const burst = () => {
      if (disposed) return;
      cancelAnimations();
      overlay.classList.remove("is-bursting");
      clearPortraitGlitch();

      const activeBlocks = new Set<number>();
      const amount = 4 + Math.floor(Math.random() * 3);
      while (activeBlocks.size < amount) activeBlocks.add(Math.floor(Math.random() * blocks.length));

      const heroBounds = hero?.getBoundingClientRect();
      const heroHeight = heroBounds?.height ?? window.innerHeight;
      const visibleHeight = Math.min(heroHeight, window.innerHeight);
      const visibleRatio = Math.min(1, visibleHeight / Math.max(heroHeight, 1));
      const overlayWidth = overlay.clientWidth;
      const overlayHeight = overlay.clientHeight;
      const portraitBounds = portrait?.getBoundingClientRect();
      const portraitLeft = portraitBounds && heroBounds ? portraitBounds.left - heroBounds.left : 0;
      const portraitTop = portraitBounds && heroBounds ? portraitBounds.top - heroBounds.top : 0;
      let portraitHitCount = 0;
      const fragmentFrames = new Map<HTMLElement, Keyframe[]>();
      blocks.forEach((block, index) => {
        block.classList.remove("is-active");
        if (!activeBlocks.has(index)) return;

        const shift = Math.round((Math.random() - 0.5) * 60);
        const square = Math.random() < 0.34;
        const width = square ? 40 + Math.round(Math.random() * 30) : 68 + Math.round(Math.random() * 112);
        const height = square ? 36 + Math.round(Math.random() * 24) : 20 + Math.round(Math.random() * 32);
        const hitsPortrait = Boolean(portraitBounds && heroBounds && portraitHitCount < 1);
        const blockLeft = hitsPortrait && portraitBounds
          ? portraitLeft + Math.random() * Math.max(0, portraitBounds.width - width)
          : (Math.random() * 96 / 100) * overlayWidth;
        const blockTop = hitsPortrait && portraitBounds
          ? portraitTop + Math.random() * Math.max(0, portraitBounds.height - height)
          : Math.random() * visibleRatio * overlayHeight;
        if (hitsPortrait) portraitHitCount += 1;
        const leftPercent = (blockLeft / overlayWidth) * 100;
        const topPercent = (blockTop / overlayHeight) * 100;
        block.style.left = `${leftPercent}%`;
        block.style.top = `${topPercent}%`;
        block.style.width = `${width}px`;
        block.style.height = `${height}px`;
        block.style.setProperty("--glitch-color-a", colors[Math.floor(Math.random() * colors.length)]);
        block.style.setProperty("--glitch-color-b", colors[Math.floor(Math.random() * colors.length)]);
        block.style.setProperty("--glitch-color-c", colors[Math.floor(Math.random() * colors.length)]);
        block.style.setProperty("--glitch-color-d", colors[Math.floor(Math.random() * colors.length)]);
        block.style.setProperty("--glitch-pattern-shift", `${Math.round((Math.random() - 0.5) * 36)}px`);
        const opacity = 0.68 + Math.random() * 0.24;
        block.style.setProperty("--glitch-return", `${-shift * 0.65}px`);
        block.classList.add("is-active");
        fragmentFrames.set(block, makeFragmentFrames(opacity));

        if (portraitBounds && heroBounds) {
          const cutLeft = Math.max(blockLeft, portraitLeft);
          const cutTop = Math.max(blockTop, portraitTop);
          const cutRight = Math.min(blockLeft + width, portraitLeft + portraitBounds.width);
          const cutBottom = Math.min(blockTop + height, portraitTop + portraitBounds.height);
          if (cutRight > cutLeft && cutBottom > cutTop) {
            const photo = block.querySelector<HTMLImageElement>(".hero-glitch-photo");
            if (photo) {
              photo.style.left = `${portraitLeft - blockLeft}px`;
              photo.style.top = `${portraitTop - blockTop}px`;
              photo.style.width = `${portraitBounds.width}px`;
              photo.style.height = `${portraitBounds.height}px`;
              photo.classList.add("has-fragments");
              portrait?.classList.add("is-glitch-hit");
            }
          }
        }
      });

      const burstDuration = 2000 + Math.random() * 2000;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        if (disposed) return;
        overlay.classList.add("is-bursting");
        activeBlocks.forEach((index) => {
          const block = blocks[index];
          const frames = fragmentFrames.get(block);
          if (!frames) return;
          activeAnimations.push(block.animate(frames, { duration: burstDuration, fill: "both", easing: "linear" }));

          const photo = block.querySelector<HTMLImageElement>(".hero-glitch-photo.has-fragments");
          if (photo) {
            const photoFrames = frames.map((frame) => ({
              offset: frame.offset,
              opacity: typeof frame.opacity === "number" ? frame.opacity * 0.88 : 0,
              easing: frame.easing,
            }));
            activeAnimations.push(photo.animate(photoFrames, { duration: burstDuration, fill: "both", easing: "linear" }));
          }
        });
      });
      finishTimer = window.setTimeout(() => {
        overlay.classList.remove("is-bursting");
        cancelAnimations();
        clearPortraitGlitch();
      }, burstDuration + 130);
      burstTimer = window.setTimeout(burst, burstDuration + 7000);
    };

    burstTimer = window.setTimeout(burst, 1500);
    return () => {
      disposed = true;
      window.clearTimeout(burstTimer);
      window.clearTimeout(finishTimer);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      cancelAnimations();
      clearPortraitGlitch();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;
  return (
    <div ref={glitchRef} className="hero-glitch" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <span className="hero-glitch-block" key={index}>
          <img className="hero-glitch-photo" src="/images/kimsang-robot.jpg" alt="" draggable={false} />
        </span>
      ))}
    </div>
  );
}

function PortraitHover({ reducedMotion, frameRef }: { reducedMotion: boolean; frameRef: React.RefObject<HTMLDivElement | null> }) {
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let active = false;
    let animationFrame = 0;
    let lastClientX = Number.NaN;
    let lastClientY = Number.NaN;
    let lastTrackedX = Number.NaN;
    let lastTrackedY = Number.NaN;
    let targetX = 0.5;
    let targetY = 0.5;
    let currentX = 0.5;
    let currentY = 0.5;
    let targetDistortion = 0;
    let currentDistortion = 0;

    const writePosition = () => {
      frame.style.setProperty("--pointer-x", `${currentX * 100}%`);
      frame.style.setProperty("--pointer-y", `${currentY * 100}%`);
    };
    const scheduleAnimation = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animatePosition);
    };
    const deactivate = () => {
      active = false;
      targetDistortion = 0;
      frame.classList.remove("is-revealing");
      if (currentDistortion > 0.05) scheduleAnimation();
      else {
        currentDistortion = 0;
        displacementRef.current?.setAttribute("scale", "0");
      }
    };
    const animatePosition = () => {
      animationFrame = 0;
      if (active) {
        const follow = reducedMotion ? 1 : 0.24;
        currentX += (targetX - currentX) * follow;
        currentY += (targetY - currentY) * follow;
        writePosition();
      }

      targetDistortion *= 0.78;
      if (targetDistortion < 0.05) targetDistortion = 0;
      currentDistortion += (targetDistortion - currentDistortion) * 0.22;
      if (currentDistortion < 0.05 && targetDistortion === 0) currentDistortion = 0;
      displacementRef.current?.setAttribute("scale", currentDistortion.toFixed(2));

      const pointerIsSettling = active && (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001);
      if (pointerIsSettling || Math.abs(targetDistortion - currentDistortion) > 0.05) {
        scheduleAnimation();
      }
    };
    const syncToFrame = (clientX: number, clientY: number) => {
      const rect = frame.getBoundingClientRect();
      const inside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      if (!rect.width || !rect.height || !inside) {
        deactivate();
        return;
      }

      targetX = (clientX - rect.left) / rect.width;
      targetY = (clientY - rect.top) / rect.height;
      if (!active) {
        currentX = targetX;
        currentY = targetY;
        active = true;
        frame.classList.add("is-revealing");
        writePosition();
        return;
      }

      frame.classList.add("is-revealing");
      if (reducedMotion) {
        currentX = targetX;
        currentY = targetY;
        writePosition();
      } else if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animatePosition);
      }
    };
    const trackPointer = (event: PointerEvent) => {
      const movement = Number.isFinite(lastTrackedX) && Number.isFinite(lastTrackedY)
        ? Math.hypot(event.clientX - lastTrackedX, event.clientY - lastTrackedY)
        : 0;
      lastTrackedX = event.clientX;
      lastTrackedY = event.clientY;
      lastClientX = event.clientX;
      lastClientY = event.clientY;
      syncToFrame(lastClientX, lastClientY);

      if (active && !reducedMotion) {
        targetDistortion = Math.min(movement * 0.42, 9);
        scheduleAnimation();
      }
    };
    const syncLastPointer = () => {
      if (Number.isFinite(lastClientX) && Number.isFinite(lastClientY)) {
        syncToFrame(lastClientX, lastClientY);
      }
    };
    const leaveViewport = (event: PointerEvent) => {
      if (!event.relatedTarget) deactivate();
    };

    window.addEventListener("pointermove", trackPointer, true);
    window.addEventListener("pointerover", trackPointer, true);
    window.addEventListener("pointerdown", trackPointer, true);
    window.addEventListener("pointerout", leaveViewport, true);
    window.addEventListener("scroll", syncLastPointer, { capture: true, passive: true });
    window.addEventListener("resize", syncLastPointer);
    window.addEventListener("blur", deactivate);
    window.addEventListener("focus", syncLastPointer);
    return () => {
      window.removeEventListener("pointermove", trackPointer, true);
      window.removeEventListener("pointerover", trackPointer, true);
      window.removeEventListener("pointerdown", trackPointer, true);
      window.removeEventListener("pointerout", leaveViewport, true);
      window.removeEventListener("scroll", syncLastPointer, true);
      window.removeEventListener("resize", syncLastPointer);
      window.removeEventListener("blur", deactivate);
      window.removeEventListener("focus", syncLastPointer);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      frame.classList.remove("is-revealing");
    };
  }, [reducedMotion]);

  return (
    <div ref={frameRef} className="portrait-frame" aria-label="Portrait of Kimsang Silalahi">
      <svg className="portrait-filter-defs" aria-hidden="true" focusable="false">
        <filter id="portrait-liquid" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="1" seed="4" result="liquid-noise" />
          <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="liquid-noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <img className="portrait-fallback-image" src="/images/kimsang-portrait.jpg" alt="Kimsang Silalahi" />
      <img className="portrait-reveal-image" src="/images/kimsang-robot.jpg" alt="" aria-hidden="true" draggable={false} />
    </div>
  );
}

function MagneticButton({ children, className = "", onClick, href }: { children: React.ReactNode; className?: string; onClick?: () => void; href?: string }) {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({
      x: (e.clientX - rect.left - rect.width / 2) * 0.18,
      y: (e.clientY - rect.top - rect.height / 2) * 0.22,
    });
  };
  const handleLeave = () => setOffset({ x: 0, y: 0 });
  const style = { transform: `translate(${offset.x}px, ${offset.y}px)`, transition: "transform 180ms ease" };

  if (href) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer" onMouseMove={handleMove} onMouseLeave={handleLeave} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave} style={style}>
      {children}
    </button>
  );
}

function MenuButton({ onClick, open }: { onClick: () => void; open: boolean }) {
  return (
    <button className="menu-button" type="button" onClick={onClick} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>
      <span className="menu-button-label">{open ? "Close" : "See me"}</span>
      <span className="menu-button-icon" aria-hidden="true">
        <i className={open ? "open-top" : ""} />
        <i className={open ? "open-bottom" : ""} />
      </span>
    </button>
  );
}

function TopBar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  return (
    <header className="top-bar">
      <a href="/" className="brand-mark" aria-label="Return to portfolio home">
        <img src="/images/icon.png" alt="" />
        <ShaderScramble text="Kimsang Silalahi" delay={180} />
      </a>
      <div className="top-bar-actions">
        <a className="top-bar-cv" href={cvUrl} target="_blank" rel="noreferrer">CV</a>
        <MenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
      </div>
    </header>
  );
}

function NavigationOverlay({ open, view, onChangeView, close }: { open: boolean; view: View; onChangeView: (view: View) => void; close: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="nav-overlay"
          initial={{ clipPath: "circle(0% at calc(100% - 42px) 42px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 42px) 42px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 42px) 42px)" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="nav-orbit" aria-hidden="true" />
          <div className="nav-list" role="navigation" aria-label="Portfolio navigation">
            <p className="section-kicker">Navigate</p>
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => { onChangeView(item.id); close(); }} className={`nav-link ${view === item.id ? "active" : ""}`} aria-current={view === item.id ? "page" : undefined}>
                <span>{item.index}</span>
                <strong className={item.id === "about" ? "nav-link-title-wide" : undefined}>{item.label}</strong>
                <ArrowUpRight />
              </button>
            ))}
          </div>
          <div className="nav-contact">
            <a href={`mailto:${email}`}>{email}</a>
            <a href={linkedInUrl} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
            <a href={githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
            <a href={cvUrl} target="_blank" rel="noreferrer">CV <ArrowUpRight /></a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Hero({ reducedMotion, onViewProjects }: { reducedMotion: boolean; onViewProjects: () => void }) {
  const portraitRef = useRef<HTMLDivElement>(null);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <HeroGlitch reducedMotion={reducedMotion} />
      <div className="hero-layout">
        <div className="hero-content">
          <motion.p className="hero-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <ShaderScramble text="AI Engineer · LLM applications, RAG systems, agentic pipelines" block delay={360} />
          </motion.p>
          <motion.h1 id="hero-title" className="hero-name" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
            <ShaderScramble text="Kimsang" delay={480} />
            <br />
            <ShaderScramble text="Silalahi" delay={620} /><span className="hero-dot">.</span>
          </motion.h1>
          <motion.p className="hero-support" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
            <ShaderScramble text="I build practical AI systems that stay reliable after launch — from data synthesis to deployment and monitoring." block delay={760} />
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}>
            <MagneticButton className="round-arrow" onClick={onViewProjects}>
              <span>View work</span>
              <ArrowUpRight />
            </MagneticButton>
            <MagneticButton className="ghost-action" href={cvUrl}>
              <span>Download CV</span>
              <ArrowUpRight />
            </MagneticButton>
          </motion.div>
        </div>
        <motion.div
          className="hero-portrait-wrap"
          initial={{ opacity: 0, scale: 0.94, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <PortraitHover reducedMotion={reducedMotion} frameRef={portraitRef} />
        </motion.div>
      </div>
      <a className="scroll-cue" href="#facts"><span>Scroll</span><i /></a>
    </section>
  );
}

function Facts() {
  return (
    <section id="facts" className="facts section-shell" aria-label="Quick facts">
      {quickFacts.map((fact) => (
        <div className="fact" key={fact.label}>
          <span className="fact-label">{fact.label}</span>
          <strong className="fact-value">{fact.value}</strong>
        </div>
      ))}
    </section>
  );
}

function ProjectArt({ project }: { project: Project }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (project.image && !imageFailed) {
    return (
      <div className="project-visual">
        <img src={project.image} alt={`${project.title} preview`} loading="lazy" onError={() => setImageFailed(true)} />
        <span className="project-visual-tag project-preview-tag">Project Preview</span>
      </div>
    );
  }
  if (project.image) {
    return (
      <div className="project-visual project-image-fallback" role="img" aria-label={`${project.title} preview unavailable`}>
        <span className="project-image-fallback-title">{project.title}</span>
        <span className="project-visual-tag">Preview unavailable</span>
      </div>
    );
  }
  return (
    <div className={`project-visual illustrative art-${project.art ?? "lolos"}`} aria-hidden="true">
      {project.art === "growmate" ? (
        <>
          <span className="art-word">GrowMate</span>
          <span className="art-nodes"><i /><i /><i /><i /><i /></span>
          <span className="art-lines" />
        </>
      ) : project.art === "roblox" ? (
        <>
          <span className="art-word">Gunung<br />Gila</span>
          <span className="art-grid" />
        </>
      ) : (
        <>
          <span className="art-word">Lolos<br />PCPM</span>
          <span className="art-check">+</span>
          <span className="art-lines" />
        </>
      )}
      <span className="project-visual-tag">Illustrative mark — not a product screenshot</span>
    </div>
  );
}

function FeatureProject({ project, index, reducedMotion }: { project: Project; index: number; reducedMotion: boolean }) {
  const [hovered, setHovered] = useState(false);
  const style = useMemo(() => ({ "--project-accent": project.accent } as React.CSSProperties), [project.accent]);
  return (
    <article
      className={`feature-project ${index % 2 ? "reverse" : ""}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="feature-visual-wrap"
        animate={reducedMotion ? undefined : { y: hovered ? -14 : 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
      >
        {project.previewHref ? (
          <a className="project-preview-link" href={project.previewHref} target="_blank" rel="noreferrer" aria-label={`${project.previewLabel ?? "View project"}: ${project.title}`}>
            <ProjectArt project={project} />
            <span className="project-preview-action">{project.previewLabel ?? "View project"} <ArrowUpRight /></span>
          </a>
        ) : <ProjectArt project={project} />}
      </motion.div>
      <motion.div
        className="feature-copy"
        animate={reducedMotion ? undefined : { x: hovered ? (index % 2 ? -6 : 6) : 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
      >
        <div className="project-meta"><span>{project.number}</span><span>{project.category}</span></div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="tech-list">{project.technology.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
        <div className="project-cta-row">
          {project.links?.filter((link) => link.label === "See detail" || link.label === "See Article").map((link) => (
            <a className="text-link" key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight /></a>
          ))}
          {project.disclaimer && <span className="disclaimer-inline">{project.disclaimer}</span>}
        </div>
      </motion.div>
    </article>
  );
}

function Home({ onChangeView, reducedMotion }: { onChangeView: (view: View) => void; reducedMotion: boolean }) {
  const featured = projects.filter((project) => project.featured).slice(0, 3);
  return (
    <main>
      <Hero reducedMotion={reducedMotion} onViewProjects={() => onChangeView("projects")} />
      <SearchDiscovery />
      <Reveal><Facts /></Reveal>
      <section className="selected-work section-shell">
        <Reveal className="work-intro">
          <div>
            <p className="section-kicker">Selected projects</p>
            <h2>Three projects worth a look.</h2>
          </div>
          <button type="button" className="all-projects-button" onClick={() => onChangeView("projects")}>All projects <ArrowUpRight /></button>
        </Reveal>
        <div className="feature-list">
          {featured.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.08}>
              <FeatureProject project={project} index={index} reducedMotion={reducedMotion} />
            </Reveal>
          ))}
        </div>
      </section>
      <Reveal>
        <section className="profile-strip section-shell">
          <p className="section-kicker">Profile</p>
          <div>
            <p className="profile-pullquote">I build AI products that move beyond demos—combining LLMs, RAG, and automation into systems people can rely on.</p>
            <button type="button" className="text-link on-dark" onClick={() => onChangeView("about")}>About Kimsang <ArrowUpRight /></button>
          </div>
        </section>
      </Reveal>
      <ContactSection />
    </main>
  );
}

function SearchDiscovery() {
  return (
    <section className="search-discovery section-shell" aria-labelledby="search-discovery-title">
      <div className="search-discovery-index">
        <p className="section-kicker">AI search discovery</p>
        <strong aria-label="Ranked number one">#1</strong>
        <span className="search-discovery-index-note">in one ChatGPT response</span>
      </div>
      <div className="search-discovery-copy">
        <div className="search-discovery-meta">
          <span className="section-kicker">Personal search observation · Medan</span>
          <span className="search-observation-tag">GEO / AI visibility</span>
        </div>
        <h2 id="search-discovery-title">My profile surfaced first.</h2>
        <p>ChatGPT placed my LinkedIn profile first in a generated list of 20 AI Engineer / AI talent profiles in Medan.</p>
        <figure className="search-proof-preview">
          <a className="search-proof-image-link" href="/images/AI%20search%20discovery.jpeg" target="_blank" rel="noreferrer" aria-label="Open full ChatGPT search screenshot">
            <img className="search-proof-image" src="/images/AI%20search%20discovery.jpeg" alt="ChatGPT response listing Kimsang Silalahi first among AI Engineer profiles in Medan" loading="lazy" />
          </a>
          <figcaption className="search-proof-caption">Screenshot evidence · ChatGPT search for AI talent in Medan</figcaption>
        </figure>
        <p className="search-discovery-note">A prompt-specific AI discovery signal (GEO/AEO), not a Google ranking or proof of SEO performance. ChatGPT results can vary by prompt, account, location, and time.</p>
      </div>
    </section>
  );
}

function ProjectRow({ project, isOpen, onToggle, reducedMotion, index }: { project: Project; isOpen: boolean; onToggle: () => void; reducedMotion: boolean; index: number }) {
  return (
    <motion.article
      layout
      className={`project-row ${isOpen ? "is-open" : ""} ${index % 2 ? "reverse" : ""}`}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.15) }}
    >
      <button type="button" className="project-row-trigger" aria-expanded={isOpen} aria-controls={`project-${project.id}`} onClick={onToggle}>
        <span className="project-row-number">{project.number}</span>
        <span className="project-row-body">
          <span className="project-row-title">{project.title}</span>
          <span className="project-row-summary">{project.summary}</span>
        </span>
        <span className="project-row-category">{project.category}</span>
        <span className="expand-sign" aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div id={`project-${project.id}`} className="project-expanded" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <div className="project-expanded-content">
              <ProjectArt project={project} />
              <div className="project-detail-copy">
                <p>{project.detail}</p>
                <div className="tech-list" aria-label={`${project.title} technologies`}>{project.technology.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div>
                {project.links && (
                  <div className="project-external-links">
                    {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight /></a>)}
                  </div>
                )}
                {project.disclaimer && <p className="project-note">{project.disclaimer}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function ProjectsPage({ reducedMotion }: { reducedMotion: boolean }) {
  const [openProject, setOpenProject] = useState<string | null>(null);
  return (
    <main className="page-main projects-page">
      <section className="page-hero section-shell">
        <p className="section-kicker">Project</p>
        <h1>From real problems<br />to working systems.</h1>
        <p>Eight projects across applied AI, document intelligence, MLOps, IoT, and games. Open a project to see the problem, approach, and links.</p>
      </section>
      <section className="project-overview section-shell" aria-label="Project overview">
        <div className="project-overview-count">
          <strong>{String(projects.length).padStart(2, "0")}</strong>
          <span>projects<br />documented</span>
        </div>
        <div className="project-overview-focus">
          <p className="section-kicker">Across disciplines</p>
          <div className="project-focus-tags">
            <span>Applied AI</span>
            <span>MLOps &amp; cloud</span>
            <span>IoT</span>
            <span>Interactive products</span>
          </div>
        </div>
        <div className="project-overview-note">
          <span className="project-overview-icon"><ArrowUpRight /></span>
          <span>Select a project to explore<br />the approach and links</span>
        </div>
      </section>
      <section className="project-index section-shell" aria-label="All projects">
        {projects.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} reducedMotion={reducedMotion} isOpen={openProject === project.id} onToggle={() => setOpenProject(openProject === project.id ? null : project.id)} />
        ))}
      </section>
      <ContactSection />
    </main>
  );
}


function ExperienceCard({ item, index }: { item: (typeof experience)[number]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `experience-detail-${index + 1}`;

  return (
    <motion.article layout className={`role experience-card ${isOpen ? "is-open" : ""}`}>
      <button className="experience-trigger" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setIsOpen((open) => !open)}>
        <span className="experience-number">0{index + 1}</span>
        <span className="experience-trigger-copy">
          <span className="role-head"><strong>{item.role}</strong><span>{item.org}</span><span className="role-period">{item.period}</span></span>
          <span className="experience-summary">{item.sentence}</span>
        </span>
        <span className="experience-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div id={panelId} className="experience-details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <p>{item.detail}</p>
            <div className="experience-highlights">{item.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function AboutPage({ onChangeView }: { onChangeView: (view: View) => void }) {
  return (
    <main className="page-main about-page">
      <section className="page-hero section-shell about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="section-kicker">About Experience</p>
          <h1 id="about-title">A generalist<br />leaning deep.</h1>
          <blockquote className="about-quote">
            <p>“The limits of my language mean the limits of my world.”</p>
            <cite>— Ludwig Wittgenstein</cite>
          </blockquote>
          <div className="about-story">
            <p>Strive to expand those boundaries by translating complex human problems into intelligent, intuitive digital solutions.</p>
            <p>I believe the true craft of software engineering isn&apos;t just about writing code. I think it&apos;s about creating technology that feels invisible yet makes a genuine impact.</p>
            <p>Let my work speak for itself. Check out my portfolio, or simply look my name up.</p>
          </div>
          <div className="about-hero-actions">
            <button type="button" className="all-projects-button" onClick={() => onChangeView("projects")}>Explore my work <ArrowUpRight /></button>
            <a className="about-profile-link" href={linkedInUrl} target="_blank" rel="noreferrer">Look me up on LinkedIn <ArrowUpRight /></a>
          </div>
        </div>
        <figure className="about-portrait-stage">
          <div className="about-portrait-orbit" aria-hidden="true" />
          <span className="about-portrait-note about-portrait-note-top">BUILD WITH INTENT</span>
          <span className="about-portrait-index">what&apos;s crackin?</span>
          <img className="about-cutout" src="/images/kimsang-about-cutout.png" alt="Kimsang Silalahi, portrait in a tan jacket" />
          <svg className="about-portrait-callout-lines" viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="about-callout-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0 0 6 3 0 6Z" fill="currentColor" />
              </marker>
            </defs>
            <path d="M120 111 C158 112 202 141 235 169" markerEnd="url(#about-callout-arrow)" />
            <path d="M280 255 C265 264 250 280 235 294" markerEnd="url(#about-callout-arrow)" />
            <path d="M120 407 C127 399 130 390 122 380" markerEnd="url(#about-callout-arrow)" />
          </svg>
          <div className="about-portrait-callouts" role="list" aria-label="Portrait annotations">
            <div className="about-portrait-callout about-portrait-callout-head" role="listitem">
              <span className="about-callout-number">01</span>
              <span className="about-callout-copy"><strong>HEAD / CURIOSITY</strong><span>Ask better questions.</span></span>
            </div>
            <div className="about-portrait-callout about-portrait-callout-chest" role="listitem">
              <span className="about-callout-number">02</span>
              <span className="about-callout-copy"><strong>CHEST / PURPOSE</strong><span>Keep people at the heart of each solution.</span></span>
            </div>
            <div className="about-portrait-callout about-portrait-callout-hands" role="listitem">
              <span className="about-callout-number">03</span>
              <span className="about-callout-copy"><strong>HANDS / PRACTICE</strong><span>Turn ideas into useful things.</span></span>
            </div>
          </div>
          <figcaption className="about-portrait-caption"><span>MEDAN, INDONESIA</span><span>AI · SYSTEMS · PEOPLE</span><span>ENGINEER · BUILDER</span></figcaption>
        </figure>
      </section>
      <section className="about-portrait-gallery section-shell" aria-label="Portraits">
        <div className="about-gallery-heading">
          <div>
            <p className="section-kicker">Portraits / 01—03</p>
            <h2>Different frames,<br /><em>same perspective.</em></h2>
          </div>
          <p>A few different sides of the person behind the projects.</p>
        </div>
        <div className="about-photo-grid">
          <figure className="about-photo-card about-photo-card-pass">
            <div className="about-photo-frame"><img src="/images/Kim%20Pass%20foto.jpg" alt="Formal portrait of Kimsang Silalahi" loading="lazy" /></div>
            <figcaption><span>01 / FORMAL</span><strong>Professional portrait</strong></figcaption>
          </figure>
          <figure className="about-photo-card about-photo-card-editorial">
            <div className="about-photo-frame"><img src="/images/kimsang-portrait.jpg" alt="Kimsang Silalahi on a train" loading="lazy" /></div>
            <figcaption><span>02 / EVERYDAY</span><strong>In between destinations</strong></figcaption>
          </figure>
          <figure className="about-photo-card about-photo-card-experiment">
            <div className="about-photo-frame"><img src="/images/kimsang-robot.jpg" alt="Artistic portrait of Kimsang with a robotic face" loading="lazy" /></div>
            <figcaption><span>03 / EXPERIMENT</span><strong>AI-generated, robot-inspired</strong></figcaption>
          </figure>
        </div>
      </section>
      <section className="about-reading about-experience section-shell" aria-labelledby="experience-title">
        <div className="about-experience-heading">
          <p className="section-kicker">Experience / 04 roles</p>
          <h2 id="experience-title">Work shaped by<br />real-world problems.</h2>
          <p>Select a role to explore the work, approach, and impact.</p>
        </div>
        <div className="role-list">
          {experience.map((item, index) => <ExperienceCard key={item.role} item={item} index={index} />)}
        </div>
      </section>
      <section className="about-tools-link section-shell" aria-label="Tools">
        <p className="section-kicker">Tools</p>
        <div className="tools-link-card">
          <div>
            <strong>Full toolkit</strong>
            <span>Software and hardware, grouped by area.</span>
          </div>
          <button type="button" className="underlined-button" onClick={() => onChangeView("toolkit")}>Open Toolkit <ArrowUpRight /></button>
        </div>
      </section>
      <section className="about-education section-shell" aria-label="Education and certifications">
        <div className="education-block">
          <p className="section-kicker">Education</p>
          <div className="edu-item"><strong>Universitas Sumatera Utara</strong><span>B.Sc. Computer Science · 2021–2025 · GPA 3.78/4.00, Cum Laude</span></div>
          <div className="edu-item"><strong>INTI International University, Malaysia</strong><span>Student mobility / MBKM · Humanitarian initiative · 2023–2024</span></div>
          <div className="edu-item"><strong>Languages</strong><span>Indonesian — native · English — professional working proficiency (IELTS target Band 7.0+)</span></div>
        </div>
        <div className="cert-block">
          <div className="certifications-heading">
            <p className="section-kicker">Certifications</p>
            <a href={certificationsUrl} target="_blank" rel="noreferrer">View full list <ArrowUpRight /></a>
          </div>
          <ul>{certifications.map((cert, index) => (
            <li key={cert.name}>
              <a className="certification-card" href={certificationsUrl} target="_blank" rel="noreferrer">
                <span className="certification-index">0{index + 1}</span>
                <span className="certification-copy"><strong>{cert.name}</strong><span>{cert.detail}</span></span>
                <ArrowUpRight />
              </a>
            </li>
          ))}</ul>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}


function ContactSection() {
  return (
    <footer className="contact-section section-shell">
      <p className="section-kicker">Contact</p>
      <div className="contact-main">
        <h2>Let’s build something useful.</h2>
        <a className="contact-email" href={`mailto:${email}`}>{email} <ArrowUpRight /></a>
      </div>
      <div className="footer-bottom">
        <span>Kimsang Silalahi · Medan, Indonesia</span>
        <a href={linkedInUrl} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
        <a href={githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
        <a href={huggingFaceUrl} target="_blank" rel="noreferrer">Hugging Face <ArrowUpRight /></a>
        <a href={cvUrl} target="_blank" rel="noreferrer">CV <ArrowUpRight /></a>
      </div>
    </footer>
  );
}

export default function App() {
  const preferredReducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [view, setView] = useState<View>(() => {
    const path = (typeof window !== "undefined" ? window.location.hash.replace("#", "") : "") as View;
    return navItems.some((item) => item.id === path) ? path : "home";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = Boolean(preferredReducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    window.history.replaceState(null, "", `#${view}`);
    if (reducedMotion) {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 0.9 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view, reducedMotion]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const changeView = (nextView: View) => setView(nextView);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <CustomCursor enabled={!reducedMotion} />
      <TopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <NavigationOverlay open={menuOpen} view={view} onChangeView={changeView} close={() => setMenuOpen(false)} />
      <AnimatePresence mode="wait">
        <motion.div
          id="main-content"
          key={view}
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {view === "home" && <Home onChangeView={changeView} reducedMotion={reducedMotion} />}
          {view === "projects" && <ProjectsPage reducedMotion={reducedMotion} />}
          {view === "about" && <AboutPage onChangeView={changeView} />}
          {view === "notes" && <WritingPage />}
          {view === "toolkit" && <ToolkitPage />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
