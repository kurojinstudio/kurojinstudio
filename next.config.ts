import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [70, 75, 80, 85],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "motion/react"],
  },
};

export default nextConfig;
