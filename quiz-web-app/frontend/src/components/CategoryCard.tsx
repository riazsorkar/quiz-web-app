// frontend/src/components/CategoryCard.tsx
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  quizCount: number;
  color: string;
  href: string;
}

export default function CategoryCard({
  icon: Icon,
  title,
  description,
  quizCount,
  color,
  href
}: CategoryCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              {quizCount} {quizCount === 1 ? 'quiz' : 'quizzes'}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {description}
          </p>
          
          <div className="flex items-center text-blue-600 font-medium text-sm">
            <span>Explore category</span>
            <span className="ml-1 transform group-hover:translate-x-1 transition">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}