import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { db } from "@/lib/database"

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    db.markAllNotificationsAsRead(req.user!.id)
    return NextResponse.json({ message: "All notifications marked as read" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
