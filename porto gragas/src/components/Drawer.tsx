import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap, getLenis, reduceMotion } from "../lib/motion";

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}

export default function Drawer({ open, onClose, label, children }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });

    if (!reduceMotion()) {
      gsap.fromTo(shade.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: "expo.out" });
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label={label}>
      <div ref={shade} className="absolute inset-0 bg-black/65" onClick={onClose} />
      <div
        ref={panel}
        data-lenis-prevent
        className="drawer absolute inset-y-0 right-0 w-full max-w-[54rem] overflow-y-auto overscroll-contain"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg px-6 py-4 sm:px-10">
          <span className="label opacity-60">{label}</span>
          <button ref={closeBtn} type="button" onClick={onClose} className="btn-ghost label py-2!">
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="px-6 pb-16 pt-8 sm:px-10">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
