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

// Utility types for API responses (dates come as strings via JSON)
export interface ApiUser extends Omit<User, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt: string
}

export interface ApiBook extends Omit<Book, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt: string
}

export interface ApiBookWithOwner extends ApiBook {
  owner: string
}

export interface ApiExchangeRequest extends Omit<ExchangeRequest, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt: string
}

export interface ApiNotification extends Omit<Notification, 'createdAt'> {
  createdAt: string
}

// Utility function for safe date handling in components
export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return "Just now"
}

// Use Prisma client from './prisma' for database operations

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export interface BookRequest {
  title: string
  author: string
  genre: string
  condition: string
  description: string
  image?: string
}

export interface ExchangeRequestPayload {
  bookId: string
}

export interface Chat {
  id: string
  bookId: string
  bookTitle: string
  bookImage: string | null
  otherUserId: string
  otherUserName: string
  otherUserAvatar: string | null
  lastMessage: string
  lastMessageTime: Date
  isRead: boolean
}

export interface ApiChat extends Omit<Chat, 'lastMessageTime'> {
  lastMessageTime: string
}
