"use client";

import { coursesApi, userApi } from "@/api/fitness";
import SelectWorkoutModal from "@/components/SelectWorkoutModal/SelectWorkoutModal";
import { useAuth } from "@/context/AuthContext";
import type { Course, CourseProgress } from "@/types/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProfilePage, { ProfileCourse } from "./ProfilePage";

const courseImages: Record<string, string> = {
  yoga: "/images/courses/yoga.png",
  stretching: "/images/courses/stretching.png",
  fitness: "/images/courses/fitness.png",
  "step-aerobics": "/images/courses/step-aerobics.png",
  bodyflex: "/images/courses/bodyflex.png",
};

const slugOverrides: Record<string, string> = {
  yoga: "yoga",
  stretching: "stretching",
  fitness: "fitness",
  "step-aerobics": "step-aerobics",
  stepaerobics: "step-aerobics",
  "step-aerobika": "step-aerobics",
  bodyflex: "bodyflex",
  бодифлекс: "bodyflex",
  "степ-аэробика": "step-aerobics",
  стретчинг: "stretching",
  йога: "yoga",
  фитнес: "fitness",
};

const toSlug = (value: string) => {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return slugOverrides[normalized] ?? normalized;
};

const getProgressPercent = (course: Course, progress: CourseProgress | null) => {
  if (!progress) return 0;
  const totalWorkouts = course.workouts?.length ?? progress.workoutsProgress.length ?? 0;
  if (!totalWorkouts) return 0;
  const completed = progress.workoutsProgress.filter((item) => item.workoutCompleted).length;
  return Math.round((completed / totalWorkouts) * 100);
};

const buildCourse = (course: Course, progressPercent: number): ProfileCourse => {
  const baseName = course.nameEN || course.nameRU;
  const slug = toSlug(baseName);
  const duration = course.dailyDurationInMinutes
    ? `${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`
    : "20-50 мин/день";
  const actionLabel =
    progressPercent >= 100
      ? "Начать заново"
      : progressPercent > 0
        ? "Продолжить"
        : "Начать тренировку";

  return {
    id: slug,
    apiId: course._id,
    name: course.nameRU,
    image: courseImages[slug] ?? courseImages.yoga,
    progress: progressPercent,
    actionLabel,
    days: course.durationInDays ?? 25,
    duration,
  };
};

export default function ProfilePageClient() {
  const { user, isAuthenticated, isLoading, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<ProfileCourse[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const openModal = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCourseId(null);
  }, []);

  const handleRemoveCourse = useCallback(
    async (courseId: string) => {
      if (isRemoving) {
        return;
      }
      try {
        setIsRemoving(true);
        await userApi.removeCourse(courseId);
        await refreshUser();
        setCourses((prev) =>
          prev ? prev.filter((item) => (item.apiId ?? item.id) !== courseId) : prev
        );
      } catch {
        // Ошибка отображается через общие сообщения API, не меняем верстку
      } finally {
        setIsRemoving(false);
      }
    },
    [isRemoving, refreshUser]
  );

  useEffect(() => {
    if (!isAuthenticated || !user?.selectedCourses) {
      setCourses(null);
      return;
    }
    if (user.selectedCourses.length === 0) {
      setCourses([]);
      return;
    }

    let isMounted = true;

    const loadCourses = async () => {
      try {
        const allCourses = await coursesApi.getAll();
        const selected = allCourses.filter((course) => user.selectedCourses.includes(course._id));

        const mapped = await Promise.all(
          selected.map(async (course) => {
            let progress: CourseProgress | null = null;
            try {
              progress = await userApi.getCourseProgress(course._id);
            } catch {
              progress = null;
            }
            const progressPercent = getProgressPercent(course, progress);
            return buildCourse(course, progressPercent);
          })
        );

        if (isMounted) {
          setCourses(mapped);
        }
      } catch {
        if (isMounted) {
          setCourses(null);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.selectedCourses]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/?auth=1");
    }
  }, [isAuthenticated, isLoading, router]);

  const userName = useMemo(() => {
    if (!user?.email) {
      return "Сергей";
    }
    const name = user.email.split("@")[0];
    return name || "Сергей";
  }, [user?.email]);

  return (
    <>
      <ProfilePage
        onSelectWorkout={openModal}
        onRemoveCourse={handleRemoveCourse}
        onLogout={logout}
        courses={courses ?? undefined}
        userName={userName}
        userEmail={user?.email}
      />
      <SelectWorkoutModal isOpen={isModalOpen} onClose={closeModal} courseId={selectedCourseId} />
    </>
  );
}
