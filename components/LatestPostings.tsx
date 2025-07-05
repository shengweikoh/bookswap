import Image from "next/image"
import { Clock, MapPin } from "lucide-react"
import Link from "next/link"

const latestPostings = [
  {
    id: "post1",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    condition: "New",
    owner: "Jennifer Lee",
    location: "Downtown",
    timeAgo: "30 minutes ago",
    image: "/placeholder.svg?height=80&width=60",
  },
  {
    id: "post2",
    title: "Becoming",
    author: "Michelle Obama",
    condition: "Good",
    owner: "Michael Chen",
    location: "Uptown",
    timeAgo: "1 hour ago",
    image: "/placeholder.svg?height=80&width=60",
  },
  {
    id: "post3",
    title: "The Alchemist",
    author: "Paulo Coelho",
    condition: "Good",
    owner: "Lisa Rodriguez",
    location: "Midtown",
    timeAgo: "2 hours ago",
    image: "/placeholder.svg?height=80&width=60",
  },
  {
    id: "post4",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    condition: "Worn",
    owner: "Tom Anderson",
    location: "Westside",
    timeAgo: "3 hours ago",
    image: "/placeholder.svg?height=80&width=60",
  },
]

export default function LatestPostings() {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800"
      case "Good":
        return "bg-yellow-100 text-yellow-800"
      case "Worn":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Latest Postings</h2>

      <div className="grid gap-4">
        {latestPostings.map((posting) => (
          <div
            key={posting.id}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={posting.image || "/placeholder.svg"}
                alt={posting.title}
                width={60}
                height={80}
                className="rounded-md object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white">{posting.title}</h3>
                <p className="text-gray-300 mb-2">by {posting.author}</p>

                <div className="flex items-center space-x-4 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(posting.condition)}`}
                  >
                    {posting.condition}
                  </span>
                  <span className="text-sm text-gray-300">by {posting.owner}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{posting.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{posting.timeAgo}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/listing/${posting.id}`}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
