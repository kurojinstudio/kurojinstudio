// components/RevealMask.tsx
'use client';

import { motion } from 'framer-motion';

export default function RevealMask({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = '' 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  direction?: 'up' | 'down' | 'left' | 'right'; 
  className?: string;
}) {
  const directionMap = {
    up: { y: '100%' },
    down: { y: '-100%' },
    left: { x: '100%' },
    right: { x: '-100%' },
  };

  const hidden = directionMap[direction];

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={hidden}
        whileInView={{ x: 0, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.76, 0, 0.24, 1], // The "Huncwot Snappy Cubic Bezier"
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}