"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import BookCard from "./BookCard"
import { apiService } from "@/lib/api"
import type { BookWithOwner } from "@/lib/types"

export default function YouMayLike() {
  const [books, setBooks] = useState<BookWithOwner[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchRecommendedBooks()
  }, [])

  const fetchRecommendedBooks = async () => {
    try {
      const result = await apiService.getBooks({ size: 4, available: true })
      if (result.success && result.data) {
        setBooks(result.data.books)
      }
    } catch (error) {
      console.error("Failed to fetch recommended books:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -280, // Width of one card (256px) + gap (24px)
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 280, // Width of one card (256px) + gap (24px)
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">You May Like</h2>
        <div className="text-gray-400">Loading recommendations...</div>
      </section>
    )
  }

  if (books.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">You May Like</h2>
        <div className="text-gray-400">No recommendations available</div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">You May Like</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-300" />
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide"
      >
        {books.map((book) => (
          <div key={book.id} className="flex-none w-64">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  )
}
