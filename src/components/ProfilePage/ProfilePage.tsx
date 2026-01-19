import ScrollToTopButton from "@/components/CoursesSection/ScrollToTopButton";
import Image from "next/image";
import styles from "./ProfilePage.module.css";

const courses = [
  {
    id: "yoga",
    name: "Йога",
    image: "/images/courses/yoga.png",
    progress: 40,
    actionLabel: "Продолжить",
  },
  {
    id: "stretching",
    name: "Стретчинг",
    image: "/images/courses/stretching.png",
    progress: 0,
    actionLabel: "Начать тренировку",
  },
  {
    id: "fitness",
    name: "Фитнес",
    image: "/images/courses/fitness.png",
    progress: 100,
    actionLabel: "Начать заново",
  },
];

type ProfilePageProps = {
  onSelectWorkout?: () => void;
};

export default function ProfilePage({ onSelectWorkout }: ProfilePageProps) {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Профиль</h1>

      <section className={styles.profileCard}>
        <div className={styles.avatar}>
          <Image
            src="/images/courses/Photoprofile.png"
            alt="Профиль"
            width={120}
            height={120}
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.profileInfo}>
          <p className={styles.profileName}>Сергей</p>
          <p className={styles.profileLogin}>Логин: sergey.petrov96</p>
          <button className={styles.logoutButton} type="button">
            Выйти
          </button>
        </div>
      </section>

      <section className={styles.coursesSection}>
        <h2 className={styles.sectionTitle}>Мои курсы</h2>
        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <article key={course.id} className={styles.courseCard}>
              <div className={styles.courseImageWrapper}>
                <Image
                  src={course.image}
                  alt={course.name}
                  width={360}
                  height={220}
                  className={styles.courseImage}
                />
                <button
                  className={styles.courseRemove}
                  type="button"
                  aria-label="Удалить курс"
                  data-tooltip="Удалить курс"
                >
                  <Image src="/images/icons/Delete.svg" alt="" width={32} height={32} />
                </button>
              </div>
              <div className={styles.courseContent}>
                <h3 className={styles.courseTitle}>{course.name}</h3>
                <div className={styles.courseMeta}>
                  <span className={styles.metaItem}>
                    <Image
                      src="/images/icons/calendar.svg"
                      alt=""
                      width={20}
                      height={20}
                      className={styles.metaIcon}
                    />
                    25 дней
                  </span>
                  <span className={styles.metaItem}>
                    <Image
                      src="/images/icons/clock.svg"
                      alt=""
                      width={20}
                      height={20}
                      className={styles.metaIcon}
                    />
                    20-50 мин/день
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <Image
                    src="/images/icons/difficulty.svg"
                    alt=""
                    width={20}
                    height={20}
                    className={styles.metaIcon}
                  />
                  Сложность
                </div>
                <div className={styles.progressRow}>
                  <span className={styles.progressLabel}>Прогресс {course.progress}%</span>
                  <div className={styles.progressBar}>
                    <span
                      className={styles.progressFill}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <button className={styles.courseAction} type="button" onClick={onSelectWorkout}>
                  {course.actionLabel}
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.scrollToTopWrapper}>
          <ScrollToTopButton />
        </div>
      </section>
    </main>
  );
}
