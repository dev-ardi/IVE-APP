import { redirect } from "next/navigation";

export default function LearnPage() {
  // Aligned with TAD §14.1 & AGENTS.md Table #10:
  // In Phase 1, only "umum" is active. /learn redirects directly to /learn/umum.
  redirect("/learn/umum");
}