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
    default: "IVE-APP — Interactive Visual Education Application",
    template: "%s | IVE-APP",
  },
  description:
    "IVE-APP adalah platform edukasi interaktif Indonesia: belajar sains dan matematika secara visual, eksplorasi simulasi interaktif, dan pemahaman konsep mendalam.",
  applicationName: "IVE-APP",
  keywords: ["IVE-APP", "edukasi visual", "interaktif", "fisika", "kimia", "biologi", "matematika", "simulasi sains"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn("h-full", "antialiased", figtree.variable, geistMono.variable, "font-sans")}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}