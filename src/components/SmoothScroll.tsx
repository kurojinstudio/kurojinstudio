"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;

    let locomotive: any = null;
    let refreshHandler: (() => void) | null = null;

    const setup = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      locomotive = new LocomotiveScroll({
        lenisOptions: {
          duration: 1.0, // slightly longer for smoothness
          lerp: 0.15,    // more interpolation for uniformity
          smoothWheel: true,
          syncTouch: true,
          wheelMultiplier: 1.0, // standardize wheel speed
          touchMultiplier: 1.0, // standardize touch speed
        },
        scrollCallback: () => {
          ScrollTrigger.update();
        },
      });

      refreshHandler = () => locomotive?.resize();
      ScrollTrigger.addEventListener("refresh", refreshHandler);
      ScrollTrigger.refresh();
    };

    setup();

    return () => {
      if (refreshHandler) {
        ScrollTrigger.removeEventListener("refresh", refreshHandler);
      }
      ScrollTrigger.clearScrollMemory();
      locomotive?.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} data-scroll-container>
      {children}
    </div>
  );
}
