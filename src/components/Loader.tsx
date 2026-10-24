'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

interface LoaderProps {
  onLoadComplete: () => void;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ onLoadComplete, text = 'STUDIOSIZE' }) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const ghostRef = useRef<HTMLHeadingElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const tagRef = useRef<HTMLSpanElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ghostLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  const letters = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!titleRef.current || !loaderRef.current || !curtainRef.current) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const liveLetters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const ghosts = ghostLetterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const caret = caretRef.current;
    const counter = counterRef.current;
    const tag = tagRef.current;

    if (reduceMotion) {
      const tl = gsap.timeline({ onComplete: () => onLoadComplete() });
      tl.set(liveLetters, { opacity: 1 })
        .set(ghosts, { opacity: 0 })
        .to(loaderRef.current, { opacity: 0, duration: 0.4, delay: 0.4 });
      return () => {
        tl.kill();
      };
    }

    if (!CustomEase.get('punchIn')) {
      CustomEase.create('punchIn', 'M0,0 C0.3,0 0.2,1 1,1');
    }

    gsap.set(liveLetters, { opacity: 0, y: 10 });
    gsap.set(ghosts, { opacity: 0 });
    gsap.set(caret, { opacity: 1 });
    gsap.set(counter, { opacity: 0 });
    gsap.set(tag, { opacity: 0, y: 6 });
    gsap.set(curtainRef.current, { scaleY: 0 });
    gsap.set(wordRef.current, { scale: 1 });

    const tl = gsap.timeline({ onComplete: () => onLoadComplete() });

    // 1 — caret blinks alone first, exactly like the lone-cursor reference frame
    tl.to(caret, {
      opacity: 0,
      duration: 0.16,
      repeat: 3,
      yoyo: true,
      ease: 'power1.inOut',
    });

    // small "loading" eyebrow tag fades in alongside the counter starting up
    tl.to(tag, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.1');
    tl.to(counter, { opacity: 1, duration: 0.2 }, '<');

    // counter ticks 0 → 100, finishing right as the zoom lands later
    if (counter) {
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 1.6,
          ease: 'power1.inOut',
          onUpdate: function () {
            counter.textContent = String(Math.round(this.targets()[0].val)).padStart(3, '0');
          },
        },
        '<'
      );
    }

    // 2 — letters type on, caret riding just ahead
    tl.to(liveLetters, {
      opacity: 1,
      y: 0,
      duration: 0.06,
      stagger: 0.06,
      ease: 'none',
    });

    // brief settled blink once the full word is up
    tl.to(caret, { opacity: 0, duration: 0.14, repeat: 3, yoyo: true, ease: 'power1.inOut' }, '+=0.1');
    tl.set(caret, { opacity: 0 });

    // 3 — wobble: the whole wordmark rocks side to side, decaying back to center
    tl.to(wordRef.current, { x: -16, rotate: -2, duration: 0.12, ease: 'power1.inOut' });
    tl.to(wordRef.current, { x: 14, rotate: 1.6, duration: 0.12, ease: 'power1.inOut' });
    tl.to(wordRef.current, { x: -8, rotate: -0.9, duration: 0.1, ease: 'power1.inOut' });
    tl.to(wordRef.current, { x: 4, rotate: 0.4, duration: 0.09, ease: 'power1.inOut' });
    tl.to(wordRef.current, { x: 0, rotate: 0, duration: 0.14, ease: 'power2.out' });

    // 4 — zoom punch, with a duplicate ghost layer trailing behind it,
    // echoing the layered D / I ghosting in your third reference image
    tl.set(ghosts, { opacity: 0.35 });
    tl.to(wordRef.current, {
      scale: 1.4,
      duration: 0.5,
      ease: 'punchIn',
    });
    tl.to(
      ghostRef.current,
      {
        scale: 1.55,
        x: -18,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.out',
      },
      '<'
    );

    // 5 — letters fade out one by one with a touch of blur, left to right
    tl.to(
      liveLetters,
      {
        opacity: 0,
        filter: 'blur(6px)',
        y: -6,
        duration: 0.32,
        stagger: { each: 0.045, from: 'start' },
        ease: 'power1.in',
      },
      '-=0.15'
    );
    tl.to(tag, { opacity: 0, duration: 0.2 }, '<');
    tl.to(counter, { opacity: 0, duration: 0.2 }, '<');

    // 6 — curtain wipes up to reveal the page, instead of a flat cross-fade
    tl.to(
      curtainRef.current,
      {
        scaleY: 1,
        duration: 0.5,
        ease: 'power3.inOut',
        transformOrigin: 'bottom',
      },
      '-=0.1'
    );
    tl.to(curtainRef.current, {
      scaleY: 0,
      duration: 0.6,
      ease: 'power3.inOut',
      transformOrigin: 'top',
      delay: 0.05,
    });
    tl.to(
      loaderRef.current,
      { opacity: 0, duration: 0.01 },
      '-=0.01'
    );

    return () => {
      tl.kill();
    };
  }, [mounted, onLoadComplete, letters]);

  const renderLetters = (refArray: React.MutableRefObject<(HTMLSpanElement | null)[]>) => {
    refArray.current = [];
    return letters.map((char, index) => (
      <span
        key={index}
        ref={(el) => {
          refArray.current[index] = el;
        }}
        className="inline-block will-change-transform"
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div
      ref={loaderRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden px-6"
    >
      <span className="sr-only">Loading {text}</span>

      {/* subtle grain so the white field doesn't feel like a flat div */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      {/* eyebrow tag */}
      <span
        ref={tagRef}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-black/50"
        aria-hidden="true"
      >
        Loading experience
      </span>

      {/* ticking counter */}
      <span
        ref={counterRef}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 font-mono text-xs sm:text-sm tabular-nums text-black/50"
        aria-hidden="true"
      >
        000
      </span>

      <div ref={wordRef} className="relative" style={{ willChange: 'transform' }}>
        {/* ghost duplicate, sits behind, used only during the zoom punch */}
        <h1
          ref={ghostRef}
          aria-hidden="true"
          className="absolute inset-0 text-black font-bold tracking-tight leading-none text-[14vw] sm:text-[10vw] lg:text-[7vw] whitespace-nowrap"
        >
          {renderLetters(ghostLetterRefs)}
        </h1>

        <h1
          ref={titleRef}
          aria-hidden="true"
          className="relative text-black font-bold tracking-tight leading-none text-[14vw] sm:text-[10vw] lg:text-[7vw] whitespace-nowrap"
        >
          {renderLetters(letterRefs)}
          <span
            ref={caretRef}
            className="inline-block w-[0.06em] ml-1 bg-black align-middle"
            style={{ height: '0.85em' }}
          />
        </h1>
      </div>

      {/* curtain wipe used for the exit transition instead of a flat fade */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-black"
        style={{ transformOrigin: 'bottom' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default Loader;