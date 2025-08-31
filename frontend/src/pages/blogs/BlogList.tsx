"use client"

import { useEffect, useContext, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import {
  Heart,
  MessageSquare,
  Tag,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PenTool,
  Sparkles,
  TrendingUp,
  Clock,
  Eye,
} from "lucide-react"
import { fetchBlogs } from "../../store/slices/blogSlice"
import type { AppDispatch, RootState } from "../../store/store"
import { UserContext } from "../../context/UserContext"

const BlogList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogs)
  const { user } = useContext(UserContext)

  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 9

  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = blogs.flatMap((blog) => blog.tags || [])
    return [...new Set(tags)]
  }, [blogs])

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = !selectedTag || blog.tags?.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [blogs, searchTerm, selectedTag])

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)
  const startIndex = (currentPage - 1) * blogsPerPage
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedTag])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500/30 border-t-purple-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-purple-500/20"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl text-center max-w-md mx-4 relative">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-slate-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative pt-14">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Enhanced Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/20 rounded-full text-purple-300 text-sm font-semibold mb-8">
              <Sparkles className="w-5 h-5 mr-2" />
              Knowledge & Insights
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Expert Blog Posts
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                & Industry Insights
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Discover the latest trends, best practices, and expert insights from industry leaders. Stay ahead with our
              comprehensive collection of articles and tutorials.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: BookOpen, value: `${blogs.length}+`, label: "Articles" },
                { icon: User, value: "Expert", label: "Authors" },
                { icon: TrendingUp, value: "Weekly", label: "Updates" },
                { icon: Eye, value: "10K+", label: "Readers" },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          {user && (user.role === "admin" || user.role === "instructor") && (
            <Link
              to="/blogs/create"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <PenTool className="h-5 w-5 mr-2" />
              Create New Post
            </Link>
          )}
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Enhanced Search */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md"
              />
            </div>

            {/* Tag Filter */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Tag className="h-5 w-5 text-blue-400" />
              </div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md appearance-none"
              >
                <option value="" className="bg-slate-800">
                  All Topics
                </option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag} className="bg-slate-800">
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedTag("")
              }}
              className="px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-md"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Enhanced Blog Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {paginatedBlogs.map((blog) => (
            <article
              key={blog._id}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-xl"
            >
              <Link to={`/blogs/${blog._id}`} className="block">
                <div className="relative overflow-hidden">
                  <img
                    src={blog.thumbnail || "https://images.pexels.com/photos/3243/pen-notebook-notes-studying.jpg"}
                    alt={blog.title || "Blog thumbnail"}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-semibold">5 min read</span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="p-8">
                {/* Author and Date */}
                <div className="flex items-center mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-white font-semibold">{blog.authorId?.name || "Expert Author"}</p>
                    <time className="text-slate-400 text-sm">
                      {blog.createdAt && !isNaN(new Date(blog.createdAt).getTime())
                        ? format(new Date(blog.createdAt), "MMM d, yyyy")
                        : "Recent"}
                    </time>
                  </div>
                </div>

                {/* Title and Content */}
                <Link to={`/blogs/${blog._id}`}>
                  <h2 className="text-2xl font-bold text-white mb-4 hover:text-purple-300 transition-colors duration-300 line-clamp-2 leading-tight">
                    {blog.title || "Untitled Blog"}
                  </h2>
                </Link>

                <p className="text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                  {blog.content || "Discover insights and knowledge from industry experts."}
                </p>

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      >
                        #{tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
                        +{blog.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center text-slate-300 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="h-5 w-5 mr-2 text-red-400" />
                      <span className="font-medium">{blog.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center text-slate-300 group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
                      <span className="font-medium">{blog.comments?.length || 0}</span>
                    </div>
                  </div>
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 backdrop-blur-md font-semibold"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                        : "bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 backdrop-blur-md font-semibold"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}

        {/* Enhanced No Results */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No articles found</h3>
            <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find the perfect article for you.
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedTag("")
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList
