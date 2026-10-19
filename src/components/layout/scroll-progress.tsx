"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[3.5px] bg-slate-200/50 dark:bg-slate-800/50"
    >
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
}
