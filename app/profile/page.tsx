"use client"

import { useState } from "react"
import Image from "next/image"
import { User, Mail, BookOpen, Calendar, MapPin, Edit, Heart } from "lucide-react"
import EditProfileModal from "@/components/EditProfileModal"

// Sample user data
const initialUserData = {
  id: "1",
  name: "John Smith",
  email: "john.smith@email.com",
  avatar: "/placeholder.svg?height=120&width=120",
  memberSince: "2023",
  interestedGenres: ["Science Fiction", "Fantasy", "Mystery"],
  birthday: "1990-05-15",
  location: "San Francisco, CA",
  books: [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      condition: "Good",
      status: "Available",
    },
    {
      id: "2",
      title: "1984",
      author: "George Orwell",
      condition: "New",
      status: "Exchanged",
    },
    {
      id: "3",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      condition: "Worn",
      status: "Available",
    },
  ],
}

export default function Profile() {
  const [userData, setUserData] = useState(initialUserData)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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

  const handleSaveProfile = (newData: any) => {
    setUserData({ ...userData, ...newData })
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Image
                src={userData.avatar || "/placeholder.svg"}
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

              {userData.interestedGenres.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-medium text-gray-300">Interested Genres:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userData.interestedGenres.map((genre) => (
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
                  <span className="font-semibold text-emerald-400">{userData.books.length} Books Listed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  <span className="font-semibold text-indigo-400">
                    {userData.books.filter((book) => book.status === "Exchanged").length} Successful Exchanges
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Books */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">My Books</h2>

          <div className="space-y-4">
            {userData.books.map((book) => (
              <div key={book.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white">{book.title}</h3>
                    <p className="text-gray-400 mb-2">by {book.author}</p>
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getConditionColor(book.condition)}`}
                      >
                        {book.condition}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(book.status)}`}
                      >
                        {book.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-emerald-400 bg-emerald-900 border border-emerald-700 rounded-md hover:bg-emerald-800 transition-colors">
                      Edit
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-red-400 bg-red-900 border border-red-700 rounded-md hover:bg-red-800 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {userData.books.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">You haven't listed any books yet.</p>
              <button className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors">
                List Your First Book
              </button>
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
