"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const storyBodyText =
  "Every brand begins with a story. We shape that story into a powerful Brand Identity, bring it to life through mindful Design, craft visuals with Product Shoots & immersive 3D Content, build your presence with high-impact Web Experiences, and finally set the momentum through strategic Social Media.";

const bottomHeadlineLead = "We Care How ";
const bottomHeadlineTail = "The World Sees It";

/* number of characters in the lead headline — index offset for the tail */
const leadCharCount = bottomHeadlineLead.trim().split(/\s+/).join("").length;

export default function Story() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const topHeadlineRef = useRef<HTMLParagraphElement | null>(null);
  const bodyTextRef = useRef<HTMLParagraphElement | null>(null);
  const bodyCharRefs = useRef<HTMLSpanElement[]>([]);
  const bottomHeadlineRef = useRef<HTMLParagraphElement | null>(null);
  const bottomCharRefs = useRef<HTMLSpanElement[]>([]);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    /* Reduced motion: skip the pin + scrub entirely, render final state. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(bodyCharRefs.current, { opacity: 1 });
      gsap.set(bottomCharRefs.current, { opacity: 1, y: 0, filter: "none" });
      gsap.set(lineRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(topHeadlineRef.current, { opacity: 0, y: 70, filter: "blur(8px)" });
      gsap.set(bodyTextRef.current, { opacity: 0, y: 45, filter: "blur(10px)" });
      gsap.set(bodyCharRefs.current, { opacity: 0 });
      gsap.set(bottomHeadlineRef.current, { opacity: 1 });
      gsap.set(bottomCharRefs.current, { opacity: 0, y: -65, filter: "blur(8px)" });
      gsap.set(lineRef.current, { opacity: 0.15 });

      const computeEnd = () => {
        const el = sectionRef.current;
        if (!el) return "+=100%";
        return `+=${el.offsetHeight + window.innerHeight}`;
      };

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: computeEnd,
          scrub: 0.55,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      if (topHeadlineRef.current) {
        timeline.fromTo(
          topHeadlineRef.current,
          { opacity: 0, y: 70, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.28 },
          0.2
        );
      }

      if (bodyTextRef.current) {
        timeline.fromTo(
          bodyTextRef.current,
          { opacity: 0, y: 45, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2 },
          ">"
        );
      }

      if (bodyCharRefs.current.length > 0) {
        timeline.fromTo(
          bodyCharRefs.current,
          { opacity: 0 },
          { opacity: 1, stagger: 0.008, duration: 0.18 },
          ">"
        );
      }

      if (bottomCharRefs.current.length > 0) {
        timeline.to(
          bottomCharRefs.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.3,
            stagger: 0.022,
            ease: "power2.out",
          },
          ">"
        );
      }

      if (lineRef.current) {
        timeline.fromTo(
          lineRef.current,
          { opacity: 0.15 },
          { opacity: 1, duration: 0.4 },
          1.2
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /**
   * Headline is built word-by-word: each word is an inline-block of char
   * spans (so the per-char drop-in animation still works), with REAL space
   * text nodes between words so the line can wrap on narrow screens.
   * Char indices are computed from word offsets (no ref mutation in render).
   */
  const renderHeadlineWords = (
    text: string,
    italic: boolean,
    keyPrefix: string,
    startOffset: number
  ) => {
    let wordStart = startOffset;
    return text
      .trim()
      .split(" ")
      .map((word, wi) => {
        const thisStart = wordStart;
        wordStart += word.length;
        return (
          <Fragment key={`${keyPrefix}-${wi}`}>
            <span
              className={`inline-block whitespace-nowrap ${
                italic ? "font-garamond font-light italic" : "font-garamond font-light"
              }`}
            >
              {word.split("").map((character, ci) => (
                <span
                  key={`${character}-${ci}`}
                  ref={(element) => {
                    if (element) bottomCharRefs.current[thisStart + ci] = element;
                  }}
                  className="inline-block will-change-transform"
                >
                  {character}
                </span>
              ))}
            </span>{" "}
          </Fragment>
        );
      });
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-[780px] h-[100svh] md:h-screen md:min-h-[620px] bg-bg overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#080808]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(0,0,0) 0%, rgba(0,0,0,0) 25.8%), linear-gradient(0deg, rgb(0,0,0) 0%, rgba(0,0,0,0) 20.1%), linear-gradient(90deg, rgba(0,0,0,0.06) 8.3%, rgb(1,1,1) 33.5%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-full flex-col items-center justify-start px-5 pt-[150px] text-center md:absolute md:inset-0 md:justify-center md:px-[8%] md:pt-0 lg:gap-y-15">
        {/* Mono label */}
        <p className="font-montserrat text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/50">
          The story / 物語
        </p>

        {/* Top Headline */}
        <p
          ref={topHeadlineRef}
          className="text-off-white text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-garamond tracking-[-0.6px] md:tracking-[-0.8px] leading-[1.15] px-2"
          style={{
            textShadow: "0px 0px 40.9px rgba(255,236,185,0.6)",
          }}
        >
          <span className="font-normal">Your focus is on what </span>
          <span className="font-bold italic uppercase">you build.</span>
        </p>

        {/* Body Text */}
        <p
          ref={bodyTextRef}
          className="text-white text-[14px] sm:text-[15px] md:text-[16px] font-light leading-[1.45] max-w-[680px] px-2"
          style={{
            textShadow: "0px 0px 33px rgba(255,255,255,0.3)",
          }}
        >
          {storyBodyText.split("").map((character, index) => (
            <span
              key={`${character}-${index}`}
              ref={(element) => {
                if (element) bodyCharRefs.current[index] = element;
              }}
              className="inline-block opacity-[0] will-change-transform"
            >
              {character === " " ? "\u00A0" : character}
            </span>
          ))}
        </p>

        {/* Bottom Headline — anchored low, wraps gracefully on mobile */}
        <p
          ref={bottomHeadlineRef}
          className="mt-auto mb-[12%] w-[92%] text-white uppercase text-center leading-[0.95] md:absolute md:bottom-[12%] md:left-1/2 md:mb-0 md:w-[86%] md:-translate-x-1/2"
          style={{
            fontSize: "clamp(34px, 7.5vw, 92px)",
            letterSpacing: "-0.02em",
            textShadow:
              "0px 0px 45.2px rgba(255,236,185,0.28), 0px 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          {renderHeadlineWords(bottomHeadlineLead, false, "lead", 0)}
          {renderHeadlineWords(bottomHeadlineTail, true, "tail", leadCharCount)}
        </p>
      </div>

      {/* Bottom line divider */}
      <div ref={lineRef} className="absolute bottom-[-2px] left-6 md:left-[8%] right-6 md:right-[8%] h-[2px] z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/line-divider.svg"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}