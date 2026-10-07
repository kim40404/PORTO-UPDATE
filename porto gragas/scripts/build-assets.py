"""Build self-hosted, compressed image assets for the portfolio.

Sources: the original files in the old portfolio's public/ folder (local) and
six screenshots from the mlops-churn-dicoding GitHub repo (downloaded once).
Output: public/images/<slug>.webp (max 1600px wide) + <slug>-800.webp, the CV
PDF, and src/data/asset-manifest.json with intrinsic sizes for width/height.

Run from the project root:  python scripts/build-assets.py
"""
from __future__ import annotations

import io
import json
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OLD_PUBLIC = ROOT.parent / "develop-cinematic-3d-portfolio" / "public"
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "src" / "data" / "asset-manifest.json"
CHURN = "https://raw.githubusercontent.com/kim40404/mlops-churn-dicoding/main/assets/"

# key -> (source, kind). kind: photo | shot | alpha
SOURCES: dict[str, tuple[str, str]] = {
    "cutout": ("images/kimsang-about-cutout.png", "alpha"),
    "cutoutAlt": ("images/Kimsang setengah badan background kosong.png", "alpha"),
    "portraitFormal": ("images/Kim Pass foto.jpg", "photo"),
    "portraitUrban": ("images/kimsang-portrait.jpg", "photo"),
    "portraitRobot": ("images/kimsang-robot.jpg", "photo"),
    "citeready": ("images/citeready.png", "shot"),
    "lolosPcpm": ("images/LolosPCPM.png", "shot"),
    "mlopsDashboard": ("images/mlops-dashboard.png", "shot"),
    "churn": ("images/churn.png", "shot"),
    "honeyQuality": ("images/Honey_Quality.png", "shot"),
    "growmate": ("images/growmate.png", "shot"),
    "huggingface": ("images/huggingface.avif", "shot"),
    "churnDashboard": (CHURN + "The_Executive_Dashboard.png", "shot"),
    "churnHighRisk": (CHURN + "High-Risk%20Churn%20Detection.png", "shot"),
    "churnShap": (CHURN + "Inference%20Driver%20Weights.png", "shot"),
    "churnGrafana": (CHURN + "Real-Time%20Telemetry%20Grafana.png", "shot"),
    "churnMlflow": (CHURN + "Experiment%20Tracking.png", "shot"),
    "churnSwagger": (CHURN + "REST%20API%20Documentation.png", "shot"),
    "chatgptDiscovery": ("images/AI search discovery.jpeg", "shot"),
    "chatgptDiscoveryAlt": ("images/ai-portfolio-chatgpt-discovery.png", "shot"),
    "workflow": ("images/ai-portfolio-workflow.png", "shot"),
    "projectDiscovery": ("images/ai-portfolio-project-discovery.png", "shot"),
    "halfDayHero": ("images/ai-portfolio-half-day-hero.png", "shot"),
    "contactCta": ("images/ai-portfolio-contact-cta.png", "shot"),
    "displacement": ("images/displacement.jpg", "photo"),
}
# Only keys referenced by src/ are built (plus the cutout portrait, kept as design material).
USED = {
    "cutout", "portraitFormal", "portraitUrban", "portraitRobot", "citeready", "lolosPcpm",
    "honeyQuality", "growmate", "huggingface", "churnDashboard", "churnHighRisk", "churnShap",
    "churnGrafana", "churnMlflow", "churnSwagger", "chatgptDiscovery", "workflow",
}
WIDTHS = (1600, 800)
QUALITY = {"photo": 80, "shot": 82, "alpha": 85}


def slug(key: str) -> str:
    return "".join("-" + c.lower() if c.isupper() else c for c in key)


def load(src: str) -> Image.Image:
    if src.startswith("http"):
        with urllib.request.urlopen(src, timeout=60) as r:  # noqa: S310 - fixed allowlist above
            return Image.open(io.BytesIO(r.read()))
    return Image.open(OLD_PUBLIC / src)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict] = {}
    for key, (src, kind) in SOURCES.items():
        if key not in USED:
            continue
        im = load(src)
        im = im.convert("RGBA" if kind == "alpha" else "RGB")
        w, h = im.size
        entry = {"src": f"/images/{slug(key)}.webp", "width": min(w, WIDTHS[0]), "height": 0, "variants": {}}
        for target in WIDTHS:
            if w < target and target != WIDTHS[0]:
                continue  # no upscaling; the 800 variant only exists when the source is wider
            scale = min(1.0, target / w)
            out = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS) if scale < 1 else im
            name = f"{slug(key)}.webp" if target == WIDTHS[0] else f"{slug(key)}-{target}.webp"
            out.save(OUT / name, "WEBP", quality=QUALITY[kind], method=6)
            entry["variants"][str(target)] = f"/images/{name}"
            if target == WIDTHS[0]:
                entry["width"], entry["height"] = out.size
        manifest[key] = entry
        print(f"{key:20s} {w}x{h} -> {entry['width']}x{entry['height']}  {(OUT / (slug(key) + '.webp')).stat().st_size // 1024} KB")
    cv = OLD_PUBLIC / "Kimsang_Silalahi_CV.pdf"
    (ROOT / "public" / "Kimsang_Silalahi_CV.pdf").write_bytes(cv.read_bytes())
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    total = sum(p.stat().st_size for p in OUT.glob("*.webp")) // 1024
    print(f"\n{len(manifest)} assets, {total} KB total in {OUT}")


if __name__ == "__main__":
    main()
