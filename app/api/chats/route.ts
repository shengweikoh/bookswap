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

    // Get all chat threads where the user is a participant
    const chatThreads = await prisma.chatThread.findMany({
      where: {
        OR: [
          { participantAId: userId },
          { participantBId: userId }
        ]
      },
      include: {
        book: {
          include: {
            owner: true
          }
        },
        participantA: true,
        participantB: true,
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 // Get the latest message for preview
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Transform chat threads into chat format
    const chats = chatThreads.map((thread: any) => {
      const isParticipantA = thread.participantAId === userId
      const otherUser = isParticipantA ? thread.participantB : thread.participantA
      const lastMessage = thread.messages[0]
      
      return {
        id: thread.id,
        bookId: thread.bookId,
        bookTitle: thread.book.title,
        bookImage: thread.book.image,
        otherUserId: otherUser.id,
        otherUserName: otherUser.name,
        otherUserAvatar: otherUser.avatar,
        lastMessage: lastMessage?.message || "",
        lastMessageTime: lastMessage?.createdAt || thread.updatedAt,
        isRead: lastMessage ? lastMessage.senderId === userId || lastMessage.isRead : true
      }
    })

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    const { bookId, participantId } = await request.json()

    if (!bookId || !participantId) {
      return NextResponse.json({ error: "bookId and participantId are required" }, { status: 400 })
    }

    // Check if a chat thread already exists between these participants for this book
    const existingThread = await prisma.chatThread.findFirst({
      where: {
        bookId: bookId,
        OR: [
          { participantAId: userId, participantBId: participantId },
          { participantAId: participantId, participantBId: userId }
        ]
      },
      include: {
        book: {
          include: {
            owner: true
          }
        },
        participantA: true,
        participantB: true
      }
    })

    if (existingThread) {
      // Return existing thread
      const isParticipantA = existingThread.participantAId === userId
      const otherUser = isParticipantA ? existingThread.participantB : existingThread.participantA
      
      return NextResponse.json({
        id: existingThread.id,
        bookId: existingThread.bookId,
        bookTitle: existingThread.book.title,
        bookImage: existingThread.book.image,
        otherUserId: otherUser.id,
        otherUserName: otherUser.name,
        otherUserAvatar: otherUser.avatar,
        lastMessage: "",
        lastMessageTime: existingThread.updatedAt,
        isRead: true
      })
    }

    // Create new chat thread
    const newThread = await prisma.chatThread.create({
      data: {
        bookId: bookId,
        participantAId: userId,
        participantBId: participantId
      },
      include: {
        book: {
          include: {
            owner: true
          }
        },
        participantA: true,
        participantB: true
      }
    })

    const otherUser = newThread.participantB

    return NextResponse.json({
      id: newThread.id,
      bookId: newThread.bookId,
      bookTitle: newThread.book.title,
      bookImage: newThread.book.image,
      otherUserId: otherUser.id,
      otherUserName: otherUser.name,
      otherUserAvatar: otherUser.avatar,
      lastMessage: "",
      lastMessageTime: newThread.updatedAt,
      isRead: true
    })

  } catch (error) {
    console.error("Error creating chat thread:", error)
    return NextResponse.json({ error: "Failed to create chat thread" }, { status: 500 })
  }
}
