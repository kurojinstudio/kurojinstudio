"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import HorizontalShowcase from "@/components/HorizontalShowcase";
import TiltedRevealGrid from "@/components/TiltedRevealGrid";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────
   GALLERY NOIR — editorial archive theme
   accent: signal orange #ff5c1a / base #050505
   ──────────────────────────────────────────────── */

type WorkCategory = "web" | "2d" | "video" | "social" | "branding" | "campaign";

type WorkProject = {
  id: string;
  title: string;
  subtitle: string;
  category: WorkCategory;
  services: string[];
  description: string;
  image: string;
  accent: string;
};

const categories: { id: WorkCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "2d", label: "2D" },
  { id: "video", label: "Video" },
  { id: "social", label: "Social" },
  { id: "branding", label: "Branding" },
  { id: "campaign", label: "Campaign" },
];

const projects: WorkProject[] = [
  {
    id: "if1",
    title: "Infosys",
    subtitle: "Technology — Visual Design",
    category: "branding",
    services: ["Branding", "Visual Design", "Digital"],
    description:
      "Visual design work for Infosys across branded digital and communication experiences.",
    image: "/images/work/INFOSYS.png",
    accent: "#60A5FA",
  },
  {
    id: "ar2",
    title: "Aryan",
    subtitle: "Brand — Visual Design",
    category: "branding",
    services: ["Branding", "Visual Design", "Campaign"],
    description:
      "A visual design project for Aryan shaped around a clear, expressive brand language.",
    image: "/images/work/aryan.png",
    accent: "#F59E0B",
  },
  {
    id: "sk1",
    title: "Skinora",
    subtitle: "Beauty — Packaging Design",
    category: "branding",
    services: ["Branding", "Packaging", "3D"],
    description:
      "A full packaging system for the Skinora skincare range — brand identity, pouch and carton art, and shelf-ready 3D visuals.",
    image: "/images/work/skinora.jpg",
    accent: "#EC4899",
  },
  {
    id: "sj2",
    title: "Sujata",
    subtitle: "Home Appliance — Packaging Design",
    category: "branding",
    services: ["Packaging", "Product Design", "3D"],
    description:
      "Retail packaging for the Sujata SPF 99 pedestal fan — die-line engineering, artwork system, and 3D mock-ups.",
    image: "/images/work/sujata.jpg",
    accent: "#3B82F6",
  },
  {
    id: "mb3",
    title: "Mr. Barber",
    subtitle: "Grooming — Brand Campaign",
    category: "campaign",
    services: ["Packaging", "Product Art Direction", "Social"],
    description:
      "A brand campaign around the Autograph Pro range — product art direction, packaging, and social launch assets.",
    image: "/images/work/mr-barber.jpg",
    accent: "#8B5CF6",
  },
  {
    id: "rc4",
    title: "Roca",
    subtitle: "Cookware — E-Commerce",
    category: "web",
    services: ["Web Design", "Product Visuals", "Digital"],
    description:
      "An e-commerce experience for Roca cast-iron cookware — web design and a complete set of product visuals.",
    image: "/images/work/roca.jpg",
    accent: "#F97316",
  },
  {
    id: "hs5",
    title: "Haus",
    subtitle: "Collectibles — Brand & Web",
    category: "web",
    services: ["Web Design", "3D Product", "E-Commerce"],
    description:
      "Brand and web design for Haus collectible vinyl figures — 3D product-first e-commerce built around color and character.",
    image: "/images/work/haus.jpg",
    accent: "#D946EF",
  },
  {
    id: "be6",
    title: "Blue Emerald",
    subtitle: "Architecture — 3D Visualization",
    category: "2d",
    services: ["Arch Viz", "Exterior", "3D"],
    description:
      "Full architectural 3D visualization for the Blue Emerald building — exterior renders, lighting study, and street context.",
    image: "/images/work/blue-emerald.jpg",
    accent: "#10B981",
  },
];

const ORANGE = "#ff5c1a";

