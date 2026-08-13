import { Nav } from "@/components/Nav";
import Link from "next/link";

const POSTS = [
  {
    slug: "synthesizing-agentic-data",
    date: "Aug 12, 2026",
    readTime: "5 min read",
    title: "Synthesizing 1K Agentic AI Data Locally via Ollama",
    tags: ["AI", "Dataset", "Ollama"],
    preview:
      "How I generated 1,182 bilingual agentic AI instruction pairs using local LLMs — zero API cost, zero compromise on quality.",
    accent: "Built from scratch. No cloud. No budget.",
  },
  {
    slug: "ai-citation-optimization",
    date: "Jul 20, 2026",
    readTime: "4 min read",
    title: "The Mechanics of AI Citation Optimization (AIO)",
    tags: ["LLM", "SEO", "CiteReady"],
    preview:
      "Traditional SEO is dead for AI-driven search. AIO is about restructuring your content so that ChatGPT, Perplexity, and Gemini actually cite you.",
    accent: "The next frontier after SEO.",
  },
  {
    slug: "production-mlops",
    date: "Jun 05, 2026",
    readTime: "6 min read",
    title: "Designing Production-Ready MLOps with Grafana & Prometheus",
    tags: ["MLOps", "Docker", "Monitoring"],
    preview:
      "Training a model is 10% of the work. The remaining 90% is keeping it alive in production — and here's exactly how I did it.",
    accent: "Beyond the Jupyter notebook.",
  },
];

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-20 animate-fade-in">

        {/* Page Header */}
        <div className="mb-14">
          <h1 className="text-3xl font-bold mb-1 underline underline-offset-4 tracking-tight">
            blog .
          </h1>
          <p className="text-xs text-[var(--muted)] mt-2 mb-6 border-l-2 border-[var(--accent)] pl-3">
            / technical writings, notes, and unstructured thoughts
          </p>

          {/* Stats bar */}
          <div className="flex gap-6 text-[10px] tracking-widest uppercase text-[var(--muted)] font-bold border-t border-b border-[var(--border)] py-2">
            <span>{POSTS.length} articles</span>
            <span>·</span>
            <span>AI · MLOps · System Design</span>
            <span>·</span>
            <span>EN</span>
          </div>
        </div>

        {/* Post list */}
        <div className="space-y-0">
          {POSTS.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="relative py-8 border-b border-[var(--border)] group-hover:border-[var(--accent)] transition-colors duration-500">

                {/* Large background number */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[80px] font-black leading-none text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-700 select-none opacity-60 group-hover:opacity-100">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Meta row */}
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <span className="text-[10px] font-mono text-[var(--muted)]">{post.date}</span>
                  <span className="text-[var(--border)]">—</span>
                  <span className="text-[10px] font-mono text-[var(--muted)]">{post.readTime}</span>
                  <div className="flex gap-2 ml-auto">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-bold tracking-widest uppercase border border-[var(--border)] group-hover:border-[var(--accent)] px-2 py-0.5 rounded-full text-[var(--muted)] group-hover:text-[var(--accent)] transition-all duration-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-2 relative z-10 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-300 leading-snug pr-16">
                  {post.title}
                </h2>

                {/* Accent hook */}
                <p className="text-[10px] tracking-widest uppercase text-[var(--accent)] font-bold mb-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ✦ {post.accent}
                </p>

                {/* Preview */}
                <p className="text-sm text-[var(--muted)] leading-relaxed relative z-10 pr-16">
                  {post.preview}
                </p>

                {/* Read more */}
                <div className="mt-4 text-xs font-bold tracking-wider text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-300 relative z-10">
                  READ ARTICLE →
                </div>
              </article>
            </Link>
          ))}
        </div>

        <footer className="pt-8 mt-4 text-xs text-[var(--muted)]">
          © 2026 kimsang silalahi.
        </footer>
      </main>
    </>
  );
}
