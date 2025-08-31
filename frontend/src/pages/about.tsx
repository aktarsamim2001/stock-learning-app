"use client"

import { useState, useEffect } from "react"
import {
  User,
  MapPin,
  Mail,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Star,
  Download,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Quote,
  CheckCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Coffee,
  BookOpen,
  Camera,
  Music,
  Palette,
  Globe,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { fetchAbout } from "../store/slices/aboutSlice"
import React from "react"

// Icon mapping for dynamic rendering
const iconMap = {
  User,
  MapPin,
  Mail,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Star,
  Download,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Quote,
  CheckCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Coffee,
  BookOpen,
  Camera,
  Music,
  Palette,
  Globe,
}

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("about")
  const dispatch = useDispatch<AppDispatch>()
  const { content } = useSelector((state: RootState) => state.about)

  useEffect(() => {
    dispatch(fetchAbout())
  }, [dispatch])

  // fallback static data if content is not loaded
  const aboutData = content || {
    headline: "Learn the Stock Market Anytime, Anywhere!",
    subheadline: "Know About INVESMATE",
    image: "/placeholder.svg?height=400&width=400",
    sections: [
      {
        icon: "sebi",
        title: "SEBI-Registered",
        description:
          "INVESMATE, an Educational Initiative of SEBI Registered RA: INVESMATE INSIGHTS [Reg No.: INH000017985]",
      },
      {
        icon: "trust",
        title: "6 Years of Trust",
        description:
          "Empowering over 1 lakh 20 thousands students to achieve financial success for the last 6 years.",
      },
      {
        icon: "mentorship",
        title: "Powerful Program + Mentorship",
        description:
          "Our every share market course module is thoughtfully designed and taught by NISM-Certified professionals.",
      },
    ],
    buttonText: "Know About Us",
    buttonLink: "/about",
    personalDetails: {
      name: "Akta Sharma",
      birthday: "1997-01-01",
      location: "Mumbai, India",
      education: "Masters in Design",
      status: "Available for Projects",
      email: "akta@email.com",
      phone: "+91-1234567890",
    },
    interests: [
      { icon: "Camera", label: "Photography", color: "text-blue-400" },
      { icon: "Music", label: "Music", color: "text-purple-400" },
      { icon: "BookOpen", label: "Reading", color: "text-green-400" },
      { icon: "Palette", label: "Art", color: "text-pink-400" },
      { icon: "Coffee", label: "Coffee", color: "text-orange-400" },
      { icon: "Globe", label: "Travel", color: "text-cyan-400" },
    ],
    skills: [
      { name: "Web Development", level: 95 },
      { name: "UI/UX Design", level: 90 },
      { name: "Project Management", level: 85 },
      { name: "Digital Marketing", level: 80 },
      { name: "Content Strategy", level: 88 },
      { name: "Team Leadership", level: 92 },
    ],
    experiences: [
      {
        role: "Senior Product Designer",
        company: "Tech Innovations Ltd.",
        period: "2022 - Present",
        description: "Leading design initiatives for multiple product lines, managing a team of 5 designers.",
        achievements: ["Increased user engagement by 40%", "Led 15+ successful product launches"],
      },
      {
        role: "UX Designer",
        company: "Digital Solutions Inc.",
        period: "2020 - 2022",
        description: "Designed user-centered solutions for web and mobile applications.",
        achievements: ["Improved conversion rates by 25%", "Reduced user onboarding time by 50%"],
      },
      {
        role: "Junior Designer",
        company: "Creative Agency",
        period: "2018 - 2020",
        description: "Worked on branding and digital design projects for various clients.",
        achievements: ["Completed 50+ client projects", 'Received "Rising Star" award'],
      },
    ],
    achievements: [
      { icon: "Award", title: "Design Excellence Award", year: "2023", org: "Design Council" },
      { icon: "Star", title: "Top 30 Under 30", year: "2022", org: "Business Magazine" },
      { icon: "Trophy", title: "Innovation Leader", year: "2021", org: "Tech Summit" },
      { icon: "Medal", title: "Best UX Project", year: "2020", org: "UX Awards" },
    ],
    socialLinks: [
      { icon: "Linkedin", url: "#", color: "hover:text-blue-400" },
      { icon: "Twitter", url: "#", color: "hover:text-sky-400" },
      { icon: "Instagram", url: "#", color: "hover:text-pink-400" },
      { icon: "Github", url: "#", color: "hover:text-gray-400" },
      { icon: "Mail", url: "#", color: "hover:text-emerald-400" },
    ],
    aboutDescription: "I'm a passionate designer with a love for creating meaningful digital experiences. My journey began 5 years ago when I discovered the perfect blend of creativity and technology in web design.",
    aboutDescription2: "I believe that great design is not just about making things look beautiful, but about solving problems and creating connections between people and technology. Every project I work on is an opportunity to make someone's life a little bit better.",
    quote: {
      icon: "Quote",
      text: '"Design is not just what it looks like and feels like. Design is how it works."',
      author: "- My Design Philosophy",
    },
    technicalSkills: [
      "Figma",
      "Adobe Creative Suite",
      "Sketch",
      "React",
      "HTML/CSS",
      "JavaScript",
      "WordPress",
      "Webflow",
      "Framer",
      "Principle",
    ],
    socialText: "I'm always excited to collaborate on new projects and meet fellow creatives. Feel free to reach out through any of these platforms!",
  }

  // Dynamic fields from backend
  const personalDetails = aboutData.personalDetails || {}
  const interests = aboutData.interests || []
  const skills = aboutData.skills || []
  const experiences = aboutData.experiences || []
  const achievements = aboutData.achievements || []
  const socialLinks = aboutData.socialLinks || []

  // Helper for personal details display
  const personalDetailsArray = [
    { icon: 'User', label: 'Full Name', value: personalDetails.name },
    { icon: 'Calendar', label: 'Birthday', value: personalDetails.birthday },
    { icon: 'MapPin', label: 'Location', value: personalDetails.location },
    { icon: 'GraduationCap', label: 'Education', value: personalDetails.education },
    { icon: 'Heart', label: 'Status', value: personalDetails.status },
    { icon: 'Mail', label: 'Email', value: personalDetails.email },
    { icon: 'Phone', label: 'Phone', value: personalDetails.phone },
  ].filter(item => item.value && item.value !== 'undefined' && item.value !== undefined)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-14">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* --- DYNAMIC ABOUT SECTION (replace static hero section) --- */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
            {/* Left: Image */}
            <div className="flex-1 flex justify-center mb-10 md:mb-0">
              <img
                src={aboutData.image}
                alt="About Invesmate"
                className="w-full max-w-md rounded-3xl shadow-2xl border-4 border-white/10 object-cover"
              />
            </div>
            {/* Right: Content */}
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                {aboutData.headline}
              </h2>
              <p className="text-xl text-slate-300 mb-8 font-semibold">{aboutData.subheadline}</p>
              <div className="space-y-6 mb-10">
                {aboutData.sections.map((section: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      {/* Icon logic */}
                      {section.icon === "sebi" && (
                        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.1" />
                          <path
                            d="M10 22V10h12v12H10zm2-2h8V12h-8v8z"
                            fill="#7C3AED"
                          />
                        </svg>
                      )}
                      {section.icon === "trust" && (
                        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.1" />
                          <path
                            d="M16 8l6 4v8l-6 4-6-4v-8l6-4zm0 2.18L11 12.13v7.74l5 3.33 5-3.33v-7.74l-5-1.95z"
                            fill="#10B981"
                          />
                        </svg>
                      )}
                      {section.icon === "mentorship" && (
                        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.1" />
                          <path
                            d="M16 10a4 4 0 110 8 4 4 0 010-8zm0 10c3.31 0 6 2.24 6 5v1H10v-1c0-2.76 2.69-5 6-5z"
                            fill="#F59E42"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{section.title}</h4>
                      <p className="text-slate-300 text-base">{section.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: "about", label: "About Me", icon: User },
                  { id: "skills", label: "Skills", icon: Target },
                  { id: "experience", label: "Experience", icon: Briefcase },
                  { id: "achievements", label: "Achievements", icon: Award },
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
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* About Tab */}
              {activeTab === "about" && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                      <User className="h-8 w-8 mr-3 text-purple-400" />
                      About Me
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        {/* About description (optional: dynamic) */}
                        <p className="text-slate-300 text-lg leading-relaxed">
                          {aboutData.aboutDescription || "I'm a passionate designer with a love for creating meaningful digital experiences. My journey began 5 years ago when I discovered the perfect blend of creativity and technology in web design."}
                        </p>
                        <p className="text-slate-300 text-lg leading-relaxed">
                          {aboutData.aboutDescription2 || "I believe that great design is not just about making things look beautiful, but about solving problems and creating connections between people and technology. Every project I work on is an opportunity to make someone's life a little bit better."}
                        </p>
                        {/* Quote */}
                        {aboutData.quote && (
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                            {iconMap[aboutData.quote.icon] ? (
                              React.createElement(iconMap[aboutData.quote.icon], { className: "h-8 w-8 text-purple-400 mb-4" })
                            ) : (
                              <Quote className="h-8 w-8 text-purple-400 mb-4" />
                            )}
                            <p className="text-slate-200 text-lg italic leading-relaxed">
                              {aboutData.quote.text}
                            </p>
                            <p className="text-slate-400 text-sm mt-4">{aboutData.quote.author}</p>
                          </div>
                        )}
                        {!aboutData.quote && (
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                            <Quote className="h-8 w-8 text-purple-400 mb-4" />
                            <p className="text-slate-200 text-lg italic leading-relaxed">
                              "Design is not just what it looks like and feels like. Design is how it works."
                            </p>
                            <p className="text-slate-400 text-sm mt-4">- My Design Philosophy</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-8">
                        {/* Personal Details */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                          <h3 className="text-xl font-bold text-white mb-6">Personal Details</h3>
                          <div className="space-y-4">
                            {personalDetailsArray.map(({ icon, label, value }, index) => {
                              const Icon = iconMap[icon] || User
                              return (
                                <div key={index} className="flex items-center space-x-3">
                                  <Icon className="h-5 w-5 text-purple-400" />
                                  <span className="text-slate-400 min-w-[100px]">{label}:</span>
                                  <span className="text-white font-medium">{value}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        {/* Interests */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                          <h3 className="text-xl font-bold text-white mb-6">Interests & Hobbies</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {interests.map(({ icon, label, color }, index) => {
                              const Icon = iconMap[icon] || Sparkles
                              return (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                                  <Icon className={`h-5 w-5 ${color || 'text-blue-400'}`} />
                                  <span className="text-slate-300">{label}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <Target className="h-8 w-8 mr-3 text-purple-400" />
                    Skills & Expertise
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {skills.map((skill, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                          <span className="text-slate-300 font-medium">{skill.level}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 shadow-lg`}
                            style={{ width: typeof skill.level === 'number' ? `${skill.level}%` : skill.level }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Additional Skills (optional) */}
                  {aboutData.technicalSkills && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-6">Technical Skills</h3>
                      <div className="flex flex-wrap gap-3">
                        {aboutData.technicalSkills.map((tech, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-xl text-sm font-semibold border border-blue-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <Briefcase className="h-8 w-8 mr-3 text-purple-400" />
                    Work Experience
                  </h2>
                  <div className="space-y-8">
                    {experiences.map((exp, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 relative">
                        <div className="absolute -left-4 top-8 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 border-slate-900"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2">
                            <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
                            <p className="text-purple-300 text-lg font-semibold mb-4">{exp.company}</p>
                            <p className="text-slate-300 leading-relaxed mb-6">{exp.description}</p>
                            {exp.achievements && (
                              <div className="space-y-2">
                                <h4 className="text-white font-semibold mb-3">Key Achievements:</h4>
                                {exp.achievements.map((achievement, idx) => (
                                  <div key={idx} className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                                    <span className="text-slate-300">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="lg:col-span-1">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Calendar className="h-5 w-5 text-blue-400" />
                                <span className="text-slate-300 font-medium">Duration</span>
                              </div>
                              <p className="text-white font-semibold">{exp.period}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === "achievements" && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <Award className="h-8 w-8 mr-3 text-purple-400" />
                    Achievements & Recognition
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {achievements.map((achievement, index) => {
                      const Icon = iconMap[achievement.icon] || Award
                      return (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                          <p className="text-purple-300 font-semibold mb-2">{achievement.org || achievement.description}</p>
                          <p className="text-slate-400">{achievement.year}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// Trophy and Medal icons - local definitions
const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 2h12v6.5c0 2.5-2 4.5-4.5 4.5h-3C8 13 6 11 6 8.5V2zm-2 4v2.5C4 11.43 6.57 14 9.5 14h.5v2h-2v2h8v-2h-2v-2h.5c2.93 0 5.5-2.57 5.5-5.5V6h-2V4h2c1.1 0 2 .9 2 2v2.5C22 12.08 19.08 15 15.5 15H15v3h2c.55 0 1 .45 1 1s-.45 1-1 1H7c-.55 0-1-.45-1-1s.45-1 1-1h2v-3h-.5C4.92 15 2 12.08 2 8.5V6c0-1.1.9-2 2-2h2v2H4z" />
  </svg>
)
const Medal = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L8 8h8l-4-6zm0 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    <path d="M8 8L6 22h4l2-6 2 6h4L16 8H8z" />
  </svg>
)

export default AboutPage
