import Image from "next/image"
import { ArrowRightLeft, Clock } from "lucide-react"

const recentSwaps = [
  {
    id: "swap1",
    user1: { name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    user2: { name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40" },
    book1: "The Great Gatsby",
    book2: "To Kill a Mockingbird",
    timeAgo: "2 hours ago",
  },
  {
    id: "swap2",
    user1: { name: "Carol Davis", avatar: "/placeholder.svg?height=40&width=40" },
    user2: { name: "David Wilson", avatar: "/placeholder.svg?height=40&width=40" },
    book1: "Dune",
    book2: "The Hobbit",
    timeAgo: "5 hours ago",
  },
  {
    id: "swap3",
    user1: { name: "Eve Brown", avatar: "/placeholder.svg?height=40&width=40" },
    user2: { name: "Frank Miller", avatar: "/placeholder.svg?height=40&width=40" },
    book1: "Gone Girl",
    book2: "The Girl with the Dragon Tattoo",
    timeAgo: "1 day ago",
  },
]

export default function RecentSwaps() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Recent Swaps</h2>

      <div className="grid gap-4">
        {recentSwaps.map((swap) => (
          <div
            key={swap.id}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={swap.user1.avatar || "/placeholder.svg"}
                    alt={swap.user1.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{swap.user1.name}</p>
                    <p className="text-sm text-gray-300">{swap.book1}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-emerald-400">
                  <ArrowRightLeft className="h-5 w-5" />
                </div>

                <div className="flex items-center space-x-3">
                  <Image
                    src={swap.user2.avatar || "/placeholder.svg"}
                    alt={swap.user2.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{swap.user2.name}</p>
                    <p className="text-sm text-gray-300">{swap.book2}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Clock className="h-4 w-4" />
                <span>{swap.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
