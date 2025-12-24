// frontend/src/lib/api.ts
import axios, { AxiosResponse } from 'axios';
import { ApiResponse, Quiz } from '@/types/quiz';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the data directly for easier access
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API calls
export const authAPI = {
  login: (email: string, password: string): Promise<ApiResponse> =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse> => api.post('/auth/register', userData),
};

// Quiz API calls
export const quizAPI = {
  // Get all quizzes
  getAllQuizzes: (): Promise<ApiResponse> =>
    api.get('/quiz/all'),
  
  // Get quiz by ID
  getQuizById: (quizId: number): Promise<ApiResponse> => 
    api.get(`/quiz/${quizId}`),
  
  // Get quizzes by category
  getQuizzesByCategory: (category: string): Promise<ApiResponse> => 
    api.get(`/quiz/category/${category}`),
  
  // Submit quiz
  submitQuiz: (submission: {
    quizId: number;
    answers: Array<{ questionId: number; selectedOption: number }>;
    timeTaken: number;
  }): Promise<ApiResponse> => api.post('/quiz/submit', submission),
  
  // Get user's quiz results
  getMyResults: (): Promise<ApiResponse> => api.get('/quiz/my-results'),
  
  // Test endpoint
  test: (): Promise<ApiResponse> => api.get('/quiz/test'),
};




// Update adminAPI section
export const adminAPI = {
  // Get all users
  getAllUsers: (): Promise<ApiResponse> => api.get('/admin/users'),
  
  // Get all quizzes (admin version)
  getAllQuizzes: (): Promise<ApiResponse> => api.get('/admin/quizzes'),
  
  // Get quiz by ID (admin version)
  getQuiz: (quizId: number): Promise<ApiResponse> => 
    api.get(`/admin/quiz/${quizId}`),
  
  // Create quiz
  createQuiz: (quizData: Quiz): Promise<ApiResponse> => 
    api.post('/admin/quiz', quizData),
  
  // Update quiz
  updateQuiz: (quizId: number, quizData: Partial<Quiz>): Promise<ApiResponse> => 
    api.put(`/admin/quiz/${quizId}`, quizData),
  
  // Delete quiz
  deleteQuiz: (quizId: number): Promise<ApiResponse> => 
    api.delete(`/admin/quiz/${quizId}`),
  
  // Get all results
  getAllResults: (): Promise<ApiResponse> => api.get('/admin/results'),
  
  // Get stats
  getStats: (): Promise<ApiResponse> => api.get('/admin/stats'),
  
  // Delete user
  deleteUser: (userId: number): Promise<ApiResponse> => 
    api.delete(`/admin/user/${userId}`),
  
  // Test endpoint
  test: (): Promise<ApiResponse> => api.get('/admin/test'),
};



export default api;