import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "SkyFitness Pro - Онлайн-тренировки для занятий дома",
  description: "Онлайн-платформа для занятий фитнесом дома",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body style={{ fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
