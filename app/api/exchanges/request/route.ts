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

    // In a chat context, both users should be able to request exchange
    // If the book owner requests exchange, they're indicating willingness to exchange
    // If a non-owner requests exchange, they're asking for the book
    
    // Create exchange request with appropriate role assignment
    let requesterId, ownerId;
    
    if (book.ownerId === userId) {
      // Book owner is initiating the exchange (offering their book)
      requesterId = userId;
      ownerId = userId;
      console.log('Debug: Book owner initiating exchange request', {
        bookId,
        bookOwnerId: book.ownerId,
        requesterId: userId,
        scenario: 'owner_requesting'
      });
    } else {
      // Non-owner is requesting the book
      requesterId = userId;
      ownerId = book.ownerId;
      console.log('Debug: Non-owner requesting exchange', {
        bookId,
        bookOwnerId: book.ownerId,
        requesterId: userId,
        scenario: 'requester_asking'
      });
    }

    // Check if exchange request already exists
    const existingRequest = await prisma.exchangeRequest.findFirst({
      where: {
        bookId: bookId,
        requesterId: requesterId,
        ownerId: ownerId,
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
        requesterId,
        ownerId,
        status: "pending",
      }
    })

    // Get requester info for notification
    const requester = await prisma.user.findUnique({
      where: { id: requesterId }
    })

    // Create notification based on scenario
    if (book.ownerId === userId) {
      // Book owner initiated - notify other users in the chat about owner's willingness to exchange
      // For now, we'll create a general notification to the owner (could be expanded to notify chat participants)
      await prisma.notification.create({
        data: {
          userId: ownerId,
          title: "Exchange Request Created",
          message: `You indicated willingness to exchange "${book.title}"`,
          type: "exchange",
          isRead: false,
          relatedId: exchangeRequest.id,
        }
      })
    } else {
      // Non-owner requested - notify the book owner
      await prisma.notification.create({
        data: {
          userId: ownerId,
          title: "Exchange Request Received",
          message: `${requester?.name} wants to exchange "${book.title}" with your book`,
          type: "exchange",
          isRead: false,
          relatedId: exchangeRequest.id,
        }
      })
    }

    return NextResponse.json(exchangeRequest)
  } catch (error) {
    console.error("Error creating exchange request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
