"use client";

import { useEffect, useState } from "react";

/** Thin scroll progress line under the navbar — orange gradient. */
export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[85] pointer-events-none">
      <div
        className="h-full origin-left bg-gradient-to-r from-[#ff3c00] to-[#ff8c2b]"
        style={{ transform: `scaleX(${p})` }}
      />
    </div>
  );
}
