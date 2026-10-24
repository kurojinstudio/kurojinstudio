"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Stats strip — numbers count up when scrolled into view.
 * Real studio metrics only; no invented vanity numbers.
 */
export type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

export default function StatsStrip({ stats }: { stats: Stat[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-stat-num]").forEach((el) => {
        const target = Number(el.dataset.statNum || 0);
        const suffix = el.dataset.statSuffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative border-y border-white/10 py-16 md:py-20">
      <div className="k-container">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <span
                data-stat-num={s.value}
                data-stat-suffix={s.suffix || ""}
                className="block font-garamond italic text-[clamp(44px,6vw,84px)] leading-none text-white"
              >
                0{s.suffix || ""}
              </span>
              <span className="mt-3 block text-[11px] uppercase tracking-[0.28em] text-white/45 font-montserrat">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
