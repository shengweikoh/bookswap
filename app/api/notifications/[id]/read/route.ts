import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { db } from "@/lib/database"

export async function POST(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  return withAuth(async (authedReq: AuthenticatedRequest) => {
    try {
      const updatedNotification = db.updateNotification(params.id, { isRead: true })
      if (!updatedNotification) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 })
      }

      return NextResponse.json(updatedNotification)
    } catch (error) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  })(req)
}
