import SectionBar from "./SectionBar";
import { applications, features, generalDescription, manifesto } from "../data/content";

/** Page 1, left column: FEATURES and APPLICATIONS. */
export default function FeaturesApplications() {
  return (
    <div>
      {/* the first bar sits close to the band: -24 collapses with the bar's 48px margin to 24 */}
      <div style={{ marginTop: -24 }}>
        <SectionBar id="features" label="Features" />
      </div>
      <ul className="features">
        {features.map((f) => (
          <li key={f.text}>
            {f.text}
            <span className="cond">{f.conditions}</span>
          </li>
        ))}
      </ul>

      <SectionBar id="applications" label="Applications" />
      <ul className="features">
        {applications.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
  );
}

/** Page 1, full width under both columns: GENERAL DESCRIPTION. */
export function GeneralDescription() {
  return (
    <div>
      <SectionBar id="description" label="General description" />
      <div className="description">
        <p className="lead">{manifesto}</p>
        {generalDescription.map((p) => (
          <p key={p} className="measure">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
