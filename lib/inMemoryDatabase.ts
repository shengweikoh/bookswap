import { User, Book, ExchangeRequest, Notification } from "./database"

// In-memory storage (replace with real database in production)
class Database {
  private users: Map<string, User> = new Map()
  private books: Map<string, Book> = new Map()
  private exchangeRequests: Map<string, ExchangeRequest> = new Map()
  private notifications: Map<string, Notification> = new Map()

  constructor() {
    this.seedData()
  }

  // User operations
  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.set(newUser.id, newUser)
    return newUser
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id)
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email === email)
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id)
    if (!user) return undefined

    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  // Book operations
  createBook(book: Omit<Book, "id" | "createdAt" | "updatedAt">): Book {
    const newBook: Book = {
      ...book,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.books.set(newBook.id, newBook)
    return newBook
  }

  getBookById(id: string): Book | undefined {
    return this.books.get(id)
  }

  getBooks(filters?: {
    search?: string
    genre?: string
    condition?: string
    ownerId?: string
  }): Book[] {
    let books = Array.from(this.books.values())

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      books = books.filter(
        (book) => book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search),
      )
    }

    if (filters?.genre) {
      books = books.filter((book) => book.genre === filters.genre)
    }

    if (filters?.condition) {
      books = books.filter((book) => book.condition === filters.condition)
    }

    if (filters?.ownerId) {
      books = books.filter((book) => book.ownerId === filters.ownerId)
    }

    return books.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  updateBook(id: string, updates: Partial<Book>): Book | undefined {
    const book = this.books.get(id)
    if (!book) return undefined

    const updatedBook = { ...book, ...updates, updatedAt: new Date() }
    this.books.set(id, updatedBook)
    return updatedBook
  }

  deleteBook(id: string): boolean {
    return this.books.delete(id)
  }

  // Exchange request operations
  createExchangeRequest(request: Omit<ExchangeRequest, "id" | "createdAt" | "updatedAt">): ExchangeRequest {
    const newRequest: ExchangeRequest = {
      ...request,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.exchangeRequests.set(newRequest.id, newRequest)
    return newRequest
  }

  getExchangeRequestById(id: string): ExchangeRequest | undefined {
    return this.exchangeRequests.get(id)
  }

  getExchangeRequests(userId: string): ExchangeRequest[] {
    return Array.from(this.exchangeRequests.values())
      .filter((request) => request.requesterId === userId || request.ownerId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  updateExchangeRequest(id: string, updates: Partial<ExchangeRequest>): ExchangeRequest | undefined {
    const request = this.exchangeRequests.get(id)
    if (!request) return undefined

    const updatedRequest = { ...request, ...updates, updatedAt: new Date() }
    this.exchangeRequests.set(id, updatedRequest)
    return updatedRequest
  }

  // Notification operations
  createNotification(notification: Omit<Notification, "id" | "createdAt">): Notification {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      createdAt: new Date(),
    }
    this.notifications.set(newNotification.id, newNotification)
    return newNotification
  }

  getNotifications(userId: string): Notification[] {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  updateNotification(id: string, updates: Partial<Notification>): Notification | undefined {
    const notification = this.notifications.get(id)
    if (!notification) return undefined

    const updatedNotification = { ...notification, ...updates }
    this.notifications.set(id, updatedNotification)
    return updatedNotification
  }

  markAllNotificationsAsRead(userId: string): void {
    Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId && !notification.isRead)
      .forEach((notification) => {
        this.notifications.set(notification.id, { ...notification, isRead: true })
      })
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private seedData() {
    // Seed some initial data for development
    const bcrypt = require("bcryptjs")

    // Create sample users
    const hashedPassword = bcrypt.hashSync("password123", 10)

    const user1: User = {
      id: "user1",
      name: "John Smith",
      email: "john@example.com",
      password: hashedPassword,
      avatar: "/placeholder.svg?height=120&width=120",
      createdAt: new Date(),
      updatedAt: new Date(),
      interestedGenres: ["Science Fiction", "Fantasy", "Mystery"],
      birthday: "1990-05-15",
      location: "San Francisco, CA",
    }

    const user2: User = {
      id: "user2",
      name: "Jane Doe",
      email: "jane@example.com",
      password: hashedPassword,
      avatar: "/placeholder.svg?height=120&width=120",
      createdAt: new Date(),
      updatedAt: new Date(),
      interestedGenres: ["Classic Literature", "Romance"],
      location: "New York, NY",
    }

    this.users.set(user1.id, user1)
    this.users.set(user2.id, user2)

    // Create sample books
    const books: Book[] = [
      {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic Literature",
        condition: "Good",
        description: "A masterpiece of American literature",
        ownerId: "user1",
        image: "/placeholder.svg?height=300&width=225",
        createdAt: new Date(),
        updatedAt: new Date(),
        isAvailable: true,
      },
      {
        id: "2",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic Literature",
        condition: "New",
        description: "A gripping tale of racial injustice and childhood innocence",
        ownerId: "user2",
        image: "/placeholder.svg?height=300&width=225",
        createdAt: new Date(),
        updatedAt: new Date(),
        isAvailable: true,
      },
      {
        id: "3",
        title: "Dune",
        author: "Frank Herbert",
        genre: "Science Fiction",
        condition: "Good",
        description: "Epic space opera about politics and ecology",
        ownerId: "user1",
        image: "/placeholder.svg?height=300&width=225",
        createdAt: new Date(),
        updatedAt: new Date(),
        isAvailable: true,
      },
    ]

    books.forEach((book) => this.books.set(book.id, book))

    // Create sample notifications
    const notifications: Notification[] = [
      {
        id: "notif1",
        userId: "user1",
        title: "Welcome to BookSwap!",
        message: "Complete your profile to get better recommendations",
        type: "welcome",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
    ]

    notifications.forEach((notif) => this.notifications.set(notif.id, notif))
  }
}

// Export singleton instance
export const db = new Database()
