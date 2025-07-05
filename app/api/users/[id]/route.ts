import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { getUserById, getBooks } from "@/lib/databaseService"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split("/").filter(Boolean).pop()
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const user = await getUserById(id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's books
    const userBooks = await getBooks({ ownerId: user.id })

    // Return public profile information only
    return NextResponse.json({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      location: user.location,
      books: userBooks,
      memberSince: user.createdAt.getFullYear().toString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
