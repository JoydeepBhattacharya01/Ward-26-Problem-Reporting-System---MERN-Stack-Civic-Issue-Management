import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUsers, FaFileAlt } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Initiative Branding - Top Position */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-2xl p-6 mx-auto max-w-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <span className="text-2xl">🌟</span>
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-wide">
              An Initiative by
            </h3>
            <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-300 mb-2 drop-shadow-lg">
              Susobhan Mondal (Michael)
            </h2>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <span className="w-6 h-0.5 bg-blue-300"></span>
              <span className="text-xs font-medium">Empowering Communities</span>
              <span className="w-6 h-0.5 bg-blue-300"></span>
            </div>
            <p className="text-blue-100 text-xs mt-2 font-light">
              Developed & Maintained by Joydeep Bhattacharya
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <div className="inline-block bg-blue-600 text-white p-6 rounded-full shadow-lg mb-4">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-blue-800 mb-4">
            ২৬ নম্বর ওয়ার্ড
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-700 mb-6">
            আমাদের ওয়ার্ড
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-8">
            <p className="text-2xl md:text-3xl font-medium text-gray-700 italic">
              "আমার এলাকা, আমার দায়িত্ব"
            </p>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            আপনার এলাকার সমস্যা জানান এবং দ্রুত সমাধান পান
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Admin Login */}
          <button
            onClick={() => navigate('/admin/login')}
            className="card p-8 text-center cursor-pointer group"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaUserShield className="text-4xl text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              অ্যাডমিন লগইন
            </h3>
            <p className="text-gray-600">
              ওয়ার্ড প্রশাসনের জন্য
            </p>
          </button>

          {/* User Login */}
          <button
            onClick={() => navigate('/login')}
            className="card p-8 text-center cursor-pointer group"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200 transition-colors">
                <FaUsers className="text-4xl text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              ব্যবহারকারী লগইন
            </h3>
            <p className="text-gray-600">
              নাগরিকদের জন্য
            </p>
          </button>

          {/* Report Problem */}
          <button
            onClick={() => navigate('/register')}
            className="card p-8 text-center cursor-pointer group bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full group-hover:bg-opacity-30 transition-colors">
                <FaFileAlt className="text-4xl text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              সমস্যা রিপোর্ট করুন
            </h3>
            <p className="text-blue-100">
              নতুন ব্যবহারকারী? এখানে শুরু করুন
            </p>
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-6 inline-block">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">যোগাযোগ:</span> ২৬ নম্বর ওয়ার্ড কাউন্সিলর অফিস
            </p>
            <p className="text-gray-600 text-sm">
              সেবায় নিয়োজিত আছি আমরা
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
