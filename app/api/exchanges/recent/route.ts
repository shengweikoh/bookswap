import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    // Get the most recent 5 accepted exchange requests from all users
    const recentExchanges = await prisma.exchangeRequest.findMany({
      where: {
        status: "accepted",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
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

    return NextResponse.json(recentExchanges)
  } catch (error) {
    console.error("Error fetching recent swaps:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
