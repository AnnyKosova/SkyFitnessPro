"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./WorkoutProgressModal.module.css";

type WorkoutProgressModalProps = {
  onClose: () => void;
  onSave: (progressData: number[]) => void;
  exercises: { name: string; quantity: number; _id: string }[];
  initialProgressData?: number[];
};

export default function WorkoutProgressModal({
  onClose,
  onSave,
  exercises,
  initialProgressData,
}: WorkoutProgressModalProps) {
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    setValues(
      exercises.map((_, index) => {
        const value = initialProgressData?.[index];
        return value !== undefined && value !== null ? String(value) : "";
      })
    );
  }, [exercises, initialProgressData]);

  const handleChange = useCallback((index: number, value: string) => {
    setValues((prev) => prev.map((item, i) => (i === index ? value : item)));
  }, []);

  const handleSave = useCallback(() => {
    const progressData = values.map((value) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
    });
    onSave(progressData);
  }, [onSave, values]);

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Мой прогресс</h2>
        <form className={styles.form}>
          <div className={styles.fieldsWrapper}>
            <div className={styles.fields}>
              {exercises.map((exercise, index) => (
                <label className={styles.field} key={exercise._id}>
                  <span className={styles.label}>Сколько раз вы сделали {exercise.name}?</span>
                  <input
                    className={styles.input}
                    type="text"
                    value={values[index] ?? ""}
                    placeholder="0"
                    onChange={(event) => handleChange(index, event.target.value)}
                  />
                </label>
              ))}
            </div>
            <div className={styles.scrollTrack}>
              <span className={styles.scrollThumb} />
            </div>
          </div>
          <button className={styles.saveButton} type="button" onClick={handleSave}>
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
}
