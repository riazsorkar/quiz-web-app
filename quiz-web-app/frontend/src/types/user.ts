// frontend/src/types/user.ts
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  score: number;
  avatarColor?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    type: string;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    score: number;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}