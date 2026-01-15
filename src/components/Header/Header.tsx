"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

type HeaderProps = {
  onLoginClick?: () => void;
};

export default function Header({ onLoginClick }: HeaderProps) {
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
        <button className={styles.loginButton} type="button" onClick={onLoginClick}>
          Войти
        </button>
      </div>
    </header>
  );
}
