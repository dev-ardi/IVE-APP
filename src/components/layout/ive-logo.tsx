import Link from "next/link";
import { cn } from "@/lib/utils";

interface IveLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
}

export function IveLogo({ className, showSubtitle = true, size = "md" }: IveLogoProps) {
  const iconSize = size === "sm" ? 32 : size === "lg" ? 44 : 38;

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 transition-opacity hover:opacity-95", className)}
      aria-label="IVE-APP Beranda"
    >
      {/* Custom Vector Mark: Layered Isometric Prism + Kinetic Spark Node */}
      <div
        className="relative flex items-center justify-center rounded-xl border-2 border-slate-900 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,0.9)] transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[3.5px_3.5px_0px_0px_rgba(15,23,42,0.9)] dark:border-slate-100 dark:shadow-[2.5px_2.5px_0px_0px_rgba(255,255,255,0.8)]"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          {/* Base Isometric Cube / Book Layer */}
          <path
            d="M20 5L33 12.5V27.5L20 35L7 27.5V12.5L20 5Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
            fill="rgba(255, 255, 255, 0.12)"
          />
          {/* Inner Prism facets representing visual layers */}
          <path
            d="M20 5V20M20 20L33 12.5M20 20L7 12.5M20 20V35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeOpacity="0.8"
          />
          {/* Interactive focal spark / energy node */}
          <circle
            cx="20"
            cy="20"
            r="3.2"
            className="fill-amber-300 stroke-slate-950"
            strokeWidth="1.5"
          />
          <path
            d="M27 8.5L29 5M31 16L34.5 16M13 8.5L11 5"
            stroke="#FDE047"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark with Soft Neobrutalism weight */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 leading-none">
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            IVE
          </span>
          <span className="rounded-md border border-blue-600 bg-blue-600 px-1.5 py-0.5 text-xs font-black tracking-wide text-white shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,0.9)] dark:border-blue-400 dark:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.7)]">
            APP
          </span>
        </div>
        {showSubtitle && (
          <span className="mt-0.5 text-[10.5px] font-bold tracking-widest text-slate-600 uppercase dark:text-slate-400">
            Interactive Visual Ed
          </span>
        )}
      </div>
    </Link>
  );
}
