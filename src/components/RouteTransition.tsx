"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Route transition — the "page transition hack" pattern:
 * intercept internal link clicks, cover the screen with staggered strips,
 * navigate while covered, then reveal the new page from the top.
 * Mounted once in the root layout so the overlay survives route changes.
 */
export default function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const busyRef = useRef(false);
  const firstRef = useRef(true);
  const coveredRef = useRef(false);

  // ── Click interception: cover, then navigate ──
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (busyRef.current) return;
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;

      // compare pathname part only (ignore hash/query)
      const targetPath = href.split("#")[0].split("?")[0] || "/";
      if (targetPath === pathname) return; // same page — allow default (hash scroll etc.)

      e.preventDefault();
      busyRef.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          coveredRef.current = true;
          router.push(href);
        },
      });
      tl.fromTo(
        "[data-rt-strip]",
        { scaleY: 0, transformOrigin: "bottom center" },
        {
          scaleY: 1,
          duration: 0.5,
          stagger: 0.055,
          ease: "power4.in",
        }
      );
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  // ── Reveal after the new page mounted ──
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }

    window.scrollTo(0, 0);

    if (!coveredRef.current) {
      // browser back/forward or programmatic nav — no cover to reveal.
      // Force strips closed so they can never sit over the page eating clicks.
      gsap.set("[data-rt-strip]", { scaleY: 0 });
      busyRef.current = false;
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }
    coveredRef.current = false;

    const tl = gsap.timeline({
      onComplete: () => {
        busyRef.current = false;
        ScrollTrigger.refresh();
      },
    });
    tl.set("[data-rt-strip]", { transformOrigin: "top center" });
    tl.to("[data-rt-strip]", {
      scaleY: 0,
      duration: 0.55,
      stagger: 0.055,
      ease: "power4.out",
    });
  }, [pathname]);

  return (
    <>
      {children}
      {/* wipe strips — pointer-events-none on EACH strip so a stuck strip
          can never eat clicks on the page underneath */}
      <div className="fixed inset-0 z-[96] flex pointer-events-none" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            data-rt-strip
            className="flex-1 h-full bg-[#050505] pointer-events-none"
            style={{ transform: "scaleY(0)" }}
          >
            <div className="w-full h-[3px] bg-gradient-to-r from-[#ff3c00] to-[#ff8c2b] opacity-80" />
          </div>
        ))}
      </div>
    </>
  );
}
