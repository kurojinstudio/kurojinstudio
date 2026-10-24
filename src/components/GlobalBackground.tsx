"use client";

import Image from "next/image";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <Image
        src="/images/globally.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        quality={75}
      />
      {/* subtle vignette so foreground text pops */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />
    </div>
  );
}
