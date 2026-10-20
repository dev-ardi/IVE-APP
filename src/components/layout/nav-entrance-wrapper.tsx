"use client";

import { motion } from "framer-motion";

/**
 * NavEntranceWrapper
 * Wraps the site header in a slide-from-top + spring bounce entrance animation.
 * Only plays once on initial mount (viewport-agnostic).
 */
export function NavEntranceWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        mass: 0.9,
        delay: 0.05,
      }}
    >
      {children}
    </motion.div>
  );
}
