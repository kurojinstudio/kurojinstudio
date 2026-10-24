"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cinematic video preloader — plays the Kurojin intro fullscreen as a
 * fixed overlay, then wipes out to hand over the page.
 *
 * Screen fitting:
 * - Landscape / desktop: wide source, object-cover fills the viewport.
 * - Portrait phones: compact 720px source (~178KB) + object-contain so
 *   the full frame is always visible; letterbox bars are invisible on
 *   the black page background.
 *
 * Never traps the user: muted+playsInline autoplay guarantees, autoplay-
 * block fallback, load-error fallback and a hard time cap.
 */

type MinimalLenis = { stop?: () => void; start?: () => void };

/** Fired once the intro is finished/skipped so entrance animations can start. */
export const INTRO_DONE_EVENT = "kurojin:intro-done";

function getLenis(): MinimalLenis | undefined {
  return (window as unknown as Record<string, unknown>).__lenis as
    | MinimalLenis
    | undefined;
}

const HARD_CAP_MS = 20000;
const EXIT_MS = 900;

export default function IntroLoader() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  const lockScroll = useCallback(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    // SmoothScrollProvider (parent) mounts its effect after this child
    // effect, so __lenis isn't ready yet on first paint — retry briefly.
    let tries = 0;
    const t = window.setInterval(() => {
      const lenis = getLenis();
      if (lenis?.stop) {
        lenis.stop();
        window.clearInterval(t);
      } else if (++tries > 20) {
        window.clearInterval(t);
      }
    }, 100);
    return () => window.clearInterval(t);
  }, []);

  const unlockScroll = useCallback(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    getLenis()?.start?.();
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    unlockScroll();
    (window as unknown as Record<string, unknown>).__kurojinIntroDone = true;
    window.dispatchEvent(new CustomEvent(INTRO_DONE_EVENT));
    setLeaving(true);
    window.setTimeout(() => setHidden(true), EXIT_MS);
  }, [unlockScroll]);

  useEffect(() => {
    const cancelPoll = lockScroll();
    const cap = window.setTimeout(finish, HARD_CAP_MS);

    const v = videoRef.current;
    const play = v?.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => finish());
    }

    return () => {
      cancelPoll();
      window.clearTimeout(cap);
    };
  }, [lockScroll, finish]);

  useEffect(() => () => unlockScroll(), [unlockScroll]);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] bg-black transition-all duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        leaving ? "pointer-events-none scale-[1.05] opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onEnded={finish}
        onError={finish}
        className="absolute inset-0 h-full w-full object-cover object-center portrait:object-contain"
      >
        <source src="/videos/kjintro-mobile.mp4" media="(max-width: 768px)" />
        <source src="/videos/kjintro.mp4" media="(min-width: 769px)" />
      </video>
    </div>
  );
}
