"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar, MapPin, User, Heart } from "lucide-react"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userData: {
    name: string
    email: string
    interestedGenres: string[]
    birthday: string
    location: string
  }
  onSave: (data: any) => void
}

const availableGenres = [
  "Classic Literature",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Non-Fiction",
  "Biography",
  "History",
  "Self-Help",
  "Thriller",
  "Horror",
  "Poetry",
]

export default function EditProfileModal({ isOpen, onClose, userData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: userData.name,
    interestedGenres: userData.interestedGenres,
    birthday: userData.birthday,
    location: userData.location,
  })

  if (!isOpen) return null

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      interestedGenres: prev.interestedGenres.includes(genre)
        ? prev.interestedGenres.filter((g) => g !== genre)
        : [...prev.interestedGenres, genre],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Birthday
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Interested Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Heart className="h-4 w-4 inline mr-2" />
                Interested Genres
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableGenres.map((genre) => (
                  <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interestedGenres.includes(genre)}
                      onChange={() => handleGenreToggle(genre)}
                      className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
