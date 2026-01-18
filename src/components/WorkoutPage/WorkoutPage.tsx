"use client";

import { useEffect, useState } from "react";
import ProgressModal from "../WorkoutProgressModal/WorkoutProgressModal";
import WorkoutSuccessModal from "../WorkoutSuccessModal/WorkoutSuccessModal";
import styles from "./WorkoutPage.module.css";

const exerciseColumns = [
  [
    { name: "Наклоны вперед", progress: 0 },
    { name: "Наклоны назад", progress: 0 },
    { name: "Поднятие ног, согнутых в коленях", progress: 0 },
  ],
  [
    { name: "Наклоны вперед", progress: 0 },
    { name: "Наклоны назад", progress: 0 },
    { name: "Поднятие ног, согнутых в коленях", progress: 0 },
  ],
  [
    { name: "Наклоны вперед", progress: 0 },
    { name: "Наклоны назад", progress: 0 },
    { name: "Поднятие ног, согнутых в коленях", progress: 0 },
  ],
];

export default function WorkoutPage() {
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [hasProgressUpdated, setHasProgressUpdated] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.body.classList.toggle("noScroll", isProgressOpen || isSuccessOpen);
    return () => {
      document.body.classList.remove("noScroll");
    };
  }, [isProgressOpen, isSuccessOpen]);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Йога</h1>

      <section className={styles.videoSection}>
        <div className={styles.videoFrame}>
          <iframe
            className={styles.video}
            src="https://www.youtube.com/embed/gJPs7b8SpVw"
            title="Йога — тренировка"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section className={styles.exerciseCard}>
        <h2 className={styles.exerciseTitle}>Упражнения тренировки 2</h2>
        <div className={styles.exerciseGrid}>
          {exerciseColumns.map((column, columnIndex) => (
            <div className={styles.exerciseColumn} key={`column-${columnIndex}`}>
              {column.map((exercise, index) => (
                <div className={styles.exerciseItem} key={`${exercise.name}-${index}`}>
                  <span className={styles.exerciseText}>
                    {exercise.name} {exercise.progress}%
                  </span>
                  <span className={styles.exerciseLine} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <button
          className={styles.progressButton}
          type="button"
          onClick={() => setIsProgressOpen(true)}
        >
          {hasProgressUpdated ? "Обновить свой прогресс" : "Заполнить свой прогресс"}
        </button>
      </section>
      {isProgressOpen && (
        <ProgressModal
          onClose={() => setIsProgressOpen(false)}
          onSave={() => {
            setIsProgressOpen(false);
            setHasProgressUpdated(true);
            setIsSuccessOpen(true);
          }}
        />
      )}
      {isSuccessOpen && <WorkoutSuccessModal onClose={() => setIsSuccessOpen(false)} />}
    </main>
  );
}

