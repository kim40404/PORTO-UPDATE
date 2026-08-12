"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hoverClass = mounted && resolvedTheme === "dark"
    ? "hover:bg-orange-400 hover:text-black"
    : "hover:bg-green-400 hover:text-black";

  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-2 py-2 text-sm text-left ${hoverClass} transition-none group`}
      >
        <span className="font-medium">{title}</span>
        <span className="text-[var(--muted)]">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-2 py-3 text-sm text-[var(--muted)] space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
