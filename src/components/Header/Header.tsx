import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/images/logo/logo.svg"
              alt="SkyFitness Pro"
              width={200}
              height={50}
              className={styles.logo}
              priority
            />
          </Link>
          <p className={styles.tagline}>Онлайн-тренировки для занятий дома</p>
        </div>
        <button className={styles.loginButton}>Войти</button>
      </div>
    </header>
  );
}
