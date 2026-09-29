import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type ArticleSection = { title: string; body: string };
type ArticleFlowStep = { label: string; detail: string };
type ArticleSource = { label: string; href: string };
type WritingArticle = {
  id: string;
  number: string;
  title: string;
  date: string;
  dateTime: string;
  read: string;
  category: string;
  filter: string;
  tags: string[];
  description: string;
  premise: string;
  sections: ArticleSection[];
  flow: ArticleFlowStep[];
  metrics: { value: string; label: string }[];
  visual: { image: string; alt: string; caption: string; label: string };
  visuals?: { image: string; alt: string; caption: string; label: string }[];
  code: { language: string; title: string; note: string; snippet: string };
  sources: ArticleSource[];
};

const publishedArticles: WritingArticle[] = [
  {
    id: "ai-portfolio-rebuild",
    number: "05",
    title: "A Free Model, a Different Editor, and Half a Day",
    date: "29 SEP 2026",
    dateTime: "2026-09-29",
    read: "5 MIN",
    category: "DESIGN / AI-ASSISTED BUILD",
    filter: "Product",
    tags: ["AI-assisted", "UI/UX", "React", "Portfolio"],
    description: "A fast portfolio rebuild, five visual notes, and a more useful question than which model wrote the code: what should a visitor do next?",
    premise: "Some people guessed I used Claude Opus 5.5. I used a free AI model with a different editor, and finished the initial rebuild in roughly half a day. The more useful story is what that time went into: making the portfolio easier to navigate, evaluate, and act on.",
    sections: [
      { title: "The tool surprise is the hook, not the method", body: "Some readers assumed the rebuild came from Claude Opus 5.5. It did not: I used a free AI model and a different editor—not Antigravity or Claude Code. I am keeping the editor unnamed because this is not a model-versus-editor contest. AI helped me iterate faster; it did not decide what to show, which links mattered, or when the experience was clear enough to ship." },
      { title: "A fast rebuild still needs a visitor’s path", body: "I treated each page as a decision point, not a screen to decorate. Someone curious can explore projects and open a demo or source; someone assessing my background can find the CV; someone ready to talk can reach the contact links. Those actions give visitors different ways through the portfolio instead of leaving them at a polished dead end." },
      { title: "Design the page like a map, not a poster", body: "The visual hierarchy connects the story, project evidence, and next action. That is spatial design in a web-UX sense: where information sits, how visual weight guides attention, and how nearby actions shorten the path to proof. It describes a two-dimensional information layout—not 3D spatial computing." },
      { title: "Treat AI visibility as an observation, not proof", body: "In one prompt-specific ChatGPT response, my profile appeared first in a generated list of 20 AI Engineer or AI talent profiles in Medan. It was an interesting moment to document, not a stable ranking, endorsement, or controlled SEO result. The screenshot records that one response; it does not establish that the result will repeat for other prompts, people, or dates." },
      { title: "The human pass is what makes a fast build yours", body: "I still had to review the hierarchy, copy, links, project evidence, and the actual next step each button offers. The portfolio links to AI projects; it does not embed an AI agent or a multimodal interface. Being precise about that boundary matters: AI assistance can accelerate implementation, but the product claim still has to match what a visitor can really use." },
    ],
    flow: [
      { label: "Arrive", detail: "Understand who built the portfolio and why" },
      { label: "Explore", detail: "Browse projects and open the work" },
      { label: "Verify", detail: "Check the CV, demos, and source links" },
      { label: "Connect", detail: "Choose email or a professional profile" },
    ],
    metrics: [
      { value: "FREE", label: "AI model used" },
      { value: "≈½ DAY", label: "initial rebuild" },
      { value: "05", label: "visual notes in this story" },
    ],
    visual: {
      image: "/images/ai-portfolio-workflow.png",
      alt: "AI-assisted portfolio workflow: brief, free model and portfolio, human review and design decisions, then deployment",
      caption: "The loop: AI helps generate options; human review decides what is useful and ready to ship.",
      label: "01 / AI ASSISTED · HUMAN DECIDED",
    },
    visuals: [
      {
        image: "/images/ai-portfolio-workflow.png",
        alt: "AI-assisted portfolio workflow: brief, free model and portfolio, human review and design decisions, then deployment",
        caption: "The loop: AI helps generate options; human review decides what is useful and ready to ship.",
        label: "01 / AI ASSISTED · HUMAN DECIDED",
      },
      {
        image: "/images/ai-portfolio-contact-cta.png",
        alt: "Portfolio contact section with a clear invitation, CV link, email, and social links",
        caption: "A useful final step: visitors can open the CV or choose a direct way to get in touch.",
        label: "02 / MAKE CONTACT EASY",
      },
      {
        image: "/images/ai-portfolio-project-discovery.png",
        alt: "Portfolio project section featuring LolosPCPM with demo and repository links",
        caption: "Project discovery should lead to evidence: a demo to try and a repository to inspect.",
        label: "03 / FROM CARD TO PROJECT",
      },
      {
        image: "/images/ai-portfolio-chatgpt-discovery.png",
        alt: "One ChatGPT response showing the portfolio profile first in a generated list of 20 AI talent profiles in Medan",
        caption: "One prompt-specific response placed the profile first in a list of 20. It is an observation—not a ranking guarantee or SEO proof.",
        label: "04 / ONE SEARCH OBSERVATION",
      },
      {
        image: "/images/ai-portfolio-half-day-hero.png",
        alt: "Portfolio rebuild summary highlighting a free AI model, roughly half a day, and a design centered on the visitor’s next click",
        caption: "The constraints are the hook; the visitor’s next click is the product question underneath it.",
        label: "05 / THE BUILD IN ONE FRAME",
      },
    ],
    code: {
      language: "typescript",
      title: "Plan around visitor intent",
      note: "A small UX-planning sketch, not the portfolio's application router. It keeps the next useful action explicit for each visitor intent.",
      snippet: `const visitorPaths = {
  explore: ["projects", "live-demo", "source"],
  evaluate: ["about", "cv"],
  connect: ["email", "linkedin"],
} as const;

// Each path should lead to evidence or a clear next action.
type VisitorIntent = keyof typeof visitorPaths;`,
    },
    sources: [
      { label: "Original article · LinkedIn", href: "https://www.linkedin.com/pulse/people-guessed-i-used-claude-opus-55-free-model-instead-silalahi-fhtff/" },
      { label: "Live portfolio", href: "https://kimsilalahi.vercel.app/" },
    ],
  },
  {
    id: "lolos-pcpm",
    number: "04",
    title: "From a 24-hour build sprint to a product people used",
    date: "07 SEP 2026",
    dateTime: "2026-09-07",
    read: "6 MIN",
    category: "PRODUCT / LOLOSPCPM",
    filter: "Product",
    tags: ["Next.js", "Supabase", "Hugging Face", "Vercel"],
    description: "How a focused sprint turned an exam-prep problem into an AI practice product—and a launch that reached 120+ users.",
    premise: "LolosPCPM began with a practical gap: candidates needed realistic PCPM practice, personalized feedback, and interview simulations. The launch post reports the first 120+ users within three days, with no paid hosting, database, or AI spend.",
    sections: [
      { title: "Start with a problem candidates already feel", body: "PCPM candidates needed more than a static question bank: they wanted relevant practice, a way to see where they were weak, and a realistic space to rehearse interviews. The existing options felt expensive or lacked the interactivity that makes practice useful. I chose one audience and one clear job—help someone prepare for the next selection step—instead of beginning with a broad AI feature list." },
      { title: "Scope the sprint around a complete practice loop", body: "The under-24-hour challenge was to get a real product online, not to finish every future feature. The first experience brought together tryouts, AI Dynamic Drills, a chatbot, strategy practice, and a Bank Indonesia case simulator. A candidate could answer, receive feedback, and decide what to practice next. That loop made the product feel useful before it was polished." },
      { title: "Use a small stack to connect the experience", body: "The launch article describes a Next.js frontend deployed on Vercel, Supabase for application data, and Hugging Face inference for NLP. The public repository adds implementation context around TypeScript, PostgreSQL, Prisma, authentication, and model integrations. Keeping those pieces behind the application lets the interface stay focused on practice instead of exposing provider credentials or infrastructure details." },
      { title: "Ship, share, and listen to the first users", body: "The launch post records a simple organic timeline: one founder on day zero, links shared across LinkedIn, X, Instagram, and search on day one, 67 users by day two, and more than 120 by day three. Those are early launch numbers reported in the post—not a retention study or a promise of continued growth. They were enough to show that the problem resonated beyond the person who built it." },
      { title: "Treat speed as a way to learn", body: "The useful lesson was not that every app should be built in a day. It was that a small, working product creates better feedback than waiting for a perfect plan. Free and open-source services can reduce the cost of a first test, but their quotas and limits still matter. Real users provide the next requirements: improve the questions, make feedback clearer, and keep iterating on the practice loop." },
    ],
    flow: [
      { label: "Candidate", detail: "Practice question or interview prompt" },
      { label: "Next.js · Vercel", detail: "Product UI and application routes" },
      { label: "Supabase + Hugging Face", detail: "Persist progress, request AI feedback" },
      { label: "Practice loop", detail: "Drills, tryouts, analytics, next step" },
    ],
    metrics: [
      { value: "<24h", label: "initial build sprint" },
      { value: "120+", label: "users by day three" },
      { value: "$0", label: "reported launch spend" },
    ],
    visual: {
      image: "/images/LolosPCPM.png",
      alt: "LolosPCPM exam preparation product home screen with tryout, AI drill, chatbot, and case simulator navigation",
      caption: "The product at launch: one place for tryouts, AI drills, chat, and case practice.",
      label: "PRODUCT / LIVE BUILD",
    },
    code: {
      language: "tsx",
      title: "Keep AI calls behind the application route",
      note: "Illustrative client-to-server request pattern; this is not copied verbatim from the repository. Provider credentials belong on the server, never in browser code.",
      snippet: `const response = await fetch("/api/ai/simulate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ mode: "dynamic-drill", answer }),
});

if (!response.ok) {
  throw new Error("The practice session could not be evaluated.");
}

const feedback = await response.json();`,
    },
    sources: [
      { label: "Launch story · LinkedIn", href: "https://www.linkedin.com/pulse/building-ai-web-app-24-hours-getting-120-users-zero-budget-silalahi-8fexc/" },
      { label: "Live product", href: "https://lolos-pcpm-ai.vercel.app/" },
      { label: "Source repository", href: "https://github.com/kim40404/lolos-pcpm-ai" },
    ],
  },
  {
    id: "agentic-data",
    number: "03",
    title: "Synthesizing 1K Agentic AI Data Locally via Ollama",
    date: "12 AUG 2026",
    dateTime: "2026-08-12",
    read: "5 MIN",
    category: "DATA / OPEN SOURCE",
    filter: "Data",
    tags: ["Ollama", "Polars", "Dataset", "ID + EN"],
    description: "A local-first bilingual data workflow: synthesize, validate, clean, and publish useful agentic instructions.",
    premise: "The title describes an approximately 1K-pair project; the currently published cleaned Hugging Face snapshot contains 944 rows across eight task categories. Keeping that live count visible makes the quality step—and the difference between a draft corpus and a released dataset—part of the story.",
    sections: [
      { title: "Generate locally, shape the output", body: "The project explores bilingual agentic instructions without making a paid API the bottleneck. Mistral 7B and Llama 3 run locally through Ollama; task templates shape examples across eight categories and keep the English and Indonesian sides aligned. Local generation controls the iteration loop, while the template—not simply a larger batch—is what helps make examples consistent enough to inspect." },
      { title: "Clean the corpus as a separate stage", body: "Generation and release quality are different jobs. The companion Python pipeline loads the source train split from Hugging Face, converts it to Polars, drops null rows, removes duplicate rows, and runs a validation step before export. Its README records 945 raw rows and 944 cleaned rows. That one-row difference is small, but it makes the quality gate visible instead of claiming every generated example was ready to publish." },
      { title: "Publish a dataset people can inspect", body: "The current cleaned Hub snapshot exposes paired English and Indonesian instructions and outputs, alongside category, difficulty, tool requirement, tool type, and reasoning-step metadata. Those fields make it possible to filter examples by task or capability before reuse. The dataset can support instruction-tuning and bilingual experiments, but it should still be reviewed for task fit and language quality before being treated as a benchmark or production training set." },
    ],
    flow: [
      { label: "Task templates", detail: "Eight agentic task categories" },
      { label: "Ollama · local models", detail: "Mistral 7B + Llama 3; no paid API" },
      { label: "Polars + validation", detail: "Drop nulls, deduplicate, check quality" },
      { label: "Hugging Face Hub", detail: "944 cleaned ID / EN rows" },
    ],
    metrics: [
      { value: "944", label: "cleaned rows live" },
      { value: "08", label: "task categories" },
      { value: "945 → 944", label: "raw → cleaned" },
    ],
    visual: {
      image: "/images/huggingface.avif",
      alt: "Preview image for the bilingual Indonesian and English agentic AI dataset",
      caption: "The public dataset is a cleaned, inspectable snapshot—not just generated text.",
      label: "OPEN DATA / ID · EN",
    },
    code: {
      language: "python",
      title: "Clean, validate, then publish",
      note: "Adapted from the public id-en-data-pipeline repository; the live snapshot currently has 944 rows.",
      snippet: `from datasets import Dataset, load_dataset
import polars as pl
from validator import validate_dataset

source = load_dataset(
    "Kimsang766/agentic-ai-instructions-id-en",
    split="train",
)
frame = pl.from_arrow(source.data.table)
clean = frame.drop_nulls().unique()

if validate_dataset(clean):
    Dataset.from_pandas(clean.to_pandas()).push_to_hub(
        "Kimsang766/agentic-ai-instructions-id-en-cleaned"
    )`,
    },
    sources: [
      { label: "Cleaned dataset · Hugging Face", href: "https://huggingface.co/datasets/Kimsang766/agentic-ai-instructions-id-en-cleaned" },
      { label: "Cleaning pipeline · GitHub", href: "https://github.com/kim40404/id-en-data-pipeline" },
    ],
  },
  {
    id: "aio",
    number: "02",
    title: "The Mechanics of AI Citation Optimization (AIO)",
    date: "20 JUL 2026",
    dateTime: "2026-07-20",
    read: "4 MIN",
    category: "AI SEARCH / CITEREADY",
    filter: "AI & Search",
    tags: ["AIO", "GEO", "CiteReady"],
    description: "Make a page easier for answer engines to parse, verify, and cite—with a workflow that turns a score into specific fixes.",
    premise: "Citation optimization is not a promise to rank in an AI answer. It is a way to make useful claims easier to retrieve and assess: improve the page's technical structure, then make its facts, expertise, and answers clear enough to evaluate.",
    sections: [
      { title: "Start with a crawlable page", body: "CiteReady begins with a public URL that its auditor can fetch. The technical pass looks at the page's visible structure—headings, metadata, and JSON-LD—because semantic quality does not matter if a system cannot find or parse the relevant content. This is a baseline check, not a substitute for search-engine indexing diagnostics or an assurance that an answer engine has crawled the page." },
      { title: "Make semantic quality inspectable", body: "The product rubric looks at authority, fact density, and clarity. Authority asks whether expertise and claims have credible support; fact density asks whether a page contains specific, useful evidence; clarity asks whether the answer is direct and easy to understand. These are editorial signals, not a secret formula used by ChatGPT or Perplexity, and improving them cannot guarantee a citation." },
      { title: "Turn the audit into the next edit", body: "CiteReady combines technical checks with semantic feedback in a blended GEO report and prioritizes possible fixes. The useful output is not the score by itself: it is a finding tied to evidence on the page, followed by a concrete edit a writer can make. That keeps the tool in its proper role—as an audit aid for clearer, more verifiable content, not a promise of visibility." },
    ],
    flow: [
      { label: "Public page URL", detail: "Fetch content the auditor can access" },
      { label: "Technical scan", detail: "Headings, metadata, JSON-LD" },
      { label: "Semantic review", detail: "Authority, fact density, clarity" },
      { label: "GEO report", detail: "Blended score + priority fixes" },
    ],
    metrics: [
      { value: "03", label: "semantic pillars" },
      { value: "01", label: "technical audit" },
      { value: "0", label: "ranking guarantees" },
    ],
    visual: {
      image: "/images/citeready.png",
      alt: "CiteReady landing page prompting the user to analyze a public page for AI search visibility",
      caption: "The audit starts with a public URL, then returns a visibility score and actionable recommendations.",
      label: "CITEREADY / AUDIT ENTRY",
    },
    code: {
      language: "typescript",
      title: "A readable audit rubric",
      note: "Editorial sketch based on CiteReady's documented checks; it illustrates the report shape, not the private scoring implementation or model prompt.",
      snippet: `const auditRubric = {
  technical: ["headings", "metadata", "json-ld"],
  semantic: ["authority", "fact_density", "clarity"],
  report: ["blended_geo_score", "evidence", "priority_fixes"],
} as const;

// Keep each recommendation tied to evidence on the page.
type Finding = {
  pillar: (typeof auditRubric.semantic)[number];
  evidence: string;
  nextEdit: string;
};`,
    },
    sources: [
      { label: "CiteReady · live auditor", href: "https://cite-ready.vercel.app/" },
      { label: "Product & architecture · GitHub", href: "https://github.com/kim40404/CiteReady" },
    ],
  },
  {
    id: "mlops",
    number: "01",
    title: "Designing Production-Ready MLOps with Grafana & Prometheus",
    date: "05 JUN 2026",
    dateTime: "2026-06-05",
    read: "6 MIN",
    category: "SYSTEMS / MLOPS",
    filter: "MLOps",
    tags: ["XGBoost", "FastAPI", "MLflow", "SHAP"],
    description: "From churn training to an explainable prediction API—with model lifecycle, telemetry, and drift signals in the design.",
    premise: "A churn model becomes a system when training, serving, explanation, and operations meet. This build uses XGBoost with SMOTE, tracks experiments in MLflow, serves predictions through FastAPI in Docker, and exposes operational signals to Prometheus and Grafana.",
    sections: [
      { title: "Train for the problem, not just the score", body: "The pipeline starts with the IBM Telco Customer Churn dataset: 7,043 customer profiles, with a minority churn class of roughly 26%. SMOTE addresses that imbalance during training before XGBoost learns the churn signal. A separate Cox proportional-hazards model estimates remaining tenure, connecting a classification result to a business question: how much time may be left to retain this customer?" },
      { title: "Keep the model lifecycle reproducible", body: "MLflow tracks experiment parameters, evaluation metrics, and model artifacts so a trained version can be identified and reused. The inference path is separated from notebook experimentation: a FastAPI /predict route loads the model, while Docker Compose packages the API, dashboard, and supporting services. That separation makes the boundary between an experiment and a callable service explicit." },
      { title: "Observe predictions and explain them", body: "Prometheus scrapes service telemetry for Grafana dashboards, including request activity and latency; the article also calls out confidence and feature-distribution drift as operational signals. In the executive interface, SHAP impact helps explain which input features drove a prediction instead of presenting a probability as a black box. A p10 confidence threshold of 0.55 is one example in the article, not a universal alert setting." },
    ],
    flow: [
      { label: "Telco data + SMOTE", detail: "Preprocess imbalanced churn records" },
      { label: "XGBoost + MLflow", detail: "Train, track, register artifacts" },
      { label: "Docker + FastAPI", detail: "Serve /predict to the dashboard" },
      { label: "Prometheus + Grafana", detail: "Watch telemetry, drift, and alerts" },
    ],
    metrics: [
      { value: "7,043", label: "customer rows" },
      { value: "60s", label: "scrape interval" },
      { value: "SHAP", label: "prediction explanation" },
    ],
    visual: {
      image: "/images/mlops-dashboard.png",
      alt: "Dark customer retention dashboard with churn risk, estimated revenue loss, and SHAP impact panels",
      caption: "The executive view pairs a prediction with revenue context and feature-level explanations.",
      label: "INFERENCE / EXPLAINABILITY",
    },
    code: {
      language: "python",
      title: "Instrument the prediction path",
      note: "Illustrative Prometheus instrumentation for the documented FastAPI /metrics and /predict architecture; names and thresholds should be aligned with the deployed service.",
      snippet: `from prometheus_client import Counter, Histogram, make_asgi_app

app.mount("/metrics", make_asgi_app())
predictions = Counter("ml_predictions_total", "Predictions served")
latency = Histogram("ml_predict_seconds", "Prediction latency")

@app.post("/predict")
def predict(payload: CustomerFeatures):
    with latency.time():
        result = run_inference(payload)
    predictions.inc()
    return result`,
    },
    sources: [
      { label: "Build article · DEV", href: "https://dev.to/kim40404/from-jupyter-notebook-to-production-building-an-enterprise-mlops-pipeline-for-churn-prediction-jk3" },
      { label: "Project notes · LinkedIn", href: "https://www.linkedin.com/pulse/data-scientist-backend-mlops-engineer-kimsang-silalahi-gi1kc/" },
      { label: "Full pipeline · GitHub", href: "https://github.com/kim40404/mlops-churn-dicoding" },
    ],
  },
];

