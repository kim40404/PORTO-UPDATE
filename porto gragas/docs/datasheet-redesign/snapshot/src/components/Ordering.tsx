import { assets } from "../data/assets";
import { profile } from "../data/content";
import SectionBar from "./SectionBar";

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");
const tap = "link inline-flex min-h-11 items-center";

const PARTS = [
  { part: "KS-CV", desc: "Curriculum vitae, PDF, Rev. 2026-10", href: assets.cvPdf, text: "CV (PDF)", plate: true },
  { part: "KS-EMAIL", desc: "Email, for roles and project briefs", href: `mailto:${profile.email}`, text: profile.email },
  { part: "KS-WA", desc: "WhatsApp, fastest for Indonesian clients", href: profile.whatsapp, text: profile.phone },
  { part: "KS-LI", desc: "LinkedIn profile", href: profile.linkedin, text: bare(profile.linkedin) },
  { part: "KS-GH", desc: "GitHub, source for the projects on this sheet", href: profile.github, text: bare(profile.github) },
  { part: "KS-HF", desc: "Hugging Face, published dataset releases", href: profile.huggingface, text: bare(profile.huggingface) },
];

/** ORDERING INFORMATION: the contact table, availability, and the last page footer. */
export default function Ordering() {
  return (
    <section id="ordering-section">
      <SectionBar id="ordering" label="Ordering information" />
      <table className="ds-table stack">
        <thead>
          <tr>
            <th scope="col">Part</th>
            <th scope="col">Description</th>
            <th scope="col">Contact</th>
          </tr>
        </thead>
        <tbody>
          {PARTS.map((p) => {
            const ext = p.href.startsWith("http");
            return (
              <tr key={p.part}>
                <td data-label="Part" className="font-semibold">
                  {p.part}
                </td>
                <td data-label="Description">{p.desc}</td>
                <td data-label="Contact" className="span">
                  <a
                    className={p.plate ? "plate-btn" : tap}
                    href={p.href}
                    target={ext ? "_blank" : undefined}
                    rel={ext ? "noreferrer" : undefined}
                  >
                    {p.text}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="measure mt-5">{profile.availability}, remote-first.</p>
      <div className="sheet-foot" aria-label="Page 6 of 6">
        <span>
          <span className="num">Rev. 2026-10</span>
          <span aria-hidden="true"> | </span>
          <span className="num">Page 6 of 6</span>
        </span>
        <span>kimsilalahi.vercel.app</span>
      </div>
    </section>
  );
}
