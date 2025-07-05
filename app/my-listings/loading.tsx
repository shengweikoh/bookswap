export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-12 w-36 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Books Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
              {/* Image Skeleton */}
              <div className="aspect-[3/4] bg-gray-700 animate-pulse"></div>

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-1/3 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-8 w-full bg-gray-700 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="flex-1 h-8 bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex-1 h-8 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-8 w-12 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
