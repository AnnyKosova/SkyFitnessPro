"use client";

import { apiClient } from "@/api/client";
import { authApi, getErrorMessage, userApi } from "@/api/fitness";
import type { LoginRequest, RegisterRequest, User } from "@/types/api";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const retryCountRef = useRef(0);

  const loadCachedUser = () => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  };

  const saveCachedUser = (value: User | null) => {
    if (typeof window === "undefined") return;
    if (!value) {
      localStorage.removeItem("user");
      return;
    }
    localStorage.setItem("user", JSON.stringify(value));
  };

  const refreshUser = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userData = await userApi.getMe();
      setUser(userData);
      saveCachedUser(userData);
    } catch (error) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response?.status === "number"
          ? (error as { response?: { status?: number } }).response?.status
          : null;
      if (status === 401) {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        saveCachedUser(null);
      } else if (retryCountRef.current < 1) {
        retryCountRef.current += 1;
        if (typeof window !== "undefined") {
          window.setTimeout(() => {
            refreshUser();
          }, 800);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Загружаем пользователя только если есть токен
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const cached = loadCachedUser();
        if (cached) {
          setUser(cached);
        }
        refreshUser();
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        await authApi.login(data);
        await refreshUser();
      } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
      }
    },
    [refreshUser]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        await authApi.register(data);
        // После регистрации автоматически логинимся
        await login({ email: data.email, password: data.password });
      } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    apiClient.clearAuth();
    setUser(null);
    saveCachedUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
