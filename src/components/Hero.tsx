"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/components/Magnetic";
import { INTRO_DONE_EVENT } from "@/components/IntroLoader";
import Image from "next/image";
import HalftoneReveal from "@/components/HalftoneReveal";


gsap.registerPlugin(ScrollTrigger);

/* warm chromatic split — fire-orange family, matches brand accents */
const glowShadow =
  "0px 0px 25px rgba(255,150,80,0.32), -0.8px 0.8px 2.8px rgba(255,70,10,0.45), 0.8px -1.7px 1.7px rgba(255,190,120,0.4)";

const tickerItems = [
  "Brand Identity", "Web Experiences", "2D Design", "3D Content",
  "Motion Graphics", "Product Shoots", "Social Media", "Campaign Direction",
];

/**
 * Hero — KINETIC POSTER.
 * Oversized editorial type (huncwot wide-text doctrine) + line-mask entrance
 * + mouse-parallax collage + rotating badge + services ticker.
 * Scroll choreography: type skews & recedes, collage outruns it, overlay dims.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      /* ── entrance: line-mask reveals, staggered ──
         Gated on the intro video finishing so the reveal isn't
         wasted behind the fullscreen overlay. */
      const play = () => {
        gsap.fromTo(
          "[data-hero-line]",
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.25,
            ease: "power4.out",
            stagger: 0.12,
            delay: 0.15,
          }
        );
        gsap.fromTo(
          "[data-hero-fade]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, delay: 0.7 }
        );
      };

      const alreadyDone =
        (window as unknown as Record<string, unknown>).__kurojinIntroDone === true;

      let onDone: (() => void) | null = null;
      if (alreadyDone) {
        play();
      } else {
        onDone = () => play();
        window.addEventListener(INTRO_DONE_EVENT, onDone, { once: true });
      }

      if (reduced) return;

      /* ── scroll choreography — one scrubbed timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      // giant type recedes: drift up + skew + slight shrink
      tl.to(typeRef.current, { yPercent: -22, skewY: -2.5, scale: 0.94, ease: "none" }, 0);
      // sub block lifts away faster
      tl.to(subRef.current, { yPercent: -60, opacity: 0, ease: "none" }, 0);
      // dim handoff
      tl.to(overlayRef.current, { opacity: 1, ease: "none" }, 0.2);

      return () => {
        if (onDone) window.removeEventListener(INTRO_DONE_EVENT, onDone);
      };
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[640px] h-[100svh] overflow-hidden cursor-none"
    >
      <HalftoneReveal className="z-10 hidden md:block" />
      {/* ══ corner meta — mono micro-labels ══ */}
      <div data-hero-fade className="absolute top-[88px] left-4 md:left-[4%] z-30 font-montserrat text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-white/50">
        
        Est. 2024 — 黒人
      </div>
      <div data-hero-fade className="absolute top-[88px] right-4 md:right-[4%] z-30 font-montserrat text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-white/50 text-right">
        Full-spectrum
        <br className="hidden md:block" /> creative studio
      </div>

      {/* ══ giant type block ══ */}
      <div
  ref={typeRef}
  className="absolute inset-0 z-20 flex items-center justify-center px-4 pb-20 md:pb-0"
>
  {/* PNG — BACK LAYER */}
  <Image
    src="/images/kurobg.png"
    alt="Kurojin Background"
    width={400}
    height={400}
    sizes="40vw"
    className="absolute z-0 h-auto w-[58vw] max-w-[400px] object-contain md:w-[400px]"
  />

  {/* GIF — FRONT LAYER */}
  <Image
    src="/images/kro3.gif"
    alt="Kurojin Animation"
    width={1000}
    height={1000}
    sizes="72vw"
    className="absolute z-10 h-auto w-[92vw] max-w-[1000px] object-contain md:w-[1000px]"
  />
</div>

      {/* ══ sub block: tagline + CTAs ══ */}
      <div
        ref={subRef}
        className="absolute bottom-[max(12%,96px)] md:bottom-[15%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-5 px-4 text-center w-full"
      >
        <p
          data-hero-fade
          className="text-white/85 font-garamond text-[16px] md:text-[20px] font-light max-w-[440px] leading-snug"
          style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25), 0px 0px 12px #ffe0c8" }}
        >
          A full-spectrum creative partner for modern brands —
          identity, web, 2D, 3D &amp; motion under one roof.
        </p>
        <div data-hero-fade className="flex w-full max-w-[360px] flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
          <Magnetic strength={0.3}>
            <Link
              href="/work"
              data-cursor="VIEW"
              className="cta-button h-[46px] px-9 text-[13px] md:h-[50px] md:px-11 md:text-[14px]"
            >
              See Our Work
            </Link>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link
              href="/contact"
              data-cursor="TALK"
              className="h-[46px] px-9 md:h-[50px] md:px-11 inline-flex items-center justify-center rounded-[55px] border border-white/25 text-white font-montserrat font-bold italic uppercase text-[13px] md:text-[14px] tracking-[0.05em] transition-all duration-300 hover:bg-white/10 hover:border-white/50"
            >
              Start a Project
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* ══ services ticker — bottom strip ══ */}
      <div data-hero-fade className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/12 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="flex w-max animate-marquee py-3">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 pr-6 font-montserrat text-[11px] md:text-[12px] uppercase tracking-[0.3em] text-white/60 whitespace-nowrap"
            >
              {item} <span className="text-white/30">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* dim overlay — scroll handoff */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-40 hidden bg-black pointer-events-none opacity-0 md:block"
      />
    </section>
  );
}
