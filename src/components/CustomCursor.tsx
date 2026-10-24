"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — dot + lagging ring (mix-blend-difference).
 * Elements can declare data-cursor="VIEW" / "DRAG" etc. to morph the
 * ring into a labeled pill. Touch devices are skipped entirely.
 */
export default function CustomCursor() {
  const [label, setLabel] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(-100, { stiffness: 350, damping: 28 });
  const ringY = useSpring(-100, { stiffness: 350, damping: 28 });
  const frameRef = useRef<number | null>(null);
  const pendingPositionRef = useRef({ x: -100, y: -100 });
  const lastModeRef = useRef({ label: null as string | null, hovering: false, disabled: false });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;
    setEnabled(true);
    document.body.classList.add("custom-cursor-on");

    const updateMode = (target: Element | null) => {
      const disabled = !!target?.closest('[data-custom-cursor="off"]');

      if (disabled) {
        if (!lastModeRef.current.disabled) {
          lastModeRef.current = { label: null, hovering: false, disabled: true };
          setIsVisible(false);
          setLabel(null);
          setIsHovering(false);
        }
        return;
      }

      const labeled = target?.closest("[data-cursor]") as HTMLElement | null;
      const nextLabel = labeled?.dataset.cursor || null;
      const nextHovering = !nextLabel && !!target?.closest("a, button, [data-cursor-hover]");

      if (
        lastModeRef.current.disabled ||
        lastModeRef.current.label !== nextLabel ||
        lastModeRef.current.hovering !== nextHovering
      ) {
        lastModeRef.current = { label: nextLabel, hovering: nextHovering, disabled: false };
        setLabel(nextLabel);
        setIsHovering(nextHovering);
      }
    };

    const applyPointerFrame = () => {
      frameRef.current = null;
      const { x, y } = pendingPositionRef.current;
      dotX.set(x);
      dotY.set(y);
      ringX.set(x);
      ringY.set(y);
    };

    const moveCursor = (e: MouseEvent) => {
      pendingPositionRef.current.x = e.clientX;
      pendingPositionRef.current.y = e.clientY;

      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(applyPointerFrame);
      }

      updateMode(e.target as Element | null);
    };

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
      document.body.classList.remove("custom-cursor-on");
    };
  }, [dotX, dotY, ringX, ringY]);

  if (!enabled) return null;

  const ringSize = label ? 88 : isHovering ? 64 : 40;

  return (
    <>
      {/* Inner dot — hidden while a label or hover state is active */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference rounded-full bg-white"
        style={{
          x: dotX,
          y: dotY,
          width: 8,
          height: 8,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible && !isHovering && !label ? 1 : 0,
        }}
      />

      {/* Outer ring / labeled pill */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center ${
          label
            ? "bg-[#fffaee] text-[#010101]"
            : "mix-blend-difference border-2 border-white"
        }`}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
          width: ringSize,
          height: ringSize,
          backgroundColor: label
            ? "rgba(255,250,238,0.95)"
            : isHovering
            ? "rgba(255,255,255,0.15)"
            : "transparent",
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 22 },
          height: { type: "spring", stiffness: 300, damping: 22 },
          backgroundColor: { duration: 0.2 },
        }}
      >
        {label && (
          <span className="font-montserrat text-[10px] font-bold tracking-[0.2em] uppercase select-none">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}
