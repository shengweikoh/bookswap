"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import BookCard from "@/components/BookCard"
import type { Book } from "@/lib/types"

// Sample data
const sampleBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Literature",
    condition: "Good",
    description: "A masterpiece of American literature",
    owner: "John Smith",
    ownerId: "1",
    image: "/placeholder.svg?height=300&width=225",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic Literature",
    condition: "New",
    description: "A gripping tale of racial injustice and childhood innocence",
    owner: "Jane Doe",
    ownerId: "2",
    image: "/placeholder.svg?height=300&width=225",
  },
  {
    id: "3",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Classic Literature",
    condition: "Worn",
    description: "Coming-of-age story in New York City",
    owner: "Mike Johnson",
    ownerId: "3",
    image: "/placeholder.svg?height=300&width=225",
  },
  {
    id: "4",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    condition: "Good",
    description: "Epic space opera about politics and ecology",
    owner: "Sarah Wilson",
    ownerId: "4",
    image: "/placeholder.svg?height=300&width=225",
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    condition: "New",
    description: "A classic fantasy adventure",
    owner: "David Brown",
    ownerId: "5",
    image: "/placeholder.svg?height=300&width=225",
  },
  {
    id: "6",
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "Mystery",
    condition: "Good",
    description: "Psychological thriller about a missing wife",
    owner: "Emma Davis",
    ownerId: "6",
    image: "/placeholder.svg?height=300&width=225",
  },
]

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")

  const genres = ["All Genres", "Classic Literature", "Science Fiction", "Fantasy", "Mystery", "Romance", "Non-Fiction"]
  const conditions = ["All Conditions", "New", "Good", "Worn"]

  const filteredBooks = sampleBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === "" || selectedGenre === "All Genres" || book.genre === selectedGenre
    const matchesCondition =
      selectedCondition === "" || selectedCondition === "All Conditions" || book.condition === selectedCondition

    return matchesSearch && matchesGenre && matchesCondition
  })

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Browse Books</h1>

          {/* Search and Filter Bar */}
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  onChange={(e) => setSelectedGenre(e.target.value)}
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
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition === "All Conditions" ? "" : condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-400">
            Showing {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
          </p>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
