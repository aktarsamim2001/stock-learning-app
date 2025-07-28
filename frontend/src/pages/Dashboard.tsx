import { useContext } from 'react';
import UserContext from '../context/UserContext';
import { Users, BookOpen, PenTool, Award, BookCheck, Layers } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-500">User not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user.role === 'admin' 
            ? 'Admin Dashboard' 
            : user.role === 'instructor' 
              ? 'Instructor Dashboard' 
              : 'Student Dashboard'}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Welcome back, {user.name}!
        </p>
      </div>
      
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'instructor' && <InstructorDashboard />}
      {user.role === 'student' && <StudentDashboard />}
    </div>
  );
};

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Users', value: '137', icon: Users, color: 'bg-blue-500' },
    { name: 'Active Courses', value: '24', icon: BookOpen, color: 'bg-purple-500' },
    { name: 'Instructors', value: '12', icon: PenTool, color: 'bg-green-500' },
    { name: 'Pending Approvals', value: '4', icon: Layers, color: 'bg-yellow-500' },
  ];
  
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Approvals</h3>
            <div className="mt-4">
              <div className="border-t border-gray-200 pt-4">
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    <li className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                            <Users className="h-full w-full text-gray-400" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">John Smith</p>
                          <p className="text-sm text-gray-500 truncate">john.smith@example.com</p>
                        </div>
                        <div>
                          <div className="inline-flex items-center space-x-2">
                            <button className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm">
                              Approve
                            </button>
                            <button className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                            <Users className="h-full w-full text-gray-400" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">Sarah Johnson</p>
                          <p className="text-sm text-gray-500 truncate">sarah.johnson@example.com</p>
                        </div>
                        <div>
                          <div className="inline-flex items-center space-x-2">
                            <button className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm">
                              Approve
                            </button>
                            <button className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-4">
              <div className="border-t border-gray-200 pt-4">
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    <li className="py-4">
                      <div className="flex">
                        <div className="mr-4 flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">New course created: "Advanced React Patterns"</p>
                          <p className="text-sm text-gray-500">1 hour ago</p>
                        </div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex">
                        <div className="mr-4 flex-shrink-0">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">New user registered: "Emma Wilson"</p>
                          <p className="text-sm text-gray-500">3 hours ago</p>
                        </div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex">
                        <div className="mr-4 flex-shrink-0">
                          <PenTool className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Instructor application received: "Michael Brown"</p>
                          <p className="text-sm text-gray-500">5 hours ago</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructorDashboard = () => {
  const stats = [
    { name: 'Your Courses', value: '5', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Total Students', value: '73', icon: Users, color: 'bg-purple-500' },
    { name: 'Course Completion', value: '87%', icon: Award, color: 'bg-green-500' },
    { name: 'Average Rating', value: '4.8', icon: BookCheck, color: 'bg-yellow-500' },
  ];
  
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Courses</h3>
            <div className="mt-4">
              <div className="border-t border-gray-200 pt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Students
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completion
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">React Fundamentals</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">24</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">92%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">4.9</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 underline bg-transparent border-none p-0 cursor-pointer">
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">TypeScript for Beginners</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">18</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">85%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">4.7</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 underline bg-transparent border-none p-0 cursor-pointer">
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Advanced Node.js</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">12</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">78%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">4.6</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 underline bg-transparent border-none p-0 cursor-pointer">
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-5">
                <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Create New Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const stats = [
    { name: 'Enrolled Courses', value: '3', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Completed Courses', value: '1', icon: Award, color: 'bg-green-500' },
    { name: 'Hours Spent', value: '47', icon: Layers, color: 'bg-purple-500' },
    { name: 'Certificates', value: '1', icon: BookCheck, color: 'bg-yellow-500' },
  ];
  
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Courses</h3>
            <div className="mt-4">
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900">React Fundamentals</h4>
                      <p className="text-sm text-gray-500 mt-1">Instructor: John Smith</p>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full w-3/4"></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">75% Complete</p>
                      </div>
                      <div className="mt-4">
                        <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900">TypeScript for Beginners</h4>
                      <p className="text-sm text-gray-500 mt-1">Instructor: Sarah Johnson</p>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full w-1/4"></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">25% Complete</p>
                      </div>
                      <div className="mt-4">
                        <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="h-40 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900">JavaScript Basics</h4>
                      <p className="text-sm text-gray-500 mt-1">Instructor: Michael Brown</p>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full w-full"></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">100% Complete</p>
                      </div>
                      <div className="mt-4">
                        <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          View Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recommended Courses</h3>
            <div className="mt-4">
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Advanced React Patterns</h4>
                      <p className="text-sm text-gray-500">Build on your React skills with advanced patterns and techniques</p>
                    </div>
                    <div>
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Enroll
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Node.js Microservices</h4>
                      <p className="text-sm text-gray-500">Learn how to build scalable microservices with Node.js</p>
                    </div>
                    <div>
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;