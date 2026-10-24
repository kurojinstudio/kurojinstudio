// components/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const stripVariants = {
  initial: { scaleY: 0 },
  animate: {
    scaleY: [0, 1, 1, 0], // Grows up, pauses, shrinks down
    transition: { duration: 1.2, times: [0, 0.4, 0.6, 1], ease: [0.76, 0, 0.24, 1] }
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <div key={pathname}>
        {/* The Wipe Strips */}
        <div className="fixed inset-0 z-[100] flex pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-full bg-white origin-top"
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.05 }} // Stagger the strips
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }} // Wait for strips to finish
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}