"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle, X, Clock, Globe, Award, Users, Sparkles } from "lucide-react"
import axios, { type AxiosError } from "../axiosConfig"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [error, setError] = useState("")
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
    socials: {
      facebook: "",
      twitter: "",
      linkedin: "",
    },
  })
  const [contactInfoLoading, setContactInfoLoading] = useState(true)
  const [contactInfoError, setContactInfoError] = useState("")

  const validate = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required."
        if (value.trim().length < 3) return "Name must be at least 3 characters."
        return ""
      case "email":
        if (!value.trim()) return "Email is required."
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email address."
        return ""
      case "subject":
        if (!value.trim()) return "Subject is required."
        if (value.trim().length < 5) return "Subject must be at least 5 characters."
        if (value.trim().length > 200) return "Subject must be less than 200 characters."
        return ""
      case "message":
        if (!value.trim()) return "Message is required."
        if (value.trim().length < 10) return "Message must be at least 10 characters."
        return ""
      default:
        return ""
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: validate(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate all fields before submit
    const errors = {
      name: validate("name", formData.name),
      email: validate("email", formData.email),
      subject: validate("subject", formData.subject),
      message: validate("message", formData.message),
    }
    setFormErrors(errors)
    if (Object.values(errors).some((err) => err)) {
      setIsSubmitting(false)
      return
    }

    try {
      await axios.post("/api/contact", formData)

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setShowSuccessPopup(true)
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      setError(error.response?.data?.message || "An error occurred while sending your message")
    } finally {
      setIsSubmitting(false)
    }
  }

  const closePopup = () => {
    setShowSuccessPopup(false)
  }

  useEffect(() => {
    const fetchContactInfo = async () => {
      setContactInfoLoading(true)
      setContactInfoError("")
      try {
        const res = await axios.get("/api/contact-info")
        setContactInfo({
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          socials: res.data.socials || { facebook: "", twitter: "", linkedin: "" },
        })
      } catch (err) {
        setContactInfoError("Failed to load contact information.")
      } finally {
        setContactInfoLoading(false)
      }
    }
    fetchContactInfo()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative pt-12">
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
              Let's Connect
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Get In Touch
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Start Your Journey
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Ready to transform your future? We'd love to hear from you. Send us a message and let's create something
              amazing together.
            </p>

            {/* Enhanced Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Clock, value: "24h", label: "Response Time" },
                { icon: Users, value: "10K+", label: "Happy Students" },
                { icon: Award, value: "Expert", label: "Support Team" },
                { icon: Globe, value: "Global", label: "Community" },
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
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Enhanced Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Send className="mr-4 h-8 w-8" />
                  Send us a Message
                </h2>
                <p className="text-purple-100 mt-2">We'll get back to you within 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label htmlFor="name" className="block text-lg font-semibold text-white mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md group-hover:bg-white/15 text-lg"
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && <p className="text-red-400 text-sm mt-2">{formErrors.name}</p>}
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-lg font-semibold text-white mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md group-hover:bg-white/15 text-lg"
                      placeholder="your.email@example.com"
                    />
                    {formErrors.email && <p className="text-red-400 text-sm mt-2">{formErrors.email}</p>}
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="subject" className="block text-lg font-semibold text-white mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    minLength={5}
                    maxLength={200}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md group-hover:bg-white/15 text-lg"
                    placeholder="What's this about?"
                  />
                  {formErrors.subject && <p className="text-red-400 text-sm mt-2">{formErrors.subject}</p>}
                </div>

                <div className="group">
                  <label htmlFor="message" className="block text-lg font-semibold text-white mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-md group-hover:bg-white/15 resize-none text-lg"
                    placeholder="Tell us more about your project or inquiry..."
                  />
                  {formErrors.message && <p className="text-red-400 text-sm mt-2">{formErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center px-8 py-5 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isSubmitting
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-6 w-6 mr-3" />
                      Send Message
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Enhanced Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Contact Information</h2>

              <div className="space-y-6">
                <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Mail className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-white mb-2">Email</p>
                      {contactInfoLoading ? (
                        <div className="animate-pulse bg-white/10 h-6 w-48 rounded"></div>
                      ) : contactInfoError ? (
                        <span className="text-red-400">{contactInfoError}</span>
                      ) : (
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-slate-300 hover:text-white transition-colors duration-300 text-lg"
                        >
                          {contactInfo.email || "contact@learninghub.com"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Phone className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-white mb-2">Phone</p>
                      {contactInfoLoading ? (
                        <div className="animate-pulse bg-white/10 h-6 w-40 rounded"></div>
                      ) : contactInfoError ? (
                        <span className="text-red-400">{contactInfoError}</span>
                      ) : (
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="text-slate-300 hover:text-white transition-colors duration-300 text-lg"
                        >
                          {contactInfo.phone || "+1 (555) 123-4567"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <MapPin className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-white mb-2">Address</p>
                      {contactInfoLoading ? (
                        <div className="space-y-2">
                          <div className="animate-pulse bg-white/10 h-6 w-full rounded"></div>
                          <div className="animate-pulse bg-white/10 h-6 w-3/4 rounded"></div>
                        </div>
                      ) : contactInfoError ? (
                        <span className="text-red-400">{contactInfoError}</span>
                      ) : (
                        <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                          {contactInfo.address || "123 Learning Street\nEducation City, EC 12345"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                <Clock className="h-6 w-6 mr-3 text-emerald-400" />
                Office Hours
              </h3>
              <div className="space-y-4">
                {[
                  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
                  { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
                  { day: "Sunday", hours: "Closed" },
                ].map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <span className="text-white font-semibold">{schedule.day}</span>
                    <span className="text-slate-300">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
             {/* Enhanced Social Media */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Follow Us</h3>
              <div className="flex justify-center space-x-6">
                {[
                  {
                    name: "Facebook",
                    icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
                    color: "from-blue-600 to-blue-700",
                    link: contactInfo.socials.facebook,
                  },
                  {
                    name: "Twitter",
                    icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                    color: "from-sky-500 to-blue-600",
                    link: contactInfo.socials.twitter,
                  },
                  {
                    name: "LinkedIn",
                    icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
                    color: "from-blue-700 to-indigo-800",
                    link: contactInfo.socials.linkedin,
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-16 h-16 bg-gradient-to-r ${social.color} rounded-2xl flex items-center justify-center hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-2xl ${
                      !social.link ? "opacity-40 pointer-events-none" : ""
                    }`}
                    aria-label={social.name}
                  >
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-xl w-full mx-4 relative">
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Message Sent Successfully!</h3>
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                Thank you for reaching out! We've received your message and will get back to you within 24 hours.
              </p>
              <button
                onClick={closePopup}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contact
