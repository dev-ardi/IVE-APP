import type { Metadata } from "next";
import { Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
  keywords: [
    "IVE-APP",
    "edukasi visual",
    "interaktif",
    "fisika",
    "kimia",
    "biologi",
    "matematika",
    "simulasi sains",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", figtree.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-blue-600/20 selection:text-blue-700 dark:selection:bg-blue-400/20 dark:selection:text-blue-300">
        {children}
      </body>
    </html>
  );
}