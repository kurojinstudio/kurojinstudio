"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-work-reveal]",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
      // subtle parallax on the background image
      gsap.fromTo(
        "[data-work-bg]",
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full min-h-[680px] h-[100svh] md:h-screen md:min-h-[620px] bg-bg overflow-hidden"
    >
      {/* Background image container */}
      <div className="absolute top-[10%] left-[4%] right-[4%] h-[62vh] max-h-[802px] shadow-[0px_0px_20px_0px_rgba(255,255,255,0.11)] overflow-hidden rounded-lg md:top-[13%] md:left-[8%] md:right-[8%] md:h-[74vh]">
        <div data-work-bg className="absolute inset-0 will-change-transform">
          <Image
            src="/images/hero-bg.jpg"
            alt="Selected work by Kurojin Studio"
            fill
            className="object-cover"
            sizes="84vw"
            quality={80}
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Center text */}
      <div className="absolute top-[36%] left-1/2 -translate-x-1/2 text-center max-w-[768px] w-[92%] z-10 md:top-[41%] md:w-[80%]">
        <p
          data-work-reveal
          className="font-garamond text-[36px] lg:text-[42px] xl:text-[48px] text-near-white uppercase"
          style={{ textShadow: "0px 0px 56.7px rgba(255,255,255,0.6)" }}
        >
          <span className="font-normal leading-[1.08]">Every Pixel</span>
          <span className="font-bold italic leading-[1.08]">, </span>
          <span className="font-bold italic leading-[1.08] text-[#f2f2f2]">
            Handcrafted.
          </span>
        </p>
      </div>

      {/* CTA — quiet editorial link (solid pill reserved for final CTA) */}
      <div data-work-reveal className="absolute top-[57%] left-1/2 -translate-x-1/2 z-10 md:top-[56%]">
        <Link
          href="/work"
          data-cursor="VIEW"
          className="group inline-flex items-center gap-3 font-montserrat text-[12px] md:text-[13px] uppercase tracking-[0.3em] text-white/60 transition-colors duration-300 hover:text-white"
        >
          <span className="relative">
            View selected work
            <span className="absolute -bottom-1.5 left-0 h-px w-full bg-white/25">
              <span className="block h-full w-0 bg-[#ff5c1a] transition-all duration-500 group-hover:w-full" />
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
