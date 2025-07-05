"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, MessageCircle, Heart, Share2, Flag } from "lucide-react"
import type { BookWithOwner } from "@/lib/types"

// Sample book data - in a real app, this would come from an API
const sampleBooks: Record<string, BookWithOwner & { datePosted: string; ownerLocation: string; ownerAvatar: string }> = {
  "1": {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Literature",
    condition: "Good",
    description:
      "A masterpiece of American literature that captures the essence of the Jazz Age. This classic novel follows the mysterious Jay Gatsby and his obsession with the beautiful Daisy Buchanan. The book is in good condition with minimal wear on the cover and clean, readable pages throughout. A must-read for any literature enthusiast.",
    owner: "John Smith",
    ownerId: "1",
    image: "/placeholder.svg?height=400&width=300",
    datePosted: "2024-01-15",
    ownerLocation: "Downtown, San Francisco",
    ownerAvatar: "/placeholder.svg?height=60&width=60",
    createdAt: new Date(),
    updatedAt: new Date(),
    isAvailable: true,
  },
  "2": {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic Literature",
    condition: "New",
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South. This powerful novel explores themes of morality, prejudice, and the loss of innocence through the eyes of Scout Finch. The book is in excellent condition, practically new with no markings or damage.",
    owner: "Jane Doe",
    ownerId: "2",
    image: "/placeholder.svg?height=400&width=300",
    datePosted: "2024-01-10",
    ownerLocation: "Mission District, San Francisco",
    ownerAvatar: "/placeholder.svg?height=60&width=60",
    createdAt: new Date(),
    updatedAt: new Date(),
    isAvailable: true,
  },
  rec1: {
    id: "rec1",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "Contemporary Fiction",
    condition: "Good",
    description:
      "A captivating novel about a reclusive Hollywood icon who finally decides to tell her story to an unknown journalist. This book explores themes of love, ambition, and the price of fame. The pages are clean and the binding is tight, with only minor shelf wear on the cover.",
    owner: "Sarah Wilson",
    ownerId: "4",
    image: "/placeholder.svg?height=400&width=300",
    datePosted: "2024-01-12",
    ownerLocation: "Castro District, San Francisco",
    ownerAvatar: "/placeholder.svg?height=60&width=60",
    createdAt: new Date(),
    updatedAt: new Date(),
    isAvailable: true,
  },
}

export default function ListingDetails() {
  const params = useParams()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)

  const bookId = params.id as string
  const book = sampleBooks[bookId]

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Book Not Found</h1>
          <p className="text-gray-400 mb-6">The book you're looking for doesn't exist.</p>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleChatClick = () => {
    // In a real app, this would navigate to a chat interface or open a chat modal
    console.log(`Starting chat with ${book.owner}`)
    // For now, we'll just show an alert
    alert(`Chat feature would open here to message ${book.owner}`)
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

  return (
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
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <Image
                  src={book.image || "/placeholder.svg?height=400&width=300"}
                  alt={book.title}
                  width={300}
                  height={400}
                  className="rounded-lg shadow-lg object-cover"
                />
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                    isLiked ? "bg-red-600 text-white" : "bg-gray-900 bg-opacity-70 text-gray-300 hover:text-red-400"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                </button>
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
                    src={book.ownerAvatar || "/placeholder.svg"}
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
                        <span>{book.ownerLocation}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {formatDate(book.datePosted)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleChatClick}
                    className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Chat with {book.owner}</span>
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
                  <p>• This book is available for exchange</p>
                  <p>• Owner prefers local meetups in San Francisco</p>
                  <p>• Response time: Usually within 24 hours</p>
                  <p>• Exchange rating: ⭐⭐⭐⭐⭐ (4.8/5 from 12 exchanges)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">More from {book.owner}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Sample related books */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] bg-gray-700 rounded-md mb-3">
                  <Image
                    src={`/placeholder.svg?height=200&width=150`}
                    alt={`Book ${i}`}
                    width={150}
                    height={200}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h4 className="font-medium text-white text-sm mb-1">Sample Book Title {i}</h4>
                <p className="text-gray-400 text-xs mb-2">by Sample Author</p>
                <span className="px-2 py-1 text-xs bg-emerald-900 text-emerald-300 rounded-full">Good</span>
              </div>
            ))}
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
  )
}
