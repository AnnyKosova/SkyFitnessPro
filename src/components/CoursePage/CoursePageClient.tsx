"use client";

import { coursesApi } from "@/api/fitness";
import AuthModal from "@/components/AuthModal/AuthModal";
import Header from "@/components/Header/Header";
import RegisterModal from "@/components/RegisterModal/RegisterModal";
import { useAuth } from "@/context/AuthContext";
import type { Course } from "@/types/api";
import { validateEmail, validatePassword, validatePasswordMatch } from "@/utils/authValidation";
import { useCallback, useEffect, useMemo, useState } from "react";
import CoursePage from "./CoursePage";

type CoursePageClientProps = {
  courseId: string;
  title: string;
  heroImageSrc: string;
  heroImageSrcMobile?: string;
};

export default function CoursePageClient({
  courseId,
  title,
  heroImageSrc,
  heroImageSrcMobile,
}: CoursePageClientProps) {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const allCourses = await coursesApi.getAll();
        const match = allCourses.find((item) => {
          const name = item.nameEN || item.nameRU;
          const normalized = name
            .toLowerCase()
            .replace(/[^a-zа-я0-9]+/gi, "-")
            .replace(/^-+|-+$/g, "");
          return normalized === courseId;
        });
        if (!match) {
          return;
        }
        const details = await coursesApi.getById(match._id);
        if (isMounted) {
          setCourse(details);
        }
      } catch {
        if (isMounted) {
          setCourse(null);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const handleOpenAuth = useCallback(() => {
    setIsRegisterOpen(false);
    setRegisterError(null);
    setAuthError(null);
    setIsAuthOpen(true);
  }, []);

  const handleOpenRegister = useCallback(() => {
    setIsAuthOpen(false);
    setAuthError(null);
    setRegisterError(null);
    setIsRegisterOpen(true);
  }, []);

  const handleCloseAuth = useCallback(() => {
    setIsAuthOpen(false);
  }, []);

  const handleCloseRegister = useCallback(() => {
    setIsRegisterOpen(false);
  }, []);

  const handleLogin = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        setAuthError(null);
        setIsAuthSubmitting(true);
        await login({ email: data.email, password: data.password });
        setIsAuthOpen(false);
      } catch (error) {
        setAuthError("Пароль введен неверно,\nпопробуйте еще раз.");
      } finally {
        setIsAuthSubmitting(false);
      }
    },
    [login]
  );

  const handleRegister = useCallback(
    async (data: { email: string; password: string; passwordRepeat: string }) => {
      const emailError = validateEmail(data.email);
      if (emailError) {
        setRegisterError(emailError);
        return;
      }
      const passwordError = validatePassword(data.password);
      if (passwordError) {
        setRegisterError(passwordError);
        return;
      }
      const matchError = validatePasswordMatch(data.password, data.passwordRepeat);
      if (matchError) {
        setRegisterError(matchError);
        return;
      }

      try {
        setRegisterError(null);
        setIsRegisterSubmitting(true);
        await register({ email: data.email, password: data.password });
        setIsRegisterOpen(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Произошла ошибка";
        setRegisterError(message);
      } finally {
        setIsRegisterSubmitting(false);
      }
    },
    [register]
  );

  const userName = useMemo(() => {
    if (!user?.email) {
      return "";
    }
    const name = user.email.split("@")[0];
    return name || "";
  }, [user?.email]);

  return (
    <>
      <Header
        onLoginClick={handleOpenAuth}
        isAuthenticated={isAuthenticated}
        userName={userName}
        userEmail={user?.email}
        onLogout={logout}
      />
      <CoursePage
        title={course?.nameRU ?? title}
        heroImageSrc={heroImageSrc}
        heroImageSrcMobile={heroImageSrcMobile}
        directions={course?.directions}
        fitting={course?.fitting}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleCloseAuth}
        onRegisterClick={handleOpenRegister}
        showError={!!authError}
        errorMessage={authError ?? undefined}
        isSubmitting={isAuthSubmitting}
        onSubmit={handleLogin}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
        onLoginClick={handleOpenAuth}
        showError={!!registerError}
        errorMessage={registerError ?? undefined}
        isSubmitting={isRegisterSubmitting}
        onSubmit={handleRegister}
      />
    </>
  );
}
