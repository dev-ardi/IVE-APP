"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function IveLogoMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="36" height="36" rx="10" fill="#2A3FB8" />
      <path
        d="M10 11h3v14h-3zM15 11l5 14 5-14h3L22 25h-4L11.5 11H15z"
        fill="white"
        fillOpacity="0.95"
      />
    </svg>
  );
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathRef = useRef(pathname + searchParams.toString());

  const startLoading = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setProgress(0);
    setIsLoading(true);

    let p = 0;
    progressTimerRef.current = setInterval(() => {
      p += p < 40 ? 12 : p < 65 ? 5 : p < 80 ? 2 : 0.4;
      if (p > 85) p = 85;
      setProgress(p);
    }, 80);
  };

  const finishLoading = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgress(100);
    hideTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 380);
  };

  useEffect(() => {
    const currentKey = pathname + searchParams.toString();
    if (currentKey !== prevPathRef.current) {
      prevPathRef.current = currentKey;
      startLoading();
      const done = setTimeout(finishLoading, 520);
      return () => clearTimeout(done);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Top progress bar ── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="ive-progress-bar"
            className="fixed left-0 top-0 z-[9999] h-[3px] origin-left bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500 shadow-[0_0_10px_rgba(79,107,255,0.55)]"
            style={{ width: `${progress}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ ease: "easeOut", duration: 0.08 }}
          />
        )}
      </AnimatePresence>

      {/* ── Full-screen branded overlay (shows only for the initial flash) ── */}
      <AnimatePresence>
        {isLoading && progress < 55 && (
          <motion.div
            key="ive-page-overlay"
            className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#F4F1EA] dark:bg-[#121316]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              animate={{ scale: [1, 1.07, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4"
            >
              <IveLogoMark />
            </motion.div>

            <p className="mb-5 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-stone-400 dark:text-stone-600">
              IVE&#8209;APP
            </p>

            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-blue-500"
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -5, 0] }}
                  transition={{
                    duration: 0.75,
                    repeat: Infinity,
                    delay: i * 0.16,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
