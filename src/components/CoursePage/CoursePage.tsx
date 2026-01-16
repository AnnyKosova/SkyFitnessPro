"use client";

import Image from "next/image";
import styles from "./CoursePage.module.css";

const suitabilityItems = [
  <>
    Давно хотели
    <br />
    попробовать йогу,
    <br />
    но не решались начать
  </>,
  <>
    Хотите укрепить
    <br />
    позвоночник, избавиться
    <br />
    от болей в спине и суставах
  </>,
  <>
    Ищете активность,
    <br />
    полезную для тела
    <br />и души
  </>,
];

const directions = [
  "Йога для новичков",
  "Классическая йога",
  "Кундалини-йога",
  "Йогатерапия",
  "Хатха-йога",
  "Аштанга-йога",
];

const benefits = [
  "проработка всех групп мышц",
  "тренировка суставов",
  "улучшение циркуляции крови",
  "упражнения заряжают бодростью",
  "помогают противостоять стрессам",
];

type CoursePageProps = {
  title: string;
  heroImageSrc: string;
};

export default function CoursePage({ title, heroImageSrc }: CoursePageProps) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src={heroImageSrc}
          alt={title}
          fill
          className={styles.heroImageAsset}
          priority
        />
      </section>

      <section className={styles.suitability}>
        <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
        <div className={styles.suitabilityCards}>
          {suitabilityItems.map((item, index) => (
            <div className={styles.suitabilityCard} key={`suitability-${index}`}>
              <span className={styles.suitabilityNumber}>{index + 1}</span>
              <p className={styles.suitabilityText}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.directions}>
        <h2 className={styles.sectionTitle}>Направления</h2>
        <div className={styles.directionsList}>
          {directions.map((direction) => (
            <div className={styles.directionItem} key={direction}>
              <Image
                src="/images/icons/Sparcle.svg"
                alt=""
                width={16}
                height={16}
                className={styles.directionIcon}
              />
              <span>{direction}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.promo}>
        <div className={styles.promoSwooshClip}>
          <Image
            src="/images/courses/course-swoosh.png"
            alt=""
            width={739}
            height={526}
            className={styles.promoSwoosh}
          />
        </div>
        <div className={styles.promoContent}>
          <h2 className={styles.promoTitle}>
            Начните путь
            <br />
            к новому телу
          </h2>
          <ul className={styles.promoList}>
            {benefits.map((benefit) => (
              <li className={styles.promoListItem} key={benefit}>
                {benefit}
              </li>
            ))}
          </ul>
          <button className={styles.promoButton} type="button">
            Войдите, чтобы добавить курс
          </button>
        </div>
        <div className={styles.promoImage}>
          <Image
            src="/images/courses/BlackStrip.png"
            alt=""
            width={54}
            height={47}
            className={styles.promoStrip}
          />
          <Image
            src="/images/courses/course-man.png"
            alt="Спортсмен"
            width={515}
            height={568}
            className={styles.promoMan}
            priority
          />
        </div>
      </section>
    </main>
  );
}
