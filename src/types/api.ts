// API Types based on documentation

export interface ApiError {
  message: string;
}

// Auth Types
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// User Types
export interface User {
  email: string;
  selectedCourses: string[];
}

// Course Types
export interface Course {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  workouts: string[];
  difficulty?: string;
  durationInDays?: number;
  dailyDurationInMinutes?: {
    from: number;
    to: number;
  };
  order?: number;
}

export interface CourseWorkout {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

// Exercise Types
export interface Exercise {
  name: string;
  quantity: number;
  _id: string;
}

// Workout Types
export interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

// Progress Types
export interface WorkoutProgress {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}

export interface CourseProgress {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
}

export interface SingleWorkoutProgress {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}

// Request Types
export interface AddCourseRequest {
  courseId: string;
}

export interface UpdateProgressRequest {
  progressData: number[];
}

// Response Types
export interface SuccessMessageResponse {
  message: string;
}
