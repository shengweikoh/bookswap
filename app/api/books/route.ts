import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware"
import { getBooks, getUserById, createBook, createNotification } from "@/lib/databaseService"
import { Book, BookWithOwner } from "@/lib/types"

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || undefined
    const genre = searchParams.get("genre") || undefined
    const conditionParam = searchParams.get("condition")
    const condition = (conditionParam && ["New", "Good", "Worn"].includes(conditionParam)) 
      ? conditionParam as "New" | "Good" | "Worn" 
      : undefined
    const availableParam = searchParams.get("available")
    const available = availableParam === "true" ? true : availableParam === "false" ? false : undefined
    const page = Number.parseInt(searchParams.get("page") || "0")
    const size = Number.parseInt(searchParams.get("size") || "20")

    const allBooks = await getBooks({ search, genre, condition, available })

    // Add owner information to books
    const booksWithOwners: BookWithOwner[] = await Promise.all(
      allBooks.map(async (book): Promise<BookWithOwner> => {
        const owner = await getUserById(book.ownerId)
        return {
          ...book,
          owner: owner ? owner.name : "Unknown",
          ownerAvatar: owner ? owner.avatar : null,
        } as BookWithOwner
      })
    )

    // Pagination
    const startIndex = page * size
    const endIndex = startIndex + size
    const paginatedBooks = booksWithOwners.slice(startIndex, endIndex)

    return NextResponse.json({
      books: paginatedBooks,
      totalPages: Math.ceil(booksWithOwners.length / size),
      totalElements: booksWithOwners.length,
      currentPage: page,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { title, author, genre, condition, description, image, location } = await req.json()

    if (!title || !author || !genre || !condition) {
      return NextResponse.json({ error: "Title, author, genre, and condition are required" }, { status: 400 })
    }

    const book = await createBook({
      title,
      author,
      genre,
      condition,
      description: description || "",
      ownerId: req.user!.id,
      image,
      location,
      isAvailable: true,
    })

    // Create notification for successful listing
    await createNotification({
      userId: req.user!.id,
      title: "Book Listed Successfully",
      message: `Your book "${title}" is now live and visible to other users`,
      type: "listing",
      isRead: false,
      relatedId: book.id,
    })

    const owner = await getUserById(book.ownerId)
    return NextResponse.json({
      ...book,
      owner: owner ? owner.name : "Unknown",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
