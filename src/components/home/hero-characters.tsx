"use client";

import React from "react";

/**
 * 1. Atom Ceria (Sains & Fisika)
 * Karakter atom ramah dengan orbit cyan dan inti bersinar.
 */
export function CharacterAtom({ className = "h-11 w-11 sm:h-13 sm:w-13" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="atomCoreGlow" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </radialGradient>
      </defs>
      {/* Orbit 1 */}
      <ellipse
        cx="32"
        cy="32"
        rx="14"
        ry="28"
        transform="rotate(45 32 32)"
        stroke="#0EA5E9"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Electron 1 */}
      <circle cx="49" cy="15" r="3.2" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />

      {/* Orbit 2 */}
      <ellipse
        cx="32"
        cy="32"
        rx="14"
        ry="28"
        transform="rotate(-45 32 32)"
        stroke="#38BDF8"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Electron 2 */}
      <circle cx="15" cy="15" r="3.2" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="1" />

      {/* Central Nucleus with friendly eyes */}
      <circle cx="32" cy="32" r="9" fill="url(#atomCoreGlow)" stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Specular shine */}
      <circle cx="29.5" cy="29.5" r="2.5" fill="#FFFFFF" fillOpacity="0.85" />
    </svg>
  );
}

/**
 * 2. Bohlam Ide Bersinar (Kreativitas & Konsep)
 * Karakter bohlam hangat bernuansa kuning-amber dengan pancaran ide.
 */
