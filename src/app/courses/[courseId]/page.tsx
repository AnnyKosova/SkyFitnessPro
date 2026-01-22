"use client";

import CoursePageClient from "@/components/CoursePage/CoursePageClient";
import { notFound } from "next/navigation";

const courseConfig: Record<
  string,
  { title: string; heroImageSrc: string; heroImageSrcMobile?: string }
> = {
  yoga: {
    title: "Йога",
    heroImageSrc: "/images/courses/Yogapagecourse.png",
    heroImageSrcMobile: "/images/courses/YogaMobpage.png",
  },
  stretching: {
    title: "Стретчинг",
    heroImageSrc: "/images/courses/Stretchingpagecourse.png",
  },
  bodyflex: {
    title: "Бодифлекс",
    heroImageSrc: "/images/courses/Bodyflexpagecourse.png",
  },
  fitness: {
    title: "Фитнес",
    heroImageSrc: "/images/courses/Fitnesspagecourse.png",
  },
  "step-aerobics": {
    title: "Степ-аэробика",
    heroImageSrc: "/images/courses/StepAerobicspagecourse.png",
  },
};

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const config = courseConfig[params.courseId];
  if (!config) {
    notFound();
  }

  return (
    <CoursePageClient
      courseId={params.courseId}
      title={config.title}
      heroImageSrc={config.heroImageSrc}
      heroImageSrcMobile={config.heroImageSrcMobile}
    />
  );
}
