// frontend/src/types/quiz.ts
export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string; // Changed from union type to string
  timeLimit: number;
  passingScore: number;
  totalQuestions?: number;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOptionIndex?: number;
  explanation?: string;
}

export interface QuizSubmission {
  quizId: number;
  answers: Answer[];
  timeTaken: number;
}

export interface Answer {
  questionId: number;
  selectedOption: number;
}

export interface QuizResult {
  quizId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  passed: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}