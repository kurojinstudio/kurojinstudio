"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ArcGalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface ArcGalleryProps {
  /** Edit this array (or pass your own via props) to swap in your images */
  images?: ArcGalleryImage[];
  brandTitle?: [string, string];
  tagline?: string;
  description?: string;
}

// ---------------------------------------------------------------------
// EDIT YOUR IMAGES HERE — order matters, they lay out left → right along
// the arc. Aim for 7–11 images for the density seen in the reference.
// ---------------------------------------------------------------------
const DEFAULT_IMAGES: ArcGalleryImage[] = [
  { id: "ag-01", src: "/images/work/01.jpg", alt: "Project 01" },
  { id: "ag-02", src: "/images/work/02.jpg", alt: "Project 02" },
  { id: "ag-03", src: "/images/work/03.jpg", alt: "Project 03" },
  { id: "ag-04", src: "/images/work/04.jpg", alt: "Project 04" },
  { id: "ag-05", src: "/images/work/05.jpg", alt: "Project 05" },
  { id: "ag-06", src: "/images/work/06.jpg", alt: "Project 06" },
  { id: "ag-07", src: "/images/work/07.jpg", alt: "Project 07" },
  { id: "ag-08", src: "/images/work/08.jpg", alt: "Project 08" },
  { id: "ag-09", src: "/images/work/09.jpg", alt: "Project 09" },
];

export default function ArcGallery({
  images = DEFAULT_IMAGES,
  brandTitle = ["KURO", "JIN"],
  tagline = "WE CAN DO ANYTHING",
  description = "KUROJIN is a multidisciplinary studio working across creative direction, brand identity, and digital experience. Every engagement is built around the client's own vernacular, not a template.",
}: ArcGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!section || !track || !copy) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const total = cards.length;
      if (total === 0) return;

      // 1) Lay each card on a shallow arc — edges lifted, centre dropped,
      //    plus a light rotation so the row reads as a hand-placed curve
      //    rather than a straight strip.
      cards.forEach((card, i) => {
        const norm = total === 1 ? 0.5 : i / (total - 1); // 0 → 1
        const centered = norm - 0.5; // -0.5 → 0.5
        const arcLift = (1 - Math.pow(centered * 2, 2)) * -70; // centre lifts, edges settle
        const rotate = centered * 8;
        gsap.set(card, { y: arcLift, rotate, transformOrigin: "50% 50%" });
      });

      // 2) Pin the section and drift the whole track sideways as the
      //    person scrolls — this is what makes the arc feel like it is
      //    sliding past a fixed wordmark, rather than the page itself
      //    scrolling past a static image.
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=160%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      });

      gsap.fromTo(
        track,
        { xPercent: 16 },
        { xPercent: -16, ease: "none", scrollTrigger: trigger }
      );

      // 3) Per-card depth: alternate a small extra vertical drift so the
      //    arc doesn't move as one rigid plate.
      cards.forEach((card, i) => {
        const depth = (i % 3) - 1; // -1, 0, 1
        gsap.to(card, {
          y: `+=${depth * 36}`,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=160%",
            scrub: 1,
          },
        });
      });

      // 4) Centre wordmark + copy: soft reveal as the section arrives,
      //    holds through the pin, no exit fade needed since the section
      //    unpins naturally.
      gsap.fromTo(
        copy,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [images]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Arc image track — sits behind the wordmark, drifts on scroll */}
      <div
        ref={trackRef}
        className="absolute left-1/2 top-1/2 z-10 flex items-center gap-4 md:gap-6 pointer-events-none will-change-transform"
        style={{ width: "max-content", transform: "translate(-50%, -50%)" }}
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="relative w-[150px] h-[200px] md:w-[210px] md:h-[280px] shrink-0 overflow-hidden rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
          >
            <img
              src={img.src}
              alt={img.alt}
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Centre wordmark + copy — sits on top of the drifting arc */}
      <div
        ref={copyRef}
        className="relative z-20 flex flex-col items-center text-center px-6 opacity-0"
      >
        <h2 className="font-garamond text-white leading-[0.82] text-[clamp(64px,11vw,150px)] tracking-[-3px]">
          {brandTitle[0]}
          <br />
          {brandTitle[1]}
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl md:max-w-2xl text-left">
          <p className="text-xs md:text-sm text-white/50 leading-relaxed">
            {description}
          </p>
          <p className="mono-label text-white text-xl md:text-2xl uppercase leading-tight">
            {tagline}
          </p>
        </div>
      </div>
    </section>
  );
}