"use client"

import { useState, useEffect } from "react"
import YouMayLike from "@/components/YouMayLike"
import RecentSwaps from "@/components/RecentSwaps"
import LatestPostings from "@/components/LatestPostings"
import { BookOpen, TrendingUp, Users } from "lucide-react"
import { apiService } from "@/lib/api"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [userStats, setUserStats] = useState({
    booksListed: 0,
    successfulSwaps: 0,
    communityRank: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage first for immediate display
    const currentUser = apiService.getCurrentUser()
    setUser(currentUser)

    // Then fetch fresh profile data
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const [profileResult, exchangeHistoryResult] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getExchangeHistory()
      ])
      
      if (profileResult.success && profileResult.data) {
        setUser(profileResult.data)
        
        // Get user's books
        const currentUser = apiService.getCurrentUser()
        let booksListed = 0
        let successfulSwaps = 0
        
        if (currentUser?.id) {
          const booksResult = await apiService.getUserBooks(currentUser.id)
          if (booksResult.success && booksResult.data) {
            booksListed = booksResult.data.length
          }
        }
        
        // Count successful swaps from exchange history
        if (exchangeHistoryResult.success && exchangeHistoryResult.data) {
          successfulSwaps = exchangeHistoryResult.data.filter((exchange: any) => 
            exchange.status === "accepted" && 
            (exchange.requesterId === currentUser?.id || exchange.ownerId === currentUser?.id)
          ).length
        }
        
        setUserStats({
          booksListed,
          successfulSwaps,
          communityRank: Math.floor(Math.random() * 100) + 1, // Placeholder until we implement ranking
        })
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {isLoading ? "..." : user?.name || "Reader"}!
          </h1>
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
                <p className="text-2xl font-bold text-white">{isLoading ? "..." : userStats.booksListed}</p>
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
                <p className="text-2xl font-bold text-white">{isLoading ? "..." : userStats.successfulSwaps}</p>
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
                <p className="text-2xl font-bold text-white">#{isLoading ? "..." : userStats.communityRank}</p>
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
