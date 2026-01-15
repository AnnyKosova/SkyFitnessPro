"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import CoursesSection from "@/components/CoursesSection/CoursesSection";
import AuthModal from "@/components/AuthModal/AuthModal";
import RegisterModal from "@/components/RegisterModal/RegisterModal";

export default function HomeClient() {
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

  return (
    <>
      <Header onLoginClick={handleOpenAuth} />
      <main>
        <HeroSection />
        <CoursesSection />
      </main>
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleCloseAuth}
        onRegisterClick={handleOpenRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
        onLoginClick={handleOpenAuth}
      />
    </>
  );
}
