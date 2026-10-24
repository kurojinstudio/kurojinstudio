"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax card field for the service page — cards drift at different
 * speeds while scrolling (CodeGrid parallax pattern), with tilt on entry.
 */
export type ParallaxCard = {
  title: string;
  body: string;
  tag: string;
  image?: string;
};

export default function SvcParallax({ cards }: { cards: ParallaxCard[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-pcard]").forEach((card) => {
        const speed = parseFloat(card.dataset.speed || "1");
        // entry
        gsap.fromTo(
          card,
          { opacity: 0, y: 70, rotate: speed > 1 ? 2 : -2 },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%" },
          }
        );
        // continuous drift
        gsap.to(card, {
          y: () => -70 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative z-10 overflow-hidden py-28 md:py-36">
      <div className="k-container">
        <p className="mb-6 font-clue text-[10px] uppercase tracking-[0.35em] text-white/35 md:text-[11px]">
          Section 02b — Plates
        </p>
        <h2 className="k-display-sm k-safe max-w-[760px] font-garamond text-white">
          <span className="font-normal">What actually </span>
          <span className="font-bold italic">lands in your hands.</span>
        </h2>
      </div>

      <div className="k-container mt-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {cards.map((c, i) => (
            <article
              key={c.title}
              data-pcard
              data-speed={(0.5 + (i % 3) * 0.45).toFixed(2)}
              className="group relative overflow-hidden rounded-none border border-white/10 bg-white/[0.02] will-change-transform"
            >
              {c.image && (
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 bg-[#050505]/80 px-2.5 py-1.5 font-clue text-[9px] uppercase tracking-[0.3em] text-white/50 backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")} / {cards.length.toString().padStart(2, "0")}
                  </span>
                </div>
              )}
              <div className="p-7">
                <span className="font-clue text-[10px] uppercase tracking-[0.28em] text-white/40">
                  {c.tag}
                </span>
                <h3 className="mt-3 font-garamond text-[24px] leading-tight text-white transition-colors duration-300 group-hover:italic">
                  {c.title}
                </h3>
                <p className="mt-3 text-[13px] font-light leading-6 text-white/50">
                  {c.body}
                </p>
              </div>
              <span className="absolute right-6 top-6 text-[18px] text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ff4a1c]">
                ↗
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
