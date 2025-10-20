import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBolt, FaWater, FaRoad, FaGift, FaEllipsisH, FaSignOutAlt } from 'react-icons/fa';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const categories = [
    {
      id: 'electricity',
      name: 'বিদ্যুৎ সমস্যা',
      icon: FaBolt,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'drainage',
      name: 'নর্দমা সমস্যা',
      icon: FaWater,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'road',
      name: 'রাস্তাঘাট সমস্যা',
      icon: FaRoad,
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600'
    },
    {
      id: 'festival',
      name: 'উৎসব',
      icon: FaGift,
      color: 'from-pink-400 to-purple-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    {
      id: 'other',
      name: 'অন্যান্য',
      icon: FaEllipsisH,
      color: 'from-green-400 to-teal-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">২৬ নম্বর ওয়ার্ড</h1>
            <p className="text-sm text-gray-600">স্বাগতম, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
          >
            <FaSignOutAlt /> লগআউট
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            সমস্যার ধরন নির্বাচন করুন
          </h2>
          <p className="text-lg text-gray-600">
            আপনার সমস্যার ধরন অনুযায়ী একটি ক্যাটাগরি বেছে নিন
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => navigate(`/report/${category.id}`)}
                className="card p-8 text-center cursor-pointer group hover:scale-105"
              >
                <div className="flex justify-center mb-6">
                  <div className={`${category.bgColor} p-6 rounded-full group-hover:scale-110 transition-transform`}>
                    <Icon className={`text-5xl ${category.iconColor}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <div className={`h-1 w-20 mx-auto rounded-full bg-gradient-to-r ${category.color}`}></div>
              </button>
            );
          })}
        </div>

        {/* My Reports Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/my-reports')}
            className="btn-secondary"
          >
            আমার রিপোর্টসমূহ দেখুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
