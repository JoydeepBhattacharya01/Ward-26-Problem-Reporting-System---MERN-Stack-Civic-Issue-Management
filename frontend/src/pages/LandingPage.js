import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaList, FaFileAlt } from 'react-icons/fa';

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
            <h2 className="text-lg md:text-xl font-extrabold text-yellow-300 mb-2 drop-shadow-lg text-center">
              Hon'ble Councillor Susobhan Mondal (Michael), Ward No. 26, Krishnapur
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
          
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 italic">
            "আমার এলাকা, আমার দায়িত্ব"
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-700 mb-8">
            Ward No. 26
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            আপনার এলাকার সমস্যা জানান এবং দ্রুত সমাধান পান
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
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

          {/* Report Problem */}
          <button
            onClick={() => navigate('/categories')}
            className="card p-8 text-center cursor-pointer group bg-gradient-to-br from-green-500 to-green-600 text-white"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full group-hover:bg-opacity-30 transition-colors">
                <FaFileAlt className="text-4xl text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              সমস্যা রিপোর্ট করুন
            </h3>
            <p className="text-green-100">
              সরাসরি সমস্যা জানান - কোন রেজিস্ট্রেশন প্রয়োজন নেই
            </p>
          </button>

          {/* View My Reports */}
          <button
            onClick={() => navigate('/my-reports')}
            className="card p-8 text-center cursor-pointer group bg-gradient-to-br from-purple-500 to-purple-600 text-white"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full group-hover:bg-opacity-30 transition-colors">
                <FaList className="text-4xl text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              রিপোর্ট স্ট্যাটাস দেখুন
            </h3>
            <p className="text-purple-100">
              মোবাইল নাম্বার দিয়ে আপনার রিপোর্টের অবস্থা জানুন
            </p>
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-6 inline-block">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Contact:</span> Ward 26 Councillor Office
            </p>
            <p className="text-gray-600 text-sm">
              সেবায় নিয়োজিত আছি আমরা
            </p>
          </div>
          
          {/* Copyright */}
          <div className="mt-6">
            <p className="text-gray-500 text-sm">
              © ২০২৫ আমার এলাকা আমার দায়িত্ব | All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
