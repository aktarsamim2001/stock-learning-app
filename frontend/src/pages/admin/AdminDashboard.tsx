import { useEffect, useState } from 'react';
import CourseManagement from './CourseManagement';
import UsersManagement from './UsersManagement';
import WebinarsManagement from './WebinarsManagement';
import BlogManagement from './BlogManagement';
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
import axios from '../../axiosConfig';

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
  // All hooks at the top, before any return
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
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState('');
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'delete' | 'deleteCourse' | null;
    userId: string | null;
    courseId?: string | null;
  }>({ type: null, userId: null, courseId: null });
  const [activeSection, setActiveSection] = useState<'courses' | 'users' | 'webinars' | 'blogs'>('courses');

  useEffect(() => {
    dispatch(fetchUsers({}));
    dispatch(fetchCourseStats());
    dispatch(fetchRevenueAnalytics({}));
  }, [dispatch]);

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

  // Handlers
  const handleDeleteCourse = (courseId: string) => {
    setConfirmAction({ type: 'deleteCourse', userId: null, courseId });
  };
  const handleApproveUser = async (userId: string) => {
    setConfirmAction({ type: 'approve', userId });
  };
  const handleDeleteUser = async (userId: string) => {
    setConfirmAction({ type: 'delete', userId });
  };
  const handleConfirm = async () => {
    try {
      if (confirmAction.type === 'approve' && confirmAction.userId) {
        await dispatch(updateUser({ id: confirmAction.userId, userData: { approved: true, status: 'active' } })).unwrap();
        toast.success('User approved and activated successfully');
      } else if (confirmAction.type === 'delete' && confirmAction.userId) {
        await dispatch(deleteUser(confirmAction.userId)).unwrap();
        toast.success('User deleted successfully');
      } else if (confirmAction.type === 'deleteCourse' && confirmAction.courseId) {
        await axios.delete(`/api/admin/courses/${confirmAction.courseId}`);
        toast.success('Course deleted successfully');
        dispatch(fetchCourseStats());
      }
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    } finally {
      setConfirmAction({ type: null, userId: null, courseId: null });
    }
  };
  const handleCancel = () => {
    setConfirmAction({ type: null, userId: null, courseId: null });
  };

  // Prepare revenue chart data from revenueData array
  const revenueLabels = revenueData.map((item) => {
    const month = item._id.month;
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1];
  });
  const revenueTotals = revenueData.map((item) => item.total);

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
      {/* Animated background */}
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
        {/* Menu Bar */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-6 py-2 rounded-md font-semibold text-white transition-all duration-200 ${activeSection === 'courses' ? 'bg-purple-600' : 'bg-white/10 hover:bg-purple-700'}`}
            onClick={() => setActiveSection('courses')}
          >
            Course Management
          </button>
          <button
            className={`px-6 py-2 rounded-md font-semibold text-white transition-all duration-200 ${activeSection === 'users' ? 'bg-purple-600' : 'bg-white/10 hover:bg-purple-700'}`}
            onClick={() => setActiveSection('users')}
          >
            Users Management
          </button>
          <button
            className={`px-6 py-2 rounded-md font-semibold text-white transition-all duration-200 ${activeSection === 'webinars' ? 'bg-purple-600' : 'bg-white/10 hover:bg-purple-700'}`}
            onClick={() => setActiveSection('webinars')}
          >
            Webinars Management
          </button>
          <button
            className={`px-6 py-2 rounded-md font-semibold text-white transition-all duration-200 ${activeSection === 'blogs' ? 'bg-purple-600' : 'bg-white/10 hover:bg-purple-700'}`}
            onClick={() => setActiveSection('blogs')}
          >
            Blog Management
          </button>
        </div>

        {/* Section Content */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          {activeSection === 'courses' && <CourseManagement onDeleteCourse={handleDeleteCourse} />}
          {activeSection === 'users' && <UsersManagement onApproveUser={handleApproveUser} onDeleteUser={handleDeleteUser} />}
          {activeSection === 'webinars' && <WebinarsManagement />}
          {activeSection === 'blogs' && <BlogManagement />}
        </div>

        {/* Confirmation Modal (keep for actions) */}
        {confirmAction.type && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                {confirmAction.type === 'approve'
                  ? 'Approve User'
                  : confirmAction.type === 'delete'
                  ? 'Delete User'
                  : 'Delete Course'}
              </h2>
              <p className="mb-6 text-gray-700">
                {confirmAction.type === 'approve'
                  ? 'Are you sure you want to approve and activate this user?'
                  : confirmAction.type === 'delete'
                  ? 'Are you sure you want to delete this user? This action cannot be undone.'
                  : 'Are you sure you want to delete this course? This action cannot be undone.'}
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