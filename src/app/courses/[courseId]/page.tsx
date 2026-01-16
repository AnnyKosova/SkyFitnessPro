import Header from "@/components/Header/Header";
import CoursePage from "@/components/CoursePage/CoursePage";

type CourseConfig = {
  title: string;
  heroImageSrc: string;
};

const courseConfig: Record<string, CourseConfig> = {
  yoga: {
    title: "Йога",
    heroImageSrc: "/images/courses/Yogapagecourse.png",
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

export default function CourseDetailsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const currentConfig = courseConfig[params.courseId] ?? courseConfig.yoga;
  const isAuthPreview = false;

  return (
    <>
      <Header />
      <CoursePage title={currentConfig.title} heroImageSrc={currentConfig.heroImageSrc} />
    </>
  );
}
