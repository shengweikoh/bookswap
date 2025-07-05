export interface User {
  id: string
  name: string
  email: string
  password: string // hashed
  avatar: string | null
  createdAt: Date
  updatedAt: Date
  interestedGenres: string[]
  birthday: string | null
  location: string | null
  books: Book[]
}

export interface Book {
  id: string
  title: string
  author: string
  genre: string
  condition: "New" | "Good" | "Worn"
  description: string
  ownerId: string
  image: string | null
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
}

export interface BookWithOwner extends Book {
  owner: string
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
  relatedId: string | null // ID of related entity (book, exchange, etc.)
}

// Use Prisma client from './prisma' for database operations
