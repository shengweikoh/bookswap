import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = payload.userId
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')

    let whereCondition: any = {
      OR: [
        { requesterId: userId },
        { ownerId: userId }
      ]
    }

    // If bookId is provided, filter by it
    if (bookId) {
      whereCondition.bookId = bookId
    }

    const requests = await prisma.exchangeRequest.findMany({
      where: whereCondition,
      include: {
        book: {
          include: {
            owner: true
          }
        },
        requester: true,
        owner: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const requestsWithDetails = requests.map((request: any) => ({
      id: request.id,
      bookId: request.bookId,
      requesterId: request.requesterId,
      ownerId: request.ownerId,
      status: request.status,
      createdAt: request.createdAt,
      book: {
        id: request.book.id,
        title: request.book.title,
        author: request.book.author,
        image: request.book.image,
      },
      requester: {
        id: request.requester.id,
        name: request.requester.name,
        avatar: request.requester.avatar,
      },
      owner: {
        id: request.owner.id,
        name: request.owner.name,
        avatar: request.owner.avatar,
      }
    }))

    return NextResponse.json(requestsWithDetails)
  } catch (error) {
    console.error("Error fetching exchange requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
