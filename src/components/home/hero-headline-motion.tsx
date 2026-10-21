"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  CharacterAtom,
  CharacterLightbulb,
  CharacterBook,
  CharacterRocket,
  CharacterPlanet,
  CharacterFlask,
} from "./hero-characters";

/**
 * Variants untuk transisi entrance bertahap (staggered) per baris headline.
 */
const lineVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 14,
      mass: 0.8,
    },
  },
};

/**
 * Komponen Motion Headline Hero Home IVE-APP
 * Terinspirasi dari kinetic motion & micro-interactions Jitter.video.
 *
 * Menghidupkan tiga teks target:
 * 1. "Bangun Intuisi Nyata."
 * 2. "Eksplorasi Sains" (dengan garis aksen SVG dinamis)
 * 3. "Tanpa Batas Teori."
 *
 * Dikelilingi lapisan karakter edukasi SVG vektor berwarna yang mengambang
 * secara asinkronik, responsif, dan ramah aksesibilitas (prefers-reduced-motion).
 */
export function HeroHeadlineMotion() {
  const shouldReduceMotion = useReducedMotion();

  // Floating animations per karakter (asynchronous timing & motion)
  const floatingConfigs = [
    // 1. Bohlam Ide (Kiri Atas)
    {
      floatY: [0, -16, 0],
      rotate: [0, -8, 4, 0],
      duration: 3.8,
      delay: 0.1,
      glow: "drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)]",
    },
    // 2. Atom Ceria (Kanan Atas)
    {
      floatY: [0, -20, 0],
      rotate: [0, 6, -6, 0],
      duration: 4.6,
      delay: 0.25,
      glow: "drop-shadow-[0_4px_12px_rgba(14,165,233,0.35)]",
    },
    // 3. Planet Saturnus (Kanan Atas Jauh - Tablet & Desktop)
    {
      floatY: [0, 14, 0],
      rotate: [0, -5, 8, 0],
      duration: 5.2,
      delay: 0.4,
      glow: "drop-shadow-[0_4px_12px_rgba(139,92,246,0.35)]",
    },
    // 4. Tabung Reaksi (Kanan Tengah - Desktop)
    {
      floatY: [0, -12, 0],
      rotate: [0, 8, -4, 0],
      duration: 4.1,
      delay: 0.55,
      glow: "drop-shadow-[0_4px_12px_rgba(20,184,166,0.35)]",
    },
    // 5. Buku Pintar (Kiri Bawah)
    {
      floatY: [0, 15, 0],
      rotate: [0, 6, -3, 0],
      duration: 4.8,
      delay: 0.35,
      glow: "drop-shadow-[0_4px_12px_rgba(34,197,94,0.35)]",
    },
    // 6. Roket Mini (Kanan Bawah)
    {
      floatY: [0, -18, 0],
      rotate: [0, -10, 6, 0],
      duration: 3.9,
      delay: 0.65,
      glow: "drop-shadow-[0_4px_12px_rgba(236,72,153,0.35)]",
    },
  ];

  return (
    <div className="relative">
      {/* =========================================================================
          LAPISAN ILUSTRASI VEKTOR DEKORATIF (EDUCATIONAL SVG CHARACTERS)
          Mengambang di sekitar headline secara organik ala Jitter
         ========================================================================= */}

      {/* 1. Bohlam Ide (Kiri Atas) */}
      <motion.div
        className={`pointer-events-none absolute -top-11 -left-4 sm:-top-13 sm:-left-8 lg:-top-14 lg:-left-12 z-20 select-none ${floatingConfigs[0].glow}`}
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: floatingConfigs[0].delay }}
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { y: floatingConfigs[0].floatY, rotate: floatingConfigs[0].rotate }
          }
          transition={{
            repeat: Infinity,
            duration: floatingConfigs[0].duration,
            ease: "easeInOut",
          }}
        >
          <CharacterLightbulb />
        </motion.div>
      </motion.div>

      {/* 2. Atom Ceria (Kanan Atas) */}
      <motion.div
        className={`pointer-events-none absolute -top-10 right-2 sm:-top-12 sm:right-6 lg:-top-13 lg:right-[-12px] z-20 select-none ${floatingConfigs[1].glow}`}
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: floatingConfigs[1].delay }}
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { y: floatingConfigs[1].floatY, rotate: floatingConfigs[1].rotate }
          }
          transition={{
            repeat: Infinity,
            duration: floatingConfigs[1].duration,
            ease: "easeInOut",
          }}
        >
          <CharacterAtom />
        </motion.div>
      </motion.div>

      {/* 3. Planet Saturnus Cilik (Kanan Atas Peripheral - Tablet & Desktop) */}
      <motion.div
        className={`pointer-events-none absolute -top-4 right-[-24px] sm:right-[-32px] lg:right-[-44px] z-20 hidden select-none sm:block ${floatingConfigs[2].glow}`}
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: floatingConfigs[2].delay }}
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { y: floatingConfigs[2].floatY, rotate: floatingConfigs[2].rotate }
          }
          transition={{
            repeat: Infinity,
            duration: floatingConfigs[2].duration,
            ease: "easeInOut",
          }}
        >
          <CharacterPlanet />
        </motion.div>
      </motion.div>

      {/* 4. Tabung Reaksi Eksperimen (Kanan Tengah - Desktop) */}
      <motion.div
        className={`pointer-events-none absolute top-[45%] right-[-16px] lg:right-[-36px] z-20 hidden select-none md:block ${floatingConfigs[3].glow}`}
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: floatingConfigs[3].delay }}
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { y: floatingConfigs[3].floatY, rotate: floatingConfigs[3].rotate }
          }
          transition={{
            repeat: Infinity,
            duration: floatingConfigs[3].duration,
            ease: "easeInOut",
          }}
        >
          <CharacterFlask />
        </motion.div>
      </motion.div>

      {/* 5. Buku Pintar Terbuka (Kiri Bawah) */}
      <motion.div
        className={`pointer-events-none absolute -bottom-7 -left-3 sm:-bottom-8 sm:-left-7 lg:-bottom-9 lg:-left-10 z-20 select-none ${floatingConfigs[4].glow}`}
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: floatingConfigs[4].delay }}
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { y: floatingConfigs[4].floatY, rotate: floatingConfigs[4].rotate }
          }
          transition={{
            repeat: Infinity,
            duration: floatingConfigs[4].duration,
            ease: "easeInOut",
          }}
        >
          <CharacterBook />
        </motion.div>
      </motion.div>

      {/* 6. Roket Mini Eksplorasi (Kanan Bawah) */}
      <motion.div
        className={`pointer-events-none absolute -bottom-7 right-4 sm:-bottom-8 sm:right-10 lg:right-2 z-20 select-none ${floatingConfigs[5].glow}`}
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: floatingConfigs[5].delay }}
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { y: floatingConfigs[5].floatY, rotate: floatingConfigs[5].rotate }
          }
          transition={{
            repeat: Infinity,
            duration: floatingConfigs[5].duration,
            ease: "easeInOut",
          }}
        >
          <CharacterRocket />
        </motion.div>
      </motion.div>

      {/* =========================================================================
          KONTEN UTAMA: HEADLINE TARGET
          "Bangun Intuisi Nyata. Eksplorasi Sains Tanpa Batas Teori."
          Disusun bertahap (Staggered Children) tanpa mengubah font, layout, atau kata
         ========================================================================= */}
      <motion.h1
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.16,
              delayChildren: 0.08,
            },
          },
        }}
        className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl lg:text-[56px] lg:leading-[1.12] dark:text-white"
      >
        {/* Teks 1: "Bangun Intuisi Nyata." */}
        <motion.span variants={lineVariants} className="inline">
          Bangun Intuisi Nyata.{" "}
        </motion.span>

        {/* Teks 2: "Eksplorasi Sains" dengan garis aksen SVG dinamis */}
        <motion.span variants={lineVariants} className="relative inline-block text-blue-700 dark:text-blue-400">
          Eksplorasi Sains
          {/* Garis ilustratif kurva dengan transisi stroke drawing (pathLength) */}
          <svg
            className="absolute -bottom-1.5 left-0 w-full text-blue-500/40 dark:text-blue-400/40"
            height="8"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M0 7 C 20 0, 40 8, 60 2 C 80 -4, 90 7, 100 3"
              stroke="currentColor"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.65,
                delay: 0.45,
                ease: "easeOut",
              }}
            />
          </svg>
        </motion.span>{" "}

        {/* Teks 3: "Tanpa Batas Teori." */}
        <motion.span variants={lineVariants} className="inline">
          Tanpa Batas Teori.
        </motion.span>
      </motion.h1>
    </div>
  );
}
