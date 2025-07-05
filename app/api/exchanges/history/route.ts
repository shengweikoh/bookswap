import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { getExchangeRequests, getBookById, getUserById } from "@/lib/databaseService"
import { ExchangeRequest } from "@/lib/types"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const requests = await getExchangeRequests(req.user!.id)
    const completedExchanges = requests.filter((request: ExchangeRequest) => request.status === "accepted")

    // Add book and user information
    const exchangesWithDetails = await Promise.all(
      completedExchanges.map(async (request: ExchangeRequest) => {
        const book = await getBookById(request.bookId)
        const requester = await getUserById(request.requesterId)
        const owner = await getUserById(request.ownerId)

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
    )

    return NextResponse.json(exchangesWithDetails)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
