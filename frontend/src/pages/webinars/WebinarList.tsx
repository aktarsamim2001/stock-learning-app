"use client";

import { useEffect, useContext, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Video,
  Clock,
  Users,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Award,
  PlayCircle,
  Zap,
  Globe,
  TrendingUp,
  Target,
  User,
  Sparkles,
} from "lucide-react";
import { fetchWebinars } from "../../store/slices/webinarSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { UserContext } from "../../context/UserContext";

// Mock data for demonstration
// const mockWebinars = [
//   {
//     _id: "1",
//     title: "Advanced React Patterns and Performance Optimization",
//     description:
//       "Deep dive into advanced React patterns, hooks optimization, and performance best practices for large-scale applications.",
//     speaker: {
//       name: "Dr. Sarah Johnson",
//       profileImage:
//         "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//     },
//     startTime: "2025-06-15T14:00:00Z",
//     duration: 90,
//     attendees: Array(127).fill(null),
//     category: "Frontend Development",
//   },
//   {
//     _id: "2",
//     title: "Machine Learning for Web Developers",
//     description:
//       "Introduction to implementing ML models in web applications using TensorFlow.js and practical use cases.",
//     speaker: {
//       name: "Prof. Michael Chen",
//       profileImage:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//     },
//     startTime: "2025-06-18T16:30:00Z",
//     duration: 120,
//     attendees: Array(89).fill(null),
//     category: "Machine Learning",
//   },
//   {
//     _id: "3",
//     title: "Cloud Architecture Best Practices",
//     description:
//       "Scalable cloud solutions, microservices architecture, and DevOps practices for modern applications.",
//     speaker: {
//       name: "Dr. Sarah Johnson",
//       profileImage:
//         "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//     },
//     startTime: "2025-06-22T13:00:00Z",
//     duration: 75,
//     attendees: Array(156).fill(null),
//     category: "Cloud Computing",
//   },
//   {
//     _id: "4",
//     title: "UX Design Psychology & User Behavior",
//     description:
//       "Understanding user psychology, behavior patterns, and creating intuitive interfaces that convert.",
//     speaker: {
//       name: "Emma Rodriguez",
//       profileImage:
//         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
//     },
//     startTime: "2025-06-25T15:00:00Z",
//     duration: 60,
//     attendees: Array(203).fill(null),
//     category: "UX/UI Design",
//   },
//   {
//     _id: "5",
//     title: "Blockchain Development Fundamentals",
//     description:
//       "Smart contracts, DeFi protocols, and building decentralized applications on Ethereum.",
//     speaker: {
//       name: "Alex Thompson",
//       profileImage:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//     },
//     startTime: "2025-06-28T17:00:00Z",
//     duration: 105,
//     attendees: Array(78).fill(null),
//     category: "Blockchain",
//   },
//   {
//     _id: "6",
//     title: "Data Visualization with D3.js",
//     description:
//       "Creating interactive and beautiful data visualizations for web applications using D3.js and modern techniques.",
//     speaker: {
//       name: "Prof. Michael Chen",
//       profileImage:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//     },
//     startTime: "2025-07-02T14:30:00Z",
//     duration: 85,
//     attendees: Array(134).fill(null),
//     category: "Data Science",
//   },
// ];

