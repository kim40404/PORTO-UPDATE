import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getLenis } from "../lib/motion";

interface Props {
  open: boolean;
  onClose: () => void;
  /** datasheet-style head, e.g. "Figure 4 detail sheet" */
  label: string;
  children: React.ReactNode;
}

/** A detail sheet sliding in from the right: focus moves in, Escape closes, scroll is locked behind it. */
export default function Drawer({ open, onClose, label, children }: Props) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const scrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => {
      setShown(true);
      closeBtn.current?.focus({ preventScroll: true });
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      setShown(false);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
      lenis?.start();
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={`drawer-root${shown ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label={label}>
      <div className="drawer-shade" onClick={onClose} />
      <div className="drawer" data-lenis-prevent>
        <div className="drawer-head">
          <span>{label}</span>
          <button ref={closeBtn} type="button" onClick={onClose} className="plate-btn on-band" style={{ minHeight: 36 }}>
            Close
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
