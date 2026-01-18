"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./SelectWorkoutModal.module.css";

type WorkoutItem = {
  id: string;
  title: string;
  subtitle: string;
  checked: boolean;
};

const workouts: WorkoutItem[] = [
  {
    id: "1",
    title: "Утренняя практика",
    subtitle: "Йога на каждый день / 1 день",
    checked: false,
  },
  {
    id: "2",
    title: "Красота и здоровье",
    subtitle: "Йога на каждый день / 2 день",
    checked: false,
  },
  {
    id: "3",
    title: "Асаны стоя",
    subtitle: "Йога на каждый день / 3 день",
    checked: false,
  },
  {
    id: "4",
    title: "Растягиваем мышцы бедра",
    subtitle: "Йога на каждый день / 4 день",
    checked: false,
  },
  {
    id: "5",
    title: "Гибкость спины",
    subtitle: "Йога на каждый день / 5 день",
    checked: false,
  },
];

type SelectWorkoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SelectWorkoutModal({ isOpen, onClose }: SelectWorkoutModalProps) {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [items, setItems] = useState(workouts);

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
    const trackHeight = 359;
    const thumbHeight = 116;
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
    const handleScroll = () => updateThumb();
    list.addEventListener("scroll", handleScroll);
    updateThumb();
    return () => list.removeEventListener("scroll", handleScroll);
  }, [isOpen, updateThumb]);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }, []);

  const handleStart = useCallback(() => {
    const selected = items.find((item) => item.checked);
    if (!selected) {
      return;
    }
    router.push(`/workouts/${selected.id}`);
  }, [items, router]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <h2 className={styles.title}>Выберите тренировку</h2>
        <div className={styles.listWrapper}>
          <div className={styles.list} role="list" onScroll={updateThumb} ref={listRef}>
            {items.map((workout) => (
              <div
                key={workout.title}
                className={styles.listItem}
                role="listitem"
                onClick={() => toggleItem(workout.id)}
              >
                <Image
                  src={
                    workout.checked
                      ? "/images/courses/Check-in-Circle.png"
                      : "/images/courses/Check-in-Circle-No.png"
                  }
                  alt=""
                  width={24}
                  height={24}
                  className={styles.listIcon}
                />
                <div className={styles.listText}>
                  <p className={styles.listTitle}>{workout.title}</p>
                  <p className={styles.listSubtitle}>{workout.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.scrollTrack}>
            <span
              className={styles.scrollThumb}
              style={{ transform: `translateY(${thumbOffset}px)` }}
            />
          </div>
        </div>
        <button
          className={styles.startButton}
          type="button"
          onClick={handleStart}
          disabled={!items.some((item) => item.checked)}
        >
          Начать
        </button>
      </div>
    </div>
  );
}

