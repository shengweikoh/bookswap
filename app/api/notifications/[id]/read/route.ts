import { NextResponse } from "next/server"
import { updateNotification } from "@/lib/databaseService"
import { verifyToken } from "@/lib/jwt"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth check
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const updatedNotification = await updateNotification(id, { isRead: true })
    if (!updatedNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json(updatedNotification)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
