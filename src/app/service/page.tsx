"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import SvcParallax from "@/components/SvcParallax";

/* ══════════════════════════════════════════════════════════════
   SERVICE DOSSIER — "classified dossier meets modern lab"
   Black field · paper redactions · stamp red #ff4a1c, sparing.
   Garamond display / Helvetica labels / Plex Mono data & clues.
   One signature hero animation (sequential declassification +
   stamp thud). Scroll reveals via IntersectionObserver only.
   ══════════════════════════════════════════════════════════════ */

const services = [
  {
    number: "01",
    title: "Brand Systems",
    description:
      "Positioning, visual language, messaging structure, and digital identity systems designed to make your product feel coherent from the first impression to the final interaction.",
    items: ["Identity direction", "Messaging structure", "Design language"],
  },
  {
    number: "02",
    title: "Web Design",
    description:
      "Minimal, modern websites with strong hierarchy, better spacing, clear motion, and layouts that feel deliberate instead of template-driven.",
    items: ["Landing pages", "Portfolio sites", "Marketing websites"],
  },
  {
    number: "03",
    title: "Product Design",
    description:
      "Interfaces shaped around usability, conversion, and clarity — designed to remove friction and make complex products easier to understand.",
    items: ["UX systems", "Dashboards", "Design refinement"],
  },
  {
    number: "04",
    title: "Development",
    description:
      "Fast, scalable frontend and full-stack implementation using modern tooling, with an emphasis on maintainability, performance, and clean component systems.",
    items: ["Next.js builds", "Full-stack apps", "Performance optimization"],
  },
  {
    number: "05",
    title: "Automation",
    description:
      "Operational workflows, integrations, and backend processes that reduce repetitive work and help teams move with less manual overhead.",
    items: ["API integrations", "Internal workflows", "Process automation"],
  },
  {
    number: "06",
    title: "Launch Support",
    description:
      "Structured support before and after launch to ensure the product ships with confidence, stays polished, and continues improving after release.",
    items: ["QA review", "Launch planning", "Post-launch iteration"],
  },
];

const protocol = [
  { step: "01", phase: "WEEK 01", title: "Discovery", body: "We dig into your brand, audience, and goals before a single pixel moves. Findings are filed, not guessed." },
  { step: "02", phase: "WEEKS 02–04", title: "Design", body: "Identity, layout, and motion — one coherent visual language, explored in variants until it holds." },
  { step: "03", phase: "WEEKS 04–08", title: "Build", body: "Clean, performant implementation. Fast loads, smooth interactions, no shortcuts on record." },
  { step: "04", phase: "ONGOING", title: "Launch & Refine", body: "We ship with confidence, then keep sharpening after release. The file never fully closes." },
];

const annexures = [
  {
    q: "How long does a typical project take?",
    a: "Landing pages ship in 2–3 weeks. Full brand systems and multi-page experiences run 4–8 weeks depending on scope. We set the timeline in discovery and hold it.",
  },
  {
    q: "What does an engagement cost?",
    a: "Budgets change; standards don't. We scope to your number and refine the output — never the excellence. You get less volume before you get less quality.",
  },
  {
    q: "Do you work with early-stage brands?",
    a: "Yes. Some of our best work started as a blank page and a strong story. We shape identity, web, and motion around it — all under one roof.",
  },
  {
    q: "Can you take over an existing site?",
    a: "We audit, then rebuild or refine. If the foundation is sound we elevate it; if it fights the brand, we replace it with something considered.",
  },
  {
    q: "What happens after launch?",
    a: "We stay on. Post-launch iteration, performance tuning, and content systems keep the site alive instead of frozen in time.",
  },
];

const indexTerms = [
  "Brand Identity",
  "Web Design",
  "Development",
  "2D Illustration",
  "3D Content",
  "Motion Graphics",
  "Product Shoots",
  "Social Media",
  "Packaging",
  "Campaign Direction",
];

