import { Nav } from "@/components/Nav";
import { AccordionItem } from "@/components/Accordion";

const TECH_STACK = [
  { cat: "AI & LLM", items: "Claude API · OpenAI API · LangChain · RAG · Prompt Engineering · PyTorch · Scikit-Learn · Hugging Face · Fine-Tuning" },
  { cat: "MLOps & Cloud", items: "MLflow · FastAPI · Docker · Prometheus · Grafana · AWS · Ollama · Python · PostgreSQL · Git" },
  { cat: "Full Stack & Automation", items: "n8n · ManyChat · ReactJS · Next.js · PHP 8.2 · Firebase · Web3 APIs · Lua (Roblox Studio)" },
];

const WORK = [
  { role: "AI Engineer (Intern)", company: "FlyRank AI", period: "Jul 2026 – Aug 2026", desc: "Engineered scalable LLM-powered content generation pipelines to automate SEO workflows, driving increased AI search visibility (AIO)." },
  { role: "AI & Software Engineering Consultant", company: "Independent", period: "Aug 2024 – Jun 2026", desc: "Spearheaded 4 end-to-end RAG applications with Claude/OpenAI APIs, reducing data extraction time by 60%. Synthesized a 1,182-item bilingual dataset via Ollama at zero API cost." },
  { role: "Game Developer", company: "Exstore.id", period: "Nov 2025 – Jan 2026", desc: "Led end-to-end development of 2 large-scale Roblox titles with custom token economies and integrated SuperBiz SDK analytics." },
  { role: "Software Engineer Intern", company: "Ministry of Law & Human Rights", period: "Jul 2024 – Aug 2024", desc: "Developed a government document automation tool (CodeIgniter4 + PHP), cutting manual processing time by 40% in a 4-week sprint." },
];

const TRIVIA = [
  "Anthropic Academy — completed all 18/18 courses",
  "GPA 3.78/4.00 — CumLaude, Universitas Sumatera Utara",
  "Published 1,182-item bilingual AI dataset on Hugging Face",
  "ICP Hackathon 11 — Advancing the Web3 Ecosystem",
  "MBKM student at INTI International University, Malaysia (2023–2024)",
  "English for IT certified by Cisco",
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="max-w-lg mx-auto px-6 pt-24 pb-20 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2 underline underline-offset-4">about me .</h1>
        <p className="text-xs text-[var(--muted)] mb-8">/ about</p>

        {/* Bio */}
        <div className="mb-10 text-sm leading-relaxed space-y-3 text-[var(--text)]">
          <p>
            I&apos;m Kimsang Silalahi — a CS graduate (GPA 3.78, CumLaude, Universitas Sumatera Utara)
            working as an AI & Agentic Systems Engineer. I specialize in building LLM applications,
            RAG pipelines, and production-grade MLOps infrastructure.
          </p>
          <p>
            Anthropic Academy certified (18/18 courses), and creator of a 1,182-item bilingual
            (ID-EN) agentic AI dataset published on Hugging Face — generated locally with Ollama at zero API cost.
          </p>
          <p>
            I see myself as a generalist who leans deeply into AI engineering — from data synthesis
            to model deployment and monitoring. I believe in building things that are reliable, measurable, and open.
          </p>
        </div>

        {/* Work Experience */}
        <section className="mb-10">
          <p className="text-xs font-bold mb-3 text-[var(--accent)] tracking-widest">WORK EXPERIENCE</p>
          <div className="border-t border-[var(--border)]">
            {WORK.map((w) => (
              <AccordionItem key={w.role} title={`${w.role} — ${w.company}`}>
                <p className="text-xs text-[var(--muted)] mb-1">{w.period}</p>
                <p>{w.desc}</p>
              </AccordionItem>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-10">
          <p className="text-xs font-bold mb-3 text-[var(--accent)] tracking-widest">TECH STACK</p>
          <div className="space-y-2">
            {TECH_STACK.map(({ cat, items }) => (
              <div key={cat} className="text-sm">
                <span className="text-[var(--muted)] mr-2">{cat}:</span>
                <span className="text-[var(--text)]">{items}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-10">
          <p className="text-xs font-bold mb-3 text-[var(--accent)] tracking-widest">EDUCATION</p>
          <div className="text-sm space-y-2">
            <div>
              <p className="font-semibold">Universitas Sumatera Utara</p>
              <p className="text-[var(--muted)]">B.Sc. Computer Science — GPA 3.78/4.00 (CumLaude) · 2021–2025</p>
            </div>
            <div>
              <p className="font-semibold">INTI International University, Malaysia</p>
              <p className="text-[var(--muted)]">Student Mobility / MBKM Humanitarian Initiative · 2023–2024</p>
            </div>
          </div>
        </section>

        {/* Quick Trivia - Accordion */}
        <section className="mb-12">
          <p className="text-xs font-bold mb-3 text-[var(--accent)] tracking-widest">QUICK TRIVIA</p>
          <div className="border-t border-[var(--border)]">
            <AccordionItem title="expand trivia . . .">
              <ul className="space-y-1">
                {TRIVIA.map((t) => (
                  <li key={t}>— {t}</li>
                ))}
              </ul>
            </AccordionItem>
          </div>
        </section>

        <footer className="pt-6 border-t border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
          © 2026 kimsang silalahi.
        </footer>
      </main>
    </>
  );
}
