# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring engineers evaluating Kimsang Silalahi for junior-to-mid Applied AI / LLM Engineer roles, on a laptop or a phone, between other tabs, with about two minutes. Secondary: freelance clients in Indonesia arriving from WhatsApp or LinkedIn on a phone. (Sources: ROADMAP_PENGEMBANGAN_PROFIL_AI_ENGINEER_90_HARI.md lines 7, 219, 557-563; content.ts experience block. Audience split inferred from those sources, not confirmed by the user.)

Job: decide within 20-30 seconds whether this person has built real systems, then verify through repos, figures, articles, the CV, and a contact action.

## Product Purpose

A single-page personal portfolio for Kimsang Silalahi, AI Engineer in Medan, Indonesia, that proves he ships LLM applications, retrieval systems, and production MLOps with measurement. Success: a visitor can name the target role, two strongest proofs, the main stack, a measured result, and a way to contact him without searching. Canonical URL https://kimsilalahi.vercel.app/ (the current deployment there is the older site; this codebase replaces it).

## Positioning

Every project is presented as evidence rather than description: the site draws its figures in code from the project's own data and logic (24 figures across 10 projects, plus a live K-Means fit in the browser), and attaches real screenshots and repos. The claim a neighbouring portfolio could not copy: "shipped, instrumented, measured" shown as figures, not adjectives.

Product rule for every number (from the roadmap): claim, measurement method, evidence, limitation. Never "production-ready", "high-traffic", or "99.9%" without data.

## Operating Context

- Visitors arrive from LinkedIn, ChatGPT answers (the site documents being listed first of 20 AI profiles in Medan for one prompt), GitHub, WhatsApp, and job applications.
- The CV PDF (Kimsang_Silalahi_CV.pdf, 26 Aug 2026) is the document recruiters download; it must stay one click away.
- Real material the site is built from: 10 project entries in src/data/content.ts with facts pulled from each README; FIGURES.md explains how every figure is read; 17 screenshots and portraits now self-hosted under public/images.
- The thesis (K-Means vs DBSCAN on 245 surveyed Mobile Legends players, USU 2021-2025, GPA 3.78, Cum Laude) is the origin of the figure language.
- Working stack on the subject's side: Python, FastAPI, MLflow, Docker, Prometheus + Grafana, Ollama for local inference, Claude / OpenAI APIs through LiteLLM, Next.js + Tailwind, Supabase, Vercel.

## Capabilities and Constraints

- Single Vite 7 + React 19 + Tailwind v4 page with GSAP and Lenis; deployable to Vercel as static output. Keep the data layer (src/data/content.ts) and the figure renderers (ProjectVisual.tsx, ClusterField.tsx) working; their visual dress may change.
- Sections that exist and must remain findable: hero with live figure, approach statement with stats, 10 projects with figures and screenshots opened in a detail view, method, about with portraits, the ChatGPT discovery evidence, 5 writing entries, experience and education, certifications, contact with email, CV, LinkedIn, GitHub, Hugging Face, WhatsApp.
- Mobile must be light: no horizontal overflow, images reserved by width and height, heavy effects gated to pointer: fine devices, reduced-motion honoured, rich motion allowed on desktop.
- Data honesty (FIGURES.md 298-312): the hero figure runs on synthetic data; CiteReady GEO scores, the churn precision curve, and SHAP figures are illustrative; FlyRank 0.24 to 0.74, the 945 to 944 funnel, the 92% validity, and 88.25% accuracy are real. Illustrative figures must say so on the page.
- Undecided facts the sources contradict (record, do not invent): GPA 3.78 vs 3.77; consultancy end date Jun 2026 vs Feb 2026; CiteReady LLM backend (local Llama 3.1 via Ollama vs OpenAI API) and canonical repo; dataset size 1,182 items vs 945 to 944 rows and which Hugging Face slug is current; whether the Exstore.id and Ministry of Law internships belong on the site; the exact AWS credential name; "10 projects documented on GitHub" while only 8 cards link to GitHub. Keep content.ts values as the current site truth until the owner resolves them.

## Brand Commitments

- Name: Kimsang Silalahi. Role word: AI Engineer. Location: Medan, Indonesia, WIB.
- Voice: plain, specific, measured; disclaimers stay (LolosPCPM not affiliated with Bank Indonesia; FlyRank results directional; the ChatGPT listing is an observation, not a ranking).
- Figures drawn in code, deterministic (seeded PRNG), "Fig." numbering tied to projects, and the single reading rule "orange = look at this first" are the incumbent brand's recognisable traits; the owner asked that the new design surpass the current one and carry zero AI-template tells, so these traits are evidence of the subject, not a pinned look. (Owner instruction, this session.)
- Pinned by the owner this session: maximal, authored UI/UX; rich motion on desktop; light on mobile; work only inside this folder.

## Evidence on Hand

- Repos: CiteReady, lolos-pcpm-ai, PDF-SUMMARY, mlops-churn-dicoding, flyrank-ml-internship-starter, id-en-data-pipeline, MobileLegendsUnique, growmate-app (github.com/kim40404). Honey Quality and Decodream have no public repo.
- Live apps: mobilelegendsunique.up.railway.app, growmate-app.vercel.app; dataset huggingface.co/datasets/Kimsang766/agentic-ai-instructions-id-en-cleaned.
- Screenshots: 6 from the churn repo (dashboard, high-risk detection, SHAP weights, Grafana, MLflow, Swagger), CiteReady, LolosPCPM, Honey Quality, GrowMate, Hugging Face dataset page, ChatGPT discovery, portfolio workflow. Portraits: formal, everyday, robot experiment, and a cutout. All in public/images as WebP with an 800px variant and sizes in src/data/asset-manifest.json.
- Writing: five on-site notes; one external publication on LinkedIn Pulse.
- Absent, must not be fabricated: testimonials, client names, traffic numbers, model accuracy for CiteReady, LolosPCPM user counts on the site, certificate URLs.

## Product Principles

1. Evidence before adjectives: every section leads with something measured or shipped.
2. Twenty seconds to the point on a phone: role, two proofs, stack, contact.
3. Honesty is part of the craft: illustrative figures are labelled, limitations are stated next to results.
4. Light by default, rich by capability: the same page is fast on a mid-range Android and expressive on a desktop.
5. Everything on the page is his: no borrowed quotes, no category copy, no decorative data.

## Accessibility & Inclusion

Keyboard-reachable controls, visible focus, 4.5:1 body contrast, alt text on every evidence image, reduced-motion renders every figure in its final readable state. English copy for an international recruiter audience; Indonesian visitors are expected.