/* Redacted word — bar wipes away once .is-declassified lands on an
   ancestor; per-word transitionDelay staggers the declassification. */
function Rd({
  children,
  delay = 0,
  accent = false,
}: {
  children: React.ReactNode;
  delay?: number;
  accent?: boolean;
}) {
  return (
    <span className="rd-wrap">
      <span
        className={`rd-text transition-colors duration-700 ${
          accent ? "italic text-[#ff4a1c]" : ""
        }`}
        style={{ transitionDelay: `${delay + 500}ms` }}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="rd-bar"
        style={{ transitionDelay: `${delay}ms` }}
      />
    </span>
  );
}

export default function Service() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [declassified, setDeclassified] = useState(false);
  const [openSvc, setOpenSvc] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* Signature hero moment — flip once on mount; CSS delays cascade
     the redaction bars away, then the stamp thuds in. */
  useEffect(() => {
    const t = window.setTimeout(() => setDeclassified(true), 350);
    return () => window.clearTimeout(t);
  }, []);

  /* Scroll reveals — IntersectionObserver, fire-once */
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll("[data-reveal]");
    if (!els || els.length === 0) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <SmoothScrollProvider>
      <div ref={rootRef} className="relative bg-[#050505] text-white">
        {/* ── Lab chrome: hairline column rules + punched holes (desktop) ── */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
          <div className="absolute inset-y-0 left-1/4 w-px bg-white/[0.035]" />
          <div className="absolute inset-y-0 left-2/4 w-px bg-white/[0.035]" />
          <div className="absolute inset-y-0 left-3/4 w-px bg-white/[0.035]" />
          <div className="absolute left-5 top-1/2 flex -translate-y-1/2 flex-col gap-28">
            {[0, 1, 2].map((h) => (
              <span
                key={h}
                className="block h-3.5 w-3.5 rounded-full bg-[#010101] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.09)]"
              />
            ))}
          </div>
        </div>

        <Navbar />

        {/* ══════════ 1. HERO — the declassification ══════════ */}
        <section className="relative z-10 pt-44 pb-32 md:pt-56 md:pb-40">
          <div className="k-container">
            {/* dossier meta line */}
            <p data-reveal className="font-clue mb-14 flex flex-wrap gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-white/35 md:text-[11px]">
              <span>FILE NO. KJ-SVC-2026</span>
              <span aria-hidden="true" className="text-white/15">/</span>
              <span>SUBJECT: CAPABILITIES</span>
              <span aria-hidden="true" className="text-white/15">/</span>
              <span>CLEARANCE: PUBLIC</span>
            </p>

            <h1
              className={`k-display k-safe max-w-[1150px] font-garamond text-white ${
                declassified ? "is-declassified" : ""
              }`}
            >
              <Rd delay={200}>Everything</Rd>{" "}
              <Rd delay={340}>we</Rd>{" "}
              <Rd delay={480}>do,</Rd>{" "}
              <Rd delay={620} accent>
                declassified.
              </Rd>
            </h1>

            <p
              data-reveal
              className="mt-12 max-w-[600px] text-[15px] font-light leading-[1.8] text-white/55 md:text-[17px]"
            >
              Six disciplines, one operating principle: reduce the noise,{" "}
              <span className="rd-hover whitespace-nowrap">
                <span className="rd-wrap">
                  <span className="rd-text italic text-white/85">sharpen the signal</span>
                  <span aria-hidden="true" className="rd-bar" />
                </span>
              </span>
              , ship work that feels inevitable.
            </p>
            <p data-reveal className="mt-4 font-clue text-[10px] uppercase tracking-[0.3em] text-white/25">
              [ Hover specimen to declassify ]
            </p>

            {/* dossier title block + stamp */}
            <div data-reveal className="relative mt-24 max-w-[1000px]">
              <div className="grid grid-cols-2 border border-white/12 md:grid-cols-4">
                {[
                  { k: "FILE NO.", v: "KJ-SVC-2026" },
                  { k: "SUBJECT", v: "Full-spectrum capability" },
                  { k: "STATUS", v: "Accepting projects" },
                  { k: "ISSUED", v: "Q3 — MMXXVI" },
                ].map((cell, i) => (
                  <div
                    key={cell.k}
                    className={`px-6 py-5 ${i > 0 ? "border-l border-white/12" : ""} ${
                      i >= 2 ? "border-t border-white/12 md:border-t-0" : ""
                    } ${i === 2 ? "border-l-0 md:border-l" : ""}`}
                  >
                    <p className="font-clue text-[9px] uppercase tracking-[0.3em] text-white/30 md:text-[10px]">
                      {cell.k}
                    </p>
                    <p className="mt-2 font-montserrat text-[12px] uppercase tracking-[0.12em] text-white/85 md:text-[13px]">
                      {cell.v}
                    </p>
                  </div>
                ))}
              </div>

              {/* rubber stamp — the thud */}
              <div
                aria-hidden="true"
                style={{ ["--rot" as string]: "-8deg", animationDelay: "1250ms" }}
                className={`stamp-double stamp-in absolute -top-7 right-4 flex items-center px-5 py-2.5 font-clue text-[11px] uppercase tracking-[0.35em] md:-top-8 md:right-8 md:text-[13px] ${
                  declassified ? "" : "opacity-0"
                }`}
              >
                <span className="text-[#ff4a1c]">Declassified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 2. EXHIBITS — expanding service rows ══════════ */}
        <section data-reveal className="relative z-10 py-24 md:py-36">
          <div className="k-container">
            <div className="mb-14 flex items-baseline justify-between border-b border-white/10 pb-6">
              <p className="font-clue text-[10px] uppercase tracking-[0.35em] text-white/35 md:text-[11px]">
                Section 02 — Exhibits
              </p>
              <p className="font-clue text-[10px] tracking-[0.25em] text-white/20 md:text-[11px]">
                06 ITEMS
              </p>
            </div>

            <div className="border-b border-white/10">
              {services.map((service, i) => {
                const open = openSvc === i;
                return (
                  <div key={service.number} data-reveal className="border-t border-white/10">
                    <button
                      onClick={() => setOpenSvc(open ? null : i)}
                      aria-expanded={open}
                      className="group flex w-full cursor-pointer items-center justify-between gap-6 py-12 text-left md:py-14"
                    >
                      <span className="flex min-w-0 items-baseline gap-6 md:gap-12">
                        <span
                          className={`shrink-0 font-clue text-[11px] tracking-[0.25em] transition-colors duration-300 ${
                            open ? "text-[#ff4a1c]" : "text-white/30 group-hover:text-white/60"
                          }`}
                        >
                          EX.{service.number}
                        </span>
                        <span
                          className={`truncate font-garamond text-[clamp(26px,4vw,52px)] leading-none tracking-[-0.02em] transition-all duration-500 ${
                            open
                              ? "italic text-white"
                              : "text-white/70 group-hover:translate-x-2 group-hover:text-white"
                          }`}
                        >
                          {service.title}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[20px] leading-none transition-all duration-500 ${
                          open
                            ? "rotate-45 border-[#ff4a1c]/50 text-[#ff4a1c]"
                            : "border-white/12 text-white/35 group-hover:border-white/40 group-hover:text-white/70"
                        }`}
                      >
                        +
                      </span>
                    </button>

                    <div
                      className="grid transition-all duration-500 ease-out"
                      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="grid gap-10 pb-14 md:grid-cols-[1.4fr_1fr] md:gap-16 md:pl-[96px]">
                          <p className="max-w-[620px] text-[14px] font-light leading-[1.85] text-white/55 md:text-[15px]">
                            {service.description}
                          </p>
                          <div className="border-l border-white/10 pl-6">
                            <p className="mb-4 font-clue text-[9px] uppercase tracking-[0.3em] text-white/30">
                              Deliverables — approved
                            </p>
                            <ul className="space-y-3">
                              {service.items.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-center gap-3 font-montserrat text-[12px] uppercase tracking-[0.18em] text-white/65"
                                >
                                  <span
                                    className={`h-[2px] w-4 transition-colors duration-500 ${
                                      open ? "bg-[#ff4a1c]/80" : "bg-white/25"
                                    }`}
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════ 3. PLATES — deliverables parallax ══════════ */}
        <SvcParallax
          cards={[
            { tag: "Plate 01", title: "Brand guidelines", body: "A living spec: logo systems, type, color, motion behavior — documented so any team can execute it.", image: "/images/work/06.jpg" },
            { tag: "Plate 02", title: "Production sites", body: "Shipped Next.js builds with animation systems, CMS hooks, and performance budgets already met.", image: "/images/work/07.jpg" },
            { tag: "Plate 03", title: "Animation kits", body: "Loops, transitions, and social-ready motion assets cut for every platform's aspect ratio.", image: "/images/work/05.jpg" },
            { tag: "Plate 04", title: "Visual content", body: "Illustration, renders, and product shots — one art direction across every dimension.", image: "/images/work/04.jpg" },
            { tag: "Plate 05", title: "Content systems", body: "Template logic + launch calendars so the feed stays sharp after we hand it over.", image: "/images/work/08.jpg" },
            { tag: "Plate 06", title: "Iteration retainers", body: "Post-launch tuning, A/B visuals, and new pages as your product evolves.", image: "/images/work/09.jpg" },
          ]}
        />

        {/* ══════════ 4. PROTOCOL — table-of-contents rail ══════════ */}
        <section data-reveal className="relative z-10 border-t border-white/10 py-24 md:py-36">
          <div className="k-container">
            <p data-reveal className="mb-6 font-clue text-[10px] uppercase tracking-[0.35em] text-white/35 md:text-[11px]">
              Section 03 — Protocol
            </p>
            <h2 data-reveal className="k-display-sm k-safe max-w-[760px] font-garamond text-white">
              <span className="font-normal">Method, </span>
              <span className="font-bold italic">on record.</span>
            </h2>

            <div className="mt-20 border-b border-white/10">
              {protocol.map((p, i) => (
                <div
                  key={p.step}
                  data-reveal
                  style={{ transitionDelay: `${i * 90}ms` }}
                  className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-t border-white/10 py-8 transition-colors duration-300 hover:bg-white/[0.025] sm:grid-cols-[auto_1fr_auto_auto] md:gap-x-8 md:py-10"
                >
                  <span className="col-start-1 row-start-1 font-clue text-[11px] tracking-[0.2em] text-white/30 transition-colors duration-300 group-hover:text-[#ff4a1c]">
                    {p.step}
                  </span>
                  <h3 className="col-start-2 row-start-1 min-w-0 font-garamond text-[22px] leading-tight text-white/85 transition-colors duration-300 group-hover:text-white md:text-[30px]">
                    {p.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="hidden self-center border-b border-dotted border-white/15 transition-colors duration-300 group-hover:border-[#ff4a1c]/40 sm:col-start-3 sm:row-start-1 sm:block"
                  />
                  <span className="col-span-2 col-start-1 row-start-2 mt-3 font-clue text-[10px] tracking-[0.25em] text-white/40 sm:col-span-1 sm:col-start-4 sm:row-start-1 sm:mt-0 sm:justify-self-end">
                    {p.phase}
                  </span>
                  <p className="col-span-2 col-start-1 row-start-3 mt-4 max-w-[520px] text-[13px] font-light leading-7 text-white/50 sm:col-start-2 sm:row-start-2">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 5. INDEX OF TERMS — marquee ══════════ */}
        <section data-reveal className="relative z-10 w-full overflow-hidden border-y border-white/10 py-14 md:py-16">
          <div className="flex w-max animate-marquee">
            {[...indexTerms, ...indexTerms].map((term, i) => (
              <span key={`${term}-${i}`} className="flex items-center whitespace-nowrap">
                <span className="px-7 font-clue text-[13px] uppercase tracking-[0.3em] text-white/40 md:text-[15px]">
                  {term}
                </span>
                <span aria-hidden="true" className="text-[10px] text-[#ff4a1c]/50">
                  ✕
                </span>
              </span>
            ))}
          </div>
        </section>

        {/* ══════════ 6. ANNEXURES — FAQ accordion ══════════ */}
        <section data-reveal className="relative z-10 py-24 md:py-36">
          <div className="k-container">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
              <div>
                <p data-reveal className="mb-6 font-clue text-[10px] uppercase tracking-[0.35em] text-white/35 md:text-[11px]">
                  Section 04 — Annexures
                </p>
                <h2 data-reveal className="k-display-sm k-safe font-garamond text-white">
                  <span className="font-normal">Asked before </span>
                  <span className="font-bold italic">every project.</span>
                </h2>
                <p data-reveal className="mt-8 max-w-[400px] text-[14px] font-light leading-7 text-white/50">
                  The honest answers, up front. Anything else — ask us directly.
                </p>
              </div>

              <div className="border-b border-white/10">
                {annexures.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <div key={i} data-reveal className="border-t border-white/10">
                      <button
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        className="group flex w-full cursor-pointer items-center justify-between gap-6 py-8 text-left"
                      >
                        <span className="flex min-w-0 items-baseline gap-5">
                          <span className="shrink-0 font-clue text-[11px] tracking-[0.2em] text-white/30 transition-colors duration-300 group-hover:text-[#ff4a1c]">
                            Q.{String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`font-garamond text-[19px] leading-snug transition-colors duration-300 md:text-[23px] ${
                              open ? "italic text-white" : "text-white/65 group-hover:text-white"
                            }`}
                          >
                            {f.q}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[17px] transition-all duration-300 ${
                            open
                              ? "rotate-45 border-[#ff4a1c]/50 text-[#ff4a1c]"
                              : "border-white/12 text-white/40 group-hover:border-white/40"
                          }`}
                        >
                          +
                        </span>
                      </button>
                      <div
                        className="grid transition-all duration-500 ease-out"
                        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <p className="pb-8 pr-2 text-[13px] font-light leading-[1.85] text-white/50 md:pl-[64px] md:text-[14px]">
                            {f.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 7. CTA — request clearance ══════════ */}
        <section data-reveal className="relative z-10 overflow-hidden border-t border-white/10 py-28 md:py-40">
          <div className="k-container relative text-center">
            <p className="mb-8 font-clue text-[10px] uppercase tracking-[0.35em] text-white/35 md:text-[11px]">
              End of dossier
            </p>
            <h2 className="k-display-sm k-safe mx-auto max-w-[820px] font-garamond text-white">
              <span className="font-normal">Ready for </span>
              <span className="font-bold italic">clearance?</span>
            </h2>
            <div className="mt-16 flex justify-center">
              <Link
                href="/contact"
                data-cursor="TALK"
                className="group relative inline-flex items-center gap-3 border border-white/25 px-12 py-5 font-montserrat text-[12px] font-extrabold uppercase italic tracking-[0.08em] text-white transition-colors duration-300 hover:border-[#ff4a1c]/70 active:scale-95 md:text-[13px]"
              >
                Request clearance
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                {/* stamp appears on hover */}
                <span
                  aria-hidden="true"
                  style={{ ["--rot" as string]: "8deg" }}
                  className="stamp-double pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 scale-[1.6] px-3 py-1 font-clue text-[9px] uppercase normal-case not-italic tracking-[0.3em] opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
                >
                  <span className="text-[#ff4a1c]">Approved</span>
                </span>
              </Link>
            </div>
            <p className="mt-10 font-clue text-[10px] uppercase tracking-[0.25em] text-white/25">
              Response within 24 hours — no obligation
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
