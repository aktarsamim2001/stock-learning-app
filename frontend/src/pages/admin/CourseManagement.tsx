
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Pencil as PencilIcon, Trash2 as TrashIcon, Search } from 'lucide-react';
import type { RootState } from '../../store/store';

interface CourseManagementProps {
  onDeleteCourse: (courseId: string) => void;
}

const CourseManagement = ({ onDeleteCourse }: CourseManagementProps) => {
  const { courseStats } = useSelector((state: RootState) => state.admin);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filteredCourses = courseStats?.courses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || course.status === filter;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Link
          to="/courses/create"
          className="inline-flex items-center px-5 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
        >
          Create Course
        </Link>
      </div>
      <div className="flex space-x-2 mb-4">
        <div className="relative group">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/15 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        >
          <option value="all">All Courses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
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
            {filteredCourses.map((course) => (
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
                      onClick={() => onDeleteCourse(course._id)}
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
  );
};

export default CourseManagement;
