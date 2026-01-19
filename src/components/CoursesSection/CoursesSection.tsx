"use client";

import styles from "./CoursesSection.module.css";
import CourseCard from "./CourseCard/CourseCard";
import ScrollToTopButton from "./ScrollToTopButton";

export default function CoursesSection() {
  // Временные данные, позже будут из API
  const courses = [
    {
      id: "yoga",
      name: "Йога",
      image: "/images/courses/yoga.png",
      days: 25,
      duration: "20-50 мин/день",
      difficulty: "Сложность",
    },
    {
      id: "stretching",
      name: "Стретчинг",
      image: "/images/courses/stretching.png",
      days: 25,
      duration: "20-50 мин/день",
      difficulty: "Сложность",
    },
    {
      id: "fitness",
      name: "Фитнес",
      image: "/images/courses/fitness.png",
      days: 25,
      duration: "20-50 мин/день",
      difficulty: "Сложность",
    },
    {
      id: "step-aerobics",
      name: "Степ-аэробика",
      image: "/images/courses/step-aerobics.png",
      days: 25,
      duration: "20-50 мин/день",
      difficulty: "Сложность",
    },
    {
      id: "bodyflex",
      name: "Бодифлекс",
      image: "/images/courses/bodyflex.png",
      days: 25,
      duration: "20-50 мин/день",
      difficulty: "Сложность",
    },
  ];

  return (
    <section className={styles.coursesSection}>
      <div className={styles.container}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <ScrollToTopButton />
    </section>
  );
}

