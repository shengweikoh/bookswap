"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRightLeft, Clock } from "lucide-react"
import { apiService } from "@/lib/api"
import { formatTimeAgo } from "@/lib/types"

export default function RecentSwaps() {
  const [swaps, setSwaps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentSwaps()
  }, [])

  const fetchRecentSwaps = async () => {
    try {
      const result = await apiService.getRecentSwaps()
      if (result.success && result.data) {
        // Get the most recent 5 swaps
        setSwaps(result.data.slice(0, 5))
      }
    } catch (error) {
      console.error("Failed to fetch recent swaps:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Swaps</h2>
        <div className="text-gray-400">Loading recent swaps...</div>
      </section>
    )
  }

  if (swaps.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Swaps</h2>
        <div className="text-gray-400">No recent swaps to display</div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Recent Swaps</h2>

      <div className="grid gap-4">
        {swaps.map((swap) => (
          <div
            key={swap.id}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={swap.requester?.avatar || "/images/avatars/default-avatar.svg"}
                    alt={swap.requester?.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{swap.requester?.name || "User"}</p>
                    <p className="text-sm text-gray-300">Exchanged with</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-emerald-400">
                  <ArrowRightLeft className="h-5 w-5" />
                </div>

                <div className="flex items-center space-x-3">
                  <Image
                    src={swap.owner?.avatar || "/images/avatars/default-avatar.svg"}
                    alt={swap.owner?.name || "Owner"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{swap.owner?.name || "Owner"}</p>
                    <p className="text-sm text-gray-300">for "{swap.book?.title || "Book"}"</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatTimeAgo(swap.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
