"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, BookOpen } from "lucide-react"
import AuthWrapper from "@/components/AuthWrapper"
import BookCard from "@/components/BookCard"
import { apiService } from "@/lib/api"
import type { BookWithOwner } from "@/lib/types"

interface UserProfile {
  id: string
  name: string
  avatar: string | null
  location: string | null
  books: BookWithOwner[]
  memberSince: string
}

export default function UserProfile() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = params.id as string

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      
      if (response.ok) {
        setProfile(data)
      } else {
        setError(data.error || "Failed to load user profile")
      }
    } catch (err) {
      setError("Failed to load user profile")
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading user profile...</div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The user you're looking for doesn't exist."}</p>
          <Link
            href="/browse"
            className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          </div>

          {/* Profile Header */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex items-center space-x-6 mb-6">
                <Image
                  src={profile.avatar || "/images/avatars/default-avatar.svg"}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-400">
                    {profile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {profile.memberSince}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{profile.books.length} books listed</span>
                </div>
              </div>
            </div>
          </div>

          {/* User's Books */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">{profile.name}&apos;s Books</h2>
            
            {profile.books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {profile.books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No books listed yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
