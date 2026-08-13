import { Nav } from "@/components/Nav";

import Image from "next/image";

const PROJECTS = {
  "NOTABLE AI PROJECTS": [
    {
      title: "CiteReady — AI Search Visibility Auditor",
      image: "/citeready.png",
      href: "https://cite-ready.vercel.app",
      repo: "https://github.com/kim40404/citeready-backend",
      desc: "Developed a pioneering AI Search Visibility Auditor (SaaS) for LLM engines. Engineered the core NLP evaluation logic to dynamically restructure web content into prompt-friendly formats, directly increasing accurate AI citations.",
      stack: ["Next.js", "OpenAI API", "Prompt Engineering", "Vercel"],
    },
    {
      title: "Bilingual Agentic AI Dataset",
      image: "/huggingface.avif",
      href: "https://huggingface.co/datasets/Kimsang766/agentic-ai-instructions-id-en",
      repo: "",
      desc: "Synthesized a comprehensive 1,182-item bilingual (ID-EN) dataset covering 8 complex agentic AI categories via local Ollama instances at zero cost. Published globally on Hugging Face as an open-source baseline.",
      stack: ["Python", "Ollama", "Hugging Face", "NLP"],
    },
    {
      title: "MLOps Churn Prediction",
      image: "/churn.png",
      href: "",
      repo: "https://github.com/kim40404/mlops-churn-dicoding",
      desc: "Engineered a production-ready ML pipeline for Telco Churn prediction with end-to-end experiment tracking via MLflow. Integrated Prometheus and Grafana for real-time performance monitoring and drift detection.",
      stack: ["MLflow", "FastAPI", "Docker", "Prometheus", "Grafana"],
    },
    {
      title: "IoT Honey Quality Monitoring",
      image: "/Honey_Quality.png",
      href: "https://beemy-fe0b9.web.app/",
      repo: "",
      desc: "Real-time 5-sensor IoT system with K-NN classifier achieving 88.25% predictive accuracy across all test batches. Hardware includes ESP32, DHT22, MQ-135, TDS, and LDR sensors.",
      stack: ["ESP32", "K-NN", "Firebase", "C++"],
    },
  ],
  "FULL STACK & PLATFORM": [
    {
      title: "GrowMate — Collaboration Platform",
      image: "/growmate.png",
      href: "https://growmate-app.vercel.app",
      repo: "https://github.com/kim40404/growmate-app",
      desc: "Architected a full-stack platform to match users by shared skills. Implemented real-time matchmaking algorithms and role-based security protocols using PostgreSQL for a highly secure user experience.",
      stack: ["ReactJS", "PostgreSQL", "REST APIs", "Vercel"],
    },
    {
      title: "PDF Summarizer",
      image: "/pdf_Summarize.jpg",
      href: "",
      repo: "https://github.com/kim40404/PDF-SUMMARY",
      desc: "A smart document processing tool that automatically summarizes dense PDF files, enabling users to quickly extract key insights without reading through pages of text.",
      stack: ["Python", "NLP", "LLM", "Streamlit"],
    },
  ],
  "GAME DEVELOPMENT": [
    {
      title: "Gunung Gila — Roblox RPG",
      image: "/roblox.png",
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
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-20 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2 underline underline-offset-4">projects .</h1>
        <p className="text-xs text-[var(--muted)] mb-10">/ projects — things I&apos;ve built</p>

        {Object.entries(PROJECTS).map(([category, items]) => (
          <fieldset key={category} className="mb-12 border border-[var(--border)] p-6 pt-4 hover:border-[var(--accent)] transition-colors duration-500 group rounded-sm">
            <legend className="text-xs font-bold px-2 text-[var(--accent)] tracking-widest group-hover:text-[var(--text)] transition-colors duration-500 uppercase">
              [ {category} ]
            </legend>
            <div className={`grid gap-8 mt-4 ${items.length === 1 ? 'grid-cols-1 sm:max-w-md sm:mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {items.map((project) => (
                <div key={project.title} className="flex flex-col border-l-2 border-transparent hover:border-[var(--accent)] pl-4 transition-colors duration-500 group/item">
                  <p className="font-bold text-lg mb-3 text-[var(--text)] group-hover/item:text-[var(--accent)] transition-colors duration-300">{project.title}</p>
                  
                  {project.image && (
                    <div className="relative w-full aspect-video mb-4 overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--bg)]">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        unoptimized
                        className="object-contain grayscale group-hover/item:grayscale-0 group-hover/item:scale-105 transition-all duration-1000 ease-in-out"
                      />
                    </div>
                  )}

                  <p className="mb-4 text-sm leading-relaxed text-[var(--muted)] group-hover/item:text-[var(--text)] transition-colors duration-500">{project.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.stack.map((t) => (
                      <span key={t} className="text-[10px] font-bold tracking-wider uppercase border border-[var(--border)] px-2 py-1 rounded-full text-[var(--muted)] group-hover/item:border-[var(--text)] group-hover/item:text-[var(--text)] transition-colors duration-500">
                        {t}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-auto flex gap-5">
                    {project.href && (
                      <a href={project.href} target="_blank" rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline underline-offset-2 text-xs font-bold tracking-wide">
                        VIEW PROJECT →
                      </a>
                    )}
                    {project.repo && (
                      <a href={project.repo} target="_blank" rel="noopener noreferrer"
                        className="text-[var(--muted)] hover:!text-[var(--accent)] hover:underline underline-offset-2 text-xs font-bold tracking-wide transition-colors duration-300">
                        GITHUB →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        ))}

        <footer className="pt-6 border-t border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
          © 2026 kimsang silalahi.
        </footer>
      </main>
    </>
  );
}
