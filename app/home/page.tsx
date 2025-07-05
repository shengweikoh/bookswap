import YouMayLike from "@/components/YouMayLike"
import RecentSwaps from "@/components/RecentSwaps"
import LatestPostings from "@/components/LatestPostings"
import { BookOpen, TrendingUp, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John!</h1>
          <p className="text-gray-400">Discover new books and connect with fellow readers in your community.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-emerald-600 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Books Listed</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-indigo-600 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Successful Swaps</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-cyan-600 p-3 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Community Rank</p>
                <p className="text-2xl font-bold text-white">#47</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <YouMayLike />
            <RecentSwaps />
          </div>

          <div className="lg:col-span-1">
            <LatestPostings />
          </div>
        </div>
      </div>
    </div>
  )
}