export function CharacterLightbulb({ className = "h-10 w-10 sm:h-12 sm:w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bulbWarmth" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="70%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      {/* Spark rays */}
      <path d="M32 6V10M14 14L17 17M50 14L47 17M6 32H10M54 32H58" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />

      {/* Bulb Glass Body */}
      <path
        d="M32 14C23.163 14 16 21.163 16 30C16 35.684 19.006 40.647 23.518 43.344C24.814 44.119 25.6 45.513 25.6 47.023V49H38.4V47.023C38.4 45.513 39.186 44.119 40.482 43.344C44.994 40.647 48 35.684 48 30C48 21.163 40.837 14 32 14Z"
        fill="url(#bulbWarmth)"
        stroke="#D97706"
        strokeWidth="2"
      />
      {/* Specular curve highlight */}
      <path d="M22 23C24 19 28 17 32 17" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.8" />

      {/* Screw Base */}
      <rect x="25.6" y="49" width="12.8" height="3" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
      <path d="M26.5 52H37.5V55C37.5 56.1 36.6 57 35.5 57H28.5C27.4 57 26.5 56.1 26.5 55V52Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

/**
 * 3. Buku Pintar Terbuka (Literasi & Konsep)
 * Karakter buku dengan lembaran hijau emerald yang ramah.
 */
export function CharacterBook({ className = "h-10 w-10 sm:h-12 sm:w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Cover Backing */}
      <path
        d="M32 20C26 14 16 14 12 14C10 14 8 16 8 18V44C8 46 10 46 12 46C18 46 26 50 32 50C38 50 46 46 52 46C54 46 56 46 56 44V18C56 16 54 14 52 14C48 14 38 14 32 20Z"
        fill="#047857"
      />
      {/* Left Page Wing */}
      <path
        d="M32 18C26 12 16 12 12 12C10 12 9 14 9 16V42C10 42 18 42 28 47L32 47V18Z"
        fill="#4ADE80"
        stroke="#15803D"
        strokeWidth="1.5"
      />
      {/* Right Page Wing */}
      <path
        d="M32 18C38 12 48 12 52 12C54 12 55 14 55 16V42C54 42 46 42 36 47L32 47V18Z"
        fill="#22C55E"
        stroke="#15803D"
        strokeWidth="1.5"
      />
      {/* Spine Line */}
      <line x1="32" y1="18" x2="32" y2="47" stroke="#166534" strokeWidth="3" strokeLinecap="round" />

      {/* Page Lines */}
      <line x1="14" y1="22" x2="25" y2="22" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="14" y1="28" x2="23" y2="28" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="39" y1="22" x2="50" y2="22" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="39" y1="28" x2="48" y2="28" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" />

      {/* Gold Ribbon Bookmark */}
      <path d="M30 18V30L32 28L34 30V18" fill="#FBBF24" />
    </svg>
  );
}

/**
 * 4. Roket Mini Eksplorasi (Petualangan Sains)
 * Karakter roket ungu-magenta meluncur ke atas.
 */
export function CharacterRocket({ className = "h-11 w-11 sm:h-13 sm:w-13" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* Main Body */}
      <path
        d="M44.5 19.5C44.5 19.5 35 12 24 16C13 20 12 32 12 32C12 32 15.5 45.5 26.5 49.5C37.5 53.5 48 45.5 48 45.5C48 45.5 54.5 36.5 52.5 24.5C50.5 12.5 44.5 19.5 44.5 19.5Z"
        fill="url(#rocketBody)"
        stroke="#581C87"
        strokeWidth="1.5"
      />
      {/* Window / Porthole */}
      <circle cx="32" cy="32" r="6.5" fill="#F3E8FF" stroke="#581C87" strokeWidth="1.8" />
      <circle cx="30" cy="30" r="2" fill="#FFFFFF" />

      {/* Left Fin */}
      <path d="M20 44L11 56L24 52" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.2" />
      {/* Right Fin */}
      <path d="M44 20L56 11L52 24" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2" />

      {/* Jet Flame */}
      <path d="M16 48L7 60L21 54" fill="#FBBF24" fillOpacity="0.8" />
    </svg>
  );
}

/**
 * 5. Planet Saturnus Cilik (Astronomi & Semesta)
 * Karakter planet bernuansa ungu dengan cincin pink-coral.
 */
export function CharacterPlanet({ className = "h-10 w-10 sm:h-12 sm:w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="planetGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="60%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </radialGradient>
      </defs>
      {/* Back Half of Ring */}
      <path
        d="M10 26C16 19 38 18 52 25C54 26 55 27 55 28C52 25 36 21 16 29C13 30 11 28 10 26Z"
        fill="#F43F5E"
      />
      {/* Planet Sphere */}
      <circle cx="32" cy="32" r="16" fill="url(#planetGrad)" stroke="#4C1D95" strokeWidth="1.5" />
      {/* Specular highlight */}
      <ellipse cx="27" cy="24" rx="5" ry="3" transform="rotate(-25 27 24)" fill="#FFFFFF" fillOpacity="0.6" />

      {/* Front Half of Ring */}
      <path
        d="M7 34C16 45 42 45 57 32C59 30 56 29 53 30C40 40 18 40 11 31C8 28 6 32 7 34Z"
        fill="#FB7185"
      />

      {/* Sparkle Star */}
      <path d="M48 10L49 13L52 14L49 15L48 18L47 15L44 14L47 13L48 10Z" fill="#FBBF24" />
    </svg>
  );
}

/**
 * 6. Tabung Reaksi Eksperimen (Lab & Kimia)
 * Tabung reaksi miring dengan cairan biru-toska yang bergelembung.
 */
export function CharacterFlask({ className = "h-10 w-10 sm:h-12 sm:w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flaskLiquid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      <g transform="rotate(20 32 32)">
        {/* Glass tube */}
        <rect x="25" y="10" width="14" height="42" rx="7" fill="#F8FAFC" fillOpacity="0.4" stroke="#0F766E" strokeWidth="2.5" />
        {/* Liquid */}
        <path d="M26 30H38V45C38 48.3 35.3 51 32 51C28.7 51 26 48.3 26 45V30Z" fill="url(#flaskLiquid)" />
        {/* Bubbles */}
        <circle cx="30" cy="38" r="2" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="34" cy="44" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="31" cy="24" r="1.8" fill="#2DD4BF" />
        {/* Rim top */}
        <rect x="23" y="10" width="18" height="3" rx="1.5" fill="#0F766E" />
      </g>
    </svg>
  );
}
