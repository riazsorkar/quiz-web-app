// frontend/src/app/(dashboard)/quizzes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { quizAPI } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { ApiResponse, Quiz } from '@/types/quiz';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  XCircle,
  Star,
  Users,
  Target,
  Zap,
  RefreshCw,
  Grid,
  List,
  Flame
} from 'lucide-react';

const categories = ['All', 'Programming', 'Web Development', 'Database', 'Mathematics', 'Science', 'Business'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const sortOptions = [
  { value: 'newest', label: 'Newest', icon: TrendingUp },
  { value: 'popular', label: 'Most Popular', icon: Flame },
  { value: 'difficulty', label: 'Difficulty', icon: Target }
];

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { showToast } = useToast();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    filterAndSortQuizzes();
  }, [quizzes, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAllQuizzes() as ApiResponse;
      
      if (response.success && response.data) {
        const quizzesData = response.data as Quiz[];
        setQuizzes(quizzesData);
        showToast('Quizzes loaded successfully!', 'success');
      } else {
        setError(response.message || 'Failed to load quizzes');
        showToast('Failed to load quizzes', 'error');
      }
    } catch (error: any) {
      console.error('Failed to fetch quizzes:', error);
      setError(error.message || 'Failed to load quizzes');
      showToast('Failed to load quizzes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortQuizzes = () => {
    let result = [...quizzes];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(quiz => quiz.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      result = result.filter(quiz => quiz.difficulty === selectedDifficulty);
    }

    // Sort quizzes
    result.sort((a, b) => {
      const difficultyOrder = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
} as const;

return difficultyOrder[b.difficulty as keyof typeof difficultyOrder] -
       difficultyOrder[a.difficulty as keyof typeof difficultyOrder];

    });

    setFilteredQuizzes(result);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Programming': 'bg-blue-100 text-blue-800',
      'Web Development': 'bg-green-100 text-green-800',
      'Database': 'bg-purple-100 text-purple-800',
      'Mathematics': 'bg-yellow-100 text-yellow-800',
      'Science': 'bg-red-100 text-red-800',
      'Business': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading awesome quizzes...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Explore All Quizzes</h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Discover quizzes across multiple categories. Challenge yourself and track your progress!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Bar */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{quizzes.length}</div>
              <div className="text-sm text-gray-600">Total Quizzes</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{categories.length - 1}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                {quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(quizzes.reduce((sum, quiz) => sum + quiz.timeLimit, 0) / 60)}
              </div>
              <div className="text-sm text-gray-600">Hours of Content</div>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="mb-8 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                          sortBy === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">Filters:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* Category Filters */}
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Difficulty Filters */}
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedDifficulty === difficulty
                        ? difficulty === 'Easy' ? 'bg-green-600 text-white' :
                          difficulty === 'Medium' ? 'bg-yellow-600 text-white' :
                          difficulty === 'Hard' ? 'bg-red-600 text-white' :
                          'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'Quiz' : 'Quizzes'} Found
              </h2>
              {searchTerm && (
                <p className="text-gray-600 text-sm mt-1">
                  Showing results for "{searchTerm}"
                </p>
              )}
            </div>
            <button
              onClick={fetchQuizzes}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={fetchQuizzes}
                  className="text-red-700 hover:text-red-900"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Quizzes Grid/List */}
          {filteredQuizzes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No quizzes found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm 
                  ? "We couldn't find any quizzes matching your search. Try different keywords or clear filters."
                  : "There are no quizzes available at the moment. Check back soon!"}
              </p>
              <div className="space-x-3">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedDifficulty('All');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
                >
                  Clear All Filters
                </button>
                <Link
                  href="/categories"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  {/* Quiz Image/Header */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-500">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getCategoryColor(quiz.category)}`}>
                        {quiz.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {quiz.description}
                    </p>

                    {/* Quiz Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {quiz.questions?.length || 0} Qs
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {quiz.timeLimit} mins
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {quiz.passingScore}% pass
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/quiz/${quiz.id}`}
                      className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium flex items-center justify-center group-hover:shadow-lg transition-all"
                    >
                      Start Quiz
                      <Zap className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredQuizzes.map((quiz) => (
                <div 
                  key={quiz.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getCategoryColor(quiz.category)}`}>
                          {quiz.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {quiz.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {quiz.questions?.length || 0} questions
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {quiz.timeLimit} minutes
                        </span>
                        <span className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          Passing score: {quiz.passingScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Link
                        href={`/quiz/${quiz.id}`}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium whitespace-nowrap"
                      >
                        Start Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination (Placeholder) */}
          {filteredQuizzes.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Categories CTA */}
          <div className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Can't find what you're looking for?</h3>
                <p className="text-blue-100">
                  Browse quizzes by specific categories or suggest new ones!
                </p>
              </div>
              <Link
                href="/categories"
                className="mt-4 md:mt-0 px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-semibold"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}