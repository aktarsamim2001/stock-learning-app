import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import CreateCourse from './pages/courses/CreateCourse';
import PaymentHistory from './pages/payments/PaymentHistory';
import BlogList from './pages/blogs/BlogList';
import BlogDetail from './pages/blogs/BlogDetail';
import CreateBlog from './pages/blogs/CreateBlog';
import WebinarList from './pages/webinars/WebinarList';
import WebinarDetail from './pages/webinars/WebinarDetail';
import CreateWebinar from './pages/webinars/CreateWebinar';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';
import ErrorBoundary from './components/ErrorBoundary';
import AboutPage from './pages/about';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-72 h-72 bg-purple-600 opacity-30 rounded-full filter blur-3xl animate-blob1 left-[-6rem] top-[-6rem]" />
          <div className="absolute w-96 h-96 bg-blue-500 opacity-20 rounded-full filter blur-3xl animate-blob2 right-[-8rem] bottom-[-8rem]" />
          <div className="absolute w-60 h-60 bg-indigo-400 opacity-20 rounded-full filter blur-2xl animate-blob3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        {/* Loader content */}
        {/* <div className="flex flex-col items-center z-10">
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 opacity-30 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-20 w-20 bg-gradient-to-tr from-purple-500 to-blue-500 opacity-80"></span>
            <svg className="absolute animate-spin h-12 w-12 text-white" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
          <p className="mt-6 text-blue-100 font-semibold text-lg tracking-wide animate-pulse">Loading amazing content...</p>
        </div> */}
        {/* Custom keyframes for blobs */}
        <style>{`
          @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,-20px) scale(1.1);} 66%{transform:translate(-20px,20px) scale(0.9);} }
          @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(-40px,30px) scale(1.05);} 66%{transform:translate(20px,-30px) scale(0.95);} }
          @keyframes blob3 { 0%,100%{transform:translate(-50%,-50%) scale(1);} 33%{transform:translate(-60%,-40%) scale(1.08);} 66%{transform:translate(-40%,-60%) scale(0.92);} }
          .animate-blob1 { animation: blob1 7s infinite ease-in-out; }
          .animate-blob2 { animation: blob2 8s infinite ease-in-out; }
          .animate-blob3 { animation: blob3 9s infinite ease-in-out; }
        `}</style>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <UserProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/webinars" element={<WebinarList />} />
              <Route path="/webinars/:id" element={<WebinarDetail />} />
              
              <Route 
                path="/blogs/create" 
                element={
                  <RoleRoute allowedRoles={['instructor', 'admin']}>
                    <CreateBlog />
                  </RoleRoute>
                } 
              />
              
              <Route 
                path="/webinars/create" 
                element={
                  <RoleRoute allowedRoles={['instructor', 'admin']}>
                    <CreateWebinar />
                  </RoleRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/instructor/courses/create" 
                element={
                  <RoleRoute allowedRoles={['instructor', 'admin']}>
                    <CreateCourse />
                  </RoleRoute>
                } 
              />
              
              <Route 
                path="/courses/create" 
                element={
                  <RoleRoute allowedRoles={['instructor', 'admin']}>
                    <CreateCourse />
                  </RoleRoute>
                } 
              />
              
              <Route 
                path="/payments/history" 
                element={
                  <ProtectedRoute>
                    <PaymentHistory />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </UserProvider>
    </ErrorBoundary>
  );
}

// Helper component to route to the appropriate dashboard based on user role
const DashboardRouter = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <Navigate to="/\" replace />;
  }
};

export default App;