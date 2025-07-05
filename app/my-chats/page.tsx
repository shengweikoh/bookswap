"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Send, Search, Clock, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import AuthWrapper from "@/components/AuthWrapper"
import { Chat } from "@/lib/types"
import { formatTimeAgo } from "@/lib/types"

interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  timestamp: Date
  isRead: boolean
}

function MyChatContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showChatList, setShowChatList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get chat parameters from URL (when coming from listing page or chat dropdown)
  const bookId = searchParams.get("bookId")
  const ownerId = searchParams.get("ownerId")
  const chatId = searchParams.get("chatId")

  useEffect(() => {
    fetchChats()
  }, [user]) // Add user as dependency

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id)
    }
  }, [selectedChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChats = async () => {
    try {
      setLoading(true)
      
      // Check if user is authenticated
      if (!user) {
        setLoading(false)
        return
      }
      
      // Fetch chats from API
      const response = await fetch('/api/chats', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      })

      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated, redirect to login
          console.error('User not authenticated')
          return
        }
        throw new Error('Failed to fetch chats')
      }

      const chatsData = await response.json()
      
      // Convert API response to Chat objects (dates come as strings)
      const fetchedChats: Chat[] = chatsData.map((chat: any) => ({
        ...chat,
        lastMessageTime: new Date(chat.lastMessageTime)
      }))

      setChats(fetchedChats)

      // Auto-select chat based on URL parameters
      if (chatId) {
        // If chatId is provided, select that specific chat
        const existingChat = fetchedChats.find(chat => chat.id === chatId)
        if (existingChat) {
          setSelectedChat(existingChat)
        }
      } else if (bookId && ownerId) {
        // If bookId and ownerId are provided, find or create chat
        const existingChat = fetchedChats.find(chat => chat.bookId === bookId && chat.otherUserId === ownerId)
        if (existingChat) {
          setSelectedChat(existingChat)
        } else {
          // Create new chat via API
          try {
            const createResponse = await fetch('/api/chats', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                bookId: bookId,
                participantId: ownerId,
              }),
            })

            if (createResponse.ok) {
              const newChatData = await createResponse.json()
              const newChat: Chat = {
                ...newChatData,
                lastMessageTime: new Date(newChatData.lastMessageTime)
              }
              setChats([newChat, ...fetchedChats])
              setSelectedChat(newChat)
            }
          } catch (createError) {
            console.error("Failed to create new chat:", createError)
          }
        }
      } else if (fetchedChats.length > 0) {
        setSelectedChat(fetchedChats[0])
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (chatId: string) => {
    try {
      // Fetch messages from API
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      })

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const messagesData = await response.json()
      
      // Convert API response to Message objects (dates come as strings)
      const fetchedMessages: Message[] = messagesData.map((message: any) => ({
        id: message.id,
        chatId: message.chatId,
        senderId: message.senderId,
        content: message.content,
        timestamp: new Date(message.timestamp),
        isRead: message.isRead
      }))

      setMessages(fetchedMessages)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return

    try {
      // Send message to API
      const response = await fetch(`/api/chats/${selectedChat.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const messageData = await response.json()
      
      // Create message object with proper typing
      const message: Message = {
        id: messageData.id,
        chatId: selectedChat.id,
        senderId: user?.id || "me",
        content: newMessage.trim(),
        timestamp: new Date(messageData.createdAt),
        isRead: messageData.isRead,
      }

      setMessages([...messages, message])
      setNewMessage("")

      // Update chat's last message
      const updatedChats = chats.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: newMessage.trim(), lastMessageTime: new Date() }
          : chat
      )
      setChats(updatedChats)
      setSelectedChat({ ...selectedChat, lastMessage: newMessage.trim(), lastMessageTime: new Date() })

    } catch (error) {
      console.error("Failed to send message:", error)
      // Optionally show error message to user
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const filteredChats = chats.filter(chat =>
    chat.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading chats...</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-4 lg:py-8 min-h-0">
        {/* Header - Hidden on mobile when chat is selected */}
        <div className={`mb-4 lg:mb-6 flex-shrink-0 ${!showChatList ? 'hidden lg:block' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/home"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">My Chats</h1>
            <div></div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden flex-1 min-h-0">
          <div className="flex flex-col lg:grid lg:grid-cols-3 h-full min-h-full">
            {/* Chat List - Left Side */}
            <div className={`lg:col-span-1 border-r border-gray-700 flex flex-col h-full min-h-0 ${
              !showChatList ? 'hidden lg:flex' : ''
            }`}>
              {/* Search */}
              <div className="p-3 lg:p-4 border-b border-gray-700 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {filteredChats.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No chats yet</p>
                    <p className="text-sm mt-1">Start a conversation by messaging a book owner</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setSelectedChat(chat)
                        setShowChatList(false) // Hide chat list on mobile when selecting a chat
                      }}
                      className={`w-full p-3 lg:p-4 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 ${
                        selectedChat?.id === chat.id ? 'bg-gray-700' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Image
                          src={chat.otherUserAvatar || "/images/avatars/default-avatar.svg"}
                          alt={chat.otherUserName}
                          width={40}
                          height={40}
                          className="rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-white truncate">
                              {chat.otherUserName}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(chat.lastMessageTime)}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-1 truncate">
                            Re: {chat.bookTitle}
                          </p>
                          <p className={`text-sm truncate leading-relaxed ${
                            !chat.isRead ? 'text-white font-semibold' : 'text-gray-200'
                          }`}>
                            {chat.lastMessage || "No messages yet"}
                          </p>
                        </div>
                        {!chat.isRead && (
                          <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Interface - Right Side */}
            <div className={`lg:col-span-2 flex flex-col h-full ${
              showChatList ? 'hidden lg:flex' : ''
            }`}>
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 lg:p-4 border-b border-gray-700 bg-gray-750">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Back button for mobile */}
                        <button
                          onClick={() => setShowChatList(true)}
                          className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                        <Image
                          src={selectedChat.otherUserAvatar || "/images/avatars/default-avatar.svg"}
                          alt={selectedChat.otherUserName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-white">{selectedChat.otherUserName}</h3>
                          <p className="text-sm text-gray-400">About: {selectedChat.bookTitle}</p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/listing/${selectedChat.bookId}`}
                          className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-xs lg:text-sm bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition-colors"
                        >
                          <span>View Listing</span>
                        </Link>
                        <button
                          onClick={async () => {
                            // Handle exchange request
                            try {
                              const response = await fetch('/api/exchanges/request', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  bookId: selectedChat.bookId,
                                }),
                              })

                              if (response.ok) {
                                // Success - maybe show a toast notification
                                console.log('Exchange request sent successfully')
                                // You could add a success toast here
                              } else {
                                const errorData = await response.json()
                                console.error('Failed to send exchange request:', errorData.error)
                                // You could add an error toast here
                              }
                            } catch (error) {
                              console.error('Error sending exchange request:', error)
                            }
                          }}
                          className="flex items-center space-x-1 px-3 py-1.5 text-xs lg:text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <span>Request Exchange</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-3 lg:px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-700 text-gray-100'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user?.id ? 'text-emerald-200' : 'text-gray-400'
                          }`}>
                            {formatTimeAgo(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-3 lg:p-4 border-t border-gray-700">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage()
                      }}
                      className="flex space-x-2"
                    >
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 lg:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm lg:text-base"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-3 lg:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4 lg:h-5 lg:w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a chat to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyChats() {
  return (
    <AuthWrapper>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white">Loading chats...</div>
        </div>
      }>
        <MyChatContent />
      </Suspense>
    </AuthWrapper>
  )
}
