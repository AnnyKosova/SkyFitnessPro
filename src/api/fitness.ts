import type {
  AddCourseRequest,
  ApiError,
  Course,
  CourseProgress,
  CourseWorkout,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SingleWorkoutProgress,
  SuccessMessageResponse,
  UpdateProgressRequest,
  User,
  Workout,
} from "@/types/api";
import { apiClient } from "./client";

const postPlain = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await apiClient.getClient().post<T>(url, JSON.stringify(data), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
};

const patchPlain = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await apiClient.getClient().patch<T>(url, JSON.stringify(data), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
};

// Auth API
export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return postPlain<RegisterResponse>("/auth/register", data);
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await postPlain<LoginResponse>("/auth/login", data);
    const { token } = response;
    if (typeof window !== "undefined") {
      apiClient.setAuthToken(token);
    }
    return response;
  },
};

// User API
export const userApi = {
  getMe: async (): Promise<User> => {
    const response = await apiClient.getClient().get<User | { user: User }>("/users/me");
    const data = response.data as User | { user: User };
    if (typeof data === "object" && data !== null && "user" in data) {
      return (data as { user: User }).user;
    }
    return data as User;
  },

  addCourse: async (data: AddCourseRequest): Promise<SuccessMessageResponse> => {
    return postPlain<SuccessMessageResponse>("/users/me/courses", data);
  },

  removeCourse: async (courseId: string): Promise<SuccessMessageResponse> => {
    const response = await apiClient
      .getClient()
      .delete<SuccessMessageResponse>(`/users/me/courses/${courseId}`);
    return response.data;
  },

  getCourseProgress: async (courseId: string): Promise<CourseProgress> => {
    const response = await apiClient
      .getClient()
      .get<CourseProgress>(`/users/me/progress?courseId=${courseId}`);
    return response.data;
  },

  getWorkoutProgress: async (
    courseId: string,
    workoutId: string
  ): Promise<SingleWorkoutProgress> => {
    const response = await apiClient
      .getClient()
      .get<SingleWorkoutProgress>(`/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`);
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
    const response = await apiClient
      .getClient()
      .get<CourseWorkout[]>(`/courses/${courseId}/workouts`);
    return response.data;
  },

  resetProgress: async (courseId: string): Promise<SuccessMessageResponse> => {
    const response = await apiClient
      .getClient()
      .patch<SuccessMessageResponse>(`/courses/${courseId}/reset`);
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
    return patchPlain<SuccessMessageResponse>(`/courses/${courseId}/workouts/${workoutId}`, data);
  },

  resetProgress: async (courseId: string, workoutId: string): Promise<SuccessMessageResponse> => {
    const response = await apiClient
      .getClient()
      .patch<SuccessMessageResponse>(`/courses/${courseId}/workouts/${workoutId}/reset`);
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
