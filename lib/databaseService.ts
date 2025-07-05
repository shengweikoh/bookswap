import { prisma } from "./prisma";
import { User, Book, ExchangeRequest, Notification } from "./types";

// User operations
export async function createUser(user: Omit<User, "id" | "createdAt" | "updatedAt" | "books">) {
  return prisma.user.create({ data: user });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function updateUser(id: string, updates: Partial<Omit<User, "books">>) {
  return prisma.user.update({ where: { id }, data: updates });
}

// Book operations
export async function createBook(book: Omit<Book, "id" | "createdAt" | "updatedAt">) {
  return prisma.book.create({ data: book });
}

export async function getBookById(id: string) {
  return prisma.book.findUnique({ where: { id } });
}

export async function getBooks(filters?: {
  search?: string;
  genre?: string;
  condition?: "New" | "Good" | "Worn";
  ownerId?: string;
}) {
  return prisma.book.findMany({
    where: {
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { author: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
      ...(filters?.genre && { genre: filters.genre }),
      ...(filters?.condition && { condition: filters.condition }),
      ...(filters?.ownerId && { ownerId: filters.ownerId }),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateBook(id: string, updates: Partial<Book>) {
  return prisma.book.update({ where: { id }, data: updates });
}

export async function deleteBook(id: string) {
  return prisma.book.delete({ where: { id } });
}

// Exchange request operations
export async function createExchangeRequest(request: Omit<ExchangeRequest, "id" | "createdAt" | "updatedAt">) {
  return prisma.exchangeRequest.create({ data: request });
}

export async function getExchangeRequestById(id: string) {
  return prisma.exchangeRequest.findUnique({ where: { id } });
}

export async function getExchangeRequests(userId: string) {
  return prisma.exchangeRequest.findMany({
    where: {
      OR: [
        { requesterId: userId },
        { ownerId: userId },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateExchangeRequest(id: string, updates: Partial<ExchangeRequest>) {
  return prisma.exchangeRequest.update({ where: { id }, data: updates });
}

// Notification operations
export async function createNotification(notification: Omit<Notification, "id" | "createdAt">) {
  return prisma.notification.create({ data: notification });
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateNotification(id: string, updates: Partial<Notification>) {
  return prisma.notification.update({ where: { id }, data: updates });
}

export async function markAllNotificationsAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

// Seed data function for development
export async function seedDatabase() {
  const bcrypt = require("bcryptjs");
  const hashedPassword = bcrypt.hashSync("password123", 10);

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      name: "John Smith",
      email: "john@example.com",
      password: hashedPassword,
      avatar: "/placeholder.svg?height=120&width=120",
      interestedGenres: ["Science Fiction", "Fantasy", "Mystery"],
      birthday: "1990-05-15",
      location: "San Francisco, CA",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      name: "Jane Doe",
      email: "jane@example.com",
      password: hashedPassword,
      avatar: "/placeholder.svg?height=120&width=120",
      interestedGenres: ["Classic Literature", "Romance"],
      location: "New York, NY",
    },
  });

  // Create sample books
  await prisma.book.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic Literature",
      condition: "Good",
      description: "A masterpiece of American literature",
      ownerId: user1.id,
      image: "/placeholder.svg?height=300&width=225",
      isAvailable: true,
    },
  });

  await prisma.book.upsert({
    where: { id: "2" },
    update: {},
    create: {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Classic Literature",
      condition: "New",
      description: "A gripping tale of racial injustice and childhood innocence",
      ownerId: user2.id,
      image: "/placeholder.svg?height=300&width=225",
      isAvailable: true,
    },
  });

  await prisma.book.upsert({
    where: { id: "3" },
    update: {},
    create: {
      id: "3",
      title: "Dune",
      author: "Frank Herbert",
      genre: "Science Fiction",
      condition: "Good",
      description: "Epic space opera about politics and ecology",
      ownerId: user1.id,
      image: "/placeholder.svg?height=300&width=225",
      isAvailable: true,
    },
  });

  // Create sample notification
  await prisma.notification.upsert({
    where: { id: "notif1" },
    update: {},
    create: {
      id: "notif1",
      userId: user1.id,
      title: "Welcome to BookSwap!",
      message: "Complete your profile to get better recommendations",
      type: "welcome",
      isRead: false,
    },
  });

  console.log("Database seeded successfully!");
}
