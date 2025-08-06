"use client"

import type React from "react"

import { useState, useContext, useRef, type ChangeEvent } from "react"
import { toast } from "react-toastify"
import { User, LogOut, Edit3, Camera, Mail, Shield, Calendar, Save, X } from "lucide-react"
import UserContext from "../context/UserContext"

const Profile = () => {
  const { user, updateUserProfile, logout } = useContext(UserContext)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  })

  const { name, email, password, confirmPassword } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      const updateData: {
        name?: string
        email?: string
        password?: string
        profileImage?: File
      } = {}

      if (name !== user?.name) updateData.name = name
      if (email !== user?.email) updateData.email = email
      if (password) updateData.password = password
      if (profileImage) updateData.profileImage = profileImage

      await updateUserProfile(updateData)
      toast.success("Profile updated successfully")
      setIsEditing(false)
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      })
      setProfileImage(null)
      setImagePreview(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="mt-14 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
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
        <div className="text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-lg text-slate-300">User not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Floating Particles */}
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

      <div className="max-w-4xl mx-auto relative z-10 mt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <p className="text-xl text-slate-300">Manage your account settings and preferences</p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {!isEditing ? (
            // View Mode
            <div className="p-8">
              {/* Profile Header */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <User size={48} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                  <p className="text-slate-300 text-lg mb-4">{user.email}</p>
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        user.role === "admin"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : user.role === "instructor"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-green-500/20 text-green-300 border border-green-500/30"
                      }`}
                    >
                      <Shield className="inline h-4 w-4 mr-1" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        user.status === "active"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : user.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center mb-3">
                    <Mail className="h-5 w-5 text-purple-400 mr-3" />
                    <h3 className="text-lg font-semibold text-white">Email Address</h3>
                  </div>
                  <p className="text-slate-300">{user.email}</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-blue-400 mr-3" />
                    <h3 className="text-lg font-semibold text-white">Member Since</h3>
                  </div>
                  <p className="text-slate-300">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    logout()
                    window.location.href = "/login"
                  }}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-red-500/30 rounded-xl text-sm font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/20 focus:ring-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: user.name,
                      email: user.email,
                      password: "",
                      confirmPassword: "",
                    })
                    setProfileImage(null)
                    setImagePreview(null)
                  }}
                  className="p-2 text-slate-400 hover:text-white transition-colors duration-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-8">
                  <div
                    className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-4 border-white/20 hover:border-purple-400/50 transition-all duration-300 group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : user.profileImage ? (
                      <img
                        src={user.profileImage || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <User size={48} className="text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 text-sm text-purple-300 hover:text-purple-200 transition-colors duration-300"
                  >
                    Change Profile Photo
                  </button>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      required
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      required
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      placeholder="Leave blank to keep current"
                      minLength={6}
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      placeholder="Confirm new password"
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        name: user.name,
                        email: user.email,
                        password: "",
                        confirmPassword: "",
                      })
                      setProfileImage(null)
                      setImagePreview(null)
                    }}
                    className="flex-1 px-6 py-3 border border-white/20 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                      isSubmitting
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-purple-500"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
