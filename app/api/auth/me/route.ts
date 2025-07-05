import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { getUserById } from "@/lib/databaseService"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const user = await getUserById(req.user!.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      interestedGenres: user.interestedGenres,
      birthday: user.birthday,
      location: user.location,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
