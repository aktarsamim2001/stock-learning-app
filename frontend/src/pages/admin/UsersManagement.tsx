
import React from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { UserCheck, UserX } from 'lucide-react';
import type { RootState } from '../../store/store';

interface UsersManagementProps {
  onApproveUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ onApproveUser, onDeleteUser }) => {
  const { users, currentPage, totalPages } = useSelector((state: RootState) => state.admin);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>
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
                        onClick={() => onApproveUser(user._id)}
                        className="text-green-400 hover:text-green-300 transition-colors duration-300"
                      >
                        <UserCheck className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteUser(user._id)}
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
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-blue-100">
              Showing page <span className="font-medium text-white">{currentPage}</span> of{' '}
              <span className="font-medium text-white">{totalPages}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
