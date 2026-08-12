import { Nav } from "@/components/Nav";
import Link from "next/link";

const POSTS = [
  {
    slug: "synthesizing-agentic-data",
    date: "Aug 12, 2026",
    title: "Synthesizing 1K Agentic Data Locally via Ollama",
    tags: ["AI", "Dataset", "Ollama"],
    preview: "How I generated a 1,182-item bilingual agentic AI dataset using local LLMs without spending a single rupiah on API costs.",
  },
  {
    slug: "ai-citation-optimization",
    date: "Jul 20, 2026",
    title: "The Mechanics of AI Citation Optimization (AIO)",
    tags: ["LLM", "SEO", "CiteReady"],
    preview: "Traditional SEO is dead for AI-driven search. AIO is about restructuring your content to be cited by ChatGPT, Perplexity, and Google AI Overviews.",
  },
  {
    slug: "production-mlops",
    date: "Jun 05, 2026",
    title: "Designing Production-Ready MLOps with Grafana and Prometheus",
    tags: ["MLOps", "Docker", "Monitoring"],
    preview: "A practical guide to setting up MLflow experiment tracking, Docker deployment, and real-time monitoring dashboards for ML models in production.",
  },
];

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-20">
        <h1 className="text-3xl font-bold mb-2 underline underline-offset-4 tracking-tight">blog .</h1>
        <p className="text-sm text-[var(--muted)] mb-12 border-l-2 border-[var(--accent)] pl-3">/ technical writings, notes, and unstructured thoughts</p>

        <div className="space-y-6">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block group relative p-4 -mx-4 rounded-sm border border-transparent hover:border-[var(--border)] hover:bg-[var(--accent)] hover:text-black transition-all duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-[var(--muted)] group-hover:text-black opacity-80">{post.date}</span>
                <div className="flex gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="text-[10px] font-bold tracking-wider uppercase border border-[var(--border)] group-hover:border-black px-2 py-0.5 rounded-full text-[var(--muted)] group-hover:text-black">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-lg font-bold group-hover:text-black mb-2">{post.title}</p>
              <p className="text-sm text-[var(--muted)] group-hover:text-black leading-relaxed">{post.preview}</p>
              
              {/* Subtle hover arrow */}
              <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity text-black font-bold">
                →
              </div>
            </Link>
          ))}
        </div>

        <footer className="pt-6 mt-6 border-t border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
          © 2026 kimsang silalahi.
        </footer>
      </main>
    </>
  );
}
