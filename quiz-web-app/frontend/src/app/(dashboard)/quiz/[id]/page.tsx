// frontend/src/app/(dashboard)/quiz/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { quizAPI } from '@/lib/api';
import QuizSkeleton from '@/components/QuizSkeleton';
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Quiz, Question, QuizResult, ApiResponse } from '@/types/quiz';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);

  // State
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    fetchQuiz();
  }, [quizId]);


  // Update the fetchQuiz function:
const fetchQuiz = async () => {
  try {
    setLoading(true);
    const response = await quizAPI.getQuizById(quizId) as ApiResponse;
    
    if (response.success && response.data) {
      const quizData = response.data as Quiz;
      setQuiz(quizData);
      setTimeLeft(quizData.timeLimit * 60);
      setSelectedAnswers(new Array(quizData.questions.length).fill(-1));
    } else {
      setError(response.message || 'Failed to load quiz');
    }
  } catch (error: any) {
    console.error('Failed to fetch quiz:', error);
    setError(error.message || 'Failed to load quiz');
  } finally {
    setLoading(false);
  }
};

  // Timer effect
  useEffect(() => {
    if (!quiz || timeLeft <= 0 || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, timeLeft, quizCompleted]);

  // Handle answer selection
  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  // Handle next question
  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Calculate score locally (for display)
  const calculateLocalScore = () => {
    if (!quiz) return 0;
    
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctOptionIndex) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  // Update the handleSubmit function:
const handleSubmit = async () => {
  if (!quiz || quizCompleted) return;
  
  setSubmitting(true);
  
  try {
    // Prepare submission data
    const submission = {
      quizId: quiz.id,
      answers: quiz.questions.map((question, index) => ({
        questionId: question.id,
        selectedOption: selectedAnswers[index]
      })).filter(answer => answer.selectedOption !== -1), // Only include answered questions
      timeTaken: (quiz.timeLimit * 60) - timeLeft // Time taken in seconds
    };
    
    // Submit to backend
    const response = await quizAPI.submitQuiz(submission) as ApiResponse;
    
    if (response.success && response.data) {
      const result = response.data as QuizResult;
      const finalScore = result.score;
      setScore(finalScore);
      setQuizCompleted(true);
      setShowResults(true);
      
      // Update user score in localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.score += result.correctAnswers * 10; // 10 points per correct answer
        localStorage.setItem('user', JSON.stringify(user));
      }
    } else {
      setError(response.message || 'Failed to submit quiz');
    }
  } catch (error: any) {
    console.error('Failed to submit quiz:', error);
    setError(error.message || 'Failed to submit quiz');
    
    // Fallback to local calculation
    const finalScore = calculateLocalScore();
    setScore(finalScore);
    setQuizCompleted(true);
    setShowResults(true);
  } finally {
    setSubmitting(false);
  }
};

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

 if (loading) {
  return (
    <ProtectedRoute>
      <QuizSkeleton />
    </ProtectedRoute>
  );
}

  if (error && !quiz) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">Quiz Not Found</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.push('/quizzes')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!quiz) return null;

  if (showResults) {
    const passed = score >= quiz.passingScore;
    
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Results Header */}
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  passed ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {passed ? (
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-600" />
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h1>
                <p className="text-gray-600">
                  {passed 
                    ? `You passed the "${quiz.title}" quiz!` 
                    : `You need ${quiz.passingScore}% to pass. Try again!`}
                </p>
              </div>

              {/* Score Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{score}%</div>
                  <div className="text-gray-600 mb-4">Your Score</div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className={`h-4 rounded-full ${
                        passed ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0%</span>
                    <span>Passing: {quiz.passingScore}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </button>
                <button
                  onClick={() => {
                    // Reset quiz state
                    setCurrentQuestion(0);
                    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
                    setTimeLeft(quiz.timeLimit * 60);
                    setQuizCompleted(false);
                    setShowResults(false);
                    setScore(0);
                    setError('');
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => router.push('/quizzes')}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Try Another Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Quiz Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <button
                  onClick={() => router.push('/quizzes')}
                  className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Quizzes
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="text-gray-600">{quiz.description}</p>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                {/* Timer */}
                <div className={`flex items-center px-4 py-2 rounded-lg font-mono ${
                  timeLeft < 60 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
                </div>
                
                {/* Progress */}
                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-8">
            {/* Current Question */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-500">
                  Question {currentQuestion + 1}
                </h2>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {currentQ.text}
              </h3>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion] === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={submitting}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-gray-800">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div>
                {selectedAnswers[currentQuestion] !== -1 && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm">Answer selected</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0 || submitting}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    currentQuestion === 0 || submitting
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Previous
                </button>
                
                {currentQuestion < quiz.questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 flex items-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Quiz'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Question Navigation Dots */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 justify-center">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => !submitting && setCurrentQuestion(index)}
                    disabled={submitting}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === currentQuestion
                        ? 'bg-blue-600 text-white'
                        : selectedAnswers[index] !== -1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    } hover:bg-blue-100 hover:text-blue-800 transition disabled:opacity-50`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 mb-1">Quiz Information</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Total questions: {quiz.totalQuestions}</li>
                    <li>• Time limit: {quiz.timeLimit} minutes</li>
                    <li>• Passing score: {quiz.passingScore}%</li>
                    <li>• You can navigate between questions using the dots above</li>
                    <li>• Once submitted, your score will be saved</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}