import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaArrowLeft, FaMapMarkerAlt, FaCamera, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';

const ReportProblemPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
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
    infrastructure_public_works: 'অবকাঠামো ও জনকাজ (Infrastructure & Public Works)',
    waste_management_sanitation: 'বর্জ্য ব্যবস্থাপনা ও স্যানিটেশন (Waste Management & Sanitation)',
    parks_public_spaces: 'পার্ক ও পাবলিক স্পেস (Parks & Public Spaces)',
    water_sanitation_services: 'পানি ও স্যানিটেশন সেবা (Water & Sanitation Services)',
    electricity_power: 'বিদ্যুৎ ও পাওয়ার (Electricity & Power)',
    public_transport_traffic: 'পাবলিক ট্রান্সপোর্ট ও ট্রাফিক (Public Transport & Traffic)',
    housing_community_facilities: 'আবাসন ও কমিউনিটি সুবিধা (Housing & Community Facilities)',
    safety_law_enforcement: 'নিরাপত্তা ও আইন প্রয়োগ (Safety & Law Enforcement)',
    education_social_services: 'শিক্ষা ও সামাজিক সেবা (Education & Social Services)',
    others: 'অন্যান্য (Others)'
  };

  const subcategories = {
    infrastructure_public_works: [
      'রাস্তার ক্ষতি (গর্ত, ফাটল, বন্যা) - Road damage (potholes, cracks, flooding)',
      'স্ট্রিট লাইটিং (ভাঙা, অনুপস্থিত, বা ঝিকমিক করা আলো) - Street lighting issues',
      'ফুটপাথ বা পেভমেন্ট মেরামত - Sidewalk or pavement repairs',
      'ঝড়ের পানি নিষ্কাশন বা ব্লক ড্রেন - Stormwater drainage or blocked drains',
      'সেতু ও কালভার্ট রক্ষণাবেক্ষণ - Bridges and culverts maintenance',
      'অবৈধ রাস্তা খনন বা বাধা - Illegal road excavations or obstructions'
    ],
    waste_management_sanitation: [
      'অসংগৃহীত গৃহস্থালী বর্জ্য - Uncollected household waste',
      'উপচে পড়া পাবলিক বিন - Overflowing public bins',
      'অবৈধ ডাম্পিং সাইট - Illegal dumping sites',
      'আবর্জনা ফেলার হটস্পট - Littering hotspots',
      'ব্লক বা উপচে পড়া নর্দমা - Blocked or overflowing sewers',
      'পাবলিক টয়লেট রক্ষণাবেক্ষণ - Public toilet maintenance'
    ],
    parks_public_spaces: [
      'ক্ষতিগ্রস্ত খেলার সরঞ্জাম - Damaged playground equipment',
      'অতিরিক্ত বেড়ে ওঠা ঘাস বা গাছ - Overgrown grass or trees',
      'পার্কে ভাঙচুর - Vandalism in parks',
      'পাবলিক বাগানের খারাপ রক্ষণাবেক্ষণ - Poor maintenance of public gardens',
      'ভাঙা বেঞ্চ বা পার্কের আলো - Broken benches or park lights'
    ],
    water_sanitation_services: [
      'পানি বিভ্রাট বা কম চাপ - Water outages or low pressure',
      'ফেটে যাওয়া পানির পাইপ - Burst water pipes',
      'দূষিত পানি সরবরাহ - Contaminated water supply',
      'ত্রুটিপূর্ণ পানির মিটার - Faulty water meters',
      'পাবলিক কলের লিক - Leaking public taps'
    ],
    electricity_power: [
      'পাবলিক এলাকায় বিদ্যুৎ বিভ্রাট - Power outages in public areas',
      'ত্রুটিপূর্ণ স্ট্রিটলাইট - Faulty streetlights',
      'অবৈধ বিদ্যুৎ সংযোগ - Illegal power connections',
      'পড়ে যাওয়া বিদ্যুৎ লাইন - Downed power lines',
      'অনিরাপদ বৈদ্যুতিক খুঁটি - Unsafe electrical poles'
    ],
    public_transport_traffic: [
      'ক্ষতিগ্রস্ত ট্রাফিক সাইন বা সিগন্যাল - Damaged traffic signs or signals',
      'অনিরাপদ পথচারী ক্রসিং - Unsafe pedestrian crossings',
      'অবৈধ ট্যাক্সি র‍্যাঙ্ক বা স্টপ - Illegal taxi ranks or stops',
      'খারাপভাবে রক্ষণাবেক্ষিত বাস/ট্যাক্সি শেল্টার - Poorly maintained bus/taxi shelters',
      'গতি বৃদ্ধির অঞ্চল বা অনুপস্থিত স্পিড হাম্প - Speeding zones or missing speed humps'
    ],
    housing_community_facilities: [
      'পৌর আবাসনের রক্ষণাবেক্ষণ - Maintenance of municipal housing',
      'বরাদ্দ বা অপেক্ষার তালিকার সমস্যা - Allocation or waiting list issues',
      'কমিউনিটি হল মেরামত - Community hall repairs',
      'খেলার মাঠের রক্ষণাবেক্ষণ - Sports field maintenance',
      'লাইব্রেরি বা ক্লিনিক রক্ষণাবেক্ষণ - Library or clinic upkeep'
    ],
    safety_law_enforcement: [
      'অবৈধ ডাম্পিং বা শব্দ বিরক্তি - Illegal dumping or noise disturbances',
      'পাবলিক সম্পত্তির ক্ষতি - Damage to public property',
      'পরিত্যক্ত ভবন - Abandoned buildings',
      'অবৈধ ব্যবসা বা ভবন সম্প্রসারণ - Illegal trading or building extensions',
      'রাস্তায় হয়রানি বা অনিরাপদ অঞ্চল - Street harassment or unsafe zones',
      'অকার্যকর সিসিটিভি বা রাস্তার টহল সমস্যা - Non-functioning CCTV or street patrol issues'
    ],
    education_social_services: [
      'স্কুলের অবকাঠামো সমস্যা - School infrastructure issues',
      'শিশু যত্ন বা বয়স্ক যত্ন সুবিধার উদ্বেগ - Childcare or elderly care facility concerns',
      'কমিউনিটি আউটরিচ বা সামাজিক অনুদানের সমস্যা - Community outreach or social grant issues'
    ],
    others: [
      'সাধারণ সমস্যা - General issues',
      'পরিবেশগত সমস্যা - Environmental concerns',
      'প্রাণী সংক্রান্ত সমস্যা - Animal-related issues',
      'শব্দ দূষণ - Noise pollution',
      'বায়ু দূষণ - Air pollution',
      'কমিউনিটি ইভেন্ট সংক্রান্ত - Community event related',
      'সরকারি সেবা সংক্রান্ত - Government service related',
      'অন্যান্য (বিস্তারিত বর্ণনায় উল্লেখ করুন) - Others (please specify in description)'
    ]
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

    // Validate user details
    if (!formData.userName.trim()) {
      toast.error('আপনার নাম লিখুন');
      return;
    }

    if (!formData.userPhone.trim()) {
      toast.error('মোবাইল নাম্বার লিখুন');
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
      userName: formData.userName,
      userPhone: formData.userPhone
    });

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('category', category);
      submitData.append('subcategory', formData.subcategory);
      submitData.append('description', formData.description);
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('userName', formData.userName);
      submitData.append('userPhone', formData.userPhone);
      if (formData.userEmail) {
        submitData.append('userEmail', formData.userEmail);
      }

      images.forEach((image) => {
        submitData.append('images', image);
      });

      const response = await axios.post(API_ENDPOINTS.PROBLEMS, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Problem submitted successfully:', response.data);
      toast.success('সমস্যা সফলভাবে রিপোর্ট করা হয়েছে!');
      
      // Show option to view reports
      setTimeout(() => {
        const viewReports = window.confirm('আপনার রিপোর্ট দেখতে চান? (Do you want to view your reports?)');
        if (viewReports) {
          navigate('/my-reports');
        } else {
          navigate('/categories');
        }
      }, 1000);
    } catch (error) {
      console.error('Submit error:', error);
      
      if (error.code === 'ECONNABORTED') {
        toast.error('সংযোগ সময়সীমা শেষ - আবার চেষ্টা করুন');
      } else if (error.response?.status === 404) {
        toast.error('API এন্ডপয়েন্ট পাওয়া যায়নি - সার্ভার চেক করুন');
      } else if (error.response?.status >= 500) {
        toast.error('সার্ভার সমস্যা - কিছুক্ষণ পর চেষ্টা করুন');
      } else if (error.message.includes('Network Error')) {
        toast.error('নেটওয়ার্ক সমস্যা - ইন্টারনেট সংযোগ চেক করুন');
      } else {
        toast.error(`সমস্যা রিপোর্ট করতে ব্যর্থ হয়েছে: ${error.response?.data?.message || error.message}`);
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
            {/* User Details Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                আপনার তথ্য (Your Information)
              </h3>
              
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  নাম (Name) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  মোবাইল নাম্বার (Mobile Number) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ইমেইল (Email) - ঐচ্ছিক (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>

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
