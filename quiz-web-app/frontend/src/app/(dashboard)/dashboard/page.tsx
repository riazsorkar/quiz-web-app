// frontend/src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  ArrowRight,
  BookOpen,
  TrendingUp,
  Award,
  RefreshCw
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { quizAPI } from '@/lib/api';
import { Quiz, QuizResult, ApiResponse } from '@/types/quiz';

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  score: number;
  totalQuizzesTaken?: number;
  quizzesPassed?: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState({
    user: true,
    quizzes: true,
    results: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    setLoading(prev => ({ ...prev, user: false }));
    
    // Fetch quizzes from API
    fetchQuizzes();
    
    // Fetch user results
    fetchResults();
  }, []);

  // Update the fetchQuizzes function in the Dashboard page:
const fetchQuizzes = async () => {
  try {
    const response = await quizAPI.getAllQuizzes() as ApiResponse;
    if (response.success && response.data) {
      const quizzesData = response.data as Quiz[];
      setQuizzes(quizzesData.slice(0, 4)); // Show only 4 on dashboard
    }
  } catch (error: any) {
    console.error('Failed to fetch quizzes:', error);
    setError('Failed to load quizzes. Please try again.');
    
    // Fallback to mock data if API fails
    setQuizzes(getMockQuizzes());
  } finally {
    setLoading(prev => ({ ...prev, quizzes: false }));
  }
};

// Update the fetchResults function:
const fetchResults = async () => {
  try {
    const response = await quizAPI.getMyResults() as ApiResponse;
    if (response.success && response.data) {
      const resultsData = response.data as QuizResult[];
      setResults(resultsData);
    }
  } catch (error: any) {
    console.error('Failed to fetch results:', error);
    // Continue without results for now
  } finally {
    setLoading(prev => ({ ...prev, results: false }));
  }
};

  const getMockQuizzes = (): Quiz[] => [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Test your basic JavaScript knowledge',
      category: 'Programming',
      difficulty: 'Easy',
      timeLimit: 15,
      passingScore: 70,
      totalQuestions: 5,
      questions: []
    },
    {
      id: 2,
      title: 'HTML Fundamentals',
      description: 'Basic HTML tags and structure',
      category: 'Web Development',
      difficulty: 'Easy',
      timeLimit: 10,
      passingScore: 60,
      totalQuestions: 3,
      questions: []
    }
  ];

  const getCompletedQuizzes = () => {
    return results.filter(r => r.passed).length;
  };

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + r.score, 0);
    return Math.round(total / results.length);
  };

  const isLoading = loading.user || loading.quizzes || loading.results;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-blue-100 mt-2">
                  Ready to test your knowledge and climb the leaderboard?
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">Your Score: {user?.score || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => {
                    setError('');
                    fetchQuizzes();
                  }}
                  className="text-red-700 hover:text-red-900"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Quizzes Taken</p>
                  <p className="text-2xl font-bold mt-1">{user?.totalQuizzesTaken || 0}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Quizzes Passed</p>
                  <p className="text-2xl font-bold mt-1">{user?.quizzesPassed || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="text-2xl font-bold mt-1">{getAverageScore()}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Current Streak</p>
                  <p className="text-2xl font-bold mt-1">{results.length > 0 ? '3' : '0'} days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Recent Activity and Available Quizzes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Quizzes */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Available Quizzes</h2>
                      <p className="text-gray-600 text-sm mt-1">Pick a quiz and start learning</p>
                    </div>
                    <button
                      onClick={fetchQuizzes}
                      className="p-2 text-gray-500 hover:text-blue-600"
                      title="Refresh quizzes"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {quizzes.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No quizzes available yet.</p>
                      <button
                        onClick={fetchQuizzes}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quizzes.map((quiz) => {
                        const quizResult = results.find(r => r.quizId === quiz.id);
                        const completed = !!quizResult;
                        
                        return (
                          <div 
                            key={quiz.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-bold text-lg text-gray-800">{quiz.title}</h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                    quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {quiz.difficulty}
                                  </span>
                                </div>
                                <p className="text-gray-600 mt-1">{quiz.description}</p>
                                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    {quiz.totalQuestions} questions
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {quiz.timeLimit} mins
                                  </span>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {quiz.category}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                {completed ? (
                                  <>
                                    <div className="flex items-center space-x-1 text-green-600">
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="font-medium">Completed</span>
                                    </div>
                                    <div className="text-sm bg-green-50 px-3 py-1 rounded">
                                      Score: <span className="font-bold">{quizResult.score}%</span>
                                    </div>
                                  </>
                                ) : (
                                  <Link
                                    href={`/quiz/${quiz.id}`}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                  >
                                    Start Quiz
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="mt-6 text-center">
                    <Link
                      href="/quizzes"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all quizzes
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats and Actions */}
            <div className="space-y-6">
              {/* Recent Results */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Results</h3>
                {results.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No quiz results yet.</p>
                    <Link
                      href="/quizzes"
                      className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Take your first quiz!
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.slice(0, 3).map((result, index) => {
                      const quiz = quizzes.find(q => q.id === result.quizId);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">
                              {quiz?.title || `Quiz ${result.quizId}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {result.correctAnswers}/{result.totalQuestions} correct
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.score}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/leaderboard"
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                  >
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium">View Leaderboard</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                  >
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium">Your Profile</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-green-600" />
                  </Link>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-3">💡 Pro Tip</h3>
                <p className="text-blue-100 text-sm">
                  Complete quizzes to earn points! Each correct answer gives you 10 points.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}