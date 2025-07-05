export interface User {
  id: string
  name: string
  email: string
  password: string // hashed
  avatar?: string
  createdAt: Date
  updatedAt: Date
  interestedGenres: string[]
  birthday?: string
  location?: string
}

export interface Book {
  id: string
  title: string
  author: string
  genre: string
  condition: "New" | "Good" | "Worn"
  description: string
  ownerId: string
  image?: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
}

export interface ExchangeRequest {
  id: string
  bookId: string
  requesterId: string
  ownerId: string
  message: string
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "exchange" | "accepted" | "rejected" | "completed" | "profile" | "follow" | "listing" | "welcome"
  isRead: boolean
  createdAt: Date
  relatedId?: string // ID of related entity (book, exchange, etc.)
}

// Export the in-memory db instance
export { db } from "./inMemoryDatabase"
