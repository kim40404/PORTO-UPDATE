import { assets } from "../data/assets";
import { profile } from "../data/content";

const tap = "link inline-flex min-h-11 items-center";

/** Page-1 cobalt band: part title, three lines, and the ordering row. */
export default function HeaderBand() {
  return (
    <header className="band">
      <div>
        <h1 className="part-title">{profile.name}</h1>
        <p className="part-lines">
          <span>{profile.role}</span>
          <span><span className="nb">LLM applications,</span> <span className="nb">retrieval systems,</span> <span className="nb">production MLOps</span></span>
          <span>
            {profile.location} ({profile.tzLabel})
          </span>
        </p>
      </div>
      <div className="ordering">
        <a className="plate-btn on-band w-full lg:w-auto" href={assets.cvPdf} target="_blank" rel="noreferrer">
          CV (PDF)
        </a>
        <a className={tap} href={`mailto:${profile.email}`}>
          Email
        </a>
        <a className={tap} href={profile.whatsapp} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <a className={tap} href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className={tap} href={profile.huggingface} target="_blank" rel="noreferrer">
          Hugging Face
        </a>
        <a className={tap} href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <span className="rev">Rev. 2026-10</span>
      </div>
    </header>
  );
}
