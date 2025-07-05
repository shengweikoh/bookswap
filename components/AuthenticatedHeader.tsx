"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, User, Plus, Search, LogOut } from "lucide-react"
import NotificationDropdown from "./NotificationDropdown"
import { apiService } from "@/lib/api"

export default function AuthenticatedHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path ? "text-emerald-400 border-b-2 border-emerald-400" : "text-gray-300 hover:text-white"
  }

  const handleLogout = async () => {
    try {
      await apiService.logout()
      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Still redirect even if API call fails
      router.push("/login")
    }
  }

  return (
    <header className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold text-white">BookSwap</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/home" className={`flex items-center space-x-1 px-3 py-2 ${isActive("/home")}`}>
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
            <NotificationDropdown />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
