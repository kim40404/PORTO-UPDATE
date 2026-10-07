import { assets } from "./assets";

export type VisualKind =
  | "auditor"
  | "pillars"
  | "dataset"
  | "embedding"
  | "funnel"
  | "mlops"
  | "shap"
  | "precision"
  | "histogram"
  | "chunks"
  | "sensor"
  | "growth"
  | "clusters"
  | "dendrogram"
  | "radar"
  | "validation"
  | "matchgraph"
  | "dream"
  | "rag"
  | "heatmap"
  | "layers";

export type ProjectGroup = "AI & LLM" | "MLOps" | "Data" | "Product" | "IoT";

export interface Shot {
  src: string;
  caption: string;
}

export interface Figure {
  kind: VisualKind;
  caption: string;
  /** shows the shape of a result, not a measurement; the frame prints NOT TESTED */
  illustrative?: boolean;
}

export interface Project {
  index: string;
  id: string;
  title: string;
  subtitle: string;
  year: string;
  group: ProjectGroup;
  category: string;
  /** one-sentence summary, shown first */
  summary: string;
  /** how it actually works, from the repo */
  detail: string;
  /** concrete facts pulled from the README */
  facts: { k: string; v: string }[];
  stack: string[];
  figures: Figure[];
  shots?: Shot[];
  href?: string;
  linkLabel?: string;
  demo?: string;
  demoLabel?: string;
  note?: string;
  /** what was measured and on what; printed as the frame's conditions line */
  conditions?: string;
  metric: { value: string; label: string };
}

export interface WritingArticle {
  id: string;
  number: string;
  title: string;
  date: string;
  read: string;
  category: string;
  description: string;
  premise: string;
  metrics: { value: string; label: string }[];
  visual: { image: string; caption: string };
  sections: { title: string; body: string }[];
  sources: { label: string; href: string }[];
}

export const profile = {
  name: "Kimsang Silalahi",
  first: "Kimsang",
  last: "Silalahi",
  monogram: "KS",
  role: "AI Engineer",
  location: "Medan, Indonesia",
  timezone: "Asia/Jakarta",
  tzLabel: "WIB",
  email: "kimsilalahi@gmail.com",
  phone: "+62 812-4689-4985",
  whatsapp: "https://wa.me/6281246894985",
  github: "https://github.com/kim40404",
  huggingface: "https://huggingface.co/kimsangsilalahi",
  linkedin: "https://www.linkedin.com/in/kimsang-silalahi",
  cvUrl: assets.cvPdf,
  availability: "Open to AI engineering roles",
};

export const manifesto =
  "I build AI products that move beyond demos — LLMs, retrieval and automation, shipped with the observability to prove they still work on Monday morning.";

export const stats = [
  { value: "10", suffix: "", label: "Projects documented on GitHub" },
  { value: "7,043", suffix: "", label: "Customer profiles in the churn pipeline" },
  { value: "245", suffix: "", label: "Players surveyed for the thesis" },
  { value: "18", suffix: "/18", label: "Anthropic Academy courses" },
];

export const groups: ("All" | ProjectGroup)[] = ["All", "AI & LLM", "MLOps", "Data", "Product", "IoT"];

