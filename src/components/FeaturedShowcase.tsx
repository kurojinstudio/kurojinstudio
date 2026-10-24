"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Featured showcase — SOTD portfolio pattern (CodeGrid fHA1fw0jPSk):
 * - sticky project index on the left with an active indicator
 * - big clip-mask numbers that reveal as each project enters view
 * - sticky preview image on the right that cross-fades to the active project
 * - vertical scroll progress rail on the far right
 */
export type FeaturedProject = {
  id: string;
  title: string;
  subtitle: string;
  year?: string;
  services: string[];
  image: string;
  accent: string;
};

export default function FeaturedShowcase({
  projects,
}: {
  projects: FeaturedProject[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // one trigger per project row → drives index, number mask, preview
      projects.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `[data-fs-row="${i}"]`,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });

      // clip-mask number reveal per row
      gsap.utils.toArray<HTMLElement>("[data-fs-number]").forEach((num) => {
        gsap.fromTo(
          num,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: num, start: "top 85%", once: true },
          }
        );
      });

      // row content entrance
      gsap.utils.toArray<HTMLElement>("[data-fs-row]").forEach((row) => {
        gsap.fromTo(
          row.querySelector("[data-fs-content]"),
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 78%" },
          }
        );
      });

      // progress rail across the whole showcase
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setProgress(self.progress),
      });
    }, rootRef);
    return () => ctx.revert();
  }, [projects]);

  return (
    <section ref={rootRef} className="relative border-t border-white/10">
      {/* vertical progress rail */}
      <div className="absolute right-4 md:right-8 top-0 bottom-0 w-px bg-white/10 z-30 hidden md:block">
        <div
          className="w-full origin-top bg-gradient-to-b from-[#ff3c00] to-[#ff8c2b]"
          style={{ height: "100%", transform: `scaleY(${progress})` }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#ff8c2b] shadow-[0_0_12px_rgba(255,140,43,0.8)]"
          style={{ top: `${progress * 100}%` }}
        />
      </div>

      <div className="k-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── LEFT: sticky index ── */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 pt-24">
              <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-white/40 font-montserrat">
                Featured — {String(projects.length).padStart(2, "0")} projects
              </p>
              <ul className="space-y-1">
                {projects.map((p, i) => (
                  <li key={p.id}>
                    <a
                      href={`#fs-${p.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .querySelector(`[data-fs-row="${i}"]`)
                          ?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className={`group flex items-center gap-3 py-2.5 transition-all duration-300 ${
                        active === i
                          ? "text-white translate-x-2"
                          : "text-white/35 hover:text-white/70"
                      }`}
                    >
                      <span
                        className={`inline-block transition-all duration-300 ${
                          active === i
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-50"
                        }`}
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderLeft: `7px solid ${p.accent}`,
                        }}
                      />
                      <span className="font-garamond italic text-[19px] leading-none">
                        {p.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── CENTER: project rows with clip-mask numbers ── */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            {projects.map((p, i) => (
              <article
                key={p.id}
                id={`fs-${p.id}`}
                data-fs-row={i}
                className="flex min-h-[85vh] flex-col justify-center border-b border-white/8 py-16 last:border-b-0"
              >
                {/* clip-mask number */}
                <div className="overflow-hidden mb-6">
                  <span
                    data-fs-number
                    className="block font-garamond italic leading-none text-transparent select-none"
                    style={{
                      fontSize: "clamp(80px, 12vw, 170px)",
                      WebkitTextStroke: `1.5px ${active === i ? p.accent : "rgba(255,255,255,0.25)"}`,
                      transition: "-webkit-text-stroke 0.5s ease",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div data-fs-content>
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.accent }}
                    />
                    <span className="text-[11px] uppercase tracking-[0.24em] text-white/45 font-montserrat">
                      {p.year ? `${p.year} — ` : ""}
                      {p.subtitle}
                    </span>
                  </div>

                  <h3 className="font-garamond text-[clamp(34px,4.5vw,58px)] leading-[0.98] tracking-[-0.03em] text-white">
                    {p.title}
                  </h3>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/12 px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/55"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── RIGHT: sticky preview that follows the active project ── */}
          <div className="order-1 lg:order-2 lg:col-span-4">
            <div className="sticky top-32 pt-24 hidden lg:block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/10">
                {projects.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p.id}
                    src={p.image}
                    alt={p.title}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: active === i ? "scale(1)" : "scale(1.08)",
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <span className="font-garamond italic text-white text-xl">
                    {projects[active]?.title}
                  </span>
                  <span className="font-montserrat text-[11px] tracking-[0.25em] text-white/60">
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
