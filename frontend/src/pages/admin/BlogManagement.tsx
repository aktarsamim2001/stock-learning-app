

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pencil as PencilIcon, Trash2 as TrashIcon, Search, X } from 'lucide-react';
import { fetchBlogs, updateBlog, deleteBlog } from '../../store/slices/blogSlice';
import type { RootState, AppDispatch } from '../../store/store';

const BlogManagement: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', published: false, tags: '' });
  const [editErrors, setEditErrors] = useState<{ title?: string; content?: string }>({});
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setEditForm({
      title: blog.title,
      content: blog.content,
      published: blog.published,
      tags: blog.tags.join(', '),
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedBlog(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBlog) return;

    // Client-side validation
    const errors: { title?: string; content?: string } = {};
    if (!editForm.title.trim()) {
      errors.title = 'Blog title is required';
    } else if (editForm.title.trim().length < 3 || editForm.title.trim().length > 100) {
      errors.title = 'Title must be between 3 and 100 characters';
    }
    if (!editForm.content.trim()) {
      errors.content = 'Blog content is required';
    } else if (editForm.content.trim().length < 50) {
      errors.content = 'Content must be at least 50 characters';
    }
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editForm.title.trim());
      formData.append('content', editForm.content.trim());
      formData.append('published', String(editForm.published));
      // Append tags as individual fields (if backend expects array)
      const tagsArr = editForm.tags.split(',').map((t) => t.trim()).filter(Boolean);
      tagsArr.forEach(tag => formData.append('tags', tag));
      await dispatch(updateBlog({ id: selectedBlog._id, blogData: formData })).unwrap();
      closeEditModal();
    } catch (err) {
      // Optionally show error
    } finally {
      setEditLoading(false);
    }
  };

  const openDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedBlog(null);
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteBlog(selectedBlog._id)).unwrap();
      closeDeleteModal();
    } catch (err) {
      // Optionally show error
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <a
          href="/blogs/create"
          className="inline-flex items-center px-5 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
        >
          Create Blog
        </a>
      </div>
      <div className="flex space-x-2 mb-4">
        <div className="relative group">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/20">
          <thead className="bg-gray-800">
            <tr>
              {['Title', 'Author', 'Published', 'Created', 'Actions'].map((header, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-y-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-blue-200">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-red-400">{error}</td>
              </tr>
            ) : filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-blue-200">No blogs found.</td>
              </tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-white/10">
                  <td className="px-6 py-4 whitespace-nowrap text-blue-100 font-semibold">{blog.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-100">{blog.authorId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-100">{blog.published ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-100">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      title="Edit Blog"
                      onClick={() => openEditModal(blog)}
                    >
                      <PencilIcon className="h-5 w-5 inline" />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                      title="Delete Blog"
                      onClick={() => openDeleteModal(blog)}
                    >
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={closeEditModal}>
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Blog</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {editErrors.title && (
                  <div className="text-red-500 text-xs mt-1">{editErrors.title}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  name="content"
                  value={editForm.content}
                  onChange={handleEditChange}
                  rows={6}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {editErrors.content && (
                  <div className="text-red-500 text-xs mt-1">{editErrors.content}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={editForm.tags}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={editForm.published}
                  onChange={handleEditChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Published</label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${editLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={closeDeleteModal}>
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">Delete Blog</h3>
            <p>Are you sure you want to delete <span className="font-semibold">{selectedBlog.title}</span>?</p>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${deleteLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogManagement;
