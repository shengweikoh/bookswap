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
      // Get current user's interested genres
      const currentUser = apiService.getCurrentUser()
      const interestedGenres = currentUser?.interestedGenres || []
      const currentUserId = currentUser?.id

      let allRecommendedBooks: BookWithOwner[] = []

      if (interestedGenres.length > 0) {
        // Fetch books for each interested genre
        for (const genre of interestedGenres) {
          const result = await apiService.getBooks({ 
            genre, 
            available: true,
            size: 8 // Get more books to have variety
          })
          
          if (result.success && result.data) {
            allRecommendedBooks = [...allRecommendedBooks, ...result.data.books]
          }
        }

        // Remove duplicates, user's own books, and shuffle
        const uniqueBooks = allRecommendedBooks.filter((book, index, self) => 
          index === self.findIndex(b => b.id === book.id) &&
          book.ownerId !== currentUserId // Exclude user's own books
        )
        
        // Use a deterministic shuffle based on book IDs to avoid hydration issues
        const shuffled = [...uniqueBooks].sort((a, b) => {
          const aHash = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
          const bHash = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
          return (aHash % 3) - (bHash % 3)
        })
        setBooks(shuffled.slice(0, 6))
      } else {
        // Fallback: get random available books if user has no interested genres
        const result = await apiService.getBooks({ size: 8, available: true })
        if (result.success && result.data) {
          // Filter out user's own books
          const filtered = result.data.books.filter(book => book.ownerId !== currentUserId)
          setBooks(filtered.slice(0, 6))
        }
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
        <div className="text-gray-400">Finding books you might enjoy...</div>
      </section>
    )
  }

  if (books.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">You May Like</h2>
        <div className="text-gray-400">
          No recommendations available. Try updating your reading preferences in your profile!
        </div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">You May Like</h2>
          <p className="text-gray-400 text-sm mt-1">Based on your reading preferences</p>
        </div>
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
