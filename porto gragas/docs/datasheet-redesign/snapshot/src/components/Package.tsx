import { useState } from "react";
import SectionBar from "./SectionBar";
import Frame from "./Frame";
import Drawer from "./Drawer";
import { assetMeta, assets, srcSet, type AssetKey } from "../data/assets";
import { aboutFacts, portraits, profile, searchDiscovery } from "../data/content";

/* portraits carry the src; the manifest key is looked up so each <img> gets its size and srcset */
const keys = Object.keys(assetMeta) as AssetKey[];
const views = portraits.map((p) => ({ ...p, key: keys.find((k) => assetMeta[k].src === p.image)! }));
const search = assetMeta.chatgptDiscovery;

export default function Package() {
  const [view, setView] = useState(0);
  const [open, setOpen] = useState(false);
  const p = views[view];
  const m = assetMeta[p.key];
  const alt = `${profile.name}, ${p.label.toLowerCase()} portrait`;

  return (
    <section>
      <SectionBar id="package" label="Package" aside={profile.location} />
      <div className="grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-10 lg:items-start">
        <Frame
          n="13"
          title="Package view"
          aside={p.label}
          className="portrait"
          foot={
            <div className="seg" role="group" aria-label="Package view">
              {views.map((v, i) => (
                <button key={v.key} type="button" aria-pressed={i === view} onClick={() => setView(i)} style={{ minHeight: 44 }}>
                  {v.label}
                </button>
              ))}
            </div>
          }
        >
          {/* package drawing: the photo with its outline dimensions called out, as a mechanical drawing does */}
          <div className="pkg">
            <span className="dim x" aria-hidden="true">
              <span>{m.width} px</span>
            </span>
            <span className="dim y" aria-hidden="true">
              <span>{m.height} px</span>
            </span>
            <img
              key={p.key}
              className="shot"
              src={p.image}
              srcSet={srcSet(p.key)}
              sizes="(min-width:1024px) 40vw, 100vw"
              width={m.width}
              height={m.height}
              loading={view ? "lazy" : undefined}
              decoding="async"
              alt={alt}
            />
          </div>
        </Frame>

        <div className="grid gap-4 content-start">
          <h3 className="h">B.Sc. Computer Science, USU, 2021 to 2025, Cum Laude</h3>
          <table className="ds-table stack">
            <caption>Package data</caption>
            <thead>
              <tr>
                <th scope="col">Parameter</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {aboutFacts.map((f) => (
                <tr key={f.k}>
                  <td data-label="Parameter">{f.k}</td>
                  <td data-label="Value">{f.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small measure">
            {profile.availability}. Based in {profile.location}, {profile.timezone} ({profile.tzLabel}).
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Frame
          n="12"
          title="Search observation"
          aside="ChatGPT, Medan query"
          figureId="search"
          className="wide"
          conditions={searchDiscovery.note}
          foot={
            <p>
              <button type="button" className="link" onClick={() => setOpen(true)} style={{ minHeight: 44, display: "inline-flex", alignItems: "center" }}>
                Enlarge
              </button>
            </p>
          }
        >
          <img
            className="shot"
            src={assets.chatgptDiscovery}
            srcSet={srcSet("chatgptDiscovery")}
            sizes="(min-width:1024px) 1100px, 100vw"
            width={search.width}
            height={search.height}
            loading="lazy"
            decoding="async"
            alt={searchDiscovery.imageAlt}
            style={{ width: "100%", height: "100%", objectFit: "contain", border: 0, background: "transparent" }}
          />
        </Frame>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} label="Figure 12 detail sheet">
        <img
          className="shot"
          src={assets.chatgptDiscovery}
          srcSet={srcSet("chatgptDiscovery")}
          sizes="min(100vw, 56rem)"
          width={search.width}
          height={search.height}
          decoding="async"
          alt={searchDiscovery.imageAlt}
        />
        <p className="small measure" style={{ marginTop: 12 }}>
          {searchDiscovery.note}
        </p>
      </Drawer>
    </section>
  );
}
