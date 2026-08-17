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
      <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar pr-24 sm:pr-0">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm shrink-0 transition-colors duration-200 hover:!text-[var(--accent)] ${
              isActive(href)
                ? "text-[var(--accent)] underline underline-offset-4"
                : "text-[var(--muted)]"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* CV Button and Theme Toggle grouped on the right */}
      <div className="absolute right-4 sm:right-6 flex items-center gap-3 sm:gap-4">
        {/* Distinct Download CV Button */}
        <a 
          href="/Kimsang_Silalahi_CV.pdf"
          download="Kimsang_Silalahi_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] sm:text-xs font-bold border border-[var(--accent)] bg-[var(--bg)] px-2 py-1 rounded-sm text-[var(--accent)] transition-all duration-300 shadow-[2px_2px_0px_0px_var(--accent)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] uppercase tracking-widest mt-1"
        >
          GET CV
        </a>

        {/* Theme toggle */}
        {mounted ? (
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="text-sm text-[var(--muted)] hover:!text-[var(--accent)] transition-colors duration-200"
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
