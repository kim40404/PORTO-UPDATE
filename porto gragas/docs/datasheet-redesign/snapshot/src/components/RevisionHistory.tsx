import { Fragment, useState } from "react";
import SectionBar from "./SectionBar";
import { certifications, experience } from "../data/content";

/** oldest first: Rev A is the earliest entry on the record */
const revs = [...experience].reverse();

/** 44px tap box around an inline text control without changing the row height */
const tap = { display: "inline-block", padding: "13px 0", margin: "-13px 0" } as const;

/** REVISION HISTORY: Rev A to D from experience, each row expandable; then QUALIFICATIONS. */
export default function RevisionHistory() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section>
      <SectionBar id="revisions" label="Revision history" />
      <table className="ds-table stack">
        <thead>
          <tr>
            <th scope="col">Rev</th>
            <th scope="col">Date</th>
            <th scope="col">Description</th>
            <th scope="col">
              <span className="visually-hidden">Details</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {revs.map((job, i) => {
            const rev = String.fromCharCode(65 + i);
            const isOpen = open === i;
            const id = `rev-${rev}-details`;
            return (
              <Fragment key={job.company}>
                <tr>
                  <td data-label="Rev" className="num">
                    {rev}
                  </td>
                  <td data-label="Date">{job.period}</td>
                  <td data-label="Description" className="span">
                    <b>{job.company}</b>, {job.role}
                  </td>
                  <td data-label="" className="r span">
                    <button
                      type="button"
                      className="link"
                      style={tap}
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? id : undefined}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      {isOpen ? "Hide details" : "Details"}
                    </button>
                  </td>
                </tr>
                {isOpen && (
                  <tr id={id}>
                    <td colSpan={4} data-label="Details" className="span">
                      <ul className="features measure">
                        {job.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                      <p className="small" style={{ marginTop: 8 }}>
                        {job.place}
                      </p>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      <table className="ds-table stack" style={{ marginTop: 32 }}>
        <caption>Qualifications</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Detail</th>
          </tr>
        </thead>
        <tbody>
          {certifications.map((c) => (
            <tr key={c.name}>
              <td data-label="Name">{c.name}</td>
              <td data-label="Detail">{c.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
