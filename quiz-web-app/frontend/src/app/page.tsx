// frontend/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Clock, 
  Users, 
  Award, 
  Sparkles, 
  BarChart3, 
  Shield,
  Zap,
  Target,
  Star,
  ChevronRight,
  BookOpen,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalQuizzes: 150,
    totalUsers: 5000,
    averageScore: 85,
    questionsAnswered: 250000
  });

  const features = [
    {
      icon: Trophy,
      title: "Compete & Win",
      description: "Join global leaderboards and earn badges",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Clock,
      title: "Timed Challenges",
      description: "Test your speed and accuracy with timed quizzes",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Create and share quizzes with the community",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Award,
      title: "Earn Achievements",
      description: "Unlock achievements and level up your skills",
      color: "from-purple-400 to-pink-500"
    }
  ];

  const categories = [
    { name: "Programming", count: 45, icon: "💻", color: "bg-blue-100 text-blue-800" },
    { name: "Web Development", count: 32, icon: "🌐", color: "bg-green-100 text-green-800" },
    { name: "Mathematics", count: 28, icon: "🧮", color: "bg-purple-100 text-purple-800" },
    { name: "Science", count: 24, icon: "🔬", color: "bg-red-100 text-red-800" },
    { name: "Business", count: 18, icon: "💼", color: "bg-yellow-100 text-yellow-800" },
    { name: "General Knowledge", count: 35, icon: "🧠", color: "bg-indigo-100 text-indigo-800" }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Software Developer",
      text: "This platform helped me prepare for my technical interviews. The programming quizzes are excellent!",
      avatar: "AJ",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      name: "Sarah Miller",
      role: "University Student",
      text: "As a student, I use this daily to reinforce my learning. The explanations are super helpful.",
      avatar: "SM",
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      name: "David Chen",
      role: "Tech Lead",
      text: "I use this with my team for weekly learning sessions. Great for skill development.",
      avatar: "DC",
      color: "bg-gradient-to-r from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-6 w-6" />
              <span className="ml-2 font-semibold">Join 5,000+ learners</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master Skills Through
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Interactive Quizzes
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Challenge yourself, compete with others, and track your progress with our 
              comprehensive quiz platform designed for effective learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Learning Free
                <ChevronRight className="h-5 w-5 ml-2" />
              </Link>
              
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all"
              >
                <Shield className="h-5 w-5 mr-2" />
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Total Quizzes", value: stats.totalQuizzes, icon: BookOpen, color: "text-blue-600" },
              { label: "Active Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-green-600" },
              { label: "Avg. Score", value: `${stats.averageScore}%`, icon: TrendingUp, color: "text-purple-600" },
              { label: "Questions Answered", value: stats.questionsAnswered.toLocaleString(), icon: CheckCircle, color: "text-orange-600" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} bg-opacity-10 rounded-2xl mb-4`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Quiz Master?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine interactive learning with gamification to make skill development 
              engaging and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive into our extensive library of quizzes across various topics
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href="/categories"
                className="group"
              >
                <div className={`${category.color} rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}>
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm opacity-75">{category.count} quizzes</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
            >
              View All Categories
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied learners who have transformed their skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center mb-6">
                  <div className={`${testimonial.color} w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mr-4`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-200 italic">"{testimonial.text}"</p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join our community of learners and take your skills to the next level
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}