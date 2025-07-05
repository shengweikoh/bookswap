import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { db } from "@/lib/database"

export const POST = withAuth(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const exchangeRequest = db.getExchangeRequestById(params.id)
    if (!exchangeRequest) {
      return NextResponse.json({ error: "Exchange request not found" }, { status: 404 })
    }

    // Check if user is the owner of the book
    if (exchangeRequest.ownerId !== req.user!.id) {
      return NextResponse.json({ error: "Unauthorized to accept this request" }, { status: 403 })
    }

    const updatedRequest = db.updateExchangeRequest(params.id, { status: "accepted" })

    // Create notification for requester
    const book = db.getBookById(exchangeRequest.bookId)
    const owner = db.getUserById(req.user!.id)

    db.createNotification({
      userId: exchangeRequest.requesterId,
      title: "Book Request Accepted",
      message: `${owner?.name} accepted your request for "${book?.title}"`,
      type: "accepted",
      isRead: false,
      relatedId: exchangeRequest.id,
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
