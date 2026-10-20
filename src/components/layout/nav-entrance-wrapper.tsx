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
        stiffness: 300,
        damping: 24,
        mass: 0.8,
        delay: 0, // fires immediately — navbar is always first
      }}
    >
      {children}
    </motion.div>
  );
}
