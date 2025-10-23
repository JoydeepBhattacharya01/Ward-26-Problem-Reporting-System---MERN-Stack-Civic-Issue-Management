import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt, FaWater, FaHome, FaList, FaTools, FaTrash, FaTree, FaCar, FaShieldAlt, FaGraduationCap, FaEllipsisH } from 'react-icons/fa';
import Footer from '../components/Footer';

const CategoriesPage = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'infrastructure_public_works',
      name: 'অবকাঠামো ও জনকাজ',
      subtitle: 'Infrastructure & Public Works',
      icon: FaTools,
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600'
    },
    {
      id: 'waste_management_sanitation',
      name: 'বর্জ্য ব্যবস্থাপনা ও স্যানিটেশন',
      subtitle: 'Waste Management & Sanitation',
      icon: FaTrash,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'parks_public_spaces',
      name: 'পার্ক ও পাবলিক স্পেস',
      subtitle: 'Parks & Public Spaces',
      icon: FaTree,
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'water_sanitation_services',
      name: 'পানি ও স্যানিটেশন সেবা',
      subtitle: 'Water & Sanitation Services',
      icon: FaWater,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'electricity_power',
      name: 'বিদ্যুৎ ও পাওয়ার',
      subtitle: 'Electricity & Power',
      icon: FaBolt,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'public_transport_traffic',
      name: 'পাবলিক ট্রান্সপোর্ট ও ট্রাফিক',
      subtitle: 'Public Transport & Traffic',
      icon: FaCar,
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'housing_community_facilities',
      name: 'আবাসন ও কমিউনিটি সুবিধা',
      subtitle: 'Housing & Community Facilities',
      icon: FaHome,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    {
      id: 'safety_law_enforcement',
      name: 'নিরাপত্তা ও আইন প্রয়োগ',
      subtitle: 'Safety & Law Enforcement',
      icon: FaShieldAlt,
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      id: 'education_social_services',
      name: 'শিক্ষা ও সামাজিক সেবা',
      subtitle: 'Education & Social Services',
      icon: FaGraduationCap,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'others',
      name: 'অন্যান্য',
      subtitle: 'Others',
      icon: FaEllipsisH,
      color: 'from-slate-400 to-gray-500',
      bgColor: 'bg-slate-50',
      iconColor: 'text-slate-600'
    }
  ];

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">২৬ নম্বর ওয়ার্ড</h1>
            <p className="text-sm text-gray-600">সমস্যা রিপোর্ট করুন</p>
          </div>
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <FaHome /> হোম
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
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {category.subtitle}
                </p>
                <div className={`h-1 w-20 mx-auto rounded-full bg-gradient-to-r ${category.color}`}></div>
              </button>
            );
          })}
        </div>

        {/* My Reports Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/my-reports')}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <FaList />
            আমার রিপোর্টসমূহ দেখুন (View My Reports)
          </button>
        </div>

        {/* Info Section */}
        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              গুরুত্বপূর্ণ তথ্য
            </h3>
            <p className="text-blue-700">
              আপনার সমস্যা রিপোর্ট করার পর আমাদের টিম দ্রুত সমাধানের জন্য কাজ করবে। 
              জরুরি সমস্যার জন্য সরাসরি ওয়ার্ড কাউন্সিলর অফিসে যোগাযোগ করুন।
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
