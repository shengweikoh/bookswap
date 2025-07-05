import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { db } from "@/lib/database"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const user = db.getUserById(req.user!.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's books
    const userBooks = db.getBooks({ ownerId: user.id })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      interestedGenres: user.interestedGenres,
      birthday: user.birthday,
      location: user.location,
      books: userBooks,
      memberSince: user.createdAt.getFullYear().toString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const updates = await req.json()

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.id
    delete updates.email
    delete updates.password
    delete updates.createdAt
    delete updates.updatedAt

    const updatedUser = db.updateUser(req.user!.id, updates)
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      interestedGenres: updatedUser.interestedGenres,
      birthday: updatedUser.birthday,
      location: updatedUser.location,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
