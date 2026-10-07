import { PAGES } from "../App";
import { assets } from "../data/assets";

/** Page footer between datasheet pages. On phones it repeats the ordering row so CV is never a page away. */
export default function SheetFooter({ page }: { page: number }) {
  return (
    <div className="sheet-foot" aria-label={`Page ${page} of ${PAGES}`}>
      <span>
        <span className="num">Rev. 2026-10</span>
        <span aria-hidden="true"> | </span>
        <span className="num">
          Page {page} of {PAGES}
        </span>
      </span>
      <span className="lg:hidden">
        <a className="link" href={assets.cvPdf} target="_blank" rel="noreferrer">
          CV (PDF)
        </a>
      </span>
      <span>kimsilalahi.vercel.app</span>
    </div>
  );
}
