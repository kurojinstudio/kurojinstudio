"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Tilted reveal grid — SOTD work-page pattern (CodeGrid RGIJ-vadIKY):
 * cards enter with a staggered, tilted, timed reveal as they scroll into
 * view. Alternating tilt directions keep it from feeling mechanical.
 */
export type TiltItem = {
  title?: string;
  subtitle?: string;
  image: string;
  tag?: string;
};

export default function TiltedRevealGrid({
  eyebrow,
  heading,
  items,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  items: TiltItem[];
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-tilt-card]").forEach((card, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.fromTo(
          card,
          { y: 90, opacity: 0, rotate: 4 * dir, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-20 md:py-28">
      <div className="k-container">
        <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/45 font-montserrat">
          {eyebrow}
        </p>
        <h2 className="k-display-sm k-safe max-w-[760px] font-garamond text-white">
          {heading}
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-10">
          {items.map((item, i) => (
            <article
              key={i}
              data-tilt-card
              className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] will-change-transform"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                {item.tag && (
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/75 backdrop-blur-md">
                    {item.tag}
                  </span>
                )}
              </div>
              {item.title ? (
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h3 className="font-garamond text-[24px] md:text-[28px] leading-tight tracking-[-0.02em] text-white">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="mt-1.5 text-[13px] font-light text-white/55">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
