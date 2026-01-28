"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

type HeaderProps = {
  onLoginClick?: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  hideTagline?: boolean;
};

export default function Header({
  onLoginClick,
  isAuthenticated = false,
  userName,
  userEmail,
  onLogout,
  hideTagline = false,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleProfileClick = useCallback(() => {
    setIsMenuOpen(false);
    router.push("/profile");
  }, [router]);

  const handleLogoutClick = useCallback(() => {
    setIsMenuOpen(false);
    onLogout?.();
  }, [onLogout]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link className={styles.logoLink} href="/">
            <Image
              src="/images/logo/logo.svg"
              alt="SkyFitnessPro"
              width={220}
              height={36}
              className={styles.logo}
              priority
            />
          </Link>
          {!hideTagline && (
            <p className={styles.tagline}>Онлайн-тренировки для занятий дома</p>
          )}
        </div>

        {!isAuthenticated ? (
          onLoginClick ? (
            <button className={styles.loginButton} type="button" onClick={onLoginClick}>
              Войти
            </button>
          ) : null
        ) : (
          <div className={styles.userMenuWrapper} ref={menuRef}>
            <button
              className={styles.userButton}
              type="button"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              <Image
                src="/images/icons/Profile.svg"
                alt=""
                width={24}
                height={24}
                className={styles.userIcon}
              />
              <span className={styles.userName}>{userName || "Пользователь"}</span>
              <Image
                src="/images/icons/Down.svg"
                alt=""
                width={12}
                height={8}
                className={styles.userArrow}
              />
            </button>

            {isMenuOpen && (
              <div className={styles.userMenu} role="menu">
                <p className={styles.userMenuName}>{userName || "Пользователь"}</p>
                {userEmail ? <p className={styles.userMenuEmail}>{userEmail}</p> : null}
                <button
                  className={styles.userMenuPrimary}
                  type="button"
                  onClick={handleProfileClick}
                >
                  Профиль
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
        )}
      </div>
    </header>
  );
}
