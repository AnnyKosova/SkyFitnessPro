import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
