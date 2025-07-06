"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api"
import { formatTimeAgo } from "@/lib/types"
import type { BookWithOwner } from "@/lib/types"

export default function LatestPostings() {
  const [books, setBooks] = useState<BookWithOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    fetchLatestBooks()
  }, [])

  const fetchLatestBooks = async () => {
    try {
      // Only fetch available books for latest postings
      const result = await apiService.getBooks({ size: 4, available: true })
      if (result.success && result.data) {
        setBooks(result.data.books)
      }
    } catch (error) {
      console.error("Failed to fetch latest books:", error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Latest Available Books</h2>
        <div className="text-gray-400">Loading latest books...</div>
      </section>
    )
  }

  if (books.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Latest Available Books</h2>
        <div className="text-gray-400">No books available</div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Latest Available Books</h2>

      <div className="grid gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={imageErrors[book.id] || !book.image ? "/images/books/placeholder.svg" : book.image}
                alt={book.title}
                width={60}
                height={80}
                className="rounded-md object-cover"
                onError={() => setImageErrors(prev => ({...prev, [book.id]: true}))}
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white">{book.title}</h3>
                <p className="text-gray-300 mb-2">by {book.author}</p>

                <div className="flex items-center space-x-4 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getConditionColor(book.condition)}`}
                  >
                    {book.condition}
                  </span>
                  <span className="text-sm text-gray-300">by {book.owner}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{book.location || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeAgo(book.createdAt)}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/listing/${book.id}`}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
