import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaArrowLeft, FaPhone, FaSearch, FaEye, FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';
import Footer from '../components/Footer';

const UserReportsPage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800'
  };

  const statusLabels = {
    pending: 'অপেক্ষমান',
    in_progress: 'প্রক্রিয়াধীন',
    resolved: 'সমাধান হয়েছে'
  };

  const statusIcons = {
    pending: FaClock,
    in_progress: FaSpinner,
    resolved: FaCheckCircle
  };

  const categoryNames = {
    infrastructure_public_works: 'অবকাঠামো ও জনকাজ',
    waste_management_sanitation: 'বর্জ্য ব্যবস্থাপনা ও স্যানিটেশন',
    parks_public_spaces: 'পার্ক ও পাবলিক স্পেস',
    water_sanitation_services: 'পানি ও স্যানিটেশন সেবা',
    electricity_power: 'বিদ্যুৎ ও পাওয়ার',
    public_transport_traffic: 'পাবলিক ট্রান্সপোর্ট ও ট্রাফিক',
    housing_community_facilities: 'আবাসন ও কমিউনিটি সুবিধা',
    safety_law_enforcement: 'নিরাপত্তা ও আইন প্রয়োগ',
    education_social_services: 'শিক্ষা ও সামাজিক সেবা',
    others: 'অন্যান্য',
    // Legacy categories for backward compatibility
    electricity: 'বিদ্যুৎ সমস্যা',
    drainage: 'নর্দমা সমস্যা',
    road: 'রাস্তাঘাট সমস্যা',
    festival: 'উৎসব',
    medical_emergency: 'চিকিৎসা জরুরি অবস্থা',
    other: 'অন্যান্য'
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast.error('মোবাইল নাম্বার লিখুন');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await axios.get(API_ENDPOINTS.USER_PROBLEMS(phoneNumber));
      setReports(response.data.problems);
      
      if (response.data.problems.length === 0) {
        toast.info('এই নাম্বারে কোন রিপোর্ট পাওয়া যায়নি');
      } else {
        toast.success(`${response.data.problems.length}টি রিপোর্ট পাওয়া গেছে`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('রিপোর্ট খুঁজতে সমস্যা হয়েছে');
      setReports([]);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">২৬ নম্বর ওয়ার্ড</h1>
            <p className="text-sm text-gray-600">আপনার রিপোর্ট দেখুন</p>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <FaArrowLeft /> ফিরে যান
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              আপনার রিপোর্ট দেখুন
            </h2>
            <p className="text-gray-600">
              মোবাইল নাম্বার দিয়ে আপনার সব রিপোর্ট খুঁজে দেখুন
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-field pl-10"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner w-4 h-4 border-2"></div>
                    <span>খুঁজছি...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaSearch />
                    <span>খুঁজুন</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {searched && (
          <div className="space-y-6">
            {reports.length > 0 ? (
              <>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    আপনার রিপোর্টসমূহ ({reports.length}টি)
                  </h3>
                  <p className="text-gray-600">
                    সর্বশেষ রিপোর্ট প্রথমে দেখানো হচ্ছে
                  </p>
                </div>

                <div className="grid gap-6">
                  {reports.map((report) => {
                    const StatusIcon = statusIcons[report.status];
                    return (
                      <div key={report._id} className="bg-white rounded-lg shadow-md p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">
                              {categoryNames[report.category]}
                            </h4>
                            <p className="text-sm text-gray-500">
                              রিপোর্ট ID: <span className="font-mono font-semibold">{report.complaintId}</span>
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${statusColors[report.status]}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusLabels[report.status]}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">সমস্যার ধরন:</p>
                            <p className="text-gray-600">{report.subcategory}</p>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-700">বিবরণ:</p>
                            <p className="text-gray-600">{report.description}</p>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-700">অবস্থান:</p>
                            <p className="text-gray-600">{report.location.address}</p>
                          </div>

                          {report.pollNumber && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700">খুঁটির নাম্বার:</p>
                              <p className="text-gray-600">{report.pollNumber}</p>
                            </div>
                          )}

                          {report.adminNotes && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-blue-800 mb-1">অ্যাডমিন নোট:</p>
                              <p className="text-blue-700">{report.adminNotes}</p>
                            </div>
                          )}

                          {report.resolvedAt && (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-green-800 mb-1">সমাধানের তারিখ:</p>
                              <p className="text-green-700">{formatDate(report.resolvedAt)}</p>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>রিপোর্ট করা হয়েছে: {formatDate(report.createdAt)}</span>
                            {report.images && report.images.length > 0 && (
                              <span className="flex items-center gap-1">
                                <FaEye />
                                {report.images.length} ছবি
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  কোন রিপোর্ট পাওয়া যায়নি
                </h3>
                <p className="text-gray-500 mb-6">
                  এই মোবাইল নাম্বারে কোন সমস্যার রিপোর্ট নেই।
                </p>
                <button
                  onClick={() => navigate('/categories')}
                  className="btn-primary"
                >
                  নতুন সমস্যা রিপোর্ট করুন
                </button>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!searched && (
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              কিভাবে কাজ করে?
            </h3>
            <div className="text-blue-700 space-y-2">
              <p>১. আপনার মোবাইল নাম্বার দিন যা দিয়ে সমস্যা রিপোর্ট করেছিলেন</p>
              <p>২. আপনার সব রিপোর্ট দেখুন - অপেক্ষমান, প্রক্রিয়াধীন এবং সমাধান হওয়া</p>
              <p>৩. অ্যাডমিনের নোট এবং সমাধানের আপডেট দেখুন</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserReportsPage;
