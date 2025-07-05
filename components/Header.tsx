"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, User, Plus, Home, Search } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BookSwap</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`flex items-center space-x-1 px-3 py-2 ${isActive("/")}`}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link href="/browse" className={`flex items-center space-x-1 px-3 py-2 ${isActive("/browse")}`}>
              <Search className="h-4 w-4" />
              <span>Browse Books</span>
            </Link>
            <Link href="/add-book" className={`flex items-center space-x-1 px-3 py-2 ${isActive("/add-book")}`}>
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Link>
            <Link href="/profile" className={`flex items-center space-x-1 px-3 py-2 ${isActive("/profile")}`}>
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
