"use client"

import type React from "react"
import { useState } from "react"
import { X, Send, Paperclip, Smile } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  ownerId: string
  ownerName: string
  ownerAvatar: string | null
  bookTitle: string
}

interface Message {
  id: string
  sender: "user" | "owner"
  content: string
  timestamp: Date
}

export default function ChatModal({ isOpen, onClose, ownerId, ownerName, ownerAvatar, bookTitle }: ChatModalProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "owner",
      content: `Hi! Thanks for your interest in "${bookTitle}". I'd be happy to discuss an exchange with you.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
  ])

  if (!isOpen) return null

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate owner response after a delay
    setTimeout(() => {
      const ownerResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "owner",
        content: "That sounds great! What books do you have available for exchange?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, ownerResponse])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} />

        <div className="relative w-full max-w-2xl h-[600px] bg-gray-800 border border-gray-700 rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Image
                src={ownerAvatar || "/images/avatars/default-avatar.svg"}
                alt={ownerName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <Link 
                  href={`/profile?userId=${ownerId}`}
                  className="font-medium text-white hover:text-emerald-400 transition-colors"
                >
                  {ownerName}
                </Link>
                <p className="text-sm text-gray-400">About &quot;{bookTitle}&quot;</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === "user" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-emerald-200" : "text-gray-500"}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <button type="button" className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                <Paperclip className="h-5 w-5" />
              </button>
              <button type="button" className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                <Smile className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
