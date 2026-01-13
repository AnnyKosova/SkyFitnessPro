import { apiClient } from "./client";
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  User,
  Course,
  CourseWorkout,
  Workout,
  CourseProgress,
  SingleWorkoutProgress,
  AddCourseRequest,
  UpdateProgressRequest,
  SuccessMessageResponse,
  ApiError,
} from "@/types/api";

// Auth API
export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.getClient().post<RegisterResponse>(
      "/auth/register",
      data
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.getClient().post<LoginResponse>("/auth/login", data);
    const { token } = response.data;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    return response.data;
  },
};

// User API
export const userApi = {
  getMe: async (): Promise<User> => {
    const response = await apiClient.getClient().get<User>("/users/me");
    return response.data;
  },

  addCourse: async (data: AddCourseRequest): Promise<SuccessMessageResponse> => {
    const response = await apiClient.getClient().post<SuccessMessageResponse>(
      "/users/me/courses",
      data
    );
    return response.data;
  },

  removeCourse: async (courseId: string): Promise<SuccessMessageResponse> => {
    const response = await apiClient.getClient().delete<SuccessMessageResponse>(
      `/users/me/courses/${courseId}`
    );
    return response.data;
  },

  getCourseProgress: async (courseId: string): Promise<CourseProgress> => {
    const response = await apiClient.getClient().get<CourseProgress>(
      `/users/me/progress?courseId=${courseId}`
    );
    return response.data;
  },

  getWorkoutProgress: async (
    courseId: string,
    workoutId: string
  ): Promise<SingleWorkoutProgress> => {
    const response = await apiClient.getClient().get<SingleWorkoutProgress>(
      `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`
    );
    return response.data;
  },
};

// Courses API
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const response = await apiClient.getClient().get<Course[]>("/courses");
    return response.data;
  },

  getById: async (courseId: string): Promise<Course> => {
    const response = await apiClient.getClient().get<Course>(`/courses/${courseId}`);
    return response.data;
  },

  getWorkouts: async (courseId: string): Promise<CourseWorkout[]> => {
    const response = await apiClient.getClient().get<CourseWorkout[]>(
      `/courses/${courseId}/workouts`
    );
    return response.data;
  },

  resetProgress: async (courseId: string): Promise<SuccessMessageResponse> => {
    const response = await apiClient.getClient().patch<SuccessMessageResponse>(
      `/courses/${courseId}/reset`
    );
    return response.data;
  },
};

// Workouts API
export const workoutsApi = {
  getById: async (workoutId: string): Promise<Workout> => {
    const response = await apiClient.getClient().get<Workout>(`/workouts/${workoutId}`);
    return response.data;
  },

  updateProgress: async (
    courseId: string,
    workoutId: string,
    data: UpdateProgressRequest
  ): Promise<SuccessMessageResponse> => {
    const response = await apiClient.getClient().patch<SuccessMessageResponse>(
      `/courses/${courseId}/workouts/${workoutId}`,
      data
    );
    return response.data;
  },

  resetProgress: async (
    courseId: string,
    workoutId: string
  ): Promise<SuccessMessageResponse> => {
    const response = await apiClient.getClient().patch<SuccessMessageResponse>(
      `/courses/${courseId}/workouts/${workoutId}/reset`
    );
    return response.data;
  },
};

// Error handling helper
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: ApiError } };
    return axiosError.response?.data?.message || "Произошла ошибка";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Произошла неизвестная ошибка";
};
