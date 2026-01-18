"use client";

import { useCallback } from "react";
import Image from "next/image";
import styles from "./WorkoutSuccessModal.module.css";

type WorkoutSuccessModalProps = {
  onClose: () => void;
};

export default function WorkoutSuccessModal({ onClose }: WorkoutSuccessModalProps) {
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
        <h2 className={styles.title}>Ваш прогресс засчитан!</h2>
        <Image
          src="/images/courses/Check-in-Circle.png"
          alt="Прогресс сохранен"
          width={68}
          height={68}
          className={styles.icon}
        />
      </div>
    </div>
  );
}

