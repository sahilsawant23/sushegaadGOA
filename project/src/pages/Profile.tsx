import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Edit3, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Preferences = {
  tourTypes: string[];
  budget: string;
  groupSize: string;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  bio: string;
  preferences: Preferences;
};

const Profile: React.FC = () => {
  const { state, signOut, fetchUserProfile } = useAuth();
  const { state: wishlistState } = useWishlist();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // Use profile from auth state (which contains full details including phone/location/bio)
  const profile = state.profile || {};

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: profile.full_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    dateOfBirth: '1990-01-01', // Date format handling might be needed
    bio: profile.bio || 'Travel enthusiast who loves exploring beautiful destinations.',
    preferences: {
      tourTypes: ['Beach', 'Heritage', 'Adventure'],
      budget: 'Mid-range',
      groupSize: '2-4 people',
    },
  });

  // Effect to update form if profile loads late
  React.useEffect(() => {
    if (state.profile) {
      setFormData(prev => ({
        ...prev,
        name: state.profile.full_name || prev.name,
        email: state.profile.email || prev.email,
        phone: state.profile.phone || prev.phone,
        location: state.profile.location || prev.location,
        bio: state.profile.bio || prev.bio
      }));
    }
  }, [state.profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Ideally force refresh of profile in context, but we can also rely on reload or manual context update
        // We can call fetchUserProfile if exposed, but for now specific update:
        // updateUser(data.user); // This updates user state, but we need to update profile state.
        // A page reload is simple way to resync context if AuthContext doesn't expose setProfile.
        window.location.reload();
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const toastId = toast.loading('Uploading profile picture...');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/profile/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        toast.success('Profile picture updated!', { id: toastId });
        // Refresh profile
        fetchUserProfile(token!);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const confirmLogout = async () => {
    await signOut();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // For simplicity, detect if this field belongs to preferences or not:
    if (name === 'budget' || name === 'groupSize') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Optional: toggle a tour type (if you want to allow that)
  // Currently tourTypes are displayed as static tags without editing functionality.

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-700 bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  {profile.profile_picture ? (
                    <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-white" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="text-white flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {state.profile?.full_name || 'User'}
                      {state.isAdmin && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full border border-blue-400">
                          Admin
                        </span>
                      )}
                    </h2>
                    <p className="text-blue-100">{state.user?.email}</p>
                    <p className="text-blue-200 text-sm mt-1">Member since January 2024</p>
                  </div>
                  {state.isAdmin && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
              <div className="flex space-x-4">
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center space-x-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Personal Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900/50 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      >
                        <option value="">Select a country</option>
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="China">China</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Russia">Russia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="UAE">United Arab Emirates</option>
                        <option value="Singapore">Singapore</option>
                        {/* Add more common countries as needed */}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Travel Preferences - Hide for Admin */}
                {!state.isAdmin && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Travel Preferences</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Tour Types</label>
                      <div className="flex flex-wrap gap-2">
                        {['Beach', 'Heritage', 'Adventure', 'Culture', 'Food'].map((type) => (
                          <span
                            key={type}
                            className={`px-3 py-1 rounded-full text-sm ${formData.preferences.tourTypes.includes(type)
                              ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                              }`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget Preference</label>
                      <select
                        name="budget"
                        value={formData.preferences.budget}
                        disabled={!isEditing}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      >
                        <option value="Budget">Budget (₹1,000 - ₹3,000)</option>
                        <option value="Mid-range">Mid-range (₹3,000 - ₹6,000)</option>
                        <option value="Luxury">Luxury (₹6,000+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Group Size</label>
                      <select
                        name="groupSize"
                        value={formData.preferences.groupSize}
                        disabled={!isEditing}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      >
                        <option value="Solo">Solo Travel</option>
                        <option value="2-4 people">Small Group (2-4 people)</option>
                        <option value="5-8 people">Medium Group (5-8 people)</option>
                        <option value="9+ people">Large Group (9+ people)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Account Statistics - Hide for Admin */}
        {
          !state.isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transition-colors duration-200">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">5</div>
                <div className="text-gray-600 dark:text-gray-300">Tours Completed</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transition-colors duration-200">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{wishlistState.items.length}</div>
                <div className="text-gray-600 dark:text-gray-300">Wishlist Items</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transition-colors duration-200">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">4.8</div>
                <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
              </div>
            </motion.div>
          )
        }

        {/* Wishlist Preview - Hide for Admin */}
        {
          !state.isAdmin && wishlistState.items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Wishlist</h3>
                <a href="/wishlist" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">View All</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistState.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center space-x-4 transition-colors duration-200">
                    {/* Fallback icon if image is missing/complex */}
                    <div className="h-16 w-16 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-red-500 fill-current" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.data.title || item.data.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        }

        {/* Logout Confirmation Modal */}
        {
          showLogoutConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full transition-colors duration-200"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Logout</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to log out of your account?</p>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={cancelLogout}
                    className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Yes, Log Out
                  </button>
                </div>
              </motion.div>
            </div>
          )
        }
      </div >
    </div >
  );
};

export default Profile;
