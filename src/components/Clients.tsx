"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import BlurText from "./BlurText";
import TextType from "./TextType";

interface Logo {
  src: string;
  alt: string;
  blend?: boolean;
}

// One master array of all client logos — each logo appears in EXACTLY ONE row.
// alt="" — decorative in the marquee; the section header carries the meaning.
const allLogos: Logo[] = [
  { src: "/images/logo-01.png", alt: "" },
  { src: "/images/logo-02.png", alt: "" },
  { src: "/images/logo-03.png", alt: "" },
  { src: "/images/logo-04.png", alt: "" },
  { src: "/images/logo-05.png", alt: "" },
  { src: "/images/logo-06.png", alt: "" },
  { src: "/images/logo-07.png", alt: "" },
  { src: "/images/logo-08.png", alt: "" },
  { src: "/images/logo-09.png", alt: "" },
  { src: "/images/logo-10.png", alt: "" },
  { src: "/images/logo-11.png", alt: "" },
  { src: "/images/logo-12.png", alt: "" },
  { src: "/images/logo-13.png", alt: "" },
  { src: "/images/logo-14.png", alt: "" },
  { src: "/images/logo-15.png", alt: "" },
];

const titleTypingSpeed = 19;
const titleSegments = [
  { text: "Because ", initialDelay: 0 },
  { text: '"good enough" ', initialDelay: 150 },
  { text: "was never the plan.", initialDelay: 438 },
];
const titleAnimationDuration =
  Math.max(
    ...titleSegments.map(
      (segment) =>
        segment.initialDelay + segment.text.length * titleTypingSpeed,
    ),
  ) + 60;