export default function WorkPage() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeCat, setActiveCat] = useState<WorkCategory | "all">("all");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // floating preview that follows the cursor over index rows
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const filtered = useMemo(
    () =>
      activeCat === "all"
        ? projects
        : projects.filter((p) => p.category === activeCat),
    [activeCat]
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // hero index rows: staggered mask reveal
      gsap.fromTo(
        "[data-noir-row]",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.09,
          ease: "power4.out",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        "[data-noir-meta]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.1 }
      );

      // section eyebrows
      gsap.utils.toArray<HTMLElement>("[data-noir-eyebrow]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      // archive rows entrance
      gsap.utils.toArray<HTMLElement>("[data-archive-row]").forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 90%" },
          }
        );
      });

      // cursor-follow setup
      if (previewRef.current) {
        xTo.current = gsap.quickTo(previewRef.current, "x", {
          duration: 0.5,
          ease: "power3.out",
        });
        yTo.current = gsap.quickTo(previewRef.current, "y", {
          duration: 0.5,
          ease: "power3.out",
        });
      }
    }, rootRef);

    const onMove = (e: MouseEvent) => {
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  const showPreview = (img: string) => {
    if (previewImgRef.current) previewImgRef.current.src = img;
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    }
  };
  const hidePreview = () => {
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  };

  return (
    <SmoothScrollProvider>
      <main
        ref={rootRef}
        className="bg-[#050505] text-white selection:bg-[#ff5c1a]/30 selection:text-white"
      >
        <Navbar />

        {/* floating cursor preview (hero index) */}
        <div
          ref={previewRef}
          className="pointer-events-none fixed left-0 top-0 z-[60] hidden lg:block"
          style={{ opacity: 0, scale: 0.85 }}
          aria-hidden="true"
        >
          <div className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[16px] border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
            <img
              ref={previewImgRef}
              src={projects[0].image}
              alt=""
              className="h-[240px] w-[340px] object-cover"
            />
          </div>
        </div>

        {/* ══════════ 1. HERO — oversized editorial index ══════════ */}
        <section className="relative flex min-h-screen flex-col justify-center pt-36 pb-20">
          <div className="k-container">
            <div data-noir-meta className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <p className="font-montserrat text-[11px] uppercase tracking-[0.34em] text-white/45">
                Work — Archive 黒人
              </p>
              <p className="font-montserrat text-[11px] uppercase tracking-[0.34em] text-[#ff5c1a]">
                {String(projects.length).padStart(2, "0")} projects / archive
                01 — {String(projects.length).padStart(2, "0")}
              </p>
            </div>

            {/* giant index rows */}
            <div data-cursor="VIEW">
              {projects.slice(0, 3).map((p, i) => (
                <div key={p.id} className="overflow-hidden border-b border-white/8">
                  <Link
                    href="#featured"
                    data-noir-row
                    onMouseEnter={() => {
                      setHoveredRow(p.id);
                      showPreview(p.image);
                    }}
                    onMouseLeave={() => {
                      setHoveredRow(null);
                      hidePreview();
                    }}
                    className="group flex items-baseline justify-between gap-6 py-5 md:py-6 transition-colors duration-300"
                  >
                    <span className="flex items-baseline gap-5 md:gap-8 min-w-0">
                      <span className="font-montserrat text-[11px] md:text-[13px] tracking-[0.2em] text-[#ff5c1a]/80 shrink-0 translate-y-[-6px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-garamond uppercase leading-[0.95] tracking-[-0.03em] transition-all duration-500 truncate ${
                          hoveredRow === p.id
                            ? "italic text-white translate-x-3"
                            : "text-white/85"
                        }`}
                        style={{ fontSize: "clamp(34px, 6.2vw, 88px)" }}
                      >
                        {p.title}
                      </span>
                    </span>
                    <span className="hidden md:flex items-center gap-6 shrink-0">
                      <span className="font-montserrat text-[11px] uppercase tracking-[0.24em] text-white/40">
                        {p.subtitle}
                      </span>
                      <span
                        className={`inline-block text-[22px] transition-all duration-300 ${
                          hoveredRow === p.id
                            ? "text-[#ff5c1a] translate-x-1 -translate-y-1"
                            : "text-white/25"
                        }`}
                      >
                        ↗
                      </span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <div data-noir-meta className="mt-10 flex items-center justify-between">
              <p className="max-w-[420px] text-[13px] font-light leading-6 text-white/45">
                Selected output across branding, packaging and digital — every
                project built from a blank page, never a template.
              </p>
              <span className="font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/30 animate-pulse">
                Scroll ↓
              </span>
            </div>
          </div>
        </section>

        {/* ══════════ 2. FEATURED SHOWCASE — sticky index + preview ══════════ */}
        <div id="featured">
          <div className="k-container pt-8">
            <p data-noir-eyebrow className="mb-2 font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/45">
              Featured — the pillars
            </p>
          </div>
          <FeaturedShowcase projects={projects.slice(3)} />
        </div>

        {/* ══════════ 3. HORIZONTAL SHOWCASE — pinned scroll ══════════ */}
        <HorizontalShowcase
          eyebrow="In motion — scroll sideways"
          slides={[
            { image: "/images/work/05.jpg" },
            { image: "/images/work/06.jpg" },
            { image: "/images/work/07.jpg" },
            { image: "/images/work/08.jpg" },
            { image: "/images/work/09.jpg" },
          ]}
        />

        {/* ══════════ 4. ARCHIVE — editorial rows + filter ══════════ */}
        <section className="border-t border-white/10 py-24 md:py-32">
          <div className="k-container">
            <div data-noir-eyebrow className="mb-12 flex flex-wrap items-end justify-between gap-8">
              <div>
                <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/45">
                  Full archive
                </p>
                <h2 className="k-display-sm k-safe font-garamond text-white">
                  <span className="font-normal">Every entry, </span>
                  <span className="font-bold italic text-[#ff5c1a]">indexed.</span>
                </h2>
              </div>

              {/* category filter */}
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={activeCat === cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`cursor-pointer rounded-full border px-5 py-2 font-montserrat text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
                      activeCat === cat.id
                        ? "border-[#ff5c1a] bg-[#ff5c1a] text-black"
                        : "border-white/15 text-white/55 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* editorial rows */}
            <div data-archive-list>
              {filtered.map((p, i) => (
                <article
                  key={`${activeCat}-${p.id}`}
                  data-archive-row
                  onMouseEnter={() => {
                    setHoveredRow(`a-${p.id}`);
                    showPreview(p.image);
                  }}
                  onMouseLeave={() => {
                    setHoveredRow(null);
                    hidePreview();
                  }}
                  className="group grid cursor-default grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-white/8 py-7 md:grid-cols-[60px_1fr_200px_260px_40px] md:gap-6 transition-colors duration-300 hover:bg-white/[0.02]"
                >
                  <span className="font-montserrat text-[12px] tracking-[0.2em] text-[#ff5c1a]/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3
                      className={`font-garamond text-[clamp(22px,3vw,40px)] leading-tight tracking-[-0.02em] transition-all duration-300 truncate ${
                        hoveredRow === `a-${p.id}` ? "italic translate-x-2" : ""
                      }`}
                    >
                      {p.title}
                    </h3>
                    <p className="mt-1 text-[12px] font-light text-white/40 md:hidden">
                      {p.subtitle} — {p.services.join(" · ")}
                    </p>
                  </div>
                  <span className="hidden font-montserrat text-[11px] uppercase tracking-[0.22em] text-white/45 md:block">
                    {p.subtitle}
                  </span>
                  <span className="hidden font-montserrat text-[11px] uppercase tracking-[0.2em] text-white/30 md:block truncate">
                    {p.services.join(" — ")}
                  </span>
                  <span
                    className={`text-right text-[20px] transition-all duration-300 ${
                      hoveredRow === `a-${p.id}`
                        ? "text-[#ff5c1a] translate-x-1"
                        : "text-white/20"
                    }`}
                  >
                    ↗
                  </span>
                </article>
              ))}
              {filtered.length === 0 && (
                <p className="border-t border-white/8 py-12 text-center text-white/40">
                  Nothing in this category yet — check back soon.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ══════════ 5. TILTED GRID — archive frames ══════════ */}
        <TiltedRevealGrid
          eyebrow="Archive — selected frames"
          heading={
            <>
              <span className="font-normal">Work that earned </span>
              <span className="font-bold italic text-[#ff5c1a]">its place.</span>
            </>
          }
          items={[
            { image: "/images/work/05.jpg" },
            { image: "/images/work/03.jpg" },
            { image: "/images/work/06.jpg" },
            { image: "/images/work/04.jpg" },
            { image: "/images/work/03.jpg" },
            { image: "/images/work/02.jpg" },
          ]}
        />

        {/* ══════════ 6. CLOSING CTA ══════════ */}
        <section className="relative overflow-hidden border-t border-white/10 py-28 md:py-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,92,26,0.07),transparent_45%)]" />
          <div className="k-container relative text-center">
            <p className="mb-6 font-montserrat text-[11px] uppercase tracking-[0.34em] text-white/40">
              Next entry could be yours
            </p>
            <h2 className="k-display-sm k-safe mx-auto max-w-[820px] font-garamond text-white">
              <span className="font-normal">Your project belongs </span>
              <span className="font-bold italic text-[#ff5c1a]">in this archive.</span>
            </h2>
            <div className="mt-12 flex justify-center">
              <Link
                href="/contact"
                data-cursor="TALK"
                className="group inline-flex h-[52px] items-center gap-3 rounded-full bg-white px-10 font-montserrat text-[13px] font-extrabold uppercase italic tracking-[0.06em] text-black transition-all duration-300 hover:bg-[#ff5c1a] hover:shadow-[0_0_40px_rgba(255,92,26,0.4)] active:scale-95"
              >
                Start a project
                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
