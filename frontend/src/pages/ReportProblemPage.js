import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaArrowLeft, FaMapMarkerAlt, FaCamera, FaCalendar } from 'react-icons/fa';

const ReportProblemPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subcategory: '',
    description: '',
    location: {
      address: '',
      coordinates: { latitude: null, longitude: null }
    },
    pollNumber: '',
    festivalDate: '',
    requirements: ''
  });
  const [images, setImages] = useState([]);

  const categoryNames = {
    electricity: 'বিদ্যুৎ সমস্যা',
    drainage: 'নর্দমা সমস্যা',
    road: 'রাস্তাঘাট সমস্যা',
    festival: 'উৎসব',
    medical_emergency: 'চিকিৎসা জরুরি অবস্থা',
    other: 'অন্যান্য'
  };

  const subcategories = {
    electricity: [
      'আলো জ্বলছে না',
      'তারের সমস্যা',
      'ট্রান্সফরমার সমস্যা',
      'অন্যান্য'
    ],
    drainage: [
      'ডার্টি ড্রেন',
      'মশার সমস্যা',
      'ব্লকেজ',
      'অন্যান্য'
    ],
    road: [
      'রাস্তা ভাঙা',
      'গর্ত',
      'অন্যান্য'
    ],
    festival: [
      'প্রাইভেট পূজা',
      'কমিটি পূজা'
    ],
    medical_emergency: [
      'হার্ট অ্যাটাক (Heart Attack)',
      'স্ট্রোক (Stroke)', 
      'শ্বাসকষ্ট (Breathing Problem)',
      'গুরুতর দুর্ঘটনা (Serious Accident)',
      'প্রসবকালীন জরুরি অবস্থা (Pregnancy Emergency)',
      'খিঁচুনি (Seizure)',
      'অজ্ঞান হয়ে যাওয়া (Unconsciousness)',
      'গুরুতর রক্তক্ষরণ (Severe Bleeding)',
      'বিষক্রিয়া (Poisoning)',
      'অন্যান্য জরুরি অবস্থা (Other Emergency)'
    ],
    other: ['সাধারণ সমস্যা']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address') {
      setFormData({
        ...formData,
        location: { ...formData.location, address: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.warning('সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
          });
          toast.success('লোকেশন সংগ্রহ করা হয়েছে');
        },
        (error) => {
          toast.error('লোকেশন সংগ্রহ করতে ব্যর্থ হয়েছে');
        }
      );
    } else {
      toast.error('আপনার ব্রাউজার GPS সাপোর্ট করে না');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      toast.error('প্রথমে লগইন করুন');
      navigate('/login');
      return;
    }

    if (!formData.subcategory) {
      toast.error('সাব-ক্যাটাগরি নির্বাচন করুন');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('সমস্যার বিবরণ লিখুন');
      return;
    }

    if (!formData.location.address.trim()) {
      toast.error('অবস্থান লিখুন');
      return;
    }

    console.log('Submitting problem with data:', {
      category,
      subcategory: formData.subcategory,
      description: formData.description,
      location: formData.location,
      user: user?.name
    });

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('category', category);
      submitData.append('subcategory', formData.subcategory);
      submitData.append('description', formData.description);
      submitData.append('location', JSON.stringify(formData.location));
      
      if (category === 'electricity' && formData.pollNumber) {
        submitData.append('pollNumber', formData.pollNumber);
      }
      
      if (category === 'festival') {
        if (formData.festivalDate) {
          submitData.append('festivalDate', formData.festivalDate);
        }
        if (formData.requirements) {
          submitData.append('requirements', formData.requirements);
        }
      }

      images.forEach((image) => {
        submitData.append('images', image);
      });

      const response = await axios.post('/api/problems', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('সমস্যা সফলভাবে রিপোর্ট করা হয়েছে!');
      navigate('/my-reports');
    } catch (error) {
      console.error('Submit error:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg || err.message).join(', ');
        toast.error(errorMessages);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(`নেটওয়ার্ক সমস্যা: ${error.message}`);
      } else {
        toast.error('সমস্যা রিপোর্ট করতে ব্যর্থ হয়েছে');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <FaArrowLeft /> ফিরে যান (Go Back)
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {categoryNames[category]}
            </h2>
            <p className="text-gray-600">সমস্যার বিস্তারিত তথ্য দিন (Provide detailed information about the problem)</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subcategory */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                সমস্যার ধরন (Problem Type) *
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">নির্বাচন করুন (Select One)</option>
                {subcategories[category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Poll Number (for electricity) */}
            {category === 'electricity' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  খুঁটির নাম্বার (Pole Number)
                </label>
                <input
                  type="text"
                  name="pollNumber"
                  value={formData.pollNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="যদি জানা থাকে (If known)"
                />
              </div>
            )}

            {/* Festival Date (for festival) */}
            {category === 'festival' && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    পূজার তারিখ (Festival Date)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="festivalDate"
                      value={formData.festivalDate}
                      onChange={handleChange}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    প্রয়োজনীয়তা (Requirements)
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="কি কি প্রয়োজন তা লিখুন (Write what is needed)"
                  ></textarea>
                </div>
              </>
            )}

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                বিবরণ (Description) *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="সমস্যার বিস্তারিত বর্ণনা দিন (Provide detailed description of the problem)"
                required
              ></textarea>
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                অবস্থান (Location) *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.location.address}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="ঠিকানা লিখুন (Enter address)"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={getLocation}
                  className="btn-secondary whitespace-nowrap"
                >
                  GPS ব্যবহার করুন (Use GPS)
                </button>
              </div>
              {formData.location.coordinates.latitude && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ GPS লোকেশন সংগ্রহ করা হয়েছে (GPS location collected)
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                ছবি আপলোড করুন (Upload Images) (ঐচ্ছিক, সর্বোচ্চ ৫টি - Optional, max 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <FaCamera className="text-4xl text-gray-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-semibold">
                    ছবি নির্বাচন করুন (Select Images)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner w-5 h-5 border-2"></div>
                  <span>জমা দেওয়া হচ্ছে...</span>
                </div>
              ) : (
                'জমা দিন (Submit)'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportProblemPage;
