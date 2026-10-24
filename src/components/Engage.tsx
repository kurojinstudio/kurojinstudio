"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────
   ENGAGE — six Huncwot-inspired engagement sections
   for the homepage tail. Collage 2D/3D, wide text,
   spec-sheet case study, narrative, ticker, teaser.
   Black & white base; motion does the talking.
   ──────────────────────────────────────────────── */

const collageItems = [
  { src: "/images/All/Artboard-1.webp", w: "w-[240px] md:w-[300px]", rot: "-rotate-6", speed: 0.9 },
  { src: "/images/work/05.jpg", w: "w-[200px] md:w-[260px]", rot: "rotate-3", speed: 1.4 },
  { src: "/images/All/Artboard-3.webp", w: "w-[220px] md:w-[280px]", rot: "-rotate-2", speed: 0.7 },
  { src: "/images/work/02.jpg", w: "w-[260px] md:w-[320px]", rot: "rotate-6", speed: 1.2 },
  { src: "/images/All/Artboard-5.webp", w: "w-[200px] md:w-[250px]", rot: "-rotate-4", speed: 1.6 },
  { src: "/images/work/08.jpg", w: "w-[230px] md:w-[290px]", rot: "rotate-2", speed: 0.8 },
];

export default function Engage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // case study image parallax
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "1");
        gsap.fromTo(
          el,
          { yPercent: -8 * speed },
          {
            yPercent: 8 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") || el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });

      // collage items: entrance + individual drift
      gsap.utils.toArray<HTMLElement>("[data-collage]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 80, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
          }
        );
        const speed = parseFloat(el.dataset.speed || "1");
        gsap.to(el, {
          y: () => -60 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-collage-field]"),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });

      // wide text line reveals
      gsap.utils.toArray<HTMLElement>("[data-engage-line]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      // generic fade-up
      gsap.utils.toArray<HTMLElement>("[data-engage-fade]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* ═══ 1. CASE STUDY — spec-sheet spotlight (Huncwot signature) ═══ */}
      <section className="relative border-t border-white/10 py-24 md:py-36">
        <div className="k-container">
          <div className="mb-12 grid grid-cols-2 gap-6 border-b border-white/10 pb-8 md:grid-cols-4">
            {[
              { k: "Project No.", v: "01 / Twitter MTC" },
              { k: "Expertise", v: "UX/UI · Frontend · Motion" },
              { k: "Client", v: "Twitter MTC" },
              { k: "Year", v: "2025" },
            ].map((m) => (
              <div key={m.k} data-engage-fade>
                <p className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-white/35">
                  {m.k}
                </p>
                <p className="mt-2 text-[13px] uppercase tracking-[0.1em] text-white/85">
                  {m.v}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 items-center">
            {/* parallax image */}
            <div data-engage-fade className="relative overflow-hidden rounded-[24px] border border-white/10">
              <div data-parallax="1.1" className="will-change-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/work/01.jpg"
                  alt="Twitter MTC mobile experience"
                  loading="lazy"
                  className="aspect-[4/3] w-full scale-[1.15] object-cover"
                />
              </div>
            </div>

            <div>
              <div className="overflow-hidden">
                <h3
                  data-engage-line
                  className="font-garamond text-[clamp(30px,4vw,56px)] leading-[1.02] tracking-[-0.02em] text-white"
                >
                  A fast product interface with sharp pacing and tactile
                  transitions.
                </h3>
              </div>
              <p data-engage-fade className="mt-8 max-w-[480px] text-[15px] font-light leading-[1.8] text-white/55">
                We rebuilt the mobile experience from the ground up — a highly
                responsive visual system where every state change is felt, not
                just seen.
              </p>
              <blockquote data-engage-fade className="mt-10 border-l-2 border-white/30 pl-6">
                <p className="font-garamond italic text-[20px] leading-relaxed text-white/80">
                  &ldquo;Every state change is felt, not just seen.&rdquo;
                </p>
                <cite className="mt-3 block font-montserrat text-[10px] uppercase not-italic tracking-[0.28em] text-white/40">
                  Studio note — 2025
                </cite>
              </blockquote>
              <div data-engage-fade className="mt-10">
                <Link
                  href="/work"
                  data-cursor="VIEW"
                  className="group inline-flex items-center gap-3 font-montserrat text-[12px] uppercase tracking-[0.25em] text-white/70 transition-colors duration-300 hover:text-white"
                >
                  Read the case
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. COLLAGE — scattered 2D/3D field with drift ═══ */}
      <section className="relative overflow-hidden border-t border-white/10 py-28 md:py-40">
        <div className="k-container relative">
          <div className="mb-16 text-center">
            <div className="overflow-hidden">
              <p
                data-engage-line
                className="font-garamond uppercase leading-[0.9] tracking-[-0.03em] text-white"
                style={{ fontSize: "clamp(40px, 8vw, 120px)" }}
              >
                Collage of craft
              </p>
            </div>
            <p data-engage-fade className="mx-auto mt-6 max-w-[440px] text-[14px] font-light leading-7 text-white/50">
              2D, 3D, film and type — one visual language, many dimensions.
            </p>
          </div>

          <div
            data-collage-field
            className="relative mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-6 md:gap-10"
          >
            {collageItems.map((item, i) => (
              <div
                key={i}
                data-collage
                data-speed={item.speed}
                className={`${item.w} ${item.rot} shrink-0 overflow-hidden rounded-[18px] border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.5)] will-change-transform`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. NARRATIVE — wide text, Huncwot "that's what we do" ═══ */}
      <section className="relative border-t border-white/10 py-28 md:py-40">
        <div className="k-container-narrow">
          {[
            { text: "We start with a blank page.", dim: false },
            { text: "Then an identity. Then a world.", dim: false },
            { text: "2D frames, 3D spaces, motion that breathes.", dim: true },
            { text: "That's what we do.", dim: false, accent: true },
          ].map((line, i) => (
            <div key={i} className="overflow-hidden border-b border-white/8 py-8 md:py-10">
              <p
                data-engage-line
                className={`font-garamond leading-[1.05] tracking-[-0.02em] ${
                  line.accent
                    ? "font-bold italic text-white"
                    : line.dim
                    ? "text-white/45"
                    : "text-white/90"
                }`}
                style={{ fontSize: "clamp(28px, 4.6vw, 64px)" }}
              >
                {line.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 4. TICKER — wide capabilities marquee ═══ */}
      <section className="relative overflow-hidden border-y border-white/10 py-14 md:py-18">
        <div className="flex w-max animate-marquee">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex">
              {["Identity", "Web", "2D", "3D", "Motion", "Social", "Film", "Packaging"].map(
                (cap) => (
                  <span
                    key={`${dup}-${cap}`}
                    className="whitespace-nowrap px-8 font-garamond text-[34px] uppercase leading-none text-white/85 italic md:text-[52px]"
                  >
                    {cap} <span className="not-italic text-white/25">✦</span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 5. PROJECT TEASER — giant archive link ═══ */}
      <section className="relative py-28 md:py-40">
        <div className="k-container text-center">
          <p data-engage-fade className="mb-8 font-montserrat text-[11px] uppercase tracking-[0.34em] text-white/40">
            12 projects in the archive
          </p>
          <Link href="/work" data-cursor="VIEW" className="group block">
            <div className="overflow-hidden">
              <p
                data-engage-line
                className="font-garamond uppercase leading-[0.9] tracking-[-0.04em] text-white transition-colors duration-500 group-hover:text-white/70"
                style={{ fontSize: "clamp(48px, 10vw, 150px)" }}
              >
                See the work
              </p>
            </div>
            <span className="mt-8 inline-flex items-center gap-3 font-montserrat text-[12px] uppercase tracking-[0.28em] text-white/50 transition-all duration-300 group-hover:gap-5 group-hover:text-white">
              Full archive <span>→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ═══ 6. AVAILABILITY — quiet status strip ═══ */}
      <section className="relative border-t border-white/10 py-16 md:py-20">
        <div className="k-container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div data-engage-fade className="flex items-center gap-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            <p className="font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/55">
              Accepting new projects — Q3 2026
            </p>
          </div>
          <Link
            href="/contact"
            data-cursor="TALK"
            data-engage-fade
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-3.5 font-montserrat text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            Start a project
            <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
