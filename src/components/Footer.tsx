"use client";

import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Minimal footer — strict black & white theme.
 * The only color: the "kurojin" wordmark burns in a fire gradient.
 * Socials trimmed to Instagram + LinkedIn only.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      className="relative z-30 w-full border-t border-white/10 bg-black"
    >
      <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
        {/* ── top row: nav + socials ── */}
        <div className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between md:py-16">
          {/* nav */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {siteConfig.nav.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-[13px] uppercase tracking-[0.22em] text-white/60 transition-colors duration-300 hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* socials — Instagram + LinkedIn only */}
          <div className="flex items-center gap-3">
            {siteConfig.socials.map((s) => {
              const Icon = s.label === "LinkedIn" ? Linkedin : Instagram;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-300 hover:border-white hover:text-white"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              );
            })}
          </div>
        </div>

        {/* ── wordmark — black & white page, fire wordmark ── */}
        <div className="overflow-hidden border-t border-white/10 py-10 md:py-14">
          <p
            aria-hidden="true"
            className="kurojin-fire select-none text-center font-montserrat font-extrabold uppercase leading-[0.8] tracking-[-0.06em]"
            style={{ fontSize: "clamp(64px, 17vw, 240px)" }}
          >
            kurojin
          </p>
        </div>

        {/* ── bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-[11px] uppercase tracking-[0.2em] text-white/35 md:flex-row">
          <span>© {year} Kurojin. All rights reserved.</span>
          <span className="text-white/25">黒人 — clarity with edge</span>
          <button
            onClick={() => {
              const lenis = (
                window as unknown as Record<string, unknown>
              ).__lenis as { scrollTo?: (v: number) => void } | undefined;
              if (lenis?.scrollTo) lenis.scrollTo(0);
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="cursor-pointer text-white/50 transition-colors duration-300 hover:text-white"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
