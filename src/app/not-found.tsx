"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import styles from "./not-found.module.css";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <Header onLoginClick={() => router.push("/")} />
      <main className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.title}>Страница не найдена</p>
        <button className={styles.homeButton} type="button" onClick={() => router.push("/")}>
          На главную
        </button>
      </main>
    </div>
  );
}
