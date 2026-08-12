import { Nav } from "@/components/Nav";
import Link from "next/link";
import { notFound } from "next/navigation";

const POSTS: Record<string, {
  date: string;
  title: string;
  tags: string[];
  content: React.ReactNode;
}> = {
  "synthesizing-agentic-data": {
    date: "Aug 12, 2026",
    title: "Synthesizing 1K Agentic Data Locally via Ollama",
    tags: ["AI", "Dataset", "Ollama"],
    content: (
      <article className="text-sm leading-relaxed space-y-4 text-[var(--text)]">
        <p>
          When I started building the bilingual agentic AI dataset, I had two hard constraints: 
          (1) No budget for OpenAI/Anthropic API calls, and (2) The data needed to be genuinely diverse 
          across 8 complex agentic categories.
        </p>
        <p>
          The solution was running <span className="text-[var(--accent)]">Ollama</span> locally with 
          open-source models like Mistral and Llama 3. The cost? Zero rupiah. The output? 
          A 1,182-item bilingual (ID-EN) instruction-response dataset now published openly on Hugging Face.
        </p>
        <p className="text-[var(--muted)] text-xs font-bold tracking-wider">THE PIPELINE</p>
        <pre className="bg-[var(--border)] p-4 text-xs overflow-x-auto">
{`# Simplified synthesis loop
for category in AGENTIC_CATEGORIES:
    for _ in range(ITEMS_PER_CATEGORY):
        prompt = build_prompt(category, lang="id")
        response = ollama.generate(model="mistral", prompt=prompt)
        dataset.append({"input": prompt, "output": response})`}
        </pre>
        <p>
          The key insight: high-quality <strong>prompt templates</strong> per category 
          matter far more than which model you use. Structure your prompts well, and any 
          capable 7B model will produce publishable data.
        </p>
        <p>
          The dataset is now indexed on Hugging Face and being used by other researchers 
          for cross-lingual agentic model evaluation. That&apos;s the power of open publishing.
        </p>
      </article>
    ),
  },
  "ai-citation-optimization": {
    date: "Jul 20, 2026",
    title: "The Mechanics of AI Citation Optimization (AIO)",
    tags: ["LLM", "SEO", "CiteReady"],
    content: (
      <article className="text-sm leading-relaxed space-y-4 text-[var(--text)]">
        <p>
          Traditional SEO optimizes for Google&apos;s PageRank algorithm. AI Citation Optimization (AIO) 
          optimizes for how <strong>LLMs decide what to cite</strong> — a fundamentally different problem.
        </p>
        <p>
          When ChatGPT or Perplexity answers a question, they pull from their retrieval context. 
          The content that gets cited isn&apos;t necessarily the content that ranks highest on Google. 
          It&apos;s the content that is most <span className="text-[var(--accent)]">structurally clear</span>, 
          factually dense, and contextually relevant to the LLM&apos;s query interpretation.
        </p>
        <p className="text-[var(--muted)] text-xs font-bold tracking-wider">THE THREE PILLARS OF AIO</p>
        <ul className="space-y-2 list-none">
          <li>— <strong>Density:</strong> Pack factual, entity-rich information into short paragraphs</li>
          <li>— <strong>Structure:</strong> Use clear H2/H3 headings that match natural query phrasing</li>
          <li>— <strong>Authority Signals:</strong> Reference numbers, dates, and named sources frequently</li>
        </ul>
        <p>
          This is the core logic behind <span className="text-[var(--accent)]">CiteReady</span> — 
          it audits your content against these three pillars and suggests restructuring that improves 
          your citation probability in AI-driven search results.
        </p>
      </article>
    ),
  },
  "production-mlops": {
    date: "Jun 05, 2026",
    title: "Designing Production-Ready MLOps with Grafana and Prometheus",
    tags: ["MLOps", "Docker", "Monitoring"],
    content: (
      <article className="text-sm leading-relaxed space-y-4 text-[var(--text)]">
        <p>
          Most ML tutorials stop at model training. But training is 10% of the work — 
          the other 90% is making sure the model doesn&apos;t silently fail in production.
        </p>
        <p>
          For the Telco Churn Prediction project, I built a complete MLOps stack from scratch: 
          MLflow for experiment tracking, FastAPI for serving, Docker for portability, 
          and Prometheus + Grafana for real-time monitoring.
        </p>
        <p className="text-[var(--muted)] text-xs font-bold tracking-wider">ARCHITECTURE OVERVIEW</p>
        <pre className="bg-[var(--border)] p-4 text-xs overflow-x-auto">
{`┌─────────────┐    ┌──────────┐    ┌─────────────┐
│  MLflow     │───▶│ FastAPI  │───▶│ Prometheus  │
│  Tracking   │    │  Server  │    │  + Grafana  │
└─────────────┘    └──────────┘    └─────────────┘
                        │
                    ┌───┴───┐
                    │ Docker │
                    └───────┘`}
        </pre>
        <p>
          The key metric to monitor isn&apos;t just accuracy — it&apos;s <strong>prediction drift</strong>. 
          When real-world data distribution shifts from training data, your model silently degrades. 
          Prometheus scrapes model confidence distributions every 60 seconds. 
          Grafana fires alerts when drift exceeds threshold.
        </p>
        <p>
          This single addition — real-time drift monitoring — is what separates a toy ML project 
          from a production-grade system.
        </p>
      </article>
    ),
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-20">
        {/* Breadcrumb */}
        <p className="text-xs text-[var(--muted)] mb-6">
          <Link href="/blog" className="hover:text-[var(--accent)] hover:underline">blog</Link>
          {" / "}{slug}
        </p>

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[var(--border)]">
          <h1 className="text-xl font-bold mb-3 underline underline-offset-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[var(--muted)]">{post.date}</span>
            {post.tags.map((t) => (
              <span key={t} className="text-xs border border-[var(--border)] px-1.5 py-0.5 text-[var(--muted)]">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        {post.content}

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t border-dashed border-[var(--border)]">
          <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] hover:underline">
            ← back to blog
          </Link>
        </div>

        <footer className="mt-6 text-xs text-[var(--muted)]">
          © 2026 kimsang silalahi.
        </footer>
      </main>
    </>
  );
}

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}
