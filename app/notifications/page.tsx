"use client"

import { useState, useEffect } from "react"
import { Clock, User, BookOpen, Bell, Check, X } from "lucide-react"
import { apiService } from "@/lib/api"

interface Notification {
  id: string
  title: string
  message: string
  type: "exchange" | "accepted" | "rejected" | "completed" | "profile" | "follow" | "listing" | "welcome"
  isRead: boolean
  createdAt: string
  relatedId?: string
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiService.getNotifications()
      if (result.success && result.data) {
        setNotifications(result.data)
      } else {
        setError(result.error || "Failed to fetch notifications")
      }
    } catch (error) {
      setError("Failed to fetch notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const result = await apiService.markNotificationAsRead(notificationId)
      if (result.success) {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: true } : notif)),
        )
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const result = await apiService.markAllNotificationsAsRead()
      if (result.success) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "exchange":
      case "accepted":
      case "completed":
        return <BookOpen className="h-5 w-5 text-emerald-400" />
      case "rejected":
        return <X className="h-5 w-5 text-red-400" />
      case "profile":
      case "follow":
        return <User className="h-5 w-5 text-indigo-400" />
      case "listing":
        return <BookOpen className="h-5 w-5 text-cyan-400" />
      default:
        return <Bell className="h-5 w-5 text-gray-400" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.isRead)
  const readNotifications = notifications.filter((n) => n.isRead)

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-400">Stay updated with your book exchanges and community activity</p>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No notifications yet</p>
            <p className="text-gray-500">When you start exchanging books, you'll see notifications here.</p>
          </div>
        ) : (
          <>
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Unread ({unreadNotifications.length})</h2>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span>Mark all as read</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className="bg-gray-800 border border-emerald-700 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{notification.title}</p>
                          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeAgo(notification.createdAt)}
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read Notifications */}
            {readNotifications.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Earlier</h2>
                <div className="space-y-3">
                  {readNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-300">{notification.title}</p>
                          <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeAgo(notification.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
