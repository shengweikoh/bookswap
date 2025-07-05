import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { getNotifications } from "@/lib/databaseService"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const notifications = await getNotifications(req.user!.id)
    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
