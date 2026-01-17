import Image from "next/image";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <h1 className={styles.headline}>
          <span className={styles.desktopHeadline}>
            Начните заниматься спортом
            <br />
            и улучшите качество жизни
          </span>
          <span className={styles.mobileHeadline}>
            <span>Начните заниматься</span>
            <span>спортом и улучшите</span>
            <span>качество жизни</span>
          </span>
        </h1>
        <div className={styles.speechBubble}>
          <Image
            src="/images/speech-bubble/bubble.svg"
            alt="Измени своё тело за полгода!"
            width={288}
            height={120}
            className={styles.bubbleImage}
          />
        </div>
      </div>
    </section>
  );
}
