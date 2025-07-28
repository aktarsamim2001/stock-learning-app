"use client"

import { Link } from "react-router-dom"
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        ></div>
      ))}

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4 animate-pulse">
          404
        </h1>

        {/* Error Message */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 transform hover:scale-105 transition-all duration-300">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Oops! Page Not Found</h2>
          <p className="text-lg text-slate-300 mb-6 leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. Don't worry though, even the
            best explorers sometimes take a wrong turn!
          </p>

          {/* Suggestions */}
          <div className="bg-white/5 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2" />
              What you can do:
            </h3>
            <ul className="text-slate-300 space-y-2 text-left">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                Check the URL for any typos
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Go back to the previous page
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                Visit our homepage to start fresh
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-purple-300">Fun fact:</span> The term "404" comes from the room number
            at CERN where the original web servers were located!
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
