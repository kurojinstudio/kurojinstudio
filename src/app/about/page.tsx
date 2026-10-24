"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import StackingCards from "@/components/StackingCards";
import SplitReveal from "@/components/SplitReveal";
import StatsStrip from "@/components/StatsStrip";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────
   MANIFESTO — typographic poster theme
   accent: acid green #00ff91 / pure black base
   Type IS the design.
   ──────────────────────────────────────────────── */

const values = [
  {
    number: "01",
    title: "Craft over volume",
    body: "We don't ship templates. Every identity, frame, and pixel is considered — because 'good enough' was never the plan.",
  },
  {
    number: "02",
    title: "Story first",
    body: "Every brand begins with a story. We find yours, then shape everything — identity, web, motion — around it.",
  },
  {
    number: "03",
    title: "All dimensions, one core",
    body: "Graphic design, web, 2D, 3D, motion — one team, one visual language, zero hand-off friction.",
  },
  {
    number: "04",
    title: "Budget never limits quality",
    body: "Budgets change. Standards don't. When numbers shift, we refine the output — never the excellence.",
  },
];

const capabilities = [
  "Brand Identity",
  "Graphic Design",
  "Web Design & Development",
  "2D Illustration",
  "3D Content & Animation",
  "Motion Graphics",
  "Product Shoots",
  "Social Media",
  "Packaging",
  "Campaign Direction",
];

