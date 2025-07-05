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
