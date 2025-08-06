"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  ArrowRight,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Play,
  Award,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchBanners } from "../store/slices/bannerSlice";
import { fetchFeatures } from "../store/slices/featureSlice";
import { fetchStats } from "../store/slices/statSlice";
import { fetchTestimonials } from "../store/slices/testimonialSlice";
import { fetchFaqs } from "../store/slices/faqSlice";
import { fetchWhyChooseUs } from "../store/slices/whyChooseUsSlice";
import { fetchCourses } from "../store/slices/courseSlice";
import { fetchBlogs } from "../store/slices/blogSlice";
import { fetchWebinars } from "../store/slices/webinarSlice";
import { fetchAbout } from "../store/slices/aboutSlice";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors for all dynamic sections
  const banners = useSelector((state: RootState) => state.banners.items);
  const bannersLoading = useSelector(
    (state: RootState) => state.banners.loading
  );
  const bannersError = useSelector((state: RootState) => state.banners.error);

  const features = useSelector((state: RootState) => state.features.items);
  const stats = useSelector((state: RootState) => state.stats.items);
  const testimonials = useSelector(
    (state: RootState) => state.testimonials.items
  );
  const faqs = useSelector((state: RootState) => state.faqs.items);
  const whyChooseUs = useSelector(
    (state: RootState) => state.whyChooseUs.items
  );
  const courses = useSelector((state: RootState) => state.courses.courses);
  const coursesLoading = useSelector(
    (state: RootState) => state.courses.loading
  );
  const coursesError = useSelector((state: RootState) => state.courses.error);
  const blogs = useSelector((state: RootState) => state.blogs.blogs);
  const blogsLoading = useSelector((state: RootState) => state.blogs.loading);
  const blogsError = useSelector((state: RootState) => state.blogs.error);
  const webinars = useSelector((state: RootState) => state.webinars.webinars);
  const webinarsLoading = useSelector(
    (state: RootState) => state.webinars.loading
  );
  const webinarsError = useSelector((state: RootState) => state.webinars.error);
  const about = useSelector((state: RootState) => state.about.content);

  useEffect(() => {
    dispatch(fetchBanners());
    dispatch(fetchFeatures());
    dispatch(fetchStats());
    dispatch(fetchTestimonials());
    dispatch(fetchFaqs());
    dispatch(fetchWhyChooseUs());
    dispatch(fetchCourses());
    dispatch(fetchBlogs());
    dispatch(fetchWebinars());
    dispatch(fetchAbout());
  }, [dispatch]);

  // Map backend banner fields to frontend expected fields
  const mappedBanners = banners.map((banner: any) => ({
    ...banner,
    img: banner.image,
    headline: banner.title,
    subheadline: banner.subtitle,
    ctas: banner.ctas || [],
    stats: banner.stats || [],
    badge: banner.badge || undefined,
  }));

  if (bannersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="flex flex-col items-center relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500/30 border-t-purple-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-purple-500/20"></div>
          </div>
          <p className="mt-6 text-slate-300 font-medium text-lg">
            Loading amazing content...
          </p>
        </div>
      </div>
    );
  }

  if (bannersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl relative z-10 max-w-md mx-4">
          <div className="text-red-400 text-xl font-semibold mb-4">
            {bannersError}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // About section data fallback
  const aboutData = about || {
    headline: "Learn the Stock Market Anytime, Anywhere!",
    subheadline: "Know About INVESMATE",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative pt-12">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
      {/* Enhanced Hero Banner Section */}
      <section className="relative w-full min-h-screen overflow-hidden bg-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={1200}
          loop={true}
          pagination={{ clickable: true, el: ".hero-pagination" }}
          navigation={{ prevEl: ".banner_prev", nextEl: ".banner_next" }}
          className="w-full min-h-screen"
        >
          {mappedBanners.length > 0 ? (
            mappedBanners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
                    {/* Left Content */}
                    <div className="space-y-8">
                      <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                          <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                            {banner.headline}
                          </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                          {banner.subheadline}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          to={"/courses"}
                        >
                          <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl shadow-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                          {banner.ctaText}
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        </Link>

                        <Link
                          to={"/webinars"}
                        >
                          <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                            <Play className="mr-2 w-5 h-5" />
                            Live session
                          </button>
                        </Link>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-6 pt-4">
                        {banner.stats && banner.stats.length > 0 ? (
                          banner.stats.map(
                            (
                              stat: { value: string | number; label: string },
                              idx: number
                            ) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-slate-300"
                              >
                                {/* Icon logic based on stat.label */}
                                {stat.label
                                  ?.toLowerCase()
                                  .includes("student") && (
                                  <Users className="w-5 h-5 text-purple-400" />
                                )}
                                {stat.label
                                  ?.toLowerCase()
                                  .includes("course") && (
                                  <BookOpen className="w-5 h-5 text-blue-400" />
                                )}
                                {stat.label
                                  ?.toLowerCase()
                                  .includes("rating") && (
                                  <Star className="w-5 h-5 text-yellow-400" />
                                )}
                                <span className="font-semibold text-white">
                                  {stat.value}
                                </span>
                                <span>{stat.label}</span>
                              </div>
                            )
                          )
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Users className="w-5 h-5 text-purple-400" />
                              <span className="font-semibold text-white">
                                50,000+
                              </span>
                              <span>Students</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <BookOpen className="w-5 h-5 text-blue-400" />
                              <span className="font-semibold text-white">
                                500+
                              </span>
                              <span>Courses</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Star className="w-5 h-5 text-yellow-400" />
                              <span className="font-semibold text-white">
                                4.8
                              </span>
                              <span>Rating</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Right Content - Image/Visual */}
                    <div className="relative">
                      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p- lg:p-11">
                        {/* Placeholder for main visual */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="rounded-xl w-full h-full object-cover"
                          />
                          <div className="absolute text-center space-y-4 cursor-pointer">
                            <div className="w-16 h-16 mx-auto bg-black/60 hover:backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Play className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          New Course
                        </div>

                        <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Live Sessions
                        </div>
                      </div>

                      {/* Background Decoration */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl -z-10"></div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="min-h-screen flex items-center justify-center text-white">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">
                    Welcome to Our Platform
                  </h1>
                  <p className="text-xl text-slate-300">No banners available</p>
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        {/* Bottom Navigation Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-purple-900/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/10 rounded-full text-sm font-semibold mb-8">
              <Trophy className="w-5 h-5 mr-2 text-amber-400" />
              <span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Why Will You Choose Stop Loss Stock Market Academy?
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover what makes us the preferred choice for professionals and
              students worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.length > 0 ? (
              whyChooseUs.map((item, index) => (
                <div
                  key={item._id}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 "
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                    {item.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-slate-400 py-12">
                <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">No features available at the moment</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-stretch gap-12">
          {/* Left: Image */}
          <div className="flex-1 flex justify-center items-stretch">
            <img
              src={aboutData.image}
              alt="About Invesmate"
              className="w-full h-full min-h-[600px] max-w-md rounded-3xl shadow-2xl border-4 border-white/10 object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="flex-1 flex flex-col justify-between min-h-[600px]">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                {aboutData.headline}
              </h2>
              <p className="text-xl text-slate-300 mb-8 font-semibold">
                {aboutData.subheadline}
              </p>
              <div className="space-y-6 mb-10 flex-grow">
                {aboutData.sections &&
                  aboutData.sections.map((section: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-5">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        {/* Icon logic */}
                        {section.icon === "sebi" && (
                          <svg
                            width="32"
                            height="32"
                            fill="none"
                            viewBox="0 0 32 32"
                          >
                            <circle
                              cx="16"
                              cy="16"
                              r="16"
                              fill="#fff"
                              fillOpacity="0.1"
                            />
                            <path
                              d="M10 22V10h12v12H10zm2-2h8V12h-8v8z"
                              fill="#7C3AED"
                            />
                          </svg>
                        )}
                        {section.icon === "trust" && (
                          <svg
                            width="32"
                            height="32"
                            fill="none"
                            viewBox="0 0 32 32"
                          >
                            <circle
                              cx="16"
                              cy="16"
                              r="16"
                              fill="#fff"
                              fillOpacity="0.1"
                            />
                            <path
                              d="M16 8l6 4v8l-6 4-6-4v-8l6-4zm0 2.18L11 12.13v7.74l5 3.33 5-3.33v-7.74l-5-1.95z"
                              fill="#10B981"
                            />
                          </svg>
                        )}
                        {section.icon === "mentorship" && (
                          <svg
                            width="32"
                            height="32"
                            fill="none"
                            viewBox="0 0 32 32"
                          >
                            <circle
                              cx="16"
                              cy="16"
                              r="16"
                              fill="#fff"
                              fillOpacity="0.1"
                            />
                            <path
                              d="M16 10a4 4 0 110 8 4 4 0 010-8zm0 10c3.31 0 6 2.24 6 5v1H10v-1c0-2.76 2.69-5 6-5z"
                              fill="#F59E42"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">
                          {section.title}
                        </h4>
                        <p className="text-slate-300 text-base">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-auto">
              <Link
                to={aboutData.buttonLink}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                {aboutData.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.length > 0 ? (
                stats.map((stat, index) => (
                  <div
                    key={stat._id}
                    className="text-center group"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-slate-300 font-medium text-lg">
                      {stat.label}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-slate-400 py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No statistics available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Courses */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Featured Courses
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl">
                Discover our most popular and highly-rated courses designed by
                industry experts
              </p>
            </div>
            <Link
              to="/courses"
              className="hidden md:inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="relative h-[550px]">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              speed={1000}
              loop={courses.length > 3}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 3 },
              }}
              navigation={{
                prevEl: ".courses_prev",
                nextEl: ".courses_next",
              }}
            >
              {courses.length > 0 ? (
                courses.map((course) => (
                  <SwiperSlide key={course._id} className="h-auto">
                    <Link
                      to={`/courses/${course._id}`}
                      className="group flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl h-full"
                    >
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <img
                          src={
                            course.thumbnail ||
                            "https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg"
                          }
                          alt={course.title || "Course thumbnail"}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                            Bestseller
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-3 py-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold text-white ml-1">
                              {course.rating || "4.8"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2 min-h-[3.5rem]">
                          {course.title || "Untitled Course"}
                        </h3>
                        <p className="text-slate-300 mb-6 line-clamp-3 leading-relaxed flex-grow min-h-[4.5rem]">
                          {course.description ||
                            "Comprehensive course designed to enhance your skills."}
                        </p>

                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center text-slate-300">
                              <Users className="h-4 w-4 mr-2 text-purple-400" />
                              <span className="text-sm font-medium">
                                {course.enrolledStudents?.length || 0} students
                              </span>
                            </div>
                            <div className="flex items-center text-slate-300">
                              <Clock className="h-4 w-4 mr-2 text-blue-400" />
                              <span className="text-sm font-medium">
                                12 weeks
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                              ₹{course.price?.toLocaleString() || "0"}
                            </span>
                            <div className="flex items-center text-emerald-400 bg-emerald-400/20 px-3 py-1 rounded-full">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              <span className="text-sm font-semibold">
                                Popular
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center h-full">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
                    <p className="text-slate-400 text-lg">
                      No courses available
                    </p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>

            {/* Enhanced Navigation Buttons */}
            <button className="courses_prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10 shadow-lg">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="courses_next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10 shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/courses"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Latest Blogs */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Latest Insights
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl">
                Stay updated with industry trends and expert knowledge from our
                thought leaders
              </p>
            </div>
            <Link
              to="/blogs"
              className="hidden md:inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              speed={1000}
              loop={blogs.length > 2}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              navigation={{
                prevEl: ".blogs_prev",
                nextEl: ".blogs_next",
              }}
            >
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <SwiperSlide key={blog._id}>
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="group block bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 transform shadow-xl"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            blog.thumbnail ||
                            "https://images.pexels.com/photos/3243/pen-notebook-notes-studying.jpg"
                          }
                          alt={blog.title || "Blog thumbnail"}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                            Featured
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-tight">
                          {blog.title || "Untitled Blog"}
                        </h3>
                        <p className="text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                          {blog.content ||
                            "Discover insights and knowledge from industry experts."}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={
                                blog.authorId?.profileImage ||
                                "https://placehold.co/40"
                              }
                              alt={blog.authorId?.name || "Author"}
                              className="h-12 w-12 rounded-full mr-3 object-cover border-2 border-white/20"
                            />
                            <div>
                              <span className="text-sm font-semibold text-white block">
                                {blog.authorId?.name || "Expert Author"}
                              </span>
                              <span className="text-xs text-slate-400">
                                Content Creator
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-slate-300 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                            {blog.createdAt &&
                            !isNaN(new Date(blog.createdAt).getTime())
                              ? format(new Date(blog.createdAt), "MMM d, yyyy")
                              : "Recent"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
                    <p className="text-slate-400 text-lg">
                      No blog posts available
                    </p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="blogs_prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10 shadow-lg">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="blogs_next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10 shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/blogs"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Upcoming Webinars */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Live Webinars
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl">
                Join live sessions with industry experts and expand your
                knowledge
              </p>
            </div>
            <Link
              to="/webinars"
              className="hidden md:inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              View All Webinars
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              speed={1000}
              loop={webinars.length > 1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
              }}
              navigation={{
                prevEl: ".webinars_prev",
                nextEl: ".webinars_next",
              }}
            >
              {webinars.length > 0 ? (
                webinars.map((webinar) => (
                  <SwiperSlide key={webinar._id} className="h-auto">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 shadow-xl h-full flex flex-col">
                      <div className="p-8 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                              Live Soon
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              Free
                            </span>
                          </div>
                          <div className="flex items-center text-slate-300 bg-white/10 border border-white/20 px-4 py-2 rounded-full">
                            <Users className="h-4 w-4 mr-2 text-purple-400" />
                            <span className="font-semibold">
                              {webinar.attendees?.length || 0}
                            </span>
                            <span className="ml-1">registered</span>
                          </div>
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-6 leading-tight min-h-[6rem]">
                          {webinar.title || "Expert-Led Webinar Session"}
                        </h3>

                        <p className="text-slate-300 mb-8 text-lg leading-relaxed line-clamp-3 flex-grow min-h-[5rem]">
                          {webinar.description ||
                            "Join us for an insightful session with industry experts."}
                        </p>

                        <div className="flex items-center mb-8">
                          <img
                            src={
                              webinar.speaker?.profileImage ||
                              "https://placehold.co/60"
                            }
                            alt={webinar.speaker?.name || "Speaker"}
                            className="h-16 w-16 rounded-full mr-4 object-cover border-2 border-white/20"
                          />
                          <div>
                            <p className="text-xl font-semibold text-white">
                              {webinar.speaker?.name || "Expert Speaker"}
                            </p>
                            <p className="text-slate-300">
                              Industry Expert & Trainer
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center text-slate-300 bg-white/10 border border-white/20 p-4 rounded-xl">
                              <Calendar className="h-5 w-5 mr-3 text-purple-400" />
                              <span className="font-semibold">
                                {webinar.startTime &&
                                !isNaN(new Date(webinar.startTime).getTime())
                                  ? format(new Date(webinar.startTime), "PPp")
                                  : "Date TBA"}
                              </span>
                            </div>
                            <div className="flex items-center text-slate-300 bg-white/10 border border-white/20 p-4 rounded-xl">
                              <Clock className="h-5 w-5 mr-3 text-blue-400" />
                              <span className="font-semibold">
                                {webinar.duration || 60} minutes
                              </span>
                            </div>
                          </div>

                          <Link
                            to={`/webinars/${webinar._id}`}
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                          >
                            Register Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center h-full">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
                    <p className="text-slate-400 text-lg">
                      No webinars scheduled
                    </p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="webinars_prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10 shadow-lg">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="webinars_next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10 shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/webinars"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              View All Webinars
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-white/10 rounded-full text-sm font-semibold mb-8">
              <Star className="w-5 h-5 mr-2 text-amber-400" />
              <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                What Our Learners Say
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Success Stories & Testimonials
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Hear from professionals and students who have transformed their
              careers with us
            </p>
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              speed={1000}
              loop={testimonials.length > 1}
              pagination={{ clickable: true, el: ".testimonials-pagination" }}
              navigation={{
                prevEl: ".testimonials_prev",
                nextEl: ".testimonials_next",
              }}
            >
              {testimonials.length > 0 ? (
                testimonials.map((t) => (
                  <SwiperSlide key={t._id}>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-4xl mx-auto shadow-2xl">
                      <div className="flex justify-center mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-6 h-6 text-amber-400 fill-current"
                          />
                        ))}
                      </div>
                      <blockquote className="text-2xl md:text-3xl text-slate-200 mb-8 italic leading-relaxed font-light">
                        "{t.text}"
                      </blockquote>
                      <div className="flex items-center justify-center">
                        <img
                          src={t.img || "/placeholder.svg"}
                          alt={t.name}
                          className="w-20 h-20 rounded-full mr-6 object-cover border-4 border-purple-500/30 shadow-lg"
                        />
                        <div className="text-left">
                          <div className="text-xl font-bold text-white">
                            {t.name}
                          </div>
                          <div className="text-slate-300">{t.title}</div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
                    <Star className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
                    <p className="text-slate-400 text-lg">
                      No testimonials available
                    </p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="testimonials_prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10 shadow-lg">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="testimonials_next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-4 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10 shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="testimonials-pagination flex justify-center mt-8 gap-2"></div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-md border border-white/10 rounded-full text-sm font-semibold mb-8">
              <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Got Questions? We've Got Answers
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Find answers to the most common questions about our platform,
              courses, and support
            </p>
          </div>
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Ready to Transform Your Career?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                Join over 50,000 professionals who have advanced their careers
                with our expert-led courses. Start your journey today with a
                free trial.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                to="/register"
                className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center px-10 py-5 border-2 border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Browse Courses
              </Link>
            </div>

            <div className="text-center">
              <p className="text-slate-400 mb-6 text-lg">
                Trusted by professionals from
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-white font-bold text-xl">Google</div>
                <div className="text-white font-bold text-xl">Microsoft</div>
                <div className="text-white font-bold text-xl">Amazon</div>
                <div className="text-white font-bold text-xl">Meta</div>
                <div className="text-white font-bold text-xl">Apple</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function FAQAccordion({ faqs }: { faqs: any[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.length > 0 ? (
        faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
          >
            <button
              className="w-full flex justify-between items-center p-8 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-2xl"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
            >
              <span className="font-bold text-white text-left text-lg pr-4">
                {faq.question}
              </span>
              <div
                className={`flex-shrink-0 transition-transform duration-300 ${
                  openIdx === idx ? "rotate-90" : ""
                }`}
              >
                <ChevronRight className="w-6 h-6 text-purple-400" />
              </div>
            </button>
            {openIdx === idx && (
              <div className="px-8 pb-8 text-slate-300 animate-fadeIn leading-relaxed text-lg">
                {faq.answer}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
          <p className="text-slate-400 text-lg">No FAQs available</p>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(-10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
      `}</style>
    </div>
  );
}

export default Home;
