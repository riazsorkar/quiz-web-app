// frontend/src/app/(dashboard)/leaderboard/page.tsx
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Trophy, Award, TrendingUp, Users, Star, Target } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  quizzesTaken: number;
  quizzesPassed: number;
  accuracy: number; // percentage
  streak: number; // days
  avatarColor: string;
}

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState('all-time'); // 'weekly', 'monthly', 'all-time'
  
  // Sample leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: 'Alex Johnson', score: 2450, quizzesTaken: 42, quizzesPassed: 38, accuracy: 92, streak: 14, avatarColor: '#4F46E5' },
    { rank: 2, name: 'Sam Wilson', score: 2180, quizzesTaken: 38, quizzesPassed: 35, accuracy: 88, streak: 7, avatarColor: '#10B981' },
    { rank: 3, name: 'Taylor Smith', score: 1950, quizzesTaken: 35, quizzesPassed: 32, accuracy: 85, streak: 21, avatarColor: '#F59E0B' },
    { rank: 4, name: 'Jordan Lee', score: 1820, quizzesTaken: 32, quizzesPassed: 28, accuracy: 82, streak: 3, avatarColor: '#EF4444' },
    { rank: 5, name: 'Casey Brown', score: 1650, quizzesTaken: 28, quizzesPassed: 25, accuracy: 78, streak: 5, avatarColor: '#8B5CF6' },
    { rank: 6, name: 'Riley Davis', score: 1520, quizzesTaken: 25, quizzesPassed: 22, accuracy: 75, streak: 10, avatarColor: '#06B6D4' },
    { rank: 7, name: 'Morgan Miller', score: 1420, quizzesTaken: 22, quizzesPassed: 19, accuracy: 72, streak: 2, avatarColor: '#EC4899' },
    { rank: 8, name: 'Cameron Wilson', score: 1350, quizzesTaken: 20, quizzesPassed: 18, accuracy: 70, streak: 4, avatarColor: '#84CC16' },
    { rank: 42, name: 'You', score: 850, quizzesTaken: 15, quizzesPassed: 12, accuracy: 68, streak: 1, avatarColor: '#6366F1' },
  ];

  // Current user (you)
  const currentUser = leaderboardData.find(entry => entry.name === 'You');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Trophy className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Global Leaderboard</h1>
              <p className="text-yellow-100 text-lg max-w-2xl mx-auto">
                Compete with learners worldwide and climb to the top!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Time Range Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {['weekly', 'monthly', 'all-time'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-2 rounded-full font-medium capitalize transition ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Top Performers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {leaderboardData.slice(0, 3).map((user) => (
                <div
                  key={user.rank}
                  className={`bg-white rounded-2xl shadow-lg p-6 text-center transform transition-transform hover:scale-105 ${
                    user.rank === 1 ? 'md:-translate-y-4 border-2 border-yellow-400' :
                    user.rank === 2 ? 'border-2 border-gray-300' :
                    'border-2 border-amber-800'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                    user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {user.rank === 1 ? (
                      <Trophy className="h-8 w-8" />
                    ) : user.rank === 2 ? (
                      <Award className="h-8 w-8" />
                    ) : (
                      <Star className="h-8 w-8" />
                    )}
                  </div>
                  
                  {/* Avatar */}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{user.score}</div>
                  <div className="text-sm text-gray-600">Total Score</div>
                  
                  {/* Stats */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Accuracy</span>
                      <span className="font-semibold">{user.accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quizzes</span>
                      <span className="font-semibold">{user.quizzesPassed}/{user.quizzesTaken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Streak</span>
                      <span className="font-semibold">{user.streak} days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Full Leaderboard</h2>
                  <p className="text-gray-600 text-sm mt-1">Total participants: {leaderboardData.length}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-medium">Global Ranking</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quizzes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Streak
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboardData.map((user) => (
                    <tr 
                      key={user.rank}
                      className={`hover:bg-gray-50 transition ${
                        user.name === 'You' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                          user.rank <= 3 ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800' :
                          'bg-gray-100 text-gray-700'
                        } font-bold`}>
                          {user.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                            style={{ backgroundColor: user.avatarColor }}
                          >
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            {user.name === 'You' && (
                              <div className="text-xs text-blue-600 font-medium">That's you!</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                          <span className="font-bold text-gray-900">{user.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.quizzesPassed}<span className="text-gray-500">/{user.quizzesTaken}</span>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(user.quizzesPassed / user.quizzesTaken) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                          user.accuracy >= 90 ? 'bg-green-100 text-green-800' :
                          user.accuracy >= 80 ? 'bg-blue-100 text-blue-800' :
                          user.accuracy >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.accuracy}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Target className="h-4 w-4 text-red-500 mr-2" />
                          <span className="font-medium">{user.streak} days</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Current User Stats */}
            {currentUser && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <Trophy className="h-5 w-5 mr-2" />
                      <h3 className="text-lg font-bold">Your Current Standing</h3>
                    </div>
                    <p className="text-blue-100">
                      You're ranked #{currentUser.rank} globally. Keep learning to climb higher!
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{currentUser.score}</div>
                      <div className="text-sm text-blue-200">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{currentUser.accuracy}%</div>
                      <div className="text-sm text-blue-200">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{currentUser.quizzesPassed}</div>
                      <div className="text-sm text-blue-200">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{currentUser.streak}</div>
                      <div className="text-sm text-blue-200">Day Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900">How to Improve Rank</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Complete quizzes daily to maintain streak</li>
                <li>• Focus on accuracy over speed</li>
                <li>• Review incorrect answers to learn</li>
                <li>• Try different quiz categories</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Scoring System</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Correct answer: +10 points</li>
                <li>• Perfect quiz: +50 bonus points</li>
                <li>• Daily streak: +5 points per day</li>
                <li>• Hard difficulty: 1.5x multiplier</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Achievements</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Top 10: Gold badge</li>
                <li>• Top 50: Silver badge</li>
                <li>• 10+ streak: Fire badge</li>
                <li>• 90%+ accuracy: Ace badge</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}