export const projects: Project[] = [
  {
    index: "01",
    id: "citeready",
    title: "CiteReady",
    subtitle: "AI search visibility auditor",
    year: "2026",
    group: "AI & LLM",
    category: "GEO · Semantic scoring",
    summary:
      "A B2B auditor that reads a page the way an AI engine does, then scores how likely it is to be cited by ChatGPT, Perplexity and Google AI Overviews.",
    detail:
      "Two-tier architecture: FastAPI scrapes and parses the page, then Llama 3.1 running locally through Ollama performs the semantic dissection. The technical pass checks H1 structure, meta tags and JSON-LD schema; the semantic pass scores three pillars — Authority, Fact Density and Clarity. Both combine into a blended GEO score with priority fix cards. LiteLLM plus Tenacity keep the LLM call resilient, and if the provider fails the API degrades gracefully to baseline technical scores instead of crashing the UI.",
    facts: [
      { k: "AI engine", v: "Llama 3.1 local via Ollama — $0 API cost" },
      { k: "Scored pillars", v: "Authority · Fact Density · Clarity" },
      { k: "Persistence", v: "SQLAlchemy + SQLite audit trail" },
      { k: "Deploy", v: "Backend on Cloud Run, frontend on Vercel" },
    ],
    stack: ["FastAPI", "Next.js 15", "Ollama", "LiteLLM", "SQLAlchemy", "shadcn/ui", "Recharts"],
    figures: [
      { kind: "auditor", caption: "Blended GEO score and per-engine breakdown", illustrative: true },
      { kind: "pillars", caption: "Three semantic pillars scored by Llama 3.1", illustrative: true },
      { kind: "heatmap", caption: "What the model attends to in a cited passage", illustrative: true },
    ],
    shots: [{ src: assets.citeready, caption: "CiteReady audit dashboard" }],
    href: "https://github.com/kim40404/CiteReady",
    linkLabel: "GitHub",
    conditions: "Llama 3.1 8B local via Ollama, FastAPI backend; GEO scores illustrative",
    metric: { value: "$0", label: "LLM inference cost" },
  },
  {
    index: "02",
    id: "lolospcpm",
    title: "LolosPCPM",
    subtitle: "AI exam-prep & simulation platform",
    year: "2026",
    group: "AI & LLM",
    category: "EdTech · Independent",
    summary:
      "An independent study platform for Bank Indonesia PCPM candidates, combining real-time performance analytics, an adaptive interview coach and a macroeconomic policy simulator.",
    detail:
      "Four systems in one ecosystem. The AI Policy Simulator poses fictional macroeconomic scenarios and evaluates the user's decision — raising rates during inflation, for example — against central-banking literature. The AI Interview Coach runs behavioural-event and case-study panels where the model plays a critical assessor. The analytics dashboard tracks pace per question and accuracy across TPD tryouts to surface weaknesses automatically. A token and quota system wired into the database schema caps daily inference per user to keep server load predictable.",
    facts: [
      { k: "Auth & data", v: "NextAuth.js · Prisma · PostgreSQL on Supabase" },
      { k: "Inference", v: "Vercel AI SDK + Hugging Face (Qwen / Llama)" },
      { k: "Cost control", v: "Per-user daily AI token quota in schema" },
      { k: "Tracked", v: "Pace per question and TPD accuracy" },
    ],
    stack: ["Next.js 14", "TypeScript", "Prisma", "Supabase", "NextAuth.js", "Vercel AI SDK", "Tailwind"],
    figures: [
      { kind: "histogram", caption: "Tryout score distribution across candidates", illustrative: true },
      { kind: "rag", caption: "Scenario → evaluation loop for the policy simulator", illustrative: true },
    ],
    shots: [{ src: assets.lolosPcpm, caption: "LolosPCPM candidate dashboard" }],
    href: "https://github.com/kim40404/lolos-pcpm-ai",
    linkLabel: "GitHub",
    note:
      "Independent educational platform. Not affiliated with, sponsored by, or working with Bank Indonesia; all material is AI-synthesized from public guidance.",
    conditions: "Four AI subsystems behind a per-user daily token quota; independent, not affiliated with Bank Indonesia",
    metric: { value: "4", label: "AI subsystems" },
  },
  {
    index: "03",
    id: "pdf-summary",
    title: "PDF Summarizer",
    subtitle: "Local AI document dissection",
    year: "2025",
    group: "AI & LLM",
    category: "Automation · Offline LLM",
    summary:
      "Turns a 384-page technical book into a structured Markdown summary — with Mermaid diagrams and comparison tables — entirely offline on a laptop.",
    detail:
      "PDFPlumber extracts text page by page, skipping blanks and image-only pages. Auto-chunking splits the book into 15-page blocks so an 8B model never runs out of context. Each chunk is forced through a strict template: core concepts, Mermaid architecture flowcharts, technical comparison tables, code patterns and key insights. Then a second pass reads all the chapter summaries back and writes an executive overview plus the top five takeaways for the cover page.",
    facts: [
      { k: "Model", v: "Llama 3.1 8B via Ollama — no internet, no API key" },
      { k: "Chunking", v: "15 pages per chunk (tunable to VRAM)" },
      { k: "Two passes", v: "Chapter detail, then meta-summary" },
      { k: "Output", v: "output/summary.md with Mermaid + tables" },
    ],
    stack: ["Python", "Ollama", "Llama 3.1 8B", "PDFPlumber", "Mermaid.js"],
    figures: [
      { kind: "chunks", caption: "Auto-chunking and the two-pass summary system" },
    ],
    href: "https://github.com/kim40404/PDF-SUMMARY",
    linkLabel: "GitHub",
    conditions: "384-page book, 15-page chunks, two passes, Llama 3.1 8B via Ollama, offline",
    metric: { value: "384 pp", label: "Handled offline" },
  },
  {
    index: "04",
    id: "mlops-churn",
    title: "Telco Churn MLOps",
    subtitle: "Retention pipeline with revenue risk",
    year: "2025",
    group: "MLOps",
    category: "Production ML",
    summary:
      "An end-to-end churn pipeline that predicts both churn probability and estimated revenue loss, served in Docker and watched by Prometheus and Grafana.",
    detail:
      "Trained on the IBM Telco dataset: 7,043 customer profiles where only about 26% actually churned. SMOTE rebalances the training set so XGBoost can recognise the minority class without overfitting, and a Cox proportional-hazards fitter estimates remaining tenure. Every run logs hyperparameters, f1 and artifacts to MLflow. FastAPI serves the model inside Docker Compose alongside Prometheus and Grafana, and SHAP charts expose the drivers behind each prediction. GitHub Actions runs Flake8 and Pytest on every commit.",
    facts: [
      { k: "Dataset", v: "7,043 Telco profiles · ~26% churn, imbalanced" },
      { k: "Models", v: "XGBoost + GridSearchCV · CoxPHFitter for tenure" },
      { k: "Balancing", v: "SMOTE on the training split" },
      { k: "Explainability", v: "SHAP impact per inference" },
      { k: "CI", v: "GitHub Actions — Flake8 + Pytest" },
    ],
    stack: ["XGBoost", "SMOTE", "MLflow", "FastAPI", "Docker", "Prometheus", "Grafana", "SHAP"],
    figures: [
      { kind: "mlops", caption: "Precision over 30 days with a drift alert", illustrative: true },
      { kind: "shap", caption: "SHAP drivers behind one churn prediction", illustrative: true },
      { kind: "layers", caption: "Training, serving and telemetry tiers" },
    ],
    shots: [
      { src: assets.churnDashboard, caption: "Executive dashboard, idle state" },
      { src: assets.churnHighRisk, caption: "High-risk detection with projected LTV loss" },
      { src: assets.churnShap, caption: "SHAP impact — inference driver weights" },
      { src: assets.churnGrafana, caption: "Grafana telemetry from Prometheus" },
      { src: assets.churnMlflow, caption: "MLflow experiment tracking" },
      { src: assets.churnSwagger, caption: "FastAPI Swagger documentation" },
    ],
    href: "https://github.com/kim40404/mlops-churn-dicoding",
    linkLabel: "GitHub",
    conditions: "IBM Telco dataset, 7,043 profiles, about 26% churn; SMOTE on the training split",
    metric: { value: "7,043", label: "Customer profiles" },
  },
  {
    index: "05",
    id: "flyrank",
    title: "Search Intelligence Pipeline",
    subtitle: "FlyRank AI — ML internship",
    year: "2026",
    group: "MLOps",
    category: "Applied search ML",
    summary:
      "A runnable ranking pipeline on anonymized Google Search data that decides which pages to refresh first — and beats a hand-written rule by roughly three times.",
    detail:
      "The reference pipeline runs end to end: prepare features and define the label, score a transparent hand-written baseline, train logistic regression, decision tree and random forest on a client-holdout split, then export a ranked refresh queue with charts, a Markdown report and a shareable PDF. On the bundled sample the learned model lifts Precision@50 from roughly 0.24 to 0.74. The starter CSV covers around 30k anonymized pages; the full release of about 79M rows is queried through DuckDB without downloading it.",
    facts: [
      { k: "Starter data", v: "~30k anonymized pages, 44 documented columns" },
      { k: "Full release", v: "~79M rows queried via DuckDB" },
      { k: "Models", v: "Logistic regression · decision tree · random forest" },
      { k: "Split", v: "Client-holdout, to stop leakage across clients" },
      { k: "Output", v: "Ranked refresh queue + Markdown and PDF report" },
    ],
    stack: ["Python", "scikit-learn", "DuckDB", "pandas", "Colab"],
    figures: [
      { kind: "precision", caption: "Precision@k — hand rule vs learned model" },
    ],
    href: "https://github.com/kim40404/flyrank-ml-internship-starter",
    linkLabel: "GitHub",
    note:
      "Results are observed and directional decision-support on anonymized data — not a claim about Google's ranking algorithm.",
    conditions: "client-holdout split, bundled sample; directional",
    metric: { value: "3×", label: "Precision@50 lift" },
  },
  {
    index: "06",
    id: "id-en-pipeline",
    title: "ID–EN Data Pipeline",
    subtitle: "Bilingual dataset sanitation",
    year: "2025",
    group: "Data",
    category: "Data engineering",
    summary:
      "An automated pipeline that ingests, cleans and validates an Indonesian–English instruction dataset before it ever reaches a model.",
    detail:
      "Garbage in, garbage out — so the pipeline enforces quality mechanically. It pulls the raw dataset straight from the Hugging Face Hub, then Polars (chosen over pandas for multi-threaded speed) strips nulls and exact duplicates in milliseconds. A validation layer asserts zero missing values and zero duplicates; only if that passes does the sanitized split get pushed back to the Hub as a production dataset. On the current run, 945 raw rows became 944 clean ones.",
    facts: [
      { k: "Raw", v: "945 rows ingested from the Hub" },
      { k: "Clean", v: "944 rows after nulls and duplicates removed" },
      { k: "Engine", v: "Polars — multi-threaded, not pandas" },
      { k: "Gate", v: "Hard assertion: zero nulls, zero duplicates" },
    ],
    stack: ["Python", "Polars", "Hugging Face Datasets", "Jupyter"],
    figures: [
      { kind: "funnel", caption: "Ingest → sanitize → validate → publish" },
      { kind: "embedding", caption: "ID ↔ EN instruction pairs in embedding space", illustrative: true },
      { kind: "dataset", caption: "Sample matrix — kept versus rejected rows" },
    ],
    shots: [{ src: assets.huggingface, caption: "Dataset published on Hugging Face" }],
    href: "https://github.com/kim40404/id-en-data-pipeline",
    linkLabel: "GitHub",
    demo: "https://huggingface.co/datasets/Kimsang766/agentic-ai-instructions-id-en-cleaned",
    demoLabel: "Hugging Face dataset",
    conditions: "945 raw rows from the Hub, Polars pipeline, hard assertion on nulls and duplicates",
    metric: { value: "944", label: "Validated rows" },
  },
  {
    index: "07",
    id: "mobile-legends",
    title: "Mobile Legends Player Analytics",
    subtitle: "S1 thesis — K-Means vs DBSCAN",
    year: "2024",
    group: "Data",
    category: "Clustering research",
    summary:
      "A Flask research application comparing K-Means and DBSCAN on real player data from Medan, validated across eight statistical metrics.",
    detail:
      "Primary data came from 245 authentic Mobile Legends players in Medan, supplemented by 1,000 simulated analytics records. Both algorithms run live in the browser and are compared through Silhouette, Calinski-Harabasz, Davies-Bouldin, an ANOVA F-test, Kruskal-Wallis, cross-validation stability, feature-importance F-ratio and inter-cluster distance. A separate draft-pick advisor covers 129 heroes with meta statistics from Mythic-rank matches. The statistical validation framework reached 92% research validity ahead of the thesis defence.",
    facts: [
      { k: "Primary data", v: "245 authentic players from Medan" },
      { k: "Secondary data", v: "1,000 simulated analytics records" },
      { k: "Hero database", v: "129 heroes with meta statistics" },
      { k: "Validation", v: "8 statistical metrics · 92% research validity" },
    ],
    stack: ["Flask", "scikit-learn", "Plotly", "pandas", "NumPy", "Gunicorn"],
    figures: [
      { kind: "clusters", caption: "k = 3 segmentation — K-Means versus DBSCAN" },
      { kind: "dendrogram", caption: "Hierarchical view, cut at k = 3" },
      { kind: "radar", caption: "Centroid role profiles per cluster" },
      { kind: "validation", caption: "Eight validation metrics side by side" },
    ],
    href: "https://github.com/kim40404/MobileLegendsUnique",
    linkLabel: "GitHub",
    demo: "https://mobilelegendsunique.up.railway.app/",
    demoLabel: "Live app",
    conditions: "245 surveyed players in Medan plus 1,000 simulated records; 8 validation metrics",
    metric: { value: "245", label: "Players surveyed" },
  },
  {
    index: "08",
    id: "growmate",
    title: "GrowMate",
    subtitle: "Collaboration matching platform",
    year: "2025",
    group: "Product",
    category: "Social · Realtime",
    summary:
      "Stop scrolling, start growing — a web app that matches Indonesian students, builders and creators by skill, goal and real distance.",
    detail:
      "Think of a dating app, but the goal is to learn and build together. You write a profile, set a search radius anywhere from 1 to 100 km, then swipe through people on your wavelength nearby; a chat opens only when interest is mutual. The signature feature is live location sharing inside the chat — an interactive map shows both positions in real time and the partner is notified automatically, with coordinates rounded so an exact address is never exposed. Safety is built in: block and report, strict community guidelines, and location data that is never stored permanently.",
    facts: [
      { k: "Matching", v: "Skill, goal and radius from 1–100 km" },
      { k: "Signature", v: "Live location on an interactive map in chat" },
      { k: "Privacy", v: "Coordinates rounded; location never stored permanently" },
      { k: "Safety", v: "Block & report, mutual-consent matching only" },
      { k: "Chat", v: "Online and typing indicators, read receipts" },
    ],
    stack: ["Next.js", "TypeScript", "Realtime chat", "Maps", "Vercel"],
    figures: [
      { kind: "matchgraph", caption: "Mutual matches within a search radius", illustrative: true },
    ],
    shots: [{ src: assets.growmate, caption: "GrowMate match and chat interface" }],
    href: "https://github.com/kim40404/growmate-app",
    linkLabel: "GitHub",
    demo: "https://growmate-app.vercel.app",
    demoLabel: "Live app",
    conditions: "Search radius 1 to 100 km, mutual-consent matching; coordinates rounded",
    metric: { value: "1–100 km", label: "Search radius" },
  },
  {
    index: "09",
    id: "honey",
    title: "Honey Quality Classifier",
    subtitle: "ESP32 — embedded ML",
    year: "2023",
    group: "IoT",
    category: "Edge intelligence",
    summary:
      "A sensor array streaming to Firebase that classifies honey purity with k-NN at 88.25% accuracy.",
    detail:
      "An ESP32 reads a small sensor array and streams measurements to Firebase, where a k-NN classifier separates pure from adulterated samples. Intelligence at the edge, long before it was fashionable.",
    facts: [
      { k: "Accuracy", v: "88.25% on the k-NN classifier" },
      { k: "Hardware", v: "ESP32 with a multi-sensor array" },
      { k: "Backend", v: "Firebase realtime stream" },
    ],
    stack: ["ESP32", "k-NN", "Firebase", "C++"],
    figures: [
      { kind: "sensor", caption: "Sensor lattice and raw signal trace" },
    ],
    shots: [{ src: assets.honeyQuality, caption: "Honey quality monitoring interface" }],
    conditions: "k-NN on an ESP32 multi-sensor array streaming to Firebase",
    metric: { value: "88.25%", label: "Classification accuracy" },
  },
  {
    index: "10",
    id: "decodream",
    title: "Decodream",
    subtitle: "Web3 hackathon — team lead",
    year: "2024",
    group: "AI & LLM",
    category: "NLP · ICP",
    summary:
      "AI dream interpretation on the Internet Computer: symbolism analysis, emotional context and community sharing.",
    detail:
      "Led a team of four as project lead. The platform extracts dream symbolism with NLP, maps emotional context, and stores entries on the Internet Computer so the community layer stays decentralized.",
    facts: [
      { k: "Role", v: "Project lead, team of four" },
      { k: "Chain", v: "Internet Computer (ICP)" },
      { k: "NLP", v: "Symbol extraction and emotional context mapping" },
    ],
    stack: ["React", "TypeScript", "Node.js", "MongoDB", "ICP"],
    figures: [{ kind: "dream", caption: "Symbol graph with emotional associations", illustrative: true }],
    conditions: "Hackathon build, team of four, NLP symbol extraction; figure illustrative",
    metric: { value: "Lead", label: "Team of four" },
  },
];

