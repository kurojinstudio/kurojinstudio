"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const services = [
  { name: "Branding", videoId: "1183919850" },
  { name: "Brand Strategy", videoId: "1183919848" },
  { name: "Motion Graphics", videoId: "1183919849" },
  { name: "Video Editing", videoId: "1183919890" },
  { name: "3D Animation", videoId: "1183919909" },
  { name: "Web Development", videoId: "1183919928" },
  { name: "Naming & Packaging", videoId: "1066726309" },
  { name: "Branding & Advertising", videoId: "1066726233" },
];

/**
 * TextVideo — hover a service name, see its reel.
 * PERF FIX: iframes are now mounted lazily (only once hovered/activated),
 * instead of 8 simultaneous autoplaying Vimeo players on page load.
 */
const TextVideo: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only start anything when the section is actually visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSelect = useCallback((index: number) => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    setMounted((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setActiveIndex(index);
  }, []);

  const handleLeave = useCallback(() => {
    leaveTimeout.current = setTimeout(() => {
      setActiveIndex(0);
    }, 150);
  }, []);

  const cancelLeave = useCallback(() => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
  }, []);

  useEffect(() => {
    return () => {
      if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    };
  }, []);

  return (
    <div ref={sectionRef} className="bg-transparent w-full">
      <div className="w-full p-4 lg:p-14 relative">
        <div className="content flex flex-col-reverse lg:flex-row items-start justify-between gap-8 lg:gap-0">
          {/* ==================== VIDEO ==================== */}
          <div className="w-full lg:w-[45vw]">
            <div
              className="media w-full aspect-video lg:aspect-square relative lg:sticky lg:top-20 rounded-lg overflow-hidden bg-black"
              onMouseEnter={cancelLeave}
              onMouseLeave={handleLeave}
            >
              {inView &&
                services.map((service, index) =>
                  // Keep at most 3 Vimeo decoders live: the active reel plus
                  // its neighbors. Everything else unmounts (saves CPU/data).
                  mounted.has(index) && Math.abs(index - activeIndex) <= 1 ? (
                    <iframe
                      key={service.videoId}
                      src={`https://player.vimeo.com/video/${service.videoId}?autoplay=1&muted=1&loop=1&background=1`}
                      width="100%"
                      height="100%"
                      allow="autoplay; fullscreen"
                      title={service.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
                      style={{
                        pointerEvents: "none",
                        opacity: activeIndex === index ? 1 : 0,
                        zIndex: activeIndex === index ? 1 : 0,
                      }}
                    />
                  ) : null
                )}

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent lg:hidden z-10">
                <span className="text-white text-sm font-medium">
                  {services[activeIndex].name}
                </span>
              </div>
            </div>
          </div>

          {/* ==================== TEXT LIST ==================== */}
          <div className="text-content w-full lg:w-[50vw] lg:pl-8 overflow-x-clip pr-8">
            {services.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <motion.button
                  key={service.name}
                  type="button"
                  aria-current={isActive}
                  className="block w-full text-left lg:text-[4.5vw] text-xl md:text-2xl font-bold tracking-tight leading-none mb-1 py-3 lg:py-2 lg:mb-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 rounded"
                  initial={false}
                  animate={{
                    x: isActive ? 30 : 0,
                    color: isActive ? "#ffffff" : "#333333",
                  }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => handleSelect(index)}
                  onFocus={() => handleSelect(index)}
                  onClick={() => handleSelect(index)}
                  onMouseLeave={handleLeave}
                >
                  {service.name}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextVideo;
