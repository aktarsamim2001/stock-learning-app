"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Mail,
  Phone,
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Clock,
  Globe,
  Award,
  Users,
  Sparkles,
} from "lucide-react"
import axios from "../../axiosConfig"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await axios.get("/api/contact-info")
        setContactInfo({
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
        })
      } catch (err) {
        setError("Failed to load contact info")
      } finally {
        setLoading(false)
      }
    }
    fetchContactInfo()
  }, [])

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/webinars", label: "Webinars" },
    { to: "/blogs", label: "Blog" },
    { to: "/about", label: "About Us" },
  ]

  const supportLinks = [
    { to: "/", label: "FAQ" },
    { to: "/contact", label: "Contact Support" },
    { to: "/www.research360.in/", label: "Community" },
    { to: "/resources", label: "Resources" },
    { to: "/courses", label: "Tutorials" },
  ]

  const legalLinks = [
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms-conditions", label: "Terms & Conditions" }
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/19Vpvhj4Ke/", label: "Facebook", color: "hover:text-blue-400" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
    { icon: Instagram, href: "https://www.instagram.com/stoplossstockmarketacademy?igsh=eG85Ym5lcHV6ZGw1", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-500" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-400" },
  ]

  const stats = [
    { icon: Users, value: "50K+", label: "Active Learners" },
    { icon: BookOpen, value: "500+", label: "Expert Courses" },
    { icon: Award, value: "95%", label: "Success Rate" },
    { icon: Globe, value: "120+", label: "Countries" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Stats Section */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center group" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-purple-400" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-slate-400 font-medium">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    StopLoss
                  </h3>
                  <div className="text-sm text-slate-400 font-medium">Build Your Innovative Future</div>
                </div>
              </div>

              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
                Empowering education through innovative technology. Our platform connects passionate students with
                exceptional instructors, creating meaningful learning experiences that transform lives and careers.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">
                    <Mail className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm font-medium">Email</div>
                    {loading ? (
                      <div className="text-slate-300">Loading...</div>
                    ) : error ? (
                      <div className="text-red-400">{error}</div>
                    ) : (
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-slate-200 hover:text-white transition-colors duration-300"
                      >
                        {contactInfo.email || "contact@learninghub.com"}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm font-medium">Phone</div>
                    {loading ? (
                      <div className="text-slate-300">Loading...</div>
                    ) : error ? (
                      <div className="text-red-400">{error}</div>
                    ) : (
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-slate-200 hover:text-white transition-colors duration-300"
                      >
                        {contactInfo.phone || "+1 (555) 123-4567"}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm font-medium">Support Hours</div>
                    <div className="text-slate-200">Mon - Fri: 9:00 AM - 6:00 PM EST</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className={`w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-slate-400 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/20`}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-8 relative">
                Quick Links
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2"></div>
              </h4>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center space-x-2 text-slate-300 hover:text-white transition-all duration-300"
                    >
                      <ArrowRight className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-8 relative">
                Support
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2"></div>
              </h4>
              <ul className="space-y-4">
                {supportLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center space-x-2 text-slate-300 hover:text-white transition-all duration-300"
                    >
                      <ArrowRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div>
                <p className="text-slate-300 text-lg mb-2">© {currentYear} StopLoss. All rights reserved.</p>
                <p className="text-slate-400">Building your innovative future with StopLoss, one student at a time.</p>
              </div>

              <div className="flex flex-wrap gap-8">
                {legalLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-slate-400 hover:text-white transition-all duration-300 group relative"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