export const method = [
  {
    index: "01",
    title: "Retrieve",
    blurb: "Pipelines that find the right context before the model speaks.",
    figure: "rag" as VisualKind,
    tools: ["Ollama", "Claude API", "Hugging Face", "LiteLLM", "pgvector"],
  },
  {
    index: "02",
    title: "Evaluate",
    blurb: "Measure what the model attends to, and whether it is right.",
    figure: "heatmap" as VisualKind,
    tools: ["scikit-learn", "XGBoost", "SHAP", "MLflow", "Pytest"],
  },
  {
    index: "03",
    title: "Ship",
    blurb: "Serve it, trace it, watch it — then put a product on top.",
    figure: "layers" as VisualKind,
    tools: ["FastAPI", "Docker", "Prometheus", "Grafana", "Next.js"],
  },
];

export const searchDiscovery = {
  image: assets.chatgptDiscovery,
  imageAlt: "ChatGPT response listing Kimsang Silalahi first among 20 AI talent profiles in Medan",
  note: "A prompt-specific observation (GEO/AEO), not a ranking guarantee. Results vary by prompt, account, location and time.",
};

export const portraits = [
  { label: "Formal", image: assets.portraitFormal },
  { label: "Everyday", image: assets.portraitUrban },
  { label: "Experiment", image: assets.portraitRobot },
];

