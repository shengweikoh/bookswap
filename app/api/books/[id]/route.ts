import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { getBookById, getUserById, updateBook, deleteBook } from "@/lib/databaseService"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const book = await getBookById(id)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    const owner = await getUserById(book.ownerId)
    return NextResponse.json({
      ...book,
      owner: owner ? owner.name : "Unknown",
      ownerAvatar: owner?.avatar,
      ownerLocation: owner?.location,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split("/").filter(Boolean).pop()
    if (!id) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }
    const book = await getBookById(id)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if user owns the book
    if (book.ownerId !== req.user!.id) {
      return NextResponse.json({ error: "Unauthorized to update this book" }, { status: 403 })
    }

    const updates = await req.json()
    const updatedBook = await updateBook(id, updates)

    const owner = await getUserById(updatedBook!.ownerId)
    return NextResponse.json({
      ...updatedBook,
      owner: owner ? owner.name : "Unknown",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split("/").filter(Boolean).pop()
    if (!id) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }
    const book = await getBookById(id)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if user owns the book
    if (book.ownerId !== req.user!.id) {
      return NextResponse.json({ error: "Unauthorized to delete this book" }, { status: 403 })
    }

    await deleteBook(id)
    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
