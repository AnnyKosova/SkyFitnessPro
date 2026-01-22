"use client";

import { coursesApi, userApi, workoutsApi } from "@/api/fitness";
import Header from "@/components/Header/Header";
import { useAuth } from "@/context/AuthContext";
import type { Course, SingleWorkoutProgress, Workout } from "@/types/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProgressModal from "../WorkoutProgressModal/WorkoutProgressModal";
import WorkoutSuccessModal from "../WorkoutSuccessModal/WorkoutSuccessModal";
import styles from "./WorkoutPage.module.css";

type ExerciseProgressItem = {
  id: string;
  name: string;
  quantity: number;
  progress: number;
};

type WorkoutPageProps = {
  workoutId: string;
};

const buildColumns = (items: ExerciseProgressItem[]) => {
  const columns: ExerciseProgressItem[][] = [[], [], []];
  items.forEach((item, index) => {
    columns[index % 3].push(item);
  });
  return columns;
};

export default function WorkoutPage({ workoutId }: WorkoutPageProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [hasProgressUpdated, setHasProgressUpdated] = useState(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<SingleWorkoutProgress | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.body.classList.toggle("noScroll", isProgressOpen || isSuccessOpen);
    return () => {
      document.body.classList.remove("noScroll");
    };
  }, [isProgressOpen, isSuccessOpen]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/?auth=1");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    let isMounted = true;
    const load = async () => {
      try {
        setIsLoadingData(true);
        const allCourses = await coursesApi.getAll();
        const currentCourse = allCourses.find((item) => item.workouts.includes(workoutId)) ?? null;
        if (isMounted) {
          setCourse(currentCourse);
        }

        const workoutData = await workoutsApi.getById(workoutId);
        if (isMounted) {
          setWorkout(workoutData);
        }

        if (currentCourse) {
          const progressData = await userApi.getWorkoutProgress(currentCourse._id, workoutId);
          if (isMounted) {
            setProgress(progressData);
          }
        }
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          logout();
          router.replace("/?auth=1");
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, logout, router, workoutId]);

  const exercisesWithProgress = useMemo(() => {
    if (!workout) {
      return [];
    }
    const progressData = progress?.progressData ?? [];
    return workout.exercises.map((exercise, index) => {
      const completed = progressData[index] ?? 0;
      const percent = exercise.quantity > 0 ? Math.round((completed / exercise.quantity) * 100) : 0;
      return {
        id: exercise._id,
        name: exercise.name,
        quantity: exercise.quantity,
        progress: Math.max(0, Math.min(100, percent)),
      };
    });
  }, [progress?.progressData, workout]);

  const exerciseColumns = useMemo(
    () => buildColumns(exercisesWithProgress),
    [exercisesWithProgress]
  );

  const workoutNumber = useMemo(() => {
    const match = workout?.name.match(/\d+/);
    return match ? match[0] : "1";
  }, [workout?.name]);

  const handleSaveProgress = useCallback(
    async (progressData: number[]) => {
      if (!course) {
        return;
      }
      try {
        await workoutsApi.updateProgress(course._id, workoutId, { progressData });
        const updated = await userApi.getWorkoutProgress(course._id, workoutId);
        setProgress(updated);
        setHasProgressUpdated(true);
        setIsProgressOpen(false);
        setIsSuccessOpen(true);
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          logout();
          router.replace("/?auth=1");
        }
      }
    },
    [course, logout, router, workoutId]
  );

  const userName = useMemo(() => {
    if (!user?.email) {
      return "";
    }
    const name = user.email.split("@")[0];
    return name || "";
  }, [user?.email]);

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        userName={userName}
        userEmail={user?.email}
        onLogout={logout}
        hideTagline
      />
      <main className={styles.page}>
        <h1 className={styles.title}>{course?.nameRU ?? "Тренировка"}</h1>

        <section className={styles.videoSection}>
          <div className={styles.videoFrame}>
            <iframe
              className={styles.video}
              src={workout?.video ?? "about:blank"}
              title={workout?.name ?? "Тренировка"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        <section className={styles.exerciseCard}>
          <h2 className={styles.exerciseTitle}>Упражнения тренировки {workoutNumber}</h2>
          <div className={styles.exerciseGrid}>
            {exerciseColumns.map((column, columnIndex) => (
              <div className={styles.exerciseColumn} key={`column-${columnIndex}`}>
                {column.map((exercise, index) => (
                  <div className={styles.exerciseItem} key={`${exercise.id}-${index}`}>
                    <span className={styles.exerciseText}>
                      {exercise.name} {exercise.progress}%
                    </span>
                    <span className={styles.exerciseLine}>
                      <span
                        className={styles.progressFill}
                        style={{ width: `${exercise.progress}%` }}
                      />
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            className={styles.progressButton}
            type="button"
            onClick={() => setIsProgressOpen(true)}
            disabled={isLoadingData || !workout}
          >
            <span className={styles.progressButtonTextDesktop}>
              {hasProgressUpdated ? "Обновить свой прогресс" : "Заполнить свой прогресс"}
            </span>
            <span className={styles.progressButtonTextMobile}>Обновить свой прогресс</span>
          </button>
        </section>
        {isProgressOpen && workout && (
          <ProgressModal
            onClose={() => setIsProgressOpen(false)}
            onSave={handleSaveProgress}
            exercises={workout.exercises}
            initialProgressData={progress?.progressData}
          />
        )}
        {isSuccessOpen && <WorkoutSuccessModal onClose={() => setIsSuccessOpen(false)} />}
      </main>
    </>
  );
}
