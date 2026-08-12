"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Nav() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { href: "/", label: "home" },
    { href: "/about", label: "about" },
    { href: "/projects", label: "projects" },
    { href: "/blog", label: "blog" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between sm:justify-center px-4 sm:px-6 py-4 bg-[var(--bg)]">
      {/* Nav links centered on desktop, left-aligned on mobile */}
      <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm shrink-0 hover:text-[var(--accent)] transition-none ${
              isActive(href)
                ? "text-[var(--accent)] underline underline-offset-4"
                : "text-[var(--muted)]"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Theme toggle — inline on mobile right, absolute right on desktop */}
      <div className="shrink-0 sm:absolute sm:right-6 ml-2 sm:ml-0">
        {mounted ? (
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-none"
          >
            {resolvedTheme === "dark" ? "[light]" : "[dark]"}
          </button>
        ) : (
          <div className="w-[50px]"></div> /* Placeholder to prevent layout shift */
        )}
      </div>
    </nav>
  );
}
