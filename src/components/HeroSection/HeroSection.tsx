import Image from "next/image";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <h1 className={styles.headline}>
          Начните заниматься спортом
          <br />
          и улучшите качество жизни
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
