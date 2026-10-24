"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Budget() {
  return (
    <section className="relative w-full min-h-[700px] h-[100svh] md:h-screen md:min-h-[620px] bg-bg overflow-hidden">
      {/* Ember glow — single warm radial, matches brand fire accents */}
      <div className="absolute top-1/2 left-[8%] right-[8%] -translate-y-1/2 h-[74vh] max-h-[802px] rounded-lg overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            background:
              "radial-gradient(ellipse at 65% 85%, rgba(255,92,26,1) 0%, rgba(90,22,4,1) 45%, rgba(0,0,0,1) 100%)",
          }}
        />
      </div>

      {/* Center orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62vw] max-w-[720px] aspect-square rounded-full mix-blend-screen overflow-hidden md:w-[37.5vw]">
        <div className="w-full h-full bg-gradient-to-br from-white/5 via-white/2 to-transparent rounded-full" />
      </div>

      {/* Text content */}
      <motion.div
        className="absolute top-[34%] left-1/2 -translate-x-1/2 text-center max-w-[768px] w-[90%] z-10 md:top-[40%] md:w-[80%]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <p className="font-garamond text-[36px] lg:text-[42px] xl:text-[48px] text-near-white uppercase leading-[1.08]">
          <span className="font-normal">Budget Never</span>
          <span className="font-bold italic"> Limits Quality</span>
        </p>
        <p className="mt-8 text-light-gray text-[15px] font-light leading-[1.4] max-w-[655px] mx-auto">
          Budgets change. Standards don&apos;t. When numbers shift, we refine the
          output, not the excellence. You get less volume, never less value.
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        className="absolute top-[70%] left-1/2 -translate-x-1/2 z-10 md:top-[72%]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <Link
          href="/contact"
          className="bg-white text-bg rounded-[55px] h-[44px] px-8 inline-flex items-center justify-center font-montserrat font-extrabold italic text-[16px] uppercase overflow-hidden relative group cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ff8c2b] hover:to-[#ff3c00] hover:text-black hover:shadow-[0_0_30px_rgba(255,92,26,0.5)] active:scale-95"
        >
          <span className="block transition-transform duration-300 group-hover:-translate-y-full leading-[1.4]">
            LET&apos;S TALK
          </span>
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 leading-[1.4]">
            LET&apos;S GO
          </span>
        </Link>
      </motion.div>

      {/* Bottom line divider */}
      <div className="absolute bottom-0 left-[8%] right-[8%] h-[2px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/line-divider.svg" alt="" className="h-full w-full object-cover" />
      </div>
    </section>
  );
}
