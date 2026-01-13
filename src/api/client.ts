import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/fitness";

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - добавляет токен к запросам
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - обрабатывает ошибки и обновляет токен
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Если ошибка 401 и запрос еще не повторялся
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Пытаемся обновить токен
            const newToken = await this.refreshToken();
            if (newToken) {
              this.setToken(newToken);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Если обновление токена не удалось, очищаем токен
            this.clearToken();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
  }

  private clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
  }

  private async refreshToken(): Promise<string | null> {
    // Если уже есть запрос на обновление токена, ждем его
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    // Создаем новый запрос на обновление токена
    this.refreshTokenPromise = (async () => {
      try {
        const token = this.getToken();
        if (!token) {
          return null;
        }

        // Если API предоставляет endpoint для обновления токена, используйте его здесь
        // Например: POST /api/fitness/auth/refresh с текущим токеном
        // Пока что возвращаем null, что приведет к редиректу на логин
        // TODO: Если API предоставляет refresh endpoint, реализовать его здесь
        return null;
      } catch (error) {
        return null;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public clearAuth(): void {
    this.clearToken();
  }
}

export const apiClient = new ApiClient();
