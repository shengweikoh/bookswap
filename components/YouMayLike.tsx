"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import BookCard from "./BookCard"
import type { Book } from "@/lib/types"

const recommendedBooks: Book[] = [
  {
    id: "rec1",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "Contemporary Fiction",
    condition: "Good",
    description: "A captivating novel about a reclusive Hollywood icon",
    owner: "Sarah Wilson",
    ownerId: "4",
    image: "/placeholder.svg?height=300&width=225",
  },
  {
    id: "rec2",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    condition: "New",
    description: "Transform your life with tiny changes",
    owner: "Mike Johnson",
    ownerId: "3",
    image: "/placeholder.svg?height=300&width=225",
  },
  {
    id: "rec3",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Contemporary Fiction",
    condition: "Good",
    description: "A novel about infinite possibilities",
    owner: "Emma Davis",
    ownerId: "6",
    image: "/placeholder.svg?height=300&width=225",
  },
  {
    id: "rec4",
    title: "Educated",
    author: "Tara Westover",
    genre: "Memoir",
    condition: "Good",
    description: "A powerful memoir about education and family",
    owner: "David Brown",
    ownerId: "5",
    image: "/placeholder.svg?height=300&width=225",
  },
]

export default function YouMayLike() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">You May Like</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-300" />
          </button>
          <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {recommendedBooks.map((book) => (
          <div key={book.id} className="flex-none w-64">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  )
}
