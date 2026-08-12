import { Nav } from "@/components/Nav";
import { AccordionItem } from "@/components/Accordion";

const PROJECTS = {
  "NOTABLE AI PROJECTS": [
    {
      title: "CiteReady — AI Search Visibility Auditor",
      href: "https://cite-ready.vercel.app",
      repo: "https://github.com/kim40404/citeready-backend",
      desc: "Developed a pioneering AI Search Visibility Auditor (SaaS) for LLM engines. Engineered the core NLP evaluation logic to dynamically restructure web content into prompt-friendly formats, directly increasing accurate AI citations.",
      stack: ["Next.js", "OpenAI API", "Prompt Engineering", "Vercel"],
    },
    {
      title: "Bilingual Agentic AI Dataset",
      href: "https://huggingface.co/datasets/Kimsang766/agentic-ai-instructions-id-en",
      repo: "",
      desc: "Synthesized a comprehensive 1,182-item bilingual (ID-EN) dataset covering 8 complex agentic AI categories via local Ollama instances at zero cost. Published globally on Hugging Face as an open-source baseline.",
      stack: ["Python", "Ollama", "Hugging Face", "NLP"],
    },
    {
      title: "MLOps Churn Prediction",
      href: "https://github.com/kim40404/mlops-churn-dicoding",
      repo: "https://github.com/kim40404/mlops-churn-dicoding",
      desc: "Engineered a production-ready ML pipeline for Telco Churn prediction with end-to-end experiment tracking via MLflow. Integrated Prometheus and Grafana for real-time performance monitoring and drift detection.",
      stack: ["MLflow", "FastAPI", "Docker", "Prometheus", "Grafana"],
    },
    {
      title: "IoT Honey Quality Monitoring",
      href: "",
      repo: "",
      desc: "Real-time 5-sensor IoT system with K-NN classifier achieving 88.25% predictive accuracy across all test batches. Hardware includes ESP32, DHT22, MQ-135, TDS, and LDR sensors.",
      stack: ["ESP32", "K-NN", "Firebase", "C++"],
    },
  ],
  "FULL STACK & PLATFORM": [
    {
      title: "GrowMate — Collaboration Platform",
      href: "https://growmate-app.vercel.app",
      repo: "https://github.com/kim40404/growmate-app",
      desc: "Architected a full-stack platform to match users by shared skills. Implemented real-time matchmaking algorithms and role-based security protocols using PostgreSQL for a highly secure user experience.",
      stack: ["ReactJS", "PostgreSQL", "REST APIs", "Vercel"],
    },
    {
      title: "Secure Task Management Platform",
      href: "https://github.com/KimiSilalahi766/To-do-list-Project",
      repo: "https://github.com/KimiSilalahi766/To-do-list-Project",
      desc: "Role-based task platform with secure sessions, full CRUD operations, and strict security protocols built on PHP 8.2 + PostgreSQL.",
      stack: ["PHP 8.2", "PostgreSQL", "CodeIgniter"],
    },
  ],
  "GAME DEVELOPMENT": [
    {
      title: "Gunung Gila — Roblox RPG",
      href: "https://www.roblox.com/games/89937206445659/GUNUNG-GILA",
      repo: "",
      desc: "Core mechanics for a climbing RPG with custom token economy and advanced Lua scripting. Developed at Exstore.id over 3 sprints.",
      stack: ["Lua", "Roblox Studio", "SuperBiz SDK"],
    },
  ],
};

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="max-w-lg mx-auto px-6 pt-24 pb-20">
        <h1 className="text-2xl font-bold mb-2 underline underline-offset-4">projects .</h1>
        <p className="text-xs text-[var(--muted)] mb-8">/ projects — things I&apos;ve built</p>

        {Object.entries(PROJECTS).map(([category, items]) => (
          <section key={category} className="mb-10">
            <p className="text-xs font-bold mb-3 text-[var(--accent)] tracking-widest">{category}</p>
            <div className="border-t border-[var(--border)]">
              {items.map((project) => (
                <AccordionItem key={project.title} title={project.title}>
                  <p className="mb-3">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.stack.map((t) => (
                      <span key={t} className="text-xs border border-[var(--border)] px-2 py-0.5 text-[var(--muted)]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a href={project.href} target="_blank" rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline underline-offset-2 text-xs">
                      View Project →
                    </a>
                    {project.repo && (
                      <a href={project.repo} target="_blank" rel="noopener noreferrer"
                        className="text-[var(--muted)] hover:text-[var(--accent)] hover:underline underline-offset-2 text-xs">
                        GitHub →
                      </a>
                    )}
                  </div>
                </AccordionItem>
              ))}
            </div>
          </section>
        ))}

        <footer className="pt-6 border-t border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
          © 2026 kimsang silalahi.
        </footer>
      </main>
    </>
  );
}
