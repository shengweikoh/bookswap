import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { db } from "@/lib/database"

export const GET = withAuth(async (req: AuthenticatedRequest, { params }: { params: { userId: string } }) => {
  try {
    const books = db.getBooks({ ownerId: params.userId })

    const owner = db.getUserById(params.userId)
    const booksWithOwner = books.map((book) => ({
      ...book,
      owner: owner ? owner.name : "Unknown",
    }))

    return NextResponse.json(booksWithOwner)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
