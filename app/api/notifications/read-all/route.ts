import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { markAllNotificationsAsRead } from "@/lib/databaseService"

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await markAllNotificationsAsRead(req.user!.id)
    return NextResponse.json({ message: "All notifications marked as read" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
