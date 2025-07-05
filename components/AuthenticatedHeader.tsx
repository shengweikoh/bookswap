"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, User, Plus, Search, LogOut, List, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import NotificationDropdown from "./NotificationDropdown"
import ChatDropdown from "./ChatDropdown"
import { apiService } from "@/lib/api"

export default function AuthenticatedHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close dropdown when pathname changes
  useEffect(() => {
    setIsProfileDropdownOpen(false)
  }, [pathname])

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
            <Link 
              href="/add-book" 
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors ${
                pathname === "/add-book" ? "bg-emerald-700 shadow-lg border-b-2 border-white" : ""
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <ChatDropdown />
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="true"
                aria-label="Profile menu"
              >
                <User className="h-5 w-5" />
                <ChevronDown className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/my-listings"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <List className="h-4 w-4" />
                    <span>My Postings</span>
                  </Link>
                  <hr className="my-2 border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
