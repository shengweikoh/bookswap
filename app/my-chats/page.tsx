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

interface ExchangeRequest {
  id: string
  bookId: string
  requesterId: string
  ownerId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}

function MyChatContent() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showChatList, setShowChatList] = useState(true)
  const [exchangeRequest, setExchangeRequest] = useState<ExchangeRequest | null>(null)
  const [exchangeRequestLoading, setExchangeRequestLoading] = useState(false)
  const [chatDataReady, setChatDataReady] = useState(false)
  const [userDataValidated, setUserDataValidated] = useState(false)
  const [conversationSwitching, setConversationSwitching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get chat parameters from URL (when coming from listing page or chat dropdown)
  const bookId = searchParams.get("bookId")
  const ownerId = searchParams.get("ownerId")
  const chatId = searchParams.get("chatId")

  useEffect(() => {
    // Only fetch chats when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated && user) {
      fetchChats()
    } else if (!authLoading && !isAuthenticated) {
      // Authentication complete but user is not authenticated, stop loading
      setLoading(false)
    }
    // Don't do anything if authLoading is true (still checking authentication)
  }, [authLoading, isAuthenticated, user])

  useEffect(() => {
    if (selectedChat && isAuthenticated && user) {
      // Mark conversation as switching and data as not ready
      setConversationSwitching(true)
      setChatDataReady(false)
      setUserDataValidated(false)
      
      // Clear existing data when switching chats to prevent showing stale data
      setMessages([])
      setExchangeRequest(null)
      setExchangeRequestLoading(false)
      
      // Step 1: Validate user data is properly loaded
      const validateUserData = async () => {
        try {
          // Double-check that user data is complete and consistent
          if (!user.id || !isAuthenticated) {
            throw new Error('User data incomplete')
          }
          
          // Add a small delay to ensure user state is stable
          await new Promise(resolve => setTimeout(resolve, 50))
          
          setUserDataValidated(true)
          
          // Step 2: After user validation, fetch chat data
          await Promise.all([
            fetchMessages(selectedChat.id),
            fetchExchangeRequest(selectedChat.bookId)
          ])
          
        } catch (error) {
          console.error('Error during conversation switch:', error)
        } finally {
          // Mark all data as ready
          setChatDataReady(true)
          setConversationSwitching(false)
        }
      }
      
      validateUserData()
      
    } else {
      // Reset states when no chat is selected
      setChatDataReady(false)
      setUserDataValidated(false)
      setConversationSwitching(false)
    }
  }, [selectedChat, isAuthenticated, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Ensure user is authenticated before making API calls
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, skipping chat fetch')
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
          setLoading(false)
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
      setError("Failed to load chats. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const retryFetch = () => {
    fetchChats()
  }

  const fetchMessages = async (chatId: string) => {
    if (!chatId || !isAuthenticated || !user) {
      console.log('Invalid chatId or user not authenticated, skipping message fetch')
      return
    }

    // Ensure user data is validated before proceeding
    if (!userDataValidated && !conversationSwitching) {
      return
    }

    try {
      setMessagesLoading(true)
      
      // Fetch messages from API
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      })

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const messagesData = await response.json()
      
      // Ensure messagesData is an array before processing
      if (!Array.isArray(messagesData)) {
        console.error('Invalid messages data received:', messagesData)
        setMessages([])
        return
      }
      
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
      setMessages([]) // Set empty array on error to prevent rendering issues
    } finally {
      setMessagesLoading(false)
    }
  }

  const fetchExchangeRequest = async (bookId: string) => {
    if (!bookId || !isAuthenticated || !user) {
      console.log('Invalid bookId or user not authenticated, skipping exchange request fetch')
      setExchangeRequest(null)
      return
    }

    // Ensure user data is validated before proceeding
    if (!userDataValidated && !conversationSwitching) {
      return
    }

    try {
      setExchangeRequestLoading(true)
      
      // Fetch exchange request from API
      const response = await fetch(`/api/exchanges/requests?bookId=${bookId}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const exchangeData = await response.json()
        if (Array.isArray(exchangeData) && exchangeData.length > 0) {
          // Find the most recent exchange request for this book
          const latestRequest = exchangeData.find((req: any) => req.status === 'pending') || exchangeData[0]
          const exchangeRequestData = {
            id: latestRequest.id,
            bookId: latestRequest.bookId,
            requesterId: latestRequest.requesterId,
            ownerId: latestRequest.ownerId,
            status: latestRequest.status,
            createdAt: new Date(latestRequest.createdAt)
          }
          
          setExchangeRequest(exchangeRequestData)
        } else {
          setExchangeRequest(null)
        }
      } else {
        setExchangeRequest(null)
      }
    } catch (error) {
      console.error("Failed to fetch exchange request:", error)
      setExchangeRequest(null)
    } finally {
      setExchangeRequestLoading(false)
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
        senderId: messageData.senderId, // Use the senderId from API response
        content: messageData.message,   // Use the message from API response
        timestamp: new Date(messageData.createdAt),
        isRead: messageData.isRead,
      }

      setMessages([...messages, message])
      setNewMessage("")

      // Update chat's last message
      const updatedChats = chats.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: messageData.message, lastMessageTime: new Date() }
          : chat
      )
      setChats(updatedChats)
      setSelectedChat({ ...selectedChat, lastMessage: messageData.message, lastMessageTime: new Date() })

    } catch (error) {
      console.error("Failed to send message:", error)
      // Optionally show error message to user
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const filteredChats = chats.filter(chat => {
    // Add defensive checks to prevent errors
    if (!chat || !chat.otherUserName || !chat.bookTitle) return false
    
    return (
      chat.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleExchangeRequest = async () => {
    if (!selectedChat || !isAuthenticated || !user) return

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
        // Refresh the exchange request to get the updated state
        await fetchExchangeRequest(selectedChat.bookId)
      } else {
        const errorData = await response.json()
        console.error('Failed to send exchange request:', errorData.error)
      }
    } catch (error) {
      console.error('Error sending exchange request:', error)
    }
  }

  const handleAcceptExchange = async () => {
    if (!exchangeRequest) return

    try {
      const response = await fetch(`/api/exchanges/requests/${exchangeRequest.id}/accept`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Refresh the exchange request to get the updated state
        await fetchExchangeRequest(selectedChat?.bookId || '')
      } else {
        const errorData = await response.json()
        console.error('Failed to accept exchange request:', errorData.error)
      }
    } catch (error) {
      console.error('Error accepting exchange request:', error)
    }
  }

  const handleRejectExchange = async () => {
    if (!exchangeRequest) return

    try {
      const response = await fetch(`/api/exchanges/requests/${exchangeRequest.id}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Refresh the exchange request to get the updated state
        await fetchExchangeRequest(selectedChat?.bookId || '')
      } else {
        const errorData = await response.json()
        console.error('Failed to reject exchange request:', errorData.error)
      }
    } catch (error) {
      console.error('Error rejecting exchange request:', error)
    }
  }

  const renderExchangeButtons = () => {
    if (!selectedChat || !isAuthenticated || !user || !selectedChat.bookId) return null

    // Show loading spinner while user data is being validated or chat data is being fetched
    if (conversationSwitching || !userDataValidated || exchangeRequestLoading || !chatDataReady) {
      return (
        <div className="flex items-center space-x-1 px-3 py-1.5 text-xs lg:text-sm bg-gray-600 text-white rounded-lg">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          <span>Loading...</span>
        </div>
      )
    }

    // No exchange request exists - show Request Exchange button
    if (!exchangeRequest) {
      return (
        <button
          onClick={handleExchangeRequest}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs lg:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>Request Exchange</span>
        </button>
      )
    }

    // Exchange request exists - show different buttons based on status and user role
    const isRequester = exchangeRequest.requesterId === user.id
    const bookOwnerInitiated = exchangeRequest.requesterId === exchangeRequest.ownerId
    
    // Determine who can accept/reject:
    // - If book owner initiated: Other user (non-owner) can accept/reject
    // - If non-owner initiated: Book owner can accept/reject
    const canAcceptReject = bookOwnerInitiated ? !isRequester : (exchangeRequest.ownerId === user.id)

    switch (exchangeRequest.status) {
      case 'pending':
        if (isRequester) {
          // User who initiated the request sees yellow "Exchange Requested" button
          return (
            <button
              disabled
              className="flex items-center space-x-1 px-3 py-1.5 text-xs lg:text-sm bg-yellow-600 text-white rounded-lg cursor-not-allowed"
            >
              <span>Exchange Requested</span>
            </button>
          )
        } else if (canAcceptReject) {
          // User who can accept/reject sees Accept/Reject buttons
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAcceptExchange}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs lg:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>Accept Exchange</span>
              </button>
              <button
                onClick={handleRejectExchange}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs lg:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <span>Reject Exchange</span>
              </button>
            </div>
          )
        }
        break

      case 'accepted':
        return (
          <button
            disabled
            className="flex items-center space-x-1 px-3 py-1.5 text-xs lg:text-sm bg-green-600 text-white rounded-lg cursor-not-allowed"
          >
            <span>Exchange Accepted</span>
          </button>
        )

      case 'rejected':
        return (
          <button
            disabled
            className="flex items-center space-x-1 px-3 py-1.5 text-xs lg:text-sm bg-red-600 text-white rounded-lg cursor-not-allowed"
          >
            <span>Exchange Rejected</span>
          </button>
        )

      default:
        return null
    }

    return null
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>{authLoading ? 'Authenticating...' : 'Loading chats...'}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Please log in to access your chats</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={retryFetch}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
        </div>
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
            }`} key={selectedChat?.id || 'no-chat'}>
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
                          <h3 className="font-medium text-white">{selectedChat.otherUserName || 'Unknown User'}</h3>
                          <p className="text-sm text-gray-400">About: {selectedChat.bookTitle || 'Unknown Book'}</p>
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
                        {renderExchangeButtons()}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
                    {messagesLoading || !chatDataReady ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                          <p className="text-sm">Loading messages...</p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400 text-center">
                          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No messages yet</p>
                          <p className="text-sm mt-1">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isCurrentUser = message.senderId === user?.id
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isCurrentUser ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-3 lg:px-4 py-2 rounded-lg ${
                                isCurrentUser
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-700 text-gray-100'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-emerald-200' : 'text-gray-400'
                              }`}>
                                {formatTimeAgo(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
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
