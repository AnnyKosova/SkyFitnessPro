"use client";

import { useCallback, useMemo, useState } from "react";
import Header from "@/components/Header/Header";
import AuthModal from "@/components/AuthModal/AuthModal";
import RegisterModal from "@/components/RegisterModal/RegisterModal";
import { useAuth } from "@/context/AuthContext";
import CoursePage from "./CoursePage";

type CoursePageClientProps = {
  title: string;
  heroImageSrc: string;
};

export default function CoursePageClient({ title, heroImageSrc }: CoursePageClientProps) {
  const { user, isAuthenticated } = useAuth();
  const IS_AUTH_PREVIEW = false;
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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
      <CoursePage title={title} heroImageSrc={heroImageSrc} />
      <AuthModal isOpen={isAuthOpen} onClose={handleCloseAuth} onRegisterClick={handleOpenRegister} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
        onLoginClick={handleOpenAuth}
      />
    </>
  );
}
