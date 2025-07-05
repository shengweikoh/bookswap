"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import BookCard from "@/components/BookCard"
import AuthWrapper from "@/components/AuthWrapper"
import { apiService } from "@/lib/api"
import type { BookWithOwner } from "@/lib/types"

export default function Browse() {
  const [books, setBooks] = useState<BookWithOwner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchBooks()
  }, [searchTerm, selectedGenre, selectedCondition, currentPage])

  const fetchBooks = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiService.getBooks({
        search: searchTerm || undefined,
        genre: selectedGenre || undefined,
        condition: selectedCondition || undefined,
        page: currentPage,
        size: 12,
      })

      if (result.success && result.data) {
        setBooks(result.data.books)
        setTotalPages(result.data.totalPages)
      } else {
        setError(result.error || "Failed to fetch books")
      }
    } catch (error) {
      setError("Failed to fetch books")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0)
    fetchBooks()
  }

  const handleFilterChange = () => {
    setCurrentPage(0)
    fetchBooks()
  }

  const genres = ["All Genres", "Classic Literature", "Science Fiction", "Fantasy", "Mystery", "Romance", "Non-Fiction"]
  const conditions = ["All Conditions", "New", "Good", "Worn"]

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-6">Browse Books</h1>

          {/* Search and Filter Bar */}
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search books or authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value)
                    handleFilterChange()
                  }}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre === "All Genres" ? "" : genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedCondition}
                  onChange={(e) => {
                    setSelectedCondition(e.target.value)
                    handleFilterChange()
                  }}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition === "All Conditions" ? "" : condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-md">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Loading books...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <>
            <div className="mb-4">
              <p className="text-gray-400">
                Showing {books.length} {books.length === 1 ? "book" : "books"}
              </p>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-300">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Next
                </button>
              </div>
            )}

            {books.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No books found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </AuthWrapper>
  )
}