export const aboutFacts = [
  { k: "Education", v: "B.Sc. Computer Science, USU — GPA 3.78, Cum Laude" },
  { k: "Mobility", v: "INTI International University, Malaysia — 2023–24" },
  { k: "Certified", v: "Anthropic Academy 18/18 · Dicoding · AWS" },
  { k: "Languages", v: "Indonesian (native) · English (professional)" },
];

export const experience = [
  {
    period: "Jul — Aug 2026",
    company: "FlyRank AI",
    role: "AI Engineer, Internship",
    place: "Remote",
    highlights: [
      "Built a ranking pipeline on anonymized Google Search data that lifted Precision@50 from roughly 0.24 to 0.74 against a hand-written baseline.",
      "Worked the full workflow: problem framing, data contracts, leakage checks, baseline, model, validation audit and an explainable action playbook.",
      "Queried the ~79M-row release through DuckDB without moving the data.",
    ],
  },
  {
    period: "Aug 2024 — Jun 2026",
    company: "Independent",
    role: "AI & Software Engineering Consultant",
    place: "Medan",
    highlights: [
      "Shipped end-to-end AI applications — CiteReady, LolosPCPM and the PDF summarizer — on local and hosted LLMs.",
      "Built a Polars data pipeline that validates a bilingual instruction dataset before it reaches a model.",
      "Delivered production web architectures, database schemas and REST APIs with PHP 8.2, PostgreSQL and React.",
    ],
  },
  {
    period: "2023 — 2024",
    company: "INTI International University",
    role: "Student Mobility (MBKM)",
    place: "Malaysia",
    highlights: [
      "Selected for the Indonesian Ministry of Education's international mobility program.",
      "Contributed to a cross-border humanitarian technology initiative.",
    ],
  },
  {
    period: "2021 — 2025",
    company: "Universitas Sumatera Utara",
    role: "B.Sc. Computer Science, Cum Laude",
    place: "Medan",
    highlights: [
      "GPA 3.78 / 4.00. Thesis: K-Means versus DBSCAN player segmentation on 245 surveyed players.",
      "Focus on AI agents, LLMs and data structures in C++ and Python.",
    ],
  },
];

