"use client";

import { motion } from "framer-motion";

/**
 * Wraps the hero section left column (headline + CTAs) with a
 * "from-front" depth entrance: starts scaled up slightly + faded,
 * then settles with a spring bounce landing.
 *
 * IMPORTANT: className is forwarded to the motion.div so that CSS Grid
 * col-span utilities (e.g. lg:col-span-7) work correctly — the motion.div
 * IS the grid child, so it must carry the layout classes.
 */
export function HeroTextAnim({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 1.07 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        mass: 0.85,
        delay: 0.15, // slight delay after navbar
      }}
      style={{ transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wraps the hero right column (interactive simulator preview) with a
 * slide-from-right + spring bounce entrance, delayed after the text lands.
 *
 * className is forwarded so lg:col-span-5 and flex/justify utilities
 * are applied directly on the grid child.
 */
export function HeroSimulatorAnim({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 20,
        mass: 0.9,
        delay: 0.42, // fires after text finishes landing
      }}
    >
      {children}
    </motion.div>
  );
}
