"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

type HeaderProps = {
  onLoginClick?: () => void;
  isAuthenticated?: boolean;
  userName?: string;
};

export default function Header({ onLoginClick, isAuthenticated, userName }: HeaderProps) {
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
        {isAuthenticated ? (
          <button className={styles.userButton} type="button">
            <Image
              src="/images/icons/Profile.svg"
              alt=""
              width={24}
              height={24}
              className={styles.userIcon}
            />
            <span className={styles.userName}>{userName ?? "Сергей"}</span>
            <Image
              src="/images/icons/Down.svg"
              alt=""
              width={12}
              height={8}
              className={styles.userArrow}
            />
          </button>
        ) : (
          <button className={styles.loginButton} type="button" onClick={onLoginClick}>
            Войти
          </button>
        )}
      </div>
    </header>
  );
}