const WebinarList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    webinars = mockWebinars,
    loading,
    error,
  } = useSelector((state: RootState) => state.webinars);
  const { user } = useContext(UserContext);

  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchWebinars());
  }, [dispatch]);

  // Get unique instructors and categories
  const instructors = useMemo(() => {
    const uniqueInstructors = [
      ...new Set(webinars.map((w) => w.speaker?.name).filter(Boolean)),
    ];
    return uniqueInstructors;
  }, [webinars]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(webinars.map((w) => w.category).filter(Boolean)),
    ];
    return uniqueCategories;
  }, [webinars]);

  // Filter webinars
  const filteredWebinars = useMemo(() => {
    return webinars.filter((webinar) => {
      const matchesSearch =
        webinar.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInstructor =
        !selectedInstructor || webinar.speaker?.name === selectedInstructor;
      const matchesCategory =
        !selectedCategory || webinar.category === selectedCategory;

      return matchesSearch && matchesInstructor && matchesCategory;
    });
  }, [webinars, searchTerm, selectedInstructor, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredWebinars.length / itemsPerPage);
  const paginatedWebinars = filteredWebinars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedInstructor, selectedCategory]);

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
    );
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
            <Video className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-slate-300">{error}</p>
        </div>
      </div>
    );
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
              Live Learning Experience
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Professional Webinars
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                With Industry Experts
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Join industry experts and thought leaders in interactive sessions
              designed to elevate your skills and advance your career through
              cutting-edge knowledge and practical insights.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Video,
                  value: `${webinars.length}+`,
                  label: "Live Sessions",
                },
                { icon: Users, value: "10K+", label: "Participants" },
                { icon: Award, value: "Expert", label: "Instructors" },
                { icon: Globe, value: "Global", label: "Community" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          {user && (user.role === "instructor" || user.role === "admin") && (
            <Link
              to="/webinars/create"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Video className="h-5 w-5 mr-2" />
              Create Webinar
            </Link>
          )}
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Enhanced Search */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search webinars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md"
              />
            </div>

            {/* Instructor Filter */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md appearance-none"
              >
                <option value="" className="bg-slate-800">
                  All Instructors
                </option>
                {instructors.map((instructor) => (
                  <option
                    key={instructor}
                    value={instructor}
                    className="bg-slate-800"
                  >
                    {instructor}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Target className="h-5 w-5 text-emerald-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md appearance-none"
              >
                <option value="" className="bg-slate-800">
                  All Categories
                </option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-slate-800"
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedInstructor("");
                setSelectedCategory("");
              }}
              className="px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-md"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Enhanced Webinar Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {paginatedWebinars.map((webinar) => (
            <div
              key={webinar._id}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-xl"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30">
                      <Zap className="w-4 h-4 mr-2" />
                      {webinar.category || "General"}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-300 bg-white/10 border border-white/20 px-3 py-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-4 w-4 mr-2 text-emerald-400" />
                    <span className="text-sm font-medium">
                      {webinar.duration || 60} mins
                    </span>
                  </div>
                </div>

                {/* Title and Description */}
                <h2 className="text-2xl font-bold text-white mb-4 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300 leading-tight">
                  {webinar.title || "Untitled Webinar"}
                </h2>

                <p className="text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                  {webinar.description ||
                    "Join us for an insightful session with industry experts."}
                </p>

                {/* Speaker Info */}
                <div className="flex items-center mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <img
                    src={
                      webinar.speaker?.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                    }
                    alt={webinar.speaker?.name || "Speaker"}
                    className="h-14 w-14 rounded-full border-2 border-white/30 group-hover:border-purple-400/50 transition-colors duration-300"
                  />
                  <div className="ml-4 flex-1">
                    <p className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {webinar.speaker?.name || "Expert Speaker"}
                    </p>
                    <p className="text-slate-400">Industry Expert & Trainer</p>
                  </div>
                </div>

                {/* Date and Registration Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <span className="text-slate-300 font-medium">
                        {webinar.startTime &&
                        !isNaN(new Date(webinar.startTime).getTime())
                          ? format(new Date(webinar.startTime), "MMM d, yyyy")
                          : "Date TBA"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      <span className="text-slate-300 font-medium">
                        {webinar.attendees?.length || 0} registered
                      </span>
                    </div>
                    {(webinar.attendees?.length || 0) > 100 && (
                      <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-semibold">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Popular
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={`/webinars/${webinar._id}`}
                  className="w-full inline-flex justify-center items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  View Details
                </Link>
              </div>
            </div>
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
                const pageNum = i + 1;
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
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 backdrop-blur-md font-semibold"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}

        {/* Enhanced No Results */}
        {filteredWebinars.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Video className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              No webinars found
            </h3>
            <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find the perfect
              webinar for you.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedInstructor("");
                setSelectedCategory("");
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarList;
