import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaArrowLeft, FaUserShield } from 'react-icons/fa';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password, true);
    
    if (result.success) {
      toast.success('অ্যাডমিন লগইন সফল হয়েছে!');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white hover:text-blue-200 mb-6 font-semibold"
        >
          <FaArrowLeft /> ফিরে যান
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-full mb-4 shadow-lg">
              <FaUserShield className="text-4xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              অ্যাডমিন প্যানেল
            </h2>
            <p className="text-gray-600">
              ওয়ার্ড প্রশাসনের জন্য সুরক্ষিত লগইন
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                ইমেইল
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="admin@ward26.gov.bd"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner w-5 h-5 border-2"></div>
                  <span>লগইন হচ্ছে...</span>
                </div>
              ) : (
                'অ্যাডমিন লগইন'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 text-center">
              🔒 এটি একটি সুরক্ষিত অ্যাডমিন এরিয়া
            </p>
          </div>

          {/* Branding Footer */}
          <div className="mt-8 text-center border-t pt-6">
            <p className="text-lg sm:text-xl font-bold text-blue-600 mb-2">
              🌟 An Initiative by Susobhan Mondal (Michael)
            </p>
            <p className="text-sm text-gray-400">
              Developed & Maintained by Joydeep Bhattacharya
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