const statements = [
  { pre: "ORDINARY ISN'T IN OUR", hot: "VOCABULARY", align: "text-left" },
  { pre: "CRAFT OVER", hot: "TEMPLATE", align: "text-right" },
  { pre: "MOTION IS", hot: "MEANING", align: "text-left" },
  { pre: "ONE CORE, ALL", hot: "DIMENSIONS", align: "text-center" },
];

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // hero: per-line mask reveal
      gsap.fromTo(
        "[data-manifesto-line]",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.2, stagger: 0.14, ease: "power4.out", delay: 0.15 }
      );
      gsap.fromTo(
        "[data-manifesto-meta]",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.5 }
      );

      // hero giant type: scroll-driven skew + drift
      gsap.to("[data-manifesto-hero]", {
        skewX: -4,
        xPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "60% top",
          scrub: 0.6,
        },
      });

      // statements: scale + letter-spacing + opacity on entry
      gsap.utils.toArray<HTMLElement>("[data-statement]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.92, letterSpacing: "0.12em" },
          {
            opacity: 1,
            scale: 1,
            letterSpacing: "-0.02em",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          }
        );
      });

      // story + capability stagger
      gsap.utils.toArray<HTMLElement>("[data-m-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-cap-row]").forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 90%" },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <SmoothScrollProvider>
      <div ref={rootRef} className="relative min-h-screen bg-black text-white">
        <Navbar />

        {/* ══════════ 1. HERO — kinetic type poster ══════════ */}
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-36 pb-20">
          <div className="k-container">
            <p
              data-manifesto-meta
              className="mb-10 font-montserrat text-[11px] uppercase tracking-[0.4em] text-white/45"
            >
              About / 黒人 / Est. 2024
            </p>

            <div data-manifesto-hero className="will-change-transform">
              <div className="overflow-hidden">
                <h1
                  data-manifesto-line
                  className="font-garamond uppercase leading-[0.88] tracking-[-0.04em] text-white"
                  style={{ fontSize: "clamp(64px, 15vw, 220px)" }}
                >
                  We make
                </h1>
              </div>
              <div className="overflow-hidden">
                <p
                  data-manifesto-line
                  className="font-garamond font-bold italic uppercase leading-[0.88] tracking-[-0.04em] text-[#00ff91]"
                  style={{ fontSize: "clamp(64px, 15vw, 220px)" }}
                >
                  brands
                </p>
              </div>
              <div className="overflow-hidden">
                <p
                  data-manifesto-line
                  className="font-garamond uppercase leading-[0.88] tracking-[-0.04em] text-white/90"
                  style={{ fontSize: "clamp(64px, 15vw, 220px)" }}
                >
                  unforgettable
                </p>
              </div>
            </div>

            <div data-manifesto-meta className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
              <p className="max-w-[480px] text-[14px] font-light leading-7 text-white/60">
                Kurojin is a full-spectrum creative studio. We take brands from a
                blank page to a living presence — identity, design, web, 2D, 3D
                and motion, all under one roof.
              </p>
              <span className="font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/30">
                Scroll to read the manifesto ↓
              </span>
            </div>
          </div>
        </section>

        {/* ══════════ 2. MANIFESTO STATEMENTS ══════════ */}
        <section className="relative py-16 md:py-24">
          <div className="k-container">
            {statements.map((s, i) => (
              <div
                key={i}
                data-statement
                className={`border-t border-white/8 py-16 md:py-24 ${s.align} will-change-transform`}
              >
                <p
                  className="font-garamond uppercase leading-[0.95] text-white/90"
                  style={{ fontSize: "clamp(34px, 6.5vw, 96px)" }}
                >
                  {s.pre}{" "}
                  <span className="font-bold italic text-[#00ff91]">{s.hot}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ 3. STORY — editorial two-column ══════════ */}
        <section className="relative py-24 md:py-32">
          <div className="k-container">
            <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
              <div className="relative">
                <div className="md:sticky md:top-36">
                  <p data-m-reveal className="mb-6 font-montserrat text-[11px] uppercase tracking-[0.4em] text-[#00ff91]/80">
                    Our story
                  </p>
                  <SplitReveal
                    as="h2"
                    className="font-garamond text-white text-[32px] md:text-[46px] leading-[1.04] tracking-[-0.02em]"
                  >
                    <span className="font-normal">Your focus is on what </span>
                    <span className="font-bold italic uppercase">you build.</span>
                    <br />
                    <span className="font-light italic text-white/70">
                      We care how the world sees it.
                    </span>
                  </SplitReveal>
                </div>
              </div>
              <div className="space-y-8">
                <p data-m-reveal className="text-[15px] font-light leading-[1.85] text-white/65 md:text-[17px]">
                  Every brand begins with a story. We shape that story into a
                  powerful brand identity, bring it to life through mindful
                  design, craft visuals with product shoots and immersive 3D
                  content, build your presence with high-impact web experiences,
                  and set the momentum through strategic social media.
                </p>
                <p data-m-reveal className="text-[15px] font-light leading-[1.85] text-white/65 md:text-[17px]">
                  One core — all dimensions. No hand-offs, no dilution, no
                  telephone game between agencies. The team that imagines it is
                  the team that builds it, and the standard never drops between
                  the two.
                </p>
                <div data-m-reveal className="border-l-2 border-[#00ff91]/50 pl-6">
                  <p className="font-garamond italic text-[20px] leading-relaxed text-white/80">
                    &ldquo;Good enough was never the plan.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 4. STATS — count-up ══════════ */}
        <StatsStrip
          stats={[
            { value: 10, suffix: "+", label: "Capabilities in-house" },
            { value: 4, label: "Dimensions — 2D, 3D, web, motion" },
            { value: 1, label: "Core behind every project" },
            { value: 100, suffix: "%", label: "Craft, zero templates" },
          ]}
        />

        {/* ══════════ 5. VALUES — sticky stacking cards ══════════ */}
        <StackingCards
          eyebrow="What we stand for"
          heading={
            <>
              <span className="font-normal">Four things we </span>
              <span className="font-bold italic text-[#00ff91]">refuse to compromise.</span>
            </>
          }
          cards={values}
        />

        {/* ══════════ 6. CAPABILITIES — staggered list ══════════ */}
        <section className="relative border-t border-white/10 py-24 md:py-32">
          <div className="k-container">
            <p data-m-reveal className="mb-14 font-montserrat text-[11px] uppercase tracking-[0.4em] text-white/40">
              Capabilities — 10
            </p>
            <div className="grid gap-x-16 md:grid-cols-2">
              {capabilities.map((cap, i) => (
                <div
                  key={cap}
                  data-cap-row
                  className="flex items-baseline justify-between gap-6 border-b border-white/8 py-6"
                >
                  <span className="font-garamond text-[clamp(20px,2.6vw,34px)] text-white/85">
                    {cap}
                  </span>
                  <span className="font-montserrat text-[11px] tracking-[0.25em] text-[#00ff91]/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 7. CTA ══════════ */}
        <section className="relative overflow-hidden py-28 md:py-36 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,145,0.06),transparent_45%)]" />
          <div className="k-container-narrow relative">
            <h2 data-m-reveal className="k-display-sm k-safe font-garamond text-white uppercase">
              <span className="font-normal">Write the next chapter </span>
              <span className="font-bold italic text-[#00ff91]">with us.</span>
            </h2>
            <div data-m-reveal className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                data-cursor="TALK"
                className="inline-flex h-[50px] items-center justify-center rounded-full bg-white px-10 font-montserrat text-[13px] font-extrabold uppercase italic tracking-[0.06em] text-black transition-all duration-300 hover:bg-[#00ff91] hover:shadow-[0_0_40px_rgba(0,255,145,0.4)] active:scale-95"
              >
                Let&apos;s talk
              </Link>
              <Link
                href="/service"
                className="inline-flex h-[50px] items-center justify-center rounded-full border border-white/25 px-10 font-montserrat text-[13px] font-bold uppercase italic tracking-[0.06em] text-white transition-all duration-300 hover:border-[#00ff91]/60 hover:bg-white/5"
              >
                Our services
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
