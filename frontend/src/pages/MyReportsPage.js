import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const MyReportsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const categoryNames = {
    electricity: 'বিদ্যুৎ সমস্যা',
    drainage: 'নর্দমা সমস্যা',
    road: 'রাস্তাঘাট সমস্যা',
    festival: 'উৎসব',
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

  const statusIcons = {
    pending: FaClock,
    in_progress: FaSpinner,
    resolved: FaCheckCircle
  };

  useEffect(() => {
    fetchProblems();
  }, [filter]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? '/api/problems' : `/api/problems?status=${filter}`;
      const response = await axios.get(url);
      setProblems(response.data.problems);
    } catch (error) {
      toast.error('সমস্যা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2 font-semibold"
          >
            <FaArrowLeft /> ফিরে যান
          </button>
          <h1 className="text-2xl font-bold text-gray-800">আমার রিপোর্টসমূহ</h1>
          <p className="text-sm text-gray-600">{user?.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
            সব ({problems.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            অপেক্ষমাণ
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'in_progress'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            চলমান
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'resolved'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            সমাধান হয়েছে
          </button>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">কোনো রিপোর্ট পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {problems.map((problem) => {
              const StatusIcon = statusIcons[problem.status];
              return (
                <div key={problem._id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {categoryNames[problem.category]}
                      </h3>
                      <p className="text-gray-600">{problem.subcategory}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${statusColors[problem.status]}`}>
                      <StatusIcon /> {statusNames[problem.status]}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">বিবরণ:</span> {problem.description}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">অবস্থান:</span> {problem.location.address}
                    </p>
                    {problem.pollNumber && (
                      <p className="text-gray-700">
                        <span className="font-semibold">খুঁটির নাম্বার:</span> {problem.pollNumber}
                      </p>
                    )}
                    {problem.adminNotes && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-800">
                          <span className="font-semibold">অ্যাডমিন নোট:</span> {problem.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Images */}
                  {problem.images && problem.images.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                      {problem.images.map((image, index) => (
                        <img
                          key={index}
                          src={`/${image}`}
                          alt={`Problem ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                    <span>রিপোর্ট করা হয়েছে: {formatDate(problem.createdAt)}</span>
                    {problem.resolvedAt && (
                      <span className="text-green-600">
                        সমাধান: {formatDate(problem.resolvedAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReportsPage;
