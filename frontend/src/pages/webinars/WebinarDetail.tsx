"use client"

import type React from "react"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Video,
  Clock,
  Users,
  Calendar,
  Trash2,
  Edit,
  Star,
  Award,
  Share2,
  BookOpen,
  Target,
  CheckCircle,
  MapPin,
  Globe,
  Download,
  Heart,
  MessageCircle,
  ArrowLeft,
  PlayCircle,
  User,
  Mail,
  Zap,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react"
import { fetchWebinarById, deleteWebinar, checkWebinarRegistration } from "../../store/slices/webinarSlice"
import { registerForWebinar as registerForWebinarThunk } from "../../store/slices/webinarRegistrationSlice"
import type { AppDispatch, RootState } from "../../store/store"
import { toast } from "react-toastify"
import ShareModal from "../../components/ShareModal"
import UserContext from "../../context/UserContext"

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const WebinarDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { webinar, loading, error } = useSelector((state: RootState) => state.webinars)
  const registrationState = useSelector((state: RootState) => state.webinarRegistration)
  const { user } = useContext(UserContext)

  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [registering, setRegistering] = useState(false)

  // Registration form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [localWebinar, setLocalWebinar] = useState<any>(null)

  // Registration status from Redux
  const registrationStatus = useSelector((state: RootState) => state.webinars.registrationStatus)

  useEffect(() => {
    if (id) {
      dispatch(fetchWebinarById(id))
      if (user) {
        dispatch(checkWebinarRegistration(id))
      }
    }
  }, [dispatch, id, user])

  useEffect(() => {
    if (webinar) setLocalWebinar(webinar)
  }, [webinar])

  const handleRegister = async () => {
    if (!user) {
      navigate("/login")
      return
    }
    setIsRegistrationModalOpen(true)
  }

  const handleRegistrationFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registrationState.registering) return

    setRegistering(true)
    try {
      // Always send institute and year as empty strings for API compatibility
      const formDataWithHidden = {
        ...form,
        institute: "",
        year: "",
      }
      await dispatch(registerForWebinarThunk({ webinarId: id!, formData: formDataWithHidden })).unwrap()
      toast.success("Successfully registered for the webinar!")
      // Update local state to reflect new registration
      setLocalWebinar((prev: any) =>
        prev
          ? {
              ...prev,
              attendees: [...(prev.attendees || []), { email: form.email }],
            }
          : prev,
      )
      setIsRegistrationModalOpen(false)
      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
      })
    } catch (error: any) {
      toast.error(error || "Failed to register for webinar")
    } finally {
      setRegistering(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this webinar?")) {
      try {
        await dispatch(deleteWebinar(id!)).unwrap()
        toast.success("Webinar deleted successfully")
        navigate("/webinars")
      } catch (error: any) {
        toast.error(error.message || "Failed to delete webinar")
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

  if (error || !webinar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl max-w-md mx-4 relative">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Webinar Not Found</h2>
          <p className="text-slate-300 mb-8">{error || "The webinar you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/webinars")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Back to Webinars
          </button>
        </div>
      </div>
    )
  }

  const webinarDate = new Date(webinar.startTime)
  const isUpcoming = webinarDate > new Date()
  const isOrganizer = user && (user._id === webinar.speaker?._id || user.role === "admin")
  const currentAttendees = localWebinar?.attendees || webinar.attendees || []
  // Use registrationStatus for robust registration state
  const isRegistered = user && registrationStatus && registrationStatus[id!] === true
  // fallback to attendee array if registrationStatus is undefined
  const fallbackRegistered = user && (localWebinar?.attendees || webinar.attendees).includes(user._id)
  const showRegistered = isRegistered || fallbackRegistered
  const registrationPercentage =
    (currentAttendees.length / (localWebinar?.maxAttendees || webinar.maxAttendees || 200)) * 100

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
                onClick={() => navigate("/webinars")}
                className="group flex items-center text-slate-300 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all duration-300">
                  <ArrowLeft className="h-5 w-5" />
                </div>
                <span className="font-medium">Back to Webinars</span>
              </button>

              {/* <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isLiked
                      ? "text-red-400 bg-red-400/20 border border-red-400/30"
                      : "text-slate-300 hover:text-red-400 bg-white/10 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl text-slate-300 hover:text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                {isOrganizer && (
                  <>
                    <button
                      onClick={() => navigate(`/webinars/edit/${webinar._id}`)}
                      className="p-3 rounded-xl text-slate-300 hover:text-purple-300 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-3 rounded-xl text-red-400 hover:text-red-300 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 transition-all duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div> */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Enhanced Hero Section */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        isUpcoming
                          ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-300 border border-slate-500/30"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${isUpcoming ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`}
                      ></div>
                      {isUpcoming ? "Live Soon" : "Completed"}
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30">
                      <Target className="w-4 h-4 mr-2" />
                      {webinar.level || "Intermediate"}
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/30">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {webinar.category || "Development"}
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                      {webinar.title || "Expert Webinar Session"}
                    </span>
                  </h1>

                  <p className="text-xl text-slate-300 leading-relaxed mb-8">
                    {webinar.description || "Join us for an insightful session with industry experts."}
                  </p>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      icon: Users,
                      value: currentAttendees.length || 0,
                      label: "Registered",
                      color: "from-blue-500 to-indigo-500",
                    },
                    {
                      icon: Clock,
                      value: `${webinar.duration || 90}m`,
                      label: "Duration",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      icon: Star,
                      value: webinar.rating || 4.9,
                      label: "Rating",
                      color: "from-amber-500 to-orange-500",
                    },
                    {
                      icon: Globe,
                      value: webinar.language || "EN",
                      label: "Language",
                      color: "from-emerald-500 to-teal-500",
                    },
                  ].map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center"
                      >
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-slate-400 text-sm">{stat.label}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Enhanced Speaker Section */}
                {(() => {
                  const defaultSpeakerName = "Expert Speaker"
                  const defaultSpeakerImage = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
                  const speakerObj =
                    typeof webinar.speaker === "object" && webinar.speaker !== null ? webinar.speaker : {}
                  const speakerName =
                    speakerObj.name?.trim() ||
                    webinar.speakerName?.trim() ||
                    (typeof webinar.speaker === "string" ? webinar.speaker : "")?.trim() ||
                    defaultSpeakerName
                  const speakerImage =
                    speakerObj.profileImage ||
                    webinar.speakerImage ||
                    defaultSpeakerImage
                  const speakerRole = speakerObj.role || webinar.speakerRole || "Professional Speaker"
                  const speakerCompany = speakerObj.company || webinar.speakerCompany
                  const speakerExperience = speakerObj.experience || webinar.speakerExperience || "5+ years"

                  return (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <img
                            src={speakerImage}
                            alt={speakerName}
                            className="h-20 w-20 rounded-2xl border-2 border-white/30 shadow-lg"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center border-2 border-white/30">
                            <Award className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{speakerName}</h3>
                          <p className="text-purple-300 text-lg mb-2">
                            {speakerRole}
                            {speakerCompany ? ` at ${speakerCompany}` : ""}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <span className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1 text-emerald-400" />
                              {speakerExperience} experience
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-amber-400" />
                              Expert Level
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button className="p-3 bg-white/10 border border-white/20 rounded-xl text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-300">
                            <User className="h-5 w-5" />
                          </button>
                          <button className="p-3 bg-white/10 border border-white/20 rounded-xl text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-300">
                            <Mail className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Enhanced Tabs */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="border-b border-white/10">
                  <div className="grid grid-cols-3 gap-2 p-2">
                    {[
                      { id: "overview", label: "Overview", icon: BookOpen },
                      { id: "agenda", label: "Agenda", icon: Calendar },
                      { id: "resources", label: "Resources", icon: Download },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center justify-center space-x-2 px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                          activeTab === id
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "text-slate-300 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                          <BookOpen className="h-6 w-6 mr-3 text-purple-400" />
                          About This Webinar
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed">
                          {webinar.longDescription ||
                            webinar.description ||
                            "This webinar will provide valuable insights and practical knowledge on the topic."}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                          <Target className="h-6 w-6 mr-3 text-emerald-400" />
                          What You'll Learn
                        </h3>
                        <div className="grid gap-4">
                          {webinar.learningOutcomes?.length ? (
                            webinar.learningOutcomes.map((outcome: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10"
                              >
                                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-300">{outcome}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <Target className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
                              <p className="text-slate-400">Learning outcomes will be updated soon.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                          <Shield className="h-6 w-6 mr-3 text-blue-400" />
                          Prerequisites
                        </h3>
                        <div className="grid gap-4">
                          {webinar.prerequisites?.length ? (
                            webinar.prerequisites.map((prereq: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10"
                              >
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-300">{prereq}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
                              <p className="text-slate-400">No specific prerequisites required.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "agenda" && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Calendar className="h-6 w-6 mr-3 text-purple-400" />
                        Session Agenda
                      </h3>
                      {webinar.agenda?.length ? (
                        webinar.agenda.map((item: any, index: number) => (
                          <div key={index} className="flex space-x-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h4 className="text-xl font-bold text-white">{item.topic}</h4>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30">
                                  {item.time}
                                </span>
                                {item.videoUrl &&
                                  (isRegistered ? (
                                    <a
                                      href={item.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-3 flex items-center px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
                                    >
                                      <Video className="h-4 w-4 mr-1" /> Watch
                                    </a>
                                  ) : (
                                    <button
                                      className="ml-3 flex items-center px-3 py-1 bg-gray-700/50 text-slate-400 font-semibold rounded-xl cursor-not-allowed border border-gray-600"
                                      title="Register to watch this session video"
                                      disabled
                                    >
                                      <Video className="h-4 w-4 mr-1" /> Watch <span className="ml-1">🔒</span>
                                    </button>
                                  ))}
                              </div>
                              <p className="text-slate-300 leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
                          <p className="text-slate-400 text-lg">Detailed agenda will be available soon.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "resources" && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Download className="h-6 w-6 mr-3 text-emerald-400" />
                        Session Resources
                      </h3>
                      {webinar.resources?.length ? (
                        <div className="grid gap-4">
                          {webinar.resources.map((resource: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                  <Download className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold text-lg">{resource.name}</h4>
                                  <p className="text-slate-400 capitalize">{resource.type} file</p>
                                </div>
                              </div>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                              >
                                Download
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Download className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
                          <p className="text-slate-400 text-lg">Resources will be available after registration.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Enhanced Registration Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold mb-3">
                      <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {webinar.price === 0 || !webinar.price ? "Free" : `$${webinar.price}`}
                      </span>
                    </div>
                    {(webinar.price === 0 || !webinar.price) && (
                      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-semibold">
                        <Zap className="w-4 h-4 mr-2" />
                        No cost to attend
                      </div>
                    )}
                  </div>

                  {/* Enhanced Date & Time */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {webinar.startTime && !isNaN(webinarDate.getTime())
                            ? formatDate(webinar.startTime)
                            : "Date TBD"}
                        </p>
                        <p className="text-slate-400">
                          {webinar.startTime && webinar.endTime && !isNaN(webinarDate.getTime())
                            ? `${formatTime(webinar.startTime)} - ${formatTime(webinar.endTime)}`
                            : "Time TBD"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">Online Event</p>
                        <p className="text-slate-400">Join from anywhere</p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Registration Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-slate-300 font-medium">Registration Progress</span>
                      <span className="text-white font-semibold">
                        {currentAttendees.length}/{localWebinar?.maxAttendees || webinar.maxAttendees || 200}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${registrationPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      {Math.round(registrationPercentage)}% full •{" "}
                      {(localWebinar?.maxAttendees || webinar.maxAttendees || 200) - currentAttendees.length} spots
                      remaining
                    </p>
                  </div>

                  {/* Enhanced Action Buttons */}
                  {isUpcoming ? (
                    showRegistered ? (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl p-6 text-center">
                          <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                          <p className="text-emerald-300 font-semibold text-lg">You're registered!</p>
                          <p className="text-emerald-400 text-sm mt-1">Check your email for the access link</p>
                        </div>
                        {/* Show Join Live if zoomUrl is present and event is live */}
                        {webinar.zoomUrl && new Date() >= new Date(webinar.startTime) && new Date() <= new Date(webinar.endTime) && (
                          <a
                            href={webinar.zoomUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                          >
                            <PlayCircle className="h-6 w-6" />
                            <span>Join Live Session</span>
                          </a>
                        )}
                        {/* Show Watch Recording if event ended and recordingUrl exists */}
                        {webinar.recordingUrl && webinar.endTime && new Date() > new Date(webinar.endTime) && (
                          <a
                            href={webinar.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                          >
                            <Video className="h-6 w-6" />
                            <span>Watch Recording</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={handleRegister}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <Users className="h-6 w-6" />
                        <span>Register Now</span>
                      </button>
                    )
                  ) : (
                    <div className="bg-gradient-to-r from-slate-500/20 to-gray-500/20 border border-slate-500/30 rounded-2xl p-6 text-center">
                      <p className="text-slate-400 font-semibold">This webinar has ended</p>
                      {showRegistered && webinar.recordingUrl && (
                        <a
                          href={webinar.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center text-blue-300 hover:text-white transition-colors duration-300"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Watch Recording
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Enhanced Tags */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-purple-400" />
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {(webinar.tags || ["React", "JavaScript", "Performance", "Patterns"]).map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 rounded-xl text-sm font-semibold border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300 cursor-pointer transform hover:scale-105"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enhanced Share Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Share2 className="h-5 w-5 mr-2 text-emerald-400" />
                    Share This Webinar
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleShare}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                    <button className="px-4 py-3 bg-white/10 border border-white/20 text-slate-300 rounded-xl hover:text-white hover:bg-white/20 transition-all duration-300">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        {isRegistrationModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-lg w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Register for Webinar</h2>
              </div>

              <form onSubmit={handleRegistrationFormSubmit} className="space-y-4">
                {/* Hidden fields for API compatibility */}
                <input type="hidden" name="institute" value="" />
                <input type="hidden" name="year" value="" />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsRegistrationModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-slate-300 font-semibold rounded-xl hover:text-white hover:bg-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registering}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registering ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-5 w-5" />
                        <span>Register</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareUrl={window.location.href}
          title={webinar?.title || ""}
        />
      </div>
    </div>
  )
}

export default WebinarDetail
