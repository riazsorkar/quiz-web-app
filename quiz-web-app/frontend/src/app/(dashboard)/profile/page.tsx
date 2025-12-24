// frontend/src/app/(dashboard)/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  TrendingUp,
  BarChart3,
  Clock,
  Edit2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { quizAPI } from '@/lib/api';
import { QuizResult, ApiResponse } from '@/types/quiz';

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  score: number;
  avatarColor?: string;
  totalQuizzesTaken?: number;
  quizzesPassed?: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Fetch user results
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await quizAPI.getMyResults() as ApiResponse<QuizResult[]>;
      if (response.success && response.data) {
        setResults(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    if (results.length === 0) {
      return {
        averageScore: 0,
        totalTimeSpent: 0,
        bestScore: 0,
        completionRate: 0
      };
    }

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalTime = results.reduce((sum, r) => sum + r.timeTaken, 0);
    const bestScore = Math.max(...results.map(r => r.score));
    const passedQuizzes = results.filter(r => r.passed).length;

    return {
      averageScore: Math.round(totalScore / results.length),
      totalTimeSpent: Math.round(totalTime / 60), // in minutes
      bestScore: bestScore,
      completionRate: Math.round((passedQuizzes / results.length) * 100)
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg"
                style={{ backgroundColor: user?.avatarColor || '#4F46E5' }}
              >
                {user?.firstName?.charAt(0).toUpperCase()}
                {user?.lastName?.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {user?.firstName} {user?.lastName}
                </h1>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-indigo-100">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    <span>Score: {user?.score || 0} points</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Member since: Today</span>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {user?.roles?.map((role, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                    >
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Edit Button */}
              <button className="px-6 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium flex items-center">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Average Score</p>
                      <p className="text-3xl font-bold mt-1">{stats.averageScore}%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Best Score</p>
                      <p className="text-3xl font-bold mt-1">{stats.bestScore}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Time Spent</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalTimeSpent} min</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Completion Rate</p>
                      <p className="text-3xl font-bold mt-1">{stats.completionRate}%</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Quiz History */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-gray-800">Quiz History</h3>
                  <p className="text-gray-600 text-sm mt-1">Your recent quiz attempts</p>
                </div>
                
                <div className="p-6">
                  {results.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No quiz results yet.</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Take your first quiz to see your history here!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Quiz #{result.quizId}
                            </h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <span>{result.correctAnswers}/{result.totalQuestions} correct</span>
                              <span>Time: {Math.round(result.timeTaken / 60)} min</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.score}%
                            </div>
                            {result.passed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements and Info */}
            <div className="space-y-6">
              {/* Account Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Account Type</label>
                    <p className="font-medium">Student</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Member Since</label>
                    <p className="font-medium">Today</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-4">🏆 Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">First Quiz</p>
                      <p className="text-yellow-100 text-sm">Complete your first quiz</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold">5</span>
                    </div>
                    <div>
                      <p className="font-medium">Quiz Master</p>
                      <p className="text-yellow-100 text-sm">Complete 5 quizzes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold">A+</span>
                    </div>
                    <div>
                      <p className="font-medium">Perfect Score</p>
                      <p className="text-yellow-100 text-sm">Score 100% on any quiz</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                    <p className="font-medium text-blue-800">Change Password</p>
                  </button>
                  <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition">
                    <p className="font-medium text-green-800">Update Profile Picture</p>
                  </button>
                  <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                    <p className="font-medium text-purple-800">View Certificates</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}