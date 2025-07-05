import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail, createUser, createNotification } from "@/lib/databaseService"
import { signToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      interestedGenres: [],
      avatar: null,
      birthday: null,
      location: null,
    })

    // Create welcome notification
    await createNotification({
      userId: user.id,
      title: "Welcome to BookSwap!",
      message: "Complete your profile to get better book recommendations",
      type: "welcome",
      isRead: false,
      relatedId: null,
    })

    const token = signToken({ userId: user.id, email: user.email })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
