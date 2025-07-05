import { NextResponse } from "next/server"
import { getExchangeRequestById, updateExchangeRequest, getBookById, getUserById, createNotification } from "@/lib/databaseService"
import { verifyToken } from "@/lib/jwt"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth check
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const exchangeRequest = await getExchangeRequestById(id)
    if (!exchangeRequest) {
      return NextResponse.json({ error: "Exchange request not found" }, { status: 404 })
    }

    // Check if user is the owner of the book
    if (exchangeRequest.ownerId !== decoded.userId) {
      return NextResponse.json({ error: "Unauthorized to reject this request" }, { status: 403 })
    }

    const updatedRequest = await updateExchangeRequest(id, { status: "rejected" })

    // Create notification for requester
    const book = await getBookById(exchangeRequest.bookId)
    const owner = await getUserById(decoded.userId)

    await createNotification({
      userId: exchangeRequest.requesterId,
      title: "Exchange Request Declined",
      message: `${owner?.name} declined your request for "${book?.title}"`,
      type: "rejected",
      isRead: false,
      relatedId: exchangeRequest.id,
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
