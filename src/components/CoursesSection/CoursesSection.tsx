"use client";

import { coursesApi, userApi } from "@/api/fitness";
import { useAuth } from "@/context/AuthContext";
import type { Course } from "@/types/api";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CourseCard from "./CourseCard/CourseCard";
import styles from "./CoursesSection.module.css";
import ScrollToTopButton from "./ScrollToTopButton";

type CourseCardData = {
  id: string;
  apiId?: string;
  name: string;
  image: string;
  days: number;
  duration: string;
  difficulty: string;
};

const defaultCourses: CourseCardData[] = [
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

const mapCourse = (course: Course): CourseCardData => {
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
    apiId: course._id,
    name: course.nameRU,
    image: courseImages[slug] ?? courseImages.yoga,
    days: course.durationInDays ?? 25,
    duration,
    difficulty: "Сложность",
  };
};

type CoursesSectionProps = {
  onLoginClick?: () => void;
};

export default function CoursesSection({ onLoginClick }: CoursesSectionProps) {
  const { isAuthenticated, refreshUser, user } = useAuth();
  const [courses, setCourses] = useState(defaultCourses);
  const [isAdding, setIsAdding] = useState(false);

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

  const apiIdBySlug = useMemo(() => {
    const entries = courses
      .map((course) => [course.id, course.apiId] as const)
      .filter(([, apiId]) => Boolean(apiId));
    return new Map(entries);
  }, [courses]);

  const handleAddCourse = async (courseId?: string, slug?: string) => {
    const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));
    if (!isAuthenticated && !hasToken) {
      toast("Чтобы добавить курс, войдите в аккаунт", { id: "auth-required" });
      onLoginClick?.();
      return;
    }
    const resolvedId = courseId ?? (slug ? apiIdBySlug.get(slug) : undefined);
    if (!resolvedId) {
      return;
    }
    if (user?.selectedCourses?.includes(resolvedId)) {
      return;
    }
    if (isAdding) {
      return;
    }
    try {
      setIsAdding(true);
      await userApi.addCourse({ courseId: resolvedId });
      await refreshUser();
      toast.success("Курс добавлен в Ваш профиль", { id: "course-added" });
    } catch {
      // Ошибка от API не влияет на верстку, ничего не показываем
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className={styles.coursesSection}>
      <div className={styles.container}>
        {visibleCourses.map((course) => (
          <CourseCard key={course.id} course={course} onAddCourse={handleAddCourse} />
        ))}
      </div>
      <ScrollToTopButton />
    </section>
  );
}