export const certifications = [
  { name: "Anthropic Academy", detail: "18 / 18 courses" },
  { name: "Dicoding", detail: "8 courses · ML & MLOps" },
  { name: "AWS Cloud", detail: "Cloud foundations" },
];

export const articles: WritingArticle[] = [
  {
    id: "discovery",
    number: "01",
    title: "First of twenty in a ChatGPT answer",
    date: "Sep 2026",
    read: "4 min",
    category: "GEO · AI visibility",
    description: "One prompt, one screenshot, and the difference between a ranking claim and an observation.",
    premise:
      "Asked to list twenty AI engineer profiles in Medan, ChatGPT returned mine first. Worth documenting — as an observation, not a guarantee.",
    metrics: [
      { value: "#1", label: "Position" },
      { value: "20", label: "Profiles listed" },
      { value: "1", label: "Prompt" },
    ],
    visual: { image: assets.chatgptDiscovery, caption: "ChatGPT response — AI engineer profiles in Medan." },
    sections: [
      {
        title: "Why this is a different kind of search",
        body: "AI engines retrieve and synthesize rather than return ten blue links. Asking a model to name real people is a GEO/AEO query: it tests whether your content is citable, not merely indexed.",
      },
      {
        title: "Why it is not a ranking",
        body: "Results vary by prompt, account, location and time. One response is a signal worth logging — not a stable position, an endorsement, or proof of SEO performance.",
      },
      {
        title: "What actually seems to help",
        body: "Consistent entities across the web: the same name, role, links and CV structure on GitHub, Hugging Face, LinkedIn and this site, so a retrieval model has one clean thing to cite. That hypothesis is exactly what CiteReady was built to score.",
      },
    ],
    sources: [
      {
        label: "LinkedIn article",
        href: "https://www.linkedin.com/pulse/people-guessed-i-used-claude-opus-55-free-model-instead-silalahi-fhtff/",
      },
      { label: "CiteReady on GitHub", href: "https://github.com/kim40404/CiteReady" },
    ],
  },
  {
    id: "local-llm",
    number: "02",
    title: "Two products, zero API bills",
    date: "Aug 2025",
    read: "5 min",
    category: "Local inference · Ollama",
    description: "CiteReady and the PDF summarizer both run Llama 3.1 on a laptop. Here is what that trade actually costs.",
    premise:
      "A metered API is the quiet tax on every AI side project. Running Llama 3.1 locally through Ollama removed it entirely from two shipped tools — at the price of throughput and some engineering around reliability.",
    metrics: [
      { value: "$0", label: "Inference spend" },
      { value: "8B", label: "Model size" },
      { value: "15 pp", label: "Chunk window" },
    ],
    visual: { image: assets.citeready, caption: "CiteReady — semantic scoring served from a local model." },
    sections: [
      {
        title: "What local inference buys you",
        body: "Privacy and a cost floor of zero. CiteReady audits a client page without that page ever leaving the machine; the PDF summarizer reads a 384-page book with no internet connection at all.",
      },
      {
        title: "What it costs you",
        body: "Throughput and context. An 8B model needs the work chopped into 15-page chunks to stay inside its context window, and a local server can stall. LiteLLM with Tenacity wraps the call, and CiteReady degrades to baseline technical scores rather than crashing the dashboard.",
      },
      {
        title: "When to switch to a hosted model",
        body: "For production I recommend the cloud provider path through the same LiteLLM proxy — one environment variable, no rewrite. Local is for building and for privacy-sensitive audits; hosted is for stability and speed under real traffic.",
      },
    ],
    sources: [
      { label: "CiteReady", href: "https://github.com/kim40404/CiteReady" },
      { label: "PDF Summarizer", href: "https://github.com/kim40404/PDF-SUMMARY" },
    ],
  },
  {
    id: "churn",
    number: "03",
    title: "Keeping a churn model honest in production",
    date: "Apr 2025",
    read: "6 min",
    category: "MLOps · Monitoring",
    description: "SMOTE, XGBoost, SHAP and Grafana — and why an imbalanced dataset punishes naive accuracy.",
    premise:
      "The Telco dataset holds 7,043 customers and only about 26% of them churn. A model that predicts nobody churns is already 74% accurate and completely useless. Everything downstream is a response to that fact.",
    metrics: [
      { value: "7,043", label: "Profiles" },
      { value: "~26%", label: "Churn rate" },
      { value: "SHAP", label: "Per-prediction" },
    ],
    visual: { image: assets.churnShap, caption: "SHAP impact — the drivers behind one prediction." },
    sections: [
      {
        title: "Rebalance before you train",
        body: "SMOTE synthesizes minority-class examples so XGBoost actually learns what a churner looks like, instead of optimising for the easy majority. A Cox proportional-hazards fitter runs alongside it to estimate remaining tenure.",
      },
      {
        title: "Predict money, not just a label",
        body: "A churn probability on its own is hard to act on. Pairing it with estimated revenue loss turns the output into a prioritised retention queue that a business reader can sort by value.",
      },
      {
        title: "Explain every inference",
        body: "SHAP charts show which features pushed a given customer toward churn. Without that, nobody trusts the number enough to spend retention budget on it.",
      },
      {
        title: "Then watch it",
        body: "FastAPI exposes /metrics, Prometheus scrapes, Grafana draws. MLflow holds every run, so a rollback is a promotion away. The goal is a boring dashboard.",
      },
    ],
    sources: [{ label: "GitHub repo", href: "https://github.com/kim40404/mlops-churn-dicoding" }],
  },
  {
    id: "lolospcpm",
    number: "04",
    title: "Designing an exam simulator that argues back",
    date: "Sep 2026",
    read: "6 min",
    category: "Product · LolosPCPM",
    description: "Static PDFs cannot tell you why your reasoning broke. Four AI subsystems that can.",
    premise:
      "Candidates preparing for Bank Indonesia's PCPM selection had practice questions but no feedback loop. LolosPCPM replaces the answer key with systems that evaluate reasoning: a policy simulator, an interview coach and precision analytics.",
    metrics: [
      { value: "4", label: "AI subsystems" },
      { value: "Quota", label: "Per-user tokens" },
      { value: "TPD", label: "Pace + accuracy" },
    ],
    visual: { image: assets.lolosPcpm, caption: "LolosPCPM — practice analytics dashboard." },
    sections: [
      {
        title: "Evaluate the decision, not the answer",
        body: "The policy simulator poses a fictional macroeconomic scenario and judges the user's call — raising rates into inflation, say — against central-banking literature, rather than matching a letter to a key.",
      },
      {
        title: "Make the interviewer adaptive",
        body: "The interview coach runs behavioural-event and case-study panels where the model plays a critical assessor that follows up on weak answers instead of reading a fixed script.",
      },
      {
        title: "Measure pace, not just score",
        body: "The analytics dashboard tracks seconds per question alongside accuracy, which is what actually separates candidates under time pressure.",
      },
      {
        title: "Budget the AI itself",
        body: "A token and quota system sits in the database schema and caps daily inference per user — the unglamorous part that keeps a free platform alive.",
      },
    ],
    sources: [{ label: "GitHub repo", href: "https://github.com/kim40404/lolos-pcpm-ai" }],
  },
  {
    id: "rebuild",
    number: "05",
    title: "A free model, a different editor, and half a day",
    date: "29 Sep 2026",
    read: "5 min",
    category: "Design · AI-assisted build",
    description: "Which model wrote the code matters less than what a visitor should do next.",
    premise:
      "Some guessed a frontier model built this portfolio. It was a free model and a different editor, in about half a day. The useful story is what that time went into: making the site easier to navigate, evaluate and act on.",
    metrics: [
      { value: "Free", label: "Model" },
      { value: "≈½ day", label: "Rebuild" },
      { value: "05", label: "Notes" },
    ],
    visual: { image: assets.workflow, caption: "AI generates options; human review decides what ships." },
    sections: [
      {
        title: "The tool is the hook, not the method",
        body: "AI helped me iterate faster. It did not decide what to show, which links mattered, or when the experience was clear enough to ship.",
      },
      {
        title: "Design the page like a map, not a poster",
        body: "Each section is a decision point: explore projects, verify the CV, or get in touch — never a polished dead end.",
      },
      {
        title: "Treat AI visibility as an observation",
        body: "One ChatGPT response listing my profile first is worth documenting — not a stable ranking or SEO proof.",
      },
    ],
    sources: [
      {
        label: "LinkedIn article",
        href: "https://www.linkedin.com/pulse/people-guessed-i-used-claude-opus-55-free-model-instead-silalahi-fhtff/",
      },
      { label: "Live site", href: "https://kimsilalahi.vercel.app/" },
    ],
  },
];

