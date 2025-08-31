"use client"

import { useEffect, useState, useMemo, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  BookOpen,
  Star,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Target,
  Globe,
  Play,
} from "lucide-react"
import { fetchCourses } from "../../store/slices/courseSlice"
import type { AppDispatch, RootState } from "../../store/store"
import UserContext from "../../context/UserContext"

const CourseList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { courses, loading, error } = useSelector((state: RootState) => state.courses)
  const { user } = useContext(UserContext)

  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("grid")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [minRating, setMinRating] = useState(0)
  const coursesPerPage = 9

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchCourses({ published: "all" }))
    } else {
      dispatch(fetchCourses())
    }
  }, [dispatch, user])

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "" || course.category === selectedCategory
      const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1]
      const matchesRating = (course.rating || 0) >= minRating

      return matchesSearch && matchesCategory && matchesPrice && matchesRating
    })

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "students":
          return (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0)
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        default:
          return a.title.localeCompare(b.title)
      }
    })

    return filtered
  }, [courses, searchTerm, selectedCategory, sortBy, priceRange, minRating])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCourses.length / coursesPerPage)
  const startIndex = (currentPage - 1) * coursesPerPage
  const paginatedCourses = filteredAndSortedCourses.slice(startIndex, startIndex + coursesPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortBy, priceRange, minRating])

  const categories = ["Programming", "Design", "Business", "Marketing", "Data Science", "Photography"]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500/30 border-t-purple-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-purple-500/20"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl max-w-md mx-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Something went wrong</h2>
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
              <Zap className="w-5 h-5 mr-2" />
              Discover Your Potential
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Transform Your Future
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                With Expert Courses
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Unlock your potential with our comprehensive collection of courses. From beginner-friendly tutorials to
              advanced masterclasses, find the perfect course to elevate your skills and accelerate your career.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: BookOpen, value: `${courses.length}+`, label: "Expert Courses" },
                { icon: Users, value: "50K+", label: "Active Students" },
                { icon: Award, value: "95%", label: "Success Rate" },
                { icon: Globe, value: "120+", label: "Countries" },
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

      {/* Enhanced Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl">
          {/* Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Enhanced Search */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md"
            >
              <option value="" className="bg-slate-800">
                All Categories
              </option>
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md"
            >
              <option value="title" className="bg-slate-800">
                Sort by Title
              </option>
              <option value="price-low" className="bg-slate-800">
                Price: Low to High
              </option>
              <option value="price-high" className="bg-slate-800">
                Price: High to Low
              </option>
              <option value="rating" className="bg-slate-800">
                Highest Rated
              </option>
              <option value="students" className="bg-slate-800">
                Most Popular
              </option>
              <option value="newest" className="bg-slate-800">
                Newest First
              </option>
            </select>

            {/* View Mode */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Grid className="h-5 w-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                <List className="h-5 w-5 mx-auto" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Price Range */}
            <div>
              <label className="block text-white text-sm font-semibold mb-4">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <div className="flex space-x-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                  className="flex-1 accent-purple-500"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                  className="flex-1 accent-purple-500"
                />
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-white text-sm font-semibold mb-4">Minimum Rating: {minRating} stars</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <p className="text-slate-300 text-lg">
              Showing {startIndex + 1}-{Math.min(startIndex + coursesPerPage, filteredAndSortedCourses.length)} of{" "}
              {filteredAndSortedCourses.length} courses
            </p>
            {filteredAndSortedCourses.length === 0 && (
              <div className="inline-flex items-center px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-semibold">
                <Target className="w-4 h-4 mr-2" />
                No courses match your filters
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Course Grid/List */}
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12" : "space-y-8 mb-12"
          }
        >
          {paginatedCourses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500 ${
                viewMode === "list" ? "flex h-[280px]" : ""
              }`}
            >
              <div className={viewMode === "list" ? "w-1/3" : "aspect-w-16 h-24fsda"}>
                <div className="relative h-[280px] overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                      viewMode === "list" ? "w-full h-[280px]" : "w-full h-56"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {course.category || "Featured"}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-semibold">{course.rating || 4.8}</span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-8 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-purple-300 text-sm font-medium uppercase tracking-wide">
                    {course.category || "Course"}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 mb-4 transition-colors duration-300 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-slate-300 mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

                {/* Course Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6 text-sm text-slate-400">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-purple-400" />
                      <span>{course.lessons?.length || 0} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span>{course.enrolledStudents?.length || 0} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-emerald-400" />
                      <span>12h 30m</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      ₹{course.price}
                    </span>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="text-lg text-slate-400 line-through">₹{course.originalPrice}</span>
                    )}
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg">
                    {course.price === 0 ? "Free" : "Enroll Now"}
                  </button>
                </div>

                {/* Popular Badge */}
                {(course.enrolledStudents?.length || 0) > 100 && (
                  <div className="mt-4 inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Popular Choice
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 backdrop-blur-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              const isVisible = Math.abs(pageNum - currentPage) <= 2 || pageNum === 1 || pageNum === totalPages

              if (!isVisible) {
                if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return (
                    <span key={pageNum} className="px-2 text-slate-400">
                      ...
                    </span>
                  )
                }
                return null
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
                    currentPage === pageNum
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 backdrop-blur-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseList
