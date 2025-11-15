"use client"

import type React from "react"

import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { format } from "date-fns"
import {
  Heart,
  MessageSquare,
  Tag,
  Trash2,
  Edit,
  User,
  Share2,
  ArrowLeft,
  Clock,
  Eye,
  BookOpen,
  Send,
  Sparkles,
} from "lucide-react"
import { fetchBlogById, toggleBlogLike, addBlogComment, deleteBlog } from "../../store/slices/blogSlice"
import type { AppDispatch, RootState } from "../../store/store"
import ShareModal from "../../components/ShareModal"
import UserContext from "../../context/UserContext"

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { blog, loading, error } = useSelector((state: RootState) => state.blogs)
  const { user } = useContext(UserContext)

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id))
    }
  }, [dispatch, id])

  const handleLike = async () => {
    if (!user) {
      navigate("/login")
      return
    }
    if (id) {
      await dispatch(toggleBlogLike(id))
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await dispatch(deleteBlog(id!)).unwrap()
        navigate("/blogs")
      } catch (error) {
        console.error("Failed to delete blog:", error)
      }
    }
  }

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) {
      navigate("/login")
      return
    }

    const form = e.currentTarget
    const content = new FormData(form).get("comment") as string

    if (content.trim() && id) {
      try {
        await dispatch(addBlogComment({ id, content })).unwrap()
        form.reset()
      } catch (error) {
        console.error("Failed to add comment:", error)
      }
    }
  }

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl max-w-md mx-4 relative">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Article Not Found</h2>
          <p className="text-slate-300 mb-8">{error || "The article you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/blogs")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Back to Articles
          </button>
        </div>
      </div>
    )
  }

  const isAuthor = user && (user._id === blog.authorId?._id || user.role === "admin")
  const hasLiked = user && blog.likes?.includes(user._id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative pt-[80px]">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/blogs")}
                className="group flex items-center text-slate-300 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all duration-300">
                  <ArrowLeft className="h-5 w-5" />
                </div>
                <span className="font-medium">Back to Articles</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Article Card */}
          <article className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Hero Image */}
            <div className="relative overflow-hidden">
              <img
                src={blog.thumbnail || "https://images.pexels.com/photos/3243/pen-notebook-notes-studying.jpg"}
                alt={blog.title || "Blog thumbnail"}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-semibold shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Featured Article
                </span>
              </div>
              <div className="absolute top-6 right-6">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold">5 min read</span>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              {/* Author and Meta Info */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{blog.authorId?.name || "Expert Author"}</p>
                    <time className="text-slate-400">
                      {blog.createdAt && !isNaN(new Date(blog.createdAt).getTime())
                        ? format(new Date(blog.createdAt), "MMMM d, yyyy")
                        : "Recent"}
                    </time>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-blue-400" />
                    <span className="font-medium">2.5K views</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  {blog.title || "Untitled Blog"}
                </span>
              </h1>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 rounded-xl text-sm font-semibold border border-blue-500/30"
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg prose-invert max-w-none mb-12">
                {blog.content?.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-6 text-slate-300 text-lg leading-relaxed">
                    {paragraph || ""}
                  </p>
                ))}
              </div>

              {/* Engagement Section */}
              <div className="flex items-center justify-between border-t border-white/10 pt-8">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                      hasLiked
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-white/10 text-slate-300 hover:text-red-400 border border-white/20 hover:bg-white/20"
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${hasLiked ? "fill-current" : ""}`} />
                    <span className="font-semibold">{blog.likes?.length || 0} likes</span>
                  </button>

                  <div className="flex items-center space-x-3 px-6 py-3 bg-white/10 border border-white/20 rounded-xl">
                    <MessageSquare className="h-6 w-6 text-blue-400" />
                    <span className="text-slate-300 font-semibold">{blog.comments?.length || 0} comments</span>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </article>

          {/* Enhanced Comments Section */}
          <div className="mt-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <MessageSquare className="h-8 w-8 mr-3 text-purple-400" />
                Comments ({blog.comments?.length || 0})
              </h2>

              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleComment} className="mb-12">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold mb-1">{user.name}</p>
                        <p className="text-slate-400 text-sm">Add your thoughts...</p>
                      </div>
                    </div>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Share your thoughts on this article..."
                      required
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        Post Comment
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center mb-12">
                  <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg mb-4">Join the conversation</p>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    Sign in to comment
                  </button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {blog.comments?.length > 0 ? (
                  blog.comments.map((comment) => (
                    <div key={comment._id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <p className="text-white font-semibold">
                              {user && comment.user?._id === user._id ? "You" : comment.user?.name || "Anonymous"}
                            </p>
                            <time className="text-slate-400 text-sm">
                              {comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                                ? format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")
                                : "Recently"}
                            </time>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{comment.content || "No comment content."}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
                    <p className="text-slate-400 text-lg">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareUrl={window.location.href}
          title={blog?.title || ""}
        />
      </div>
    </div>
  )
}

export default BlogDetail
