"use client";

import { coursesApi } from "@/api/fitness";
import type { Course } from "@/types/api";
import { useEffect, useMemo, useState } from "react";
import CourseCard from "./CourseCard/CourseCard";
import styles from "./CoursesSection.module.css";
import ScrollToTopButton from "./ScrollToTopButton";

const defaultCourses = [
  {
    id: "yoga",
    name: "Йога",
    image: "/images/courses/yoga.png",
    days: 25,
    duration: "20-50 мин/день",
    difficulty: "Сложность",
  },
  {
    id: "stretching",
    name: "Стретчинг",
    image: "/images/courses/stretching.png",
    days: 25,
    duration: "20-50 мин/день",
    difficulty: "Сложность",
  },
  {
    id: "fitness",
    name: "Фитнес",
    image: "/images/courses/fitness.png",
    days: 25,
    duration: "20-50 мин/день",
    difficulty: "Сложность",
  },
  {
    id: "step-aerobics",
    name: "Степ-аэробика",
    image: "/images/courses/step-aerobics.png",
    days: 25,
    duration: "20-50 мин/день",
    difficulty: "Сложность",
  },
  {
    id: "bodyflex",
    name: "Бодифлекс",
    image: "/images/courses/bodyflex.png",
    days: 25,
    duration: "20-50 мин/день",
    difficulty: "Сложность",
  },
];

const courseImages: Record<string, string> = {
  yoga: "/images/courses/yoga.png",
  stretching: "/images/courses/stretching.png",
  fitness: "/images/courses/fitness.png",
  "step-aerobics": "/images/courses/step-aerobics.png",
  bodyflex: "/images/courses/bodyflex.png",
};

const courseOrder = ["yoga", "stretching", "fitness", "step-aerobics", "bodyflex"];

const courseNameToSlug: Record<string, string> = {
  Йога: "yoga",
  Yoga: "yoga",
  Стретчинг: "stretching",
  Stretching: "stretching",
  Фитнес: "fitness",
  Fitness: "fitness",
  "Степ-аэробика": "step-aerobics",
  "Степ аэробика": "step-aerobics",
  "Step-Aerobics": "step-aerobics",
  "Step Aerobics": "step-aerobics",
  Бодифлекс: "bodyflex",
  Bodyflex: "bodyflex",
};

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .trim();

const mapCourse = (course: Course) => {
  const baseName = course.nameRU || course.nameEN;
  const normalized = normalizeName(baseName);
  const normalizedEn = normalizeName(course.nameEN ?? "");
  const slug =
    courseNameToSlug[baseName] ??
    courseNameToSlug[course.nameEN ?? ""] ??
    (normalized.includes("степ") || normalizedEn.includes("step") ? "step-aerobics" : undefined) ??
    (normalized.includes("бодифлекс") || normalizedEn.includes("bodyflex")
      ? "bodyflex"
      : undefined) ??
    (normalized.includes("стретчинг") || normalizedEn.includes("stretch")
      ? "stretching"
      : undefined) ??
    (normalized.includes("фитнес") || normalizedEn.includes("fitness") ? "fitness" : undefined) ??
    (normalized.includes("йога") || normalizedEn.includes("yoga") ? "yoga" : "yoga");
  const duration = course.dailyDurationInMinutes
    ? `${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`
    : "20-50 мин/день";

  return {
    id: slug,
    name: course.nameRU,
    image: courseImages[slug] ?? courseImages.yoga,
    days: course.durationInDays ?? 25,
    duration,
    difficulty: "Сложность",
  };
};

export default function CoursesSection() {
  const [courses, setCourses] = useState(defaultCourses);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const apiCourses = await coursesApi.getAll();
        if (isMounted && apiCourses.length > 0) {
          setCourses(apiCourses.map(mapCourse));
        }
      } catch (error) {
        if (isMounted) {
          setCourses(defaultCourses);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCourses = useMemo(() => {
    const byId = new Map(courses.map((course) => [course.id, course]));
    const ordered = courseOrder
      .map((id) => byId.get(id))
      .filter((course): course is (typeof courses)[number] => Boolean(course));
    return ordered.length ? ordered : courses;
  }, [courses]);

  return (
    <section className={styles.coursesSection}>
      <div className={styles.container}>
        {visibleCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <ScrollToTopButton />
    </section>
  );
}
