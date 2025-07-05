import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Create response
  const response = NextResponse.json({ message: "Logged out successfully" })
  
  // Clear the auth token cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  })

  return response
}
