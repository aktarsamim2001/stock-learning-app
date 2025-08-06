"use client"

import type React from "react"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { UserPlus, Mail, Lock, User, Shield, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react"
import UserContext from "../context/UserContext"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, user } = useContext(UserContext)
  const navigate = useNavigate()

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard")
    return null
  }

  const { name, email, password, confirmPassword, role } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      await register({ name, email, password, role })
      toast.success("Registration successful!")

      if (role === "student") {
        navigate("/dashboard")
      } else {
        toast.info("Your account is pending approval. You will be notified once approved.")
        navigate("/login")
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
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

      <div className="relative z-10 mt-24">
        {/* Header Section */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
            Join Our Community
          </h2>
          <p className="text-slate-300 text-lg">Create your account and start learning today</p>
        </div>

        {/* Registration Form */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md md:max-w-xl md:mx-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    placeholder="Create a password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-purple-400 transition-colors duration-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-purple-400 transition-colors duration-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    placeholder="Confirm your password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-purple-400 transition-colors duration-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-purple-400 transition-colors duration-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="group">
                <label htmlFor="role" className="block text-sm font-semibold text-white mb-2">
                  I am a
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    required
                    value={role}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15 appearance-none"
                  >
                    <option value="student" className="bg-slate-800 text-white">
                      Student
                    </option>
                    <option value="instructor" className="bg-slate-800 text-white">
                      Instructor
                    </option>
                    <option value="admin" className="bg-slate-800 text-white">
                      Administrator
                    </option>
                  </select>
                </div>
                {role !== "student" && (
                  <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-200">
                        <span className="font-semibold">Approval Required:</span>{" "}
                        {role === "instructor" ? "Instructor" : "Administrator"} accounts need admin approval before
                        activation.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                  isSubmitting
                    ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/10 text-slate-300 rounded-full">Already have an account?</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                >
                  Sign In Instead
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
