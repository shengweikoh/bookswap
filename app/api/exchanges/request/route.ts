import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = payload.userId
    const { bookId } = await request.json()

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    // Get the book
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { owner: true }
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    if (book.ownerId === userId) {
      return NextResponse.json({ error: "Cannot request exchange for your own book" }, { status: 400 })
    }

    // Check if exchange request already exists
    const existingRequest = await prisma.exchangeRequest.findFirst({
      where: {
        bookId: bookId,
        requesterId: userId,
        status: "pending"
      }
    })

    if (existingRequest) {
      return NextResponse.json({ error: "Exchange request already exists for this book" }, { status: 400 })
    }

    // Create exchange request
    const exchangeRequest = await prisma.exchangeRequest.create({
      data: {
        bookId,
        requesterId: userId,
        ownerId: book.ownerId,
        status: "pending",
      }
    })

    // Get requester info for notification
    const requester = await prisma.user.findUnique({
      where: { id: userId }
    })

    // Create notification for book owner
    await prisma.notification.create({
      data: {
        userId: book.ownerId,
        title: "Exchange Request Received",
        message: `${requester?.name} wants to exchange "${book.title}" with your book`,
        type: "exchange",
        isRead: false,
        relatedId: exchangeRequest.id,
      }
    })

    return NextResponse.json(exchangeRequest)
  } catch (error) {
    console.error("Error creating exchange request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
