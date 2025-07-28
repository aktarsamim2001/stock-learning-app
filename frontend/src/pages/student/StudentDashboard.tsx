"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import {
  BookOpen,
  Award,
  Clock,
  Calendar,
  Video,
  ChevronRight,
  Download,
  TrendingUp,
  Target,
  PlayCircle,
  Users,
  Trophy,
  BookmarkCheck,
  GraduationCap,
  Zap,
} from "lucide-react"
import {
  fetchEnrolledCourses,
  fetchCertificates,
  fetchRecommendedCourses,
  fetchQuizResults,
  fetchUpcomingWebinars,
} from "../../store/slices/studentSlice"
import type { AppDispatch, RootState } from "../../store/store"

const StudentDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { enrolledCourses, certificates, recommendedCourses, quizResults, upcomingWebinars, loading, error } =
    useSelector((state: RootState) => state.student)

  useEffect(() => {
    dispatch(fetchEnrolledCourses())
    dispatch(fetchCertificates())
    dispatch(fetchRecommendedCourses())
    dispatch(fetchQuizResults())
    dispatch(fetchUpcomingWebinars())
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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

        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 border-r-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  const totalLearningHours =
    enrolledCourses?.reduce((acc, course) => {
      return acc + (course.courseId?.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0)
    }, 0) || 0

  const averageProgress = Math.round(
    enrolledCourses?.reduce((acc, course) => acc + (course.progress || 0), 0) / (enrolledCourses?.length || 1),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        ></div>
      ))}

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 mt-14">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
              Welcome Back, Student!
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Continue your learning journey and track your progress
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {[
              {
                icon: BookOpen,
                label: "Enrolled Courses",
                value: enrolledCourses?.length || 0,
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-500/20",
              },
              {
                icon: Award,
                label: "Certificates Earned",
                value: certificates?.length || 0,
                color: "from-yellow-500 to-orange-500",
                bgColor: "bg-yellow-500/20",
              },
              {
                icon: Clock,
                label: "Learning Hours",
                value: totalLearningHours,
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-500/20",
              },
              {
                icon: TrendingUp,
                label: "Average Progress",
                value: `${averageProgress}%`,
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-500/20",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            ))}
          </div>

          {/* Current Courses */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-8 py-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Your Courses</h3>
                      <p className="text-slate-300">Continue your learning journey</p>
                    </div>
                  </div>
                  <Link
                    to="/courses"
                    className="flex items-center text-purple-300 hover:text-purple-200 transition-colors duration-300 group"
                  >
                    <span className="mr-2">View all</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses?.map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            enrollment.courseId?.thumbnail ||
                            "https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg"
                          }
                          alt={enrollment.courseId?.title || "Course thumbnail"}
                          className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-white text-sm font-medium">{enrollment.progress || 0}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {enrollment.courseId?.title || "Untitled Course"}
                        </h4>

                        <div className="flex items-center mb-4">
                          <img
                            src={enrollment.courseId?.instructorId?.profileImage || "https://placehold.co/40"}
                            alt={enrollment.courseId?.instructorId?.name || "Instructor"}
                            className="h-8 w-8 rounded-full border-2 border-white/20"
                          />
                          <span className="ml-3 text-sm text-slate-300">
                            {enrollment.courseId?.instructorId?.name || "Unknown"}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Progress</span>
                            <span>{enrollment.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        <Link
                          to={`/courses/${enrollment.courseId?._id}`}
                          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 group"
                        >
                          <PlayCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Continue Learning
                        </Link>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 px-8 py-6 border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Your Certificates</h3>
                    <p className="text-slate-300">Download and share your achievements</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  {certificates?.map((certificate) => (
                    <div
                      key={certificate._id}
                      className="group flex items-center justify-between bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {certificate.courseId?.title || "Untitled Course"}
                          </h4>
                          <p className="text-sm text-slate-300">
                            Completed on{" "}
                            {certificate.completedAt && !isNaN(new Date(certificate.completedAt).getTime())
                              ? format(new Date(certificate.completedAt), "PPP")
                              : "Unknown date"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={certificate.certificateUrl || "#"}
                        download
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 group"
                      >
                        <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Webinars */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-8 py-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                      <Video className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Upcoming Webinars</h3>
                      <p className="text-slate-300">Join live sessions with experts</p>
                    </div>
                  </div>
                  <Link
                    to="/webinars"
                    className="flex items-center text-green-300 hover:text-green-200 transition-colors duration-300 group"
                  >
                    <span className="mr-2">View all</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  {upcomingWebinars?.map((webinar) => (
                    <div
                      key={webinar._id}
                      className="group flex items-center justify-between bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{webinar.title || "Untitled Webinar"}</h4>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                            <span className="text-sm text-slate-300">
                              {webinar.startTime && !isNaN(new Date(webinar.startTime).getTime())
                                ? format(new Date(webinar.startTime), "PPp")
                                : "Unknown date"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/webinars/${webinar._id}`}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 group"
                      >
                        <Users className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Join
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Results */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-8 py-6 border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Recent Quiz Results</h3>
                    <p className="text-slate-300">Track your knowledge assessment progress</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-6">
                  {quizResults?.map((result, index) => (
                    <div
                      key={index}
                      className="group bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <BookmarkCheck className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-white">{result.courseTitle || "Untitled Course"}</h4>
                      </div>

                      <div className="space-y-3">
                        {result.results?.map((quiz, quizIndex) => {
                          const percentage = quiz.totalQuestions
                            ? Math.round((quiz.score / quiz.totalQuestions) * 100)
                            : 0

                          return (
                            <div
                              key={quizIndex}
                              className="flex items-center justify-between bg-white/10 p-4 rounded-xl"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                    percentage >= 80
                                      ? "bg-green-500/20"
                                      : percentage >= 60
                                        ? "bg-yellow-500/20"
                                        : "bg-red-500/20"
                                  }`}
                                >
                                  <Zap
                                    className={`h-4 w-4 ${
                                      percentage >= 80
                                        ? "text-green-400"
                                        : percentage >= 60
                                          ? "text-yellow-400"
                                          : "text-red-400"
                                    }`}
                                  />
                                </div>
                                <span className="text-slate-300">Quiz {quizIndex + 1}</span>
                              </div>
                              <div className="flex items-center">
                                <span
                                  className={`text-lg font-bold mr-2 ${
                                    percentage >= 80
                                      ? "text-green-400"
                                      : percentage >= 60
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                  }`}
                                >
                                  {percentage}%
                                </span>
                                <span className="text-sm text-slate-400">
                                  ({quiz.score}/{quiz.totalQuestions})
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
