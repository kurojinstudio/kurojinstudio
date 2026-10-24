"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GlassSurface from "./GlassSurface";
import { siteConfig } from "@/lib/site-config";

const navLinks = siteConfig.nav;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled(y > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // close menu on route change (adjust-state-during-render pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  return (
    <>
      {/* ── Mobile navbar (< md) ── */}
      <nav
        className="fixed left-1/2 -translate-x-1/2 z-50 md:hidden transition-all duration-300 ease-out"
        style={{
          top: scrolled ? 12 : 18,
          width: scrolled ? "92%" : "94%",
          maxWidth: 480,
          height: scrolled ? 54 : 60,
        }}
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={32}
          displace={0.5}
          distortionScale={-160}
          redOffset={0}
          greenOffset={8}
          blueOffset={16}
          brightness={50}
          opacity={0.93}
          mixBlendMode="screen"
          className="relative flex items-center justify-center w-full h-full"
        >
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 z-10 font-garamond font-bold italic text-white uppercase text-[16px] tracking-[-0.45px] drop-shadow-[0_0_14px_rgba(255,255,255,0.18)]"
          >
            KUROJIN.
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute right-4 z-10 w-9 h-9 rounded-full border border-white/20 bg-white/5 flex flex-col items-center justify-center gap-[5px] cursor-pointer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-[18px] h-[1.5px] bg-white transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`block w-[18px] h-[1.5px] bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`block w-[18px] h-[1.5px] bg-white transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
        </GlassSurface>
      </nav>

      {/* ── Mobile fullscreen overlay menu ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center px-6 transition-opacity duration-400 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(53,168,255,0.18), transparent 38%), radial-gradient(circle at 82% 22%, rgba(255,92,92,0.18), transparent 36%), rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuOpen(false);
        }}
      >
        <div
          className="w-full max-w-[340px] flex flex-col items-center px-6 py-10 gap-7 rounded-[28px] border border-white/14 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
          }}
        >
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-garamond text-[28px] leading-none tracking-[-0.6px] uppercase transition-all duration-300 ${
                pathname === link.href
                  ? "text-white italic font-bold"
                  : "text-white"
              }`}
              style={{
                transitionDelay: menuOpen ? `${index * 50}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(8px)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-1 bg-white text-black rounded-[55px] h-[42px] px-9 inline-flex items-center justify-center font-montserrat font-extrabold italic text-[14px] uppercase shadow-[0_8px_30px_rgba(255,255,255,0.18)] active:scale-95 transition-transform"
          >
            LET&apos;S TALK
          </Link>
        </div>
      </div>

      {/* ── Desktop navbar (>= md) ── */}
      <nav
        className="fixed left-1/2 -translate-x-1/2 z-50 hidden md:block transition-all duration-150 ease-linear"
        style={{
          top: scrolled ? 30 : 62,
          width: scrolled ? 780 : 1140,
          maxWidth: scrolled ? "90vw" : "92vw",
          height: scrolled ? 50 : 66,
        }}
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={45}
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          brightness={50}
          opacity={0.93}
          mixBlendMode="screen"
          className="flex items-center justify-between w-full h-full"
        >
          <div
            className="flex items-center justify-between w-full h-full"
            style={{
              paddingLeft: scrolled ? "24px" : "32px",
              paddingRight: scrolled ? "24px" : "32px",
              transition: "padding 0.15s linear",
            }}
          >
            <Link
              href="/"
              className={`relative z-10 font-garamond font-bold italic text-white uppercase tracking-[-0.4px] transition-all duration-150 whitespace-nowrap shrink-0 ${
                scrolled ? "text-[16px]" : "text-[20px]"
              }`}
            >
              KUROJIN.
            </Link>

            <div
              className={`flex items-center justify-center flex-1 transition-all duration-150 ${
                scrolled ? "gap-6" : "gap-16"
              }`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`font-garamond text-white tracking-[-0.32px] hover:opacity-80 transition-all duration-150 whitespace-nowrap relative group ${
                    scrolled ? "text-[14px]" : "text-[16px]"
                  } ${pathname === link.href ? "italic font-bold" : ""}`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-white/80 transition-all duration-300 ${
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              className={`relative z-10 bg-white text-black rounded-[55px] font-montserrat font-extrabold italic uppercase overflow-hidden group cursor-pointer shrink-0 inline-flex items-center justify-center transition-all duration-150 hover:bg-gradient-to-r hover:from-[#ff8c2b] hover:to-[#ff3c00] hover:text-black hover:shadow-[0_0_30px_rgba(255,92,26,0.6),0_0_60px_rgba(255,60,0,0.35)] ${
                scrolled
                  ? "h-[28px] px-9 text-[12px] tracking-[0.5px]"
                  : "h-[32px] px-10 text-[14px] tracking-[0.8px] "
              }`}
            >
              <span className="flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                LET&apos;S TALK
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                LET&apos;S GO
              </span>
            </Link>
          </div>
        </GlassSurface>
      </nav>
    </>
  );
}
