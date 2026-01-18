"use client";

import Image from "next/image";
import styles from "./AuthModal.module.css";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick?: () => void;
  showError?: boolean;
  errorMessage?: string;
};

export default function AuthModal({
  isOpen,
  onClose,
  onRegisterClick,
  showError = false,
  errorMessage,
}: AuthModalProps) {
  if (!isOpen) {
    return null;
  }

  const modalClassName = `${styles.modal} ${showError ? styles.modalError : ""}`.trim();
  const passwordInputClassName = `${styles.input} ${showError ? styles.inputError : ""}`.trim();
  const primaryButtonClassName = `${styles.primaryButton} ${
    showError ? "" : styles.primaryButtonSpacing
  }`.trim();

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={modalClassName} onClick={(event) => event.stopPropagation()}>
        <Image
          src="/images/logo/logo.svg"
          alt="SkyFitness Pro"
          width={200}
          height={50}
          className={styles.logo}
          priority
        />
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <input
            className={styles.input}
            type="text"
            name="login"
            placeholder="Логин"
            autoComplete="username"
          />
          <input
            className={passwordInputClassName}
            type="password"
            name="password"
            placeholder="Пароль"
            autoComplete="current-password"
          />
          {showError && (
            <p className={styles.errorMessage}>
              {errorMessage ? (
                errorMessage
              ) : (
                <>
                  Пароль введен неверно,
                  <br />
                  попробуйте еще раз.
                </>
              )}
            </p>
          )}
          <button className={primaryButtonClassName} type="button">
            Войти
          </button>
          <button className={styles.secondaryButton} type="button" onClick={onRegisterClick}>
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}

