"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { siteConfig } from "@/lib/site-config";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────
   TERMINAL — dark-room transmission theme
   accent: violet #a78bfa / base #020204
   The form IS the hero.
   ──────────────────────────────────────────────── */

interface TrailImage {
  element: HTMLImageElement;
  rotation: number;
  removeTime: number;
}

type FormState = "idle" | "submitting" | "success" | "error";

const VIOLET = "#a78bfa";

const projectTypes = ["Branding", "Web", "2D", "3D", "Motion", "Social", "Other"];
const budgetRanges = ["< $1k", "$1k – $5k", "$5k – $15k", "$15k+", "Not sure yet"];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<TrailImage[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const lastRemovalRef = useRef(0);
  const mouseMoveListenerRef = useRef<((e: MouseEvent) => void) | null>(null);

  const config = {
    imageCount: 8,
    imageLifespan: 800,
    removalDelay: 60,
    mouseThreshold: 80,
    inDuration: 600,
    outDuration: 800,
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
  };

  const images = Array.from(
    { length: config.imageCount },
    (_, i) => `/images/All/Artboard-${i + 1}.webp`
  );

  /* ── entrance animations ── */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-term-reveal]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }
      );
      gsap.utils.toArray<HTMLElement>("[data-term-section]").forEach((sec) => {
        gsap.fromTo(
          sec.querySelectorAll("[data-term-item]"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: sec, start: "top 80%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* ── pointer trail canvas (preserved from original) ── */
  const createTrailImage = useCallback(
    (clientX: number, clientY: number) => {
      const container = trailContainerRef.current;
      if (!container) return;

      const img = document.createElement("img");
      img.classList.add("trail-img");

      const randomIndex = Math.floor(Math.random() * images.length);
      const rotation = (Math.random() - 0.5) * 40;

      img.src = images[randomIndex];
      img.alt = "";

      const rect = container.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;

      img.style.position = "absolute";
      img.style.left = `${relativeX}px`;
      img.style.top = `${relativeY}px`;
      img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;
      img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;
      img.style.pointerEvents = "none";
      img.style.zIndex = "5";
      img.style.borderRadius = "12px";
      img.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.6)";
      img.style.maxWidth = "180px";
      img.style.height = "auto";

      container.appendChild(img);

      setTimeout(() => {
        img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
      }, 16);

      trailRef.current.push({
        element: img,
        rotation,
        removeTime: Date.now() + config.imageLifespan,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images]
  );

  const removeOldTrailImages = useCallback(() => {
    const now = Date.now();
    if (now - lastRemovalRef.current < config.removalDelay || trailRef.current.length === 0) return;

    const oldest = trailRef.current[0];
    if (now >= oldest.removeTime) {
      const toRemove = trailRef.current.shift()!;

      toRemove.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
      toRemove.element.style.transform = `translate(-50%, -50%) rotate(${toRemove.rotation}deg) scale(0)`;

      lastRemovalRef.current = now;

      setTimeout(() => {
        if (toRemove.element.parentNode) {
          toRemove.element.parentNode.removeChild(toRemove.element);
        }
      }, config.outDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = trailContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isInside) return;

      const distance = Math.hypot(
        e.clientX - lastMouseRef.current.x,
        e.clientY - lastMouseRef.current.y
      );

      if (distance > config.mouseThreshold) {
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        createTrailImage(e.clientX, e.clientY);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createTrailImage]
  );

  const startTrailAnimation = useCallback(() => {
    if (typeof window === "undefined" || window.innerWidth <= 1000) return;
    if (mouseMoveListenerRef.current) return;

    mouseMoveListenerRef.current = handleMouseMove;
    document.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      removeOldTrailImages();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [handleMouseMove, removeOldTrailImages]);

  const stopTrailAnimation = useCallback(() => {
    if (mouseMoveListenerRef.current) {
      document.removeEventListener("mousemove", mouseMoveListenerRef.current);
      mouseMoveListenerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    trailRef.current.forEach((item) => {
      if (item.element.parentNode) {
        item.element.parentNode.removeChild(item.element);
      }
    });
    trailRef.current = [];
  }, []);

  useEffect(() => {
    const floatingContainer = document.querySelector(".floating-elements");
    if (floatingContainer) {
      for (let i = 0; i < 12; i++) {
        const el = document.createElement("div");
        el.className = "floating-element";
        el.style.left = `${Math.random() * 100}%`;
        el.style.animationDelay = `${Math.random() * 8}s`;
        el.style.animationDuration = `${8 + Math.random() * 4}s`;
        floatingContainer.appendChild(el);
      }
    }

    startTrailAnimation();

    const handleResize = () => {
      if (window.innerWidth <= 1000) stopTrailAnimation();
      else startTrailAnimation();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      stopTrailAnimation();
      window.removeEventListener("resize", handleResize);
      if (floatingContainer) floatingContainer.innerHTML = "";
    };
  }, [startTrailAnimation, stopTrailAnimation]);

  /* ── form ── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "submitting") return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormState("error");
      setErrorMsg("Please fill in your name, email and message.");
      return;
    }

    setFormState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(siteConfig.contact.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          budget: formData.budget,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setFormState("success");
      setTimeout(() => {
        setFormState("idle");
        setFormData({ name: "", email: "", projectType: "", budget: "", message: "" });
      }, 4000);
    } catch (err) {
      setFormState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  };

  const inputClass =
    "w-full border-b border-white/15 bg-transparent py-3.5 text-[15px] font-light text-white placeholder:text-white/25 outline-none transition-colors duration-300 focus:border-[#a78bfa]";
  const labelClass =
    "mb-1 block font-montserrat text-[10px] uppercase tracking-[0.3em] text-white/40";

  return (
    <SmoothScrollProvider>
      <div
        ref={rootRef}
        className="relative min-h-screen bg-[#020204] text-white"
      >
        {/* scanline texture */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, #a78bfa 2px, #a78bfa 3px)",
          }}
        />
        {/* violet glow */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(167,139,250,0.08), transparent 60%)",
          }}
        />

        <Navbar />

        {/* ══════════ 1. HERO / FORM — split transmission ══════════ */}
        <section className="relative z-10 pt-44 pb-20 md:pt-52 md:pb-28">
          <div className="k-container">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              {/* left: heading + channels */}
              <div>
                <p
                  data-term-reveal
                  className="mb-8 font-montserrat text-[11px] uppercase tracking-[0.4em] text-[#a78bfa]"
                >
                  Transmission / Open channel 黒人
                </p>
                <h1
                  data-term-reveal
                  className="font-garamond leading-[0.92] tracking-[-0.03em] text-white"
                  style={{ fontSize: "clamp(48px, 7vw, 104px)" }}
                >
                  <span className="font-normal">Start a</span>
                  <br />
                  <span className="font-bold italic text-[#a78bfa]">transmission</span>
                </h1>
                <p
                  data-term-reveal
                  className="mt-8 max-w-[440px] text-[15px] font-light leading-[1.75] text-white/55"
                >
                  Have a project in mind? Want to collaborate? Open a channel —
                  every message gets a human reply within 24 hours.
                </p>

                {/* contact channels */}
                <div data-term-reveal className="mt-14 space-y-5">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="group flex items-center gap-4 text-white/70 transition-colors duration-300 hover:text-[#a78bfa]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 transition-colors duration-300 group-hover:border-[#a78bfa]/50">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="text-[15px] font-light">{siteConfig.contact.email}</span>
                  </a>
                  {siteConfig.contact.phone && (
                    <a
                      href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                      className="group flex items-center gap-4 text-white/70 transition-colors duration-300 hover:text-[#a78bfa]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 transition-colors duration-300 group-hover:border-[#a78bfa]/50">
                        <Phone className="h-4 w-4" />
                      </span>
                      <span className="text-[15px] font-light">{siteConfig.contact.phone}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-4 text-white/50">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="text-[15px] font-light">{siteConfig.contact.location}</span>
                  </div>
                </div>

                {/* socials */}
                <div data-term-reveal className="mt-12 flex flex-wrap gap-3">
                  {siteConfig.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/12 px-5 py-2 font-montserrat text-[11px] uppercase tracking-[0.2em] text-white/55 transition-all duration-300 hover:border-[#a78bfa]/60 hover:text-[#a78bfa]"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* right: the form panel */}
              <div data-term-reveal>
                <div className="relative rounded-[28px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm md:p-10">
                  <div className="mb-8 flex items-center justify-between border-b border-white/8 pb-5">
                    <span className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-white/40">
                      Form / 001
                    </span>
                    <span className="flex items-center gap-2 font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#a78bfa]/80">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#a78bfa]" />
                      Channel open
                    </span>
                  </div>

                  {formState === "success" ? (
                    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#a78bfa]/50 text-[28px] text-[#a78bfa]">
                        ✓
                      </span>
                      <h3 className="font-garamond text-[32px] italic text-white">
                        Transmission received.
                      </h3>
                      <p className="mt-4 max-w-[320px] text-[14px] font-light leading-6 text-white/55">
                        We&apos;ll decode it and reply within 24 hours. Keep an
                        eye on your inbox.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="grid gap-7 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className={labelClass}>
                            Name *
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className={labelClass}>
                            Email *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@company.com"
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="projectType" className={labelClass}>
                            Project type
                          </label>
                          <select
                            id="projectType"
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            className={`${inputClass} cursor-pointer appearance-none bg-[#020204]`}
                          >
                            <option value="">Select…</option>
                            {projectTypes.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="budget" className={labelClass}>
                            Budget range
                          </label>
                          <select
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className={`${inputClass} cursor-pointer appearance-none bg-[#020204]`}
                          >
                            <option value="">Select…</option>
                            {budgetRanges.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="message" className={labelClass}>
                            Message *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us about the project…"
                            className={`${inputClass} resize-none`}
                            required
                          />
                        </div>
                      </div>

                      {formState === "error" && errorMsg && (
                        <p className="mt-5 rounded-lg border border-red-400/25 bg-red-400/8 px-4 py-3 text-[13px] text-red-300">
                          {errorMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={formState === "submitting"}
                        data-cursor="SEND"
                        className="mt-9 flex h-[52px] w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-white font-montserrat text-[13px] font-extrabold uppercase italic tracking-[0.08em] text-black transition-all duration-300 hover:bg-[#a78bfa] hover:shadow-[0_0_40px_rgba(167,139,250,0.4)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                      >
                        {formState === "submitting" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Transmitting…
                          </>
                        ) : (
                          <>Send message ↗</>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 2. INTERACTIVE TRAIL CANVAS ══════════ */}
        <section data-term-section className="relative z-10 pb-24 md:pb-32">
          <div className="k-container">
            <p data-term-item className="mb-6 font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/40">
              Signal test — move your cursor
            </p>
            <div data-term-item className="h-[220px] w-full sm:h-[280px] md:h-[360px]">
              <div
                ref={trailContainerRef}
                data-cursor="PLAY"
                className="trail-container relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-black/60"
              >
                <div className="floating-elements pointer-events-none absolute inset-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="pointer-events-none select-none font-garamond italic text-[clamp(20px,3vw,36px)] text-white/25">
                    drag through the dark…
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ 3. WHAT HAPPENS NEXT ══════════ */}
        <section data-term-section className="relative z-10 border-t border-white/8 py-20 md:py-28">
          <div className="k-container">
            <p data-term-item className="mb-12 text-center font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/45">
              After you hit send
            </p>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { step: "01", title: "We reply", body: "Within 24 hours — a real human, not an autoresponder." },
                { step: "02", title: "We listen", body: "A short call to understand your brand, goals, and budget." },
                { step: "03", title: "We propose", body: "A clear scope, timeline, and number. No surprises later." },
              ].map((s) => (
                <div
                  key={s.step}
                  data-term-item
                  className="rounded-[24px] border border-white/10 bg-white/[0.02] p-7 text-center transition-colors duration-300 hover:border-[#a78bfa]/35"
                >
                  <span className="font-garamond italic text-[34px] leading-none text-[#a78bfa]/75">
                    {s.step}
                  </span>
                  <h3 className="mt-4 font-garamond text-[21px] text-white">{s.title}</h3>
                  <p className="mt-2.5 text-[13px] font-light leading-6 text-white/55">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ 4. AVAILABILITY STATUS STRIP ══════════ */}
        <section className="relative z-10 border-t border-white/8 py-10">
          <div className="k-container flex flex-wrap items-center justify-center gap-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a78bfa] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#a78bfa]" />
            </span>
            <p className="font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/50">
              Status: accepting new projects — response time &lt; 24h
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
