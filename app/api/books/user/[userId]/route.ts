import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { getBooks, getUserById } from "@/lib/databaseService"
import { Book, BookWithOwner } from "@/lib/types"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const url = new URL(req.url)
    const userId = url.pathname.split("/").filter(Boolean).pop()
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const books = await getBooks({ ownerId: userId })

    const owner = await getUserById(userId)
    const booksWithOwner: BookWithOwner[] = books.map((book: Book) => ({
      ...book,
      owner: owner ? owner.name : "Unknown",
    }))

    return NextResponse.json(booksWithOwner)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
