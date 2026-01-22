"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import styles from "./Header.module.css";

type HeaderProps = {
  onLoginClick?: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  forceMenuOpen?: boolean;
  hideTagline?: boolean;
};

export default function Header({
  onLoginClick,
  isAuthenticated,
  userName,
  userEmail,
  onLogout,
  forceMenuOpen,
  hideTagline,
}: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    if (forceMenuOpen) {
      return;
    }
    setIsMenuOpen((prev) => !prev);
  }, [forceMenuOpen]);

  const isMenuVisible = forceMenuOpen || isMenuOpen;

  const handleProfileClick = useCallback(() => {
    setIsMenuOpen(false);
    router.push("/profile");
  }, [router]);

  const handleLogoutClick = useCallback(() => {
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
      return;
    }
    router.push("/");
  }, [onLogout, router]);

  const displayName = userName || (userEmail ? userEmail.split("@")[0] : "");

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
          {!hideTagline && <p className={styles.tagline}>Онлайн-тренировки для занятий дома</p>}
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
              {displayName ? (
                <span className={styles.userName}>{displayName}</span>
              ) : (
                <span className={styles.userName} />
              )}
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
                {displayName ? <p className={styles.userMenuName}>{displayName}</p> : null}
                {userEmail ? <p className={styles.userMenuEmail}>{userEmail}</p> : null}
                <button
                  className={styles.userMenuPrimary}
                  type="button"
                  onClick={handleProfileClick}
                >
                  Мой профиль
                </button>
                <button
                  className={styles.userMenuSecondary}
                  type="button"
                  onClick={handleLogoutClick}
                >
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
