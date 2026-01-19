"use client";

import type { MouseEvent } from "react";
import styles from "./CoursesSection.module.css";

export default function ScrollToTopButton() {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Простой и надежный способ скролла
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button 
      className={styles.scrollToTopButton} 
      onClick={handleClick}
      type="button"
      aria-label="Прокрутить наверх"
    >
      Наверх ↑
    </button>
  );
}

