"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, userApi, getErrorMessage } from "@/api/fitness";
import type { User, LoginRequest, RegisterRequest } from "@/types/api";
import { apiClient } from "@/api/client";

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
    } catch (error) {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
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
        refreshUser();
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = useCallback(async (data: LoginRequest) => {
    try {
      await authApi.login(data);
      await refreshUser();
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message);
    }
  }, [refreshUser]);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      await authApi.register(data);
      // После регистрации автоматически логинимся
      await login({ email: data.email, password: data.password });
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message);
    }
  }, [login]);

  const logout = useCallback(() => {
    apiClient.clearAuth();
    setUser(null);
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
