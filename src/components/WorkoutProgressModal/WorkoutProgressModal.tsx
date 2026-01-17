"use client";

import { useCallback } from "react";
import styles from "./WorkoutProgressModal.module.css";

type WorkoutProgressModalProps = {
  onClose: () => void;
  onSave: () => void;
};

const fields = [
  {
    id: "forward",
    label: "Сколько раз вы сделали наклоны вперед?",
    defaultValue: "20",
    placeholder: "0",
  },
  {
    id: "backward",
    label: "Сколько раз вы сделали наклоны назад?",
    defaultValue: "",
    placeholder: "0",
  },
  {
    id: "legs",
    label: "Сколько раз вы сделали поднятие ног, согнутых в коленях?",
    defaultValue: "",
    placeholder: "0",
  },
];

export default function WorkoutProgressModal({ onClose, onSave }: WorkoutProgressModalProps) {
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Мой прогресс</h2>
        <form className={styles.form}>
          <div className={styles.fieldsWrapper}>
            <div className={styles.fields}>
              {fields.map((field) => (
                <label className={styles.field} key={field.id}>
                  <span className={styles.label}>{field.label}</span>
                  <input
                    className={styles.input}
                    type="text"
                    defaultValue={field.defaultValue}
                    placeholder={field.placeholder}
                  />
                </label>
              ))}
            </div>
            <div className={styles.scrollTrack}>
              <span className={styles.scrollThumb} />
            </div>
          </div>
          <button className={styles.saveButton} type="button" onClick={onSave}>
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
}
