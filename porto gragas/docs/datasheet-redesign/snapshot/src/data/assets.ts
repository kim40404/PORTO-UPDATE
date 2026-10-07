/**
 * Self-hosted portfolio assets, built by scripts/build-assets.py into public/images.
 * The manifest carries intrinsic sizes so every <img> can reserve its box.
 */
import manifest from "./asset-manifest.json";

export type AssetKey = keyof typeof manifest;

type AssetEntry = { src: string; width: number; height: number; variants: Record<string, string> };

export const assetMeta = manifest as Record<AssetKey, AssetEntry>;

export const assets = {
  cvPdf: "/Kimsang_Silalahi_CV.pdf",
  ...(Object.fromEntries(Object.entries(assetMeta).map(([k, v]) => [k, v.src])) as Record<AssetKey, string>),
};

/** srcset string for responsive images: "/images/x-800.webp 800w, /images/x.webp 1600w" */
export function srcSet(key: AssetKey): string {
  return Object.entries(assetMeta[key].variants)
    .map(([w, src]) => `${src} ${w}w`)
    .join(", ");
}
