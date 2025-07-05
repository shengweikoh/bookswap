"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, MessageCircle, Share2, Flag } from "lucide-react"
import AuthWrapper from "@/components/AuthWrapper"
import { apiService } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import type { BookWithOwner } from "@/lib/types"

export default function ListingDetails() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [book, setBook] = useState<BookWithOwner | null>(null)
  const [ownerBooks, setOwnerBooks] = useState<BookWithOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const bookId = params.id as string

  useEffect(() => {
    fetchBookDetails()
  }, [bookId])

  const fetchBookDetails = async () => {
    try {
      setLoading(true)
      const result = await apiService.getBookById(bookId)
      
      if (result.success && result.data) {
        setBook(result.data)
        
        // Fetch more books from the same owner
        if (result.data.ownerId) {
          const ownerBooksResult = await apiService.getUserBooks(result.data.ownerId)
          if (ownerBooksResult.success && ownerBooksResult.data) {
            // Filter out the current book and limit to 4 books
            const otherBooks = ownerBooksResult.data
              .filter((b: any) => b.id !== bookId)
              .slice(0, 4)
            setOwnerBooks(otherBooks)
          }
        }
      } else {
        setError(result.error || "Book not found")
      }
    } catch (err) {
      setError("Failed to load book details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading book details...</div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Book Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The book you're looking for doesn't exist."}</p>
          <Link
            href="/browse"
            className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    )
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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleChatClick = () => {
    if (!isOwner && book) {
      // Navigate to My Chats page with book and owner information
      router.push(`/my-chats?bookId=${book.id}&ownerId=${book.ownerId}`)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out this book: ${book.title} by ${book.author}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  // Check if the current user owns this book
  const isOwner = isAuthenticated && user && book && book.ownerId === user.id

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Listings</span>
            </button>
          </div>

        {/* Main Content */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Book Image */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <Image
                  src={book.image || "/images/books/placeholder.svg"}
                  alt={book.title}
                  width={300}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              {/* Title and Author */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
                <p className="text-xl text-gray-300">by {book.author}</p>
              </div>

              {/* Genre and Condition */}
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 text-sm font-medium bg-indigo-900 text-indigo-300 border border-indigo-700 rounded-full">
                  {book.genre}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${getConditionColor(book.condition)}`}
                >
                  {book.condition}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{book.description}</p>
              </div>

              {/* Owner Information */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Owner Information</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={book.image || "/images/avatars/default-avatar.svg"}
                    alt={book.owner}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{book.owner}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>Location not specified</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {formatDate(book.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleChatClick}
                    disabled={!!isOwner}
                    className={`flex-1 px-6 py-3 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors ${
                      isOwner 
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>
                      {isOwner ? "Your Listing" : `Chat with ${book.owner}`}
                    </span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="px-4 py-3 bg-gray-600 text-gray-300 rounded-md hover:bg-gray-500 transition-colors"
                      title="Share this listing"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      className="px-4 py-3 bg-gray-600 text-gray-300 rounded-md hover:bg-gray-500 transition-colors"
                      title="Report this listing"
                    >
                      <Flag className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Exchange Information</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• This book is {book.isAvailable ? "available" : "not available"} for exchange</p>
                  <p>• Contact owner for meetup details</p>
                  <p>• Response time: Usually within 24 hours</p>
                  <p>• Book condition: {book.condition}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">More from {book.owner}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ownerBooks.length > 0 ? (
              ownerBooks.map((ownerBook) => (
                <Link
                  key={ownerBook.id}
                  href={`/listing/${ownerBook.id}`}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[3/4] bg-gray-700 rounded-md mb-3">
                    <Image
                      src={ownerBook.image || "/images/books/placeholder.svg"}
                      alt={ownerBook.title}
                      width={150}
                      height={200}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <h4 className="font-medium text-white text-sm mb-1">{ownerBook.title}</h4>
                  <p className="text-gray-400 text-xs mb-2">by {ownerBook.author}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ownerBook.condition === "New" ? "bg-emerald-900 text-emerald-300" :
                    ownerBook.condition === "Good" ? "bg-yellow-900 text-yellow-300" :
                    "bg-red-900 text-red-300"
                  }`}>
                    {ownerBook.condition}
                  </span>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
                No other books from this owner
              </div>
            )}
          </div>
        </div>

        {/* Back to Browse Button */}
        <div className="mt-8 text-center">
          <Link
            href="/browse"
            className="inline-flex items-center space-x-2 bg-gray-700 text-gray-300 px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Browse All Books</span>
          </Link>
        </div>
      </div>
    </div>
    </AuthWrapper>
  )
}
