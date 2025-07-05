import Link from "next/link"
import { BookOpen, ArrowRight, Users, Recycle, Heart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-600 p-3 rounded-2xl">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">BookSwap</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Give your old books
            <span className="block text-emerald-400">a new life</span>
          </h1>

          {/* Value Proposition */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with fellow book lovers, discover your next great read, and build a sustainable reading
            community—one exchange at a time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-emerald-600 hover:text-emerald-400 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              Log In
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Community Driven</h3>
              <p className="text-gray-400">Connect with book lovers in your area and build lasting friendships.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sustainable</h3>
              <p className="text-gray-400">Give books a second life while discovering new favorites for free.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy & Safe</h3>
              <p className="text-gray-400">Simple exchange process with built-in messaging and user ratings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
