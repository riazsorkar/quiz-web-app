// Replace the entire admin page with this complete version
'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import QuizForm from '@/components/QuizForm';
import { adminAPI, quizAPI } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { ApiResponse, Quiz } from '@/types/quiz';
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  User,
  BarChart3,
  Clock,
  Shield,
  RefreshCw,
  Search,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  score: number;
  quizzesTaken: number;
  quizzesPassed: number;
  avatarColor: string;
  createdAt: string;
}

interface StatsData {
  totalUsers: number;
  totalQuizzes: number;
  totalQuestions: number;
  averageUserScore: number;
  recentQuizzes: number;
  recentUsers: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState({
    users: true,
    quizzes: true,
    stats: true
  });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'quizzes' | 'stats' | 'results'>('stats');
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  
  const { showToast } = useToast();

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchQuizzes();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats() as ApiResponse;
      if (response.success && response.data) {
        setStats(response.data as StatsData);
      }
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      showToast('Failed to load statistics', 'error');
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers() as ApiResponse;
      if (response.success && response.data) {
        setUsers(response.data as UserData[]);
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await adminAPI.getAllQuizzes() as ApiResponse;
      if (response.success && response.data) {
        setQuizzes(response.data as Quiz[]);
      }
    } catch (error: any) {
      console.error('Failed to fetch quizzes:', error);
      showToast('Failed to load quizzes', 'error');
    } finally {
      setLoading(prev => ({ ...prev, quizzes: false }));
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const response = await adminAPI.deleteUser(userId) as ApiResponse;
      if (response.success) {
        setUsers(users.filter(user => user.id !== userId));
        showToast('User deleted successfully!', 'success');
        fetchStats();
      }
    } catch (error: any) {
      showToast('Failed to delete user: ' + error.message, 'error');
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm('Are you sure you want to delete this quiz? All questions and results will be deleted.')) return;
    
    try {
      const response = await adminAPI.deleteQuiz(quizId) as ApiResponse;
      if (response.success) {
        setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
        showToast('Quiz deleted successfully!', 'success');
        fetchStats();
      }
    } catch (error: any) {
      showToast('Failed to delete quiz: ' + error.message, 'error');
    }
  };

  const handleCreateQuiz = async (quizData: Quiz) => {
    setFormLoading(true);
    try {
      const response = await adminAPI.createQuiz(quizData) as ApiResponse;
      if (response.success) {
        showToast('Quiz created successfully!', 'success');
        setShowQuizForm(false);
        fetchQuizzes();
        fetchStats();
      } else {
        showToast(response.message || 'Failed to create quiz', 'error');
      }
    } catch (error: any) {
      showToast('Failed to create quiz: ' + error.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateQuiz = async (quizData: Quiz) => {
    setFormLoading(true);
    try {
      const response = await adminAPI.updateQuiz(quizData.id, quizData) as ApiResponse;
      if (response.success) {
        showToast('Quiz updated successfully!', 'success');
        setShowQuizForm(false);
        setEditingQuiz(null);
        fetchQuizzes();
      } else {
        showToast(response.message || 'Failed to update quiz', 'error');
      }
    } catch (error: any) {
      showToast('Failed to update quiz: ' + error.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditQuiz = async (quizId: number) => {
    try {
      const response = await adminAPI.getQuiz(quizId) as ApiResponse;
      if (response.success && response.data) {
        setEditingQuiz(response.data as Quiz);
        setShowQuizForm(true);
      }
    } catch (error: any) {
      showToast('Failed to load quiz: ' + error.message, 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading.stats && loading.users && loading.quizzes) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="h-8 w-8" />
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>
                <p className="text-purple-100">
                  Manage users, quizzes, and view system statistics
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">
                  Total Users: {stats?.totalUsers || 0}
                </span>
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
                    fetchStats();
                    fetchUsers();
                    fetchQuizzes();
                  }}
                  className="text-red-700 hover:text-red-900"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'stats'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Statistics
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Users ({users.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'quizzes'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Quizzes ({quizzes.length})
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Statistics</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="text-3xl font-bold mt-1">{stats?.totalUsers || 0}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        +{stats?.recentUsers || 0} recently
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Quizzes</p>
                      <p className="text-3xl font-bold mt-1">{stats?.totalQuizzes || 0}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        +{stats?.recentQuizzes || 0} recently
                      </p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Questions</p>
                      <p className="text-3xl font-bold mt-1">{stats?.totalQuestions || 0}</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Avg. User Score</p>
                      <p className="text-3xl font-bold mt-1">{stats?.averageUserScore || 0}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">New user registered</p>
                        <p className="text-sm text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Quiz completed</p>
                        <p className="text-sm text-gray-500">15 minutes ago</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      +50 points
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <div className="text-sm text-gray-500">
                  Showing {users.length} users
                </div>
              </div>

              {users.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quizzes
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                                  style={{ backgroundColor: user.avatarColor }}
                                >
                                  {user.firstName.charAt(0)}
                                  {user.lastName.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-lg font-bold text-gray-900">
                                {user.score}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.quizzesPassed}/{user.quizzesTaken}
                              </div>
                              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ 
                                    width: `${user.quizzesTaken > 0 ? (user.quizzesPassed / user.quizzesTaken) * 100 : 0}%` 
                                  }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                                title="Delete User"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quiz Management</h2>
                <button
                  onClick={() => {
                    setEditingQuiz(null);
                    setShowQuizForm(true);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Quiz
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search quizzes by title, description, or category..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {filteredQuizzes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No quizzes found</p>
                  <p className="text-gray-400 text-sm">
                    {searchQuery ? 'Try a different search term' : 'Create your first quiz!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                              {quiz.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {quiz.difficulty}
                              </span>
                              <span className="text-sm text-gray-500">{quiz.category}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {quiz.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {quiz.timeLimit} mins
                          </div>
                          <div>
                            Pass: {quiz.passingScore}%
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {quiz.questions?.length || 0} Qs
                          </div>
                        </div>

                        <div className="flex justify-between space-x-2">
                          <button
                            onClick={() => handleEditQuiz(quiz.id)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quiz Form Modal */}
          {showQuizForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full my-8">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowQuizForm(false);
                        setEditingQuiz(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <QuizForm
                    quiz={editingQuiz}
                    onSubmit={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
                    onCancel={() => {
                      setShowQuizForm(false);
                      setEditingQuiz(null);
                    }}
                    loading={formLoading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}