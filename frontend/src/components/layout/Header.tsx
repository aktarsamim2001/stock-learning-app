"use client"

import { useContext, useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  Menu,
  X,
  User,
  BookOpen,
  Video,
  PenTool,
  Home,
  Phone,
  ChevronDown,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react"
import UserContext from "../../context/UserContext"
import NotificationBadge from "../notifications/NotificationBadge"

const Header = () => {
  const { user, logout } = useContext(UserContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/webinars", label: "Webinars" },
    { path: "/blogs", label: "Blog" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-md border-b border-white/5"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  StopLoss
                </span>
                <div className="text-xs text-slate-400 font-medium">Build Your Innovative Future</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    active ? "bg-white/10 text-white shadow-lg" : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Admin Notification */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="relative p-2 text-slate-300 hover:text-white transition-colors duration-300"
                  >
                    <NotificationBadge />
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Home className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      {/* <div className="border-t border-white/10 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white font-medium transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-purple-300 transition-colors duration-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    active
                      ? "bg-white/10 text-white border-l-4 border-purple-500"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile User Section */}
          <div className="border-t border-white/10 px-4 py-6">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-slate-400 text-sm capitalize">{user.role}</div>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium transition-all duration-300 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}></div>}
    </header>
  )
}

export default Header
