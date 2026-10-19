import React from "react";
import type { Metadata } from "next";
import { listSubjectsByLevel } from "@/modules/subjects/service";
import { listAllPublishedLessons } from "@/modules/lessons/service";
import { ExploreClient } from "@/components/explore/explore-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jelajahi Konsep & Eksperimen Sains",
  description:
    "Temukan topik fisika, kimia, biologi, matematika, hingga sains umum mutakhir. Semua materi dilengkapi komponen simulasi interaktif dan penjelasan mandiri.",
};

export default async function ExplorePage() {
  const [subjects, lessons] = await Promise.all([
    listSubjectsByLevel("umum"),
    listAllPublishedLessons(),
  ]);

  return <ExploreClient initialSubjects={subjects} initialLessons={lessons} />;
}
