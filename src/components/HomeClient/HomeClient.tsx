"use client";

import AuthModal from "@/components/AuthModal/AuthModal";
import CoursesSection from "@/components/CoursesSection/CoursesSection";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import RegisterModal from "@/components/RegisterModal/RegisterModal";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validatePassword, validatePasswordMatch } from "@/utils/authValidation";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function HomeClient() {
  const { user, isAuthenticated, login, register } = useAuth();
  const IS_AUTH_PREVIEW = false;
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    document.body.classList.remove("noScroll");
  }, []);

  const handleOpenAuth = useCallback(() => {
    setIsRegisterOpen(false);
    setRegisterError(null);
    setAuthError(null);
    setIsAuthOpen(true);
  }, []);

  useEffect(() => {
    if (searchParams.get("auth") === "1") {
      handleOpenAuth();
    }
  }, [handleOpenAuth, searchParams]);

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
      return "Сергей";
    }
    const name = user.email.split("@")[0];
    return name || "Сергей";
  }, [user?.email]);

  return (
    <>
      <Header
        onLoginClick={handleOpenAuth}
        isAuthenticated={IS_AUTH_PREVIEW || isAuthenticated}
        userName={userName}
      />
      <main>
        <HeroSection />
        <CoursesSection />
      </main>
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
