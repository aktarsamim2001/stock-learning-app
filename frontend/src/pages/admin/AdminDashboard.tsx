import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Users,
  BookOpen,
  IndianRupee,
  PieChart,
  UserCheck,
  UserX,
  Download,
  Search,
  Filter,
  Calendar,
  Pencil as PencilIcon, // Or just Pencil if you prefer
  Trash2 as TrashIcon // Or just Trash2
} from 'lucide-react';
import {
  fetchUsers,
  fetchCourseStats,
  fetchRevenueAnalytics,
  updateUser,
  deleteUser,
} from '../../store/slices/adminSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    courseStats,
    revenueData,
    loading,
    error,
    totalPages,
    currentPage,
  } = useSelector((state: RootState) => state.admin);

  // Add state for course management
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  // Blog Management State
  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState('');

  useEffect(() => {
    dispatch(fetchUsers({}));
    dispatch(fetchCourseStats());
    dispatch(fetchRevenueAnalytics({}));
  }, [dispatch]);

  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'delete' | null;
    userId: string | null;
  }>({ type: null, userId: null });

  useEffect(() => {
    dispatch(fetchUsers({}));
    dispatch(fetchCourseStats());
    dispatch(fetchRevenueAnalytics({}));
  }, [dispatch]);

  const handleApproveUser = async (userId: string) => {
    setConfirmAction({ type: 'approve', userId });
  };

  const handleDeleteUser = async (userId: string) => {
    setConfirmAction({ type: 'delete', userId });
  };

  const handleConfirm = async () => {
    if (!confirmAction.userId) return;
    try {
      if (confirmAction.type === 'approve') {
        await dispatch(updateUser({ id: confirmAction.userId, userData: { approved: true, status: 'active' } })).unwrap();
        toast.success('User approved and activated successfully');
      } else if (confirmAction.type === 'delete') {
        await dispatch(deleteUser(confirmAction.userId)).unwrap();
        toast.success('User deleted successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    } finally {
      setConfirmAction({ type: null, userId: null });
    }
  };

  const handleCancel = () => {
    setConfirmAction({ type: null, userId: null });
  };

  // Prepare revenue chart data from revenueData array
  const revenueLabels = revenueData.map((item) => {
    const month = item._id.month;
    // Month names: Jan, Feb, ...
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1];
  });
  const revenueTotals = revenueData.map((item) => item.total);

  useEffect(() => {
    const fetchBlogs = async () => {
      setBlogLoading(true);
      try {
        const res = await axios.get('/api/blogs');
        setBlogs(res.data);
        setBlogError('');
      } catch (err) {
        setBlogError('Failed to fetch blogs');
      } finally {
        setBlogLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 border-r-2 border-blue-500 relative z-10"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
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
        <div className="text-red-400 relative z-10">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden pt-[110px]">
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
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Create Content Buttons */}
        <div className="flex justify-end mb-6 space-x-4">
          <Link
            to="/courses/create"
            className="inline-flex items-center px-5 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Create Course
          </Link>
          <Link
            to="/webinars/create"
            className="inline-flex items-center px-5 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Create Webinar
          </Link>
          <Link
            to="/blogs/create"
            className="inline-flex items-center px-5 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-105"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Create Blog
          </Link>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: 'Total Users', value: users.length },
            { icon: BookOpen, label: 'Total Courses', value: courseStats?.totalCourses || 0 },
            { icon: IndianRupee, label: 'Total Revenue', value: `₹${courseStats?.totalRevenue || 0}` },
            { icon: PieChart, label: 'Pending Approvals', value: users.filter(user => !user.approved).length },
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg transform hover:scale-105 transition-all duration-300">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-blue-100 truncate">{stat.label}</dt>
                      <dd className="text-lg font-medium text-white">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Management Section - Add this before User Management */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl transform hover:scale-105 transition-all duration-300">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Course Management
                </h3>
                <div className="flex space-x-2">
                  <div className="relative group">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                    <input
                      type="text"
                      value={courseSearchQuery}
                      onChange={(e) => setCourseSearchQuery(e.target.value)}
                      placeholder="Search courses..."
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    />
                  </div>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/15 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  >
                    <option value="all">All Courses</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-gray-800">
                    <tr>
                      {['Title', 'Instructor', 'Students', 'Price', 'Status', 'Actions'].map((header, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                    {courseStats?.courses?.map((course) => (
                      <tr key={course._id} className="hover:bg-white/10">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={course.thumbnail}
                                alt={course.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{course.title}</div>
                              <div className="text-sm text-blue-100">{course.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                          {course.instructor?.name || "Unknown Instructor"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                          {course.enrollmentCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                          ₹{course.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            course.status === 'active' ? 'bg-green-400/20 text-green-400' :
                            course.status === 'draft' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-red-400/20 text-red-400'
                          }`}>
                            {course.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/courses/${course._id}/edit`}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-300"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl transform hover:scale-105 transition-all duration-300">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  User Management
                </h3>
                <div className="flex space-x-2">
                  <div className="relative group">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    />
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/15 focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105">
                    <Filter className="h-4 w-4 mr-2 text-white" />
                    Filter
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/15 focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105">
                    <Download className="h-4 w-4 mr-2 text-white" />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-gray-800">
                    <tr>
                      {['Index', 'User', 'Role', 'Status', 'Joined', 'Actions'].map((header, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                    {users.map((user, index) => (
                      <tr key={user._id} className="hover:bg-white/10">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                                alt={user.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-sm text-blue-100">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/20 text-blue-400">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-400/20 text-green-400' :
                            user.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-red-400/20 text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                          {format(new Date(user.createdAt), 'PP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {!user.approved && (
                              <button
                                onClick={() => handleApproveUser(user._id)}
                                className="text-green-400 hover:text-green-300 transition-colors duration-300"
                              >
                                <UserCheck className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-300"
                            >
                              <UserX className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/15 transition-all duration-300">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/15 transition-all duration-300">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-blue-100">
                      Showing page <span className="font-medium text-white">{currentPage}</span> of{' '}
                      <span className="font-medium text-white">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md -space-x-px">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-white/20 bg-white/10 text-sm font-medium text-blue-100 hover:bg-white/15 transition-all duration-300">
                        Previous
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-white/20 bg-white/10 text-sm font-medium text-blue-100 hover:bg-white/15 transition-all duration-300">
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="mt-8">
          <div className="bg-gray-900 shadow-lg rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Revenue Analytics
              </h3>
              <div className="mt-4 h-64">
                <Line
                  data={{
                    labels: revenueLabels,
                    datasets: [
                      {
                        label: "Revenue (₹)",
                        data: revenueTotals,
                        fill: true,
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                        borderColor: "#8B5CF6",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(255, 255, 255, 0.1)" },
                        ticks: { color: "#E5E7EB" },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { color: "#E5E7EB" },
                      },
                    },
                    plugins: {
                      legend: {
                        labels: { color: "#E5E7EB" },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blog Management */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Blog Management
                </h3>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Add Blog</button>
              </div>
              {blogLoading ? (
                <div className="text-blue-100">Loading blogs...</div>
              ) : blogError ? (
                <div className="text-red-400">{blogError}</div>
              ) : (
                <table className="min-w-full divide-y divide-white/20 mb-2">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                    {blogs.map((blog) => (
                      <tr key={blog._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{blog.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">{blog.author?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Edit | Delete</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Webinar Management */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Webinar Management
                </h3>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Add Webinar</button>
              </div>
              <table className="min-w-full divide-y divide-white/20 mb-2">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Sample Webinar</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">2025-06-19</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Edit | Delete</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Banner Management */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Banner Management
                </h3>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Add Banner</button>
              </div>
              <table className="min-w-full divide-y divide-white/20 mb-2">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">[Banner Image]</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Sample Banner</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Edit | Delete</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Stats
                </h3>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Add Stat</button>
              </div>
              <table className="min-w-full divide-y divide-white/20 mb-2">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Label</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Sample Stat</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">123</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Edit | Delete</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Features
                </h3>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Add Feature</button>
              </div>
              <table className="min-w-full divide-y divide-white/20 mb-2">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Sample Feature</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Feature description</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Edit | Delete</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Why Choose Us
                </h3>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Add Reason</button>
              </div>
              <table className="min-w-full divide-y divide-white/20 mb-2">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Sample Reason</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Edit | Delete</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  FAQ
                </h3>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Add FAQ</button>
              </div>
              <table className="min-w-full divide-y divide-white/20 mb-2">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Question</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Answer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Sample Question?</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Sample Answer</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Edit | Delete</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-8 mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Testimonials
                </h3>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Add Testimonial</button>
              </div>
              <table className="min-w-full divide-y divide-white/20 mb-2">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-y-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Sample Name</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Sample testimonial message</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">Edit | Delete</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmAction.type && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                {confirmAction.type === 'approve' ? 'Approve User' : 'Delete User'}
              </h2>
              <p className="mb-6 text-gray-700">
                {confirmAction.type === 'approve'
                  ? 'Are you sure you want to approve and activate this user?'
                  : 'Are you sure you want to delete this user? This action cannot be undone.'}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded-md text-white ${confirmAction.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {confirmAction.type === 'approve' ? 'Approve' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;