const writingFilters = ["All notes", "AI & Search", "MLOps", "Data", "Product"];

const upcomingArticles = [
  {
    number: "06",
    label: "AI SEARCH / PERSONAL BRAND",
    title: "From one ChatGPT answer to a repeatable visibility test",
    note: "Turn a single prompt-specific observation into a documented experiment across prompts and dates—not a ranking guarantee.",
  },
  {
    number: "07",
    label: "FIELD NOTES / AI ENGINEERING",
    title: "The less glamorous parts of being an AI engineer",
    note: "A practical look at the data, evaluation, debugging, and product work around the model itself.",
  },
];

function ArrowUpRight({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 16 4M7 4h9v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ArticleVisuals({ article }: { article: WritingArticle }) {
  const visuals = article.visuals ?? [article.visual];

  return (
    <div className={`writing-visual-stack ${article.visuals ? "writing-visual-gallery" : ""}`}>
      {visuals.map((visual) => (
        <figure className={`writing-visual-card writing-visual-${article.id}`} key={visual.image}>
          <div className="writing-visual-frame">
            <img src={visual.image} alt={visual.alt} loading="lazy" />
            <span className="writing-visual-label">{visual.label}</span>
          </div>
          <figcaption>{visual.caption}</figcaption>
        </figure>
      ))}

      {article.id === "lolos-pcpm" && (
        <>
        <div className="writing-product-visuals">
          <section className="writing-stack-graphic" aria-label="LolosPCPM technology stack">
            <div className="writing-graphic-topline"><span>STACK / LAUNCH BUILD</span><span>01—04</span></div>
            <div className="writing-stack-layers">
              <div><span>01 / PRODUCT</span><strong>Next.js · TypeScript</strong><small>Tryouts · drills · interview practice</small></div>
              <div><span>02 / DATA</span><strong>Supabase · PostgreSQL</strong><small>Application records and practice progress</small></div>
              <div><span>03 / AI</span><strong>Hugging Face inference</strong><small>Language feedback for practice flows</small></div>
              <div><span>04 / DEPLOY</span><strong>Vercel</strong><small>Ship the web app on a free tier</small></div>
            </div>
          </section>
          <section className="writing-growth-graphic" aria-label="Organic product adoption reported in the launch article">
            <div className="writing-graphic-topline"><span>ORGANIC LAUNCH / LINKEDIN REPORT</span><span>DAY 00—03</span></div>
            <div className="writing-growth-timeline">
              <div><span>DAY 00</span><strong>01</strong><small>Founder tests the launch</small></div>
              <div><span>DAY 01</span><strong>SHARE</strong><small>LinkedIn · X · Instagram · SEO</small></div>
              <div><span>DAY 02</span><strong>67</strong><small>Users reported</small></div>
              <div><span>DAY 03</span><strong>120+</strong><small>Users reported</small></div>
            </div>
            <p>Early organic validation, not a forecast of future growth.</p>
          </section>
        </div>
        <section className="writing-dashboard-graphic" aria-label="Recreated LolosPCPM analytics dashboard visual">
          <div className="writing-graphic-topline"><span>PRODUCT ANALYTICS / SAMPLE VIEW</span><span>ALL TIME</span></div>
          <div className="writing-dashboard-score-row">
            <div className="writing-dashboard-score"><span>🎯 AKURASI KESELURUHAN TPD</span><strong>78%</strong><small>Sample dashboard state</small></div>
            <div className="writing-dashboard-benchmark"><span>BENCHMARK AVERAGE <strong>80</strong></span><div><i /></div><small>78 score · 80 target</small></div>
          </div>
          <div className="writing-dashboard-peers">
            <div><span>🏆 Top 10% peserta</span><strong>92</strong></div>
            <div><span>👥 Rata-rata peserta</span><strong>75</strong></div>
            <div><span>✅ Batas lulus aman</span><strong>80</strong></div>
          </div>
          <div className="writing-dashboard-scale"><span>PERFORMANCE BENCHMARK</span><div><i /></div><p><span>0</span><span>60</span><span>75</span><span>85+</span></p></div>
          <div className="writing-dashboard-foot"><span>PACE / 47s per question</span><span>QUESTIONS / 93</span></div>
          <p>Recreated from the dashboard visual shared with the brief; values describe the shown sample state, not a cohort-wide study.</p>
        </section>
        </>
      )}

      {article.id === "agentic-data" && (
        <section className="writing-data-visual" aria-label="Bilingual dataset schema and quality snapshot">
          <div className="writing-graphic-topline"><span>DATASET / ROW SHAPE</span><span>944 CLEAN ROWS</span></div>
          <div className="writing-data-pair"><span>EN · instruction</span><i>↔</i><span>ID · instruction_id</span></div>
          <div className="writing-data-pair"><span>EN · output</span><i>↔</i><span>ID · output_id</span></div>
          <div className="writing-data-fields"><span>category</span><span>difficulty</span><span>requires_tool</span><span>tool_type</span><span>reasoning_steps</span></div>
          <p>Eight categories · train split · bilingual examples with tool-use metadata.</p>
        </section>
      )}

      {article.id === "aio" && (
        <section className="writing-aio-visual" aria-label="CiteReady audit architecture">
          <div className="writing-graphic-topline"><span>CITEREADY / AUDIT MAP</span><span>URL → ACTION</span></div>
          <div className="writing-aio-input"><span>INPUT</span><strong>Public page URL</strong></div>
          <div className="writing-aio-pillars">
            <article><span>01 / TECHNICAL</span><strong>Page structure</strong><small>H1 · metadata · JSON-LD</small></article>
            <article><span>02 / SEMANTIC</span><strong>Authority</strong><small>Expertise and source signals</small></article>
            <article><span>03 / SEMANTIC</span><strong>Fact density</strong><small>Specific, useful evidence</small></article>
            <article><span>04 / SEMANTIC</span><strong>Clarity</strong><small>Direct answers to real questions</small></article>
          </div>
          <div className="writing-aio-output"><strong>Blended GEO report</strong><span>Evidence · score · priority edits</span></div>
        </section>
      )}

      {article.id === "mlops" && (
        <section className="writing-mlops-visual" aria-label="MLOps production concerns">
          <div className="writing-graphic-topline"><span>PRODUCTION / THREE LENSES</span><span>MODEL → SERVICE → SIGNAL</span></div>
          <div className="writing-mlops-lenses">
            <div><span>01 / MODEL</span><strong>XGBoost + SMOTE</strong><small>Experiment and version with MLflow</small></div>
            <div><span>02 / EXPLAIN</span><strong>SHAP + CoxPH</strong><small>Feature impact and remaining-tenure signal</small></div>
            <div><span>03 / OPERATE</span><strong>Prometheus + Grafana</strong><small>Latency · traffic · confidence drift</small></div>
          </div>
        </section>
      )}
    </div>
  );
}

function ArticleCodeSample({ code }: { code: WritingArticle["code"] }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(code.snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="writing-code-card">
      <div className="writing-code-heading"><div><span>{code.language} / EXCERPT</span><h4>{code.title}</h4></div><button type="button" onClick={() => void copyCode()}>{copied ? "Copied" : "Copy code"}</button></div>
      <pre><code>{code.snippet}</code></pre>
      <p>{code.note}</p>
    </div>
  );
}

function WritingToolkitContact() {
  return (
    <footer className="contact-section section-shell">
      <p className="section-kicker">Contact</p>
      <div className="contact-main">
        <h2>Let’s build something useful.</h2>
        <a className="contact-email" href="mailto:kimsilalahi@gmail.com">kimsilalahi@gmail.com <ArrowUpRight /></a>
      </div>
      <div className="footer-bottom"><span>Kimsang Silalahi · Medan, Indonesia</span><a href="https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a></div>
    </footer>
  );
}

export function WritingPage() {
  const [activeFilter, setActiveFilter] = useState("All notes");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(publishedArticles[0].id);
  const reducedMotion = useReducedMotion();
  const detailTransition = reducedMotion ? { duration: 0 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.isContentEditable) return;
      if (target instanceof Element && target.closest("input, textarea, select, button, a, [role]")) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const visibleArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return publishedArticles.filter((article) => {
      const matchesFilter = activeFilter === "All notes" || article.filter === activeFilter;
      const searchText = `${article.title} ${article.description} ${article.category} ${article.tags.join(" ")}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || searchText.includes(normalizedQuery));
    });
  }, [activeFilter, query]);

  const selectedArticle = visibleArticles.find((article) => article.id === selectedArticleId) ?? null;
  const totalReadMinutes = publishedArticles.reduce((total, article) => total + Number.parseInt(article.read, 10), 0);

  return (
    <main className="page-main writing-page">
      <section className="page-hero section-shell writing-hero" aria-labelledby="writing-title">
        <div className="writing-hero-copy">
          <p className="section-kicker">Writing / Field dispatches</p>
          <h1 id="writing-title">Work, thought<br /><em>through.</em></h1>
          <p>Build notes about AI, data, and systems—written from the decisions behind the shipped work.</p>
          <div className="writing-hero-stats" aria-label="Writing archive statistics">
            <div><strong>{String(publishedArticles.length).padStart(2, "0")}</strong><span>published notes</span></div>
            <div><strong>{totalReadMinutes}<span>m</span></strong><span>total reading time</span></div>
            <div><strong>{String(upcomingArticles.length).padStart(2, "0")}</strong><span>ideas in progress</span></div>
          </div>
        </div>
        <div className="writing-hero-art" aria-label="A visual summary of the writing process">
          <div className="writing-art-top"><span>FIELD LOG / 2026</span><span>01—05</span></div>
          <div className="writing-art-orbit writing-art-orbit-outer" aria-hidden="true" />
          <div className="writing-art-orbit writing-art-orbit-inner" aria-hidden="true" />
          <span className="writing-art-stamp">IDEA<br />→<br />SYSTEM</span>
          <div className="writing-art-sequence" aria-hidden="true">
            <span>OBSERVE</span><i />
            <span>BUILD</span><i />
            <span>MEASURE</span>
          </div>
          <div className="writing-art-foot"><span>NOT THEORY ALONE</span><span>MEDAN / ID</span></div>
        </div>
      </section>

      <section className="writing-archive section-shell" aria-labelledby="writing-archive-title">
        <div className="writing-archive-heading">
          <div>
            <p className="section-kicker">The archive / 01—05</p>
            <h2 id="writing-archive-title">Ideas with a build log.</h2>
          </div>
          <p>Open a field note for its visuals, system map, code excerpt, and source links.</p>
        </div>

        <div className="writing-controls">
          <div className="writing-filters" role="group" aria-label="Filter writing by topic">
            {writingFilters.map((filter) => (
              <button className={`writing-filter ${activeFilter === filter ? "is-active" : ""}`} key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => { setActiveFilter(filter); setSelectedArticleId(null); }}>
                {filter}
              </button>
            ))}
          </div>
          <label className="writing-search">
            <span className="visually-hidden">Search writing</span>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.4" /><path d="m13.2 13.2 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            <input ref={searchRef} type="search" value={query} placeholder="Search the notes" onChange={(event) => { setQuery(event.target.value); setSelectedArticleId(null); }} />
            <span className="writing-search-key">/</span>
          </label>
        </div>

        <div className="writing-card-grid" aria-live="polite">
          {visibleArticles.length > 0 ? visibleArticles.map((article, index) => {
            const isSelected = article.id === selectedArticleId;
            return (
              <motion.article layout key={article.id} className={`writing-card ${index === 0 && activeFilter === "All notes" && !query ? "is-featured" : ""} ${isSelected ? "is-selected" : ""}`} transition={detailTransition}>
                <div className="writing-card-topline"><span className="writing-card-number">{article.number} / {String(publishedArticles.length).padStart(2, "0")}</span><span className="writing-card-category">{article.category}</span></div>
                <button className="writing-card-trigger" type="button" aria-expanded={isSelected} aria-controls="writing-article-detail" onClick={() => setSelectedArticleId(isSelected ? null : article.id)}>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <span className="writing-card-tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</span>
                  <span className="writing-card-open">{isSelected ? "Close field note" : "Open field note"}<span aria-hidden="true">{isSelected ? "−" : "+"}</span></span>
                </button>
                <div className="writing-card-bottom"><time dateTime={article.dateTime}>{article.date}</time><span>{article.read}</span><span className="writing-card-mark" aria-hidden="true">↗</span></div>
                {index === 0 && activeFilter === "All notes" && !query && <div className="writing-card-signal" aria-hidden="true">{article.id === "ai-portfolio-rebuild" ? <><span>FREE AI MODEL</span><i /><span>≈ HALF-DAY REBUILD</span><i /><span>DESIGNED FOR THE NEXT CLICK</span></> : <><span>BUILT IN &lt;24H</span><i /><span>120+ USERS</span><i /><span>ZERO PAID SPEND</span></>}</div>}
              </motion.article>
            );
          }) : (
            <div className="writing-empty"><span>NO MATCH / 00</span><p>No notes match that search. Try another topic or phrase.</p></div>
          )}
        </div>

        <AnimatePresence initial={false} mode="wait">
          {selectedArticle && (
            <motion.article key={selectedArticle.id} id="writing-article-detail" className="writing-detail" initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }} transition={detailTransition}>
              <div className="writing-detail-head">
                <div><span className="writing-detail-index">FIELD NOTE / {selectedArticle.number}</span><span className="writing-detail-topic">{selectedArticle.category}</span></div>
                <button className="writing-detail-close" type="button" aria-label="Close article preview" onClick={() => setSelectedArticleId(null)}>×</button>
              </div>
              <div className="writing-detail-layout">
                <nav className="writing-toc" aria-label="On this page">
                  <span>On this page</span>
                  <a href="#writing-context">The question</a>
                  <a href="#writing-argument">The argument</a>
                  <a href="#writing-visuals">Visual notes</a>
                  <a href="#writing-flow">System map</a>
                  <a href="#writing-code">Code</a>
                  <a href="#writing-outcome">Sources</a>
                </nav>
                <div className="writing-detail-content">
                  <section className="writing-detail-section" id="writing-context">
                    <p className="writing-detail-kicker">THE QUESTION / 01</p>
                    <h3>{selectedArticle.premise}</h3>
                    <div className="writing-metrics">
                      {selectedArticle.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
                    </div>
                  </section>
                  <section className="writing-detail-section" id="writing-argument">
                    <p className="writing-detail-kicker">READING MAP / 02</p>
                    <h3>The decisions behind the build.</h3>
                    <div className="writing-outline">
                      {selectedArticle.sections.map((section, index) => (
                        <article className="writing-outline-row" key={section.title}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <div><h4>{section.title}</h4><p>{section.body}</p></div>
                        </article>
                      ))}
                    </div>
                  </section>
                  <section className="writing-detail-section" id="writing-visuals">
                    <p className="writing-detail-kicker">VISUAL NOTES / 03</p>
                    <h3>{selectedArticle.visuals ? "Five moments from the visitor journey." : selectedArticle.visual.label}</h3>
                    <ArticleVisuals article={selectedArticle} />
                  </section>
                  <section className="writing-detail-section" id="writing-flow">
                    <p className="writing-detail-kicker">SYSTEM MAP / 04</p>
                    <h3>From input to useful output.</h3>
                    <div className="writing-flow" aria-label={`${selectedArticle.title} system flow`}>
                      {selectedArticle.flow.map((step, index) => (
                        <div className="writing-flow-step" key={step.label}>
                          <span className="writing-flow-index">0{index + 1}</span>
                          <strong>{step.label}</strong>
                          <span>{step.detail}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="writing-detail-section" id="writing-code">
                    <p className="writing-detail-kicker">IMPLEMENTATION / 05</p>
                    <h3>A small, useful piece of the build.</h3>
                    <ArticleCodeSample code={selectedArticle.code} />
                  </section>
                  <section className="writing-detail-outcome" id="writing-outcome">
                    <div><span className="writing-detail-kicker">SOURCES / 06</span><p>Open the product, original post, or repository behind this field note.</p>
                      <div className="writing-source-list">{selectedArticle.sources.map((source) => <a className="writing-read-link" key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label} <ArrowUpRight /></a>)}</div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </section>

      <section className="writing-next section-shell" aria-labelledby="writing-next-title">
        <div className="writing-next-heading"><div><p className="section-kicker">Next / In the workbench</p><h2 id="writing-next-title">More field notes<br />are taking shape.</h2></div><span>02 DRAFTS<br />NO PROMISES, JUST PROGRESS</span></div>
        <div className="writing-next-grid">
          {upcomingArticles.map((article) => (
            <article className="writing-next-card" key={article.number}>
              <div><span>{article.number}</span><span>{article.label}</span></div>
              <h3>{article.title}</h3>
              <p>{article.note}</p>
              <span className="writing-draft-status"><i /> Draft / planned</span>
            </article>
          ))}
        </div>
      </section>
      <WritingToolkitContact />
    </main>
  );
}

type ToolGroup = { id: string; name: string; number: string; layer: string; note: string; items: string[] };
type ToolFlow = { id: string; label: string; title: string; description: string; steps: { label: string; detail: string; tool?: string }[] };

const toolGroups: ToolGroup[] = [
  { id: "ai", name: "AI / machine learning", number: "01", layer: "AI / ML", note: "Models, retrieval, and data work", items: ["Claude API", "OpenAI API", "LangChain", "PyTorch", "scikit-learn", "Hugging Face", "Ollama", "LLM Notebook", "K-NN"] },
  { id: "web", name: "Web / backend", number: "02", layer: "Product", note: "Interfaces, services, and storage", items: ["Python", "FastAPI", "Next.js", "React", "PHP 8.2", "CodeIgniter 4", "PostgreSQL", "Firebase", "Supabase", "Streamlit", "Vercel"] },
  { id: "ops", name: "MLOps / cloud", number: "03", layer: "MLOps", note: "Shipping, observing, and iterating", items: ["MLflow", "Docker", "Prometheus", "Grafana", "AWS", "Git", "GitHub"] },
  { id: "workspace", name: "Editors / workspace", number: "04", layer: "Product", note: "The day-to-day build environment", items: ["Zed Editor", "VS Code", "Antigravity"] },
  { id: "automation", name: "Automation / platforms", number: "05", layer: "Automation", note: "Workflow and platform building blocks", items: ["n8n", "ManyChat", "Xendit", "Web3 APIs", "Lua", "Roblox Studio"] },
  { id: "embedded", name: "Embedded / IoT software", number: "06", layer: "Embedded", note: "Software at the edge", items: ["C++"] },
  { id: "device", name: "Microcontroller", number: "07", layer: "Hardware", note: "The edge device in the sensor project", items: ["ESP32"] },
  { id: "sensors", name: "Sensors / physical inputs", number: "08", layer: "Hardware", note: "Signals used in the honey-quality project", items: ["DHT22", "pH sensor", "MQ-135", "TDS sensor", "LDR"] },
  { id: "machine", name: "Daily machine", number: "09", layer: "Hardware", note: "The computer I build on", items: ["ASUS TUF Gaming A16"] },
];

const toolkitFilters = ["Everything", "AI / ML", "Product", "MLOps", "Automation", "Embedded", "Hardware"];

const toolNotes: Record<string, { role: string; projects: string[] }> = {
  "OpenAI API": { role: "Powers the content audit and rewrite workflow in CiteReady.", projects: ["CiteReady"] },
  Python: { role: "Used across data generation and the churn-model training and serving workflow.", projects: ["Bilingual Agentic AI Dataset", "MLOps Churn Prediction"] },
  "FastAPI": { role: "Serves the churn model through a /predict endpoint and exposes metrics for monitoring.", projects: ["MLOps Churn Prediction"] },
  "Next.js": { role: "Used to build the product interfaces for CiteReady and LolosPCPM.", projects: ["CiteReady", "LolosPCPM"] },
  React: { role: "The interface layer for this portfolio and other interactive web work.", projects: ["This portfolio"] },
  "CodeIgniter 4": { role: "Used with PHP to build a government document-automation tool.", projects: ["Ministry document automation"] },
  Firebase: { role: "Receives sensor readings for the honey-quality classification workflow.", projects: ["IoT Honey Quality Monitoring"] },
  "Supabase": { role: "The application data layer used by LolosPCPM.", projects: ["LolosPCPM"] },
  "Vercel": { role: "Hosts the LolosPCPM web app and deploys product-facing Next.js interfaces.", projects: ["LolosPCPM", "CiteReady"] },
  "Hugging Face": { role: "Hosts the cleaned bilingual agentic dataset (944 rows in the current snapshot) and provides inference for LolosPCPM.", projects: ["Bilingual Agentic AI Dataset", "LolosPCPM"] },
  Ollama: { role: "Runs Mistral 7B and Llama 3 locally for data synthesis without paid API calls.", projects: ["Bilingual Agentic AI Dataset"] },
  "MLflow": { role: "Tracks experiments and keeps the churn model registered and versioned.", projects: ["MLOps Churn Prediction"] },
  Docker: { role: "Packages the model pipeline from training through inference.", projects: ["MLOps Churn Prediction"] },
  Prometheus: { role: "Scrapes inference metrics on a 60-second interval for production monitoring.", projects: ["MLOps Churn Prediction"] },
  Grafana: { role: "Surfaces confidence and drift signals and supports alerting.", projects: ["MLOps Churn Prediction"] },
  "C++": { role: "Used in the ESP32-based sensor and honey-quality project.", projects: ["IoT Honey Quality Monitoring"] },
  ESP32: { role: "Reads the five sensor inputs used in the honey-quality monitor.", projects: ["IoT Honey Quality Monitoring"] },
  "K-NN": { role: "Classifies the honey-quality readings from the sensor pipeline.", projects: ["IoT Honey Quality Monitoring"] },
  "DHT22": { role: "Temperature and humidity input to the honey-quality monitor.", projects: ["IoT Honey Quality Monitoring"] },
  "pH sensor": { role: "Acidity input used by the honey-quality classifier.", projects: ["IoT Honey Quality Monitoring"] },
  "MQ-135": { role: "Air-quality / gas sensor input in the five-sensor setup.", projects: ["IoT Honey Quality Monitoring"] },
  "TDS sensor": { role: "Total dissolved solids input for the honey-quality workflow.", projects: ["IoT Honey Quality Monitoring"] },
  LDR: { role: "Light-level input in the honey-quality sensor set.", projects: ["IoT Honey Quality Monitoring"] },
  "ASUS TUF Gaming A16": { role: "My daily machine for building, testing, and running local development tools.", projects: ["Daily workstation"] },
};

const toolFlows: ToolFlow[] = [
  {
    id: "dataset",
    label: "LOCAL DATA",
    title: "Generate → validate → publish",
    description: "A local-first loop for building bilingual agentic training data.",
    steps: [
      { label: "Task templates", detail: "Eight categories", tool: "Ollama" },
      { label: "Local generation", detail: "Mistral 7B + Llama 3", tool: "Ollama" },
      { label: "Validate + clean", detail: "Keep useful pairs", tool: "Python" },
      { label: "Publish", detail: "944 cleaned ID / EN rows", tool: "Hugging Face" },
    ],
  },
  {
    id: "mlops",
    label: "MODEL OPS",
    title: "Serve → observe → respond",
    description: "An observable path around a live churn model, not just a training notebook.",
    steps: [
      { label: "Inference API", detail: "FastAPI /predict", tool: "FastAPI" },
      { label: "Model lifecycle", detail: "Registered + versioned", tool: "MLflow" },
      { label: "Metrics", detail: "60-second scrape", tool: "Prometheus" },
      { label: "Drift response", detail: "Confidence + feature alerts", tool: "Grafana" },
    ],
  },
  {
    id: "iot",
    label: "EDGE / IOT",
    title: "Sense → classify → inform",
    description: "Five physical inputs become a honey-quality classification workflow.",
    steps: [
      { label: "Sensor readings", detail: "DHT22 · pH · MQ-135 · TDS · LDR", tool: "DHT22" },
      { label: "Edge device", detail: "Read and forward inputs", tool: "ESP32" },
      { label: "Data layer", detail: "Store readings", tool: "Firebase" },
      { label: "Classification", detail: "K-NN quality result", tool: "K-NN" },
    ],
  },
  {
    id: "product",
    label: "AI PRODUCT",
    title: "Prototype → connect → launch → learn",
    description: "The product path behind LolosPCPM, from practice interface to user feedback.",
    steps: [
      { label: "Product UI", detail: "App routes and practice flows", tool: "Next.js" },
      { label: "Deployment", detail: "Ship the web app", tool: "Vercel" },
      { label: "Application data", detail: "Persist accounts and progress", tool: "Supabase" },
      { label: "AI feedback", detail: "Language inference for drills", tool: "Hugging Face" },
    ],
  },
];

function getToolGroup(tool: string) {
  return toolGroups.find((group) => group.items.includes(tool));
}

export function ToolkitPage() {
  const [activeFilter, setActiveFilter] = useState("Everything");
  const [query, setQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState("FastAPI");
  const [activeFlowId, setActiveFlowId] = useState("mlops");
  const reducedMotion = useReducedMotion();
  const visibleGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return toolGroups.map((group) => ({
      ...group,
      visibleItems: group.items.filter((tool) => {
        const matchesFilter = activeFilter === "Everything" || group.layer === activeFilter;
        const matchesQuery = !normalizedQuery || `${tool} ${group.name} ${group.note}`.toLowerCase().includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      }),
    })).filter((group) => group.visibleItems.length > 0);
  }, [activeFilter, query]);
  const activeFlow = toolFlows.find((flow) => flow.id === activeFlowId) ?? toolFlows[0];
  const selectedGroup = getToolGroup(selectedTool);
  const selectedNote = toolNotes[selectedTool] ?? {
    role: "Part of the broader working toolkit. I add project-specific notes as the tool earns its place in a build.",
    projects: [],
  };
  const softwareCount = toolGroups.filter((group) => group.layer !== "Hardware").reduce((sum, group) => sum + group.items.length, 0);
  const hardwareCount = toolGroups.filter((group) => group.layer === "Hardware").reduce((sum, group) => sum + group.items.length, 0);
  const toolTransition = reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <main className="page-main toolkit-page toolkit-experience">
      <section className="page-hero section-shell toolkit-hero" aria-labelledby="toolkit-title">
        <div className="toolkit-hero-copy">
          <p className="section-kicker">Toolkit / The working stack</p>
          <h1 id="toolkit-title">Tools that turn<br />ideas into <em>systems.</em></h1>
          <p>A practical stack across AI, product engineering, and operations—shown through the work it helps ship.</p>
          <div className="toolkit-hero-stats">
            <div><strong>{String(softwareCount).padStart(2, "0")}</strong><span>software tools</span></div>
            <div><strong>{String(hardwareCount).padStart(2, "0")}</strong><span>devices + sensors</span></div>
            <div><strong>{String(toolFlows.length).padStart(2, "0")}</strong><span>system maps</span></div>
          </div>
        </div>
        <div className="toolkit-hero-art" aria-hidden="true">
          <div className="toolkit-art-head"><span>STACK / ACTIVE</span><span>MEDAN, ID</span></div>
          <div className="toolkit-art-axis"><span>01</span><i /><span>02</span><i /><span>03</span><i /><span>04</span></div>
          <div className="toolkit-art-block toolkit-art-block-model"><span>MODEL</span><strong>AI + DATA</strong><small>generate / retrieve</small></div>
          <div className="toolkit-art-block toolkit-art-block-service"><span>SERVICE</span><strong>BUILD</strong><small>product / API</small></div>
          <div className="toolkit-art-block toolkit-art-block-ops"><span>RUNTIME</span><strong>OBSERVE</strong><small>metrics / feedback</small></div>
          <div className="toolkit-art-foot"><span>TOOLS ARE CONTEXT</span><span>NOT THE OUTCOME</span></div>
        </div>
      </section>

      <section className="toolkit-workbench section-shell" aria-labelledby="toolkit-workbench-title">
        <div className="toolkit-section-heading">
          <div><p className="section-kicker">Interactive systems / 01—04</p><h2 id="toolkit-workbench-title">Follow a tool<br />through the work.</h2></div>
          <p>Select a workflow, then choose a node to inspect what the tool does in that system.</p>
        </div>
        <div className="toolkit-workbench-panel">
          <div className="toolkit-flow-area">
            <div className="toolkit-flow-topline"><span>WORKFLOW MAP</span><span>{activeFlow.id.toUpperCase()} / 0{toolFlows.findIndex((flow) => flow.id === activeFlow.id) + 1}</span></div>
            <div className="toolkit-flow-tabs" role="group" aria-label="Choose a system workflow">
              {toolFlows.map((flow) => (
                <button className={activeFlowId === flow.id ? "is-active" : ""} key={flow.id} type="button" aria-pressed={activeFlowId === flow.id} onClick={() => {
                  setActiveFlowId(flow.id);
                  const firstTool = flow.steps.find((step) => step.tool)?.tool;
                  if (firstTool) setSelectedTool(firstTool);
                }}>{flow.label}</button>
              ))}
            </div>
            <div className="toolkit-flow-caption"><h3>{activeFlow.title}</h3><p>{activeFlow.description}</p></div>
            <div className="toolkit-flow-steps" aria-label={`${activeFlow.title} stages`}>
              {activeFlow.steps.map((step, index) => (
                <div className="toolkit-flow-step" key={`${activeFlow.id}-${step.label}`}>
                  <span className="toolkit-flow-step-number">0{index + 1} / {step.tool ? "TOOL" : "INPUT"}</span>
                  <button className={selectedTool === step.tool ? "is-selected" : ""} type="button" disabled={!step.tool} aria-pressed={selectedTool === step.tool} onClick={() => step.tool && setSelectedTool(step.tool)}>
                    <strong>{step.label}</strong><span>{step.detail}</span>
                  </button>
                </div>
              ))}
            </div>
            <p className="toolkit-flow-hint"><span>↖</span> Select a tool node to update the inspector</p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.aside key={selectedTool} className="toolkit-inspector" aria-live="polite" initial={{ opacity: 0, x: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducedMotion ? 0 : -8 }} transition={toolTransition}>
              <div className="toolkit-inspector-top"><span>TOOL / INSPECTOR</span><span>{selectedGroup?.number ?? "—"}</span></div>
              <p className="toolkit-inspector-layer">{selectedGroup?.name ?? "Working stack"}</p>
              <h3>{selectedTool}</h3>
              <p className="toolkit-inspector-role">{selectedNote.role}</p>
              {selectedNote.projects.length > 0 ? (
                <div className="toolkit-used-in"><span>IN THE WORK</span><div>{selectedNote.projects.map((project) => <span key={project}>{project}</span>)}</div></div>
              ) : <p className="toolkit-not-documented">Project-specific usage notes are being added as this stack evolves.</p>}
              <div className="toolkit-inspector-footer"><span>SELECT A DIFFERENT NODE</span><span aria-hidden="true">↘</span></div>
            </motion.aside>
          </AnimatePresence>
        </div>
      </section>

      <section className="toolkit-index section-shell" aria-labelledby="toolkit-index-title">
        <div className="toolkit-section-heading toolkit-index-heading">
          <div><p className="section-kicker">The index / {String(softwareCount + hardwareCount).padStart(2, "0")} items</p><h2 id="toolkit-index-title">Everything in the kit.</h2></div>
          <label className="toolkit-search"><span className="visually-hidden">Search toolkit</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.4" /><path d="m13.2 13.2 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg><input type="search" value={query} placeholder="Find a tool" onChange={(event) => setQuery(event.target.value)} /></label>
        </div>
        <div className="toolkit-filters" role="group" aria-label="Filter tools by layer">
          {toolkitFilters.map((filter) => <button className={activeFilter === filter ? "is-active" : ""} key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
        </div>
        <div className="toolkit-index-grid" aria-live="polite">
          {visibleGroups.length > 0 ? visibleGroups.map((group) => (
            <motion.article layout className="toolkit-category" key={group.id} transition={toolTransition}>
              <div className="toolkit-category-head"><span>{group.number}</span><div><h3>{group.name}</h3><p>{group.note}</p></div><span className="toolkit-category-count">{String(group.visibleItems.length).padStart(2, "0")}</span></div>
              <div className="toolkit-items">
                {group.visibleItems.map((tool) => <button className={selectedTool === tool ? "is-selected" : ""} key={tool} type="button" aria-pressed={selectedTool === tool} onClick={() => setSelectedTool(tool)}>{tool}<span aria-hidden="true">↗</span></button>)}
              </div>
            </motion.article>
          )) : <div className="toolkit-empty"><span>NO TOOL / 00</span><p>No matching tool in this layer. Try a shorter search.</p></div>}
        </div>
        <p className="toolkit-index-footnote">The stack changes with the problem. This is a working inventory, not a claim that every tool fits every project.</p>
      </section>
      <WritingToolkitContact />
    </main>
  );
}
