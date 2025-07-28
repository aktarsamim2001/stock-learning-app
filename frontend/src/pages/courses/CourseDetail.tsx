"use client"

import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Play,
  Download,
  CheckCircle,
  Globe,
  Award,
  User,
  ArrowLeft,
  PlayCircle,
  Lock,
  Shield,
  Zap,
  Target,
  TrendingUp,
  MessageCircle,
} from "lucide-react"
import { toast } from "react-toastify"
import UserContext from "../../context/UserContext"
import { fetchCourseById } from "../../store/slices/courseSlice"
import { enrollInCourse } from "../../store/slices/enrollmentSlice"
import { createPayment } from "../../store/slices/paymentSlice"
import type { AppDispatch, RootState } from "../../store/store"
import ShareModal from "../../components/ShareModal"
import { verifyAndEnrollPaidCourse } from "../../store/slices/enrollmentSlice"

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { course, loading, error } = useSelector((state: RootState) => state.courses)
  const { user, loading: authLoading } = useContext(UserContext)

  const [activeTab, setActiveTab] = useState("overview")
  // const [isWishlisted, setIsWishlisted] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [enrolling, setEnrolling] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (id && id !== "create") {
      dispatch(fetchCourseById(id))
    }
  }, [dispatch, id])
    
  // const handleEnroll = async () => {
  //   if (!user || !user._id) {
  //     sessionStorage.setItem("enrollAfterLogin", id || "")
  //     navigate("/login")
  //     return
  //   }

  //   try {
  //     if (course?.price === 0) {
  //       await dispatch(enrollInCourse(id!)).unwrap()
  //       toast.success("Successfully enrolled in the course!")
  //     } else {
  //       await dispatch(createPayment(id!)).unwrap()
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.message || "Enrollment failed. Please try again.")
  //     console.error("Enrollment failed:", error)
  //   }
  // }

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  // Razorpay script loader
  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const handleEnroll = async () => {
    if (!user || !user._id) {
      sessionStorage.setItem("enrollAfterLogin", id || "")
      navigate("/login")
      return
    }

    try {
      setEnrolling(true)
      if (course?.price === 0) {
        await dispatch(enrollInCourse(id!)).unwrap()
        toast.success("Successfully enrolled in the course!")
      } else {
        // 1. Create Razorpay order
        const { orderId, amount, currency } = await dispatch(createPayment(id!)).unwrap()

        // 2. Load Razorpay script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Failed to load Razorpay. Please try again.");
          setEnrolling(false);
          return;
        }

        // 3. Open Razorpay checkout
        const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!key) {
          toast.error("Razorpay key is missing. Please contact support.");
          setEnrolling(false);
          return;
        }
        const options = {
          key,
          amount,
          currency,
          name: course?.title,
          description: course?.description,
          order_id: orderId,
          handler: async function (response: any) {
            // 3. On payment success, verify and enroll
            await dispatch(
              verifyAndEnrollPaidCourse({
                courseId: id!,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              })
            ).unwrap()
            setPaymentSuccess(true);
            toast.success("Payment successful! You are now enrolled.")
          },
          prefill: {
            email: user.email,
            name: user.name,
          },
          theme: { color: "#6366f1" },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (error: any) {
      toast.error(error?.message || "Enrollment failed. Please try again.")
      console.error("Enrollment failed:", error)
    } finally {
      setEnrolling(false)
    }
  }

  const totalDuration = course?.lessons?.reduce((acc, lesson) => acc + (lesson.duration || 0), 0) || 0
  // const isEnrolled = user && course?.enrolledStudents?.includes(user._id)

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500/30 border-t-purple-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-purple-500/20"></div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl max-w-md mx-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Course Not Found</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            {error || "The course you are looking for does not exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative pt-16">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {/* Navigation */}
          <button
            onClick={() => navigate("/courses")}
            className="group flex items-center text-slate-300 hover:text-white mb-8 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all duration-300">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Back to Courses</span>
          </button>

          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Course Information */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/20 rounded-full text-purple-300 text-sm font-semibold">
                    <Zap className="w-4 h-4 mr-2" />
                    {course.category || "Featured Course"}
                  </span>
                  {course?.level && (
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-md border border-white/20 rounded-full text-emerald-300 text-sm font-semibold">
                      <Target className="w-4 h-4 mr-2" />
                      {course?.level}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    {course.title}
                  </span>
                </h1>

                <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-4xl">{course.description}</p>

                {/* Enhanced Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{course.rating || 4.8}</div>
                    <div className="text-slate-400 text-sm">Rating</div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{course.enrolledStudents?.length || 0}</div>
                    <div className="text-slate-400 text-sm">Students</div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    </div>
                    <div className="text-slate-400 text-sm">Duration</div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{course.language || "EN"}</div>
                    <div className="text-slate-400 text-sm">Language</div>
                  </div>
                </div>

                {/* Enhanced Instructor Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {course.instructor?.name || "Expert Instructor"}
                      </h3>
                      <p className="text-purple-300 mb-2">{course.instructor?.title || "Industry Professional"}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span className="flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          Expert Level
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Top Rated
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-8 shadow-2xl">
                {/* Course Preview */}
                <div className="relative mb-8 rounded-2xl overflow-hidden group">
                  <img
                    src={course.thumbnail || "https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg"}
                    alt={course.title}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 group">
                      <PlayCircle className="h-10 w-10 text-white group-hover:text-purple-300" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Preview Available
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      ₹{course.price}
                    </span>
                    {course?.originalPrice && course?.originalPrice > course.price && (
                      <div className="text-right">
                        <span className="text-xl text-slate-400 line-through">₹{course.originalPrice}</span>
                        <div className="text-sm text-emerald-400 font-semibold">
                          {Math.round(((course?.originalPrice - course.price) / course?.originalPrice) * 100)}% OFF
                        </div>
                      </div>
                    )}
                  </div>
                  {course.price === 0 && (
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-semibold mb-4">
                      <Zap className="w-4 h-4 mr-2" />
                      Free Course
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {/* Show payment/enrollment status message for user */}
                {(course.isEnrolled || paymentSuccess) && (
                  <div className="text-emerald-400 text-center font-semibold text-lg mb-2">
                    {paymentSuccess
                      ? "Payment successful! All lessons unlocked."
                      : "You are already enrolled. All lessons are unlocked for you."}
                  </div>
                )}
                <div className="space-y-4 mb-8">
                  {course.isEnrolled || paymentSuccess ? (
                    <>
                      <button
                        onClick={() => navigate(`/courses/${id}/learn`)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-6 rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg flex items-center justify-center"
                      >
                        <Play className="h-6 w-6 mr-2" />
                        Continue Learning
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                    >
                      {enrolling
                        ? "Processing..."
                        : course.price === 0
                          ? "Enroll for Free"
                          : "Enroll Now"}
                    </button>
                  )}
                  {/* Course Includes */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-6">This course includes:</h3>
                    <div className="space-y-4">
                      {[
                        {
                          icon: BookOpen,
                          text: `${course.lessons?.length || 0} comprehensive lessons`,
                          color: "text-blue-400",
                        },
                        {
                          icon: Clock,
                          text: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m of content`,
                          color: "text-purple-400",
                        },
                        { icon: Download, text: "Downloadable resources", color: "text-emerald-400" },
                        { icon: Award, text: "Certificate of completion", color: "text-amber-400" },
                        { icon: Globe, text: "Lifetime access", color: "text-indigo-400" },
                        { icon: Shield, text: "30-day money-back guarantee", color: "text-green-400" },
                      ].map((item, index) => {
                        const Icon = item.icon
                        return (
                          <div key={index} className="flex items-center space-x-3">
                            <Icon className={`h-5 w-5 ${item.color}`} />
                            <span className="text-slate-300 text-sm">{item.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              {/* Enhanced Tab Navigation */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 mb-8">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "overview", label: "Overview", icon: BookOpen },
                    { id: "curriculum", label: "Curriculum", icon: PlayCircle },
                    { id: "instructor", label: "Instructor", icon: User },
                    { id: "reviews", label: "Reviews", icon: MessageCircle },
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-center space-x-2 py-4 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "text-slate-300 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Enhanced Tab Content */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6">Course Overview</h2>
                      <p className="text-slate-300 text-lg leading-relaxed mb-8">{course.description}</p>

                      {course.learningObjectives && course.learningObjectives.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                            <Target className="h-6 w-6 mr-3 text-purple-400" />
                            What you'll learn
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course?.learningObjectives.map((objective: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10"
                              >
                                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-300">{objective}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <div>
                          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                            <Shield className="h-6 w-6 mr-3 text-blue-400" />
                            Prerequisites
                          </h3>
                          <div className="space-y-3">
                            {course?.prerequisites.map((prereq: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10"
                              >
                                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-300">{prereq}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                      <PlayCircle className="h-8 w-8 mr-3 text-purple-400" />
                      Course Curriculum
                    </h2>
                    <div className="space-y-4">
                      {course.lessons?.map((lesson, index) => (
                        <div
                          key={index}
                          className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${lesson.unlocked ? "hover:bg-white/10" : "opacity-60"}`}
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                  <span className="text-white font-bold">{index + 1}</span>
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-white mb-1">{lesson.title}</h4>
                                  <p className="text-slate-400">{lesson?.description || "Master the fundamentals"}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-6">
                                <div className="text-right">
                                  <div className="text-slate-300 font-medium">{lesson.duration || 15} min</div>
                                  <div className="text-slate-500 text-sm">Duration</div>
                                </div>
                                {lesson.unlocked ? (
                                  lesson.video ? (
                                    <button
                                      className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center hover:bg-emerald-500/40 transition-all"
                                      onClick={() => window.open(lesson.video, "_blank")}
                                      title="Watch Lesson"
                                    >
                                      <PlayCircle className="h-5 w-5 text-emerald-400" />
                                    </button>
                                  ) : (
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                      <PlayCircle className="h-5 w-5 text-emerald-400" />
                                    </div>
                                  )
                                ) : (
                                  <div className="w-10 h-10 bg-slate-500/20 rounded-full flex items-center justify-center" title="Locked">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "instructor" && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                      <User className="h-8 w-8 mr-3 text-purple-400" />
                      Meet Your Instructor
                    </h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                      <div className="flex items-start space-x-6">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <User className="h-12 w-12 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {course.instructor?.name || "Expert Instructor"}
                          </h3>
                          {course.instructor?.title && (
                            <p className="text-purple-300 text-lg mb-4">{course.instructor.title}</p>
                          )}
                          <div className="flex items-center space-x-6 mb-6">
                            <div className="flex items-center space-x-2">
                              <Award className="h-5 w-5 text-amber-400" />
                              <span className="text-slate-300">Expert Level</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-5 w-5 text-emerald-400" />
                              <span className="text-slate-300">Top Rated</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-5 w-5 text-blue-400" />
                              <span className="text-slate-300">10K+ Students</span>
                            </div>
                          </div>
                          {course?.instructor?.bio && (
                            <p className="text-slate-300 leading-relaxed">{course?.instructorId?.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                      <MessageCircle className="h-8 w-8 mr-3 text-purple-400" />
                      Student Reviews
                    </h2>
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Star className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-4">Reviews Coming Soon</h3>
                      <p className="text-slate-400 max-w-md mx-auto">
                        Student reviews and ratings will appear here once the course receives feedback from enrolled
                        students.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="space-y-6">
                {/* Course Statistics */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-semibold text-white mb-6">Course Statistics</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Enrolled Students", value: course?.enrolledStudents?.length || 0, icon: Users },
                      { label: "Course Rating", value: course?.rating || 4.8, icon: Star },
                      { label: "Completion Rate", value: "94%", icon: TrendingUp },
                      { label: "Language", value: course?.language || "English", icon: Globe },
                    ].map((stat, index) => {
                      const Icon = stat.icon
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-purple-400" />
                            <span className="text-slate-300">{stat.label}</span>
                          </div>
                          <span className="text-white font-semibold">{stat.value}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Related Courses Placeholder */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-semibold text-white mb-6">You might also like</h3>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-slate-400">Related courses will appear here based on your interests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareUrl={window.location.href}
          title={course?.title || ""}
        />
      </div>
    </div>
  );
}

export default CourseDetail;
