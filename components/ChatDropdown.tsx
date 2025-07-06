"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, ChevronDown, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Chat } from "@/lib/types"
import { formatTimeAgo } from "@/lib/types"

interface ChatDropdownProps {
  className?: string
}

export default function ChatDropdown({ className = "" }: ChatDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    // Only fetch if we don't have data yet
    if (!isOpen && chats.length === 0) {
      fetchChats()
    }
  }

  const fetchChats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/chats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch chats')
      }

      const data = await response.json()
      // Limit to 8 most recent chats for dropdown
      const recentChats = data.slice(0, 8)
      setChats(recentChats)
    } catch (error) {
      console.error("Failed to fetch chats:", error)
      setChats([])
    } finally {
      setLoading(false)
    }
  }

  const handleChatClick = (chat: Chat) => {
    // Navigate to chat page with the specific chat selected
    router.push(`/my-chats?chatId=${chat.id}&bookId=${chat.bookId}&ownerId=${chat.otherUserId}`)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch chats on component mount to show unread count
  useEffect(() => {
    fetchChats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const unreadCount = chats.filter(chat => !chat.isRead).length

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Chat messages"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Messages</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading chats...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No messages yet</p>
                <p className="text-sm text-gray-500 mt-1">Start a conversation by requesting a book exchange</p>
              </div>
            ) : (
              <>
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat)}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer ${
                      !chat.isRead ? 'bg-gray-750' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Other user avatar */}
                      <div className="flex-shrink-0">
                        <Image
                          src={chat.otherUserAvatar || "/images/avatars/default-avatar.svg"}
                          alt={chat.otherUserName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white truncate">
                            {chat.otherUserName}
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(chat.lastMessageTime)}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-400 mt-1">
                          Re: {chat.bookTitle}
                        </p>
                        
                        <p className={`text-sm truncate ${
                          !chat.isRead ? 'text-white font-medium' : 'text-gray-400'
                        }`}>
                          {chat.lastMessage}
                        </p>
                      </div>
                      
                      {!chat.isRead && (
                        <div className="flex-shrink-0 mt-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {chats.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <Link
                href="/my-chats"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View All Chats
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
