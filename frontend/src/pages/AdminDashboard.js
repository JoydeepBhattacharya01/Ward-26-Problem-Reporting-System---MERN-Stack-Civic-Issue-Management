import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { FaSignOutAlt, FaClock, FaSpinner, FaCheckCircle, FaChartBar } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', adminNotes: '' });
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const categoryNames = {
    electricity: 'বিদ্যুৎ সমস্যা',
    drainage: 'নর্দমা সমস্যা',
    road: 'রাস্তাঘাট সমস্যা',
    festival: 'উৎসব',
    medical_emergency: 'চিকিৎসা জরুরি অবস্থা',
    other: 'অন্যান্য'
  };

  const statusNames = {
    pending: 'অপেক্ষমাণ',
    in_progress: 'চলমান',
    resolved: 'সমাধান হয়েছে'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800'
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProblems();
    fetchStats();
  }, [filter, user, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? API_ENDPOINTS.PROBLEMS : `${API_ENDPOINTS.PROBLEMS}?status=${filter}`;
      const response = await axios.get(url);
      setProblems(response.data.problems);
    } catch (error) {
      toast.error('সমস্যা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PROBLEMS_STATS);
      setStats(response.data);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const handleStatusUpdate = async (problemId) => {
    if (!statusUpdate.status) {
      toast.error('স্ট্যাটাস নির্বাচন করুন');
      return;
    }

    try {
      console.log('Updating status for problem:', problemId);
      console.log('Status update data:', statusUpdate);
      console.log('API URL:', API_ENDPOINTS.UPDATE_PROBLEM_STATUS(problemId));
      console.log('Auth header:', axios.defaults.headers.common['Authorization']);
      
      const response = await axios.put(API_ENDPOINTS.UPDATE_PROBLEM_STATUS(problemId), statusUpdate);
      console.log('Status update response:', response.data);
      
      toast.success('স্ট্যাটাস আপডেট করা হয়েছে');
      setSelectedProblem(null);
      setStatusUpdate({ status: '', adminNotes: '' });
      fetchProblems();
      fetchStats();
    } catch (error) {
      console.error('Status update error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        toast.error('অনুমোদন ব্যর্থ হয়েছে - আবার লগইন করুন');
      } else if (error.response?.status === 403) {
        toast.error('অ্যাডমিন অ্যাক্সেস প্রয়োজন');
      } else if (error.response?.status === 404) {
        toast.error('সমস্যা পাওয়া যায়নি');
      } else {
        toast.error(`স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Debug function to test API connection
  const testAPIConnection = async () => {
    try {
      console.log('Testing API connection...');
      console.log('Current auth header:', axios.defaults.headers.common['Authorization']);
      
      const response = await axios.get(API_ENDPOINTS.PROBLEMS);
      console.log('API test successful:', response.data);
      toast.success('API connection working');
    } catch (error) {
      console.error('API test failed:', error);
      toast.error('API connection failed');
    }
  };

  const searchByComplaintId = async () => {
    if (!searchId.trim()) {
      toast.error('Please enter a complaint ID');
      return;
    }

    try {
      setSearching(true);
      const response = await axios.get(`/api/problems/search?complaintId=${searchId.trim()}`);
      setSearchResult(response.data.problem);
      toast.success('Complaint found!');
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Complaint not found');
        setSearchResult(null);
      } else {
        toast.error('Search failed');
      }
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchId('');
    setSearchResult(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">অ্যাডমিন ড্যাশবোর্ড (Admin Dashboard)</h1>
              <p className="text-blue-200">২৬ নম্বর ওয়ার্ড - সমস্যা ব্যবস্থাপনা (Ward 26 - Problem Management)</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={testAPIConnection}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                Test API
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                <FaSignOutAlt /> লগআউট (Logout)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">মোট সমস্যা (Total Problems)</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaChartBar className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">অপেক্ষমাণ (Pending)</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaClock className="text-2xl text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">চলমান (In Progress)</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaSpinner className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">সমাধান হয়েছে (Resolved)</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.resolved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            সব (All)
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            অপেক্ষমাণ (Pending)
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'in_progress'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            চলমান (In Progress)
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'resolved'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            সমাধান হয়েছে (Resolved)
          </button>
        </div>

        {/* Search by Complaint ID */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">কমপ্লেইন আইডি দিয়ে খুঁজুন (Search by Complaint ID)</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              placeholder="কমপ্লেইন আইডি লিখুন (Enter Complaint ID, e.g., CMP1001)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={searchByComplaintId}
              disabled={searching}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {searching ? 'খুঁজছি... (Searching...)' : 'খুঁজুন (Search)'}
            </button>
            {searchResult && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600"
              >
                পরিষ্কার (Clear)
              </button>
            )}
          </div>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">খোঁজার ফলাফল (Search Result)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p><strong>Complaint ID:</strong> {searchResult.complaintId}</p>
                <p><strong>Category:</strong> {categoryNames[searchResult.category]}</p>
                <p><strong>Subcategory:</strong> {searchResult.subcategory}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${statusColors[searchResult.status]}`}>
                    {statusNames[searchResult.status]}
                  </span>
                </p>
              </div>
              <div>
                <p><strong>Reporter:</strong> {searchResult.userName}</p>
                <p><strong>Phone:</strong> {searchResult.userPhone}</p>
                <p><strong>Location:</strong> {searchResult.location.address}</p>
                {searchResult.location.coordinates && searchResult.location.coordinates.latitude && (
                  <p><strong>GPS:</strong> 
                    <span className="text-sm">
                      {searchResult.location.coordinates.latitude.toFixed(6)}, {searchResult.location.coordinates.longitude.toFixed(6)}
                    </span>
                    <br />
                    <a 
                      href={`https://www.google.com/maps?q=${searchResult.location.coordinates.latitude},${searchResult.location.coordinates.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View on Maps
                    </a>
                  </p>
                )}
                <p><strong>Date:</strong> {formatDate(searchResult.createdAt)}</p>
              </div>
            </div>
            <div className="mt-4">
              <p><strong>Description:</strong></p>
              <p className="text-gray-700 mt-1">{searchResult.description}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedProblem(searchResult)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                স্ট্যাটাস আপডেট (Update Status)
              </button>
            </div>
          </div>
        )}

        {/* Problems Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : problems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">কোনো সমস্যা পাওয়া যায়নি (No problems found)</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">আইডি (ID)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ক্যাটাগরি (Category)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">বিবরণ (Description)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">রিপোর্টকারী (Reporter)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">তারিখ (Date)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">স্ট্যাটাস (Status)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">অ্যাকশন (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {problems.map((problem) => (
                    <tr key={problem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-600">
                        {problem.complaintId}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {categoryNames[problem.category]}
                          </p>
                          <p className="text-sm text-gray-600">{problem.subcategory}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 max-w-xs truncate">
                          {problem.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {problem.location.address}
                        </p>
                        {problem.location.coordinates && problem.location.coordinates.latitude && (
                          <p className="text-xs text-blue-600 mt-1">
                            GPS: {problem.location.coordinates.latitude.toFixed(4)}, {problem.location.coordinates.longitude.toFixed(4)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">{problem.userName}</p>
                        <p className="text-xs text-gray-600">{problem.userPhone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(problem.createdAt).toLocaleDateString('bn-BD')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[problem.status]}`}>
                          {statusNames[problem.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedProblem(problem);
                            setStatusUpdate({ status: problem.status, adminNotes: problem.adminNotes || '' });
                          }}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          আপডেট করুন (Update)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">সমস্যা আপডেট করুন (Update Problem)</h3>
              
              {/* Problem Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <p><span className="font-semibold">ক্যাটাগরি:</span> {categoryNames[selectedProblem.category]}</p>
                <p><span className="font-semibold">সাব-ক্যাটাগরি:</span> {selectedProblem.subcategory}</p>
                <p><span className="font-semibold">বিবরণ:</span> {selectedProblem.description}</p>
                <p><span className="font-semibold">অবস্থান (Location):</span> {selectedProblem.location.address}</p>
                {selectedProblem.location.coordinates && selectedProblem.location.coordinates.latitude && (
                  <p><span className="font-semibold">GPS স্থানাঙ্ক (GPS Coordinates):</span> 
                    <br />
                    <span className="text-sm text-gray-600">
                      Latitude: {selectedProblem.location.coordinates.latitude.toFixed(6)}, 
                      Longitude: {selectedProblem.location.coordinates.longitude.toFixed(6)}
                    </span>
                    <br />
                    <a 
                      href={`https://www.google.com/maps?q=${selectedProblem.location.coordinates.latitude},${selectedProblem.location.coordinates.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Google Maps এ দেখুন (View on Google Maps)
                    </a>
                  </p>
                )}
                <p><span className="font-semibold">রিপোর্টকারী:</span> {selectedProblem.userName} ({selectedProblem.userPhone})</p>
              </div>

              {/* Images */}
              {selectedProblem.images && selectedProblem.images.length > 0 && (
                <div className="mb-6">
                  <p className="font-semibold mb-2">ছবিসমূহ (Images):</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProblem.images.map((image, index) => (
                      <img
                        key={index}
                        src={`/${image}`}
                        alt={`Problem ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(`/${image}`)}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">ছবি বড় করে দেখতে ক্লিক করুন (Click to enlarge images)</p>
                </div>
              )}

              {/* Status Update Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">স্ট্যাটাস (Status)</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="pending">অপেক্ষমাণ (Pending)</option>
                    <option value="in_progress">চলমান (In Progress)</option>
                    <option value="resolved">সমাধান হয়েছে (Resolved)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">অ্যাডমিন নোট (Admin Notes)</label>
                  <textarea
                    value={statusUpdate.adminNotes}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, adminNotes: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="মন্তব্য লিখুন... (Write comments...)"
                  ></textarea>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleStatusUpdate(selectedProblem._id)}
                  className="flex-1 btn-primary"
                >
                  আপডেট করুন (Update)
                </button>
                <button
                  onClick={() => {
                    setSelectedProblem(null);
                    setStatusUpdate({ status: '', adminNotes: '' });
                  }}
                  className="flex-1 btn-secondary"
                >
                  বাতিল করুন (Cancel)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Enlargement Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
