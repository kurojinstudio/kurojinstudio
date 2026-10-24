"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal showcase — SOTD pattern (CodeGrid sts8QBVFDLg):
 * section pins, slides travel horizontally on scroll, each image carries
 * an inner parallax drift, titles arrive with a masked slide.
 */
export type ShowcaseSlide = {
  title?: string;
  line2?: string;
  image: string;
  tag?: string;
};

export default function HorizontalShowcase({
  eyebrow,
  slides,
}: {
  eyebrow: string;
  slides: ShowcaseSlide[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1024) return; // horizontal pin is desktop-only

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // inner image parallax drift while pinned
      gsap.utils.toArray<HTMLElement>("[data-hs-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest("[data-hs-slide]"),
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });

      // masked title arrival per slide
      gsap.utils.toArray<HTMLElement>("[data-hs-title]").forEach((t) => {
        gsap.fromTo(
          t,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: {
              trigger: t.closest("[data-hs-slide]"),
              containerAnimation: tween,
              start: "left 75%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/10 bg-[#020202]"
    >
      <div className="k-container pt-14 pb-6 md:pt-20">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/45 font-montserrat">
          {eyebrow}
        </p>
      </div>

      <div ref={trackRef} className="flex w-max items-stretch gap-6 pl-[clamp(20px,5vw,96px)] pr-[clamp(20px,5vw,96px)] pb-16 lg:pb-24">
        {slides.map((s, i) => (
          <div
            key={i}
            data-hs-slide
            className="group relative w-[86vw] sm:w-[70vw] lg:w-[46vw] xl:w-[40vw] shrink-0"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-hs-img
                src={s.image}
                alt={s.title ?? ""}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-[116%] object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {s.tag && (
                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/75 backdrop-blur-md">
                  {s.tag}
                </span>
              )}
            </div>

            {s.title ? (
              <div className="mt-6 flex items-end justify-between gap-6">
                <div className="overflow-hidden">
                  <h3
                    data-hs-title
                    className="font-garamond text-[clamp(30px,3.6vw,54px)] leading-[0.98] tracking-[-0.03em] text-white"
                  >
                    {s.title}
                    {s.line2 && (
                      <>
                        <br />
                        <span className="italic text-white/70">{s.line2}</span>
                      </>
                    )}
                  </h3>
                </div>
                <span className="mb-2 shrink-0 font-montserrat text-[11px] tracking-[0.25em] text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ) : null}
          </div>
        ))}

        {/* end card */}
        <div className="flex w-[60vw] lg:w-[30vw] shrink-0 items-center justify-center">
          <p className="font-garamond italic text-[clamp(24px,2.6vw,40px)] leading-tight text-white/50">
            …and the rest lives on the{" "}
            <span className="text-white">archive below.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
