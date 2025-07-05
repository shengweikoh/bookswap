import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { db } from "@/lib/database"

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { bookId, message } = await req.json()

    if (!bookId || !message) {
      return NextResponse.json({ error: "Book ID and message are required" }, { status: 400 })
    }

    const book = db.getBookById(bookId)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    if (book.ownerId === req.user!.id) {
      return NextResponse.json({ error: "Cannot request exchange for your own book" }, { status: 400 })
    }

    const exchangeRequest = db.createExchangeRequest({
      bookId,
      requesterId: req.user!.id,
      ownerId: book.ownerId,
      message,
      status: "pending",
    })

    // Create notification for book owner
    const requester = db.getUserById(req.user!.id)
    db.createNotification({
      userId: book.ownerId,
      title: "Exchange Request Received",
      message: `${requester?.name} wants to exchange "${book.title}" with your book`,
      type: "exchange",
      isRead: false,
      relatedId: exchangeRequest.id,
    })

    return NextResponse.json(exchangeRequest)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
