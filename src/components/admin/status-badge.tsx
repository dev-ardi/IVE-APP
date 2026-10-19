import { ContentStatusBadge, DifficultyBadge } from "./ui/badge";
import type { ContentStatus } from "@prisma/client";

export function StatusBadge({ status }: { status: ContentStatus }) {
  return <ContentStatusBadge status={status} />;
}

export { DifficultyBadge };