export const tickerItems = [
  "LLM applications",
  "Retrieval-augmented generation",
  "Local inference with Ollama",
  "Production MLOps",
  "Evaluation & observability",
  "Clustering research",
];

/** FEATURES: each a real number with its measurement condition. */
export const features: { text: string; conditions: string }[] = [
  { text: "Precision@50 lifted from 0.24 to 0.74, about 3x", conditions: "FlyRank bundled sample, client-holdout split; directional" },
  { text: "944 of 945 rows validated and published to Hugging Face", conditions: "Polars pipeline, hard assertion on nulls and duplicates" },
  { text: "7,043-profile churn pipeline: XGBoost, MLflow, Prometheus/Grafana", conditions: "IBM Telco dataset, about 26% churn, served in Docker Compose" },
  { text: "Local inference, Llama 3.1 8B via Ollama: $0 API spend", conditions: "CiteReady and the PDF summarizer, 384 pages offline" },
  { text: "245 surveyed players, K-Means vs DBSCAN", conditions: "S1 thesis, 8 validation metrics, 92% research validity" },
  { text: "Anthropic Academy 18 of 18 courses", conditions: "Completed; Dicoding ML and MLOps, AWS Cloud foundations alongside" },
];

export const applications: string[] = [
  "Junior-to-mid Applied AI / LLM Engineer roles, remote-first.",
  "Freelance AI builds in Indonesia: LLM applications, data pipelines, web products.",
  "RAG and MLOps consulting: retrieval, evaluation, serving and monitoring.",
];

