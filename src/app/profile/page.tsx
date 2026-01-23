"use client";

import Header from "@/components/Header/Header";
import ProfilePageClient from "@/components/ProfilePage/ProfilePageClient";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();

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
        isAuthenticated={isAuthenticated}
        userName={userName}
        userEmail={user?.email}
        onLogout={logout}
        hideTagline
      />
      <ProfilePageClient />
    </>
  );
}
