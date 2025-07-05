"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { User, Mail, BookOpen, Calendar, MapPin, Edit, Heart } from "lucide-react"
import EditProfileModal from "@/components/EditProfileModal"
import { apiService } from "@/lib/api"

export default function Profile() {
  const [userData, setUserData] = useState<any>(null)
  const [userBooks, setUserBooks] = useState<any[]>([])
  const [successfulSwaps, setSuccessfulSwaps] = useState<number>(0)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [profileResult, currentUser, exchangeHistoryResult] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getCurrentUser(),
        apiService.getExchangeHistory()
      ])

      if (profileResult.success && profileResult.data) {
        setUserData(profileResult.data)
        
        // Fetch user's books
        if (currentUser?.id) {
          const booksResult = await apiService.getUserBooks(currentUser.id)
          if (booksResult.success && booksResult.data) {
            setUserBooks(booksResult.data)
          }
          
          // Calculate successful swaps
          if (exchangeHistoryResult.success && exchangeHistoryResult.data) {
            const swapCount = exchangeHistoryResult.data.filter((exchange: any) => 
              exchange.status === "accepted" && 
              (exchange.requesterId === currentUser.id || exchange.ownerId === currentUser.id)
            ).length
            setSuccessfulSwaps(swapCount)
          }
        }
      } else {
        setError(profileResult.error || "Failed to load profile")
      }
    } catch (err) {
      setError("An error occurred while loading profile")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-900 text-emerald-300 border-emerald-700"
      case "Exchanged":
        return "bg-indigo-900 text-indigo-300 border-indigo-700"
      case "Pending":
        return "bg-yellow-900 text-yellow-300 border-yellow-700"
      default:
        return "bg-gray-700 text-gray-300 border-gray-600"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New":
        return "bg-emerald-900 text-emerald-300 border-emerald-700"
      case "Good":
        return "bg-yellow-900 text-yellow-300 border-yellow-700"
      case "Worn":
        return "bg-red-900 text-red-300 border-red-700"
      default:
        return "bg-gray-700 text-gray-300 border-gray-600"
    }
  }

  const handleSaveProfile = async (newData: any) => {
    try {
      const result = await apiService.updateUserProfile(newData)
      if (result.success) {
        setUserData({ ...userData, ...newData })
        setIsEditModalOpen(false)
      } else {
        alert(result.error || "Failed to update profile")
      }
    } catch (error) {
      alert("An error occurred while updating profile")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchUserData}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">No profile data available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Image
                src={userData.avatar || "/images/avatars/default-avatar.svg"}
                alt={userData.name}
                width={120}
                height={120}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-3xl font-bold text-white mb-2 md:mb-0">{userData.name}</h1>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6 text-gray-400 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Member since {userData.memberSince}</span>
                </div>
                {userData.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{userData.location}</span>
                  </div>
                )}
              </div>

              {userData.interestedGenres && userData.interestedGenres.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-medium text-gray-300">Interested Genres:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userData.interestedGenres.map((genre: string) => (
                      <span
                        key={genre}
                        className="px-3 py-1 text-xs font-medium bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">{userBooks.length} Books Listed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  <span className="font-semibold text-indigo-400">
                    {successfulSwaps} Successful Exchanges
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Profile Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Books Listed */}
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <BookOpen className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{userBooks.length}</div>
              <div className="text-sm text-gray-400">Books Listed</div>
            </div>

            {/* Available Books */}
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {userBooks.filter((book: any) => book.isAvailable).length}
              </div>
              <div className="text-sm text-gray-400">Available for Exchange</div>
            </div>

            {/* Successful Exchanges */}
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {successfulSwaps}
              </div>
              <div className="text-sm text-gray-400">Successful Exchanges</div>
            </div>

            {/* Member Since */}
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {userData.memberSince ? new Date(userData.memberSince).getFullYear() : 'N/A'}
              </div>
              <div className="text-sm text-gray-400">Member Since</div>
            </div>
          </div>

          {/* Book Condition Breakdown */}
          {userBooks.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Book Condition Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-emerald-400 mb-1">
                    {userBooks.filter((book: any) => book.condition === 'New').length}
                  </div>
                  <div className="text-sm text-gray-400">New Books</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-yellow-400 mb-1">
                    {userBooks.filter((book: any) => book.condition === 'Good').length}
                  </div>
                  <div className="text-sm text-gray-400">Good Condition</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-red-400 mb-1">
                    {userBooks.filter((book: any) => book.condition === 'Worn').length}
                  </div>
                  <div className="text-sm text-gray-400">Worn Books</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleSaveProfile}
      />
    </div>
  )
}
