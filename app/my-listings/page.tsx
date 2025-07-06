"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Edit, Plus, Eye, Calendar, Tag, MapPin } from "lucide-react"
import AuthWrapper from "@/components/AuthWrapper"
import { apiService } from "@/lib/api"
import { ApiBook } from "@/lib/types"

export default function MyListings() {
  const router = useRouter()
  const [books, setBooks] = useState<ApiBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    fetchMyBooks()
  }, [])

  const fetchMyBooks = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiService.getUserProfile()
      if (result.success && result.data) {
        setBooks(result.data.books || [])
      } else {
        setError(result.error || "Failed to fetch your books")
      }
    } catch (error) {
      setError("Failed to fetch your books")
    } finally {
      setIsLoading(false)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Postings</h1>
            <p className="text-gray-400">Manage your listed books</p>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <p className="text-gray-400 ml-4">Loading your books...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Postings</h1>
            <p className="text-gray-400">Manage your listed books</p>
          </div>

          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchMyBooks}
              className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Postings</h1>
              <p className="text-gray-400">
                You have {books.length} {books.length === 1 ? "book" : "books"} listed
              </p>
            </div>
            <Link
              href="/add-book"
              className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Book</span>
            </Link>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">No books listed yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start building your library by adding books you&apos;d like to exchange with other readers.
            </p>
            <Link
              href="/add-book"
              className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>List Your First Book</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                {/* Book Image */}
                <div className="aspect-[3/4] bg-gray-700 relative">
                  <Image
                    src={imageErrors[book.id] || !book.image ? "/images/books/placeholder.svg" : book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    onError={() => setImageErrors(prev => ({...prev, [book.id]: true}))}
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getConditionColor(book.condition)}`}
                    >
                      {book.condition}
                    </span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-white mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-300 mb-2">by {book.author}</p>

                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{book.genre}</span>
                  </div>

                  {book.location && (
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{book.location}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Listed {formatDate(book.createdAt)}</span>
                  </div>

                  {book.description && <p className="text-sm text-gray-400 mb-4 line-clamp-2">{book.description}</p>}

                  {/* Status */}
                  <div className="mb-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        book.isAvailable
                          ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
                          : "bg-gray-700 text-gray-300 border border-gray-600"
                      }`}
                    >
                      {book.isAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/listing/${book.id}`}
                      className="flex-1 bg-gray-700 text-gray-300 py-2 px-3 rounded-md hover:bg-gray-600 transition-colors font-medium text-center text-sm flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Link>
                    <button
                      onClick={() => {
                        if (!book.isAvailable) {
                          alert("Cannot edit unavailable books")
                          return
                        }
                        router.push(`/edit-book/${book.id}`)
                      }}
                      disabled={!book.isAvailable}
                      className={`flex-1 py-2 px-3 rounded-md transition-colors font-medium text-sm flex items-center justify-center space-x-1 ${
                        book.isAvailable 
                          ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {books.length > 0 && (
          <div className="mt-12 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Listing Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{books.length}</div>
                <div className="text-sm text-gray-400">Total Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">
                  {books.filter((book) => book.isAvailable).length}
                </div>
                <div className="text-sm text-gray-400">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{new Set(books.map((book) => book.genre)).size}</div>
                <div className="text-sm text-gray-400">Genres</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {books.filter((book) => book.condition === "New").length}
                </div>
                <div className="text-sm text-gray-400">New Condition</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AuthWrapper>
  )
}