export default function Clients() {
  const logoEls = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const descriptionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [startTitleAnimation, setStartTitleAnimation] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const logoCentersRef = useRef<{ x: number; y: number }[]>([]);
  const pointerFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const triggerAnimationsOnScroll = () => {
      if (!titleRef.current || startTitleAnimation) return;

      const rect = titleRef.current.getBoundingClientRect();
      const viewportTrigger = window.innerHeight * 0.8;

      if (rect.top <= viewportTrigger) {
        setStartTitleAnimation(true);

        descriptionTimeoutRef.current = setTimeout(() => {
          setShowDescription(true);
        }, titleAnimationDuration);
      }
    };

    window.addEventListener("scroll", triggerAnimationsOnScroll, {
      passive: true,
    });
    window.addEventListener("resize", triggerAnimationsOnScroll);
    triggerAnimationsOnScroll();

    return () => {
      window.removeEventListener("scroll", triggerAnimationsOnScroll);
      window.removeEventListener("resize", triggerAnimationsOnScroll);
    };
  }, [startTitleAnimation]);

  useEffect(() => {
    return () => {
      if (descriptionTimeoutRef.current) {
        clearTimeout(descriptionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || window.matchMedia("(pointer: coarse)").matches) return;

    let maxDistance = 180;

    const refreshGeometry = () => {
      const gridRect = grid.getBoundingClientRect();
      maxDistance = Math.max(180, Math.min(gridRect.width, gridRect.height) * 0.3);
      logoCentersRef.current = logoEls.current.map((logo) => {
        if (!logo) return { x: 0, y: 0 };
        const rect = logo.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      });
    };

    const resetScales = () => {
      pointerRef.current.active = false;
      logoEls.current.forEach((logo) => {
        if (logo) logo.style.transform = "scale(1)";
      });
    };

    const updateScales = () => {
      pointerFrameRef.current = null;
      if (!pointerRef.current.active) return;

      const { x, y } = pointerRef.current;
      logoEls.current.forEach((logo, index) => {
        if (!logo) return;
        const center = logoCentersRef.current[index];
        if (!center) return;
        const distance = Math.hypot(x - center.x, y - center.y);
        const proximity = Math.max(0, 1 - distance / maxDistance);
        logo.style.transform = `translateZ(0) scale(${1 + proximity * 0.5})`;
      });
    };

    const scheduleScaleUpdate = () => {
      if (pointerFrameRef.current === null) {
        pointerFrameRef.current = requestAnimationFrame(updateScales);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.active = true;
      scheduleScaleUpdate();
    };

    const onLayoutChange = () => {
      refreshGeometry();
      scheduleScaleUpdate();
    };

    refreshGeometry();
    grid.addEventListener("pointermove", onPointerMove, { passive: true });
    grid.addEventListener("pointerleave", resetScales, { passive: true });
    window.addEventListener("resize", onLayoutChange, { passive: true });
    window.addEventListener("scroll", onLayoutChange, { passive: true });
    const resizeObserver = new ResizeObserver(onLayoutChange);
    resizeObserver.observe(grid);

    return () => {
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
      }
      grid.removeEventListener("pointermove", onPointerMove);
      grid.removeEventListener("pointerleave", resetScales);
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("scroll", onLayoutChange);
      resizeObserver.disconnect();
    };
  }, []);

  const renderLogo = (logo: Logo, index: number) => {
    return (
      <div
        key={logo.src}
        className={`group relative min-h-[120px] min-w-0 border-r border-b border-white/15 px-5 py-6 sm:min-h-[150px] sm:px-7 sm:py-8 md:min-h-[190px] md:px-9 md:py-10 ${
          logo.blend ? "mix-blend-plus-lighter" : ""
        }`}
      >
        <div
          ref={(element) => {
            logoEls.current[index] = element;
          }}
          className="relative h-full w-full origin-center transform-gpu transition-transform duration-150 will-change-transform"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            fill
            sizes="(max-width: 767px) 50vw, 20vw"
            className="object-contain grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full min-h-[900px] md:min-h-screen bg-transparent backdrop-blur-md overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0" />

      {/* Header block — generous top spacing so navbar clears */}
      <div className="relative z-10 pt-[110px] md:pt-[140px] px-5 md:px-[8%]">
        <p className="font-montserrat text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/50 mb-5">
          Trusted by / 15+ brands
        </p>
        <p
          ref={titleRef}
          className="text-[26px] sm:text-[30px] md:text-[38px] xl:text-[44px] font-garamond text-white tracking-[-0.7px] md:tracking-[-0.8px]"
        >
        {/* TextType components unchanged */}
        <TextType
          text={startTitleAnimation ? "Because " : ""}
          as="span"
          typingSpeed={titleTypingSpeed}
          pauseDuration={1500}
          deletingSpeed={50}
          loop={false}
          startOnVisible={false}
          showCursor={false}
          reverseMode={false}
          className="leading-[0.9]"
        />
        <TextType
          text={startTitleAnimation ? '"good enough" ' : ""}
          as="span"
          typingSpeed={titleTypingSpeed}
          pauseDuration={1500}
          deletingSpeed={50}
          loop={false}
          startOnVisible={false}
          showCursor={false}
          reverseMode={false}
          initialDelay={150}
          className="font-bold italic uppercase leading-[0.9]"
        />
        <TextType
          text={startTitleAnimation ? "was never the plan." : ""}
          as="span"
          typingSpeed={titleTypingSpeed}
          pauseDuration={1500}
          deletingSpeed={50}
          loop={false}
          startOnVisible={false}
          showCursor
          cursorCharacter="_"
          cursorBlinkDuration={0.5}
          reverseMode={false}
          initialDelay={438}
          className="leading-[0.9]"
        />
        </p>

        {/* Description */}
        <div className="mt-6 text-[15px] sm:text-[16px] md:text-[18px] xl:text-[20px] font-light text-white leading-[1.45] max-w-[340px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[600px]">
        {showDescription ? (
          <BlurText
            text="Brands that trusted Kurojin.studio to shape how the world sees them. From startups to established names, we build with those who value craft."
            delay={40}
            animateBy="words"
            direction="top"
            className="opacity-65"
          />
          ) : null}
        </div>
      </div>

      {/* Decorative */}
      <div className="hidden md:block absolute top-[16%] right-[6%] w-[68px] h-[220px] -rotate-90 origin-center mix-blend-color-dodge opacity-90 z-10">
        <Image
          src="/images/decor-clients.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Static 5 x 3 logo grid with cursor proximity scaling */}
      <div
        ref={gridRef}
        className="relative z-10 mt-12 grid grid-cols-2 border-t border-white/15 sm:grid-cols-3 md:mt-16 md:grid-cols-5"
      >
        {allLogos.map(renderLogo)}
      </div>
    </section>
  );
}