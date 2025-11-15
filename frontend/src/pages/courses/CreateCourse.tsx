import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { createCourse } from "../../store/slices/courseSlice";
import type { AppDispatch } from "../../store/store";
import React from "react";

interface Lesson {
  title: string;
  content: string;
  duration: number;
  order: number;
  video: string; // Bunny.net video link
}

const CreateCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setThumbnail(e.target.files[0]);
      setThumbnailUrl(''); // Clear URL if file is chosen
    }
  };

  const handleThumbnailUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(e.target.value);
    if (e.target.value) setThumbnail(null); // Clear file if URL is entered
  };

  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        title: "",
        content: "",
        duration: 0,
        order: prev.length,
        video: "",
      },
    ]);
  };

  const removeLesson = (index: number) => {
    setLessons((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLesson = (
    index: number,
    field: keyof Lesson,
    value: string | number
  ) => {
    setLessons((prev) =>
      prev.map((lesson, i) =>
        i === index
          ? {
              ...lesson,
              [field]: field === "duration" ? parseInt(value as string) : value,
            }
          : lesson
      )
    );
  };

  // Validation function
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.description.trim() || formData.description.trim().length < 20)
      newErrors.description = "Description must be at least 20 characters.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (formData.price < 0) newErrors.price = "Price cannot be negative.";
  if (!thumbnail && !thumbnailUrl) newErrors.thumbnail = "Course thumbnail is required (file or URL).";
    if (!lessons.length) newErrors.lessons = "At least one lesson is required.";
    lessons.forEach((lesson, idx) => {
      if (!lesson.title.trim())
        newErrors[`lesson-title-${idx}`] = `Lesson ${idx + 1}: Title is required.`;
      if (!lesson.content.trim())
        newErrors[`lesson-content-${idx}`] = `Lesson ${idx + 1}: Content is required.`;
      if (!lesson.duration || lesson.duration <= 0)
        newErrors[`lesson-duration-${idx}`] = `Lesson ${idx + 1}: Duration must be positive.`;
      if (lesson.order < 0)
        newErrors[`lesson-order-${idx}`] = `Lesson ${idx + 1}: Order must be non-negative.`;
      if (!lesson.video || !lesson.video.trim())
        newErrors[`lesson-video-${idx}`] = `Lesson ${idx + 1}: Bunny.net video link is required.`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const courseData = new FormData();
      courseData.append("title", formData.title);
      courseData.append("description", formData.description);
      courseData.append("price", formData.price.toString());
      courseData.append("category", formData.category);
      courseData.append("lessons", JSON.stringify(lessons));
      if (thumbnail) {
        courseData.append("thumbnail", thumbnail);
      } else if (thumbnailUrl) {
        courseData.append("thumbnailUrl", thumbnailUrl);
      }
      courseData.append("published", "true");
      await dispatch(createCourse(courseData)).unwrap();
      // After creating, publish the course (if backend supports it)
      // Optionally, you can add a published field to the formData and backend
      navigate("/courses");
    } catch (error) {
      console.error("Failed to create course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Animated Background Particles */}
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

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-8">
          Create New Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-white"
                  >
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                
                <div className="group">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-white"
                  >
                    Instructor
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                  >
                    <option value="" className="bg-gray-800">
                      Select a category
                    </option>
                    <option value="programming" className="bg-gray-800">
                      Programming
                    </option>
                    <option value="design" className="bg-gray-800">
                      Design
                    </option>
                    <option value="business" className="bg-gray-800">
                      Business
                    </option>
                    <option value="marketing" className="bg-gray-800">
                      Marketing
                    </option>
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-white"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-white"
                  >
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    required
                    value={isNaN(formData.price) ? 0 : formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                  />
                  {errors.price && (
                    <p className="text-red-400 text-xs mt-1">{errors.price}</p>
                  )}
                </div>

                <div className="group">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-white"
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                  >
                    <option value="" className="bg-gray-800">
                      Select a category
                    </option>
                    <option value="programming" className="bg-gray-800">
                      Programming
                    </option>
                    <option value="design" className="bg-gray-800">
                      Design
                    </option>
                    <option value="business" className="bg-gray-800">
                      Business
                    </option>
                    <option value="marketing" className="bg-gray-800">
                      Marketing
                    </option>
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-white">Course Thumbnail</label>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center gap-2">
                    <label className="relative cursor-pointer bg-white/10 rounded-md font-medium text-blue-100 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 transition-colors duration-300 px-3 py-2">
                      <span>Upload a file</span>
                      <input
                        id="thumbnail"
                        name="thumbnail"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleThumbnailChange}
                        disabled={!!thumbnailUrl}
                      />
                    </label>
                    <span className="text-blue-100">or</span>
                    <input
                      type="text"
                      placeholder="Paste image URL here"
                      value={thumbnailUrl}
                      onChange={handleThumbnailUrlChange}
                      className="block w-64 rounded-md border border-white/20 bg-white/10 py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={!!thumbnail}
                    />
                  </div>
                  <p className="text-xs text-blue-100">PNG, JPG, GIF up to 10MB or provide a direct image URL</p>
                  {errors.thumbnail && (
                    <p className="text-red-400 text-xs mt-1">{errors.thumbnail}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Course Lessons
              </h2>
              <button
                type="button"
                onClick={addLesson}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </button>
            </div>
            {errors.lessons && (
              <p className="text-red-400 text-xs mb-2">{errors.lessons}</p>
            )}
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="border border-white/20 rounded-lg p-4 bg-white/5 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Lesson {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="group">
                    <div className="group">
                      <label className="block text-sm font-medium text-white">
                        Bunny.net Video Link
                      </label>
                      <input
                        type="text"
                        value={lesson.video}
                        onChange={(e) =>
                          updateLesson(index, "video", e.target.value)
                        }
                        placeholder="https://video.bunnycdn.com/..."
                        className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      />
                      {errors[`lesson-video-${index}`] && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors[`lesson-video-${index}`]}
                        </p>
                      )}
                    </div>
                      <label className="block text-sm font-medium text-white">
                        Lesson Title
                      </label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(index, "title", e.target.value)
                        }
                        className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      />
                      {errors[`lesson-title-${index}`] && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors[`lesson-title-${index}`]}
                        </p>
                      )}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-white">
                        Content
                      </label>
                      <textarea
                        value={lesson.content}
                        onChange={(e) =>
                          updateLesson(index, "content", e.target.value)
                        }
                        rows={3}
                        className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      />
                      {errors[`lesson-content-${index}`] && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors[`lesson-content-${index}`]}
                        </p>
                      )}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-white">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={isNaN(lesson.duration) ? 0 : lesson.duration}
                        onChange={(e) =>
                          updateLesson(
                            index,
                            "duration",
                            parseInt(e.target.value)
                          )
                        }
                        className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      />
                      {errors[`lesson-duration-${index}`] && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors[`lesson-duration-${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/15 focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 ${
                loading
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              }`}
            >
              {loading ? "Creating..." : "Create Webinar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
