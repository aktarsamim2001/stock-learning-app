import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video } from 'lucide-react';
import { createWebinar } from '../../store/slices/webinarSlice';
import type { AppDispatch } from '../../store/store';
import { toast } from 'react-toastify';
import axios from '../../axiosConfig';

const CreateWebinar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: 60,
    link: '',
  });
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');

  useEffect(() => {
    // Fetch instructors from backend
    axios.get('/api/users/instructors')
      .then(res => setInstructors(res.data))
      .catch(() => setInstructors([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 60 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(createWebinar({ ...formData, speaker: selectedInstructor })).unwrap();
      toast.success('Webinar created successfully!');
      navigate('/webinars');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create webinar');
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
      
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-8">
          Create New Webinar
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="space-y-6">
              <div className="group">
                <label htmlFor="title" className="block text-sm font-medium text-white">
                  Webinar Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                  placeholder="Enter webinar title"
                />
              </div>

              <div className="group">
                <label htmlFor="description" className="block text-sm font-medium text-white">
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
                  placeholder="Describe your webinar"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="group">
                  <label htmlFor="startTime" className="block text-sm font-medium text-white">
                    Start Time
                  </label>
                  <div className="mt-1 relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <input
                      type="datetime-local"
                      name="startTime"
                      id="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleChange}
                      className="pl-10 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="duration" className="block text-sm font-medium text-white">
                    Duration (minutes)
                  </label>
                  <div className="mt-1 relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      required
                      min="15"
                      value={formData.duration}
                      onChange={handleChange}
                      className="pl-10 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    />
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="link" className="block text-sm font-medium text-white">
                  Webinar Link
                </label>
                <div className="mt-1 relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Video className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <input
                    type="url"
                    name="link"
                    id="link"
                    required
                    value={formData.link}
                    onChange={handleChange}
                    className="pl-10 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    placeholder="https://zoom.us/j/example"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="instructor" className="block text-sm font-medium text-white">
                  Instructor
                </label>
                <select
                  id="instructor"
                  name="instructor"
                  required
                  value={selectedInstructor}
                  onChange={e => setSelectedInstructor(e.target.value)}
                  className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map((inst: any) => (
                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/webinars')}
              className="px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/15 focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 ${
                loading ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              }`}
            >
              {loading ? 'Creating...' : 'Create Webinar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWebinar;