


import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Pencil as PencilIcon, Trash2 as TrashIcon } from 'lucide-react';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchWebinars, deleteWebinar } from '../../store/slices/webinarSlice';
import { toast } from 'react-toastify';

const WebinarsManagement: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { webinars, loading, error } = useSelector((state: RootState) => state.webinars);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchWebinars());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    navigate(`/webinars/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await dispatch(deleteWebinar(id)).unwrap();
      toast.success('Webinar deleted successfully');
      dispatch(fetchWebinars());
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete webinar');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Webinars Management</h2>
        <Link
          to="/webinars/create"
          className="inline-flex items-center px-5 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
        >
          Create Webinar
        </Link>
      </div>
      {loading ? (
        <div className="text-blue-300">Loading webinars...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-gray-800">
              <tr>
                {['Index', 'Title', 'Speaker', 'Category', 'Start Time', 'Duration', 'Attendees', 'Status', 'Actions'].map((header, index) => (
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
              {webinars.map((webinar, index) => (
                <tr key={webinar._id} className="hover:bg-white/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={webinar.speaker?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(webinar.speaker?.name || 'Speaker')}`}
                          alt={webinar.speaker?.name || 'Speaker'}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{webinar.title}</div>
                        <div className="text-sm text-blue-100">{webinar.description?.slice(0, 30)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">{webinar.speaker?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">{webinar.category || 'General'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">{webinar.startTime ? format(new Date(webinar.startTime), 'PP p') : 'TBA'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">{webinar.duration || 60} mins</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">{webinar.attendees?.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      webinar.status === 'active' ? 'bg-green-400/20 text-green-400' :
                      webinar.status === 'draft' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-red-400/20 text-red-400'
                    }`}>
                      {webinar.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                        title="Edit Webinar"
                        onClick={() => handleEdit(webinar._id)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className={`text-red-400 hover:text-red-300 transition-colors duration-300 ${deletingId === webinar._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Delete Webinar"
                        onClick={() => setConfirmDeleteId(webinar._id)}
                        disabled={deletingId === webinar._id}
                      >
                        {deletingId === webinar._id ? 'Deleting...' : <TrashIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Confirmation Modal for Delete */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Delete Webinar</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this webinar? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
                disabled={deletingId !== null}
              >
                {deletingId === confirmDeleteId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebinarsManagement;