export const generalDescription: string[] = [
  "Kimsang Silalahi is an AI engineer in Medan, Indonesia (WIB). He builds LLM applications, retrieval systems and production MLOps, and ships them with the observability to prove they still work on Monday morning.",
  "This sheet lists ten projects, eight with public repositories, from a page auditor running a local model to a churn pipeline served in Docker and watched by Prometheus and Grafana. Every figure is drawn in code from the project's own data; a figure that shows the shape of a result rather than a measurement is marked NOT TESTED.",
];

export interface Characteristic {
  parameter: string;
  conditions: string;
  min: string;
  typ: string;
  max: string;
  unit: string;
  /** index into `notes` */
  note?: number;
  /** the figure kind this value is read from */
  figure?: VisualKind;
  /** project id whose Curves frame this row links to */
  project?: string;
}

/** ELECTRICAL CHARACTERISTICS: "-" where nothing is stated; typ is the headline value. */
export const characteristics: Characteristic[] = [
  { parameter: "Precision@50", conditions: "FlyRank, client-holdout split, bundled sample; hand-written baseline", min: "0.24", typ: "0.74", max: "-", unit: "-", note: 1, figure: "precision", project: "flyrank" },
  { parameter: "Rows validated", conditions: "ID-EN pipeline, Polars, hard assertion on nulls and duplicates; 945 raw rows", min: "-", typ: "944", max: "-", unit: "rows", figure: "funnel", project: "id-en-pipeline" },
  { parameter: "Customer profiles", conditions: "Telco churn, IBM dataset, about 26% churn, SMOTE on the training split", min: "-", typ: "7,043", max: "-", unit: "profiles", figure: "layers", project: "mlops-churn" },
  { parameter: "Classification accuracy", conditions: "Honey purity, k-NN, ESP32 multi-sensor array", min: "-", typ: "88.25", max: "-", unit: "%", figure: "sensor", project: "honey" },
  { parameter: "Players surveyed", conditions: "Thesis, K-Means vs DBSCAN; plus 1,000 simulated records", min: "-", typ: "245", max: "-", unit: "players", note: 2, figure: "clusters", project: "mobile-legends" },
  { parameter: "Research validity", conditions: "Thesis, 8 statistical validation metrics", min: "-", typ: "92", max: "-", unit: "%", figure: "validation", project: "mobile-legends" },
  { parameter: "LLM inference cost", conditions: "CiteReady, Llama 3.1 local via Ollama", min: "-", typ: "0", max: "-", unit: "USD", note: 3, figure: "auditor", project: "citeready" },
  { parameter: "Document size handled", conditions: "PDF Summarizer, 15-page chunks, two passes, offline", min: "-", typ: "384", max: "-", unit: "pages", figure: "chunks", project: "pdf-summary" },
  { parameter: "AI subsystems", conditions: "LolosPCPM, per-user daily token quota", min: "-", typ: "4", max: "-", unit: "-", note: 4, figure: "histogram", project: "lolospcpm" },
  { parameter: "Match radius", conditions: "GrowMate, mutual-consent matching", min: "1", typ: "-", max: "100", unit: "km", figure: "matchgraph", project: "growmate" },
  { parameter: "Rows queried", conditions: "FlyRank full release, DuckDB, data not downloaded", min: "-", typ: "~79,000,000", max: "-", unit: "rows", project: "flyrank" },
  { parameter: "Courses completed", conditions: "Anthropic Academy", min: "-", typ: "18", max: "18", unit: "courses" },
];

