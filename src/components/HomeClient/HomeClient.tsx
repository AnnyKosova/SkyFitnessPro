"use client";

import AuthModal from "@/components/AuthModal/AuthModal";
import CoursesSection from "@/components/CoursesSection/CoursesSection";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import RegisterModal from "@/components/RegisterModal/RegisterModal";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function HomeClient() {
  const { user, isAuthenticated } = useAuth();
  const IS_AUTH_PREVIEW = false;
  const IS_AUTH_ERROR_PREVIEW = false;
  const IS_REGISTER_ERROR_PREVIEW = false;
  const [isAuthOpen, setIsAuthOpen] = useState(IS_AUTH_ERROR_PREVIEW);
  const [isRegisterOpen, setIsRegisterOpen] = useState(IS_REGISTER_ERROR_PREVIEW);

  useEffect(() => {
    document.body.classList.remove("noScroll");
  }, []);

  const handleOpenAuth = useCallback(() => {
    setIsRegisterOpen(false);
    setIsAuthOpen(true);
  }, []);

  const handleOpenRegister = useCallback(() => {
    setIsAuthOpen(false);
    setIsRegisterOpen(true);
  }, []);

  const handleCloseAuth = useCallback(() => {
    setIsAuthOpen(false);
  }, []);

  const handleCloseRegister = useCallback(() => {
    setIsRegisterOpen(false);
  }, []);

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
        showError={IS_AUTH_ERROR_PREVIEW}
        errorMessage={"Пароль введен неверно,\nпопробуйте еще раз."}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
        onLoginClick={handleOpenAuth}
        showError={IS_REGISTER_ERROR_PREVIEW}
      />
    </>
  );
}
