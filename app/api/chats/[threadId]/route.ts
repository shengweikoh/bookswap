import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

// Send a message to a chat thread
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
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
    const { threadId } = await params
    const { message } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    // Verify the user is a participant in this thread
    const chatThread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      include: {
        participantA: true,
        participantB: true
      }
    })

    if (!chatThread) {
      return NextResponse.json({ error: "Chat thread not found" }, { status: 404 })
    }

    if (chatThread.participantAId !== userId && chatThread.participantBId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Create the message
    const newMessage = await prisma.chatMessage.create({
      data: {
        threadId: threadId,
        senderId: userId,
        message: message.trim(),
        isRead: false
      }
    })

    // Update the chat thread's updatedAt timestamp
    await prisma.chatThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      id: newMessage.id,
      threadId: newMessage.threadId,
      senderId: newMessage.senderId,
      message: newMessage.message,
      createdAt: newMessage.createdAt,
      isRead: newMessage.isRead
    })

  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

// Get messages for a chat thread
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
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
    const { threadId } = await params

    // Verify the user is a participant in this thread
    const chatThread = await prisma.chatThread.findUnique({
      where: { id: threadId }
    })

    if (!chatThread) {
      return NextResponse.json({ error: "Chat thread not found" }, { status: 404 })
    }

    if (chatThread.participantAId !== userId && chatThread.participantBId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get messages for this thread
    const messages = await prisma.chatMessage.findMany({
      where: { threadId: threadId },
      orderBy: { createdAt: 'asc' }
    })

    // Mark messages as read for the current user
    await prisma.chatMessage.updateMany({
      where: {
        threadId: threadId,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json(messages.map((msg: any) => ({
      id: msg.id,
      chatId: msg.threadId, // For compatibility with existing interface
      senderId: msg.senderId,
      content: msg.message, // For compatibility with existing interface
      timestamp: msg.createdAt,
      isRead: msg.isRead
    })))

  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
