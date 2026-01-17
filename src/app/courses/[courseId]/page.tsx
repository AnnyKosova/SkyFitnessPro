import CoursePageClient from "@/components/CoursePage/CoursePageClient";

type CourseConfig = {
  title: string;
  heroImageSrc: string;
  heroImageSrcMobile?: string;
};

const courseConfig: Record<string, CourseConfig> = {
  yoga: {
    title: "Йога",
    heroImageSrc: "/images/courses/Yogapagecourse.png",
    heroImageSrcMobile: "/images/courses/YogaMobpage.png",
  },
  stretching: {
    title: "Стретчинг",
    heroImageSrc: "/images/courses/Stretchingpagecourse.png",
  },
  fitness: {
    title: "Фитнес",
    heroImageSrc: "/images/courses/Fitnesspagecourse.png",
  },
  "step-aerobics": {
    title: "Степ-аэробика",
    heroImageSrc: "/images/courses/StepAerobicspagecourse.png",
  },
  bodyflex: {
    title: "Бодифлекс",
    heroImageSrc: "/images/courses/Bodyflexpagecourse.png",
  },
};

export default function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const currentConfig = courseConfig[params.courseId] ?? courseConfig.yoga;

  return (
    <CoursePageClient
      title={currentConfig.title}
      heroImageSrc={currentConfig.heroImageSrc}
      heroImageSrcMobile={currentConfig.heroImageSrcMobile}
    />
  );
}
