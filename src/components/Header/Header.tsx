"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import styles from "./Header.module.css";

type HeaderProps = {
  onLoginClick?: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  forceMenuOpen?: boolean;
};

export default function Header({
  onLoginClick,
  isAuthenticated,
  userName,
  forceMenuOpen,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    if (forceMenuOpen) {
      return;
    }
    setIsMenuOpen((prev) => !prev);
  }, [forceMenuOpen]);

  const isMenuVisible = forceMenuOpen || isMenuOpen;

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
          <div className={styles.userMenuWrapper}>
            <button className={styles.userButton} type="button" onClick={toggleMenu}>
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
            {isMenuVisible && (
              <div className={styles.userMenu}>
                <p className={styles.userMenuName}>{userName ?? "Сергей"}</p>
                <p className={styles.userMenuEmail}>sergey.petrov96@mail.ru</p>
                <button className={styles.userMenuPrimary} type="button">
                  Мой профиль
                </button>
                <button className={styles.userMenuSecondary} type="button">
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className={styles.loginButton} type="button" onClick={onLoginClick}>
            Войти
          </button>
        )}
      </div>
    </header>
  );
}
