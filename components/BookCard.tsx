"use client"

import { useState } from "react"
import Image from "next/image"
import type { BookWithOwner } from "@/lib/types"
import ExchangeModal from "./ExchangeModal"
import Link from "next/link"

interface BookCardProps {
  book: BookWithOwner
}

export default function BookCard({ book }: BookCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800"
      case "Good":
        return "bg-yellow-100 text-yellow-800"
      case "Worn":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="aspect-[3/4] bg-gray-200">
          <Image
            src={book.image || "/placeholder.svg?height=300&width=225"}
            alt={book.title}
            width={225}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-white mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-gray-300 mb-2">by {book.author}</p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">{book.genre}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(book.condition)}`}>
              {book.condition}
            </span>
          </div>

          <p className="text-sm text-gray-300 mb-3">
            Owner: <span className="font-medium">{book.owner}</span>
          </p>

          <Link
            href={`/listing/${book.id}`}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors font-medium text-center block"
          >
            View Details
          </Link>
        </div>
      </div>

      <ExchangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookTitle={book.title}
        ownerName={book.owner}
      />
    </>
  )
}
