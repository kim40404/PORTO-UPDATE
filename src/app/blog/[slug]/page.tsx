import { Nav } from "@/components/Nav";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

/* ─── Reusable components ─────────────────────────────────────────── */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="my-8">
      <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--accent)] mb-4 flex items-center gap-3">
        <span className="flex-1 h-px bg-[var(--border)]" />
        {label}
        <span className="flex-1 h-px bg-[var(--border)]" />
      </p>
      {children}
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-[var(--accent)] pl-4 py-1 my-6 text-sm text-[var(--muted)] italic leading-relaxed">
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="relative bg-[var(--bg)] border border-[var(--border)] rounded-sm p-5 text-xs overflow-x-auto leading-relaxed my-4 font-mono">
      <span className="absolute top-2 right-3 text-[9px] tracking-widest text-[var(--muted)] uppercase font-bold">code</span>
      {code}
    </pre>
  );
}

function KeyPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--border)] p-3 hover:border-[var(--accent)] transition-colors duration-300">
      <p className="text-[9px] font-black tracking-widest uppercase text-[var(--muted)] mb-1">{label}</p>
      <p className="text-sm font-bold text-[var(--text)]">{value}</p>
    </div>
  );
}

/* ─── Post content ────────────────────────────────────────────────── */

const POSTS: Record<string, {
  date: string;
  readTime: string;
  title: string;
  tags: string[];
  content: React.ReactNode;
}> = {
  "synthesizing-agentic-data": {
    date: "Aug 12, 2026",
    readTime: "5 min read",
    title: "Synthesizing 1K Agentic AI Data Locally via Ollama",
    tags: ["AI", "Dataset", "Ollama"],
    content: (
      <article className="text-sm leading-relaxed text-[var(--text)] space-y-5">

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <KeyPoint label="Items" value="1,182 pairs" />
          <KeyPoint label="Cost" value="Rp 0 (free)" />
          <KeyPoint label="Languages" value="ID + EN" />
        </div>

        <p>
          When I started building a bilingual agentic AI dataset, I had two hard constraints: no budget
          for commercial API calls, and the data needed to be genuinely diverse across 8 complex
          agentic task categories — not just basic Q&A.
        </p>

        <Callout>
          The challenge wasn&apos;t generating text. It was generating <em>structured, high-quality
          instruction-response pairs</em> that could serve as reliable training signal for agentic models.
        </Callout>

        <Section label="The Architecture">
          <p className="text-sm leading-relaxed mb-4">
            The solution: run <strong className="text-[var(--accent)]">Ollama</strong> locally with
            Mistral-7B and Llama 3. These models are capable enough when prompted correctly. The pipeline
            was simple but deliberately designed:
          </p>
          <CodeBlock code={`# Core synthesis loop
for category in AGENTIC_CATEGORIES:
    for _ in range(TARGET_PER_CATEGORY):
        prompt = build_template(category, lang="id")
        response = ollama.generate(
            model="mistral",
            prompt=prompt,
            options={"temperature": 0.8}
        )
        entry = validate_and_clean(response)
        if entry: dataset.append(entry)`} />
        </Section>

        <Section label="The 8 Agentic Categories">
          <ul className="space-y-2 text-sm">
            {[
              "Tool Use & Function Calling",
              "Multi-step Planning & Reasoning",
              "Memory Retrieval & Summarization",
              "Web Search Simulation",
              "Code Generation & Debugging",
              "Document Analysis",
              "Decision Making Under Uncertainty",
              "Cross-lingual Instruction Following",
            ].map((cat, i) => (
              <li key={cat} className="flex gap-3 items-start">
                <span className="text-[var(--accent)] font-mono text-[10px] mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{cat}</span>
              </li>
            ))}
          </ul>
        </Section>

        <p>
          The key insight: prompt template quality matters far more than model size. A well-structured
          template forces the model to produce consistent, schema-valid outputs. I spent roughly 60%
          of my time refining templates — not running the pipeline.
        </p>

        <Section label="What I Learned">
          <p className="text-sm leading-relaxed">
            Open-source LLMs at 7B parameters are more than capable of producing publishable
            research-grade data when you constrain the output format precisely. The dataset is now
            live on <strong className="text-[var(--accent)]">Hugging Face</strong> and is being
            actively used by researchers for cross-lingual agentic model evaluation. Open publishing
            compounds — one dataset becomes 10 citations becomes a reputation.
          </p>
        </Section>
      </article>
    ),
  },

  "ai-citation-optimization": {
    date: "Jul 20, 2026",
    readTime: "4 min read",
    title: "The Mechanics of AI Citation Optimization (AIO)",
    tags: ["LLM", "SEO", "CiteReady"],
    content: (
      <article className="text-sm leading-relaxed text-[var(--text)] space-y-5">

        <div className="grid grid-cols-2 gap-3 my-6">
          <KeyPoint label="Old paradigm" value="Google PageRank" />
          <KeyPoint label="New paradigm" value="LLM Citation Rank" />
        </div>

        <p>
          Traditional SEO is about ranking higher on Google&apos;s blue links. AI Citation
          Optimization (AIO) is a different game entirely: it&apos;s about being the source
          that <strong>LLMs choose to quote</strong> when a user asks a question.
        </p>

        <Callout>
          ChatGPT doesn&apos;t care if you have 10,000 backlinks. It cares if your content is
          structurally clear, factually dense, and maps precisely to how it frames the question.
        </Callout>

        <Section label="Why AIO is Different">
          <p className="text-sm leading-relaxed mb-4">
            When Perplexity or Gemini answer a query, they run a retrieval step over indexed web
            content. What gets retrieved — and then cited — is determined by semantic similarity
            to the query, not domain authority. This creates a completely new content optimization
            surface.
          </p>
          <p className="text-sm leading-relaxed">
            I built <strong className="text-[var(--accent)]">CiteReady</strong> after observing
            this pattern: high-authority sites were being ignored by AI search, while smaller,
            well-structured pages were consistently cited. The differentiator wasn&apos;t traffic.
            It was architecture.
          </p>
        </Section>

        <Section label="The Three Pillars of AIO">
          <div className="space-y-4">
            {[
              {
                num: "01",
                title: "Density",
                desc: "Pack factual, entity-rich information into short paragraphs. LLMs prefer 2-3 sentence chunks with high information density over long flowing prose.",
              },
              {
                num: "02",
                title: "Structure",
                desc: "Use clear H2/H3 headings that mirror natural query phrasing. 'What is X?' pages outperform 'Understanding X' pages in AI citation 3:1.",
              },
              {
                num: "03",
                title: "Authority Signals",
                desc: "Reference specific numbers, dates, named studies, and sourced statistics. LLMs weight content with verifiable specifics far above generic claims.",
              },
            ].map((p) => (
              <div key={p.num} className="flex gap-4 items-start border border-[var(--border)] p-4 hover:border-[var(--accent)] transition-colors duration-300">
                <span className="text-2xl font-black text-[var(--border)] shrink-0 leading-none">{p.num}</span>
                <div>
                  <p className="font-bold text-[var(--text)] mb-1">{p.title}</p>
                  <p className="text-[var(--muted)] text-xs leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="CiteReady in Practice">
          <p className="text-sm leading-relaxed">
            CiteReady scores your content across these three pillars and outputs a GEO
            (Generative Engine Optimization) score. It then suggests concrete rewrites — not
            vague advice, but actual structural changes that increase the probability of being
            cited. This is the new frontier of content strategy, and most teams haven&apos;t
            caught up yet.
          </p>
        </Section>
      </article>
    ),
  },

  "production-mlops": {
    date: "Jun 05, 2026",
    readTime: "6 min read",
    title: "Designing Production-Ready MLOps with Grafana & Prometheus",
    tags: ["MLOps", "Docker", "Monitoring"],
    content: (
      <article className="text-sm leading-relaxed text-[var(--text)] space-y-5">

        <div className="grid grid-cols-3 gap-3 my-6">
          <KeyPoint label="Stack" value="MLflow + FastAPI" />
          <KeyPoint label="Monitoring" value="Prometheus + Grafana" />
          <KeyPoint label="Infra" value="Docker" />
        </div>

        <p>
          Most ML tutorials end at model training. But training is 10% of the work — the remaining
          90% is keeping the model alive, accurate, and observable in production. This is where
          most ML projects fail. I built an end-to-end MLOps pipeline for Telco Churn Prediction to demonstrate how to cross that gap.
        </p>

        <Callout>
          A model that silently degrades is worse than a model that openly fails. Silent failure
          means weeks of bad predictions before anyone notices. Monitoring is not optional.
        </Callout>

        <div className="flex flex-col sm:flex-row gap-4 my-8">
          <a
            href="https://dev.to/kim40404/from-jupyter-notebook-to-production-building-an-enterprise-mlops-pipeline-for-churn-prediction-jk3"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-xs font-bold tracking-wider text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black border border-[var(--accent)] px-4 py-3 flex items-center justify-center gap-2 transition-colors"
          >
            <span>READ FULL ARTICLE ON DEV.TO</span>
            <span>→</span>
          </a>
          <a
            href="https://github.com/kim40404/mlops-churn-dicoding"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-xs font-bold tracking-wider text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] border border-[var(--border)] px-4 py-3 flex items-center justify-center gap-2 transition-colors"
          >
            <span>VIEW GITHUB REPO</span>
            <span>↗</span>
          </a>
        </div>

        <Section label="The Full Stack">
          <CodeBlock code={`┌─────────────────────────────────────────────┐
│                   REQUEST                    │
└──────────────────────┬──────────────────────┘
                       ↓
          ┌────────────────────────┐
          │   FastAPI REST Server  │
          │   /predict endpoint    │
          └────────────┬───────────┘
                       ↓
          ┌────────────────────────┐
          │   MLflow Model Store   │
          │   Registered + Versioned│
          └────────────┬───────────┘
                       ↓
          ┌────────────────────────┐
          │  Prometheus Scraper    │
          │  (every 60 seconds)    │
          └────────────┬───────────┘
                       ↓
          ┌────────────────────────┐
          │   Grafana Dashboard    │
          │   + Drift Alerts       │
          └────────────────────────┘`} />
        </Section>

        <Section label="Why Drift Detection Matters">
          <p className="text-sm leading-relaxed mb-4">
            The most important metric to track isn&apos;t accuracy on your test set. It&apos;s
            <strong> prediction drift</strong> — the divergence between your training data
            distribution and the live data your model is seeing in production.
          </p>
          <p className="text-sm leading-relaxed">
            For the Telco Churn project, I tracked two signals: the distribution of predicted
            probabilities (confidence drift) and the feature value distributions (data drift).
            When either deviated beyond a threshold, Grafana fired a Slack alert automatically.
          </p>
        </Section>

        <Section label="The Setup in Three Steps">
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Instrument FastAPI",
                desc: "Expose a /metrics endpoint using the prometheus-fastapi-instrumentator library. This auto-tracks request latency, prediction count, and model confidence.",
                code: `from prometheus_fastapi_instrumentator import Instrumentator\nInstrumentator().instrument(app).expose(app)`,
              },
              {
                step: "02",
                title: "Configure Prometheus",
                desc: "Point Prometheus at your FastAPI /metrics endpoint with a 60-second scrape interval.",
                code: `scrape_configs:\n  - job_name: 'churn_model'\n    scrape_interval: 60s\n    static_configs:\n      - targets: ['fastapi:8000']`,
              },
              {
                step: "03",
                title: "Build the Grafana Dashboard",
                desc: "Import a standard FastAPI dashboard JSON, then add a custom panel for prediction confidence percentiles. Set an alert when p10 confidence drops below 0.55.",
                code: null,
              },
            ].map((s) => (
              <div key={s.step} className="border-l-2 border-[var(--border)] pl-4 hover:border-[var(--accent)] transition-colors duration-300">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-[var(--accent)] font-mono text-[10px] font-black">{s.step}</span>
                  <p className="font-bold">{s.title}</p>
                </div>
                <p className="text-[var(--muted)] text-xs leading-relaxed mb-2">{s.desc}</p>
                {s.code && <CodeBlock code={s.code} />}
              </div>
            ))}
          </div>
        </Section>

        <p>
          This single addition — real-time drift monitoring — is the difference between a toy
          project and a production-grade ML system. Every model you ship deserves an observable
          lifecycle, not just a one-time deployment.
        </p>
      </article>
    ),
  },
};

