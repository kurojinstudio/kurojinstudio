"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sticky stacking cards — CodeGrid pattern, tuned SLOW for desktop.
 * No glow, no fade — just clean stacking: each card pins, the next one
 * slides up over it after a tall scroll runway, with a slight scale/offset
 * cascade so the stack reads as layered depth.
 */
export type StackCard = {
  number: string;
  title: string;
  body: string;
};

export default function StackingCards({
  heading,
  eyebrow,
  cards,
}: {
  heading: React.ReactNode;
  eyebrow: string;
  cards: StackCard[];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>("[data-stack-card]");

      cardEls.forEach((card, i) => {
        if (i === 0) return;
        // As card i arrives at its sticky slot, the cards beneath it
        // recede slightly — layered depth, scrubbed over the runway.
        gsap.to(cardEls.slice(0, i), {
          scale: 1 - 0.04 * i,
          yPercent: -2 * i,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "top top+=140",
            scrub: true,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-24 md:py-36">
      <div className="k-container">
        <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/45 font-montserrat">
          {eyebrow}
        </p>
        <h2 className="k-display-sm k-safe max-w-[760px] font-garamond text-white">
          {heading}
        </h2>
      </div>

      <div className="k-container mt-16 md:mt-24">
        <div className="mx-auto max-w-[900px]">
          {cards.map((card, i) => {
            const isLast = i === cards.length - 1;
            return (
              <div
                key={card.number}
                data-stack-card
                className="sticky"
                style={{
                  top: `${110 + i * 18}px`,
                  zIndex: i + 1,
                  // Tall runway between cards = slow, deliberate stacking.
                  marginBottom: isLast ? 0 : "clamp(120px, 30vh, 340px)",
                }}
              >
                <div className="rounded-[28px] border border-white/10 bg-[#0a0a0a] p-8 md:p-12 shadow-[0_-12px_50px_rgba(0,0,0,0.6)]">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-garamond italic text-[#ff8c2b] text-[40px] md:text-[56px] leading-none">
                      {card.number}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#00ff91]/70" />
                  </div>
                  <h3 className="font-garamond text-white text-[26px] md:text-[36px] italic leading-tight">
                    {card.title}
                  </h3>
                  <p className="mt-4 max-w-[560px] text-white/60 text-[14px] md:text-[15px] font-light leading-[1.7]">
                    {card.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
