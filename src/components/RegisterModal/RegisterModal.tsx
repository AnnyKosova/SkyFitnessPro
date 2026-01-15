"use client";

import Image from "next/image";
import styles from "./RegisterModal.module.css";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
  showError?: boolean;
  errorMessage?: string;
};

export default function RegisterModal({
  isOpen,
  onClose,
  onLoginClick,
  showError = false,
  errorMessage,
}: RegisterModalProps) {
  if (!isOpen) {
    return null;
  }

  const modalClassName = `${styles.modal} ${showError ? styles.modalError : ""}`.trim();
  const emailInputClassName = `${styles.input} ${showError ? styles.inputError : ""}`.trim();
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
            className={emailInputClassName}
            type="email"
            name="email"
            placeholder="Эл. почта"
            autoComplete="email"
          />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Пароль"
            autoComplete="new-password"
          />
          <input
            className={styles.input}
            type="password"
            name="passwordRepeat"
            placeholder="Повторите пароль"
            autoComplete="new-password"
          />
          {showError && (
            <p className={styles.errorMessage}>
              {errorMessage ? (
                errorMessage
              ) : (
                <>
                  Данная почта уже используется.
                  <br />
                  Попробуйте войти.
                </>
              )}
            </p>
          )}
          <button className={primaryButtonClassName} type="button">
            Зарегистрироваться
          </button>
          <button className={styles.secondaryButton} type="button" onClick={onLoginClick}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