/* ─── Page ────────────────────────────────────────────────────────── */

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-20 animate-fade-in">

        {/* Breadcrumb */}
        <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] mb-10 font-bold">
          <Link href="/blog" className="hover:text-[var(--accent)] transition-colors duration-200">
            blog
          </Link>
          {" / "}
          <span className="text-[var(--text)]">{slug}</span>
        </p>

        {/* Header */}
        <div className="mb-10 pb-8 border-b border-[var(--border)]">
          <h1 className="text-2xl font-black mb-5 leading-tight tracking-tight text-[var(--text)]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono text-[var(--muted)]">{post.date}</span>
            <span className="text-[var(--border)]">—</span>
            <span className="text-[10px] font-mono text-[var(--muted)]">{post.readTime}</span>
            <div className="flex gap-2 ml-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-[9px] font-black tracking-widest uppercase border border-[var(--accent)] px-2 py-0.5 rounded-full text-[var(--accent)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {post.content}

        {/* Footer nav */}
        <div className="mt-14 pt-6 border-t border-dashed border-[var(--border)] flex items-center justify-between">
          <Link
            href="/blog"
            className="text-xs font-bold tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-200"
          >
            ← ALL ARTICLES
          </Link>
          <span className="text-[10px] text-[var(--muted)]">© 2026 kimsang silalahi.</span>
        </div>
      </main>
    </>
  );
}

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}
