import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";

const RECENT_POSTS = [
  { date: "Aug 12, 2026", title: "Synthesizing 1K Agentic Data Locally via Ollama", href: "/blog/synthesizing-agentic-data" },
  { date: "Jul 20, 2026", title: "The Mechanics of AI Citation Optimization (AIO)", href: "/blog/ai-citation-optimization" },
  { date: "Jun 05, 2026", title: "Designing Production-Ready MLOps with Grafana and Prometheus", href: "/blog/production-mlops" },
];

export default function Home() {
  return (
    <>
      <Nav />
      {/* Narrower: max-w-lg = 576px, centered */}
      <main className="max-w-lg mx-auto px-6 pt-16 pb-12">

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2 underline underline-offset-4">
          hello world . . .
        </h1>

        {/* 
          Hero Image — The trick for dark/light adaptation:
          - Light mode: image shows as-is (black sketch on white bg)
          - Dark mode: CSS `invert(1)` flips it to (white sketch on black bg)
          - grayscale() ensures no color bleeds
          - hover: removes grayscale for a subtle "activation" effect
        */}
        <div className="mb-3 overflow-hidden">
          <Image
            src="/hero.png"
            alt="Kimsang — AI Engineer hacking away"
            width={576}
            height={576}
            className="w-full object-cover adaptive-hero"
            unoptimized
            priority
          />
        </div>

        {/* Profile Box */}
        <div className="mb-8 border border-[var(--border)] p-4">
          <p className="text-xs font-bold mb-2 text-[var(--accent)] tracking-widest">PROFILE</p>
          <p className="text-sm text-[var(--text)] leading-relaxed">
            An AI Engineer and CS graduate (GPA 3.78/4.00, CumLaude, Universitas Sumatera Utara)
            specializing in LLM applications, RAG systems, and agentic AI pipelines. Certified by Anthropic Academy (18/18 courses).
            I build data-driven intelligent solutions and production-ready MLOps pipelines.
            More on{" "}
            <Link href="/about" className="text-[var(--accent)] underline underline-offset-2 hover:opacity-70">
              about
            </Link>{" "}
            page
          </p>
        </div>

        {/* Recent Posts */}
        <section className="mb-8">
          <p className="text-xs font-bold mb-3 text-[var(--accent)] tracking-widest">RECENT POSTS</p>
          <ul className="space-y-1">
            {RECENT_POSTS.map((post) => (
              <li key={post.href} className="text-sm">
                <Link href={post.href} className="flex flex-col sm:flex-row sm:gap-4 hover:text-[var(--accent)] group">
                  <span className="shrink-0 text-[var(--muted)] group-hover:text-[var(--accent)]">- {post.date}</span>
                  <span className="underline-offset-2 group-hover:underline">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] mt-3 block">
            [read more...] →
          </Link>
        </section>

        {/* Social Links */}
        <section className="mb-8">
          <p className="text-xs font-bold mb-3 text-[var(--accent)] tracking-widest">LINKS</p>
          <ul className="space-y-1 text-sm">
            {[
              { label: "GitHub", href: "https://github.com/kim40404" },
              { label: "Hugging Face", href: "https://huggingface.co/kimsangsilalahi" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/" },
              { label: "Email — kimsilalahi@gmail.com", href: "mailto:kimsilalahi@gmail.com" },
            ].map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)] hover:underline underline-offset-2"
                >
                  → {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="pt-4 border-t border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
          © 2026 kimsang silalahi.
        </footer>
      </main>
    </>
  );
}
