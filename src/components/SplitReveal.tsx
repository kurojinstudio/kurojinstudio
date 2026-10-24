"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Line-mask reveal — splits children into lines, wraps each in an
 * overflow-hidden mask, and slides them up on scroll (CodeGrid / Awwwards
 * staple). Falls back gracefully if splitting fails.
 */
export default function SplitReveal({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: { lines?: HTMLElement[]; revert: () => void } | null = null;
    let tween: gsap.core.Tween | null = null;

    // dynamic import keeps split-type out of the SSR bundle
    import("split-type").then(({ default: SplitType }) => {
      if (!ref.current) return;
      split = new SplitType(el, { types: "lines", lineClass: "sr-line" }) as unknown as {
        lines?: HTMLElement[];
        revert: () => void;
      };

      const lines = split?.lines ?? [];
      lines.forEach((line) => {
        const mask = document.createElement("div");
        mask.className = "sr-mask";
        line.parentNode?.insertBefore(mask, line);
        mask.appendChild(line);
      });

      tween = gsap.from(lines, {
        yPercent: 115,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.09,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once,
        },
      });
    });

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, [delay, once]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
