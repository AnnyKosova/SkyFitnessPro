"use client";

import { coursesApi } from "@/api/fitness";
import type { CourseWorkout } from "@/types/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SelectWorkoutModal.module.css";

type WorkoutItem = {
  id: string;
  title: string;
  subtitle: string;
  checked: boolean;
};

type SelectWorkoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string | null;
};

const mapWorkouts = (workouts: CourseWorkout[]): WorkoutItem[] =>
  workouts.map((workout, index) => ({
    id: workout._id,
    title: workout.name,
    subtitle: `Урок ${index + 1}`,
    checked: false,
  }));

export default function SelectWorkoutModal({ isOpen, onClose, courseId }: SelectWorkoutModalProps) {
  const router = useRouter();
  const [items, setItems] = useState<WorkoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbOffset, setThumbOffset] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const updateThumb = useCallback(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    const maxScroll = list.scrollHeight - list.clientHeight;
    if (maxScroll <= 0) {
      setThumbOffset(0);
      return;
    }
    const isMobile = window.innerWidth <= 768;
    const trackHeight = isMobile ? 335 : 359;
    const thumbHeight = isMobile ? 80 : 116;
    const maxThumb = trackHeight - thumbHeight;
    const ratio = list.scrollTop / maxScroll;
    setThumbOffset(Math.round(maxThumb * ratio));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const list = listRef.current;
    if (!list) {
      return;
    }

    updateThumb();
    list.addEventListener("scroll", updateThumb);

    return () => {
      list.removeEventListener("scroll", updateThumb);
    };
  }, [isOpen, updateThumb]);

  useEffect(() => {
    if (!isOpen || !courseId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const loadWorkouts = async () => {
      try {
        setIsLoading(true);
        const data = await coursesApi.getWorkouts(courseId);
        if (isMounted) {
          setItems(mapWorkouts(data));
        }
      } catch {
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadWorkouts();
    return () => {
      isMounted = false;
    };
  }, [courseId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("noScroll");
    } else {
      document.body.classList.remove("noScroll");
    }

    return () => {
      document.body.classList.remove("noScroll");
    };
  }, [isOpen]);

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleStart = () => {
    const selectedWorkout = items.find((item) => item.checked);
    if (selectedWorkout) {
      onClose();
      router.push(`/workouts/${selectedWorkout.id}`);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Выберите тренировку</h2>
        <div className={styles.listWrapper}>
          <div className={styles.list} ref={listRef}>
            {isLoading ? (
              <div className={styles.listState}>Загрузка...</div>
            ) : items.length === 0 ? (
              <div className={styles.listState}>Нет доступных тренировок</div>
            ) : (
              items.map((item) => (
                <div key={item.id} className={styles.listItem}>
                  <button
                    type="button"
                    className={styles.listIcon}
                    onClick={() => handleToggle(item.id)}
                    aria-label={item.checked ? "Снять выбор" : "Выбрать"}
                  >
                    <Image
                      src={
                        item.checked
                          ? "/images/courses/Check-in-Circle.png"
                          : "/images/courses/Check-in-Circle-No.png"
                      }
                      alt={item.checked ? "Выбрано" : "Не выбрано"}
                      width={24}
                      height={24}
                    />
                  </button>
                  <div className={styles.listText}>
                    <h3 className={styles.listTitle}>{item.title}</h3>
                    <p className={styles.listSubtitle}>{item.subtitle}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={styles.scrollTrack}>
            <div
              className={styles.scrollThumb}
              style={{ transform: `translateY(${thumbOffset}px)` }}
            />
          </div>
        </div>
        <button
          className={styles.startButton}
          type="button"
          onClick={handleStart}
          disabled={isLoading || !items.some((item) => item.checked)}
        >
          Начать
        </button>
      </div>
    </div>
  );
}
