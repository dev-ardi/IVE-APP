import React from "react";
import type { Metadata } from "next";
import { listSubjectsByLevel } from "@/modules/subjects/service";
import { listAllPublishedLessons } from "@/modules/lessons/service";
import { MyLearningClient } from "@/components/my-learning/my-learning-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pembelajaran Saya — IVE-APP",
  description:
    "Pantau materi yang telah Anda selesaikan dan akses materi favorit yang disimpan untuk dipelajari kembali kapan saja.",
};

export default async function MyLearningPage() {
  const [subjects, lessons] = await Promise.all([
    listSubjectsByLevel("umum"),
    listAllPublishedLessons(),
  ]);

  return <MyLearningClient subjects={subjects} allLessons={lessons} />;
}
