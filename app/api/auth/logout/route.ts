import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // In a real application, you might want to blacklist the token
  // For now, we'll just return success since the client will remove the token
  return NextResponse.json({ message: "Logged out successfully" })
}
