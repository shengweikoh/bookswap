import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params
    
    // Get the exchange request
    const exchangeRequest = await prisma.exchangeRequest.findUnique({
      where: { id },
      include: {
        book: true,
        requester: true,
        owner: true
      }
    })

    if (!exchangeRequest) {
      return NextResponse.json({ error: "Exchange request not found" }, { status: 404 })
    }

    // Check if user is authorized to reject this request
    console.log('Debug reject request:', {
      requestId: id,
      currentUserId: userId,
      exchangeRequestOwnerId: exchangeRequest.ownerId,
      exchangeRequestRequesterId: exchangeRequest.requesterId,
      exchangeRequestStatus: exchangeRequest.status,
      bookId: exchangeRequest.bookId,
      bookOwnerId: exchangeRequest.book.ownerId
    })

    // User can reject if they are the owner OR if the book owner created the request and this user is the other participant
    const canReject = exchangeRequest.ownerId === userId || 
                     (exchangeRequest.ownerId === exchangeRequest.requesterId && exchangeRequest.ownerId !== userId)

    if (!canReject) {
      return NextResponse.json({ 
        error: "Not authorized to reject this request",
        debug: {
          currentUserId: userId,
          ownerId: exchangeRequest.ownerId,
          requesterId: exchangeRequest.requesterId,
          bookOwnerId: exchangeRequest.book.ownerId
        }
      }, { status: 403 })
    }

    // Check if request is still pending
    if (exchangeRequest.status !== 'pending') {
      return NextResponse.json({ error: "Request is no longer pending" }, { status: 400 })
    }

    // Update the exchange request status to rejected
    const updatedRequest = await prisma.exchangeRequest.update({
      where: { id },
      data: { status: 'rejected' }
    })

    // Create notification for the person who initiated the request
    // They should be notified that their request was rejected
    const notificationUserId = exchangeRequest.requesterId;
    
    await prisma.notification.create({
      data: {
        userId: notificationUserId,
        title: "Exchange Request Rejected",
        message: `Your exchange request for "${exchangeRequest.book.title}" has been rejected`,
        type: "rejected",
        isRead: false,
        relatedId: exchangeRequest.id,
      }
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Error rejecting exchange request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
