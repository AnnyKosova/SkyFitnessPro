import Image from "next/image";
import Link from "next/link";
import styles from "./CourseCard.module.css";

interface CourseCardProps {
  course: {
    id: string;
    apiId?: string;
    name: string;
    image: string;
    days: number;
    duration: string;
    difficulty: string;
  };
  onAddCourse?: (courseId?: string, slug?: string) => void;
}

export default function CourseCard({ course, onAddCourse }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={course.image}
          alt={course.name}
          width={400}
          height={300}
          className={styles.image}
        />
        <button
          className={styles.addButton}
          aria-label="Добавить курс"
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onAddCourse?.(course.apiId, course.id);
          }}
        >
          <Image
            src="/images/icons/Add-in-Circle.svg"
            alt=""
            width={40}
            height={40}
            className={styles.plusIcon}
          />
        </button>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{course.name}</h3>
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <div className={`${styles.detailItem} ${styles.days}`}>
              <Image
                src="/images/icons/calendar.svg"
                alt=""
                width={20}
                height={20}
                className={styles.icon}
              />
              <span>{course.days} дней</span>
            </div>
            <div className={`${styles.detailItem} ${styles.duration}`}>
              <Image
                src="/images/icons/clock.svg"
                alt=""
                width={20}
                height={20}
                className={styles.icon}
              />
              <span>{course.duration}</span>
            </div>
          </div>
          <div className={`${styles.detailItem} ${styles.difficulty}`}>
            <Image
              src="/images/icons/difficulty.svg"
              alt=""
              width={20}
              height={20}
              className={styles.icon}
            />
            <span>{course.difficulty}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
