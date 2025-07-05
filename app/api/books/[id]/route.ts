import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { db } from "@/lib/database"

export const GET = withAuth(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const book = db.getBookById(params.id)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    const owner = db.getUserById(book.ownerId)
    return NextResponse.json({
      ...book,
      owner: owner ? owner.name : "Unknown",
      ownerAvatar: owner?.avatar,
      ownerLocation: owner?.location,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const PUT = withAuth(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const book = db.getBookById(params.id)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if user owns the book
    if (book.ownerId !== req.user!.id) {
      return NextResponse.json({ error: "Unauthorized to update this book" }, { status: 403 })
    }

    const updates = await req.json()
    const updatedBook = db.updateBook(params.id, updates)

    const owner = db.getUserById(updatedBook!.ownerId)
    return NextResponse.json({
      ...updatedBook,
      owner: owner ? owner.name : "Unknown",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const book = db.getBookById(params.id)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if user owns the book
    if (book.ownerId !== req.user!.id) {
      return NextResponse.json({ error: "Unauthorized to delete this book" }, { status: 403 })
    }

    const deleted = db.deleteBook(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
    }

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
