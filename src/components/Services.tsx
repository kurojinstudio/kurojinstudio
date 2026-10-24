"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DomeGallery from "./DomeGallery";
import ScrollFloat from "./ScrollFloat";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { n: "01", name: "Brand Identity", desc: "Logo systems, guidelines, voice" },
  { n: "02", name: "Web Experiences", desc: "Design & development, motion-first" },
  { n: "03", name: "2D Design", desc: "Illustration, graphics, packaging" },
  { n: "04", name: "3D Content", desc: "Renders, product viz, immersive scenes" },
  { n: "05", name: "Motion Graphics", desc: "Film, ads, social cuts" },
  { n: "06", name: "Social & Campaigns", desc: "Strategy, shoots, direction" },
];

/**
 * Services — interactive index over the dome gallery.
 * Numbered rows reveal on scroll; hover highlights + previews the discipline.
 */
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-svc-row]",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col"
    >
      {/* dome backdrop — lighter geometry on phones */}
      <div className="absolute inset-0 opacity-70">
        <DomeGallery
          fit={0.8}
          minRadius={isMobile ? 420 : 600}
          maxVerticalRotationDeg={0}
          segments={isMobile ? 16 : 34}
          dragDampening={2}
          grayscale
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* heading */}
      <div className="relative z-10 pt-[120px] md:pt-[150px] px-4 md:px-[6%]">
        <p className="font-montserrat text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/50 mb-4">
          Capabilities / 06 disciplines
        </p>
        <div
          className="font-garamond italic font-light text-off-white uppercase leading-[1.02]"
          style={{
            fontSize: "clamp(38px, 8vw, 120px)",
            textShadow: "0px 0px 40.9px rgba(255,236,185,0.6)",
          }}
        >
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            One core, all dimensions.
          </ScrollFloat>
        </div>
      </div>

      {/* service index */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-[6%] py-16 md:py-20">
        <div className="border-t border-white/15">
          {services.map((s, i) => (
            <Link
              key={s.n}
              href="/service"
              data-svc-row
              data-cursor="VIEW"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`group flex items-center justify-between gap-4 border-b border-white/15 py-5 md:py-6 transition-all duration-500 ${
                active === null || active === i ? "opacity-100" : "opacity-30"
              }`}
            >
              <div className="flex items-baseline gap-4 md:gap-8 min-w-0">
                <span className="font-montserrat text-[11px] md:text-[12px] text-white/40 tracking-[0.2em] shrink-0">
                  {s.n}
                </span>
                <span
                  className={`font-garamond uppercase leading-none transition-all duration-500 whitespace-nowrap overflow-hidden text-ellipsis ${
                    active === i
                      ? "text-white italic translate-x-2"
                      : "text-white/85"
                  }`}
                  style={{ fontSize: "clamp(24px, 4.5vw, 56px)" }}
                >
                  {s.name}
                </span>
                <span className="hidden lg:inline font-light text-white/45 text-[13px] md:text-[14px] truncate">
                  — {s.desc}
                </span>
              </div>
              <ArrowUpRight
                className={`shrink-0 transition-all duration-500 ${
                  active === i
                    ? "text-white translate-x-1 -translate-y-1"
                    : "text-white/30"
                }`}
                size={22}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* explore CTA */}
      <div className="relative z-10 pb-14 md:pb-16 flex justify-center">
        <Link
          href="/service"
          data-cursor="VIEW"
          className="cta-button h-[46px] px-10 text-[13px]"
        >
          Explore All Services
        </Link>
      </div>
    </section>
  );
}
