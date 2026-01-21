"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./CoursePage.module.css";

const defaultSuitabilityItems = [
  {
    desktop: (
      <>
        Давно хотели
        <br />
        попробовать йогу,
        <br />
        но не решались начать
      </>
    ),
    mobile: (
      <>
        <span>Давно хотели попробовать</span>
        <span>йогу, но не решались начать</span>
      </>
    ),
  },
  {
    desktop: (
      <>
        Хотите укрепить
        <br />
        позвоночник, избавиться
        <br />
        от болей в спине и суставах
      </>
    ),
    mobile: (
      <>
        <span>Хотите укрепить</span>
        <span>позвоночник, избавиться</span>
        <span>от болей в спине</span>
        <span>и суставах</span>
      </>
    ),
  },
  {
    desktop: (
      <>
        Ищете активность,
        <br />
        полезную для тела
        <br />и души
      </>
    ),
    mobile: (
      <>
        <span>Ищете активность,</span>
        <span>полезную для тела и души</span>
      </>
    ),
  },
];

const defaultDirections = [
  "Йога для новичков",
  "Классическая йога",
  "Кундалини-йога",
  "Йогатерапия",
  "Хатха-йога",
  "Аштанга-йога",
];

const defaultBenefits = [
  "проработка всех групп мышц",
  "тренировка суставов",
  "улучшение циркуляции крови",
  "упражнения заряжают бодростью",
  "помогают противостоять стрессам",
];

type CoursePageProps = {
  title: string;
  heroImageSrc: string;
  heroImageSrcMobile?: string;
  directions?: string[];
  fitting?: string[];
};

export default function CoursePage({
  title,
  heroImageSrc,
  heroImageSrcMobile,
  directions,
  fitting,
}: CoursePageProps) {
  const mobileSrc = heroImageSrcMobile ?? heroImageSrc;
  const [isMobile, setIsMobile] = useState(false);

  const suitabilityItems = fitting?.length
    ? fitting.slice(0, 3).map((item) => ({
        desktop: item,
        mobile: item,
      }))
    : defaultSuitabilityItems;

  const directionsList = directions?.length ? directions : defaultDirections;
  const benefitsList = fitting?.length ? fitting : defaultBenefits;

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src={isMobile ? mobileSrc : heroImageSrc}
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
            <div
              className={`${styles.suitabilityCard} ${
                index === 1 ? styles.suitabilityCardTight : ""
              }`}
              key={`suitability-${index}`}
            >
              <span
                className={`${styles.suitabilityNumber} ${
                  index === 0 ? styles.suitabilityNumberCompact : ""
                }`}
              >
                {index + 1}
              </span>
              <p className={styles.suitabilityText}>
                <span className={styles.suitabilityTextDesktop}>{item.desktop}</span>
                <span className={styles.suitabilityTextMobile}>{item.mobile}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.directions}>
        <h2 className={styles.sectionTitle}>Направления</h2>
        <div className={styles.directionsList}>
          {directionsList.map((direction) => (
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

      <section className={styles.promoWrapper}>
        <div className={styles.promoDecor}>
          <div className={styles.promoSwooshClip}>
            <Image
              src="/images/courses/course-swoosh.png"
              alt=""
              width={739}
              height={526}
              className={styles.promoSwoosh}
            />
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
        </div>
      </section>

      <section className={styles.promo}>
        <div className={styles.promoContent}>
          <h2 className={styles.promoTitle}>
            Начните путь
            <br />к новому телу
          </h2>
          <ul className={styles.promoList}>
            {benefitsList.map((benefit) => (
              <li className={styles.promoListItem} key={benefit}>
                {benefit}
              </li>
            ))}
          </ul>
          <button className={styles.promoButton} type="button">
            Войдите, чтобы добавить курс
          </button>
        </div>
      </section>
    </main>
  );
}
