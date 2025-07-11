import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    // Get exchange requests where the current user was either requester or owner
    const exchangeHistory = await prisma.exchangeRequest.findMany({
      where: {
        AND: [
          { status: "accepted" },
          {
            OR: [
              { requesterId: req.user!.id },
              { ownerId: req.user!.id }
            ]
          }
        ]
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            image: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(exchangeHistory)
  } catch (error) {
    console.error("Error fetching exchange history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
