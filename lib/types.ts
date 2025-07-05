export interface Book {
  id: string
  title: string
  author: string
  genre: string
  condition: "New" | "Good" | "Worn"
  description: string
  owner: string
  ownerId: string
  image?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  books: Book[]
}

export interface ExchangeRequest {
  id: string
  bookId: string
  requesterId: string
  message: string
  status: "pending" | "accepted" | "rejected"
}
