export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Skeleton */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-[300px] h-[400px] bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Details Skeleton */}
            <div className="space-y-6">
              <div>
                <div className="h-8 w-3/4 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-1/2 bg-gray-700 rounded animate-pulse"></div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-20 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-700 rounded-full animate-pulse"></div>
              </div>

              <div>
                <div className="h-6 w-24 bg-gray-700 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="h-6 w-32 bg-gray-600 rounded animate-pulse mb-3"></div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-15 h-15 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-12 w-full bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
