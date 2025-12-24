// frontend/src/components/QuizSkeleton.tsx
export default function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>

      {/* Progress Bar Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full bg-gray-200 rounded-full h-2"></div>
      </div>

      {/* Quiz Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Question Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            
            <div className="h-6 bg-gray-200 rounded w-full mb-8"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>

            {/* Answer Options Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Skeleton */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="flex space-x-4">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}