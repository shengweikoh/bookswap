"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, ChevronDown, Clock } from "lucide-react"
import Image from "next/image"
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      fetchChats()
    }
  }

  const fetchChats = async () => {
    setLoading(true)
    try {
      // Mock data for now - replace with actual API call
      const mockChats: Chat[] = [
        {
          id: "1",
          bookId: "book1",
          bookTitle: "The Great Gatsby",
          bookImage: null,
          otherUserId: "user1",
          otherUserName: "John Doe",
          otherUserAvatar: null,
          lastMessage: "Hi! Is this book still available?",
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isRead: false,
        },
        {
          id: "2",
          bookId: "book2",
          bookTitle: "To Kill a Mockingbird",
          bookImage: null,
          otherUserId: "user2",
          otherUserName: "Jane Smith",
          otherUserAvatar: null,
          lastMessage: "Thanks for the exchange!",
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          isRead: true,
        },
      ]
      setChats(mockChats)
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChatClick = (chat: Chat) => {
    // TODO: Open chat modal or navigate to chat page
    console.log("Opening chat:", chat)
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

  const unreadCount = chats.filter(chat => !chat.isRead).length

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 relative"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Chat messages"
      >
        <MessageCircle className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-700">
            <h3 className="text-white font-medium">Messages</h3>
          </div>
          
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto"></div>
              <p className="mt-2">Loading chats...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation by requesting a book exchange</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 ${
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
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(chat.lastMessageTime)}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-400 mb-1">
                        Re: {chat.bookTitle}
                      </p>
                      
                      <p className={`text-sm truncate ${
                        !chat.isRead ? 'text-white font-medium' : 'text-gray-300'
                      }`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    
                    {!chat.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