export const notes: { n: number; text: string }[] = [
  { n: 1, text: "Directional decision support on anonymized data, not a claim about Google's ranking algorithm." },
  { n: 2, text: "Figure 1 runs on synthetic points to show the algorithm; the thesis measured 245 surveyed players." },
  { n: 3, text: "Figures marked NOT TESTED are illustrative: they show the shape of a result, not a measurement." },
  { n: 4, text: "LolosPCPM is an independent educational platform, not affiliated with, sponsored by, or working with Bank Indonesia." },
  { n: 5, text: "The ChatGPT listing is a prompt-specific observation, not a ranking guarantee. Results vary by prompt, account, location and time." },
];

export type PinGroup = "RETRIEVE" | "EVALUATE" | "SHIP";

export interface Pin {
  n: number;
  name: string;
  group: PinGroup;
  fn: string;
  /** project ids whose stack or facts use it */
  projects: string[];
}

export const pins: Pin[] = [
  { n: 1, name: "Ollama", group: "RETRIEVE", fn: "Runs Llama 3.1 8B locally, no API key", projects: ["citeready", "pdf-summary"] },
  { n: 2, name: "Claude API", group: "RETRIEVE", fn: "Hosted model path through the same LiteLLM proxy", projects: [] },
  { n: 3, name: "Hugging Face", group: "RETRIEVE", fn: "Dataset hub and hosted inference", projects: ["lolospcpm", "id-en-pipeline"] },
  { n: 4, name: "LiteLLM", group: "RETRIEVE", fn: "One client for local and hosted models, retried with Tenacity", projects: ["citeready"] },
  { n: 5, name: "pgvector", group: "RETRIEVE", fn: "Vector similarity inside PostgreSQL", projects: [] },
  { n: 6, name: "scikit-learn", group: "EVALUATE", fn: "Baselines, clustering and validation metrics", projects: ["flyrank", "mobile-legends"] },
  { n: 7, name: "XGBoost", group: "EVALUATE", fn: "Gradient-boosted churn classifier", projects: ["mlops-churn"] },
  { n: 8, name: "SHAP", group: "EVALUATE", fn: "Per-prediction feature impact", projects: ["mlops-churn"] },
  { n: 9, name: "MLflow", group: "EVALUATE", fn: "Logs hyperparameters, f1 and artifacts per run", projects: ["mlops-churn"] },
  { n: 10, name: "Pytest", group: "EVALUATE", fn: "Tests on every commit via GitHub Actions", projects: ["mlops-churn"] },
  { n: 11, name: "FastAPI", group: "SHIP", fn: "Serves the model and exposes /metrics", projects: ["citeready", "mlops-churn"] },
  { n: 12, name: "Docker", group: "SHIP", fn: "Compose stack for API, Prometheus and Grafana", projects: ["mlops-churn"] },
  { n: 13, name: "Prometheus", group: "SHIP", fn: "Scrapes serving metrics", projects: ["mlops-churn"] },
  { n: 14, name: "Grafana", group: "SHIP", fn: "Dashboards over Prometheus", projects: ["mlops-churn"] },
  { n: 15, name: "Next.js", group: "SHIP", fn: "Product front end on Vercel", projects: ["citeready", "lolospcpm", "growmate"] },
];
