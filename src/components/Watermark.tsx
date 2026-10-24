"use client";

import { useEffect, useState } from "react";

export default function Watermark() {
  const [hideForFooter, setHideForFooter] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideForFooter(entry.isIntersecting);
      },
      {
        threshold: 0.05,
      },
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  return (
    <p
      className={`fixed bottom-[3.5%] left-[6%] hidden md:block font-garamond font-bold text-[18px] xl:text-[20px] text-white/90 tracking-[-0.4px] mix-blend-difference z-50 pointer-events-none drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-opacity duration-300 ${
        hideForFooter ? "opacity-0" : "opacity-100"
      }`}
    >
      kurojin.studio
    </p>
  );
}
