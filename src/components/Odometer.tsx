"use client";

import React, { useEffect, useRef, useState } from "react";

interface OdometerProps {
  value: number;
  maxValue?: number;
  digitHeight?: number; // px, default 64
  fontSize?: number;    // px, default 48
}

interface RollingNumberProps {
  digit: number;
  direction: number;
  digitHeight: number;
  fontSize: number;
}

const DURATION = 900; // ms
// Two full cycles 0-9 so we can always animate in either direction
const NUMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function RollingNumber({ digit, direction, digitHeight, fontSize }: RollingNumberProps) {
  // posRef tracks the live translateY in px — never stale inside rAF
  const posRef = useRef(0);
  const settledDigitRef = useRef(0); // the digit value currently resting in first-half
  const rafRef = useRef<number | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const applyPos = (y: number) => {
    if (innerRef.current) {
      innerRef.current.style.transform = `translateY(${y}px)`;
    }
  };

  useEffect(() => {
    // Cancel any in-flight animation
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    // Destination is always in the SECOND half of NUMS (index digit+10)
    // so the strip always has room in the first half for reverse rolls.
    const destIndex = digit + 10;
    const destY = -destIndex * digitHeight;
    const startY = posRef.current;
    const totalDist = destY - startY;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      const y = startY + totalDist * easeInOutCubic(t);
      posRef.current = y;
      applyPos(y);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Settled — snap silently to first-half equivalent (no visible jump)
        // so the next animation has full travel room in both directions.
        rafRef.current = requestAnimationFrame(() => {
          const firstHalfY = -digit * digitHeight;
          posRef.current = firstHalfY;
          settledDigitRef.current = digit;
          applyPos(firstHalfY);
        });
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digit, direction]);

  return (
    <div
      style={{
        overflow: "hidden",
        height: digitHeight,
        width: fontSize * 0.65,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div ref={innerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
        {NUMS.map((n, i) => (
          <span
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: digitHeight,
              fontSize,
              fontWeight: 300,
              fontFamily: "monospace",
              lineHeight: 1,
            }}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Odometer({
  value = 0,
  maxValue = 999999,
  digitHeight = 64,
  fontSize = 48,
}: OdometerProps) {
  const prevValueRef = useRef(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(Math.floor(value), maxValue));
    prevValueRef.current = displayValue;
    setDisplayValue(clamped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, maxValue]);

  // Pad to the number of digits needed to display maxValue
  const numDigits = String(maxValue).length;
  const direction = displayValue >= prevValueRef.current ? 1 : -1;
  const digits = String(displayValue).padStart(numDigits, "0").split("").map(Number);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {digits.map((d, i) => (
        <RollingNumber
          key={i}
          digit={d}
          direction={direction}
          digitHeight={digitHeight}
          fontSize={fontSize}
        />
      ))}
    </div>
  );
}