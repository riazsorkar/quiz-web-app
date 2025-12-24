// frontend/src/app/(dashboard)/categories/page.tsx
'use client';

import { 
  Code, 
  Globe, 
  Database, 
  Calculator, 
  FlaskRound, 
  BookOpen,
  TrendingUp,
  Target
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CategoryCard from '@/components/CategoryCard';

const categories = [
  {
    icon: Code,
    title: 'Programming',
    description: 'Learn programming languages and concepts',
    quizCount: 8,
    color: 'bg-blue-500',
    href: '/quizzes?category=Programming'
  },
  {
    icon: Globe,
    title: 'Web Development',
    description: 'HTML, CSS, JavaScript and frameworks',
    quizCount: 6,
    color: 'bg-green-500',
    href: '/quizzes?category=Web Development'
  },
  {
    icon: Database,
    title: 'Database',
    description: 'SQL, NoSQL, and database design',
    quizCount: 4,
    color: 'bg-purple-500',
    href: '/quizzes?category=Database'
  },
  {
    icon: Calculator,
    title: 'Mathematics',
    description: 'Algebra, calculus, and statistics',
    quizCount: 5,
    color: 'bg-yellow-500',
    href: '/quizzes?category=Mathematics'
  },
  {
    icon: FlaskRound,
    title: 'Science',
    description: 'Physics, chemistry, and biology',
    quizCount: 3,
    color: 'bg-red-500',
    href: '/quizzes?category=Science'
  },
  {
    icon: TrendingUp,
    title: 'Business',
    description: 'Marketing, finance, and management',
    quizCount: 4,
    color: 'bg-indigo-500',
    href: '/quizzes?category=Business'
  }
];

export default function CategoriesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Quiz Categories</h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Explore quizzes by category and find what interests you most
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-700">
                {categories.reduce((sum, cat) => sum + cat.quizCount, 0)} quizzes across {categories.length} categories
              </span>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Suggest new categories or quizzes you'd like to see. We're always expanding our library!
            </p>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
              Suggest a Category
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}