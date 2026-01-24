"use client";

import { coursesApi, userApi } from "@/api/fitness";
import SelectWorkoutModal from "@/components/SelectWorkoutModal/SelectWorkoutModal";
import { useAuth } from "@/context/AuthContext";
import type { Course, CourseProgress } from "@/types/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  stepaerobic: "step-aerobics",
  stepairobic: "step-aerobics",
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
  const workoutsProgress = Array.isArray(progress.workoutsProgress)
    ? progress.workoutsProgress
    : [];
  const totalWorkouts = course.workouts?.length ?? workoutsProgress.length ?? 0;
  if (!totalWorkouts) return 0;
  const completed = workoutsProgress.filter((item) => item.workoutCompleted).length;
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

const getProfileCoursesCacheKey = (email?: string) =>
  email ? `profileCourses:${email}` : "profileCourses";

const loadCachedCourses = (email?: string) => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(getProfileCoursesCacheKey(email));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ProfileCourse[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const saveCachedCourses = (email: string | undefined, courses: ProfileCourse[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(getProfileCoursesCacheKey(email), JSON.stringify(courses));
};

const ALL_COURSES_CACHE_KEY = "allCourses";

const loadCachedAllCourses = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ALL_COURSES_CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Course[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const saveCachedAllCourses = (courses: Course[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ALL_COURSES_CACHE_KEY, JSON.stringify(courses));
};

export default function ProfilePageClient() {
  const { user, isAuthenticated, isLoading, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<ProfileCourse[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const lastLoadKeyRef = useRef<string | null>(null);

  const openModal = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCourseId(null);
  }, []);

  const handleOpenCourse = useCallback(
    (courseId: string) => {
      router.push(`/courses/${courseId}`);
    },
    [router]
  );

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

  const handleResetCourse = useCallback(
    async (courseId: string) => {
      if (isResetting) {
        return;
      }
      try {
        setIsResetting(true);
        await coursesApi.resetProgress(courseId);
        setCourses((prev) =>
          prev
            ? prev.map((item) =>
                (item.apiId ?? item.id) === courseId
                  ? { ...item, progress: 0, actionLabel: "Начать тренировку" }
                  : item
              )
            : prev
        );
      } catch {
        // Ошибка отображается через общие сообщения API, не меняем верстку
      } finally {
        setIsResetting(false);
      }
    },
    [isResetting]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated || !user) {
      setCourses(null);
      return;
    }
    const courseIds = user.selectedCourses ?? [];
    if (courseIds.length === 0) {
      setCourses([]);
      return;
    }

    const cachedProfile = courses === null ? loadCachedCourses(user.email) : null;
    if (cachedProfile) {
      setCourses(cachedProfile);
    }

    const loadKey = `${user.email ?? "user"}:${courseIds.join(",")}`;
    if (lastLoadKeyRef.current === loadKey && courses !== null) {
      return;
    }
    lastLoadKeyRef.current = loadKey;

    let isMounted = true;

    const loadCourses = async () => {
      const buildProfileCourses = async (allCourses: Course[]) => {
        const courseMap = new Map(allCourses.map((course) => [course._id, course]));
        const selected = courseIds
          .map((courseId) => courseMap.get(courseId))
          .filter((course): course is Course => Boolean(course));
        const orderedSelected =
          selected.length > 0
            ? selected
            : allCourses
                .filter((course) => user.selectedCourses.includes(course._id))
                .sort((a, b) => {
                  const orderA = a.order ?? 0;
                  const orderB = b.order ?? 0;
                  return orderA - orderB;
                });

        const mapped = await Promise.all(
          orderedSelected.map(async (course) => {
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
        return mapped;
      };

      try {
        const cachedAllCourses = loadCachedAllCourses();
        if (!cachedProfile && cachedAllCourses) {
          const cachedMapped = await buildProfileCourses(cachedAllCourses);
          if (isMounted) {
            setCourses(cachedMapped);
          }
        }

        const allCourses = await coursesApi.getAll();
        saveCachedAllCourses(allCourses);
        const mapped = await buildProfileCourses(allCourses);
        if (isMounted) {
          setCourses(mapped);
          saveCachedCourses(user.email, mapped);
        }
      } catch {
        // Оставляем кэш/предыдущее состояние, чтобы не моргало
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));
    if (!isAuthenticated && !hasToken) {
      router.replace("/?auth=1");
    }
  }, [isAuthenticated, isLoading, router]);

  const userName = useMemo(() => {
    if (!user?.email) {
      return "";
    }
    const name = user.email.split("@")[0];
    return name || "";
  }, [user?.email]);

  return (
    <>
      <ProfilePage
        onSelectWorkout={openModal}
        onRemoveCourse={handleRemoveCourse}
        onResetCourse={handleResetCourse}
        onLogout={logout}
        onOpenCourse={handleOpenCourse}
        courses={courses ?? []}
        userName={user?.email ? userName : ""}
        userEmail={user?.email ? user?.email : ""}
      />
      <SelectWorkoutModal isOpen={isModalOpen} onClose={closeModal} courseId={selectedCourseId} />
    </>
  );
}
