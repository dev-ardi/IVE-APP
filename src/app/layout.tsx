import type { Metadata } from "next";
import { Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "IVE — Visual Education Interactive",
    template: "%s | IVE",
  },
  description:
    "IVE adalah platform edukasi interaktif berbahasa Indonesia: belajar visual, interaktif, dan terukur dari jenjang SD hingga SMA.",
  applicationName: "IVE",
  keywords: ["IVE", "edukasi", "belajar", "interaktif", "fisika", "matematika", "biologi"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn("h-full", "antialiased", figtree.variable, geistMono.variable, "font-sans")}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}