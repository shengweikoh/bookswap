"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { BookOpen, ArrowLeft, MapPin } from "lucide-react"
import AuthWrapper from "@/components/AuthWrapper"
import { apiService } from "@/lib/api"
import { BookRequest } from "@/lib/types"

const GENRES = [
  "Fiction",
  "Non-fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Thriller",
  "Biography",
  "History",
  "Self-help",
  "Comedy",
  "Drama",
  "Horror",
  "Poetry",
  "Philosophy",
  "Psychology",
  "Religion",
  "Science",
  "Technology",
  "Travel",
  "Other"
]

const CONDITIONS = ["New", "Good", "Worn"]

export default function EditBook() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [book, setBook] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [userLocation, setUserLocation] = useState<string>("")

  const [formData, setFormData] = useState<BookRequest>({
    title: "",
    author: "",
    genre: "",
    condition: "Good",
    description: "",
    image: "",
    location: "",
    isAvailable: true,
  })

  useEffect(() => {
    fetchBook()
    fetchUserProfile()
  }, [bookId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBook = async () => {
    try {
      const result = await apiService.getBookById(bookId)
      if (result.success && result.data) {
        const bookData = result.data
        setBook(bookData)
        setFormData({
          title: bookData.title || "",
          author: bookData.author || "",
          genre: bookData.genre || "",
          condition: bookData.condition || "Good",
          description: bookData.description || "",
          image: bookData.image || "",
          location: bookData.location || "",
          isAvailable: bookData.isAvailable !== undefined ? bookData.isAvailable : true,
        })
      } else {
        setError(result.error || "Failed to fetch book details")
      }
    } catch (error) {
      setError("Failed to fetch book details")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const result = await apiService.getUserProfile()
      if (result.success && result.data) {
        setUserLocation(result.data.location || "")
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await apiService.updateBook(bookId, formData)
      if (result.success) {
        router.push("/my-listings")
      } else {
        setError(result.error || "Failed to update book")
      }
    } catch (error) {
      setError("Failed to update book")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <p className="text-gray-400 ml-4">Loading book details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !book) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push("/my-listings")}
              className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Back to My Listings
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Check if book is available for editing
  if (book && !book.isAvailable) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">Cannot Edit Unavailable Book</h3>
            <p className="text-gray-400 mb-6">
              This book is currently unavailable and cannot be edited.
            </p>
            <button
              onClick={() => router.push("/my-listings")}
              className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Back to My Listings
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/my-listings")}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to My Listings</span>
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Book</h1>
            <p className="text-gray-400">Update your book listing details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Image Preview */}
            {formData.image && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Book Cover</label>
                <div className="w-32 h-48 bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={imageError ? "/images/books/placeholder.svg" : formData.image}
                    alt="Book cover"
                    width={128}
                    height={192}
                    className="object-cover w-full h-full"
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>
            )}

            {/* Book Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter book title"
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter author name"
              />
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a genre</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-300 mb-2">
                Condition *
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={userLocation || "Enter location (e.g., City, State)"}
                />
              </div>
              {userLocation && formData.location !== userLocation && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, location: userLocation }))}
                  className="mt-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Use my profile location: {userLocation}
                </button>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                Book Cover Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://example.com/book-cover.jpg"
              />
              <p className="text-xs text-gray-400 mt-1">
                Optional: Provide a URL to an image of the book cover
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Describe the book's condition, any notes, or why you're exchanging it..."
              />
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="isAvailable" className="text-sm text-gray-300">
                Book is available for exchange
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-md hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating Book...
                  </>
                ) : (
                  "Update Book"
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/my-listings")}
                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthWrapper>
  )
}
