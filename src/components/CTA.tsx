"use client";

import Link from "next/link";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { FlipWords } from "@/components/ui/flip-words";

const words = [
  " extraordinary?",
  " unique?",
  " beautiful!",
  " exquisite?",
  " exceptional?",
  " remarkable?",
  " stunning?",
  " amazing?",
];

export default function CTA() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 md:py-24">
      {/* Background Effects */}
      <BackgroundRippleEffect />

      <div className="absolute inset-0 bg-[radial-gradient(at_center,#ffffff08_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Main Headline */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-white leading-[1.05] mb-6">
          Ready to create
          <br />
          something
          <PointerHighlight
            rectangleClassName="border-white-100 rounded-lg bg-orange-500/10 leading-loose"
            pointerClassName="text-green-500 h-3 w-3"
            containerClassName="inline-block ml-1"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-white">
              <FlipWords words={words} /> <br />
            </span>
          </PointerHighlight>
        </h2>

        <p className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-neutral-400 mb-12 px-4">
          Let&apos;s turn your vision into a digital experience that stands out.
          Whether it&apos;s a brand, product, or campaign — we bring ideas to
          life.
        </p>

        {/* CTA Button — now a real link */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="border border-white/25 bg-transparent text-white rounded-[55px] h-[58px] md:h-[66px] px-10 md:px-14 w-[260px] md:w-[300px] font-montserrat font-extrabold italic text-[19px] md:text-[23px] uppercase overflow-hidden relative group cursor-pointer transition-all active:scale-[0.97] hover:border-[#ff5c1a]/70 hover:text-white hover:shadow-[0_0_40px_rgba(255,92,26,0.25)] inline-flex items-center justify-center"
          >
            <span className="block transition-transform duration-300 group-hover:-translate-y-full leading-tight">
              LET&apos;S TALK
            </span>
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 leading-tight">
              LET&apos;S GO
            </span>
          </Link>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
