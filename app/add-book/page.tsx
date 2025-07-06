"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BookOpen } from "lucide-react"
import AuthWrapper from "@/components/AuthWrapper"
import { apiService } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export default function AddBook() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    condition: "",
    description: "",
    location: "",
    image: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  // Set default location from user profile when component mounts
  useEffect(() => {
    if (user?.location) {
      setFormData(prev => ({
        ...prev,
        location: user.location || ""
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const bookData = {
        ...formData,
        isAvailable: true // New books are always available
      }
      const result = await apiService.addBook(bookData)
      
      if (result.success) {
        // Redirect to the browse page or show success message
        router.push("/browse")
      } else {
        setSubmitError(result.error || "Failed to add book")
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const genres = [
    "Classic Literature",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
    "Non-Fiction",
    "Biography",
    "History",
    "Self-Help",
    "Other",
  ]
  const conditions = ["New", "Good", "Worn"]

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <BookOpen className="h-8 w-8 text-emerald-400 mr-3" />
              <h1 className="text-3xl font-bold text-white">Add a New Book</h1>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-md">
                {submitError}
              </div>
            )}
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Book Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter the book title"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
                Author *
              </label>
              <input
                id="author"
                name="author"
                type="text"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter the author's name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  required
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-300 mb-2">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Where is this book located?"
              />
              <p className="mt-1 text-sm text-gray-400">
                {user?.location ? `Defaults to your profile location: ${user.location}` : "Add a location to help potential exchangers"}
              </p>
            </div>

            {/* Book Cover Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                Book Cover Image URL (Optional)
              </label>
              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={(e) => {
                  handleChange(e)
                  setImageError(false) // Reset error when user changes URL
                }}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/book-cover.jpg"
              />
              <p className="mt-1 text-sm text-gray-400">
                Optional: Provide a URL to an image of the book cover
              </p>
              
              {/* Image Preview */}
              {formData.image && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
                  <div className="w-32 h-48 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                    <Image
                      src={imageError ? "/images/books/placeholder.svg" : formData.image}
                      alt="Book cover preview"
                      width={128}
                      height={192}
                      className="object-cover w-full h-full"
                      onError={() => setImageError(true)}
                    />
                  </div>
                  {imageError && (
                    <p className="mt-2 text-sm text-red-400">
                      Unable to load image. Please check the URL and try again.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Tell us about the book (optional)"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Submit Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </AuthWrapper>
  )
}
