import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { db } from "@/lib/database"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const requests = db.getExchangeRequests(req.user!.id)

    // Add book and user information to requests
    const requestsWithDetails = requests.map((request) => {
      const book = db.getBookById(request.bookId)
      const requester = db.getUserById(request.requesterId)
      const owner = db.getUserById(request.ownerId)

      return {
        ...request,
        book: book
          ? {
              id: book.id,
              title: book.title,
              author: book.author,
              image: book.image,
            }
          : null,
        requester: requester
          ? {
              id: requester.id,
              name: requester.name,
              avatar: requester.avatar,
            }
          : null,
        owner: owner
          ? {
              id: owner.id,
              name: owner.name,
              avatar: owner.avatar,
            }
          : null,
      }
    })

    return NextResponse.json(requestsWithDetails)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
