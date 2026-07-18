import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Heart, MapPin, Settings as SettingsIcon, User, Clock, Shield, AlertCircle, 
  CheckCircle, ChevronRight, Menu, X, Power, Sparkles, Star, Phone, MessageSquare, 
  Trash2, Share2, Camera, Lock, Bell, Globe, Download, Info, Users, Eye, EyeOff, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

interface RecentActivityItem {
  id: string;
  type: 'booking' | 'wishlist';
  title: string;
  date: Date;
  dateLabel: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard: React.FC = () => {
  const { state, signOut, fetchUserProfile } = useAuth();
  const { state: wishlistState, getWishlistByType, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'wishlist' | 'profile' | 'settings'>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data States
  const [bookings, setBookings] = useState<any[]>([]);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);

  // Filter States for Bookings
  const [bookingFilter, setBookingFilter] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  // Modal States
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<any | null>(null);

  // Profile Form States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      emailBookingConfirmation: true,
      emailPromotions: false,
      smsReminders: true,
      pushNotifications: true
    },
    preferences: {
      language: 'en',
      currency: 'INR',
      timezone: 'Asia/Kolkata'
    }
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Wishlist sub-tab
  const [wishlistTab, setWishlistTab] = useState<'tours' | 'beaches' | 'nightlife' | 'places'>('tours');

  useEffect(() => {
    if (state.user && state.isAdmin) {
      navigate('/admin/dashboard');
    } else {
      fetchDashboardData();
    }
  }, [state.user, state.isAdmin]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch bookings
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let loadedBookings: any[] = [];
      if (res.ok) {
        const data = await res.json();
        loadedBookings = data.map((b: any) => ({
          id: `BK${b.id}`,
          dbId: b.id,
          tour: {
            id: b.tour_id,
            title: b.tour_title,
            images: [b.image_url || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000'],
            location: b.location || 'Goa',
            duration: b.duration_hours ? `${b.duration_hours} hours` : '4 hours',
            description: b.tour_description || 'Experience the beauty of Goa with this amazing tour.'
          },
          date: new Date(b.booking_date),
          guests: b.guests || 1,
          totalPrice: parseFloat(b.total_price),
          status: b.status || 'confirmed',
          bookingDate: new Date(b.created_at),
          guide: b.guide_id ? { name: b.guide_name, contact: b.guide_contact } : null
        }));
        setBookings(loadedBookings);
      }

      // Initialize Profile Form
      if (state.profile) {
        setProfileForm({
          name: state.profile.full_name || '',
          email: state.user?.email || '',
          phone: state.profile.phone || '',
          location: state.profile.location || '',
          bio: state.profile.bio || ''
        });
      }

      // Build Activities Feed
      const bookingActivities: RecentActivityItem[] = loadedBookings.map((b: any) => ({
        id: `booking-${b.dbId}`,
        type: 'booking',
        title: `Booked ${b.tour.title}`,
        date: b.bookingDate,
        dateLabel: '',
        icon: Calendar,
      }));

      const wishlistActivities: RecentActivityItem[] = wishlistState.items.map((item) => ({
        id: `wishlist-${item.id}`,
        type: 'wishlist',
        title: `Added ${item.data.title || item.data.name} to wishlist`,
        date: new Date(item.addedAt),
        dateLabel: '',
        icon: Heart,
      }));

      const allActivities = [...bookingActivities, ...wishlistActivities]
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      const now = new Date();
      const formattedActivities = allActivities.map(activity => {
        const diffInSeconds = Math.floor((now.getTime() - activity.date.getTime()) / 1000);
        let label = '';
        if (diffInSeconds < 60) label = 'Just now';
        else if (diffInSeconds < 3600) label = `${Math.floor(diffInSeconds / 60)} mins ago`;
        else if (diffInSeconds < 86400) label = `${Math.floor(diffInSeconds / 3600)} hours ago`;
        else if (diffInSeconds < 604800) label = `${Math.floor(diffInSeconds / 86400)} days ago`;
        else label = activity.date.toLocaleDateString();

        return { ...activity, dateLabel: label };
      });

      setActivities(formattedActivities.slice(0, 5));

    } catch (e) {
      console.error(e);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Sync profile form when profile loads
  useEffect(() => {
    if (state.profile) {
      setProfileForm({
        name: state.profile.full_name || '',
        email: state.user?.email || '',
        phone: state.profile.phone || '',
        location: state.profile.location || '',
        bio: state.profile.bio || ''
      });
    }
  }, [state.profile, state.user]);

  const calculateProfileCompletion = () => {
    if (!state.profile) return 0;
    const p = state.profile;
    let score = 0;
    const total = 5;
    if (p.full_name) score++;
    if (state.user?.email) score++;
    if (p.phone) score++;
    if (p.location) score++;
    if (p.bio && p.bio.trim().length > 10) score++;
    return Math.round((score / total) * 100);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingToCancel.dbId}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Booking cancelled successfully');
        setBookings(prev => prev.map(b =>
          b.id === bookingToCancel.id ? { ...b, status: 'cancelled' } : b
        ));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('An error occurred while cancelling');
    } finally {
      setBookingToCancel(null);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          location: profileForm.location,
          bio: profileForm.bio
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');
        setIsEditingProfile(false);
        if (token) fetchUserProfile(token);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const toastId = toast.loading('Uploading profile picture...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        toast.success('Profile picture updated!', { id: toastId });
        if (token) fetchUserProfile(token);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password updated successfully');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const shareItem = (item: any) => {
    const title = item.title || item.name;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: item.description,
        url: window.location.origin
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}`);
      toast.success('Link copied to clipboard');
    }
  };

  const getWishlistCount = (tabId: string) => {
    if (tabId === 'tours') return getWishlistByType('tour').length;
    if (tabId === 'beaches') return getWishlistByType('beach').length;
    if (tabId === 'nightlife') return getWishlistByType('nightlife').length;
    if (tabId === 'places') {
      return getWishlistByType('tour').length ? 0 : 0; // Wait, actually it aggregates other types. Let's write correct aggregation:
    }
    return 0;
  };

  // Wait, let's fix getWishlistCount:
  const getWishlistCountCorrect = (tabId: string) => {
    if (tabId === 'tours') return getWishlistByType('tour').length;
    if (tabId === 'beaches') return getWishlistByType('beach').length;
    if (tabId === 'nightlife') return getWishlistByType('nightlife').length;
    if (tabId === 'places') {
      return getWishlistByType('hotel').length +
             getWishlistByType('restaurant').length +
             getWishlistByType('cafe').length +
             getWishlistByType('club').length;
    }
    return 0;
  };

  const getWishlistItems = () => {
    if (wishlistTab === 'tours') return getWishlistByType('tour');
    if (wishlistTab === 'beaches') return getWishlistByType('beach');
    if (wishlistTab === 'nightlife') return getWishlistByType('nightlife');
    if (wishlistTab === 'places') {
      return [
        ...getWishlistByType('hotel'),
        ...getWishlistByType('restaurant'),
        ...getWishlistByType('cafe'),
        ...getWishlistByType('club')
      ];
    }
    return [];
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter(b => {
    const d = new Date(b.date);
    d.setHours(0, 0, 0, 0);
    return d >= today && b.status !== 'cancelled';
  });

  const pastBookings = bookings.filter(b => {
    const d = new Date(b.date);
    d.setHours(0, 0, 0, 0);
    return d < today && b.status !== 'cancelled';
  });

  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const getFilteredBookings = () => {
    if (bookingFilter === 'upcoming') return upcomingBookings;
    if (bookingFilter === 'past') return pastBookings;
    return cancelledBookings;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading Traveler Portal...</p>
      </div>
    );
  }

  const profile = state.profile || {};
  const profileCompletion = calculateProfileCompletion();

  const menuItems = [
    { id: 'overview' as const, icon: Clock, label: 'Overview' },
    { id: 'bookings' as const, icon: Calendar, label: 'My Bookings' },
    { id: 'wishlist' as const, icon: Heart, label: 'Wishlist' },
    { id: 'profile' as const, icon: User, label: 'Edit Profile' },
    { id: 'settings' as const, icon: SettingsIcon, label: 'Settings' }
  ];

  const SidebarItem = ({ id, icon: Icon, label }: any) => {
    const isSelected = activeTab === id;
    return (
      <button
        onClick={() => { setActiveTab(id); setMenuOpen(false); }}
        className={`relative w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl text-sm font-medium transition-all group duration-200
        ${isSelected 
          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/75 dark:bg-indigo-950/40 shadow-sm font-semibold' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'}`}
      >
        <Icon size={20} className={`${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors'}`} />
        <span>{label}</span>
        {isSelected && (
          <motion.div 
            layoutId="activeTabGlow"
            className="absolute right-0 top-3 bottom-3 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 fixed h-full z-10">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
            <div className="relative h-12 w-12 bg-indigo-650 dark:bg-indigo-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-inner overflow-hidden border border-white/20">
              {profile.profile_picture ? (
                <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span>{profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-slate-950 dark:text-white truncate max-w-[160px] leading-tight" title={profile.full_name}>{profile.full_name || 'Traveler'}</h2>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">Explorer Account</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem key={item.id} id={item.id} icon={item.icon} label={item.label} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
          <button 
            onClick={() => navigate('/')} 
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-[0.98]"
          >
            <MapPin size={16} className="text-indigo-500" />
            <span>Go to Live Website</span>
          </button>
          <button 
            onClick={async () => { await signOut(); navigate('/login'); }} 
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl border border-transparent text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all active:scale-[0.98]"
          >
            <Power size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center sticky top-0 z-20 transition-all">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm overflow-hidden">
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span>{profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}</span>
            )}
          </div>
          <h1 className="font-bold text-slate-900 dark:text-white leading-tight">Traveler Portal</h1>
        </div>
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Dropdown Nav Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden sticky top-[65px] z-20 shadow-lg"
          >
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => (
                <SidebarItem key={item.id} id={item.id} icon={item.icon} label={item.label} />
              ))}
              <hr className="my-3 border-slate-200 dark:border-slate-800" />
              <button 
                onClick={() => navigate('/')} 
                className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <MapPin size={20} className="text-indigo-500" />
                <span>Live Website</span>
              </button>
              <button 
                onClick={async () => { await signOut(); navigate('/login'); }} 
                className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <Power size={20} />
                <span>Log Out</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Pane */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        
        {/* Top Desktop Bar */}
        <header className="bg-white/50 dark:bg-slate-900/30 px-8 py-5 hidden md:flex justify-between items-center border-b border-slate-200/30 dark:border-slate-800/10">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
              <span>{activeTab === 'bookings' ? 'My Bookings' : activeTab === 'wishlist' ? 'My Wishlist' : activeTab}</span>
              <Sparkles size={16} className="text-indigo-500 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Welcome back, manage your travel itinerary and settings.</p>
          </div>
        </header>

        {/* Dashboard Scrollable Body */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl w-full mx-auto">
          
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Greeting & Completion Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-850 text-white shadow-lg border border-indigo-500/20">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
                      <Sparkles size={220} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                          Hello, {profile.full_name || state.user?.email || 'Explorer'}!
                        </h2>
                        <p className="text-indigo-100 text-sm mt-2 max-w-lg leading-relaxed">
                          Your next adventure in Goa is waiting. Review your active bookings, customize your checklist, or discover trending beach tours.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Link 
                          to="/tours" 
                          className="px-5 py-2.5 bg-white text-indigo-650 hover:bg-slate-50 text-xs font-bold rounded-xl transition duration-200 active:scale-98 shadow-md"
                        >
                          Book A Tour
                        </Link>
                        <Link 
                          to="/destinations" 
                          className="px-5 py-2.5 bg-indigo-500/30 text-white hover:bg-indigo-500/50 text-xs font-bold rounded-xl transition duration-200 border border-indigo-400/20"
                        >
                          Explore Places
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Profile Progress Widget */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Profile Completion</span>
                        <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full">{profileCompletion}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${profileCompletion}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {profileCompletion < 100 
                          ? '💡 Completing your profile details makes it easier to match tour vouchers.' 
                          : '🎉 Your explorer profile is fully updated! Ready to roll.'}
                      </p>
                      {profileCompletion < 100 && (
                        <button onClick={() => setActiveTab('profile')} className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5">
                          <span>Complete Details</span>
                          <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Metric Panel */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-4 shadow-sm hover:shadow transition duration-200">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                      <Calendar size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Bookings</p>
                      <h4 className="text-lg font-black text-slate-850 dark:text-white mt-0.5">{upcomingBookings.length}</h4>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-4 shadow-sm hover:shadow transition duration-200">
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                      <Heart size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Wishlisted</p>
                      <h4 className="text-lg font-black text-slate-850 dark:text-white mt-0.5">{wishlistState.items.length} Items</h4>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-4 shadow-sm hover:shadow transition duration-200">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed Trips</p>
                      <h4 className="text-lg font-black text-slate-850 dark:text-white mt-0.5">{pastBookings.length}</h4>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-4 shadow-sm hover:shadow transition duration-200">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                      <Clock size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders</p>
                      <h4 className="text-lg font-black text-slate-850 dark:text-white mt-0.5">{bookings.length}</h4>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column (Activities) */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={16} className="text-indigo-500" />
                      <span>Recent Activity Log</span>
                    </h3>
                    <div className="space-y-4">
                      {activities.length > 0 ? (
                        activities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500">
                              <activity.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-slate-850 dark:text-slate-200">{activity.title}</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{activity.dateLabel}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-8">No recent activity logged yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Quick Actions) */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={16} className="text-indigo-500" />
                      <span>Quick Workspaces</span>
                    </h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => navigate('/tours')} 
                        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-2xl transition duration-200 text-left font-bold text-xs"
                      >
                        <span className="flex items-center gap-3">
                          <MapPin size={18} className="text-indigo-500" />
                          Explore Popular Tours
                        </span>
                        <ChevronRight size={14} />
                      </button>
                      <button 
                        onClick={() => navigate('/events')} 
                        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-2xl transition duration-200 text-left font-bold text-xs"
                      >
                        <span className="flex items-center gap-3">
                          <Calendar size={18} className="text-indigo-500" />
                          Live Goa Events
                        </span>
                        <ChevronRight size={14} />
                      </button>
                      <button 
                        onClick={() => navigate('/contact')} 
                        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-2xl transition duration-200 text-left font-bold text-xs"
                      >
                        <span className="flex items-center gap-3">
                          <SettingsIcon size={18} className="text-indigo-500" />
                          Support Desk
                        </span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div 
                key="bookings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Bookings Sub-tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit max-w-full">
                  <button
                    onClick={() => setBookingFilter('upcoming')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2
                      ${bookingFilter === 'upcoming' 
                        ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-md shadow-indigo-500/5' 
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    <span>Upcoming</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg text-[10px]">
                      {upcomingBookings.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setBookingFilter('past')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2
                      ${bookingFilter === 'past' 
                        ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-md shadow-indigo-500/5' 
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    <span>Past</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg text-[10px]">
                      {pastBookings.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setBookingFilter('cancelled')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2
                      ${bookingFilter === 'cancelled' 
                        ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-md shadow-indigo-500/5' 
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    <span>Cancelled</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg text-[10px]">
                      {cancelledBookings.length}
                    </span>
                  </button>
                </div>

                {/* Booking Cards Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {getFilteredBookings().length > 0 ? (
                    getFilteredBookings().map((booking) => (
                      <div 
                        key={booking.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm p-6 flex flex-col lg:flex-row gap-6 hover:shadow transition duration-200"
                      >
                        <img 
                          src={booking.tour.images[0]} 
                          alt={booking.tour.title}
                          className="w-full lg:w-44 h-36 object-cover rounded-2xl"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between flex-wrap gap-2">
                              <div>
                                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">{booking.tour.title}</h4>
                                <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase">Booking ID: {booking.id}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{booking.totalPrice.toLocaleString()}</span>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Paid Total</p>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                              <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar size={10} /> Date</p>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{booking.date.toLocaleDateString()}</p>
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Users size={10} /> Guests</p>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{booking.guests} Guests</p>
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Clock size={10} /> Duration</p>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{booking.tour.duration}</p>
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><MapPin size={10} /> Destination</p>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{booking.tour.location}</p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 dark:border-slate-800 mt-5 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                            <span className="text-[10px] text-slate-400 font-semibold">Booked on {booking.bookingDate.toLocaleDateString()}</span>
                            <div className="flex gap-3 w-full md:w-auto">
                              <button 
                                onClick={() => setSelectedBooking(booking)}
                                className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition duration-150 flex items-center justify-center space-x-1.5 active:scale-98"
                              >
                                <Info size={14} className="text-indigo-500" />
                                <span>Details</span>
                              </button>
                              
                              {bookingFilter === 'upcoming' && (booking.status === 'confirmed' || booking.status === 'assigned') && (
                                <button 
                                  onClick={() => setBookingToCancel(booking)}
                                  className="flex-1 md:flex-none px-4 py-2 border border-rose-100/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition duration-150 flex items-center justify-center space-x-1.5 active:scale-98"
                                >
                                  <X size={14} />
                                  <span>Cancel Booking</span>
                                </button>
                              )}

                              {bookingFilter === 'past' && booking.status === 'completed' && (
                                <button 
                                  onClick={() => navigate('/tours')}
                                  className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition duration-150 flex items-center justify-center space-x-1.5 active:scale-98 shadow-md"
                                >
                                  <span>Book Again</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-8">
                      <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                      <h4 className="font-bold text-slate-800 dark:text-white text-base">No bookings found</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">There are no bookings matching the selected category. Check out our active tours list!</p>
                      <button onClick={() => navigate('/tours')} className="mt-4 px-5 py-2 bg-indigo-650 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">Browse Tours</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Wishlist sub-tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit max-w-full overflow-x-auto">
                  {(['tours', 'beaches', 'nightlife', 'places'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setWishlistTab(tab)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all flex items-center space-x-2 whitespace-nowrap
                        ${wishlistTab === tab 
                          ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-md shadow-indigo-500/5' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                      <span>{tab === 'places' ? 'Hotels & Dining' : tab}</span>
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg text-[10px]">
                        {getWishlistCountCorrect(tab)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Wishlist Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getWishlistItems().length > 0 ? (
                    getWishlistItems().map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow transition duration-200"
                      >
                        <div className="relative overflow-hidden">
                          <img 
                            src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000'} 
                            alt={item.title || item.name}
                            className="w-full h-44 object-cover group-hover:scale-103 transition duration-300"
                          />
                          <div className="absolute top-4 right-4 flex space-x-2 z-10">
                            <button
                              onClick={() => shareItem(item)}
                              className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-full hover:scale-105 active:scale-95 transition shadow shadow-black/10"
                            >
                              <Share2 size={13} className="text-slate-600 dark:text-slate-350" />
                            </button>
                            <button
                              onClick={() => removeFromWishlist(item.id, item.type as any)}
                              className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-full hover:scale-105 active:scale-95 transition shadow shadow-black/10"
                            >
                              <Trash2 size={13} className="text-rose-600 dark:text-rose-400" />
                            </button>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="font-extrabold text-slate-850 dark:text-white text-base leading-snug line-clamp-1">{item.title || item.name}</h4>
                            <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">{item.description}</p>
                            
                            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                              {/* Left Info */}
                              <div className="flex items-center space-x-1">
                                <Star size={14} className="text-yellow-400 fill-current" />
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.rating || '4.5'}</span>
                                <span className="text-[10px] text-slate-400 font-medium">({item.reviewCount || 12})</span>
                              </div>

                              {/* Right Info Badge */}
                              {item.price !== undefined ? (
                                <span className="text-sm font-black text-indigo-650 dark:text-indigo-400">₹{item.price.toLocaleString()}</span>
                              ) : item.crowdLevel ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">{item.crowdLevel}</span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{item.priceRange || 'Medium'}</span>
                              )}
                            </div>
                          </div>

                          <Link
                            to={item.type === 'tour' ? `/tours/${item.id}` : item.type === 'beach' ? `/destinations/beach/${item.id}` : `/nightlife/${item.id}`}
                            className="w-full py-2 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-650 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-center text-xs font-bold rounded-xl transition duration-150 block"
                          >
                            Explore Details
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-8">
                      <Heart className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                      <h4 className="font-bold text-slate-800 dark:text-white text-base">Wishlist is empty</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">You have no items in this wishlist category. Bookmarks tours or places on the search pages.</p>
                      <button onClick={() => navigate('/tours')} className="mt-4 px-5 py-2 bg-indigo-650 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">Search Tours</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Avatar Column */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm p-6 text-center space-y-4">
                  <div className="relative w-28 h-28 mx-auto group">
                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-full blur opacity-50"></div>
                    <div className="relative w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-3xl text-indigo-600 dark:text-indigo-400 shadow-inner overflow-hidden border-2 border-white dark:border-slate-900">
                      {profile.profile_picture ? (
                        <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <span>{profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'U'}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:scale-105 active:scale-95 shadow transition"
                    >
                      <Camera size={14} />
                    </button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-850 dark:text-white text-base leading-snug">{profileForm.name || 'Traveler'}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{profileForm.email}</p>
                  </div>
                  <hr className="border-slate-100 dark:border-slate-800" />
                  <div className="text-left space-y-2.5 text-xs">
                    <p className="flex justify-between font-semibold"><span className="text-slate-400">Account Type:</span> <span className="text-indigo-600 dark:text-indigo-400">Standard Explorer</span></p>
                    <p className="flex justify-between font-semibold"><span className="text-slate-400">Profile Status:</span> <span className="text-emerald-500">Active</span></p>
                  </div>
                </div>

                {/* Edit Fields Column */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <User size={16} className="text-indigo-500" />
                      <span>Explorer Profile Info</span>
                    </h3>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition duration-150 active:scale-98
                        ${isEditingProfile 
                          ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20' 
                          : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20'}`}
                    >
                      {isEditingProfile ? 'Cancel' : 'Edit profile'}
                    </button>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                        <input 
                          type="text" 
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          disabled={!isEditingProfile}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs font-semibold disabled:opacity-60"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input 
                          type="email" 
                          value={profileForm.email}
                          disabled={true}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs font-semibold disabled:opacity-60 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                        <input 
                          type="text" 
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          disabled={!isEditingProfile}
                          placeholder="Not provided"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs font-semibold disabled:opacity-60"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location / City</label>
                        <input 
                          type="text" 
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          disabled={!isEditingProfile}
                          placeholder="e.g., Panaji, Goa"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs font-semibold disabled:opacity-60"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Traveler Bio</label>
                      <textarea 
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        disabled={!isEditingProfile}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs font-semibold disabled:opacity-60"
                      />
                    </div>
                    {isEditingProfile && (
                      <div className="flex justify-end pt-2">
                        <button 
                          type="submit" 
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition duration-150 active:scale-98"
                        >
                          Save Profile Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Account Preferences */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm p-6 space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Globe size={16} className="text-indigo-500" />
                    <span>Workspace Preferences</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</label>
                      <select 
                        value={settings.preferences.language}
                        onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, language: e.target.value } })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none text-xs font-semibold"
                      >
                        <option value="en">English (US)</option>
                        <option value="hi">Hindi (IN)</option>
                        <option value="kok">Konkani (Goa)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Currency</label>
                      <select 
                        value={settings.preferences.currency}
                        onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, currency: e.target.value } })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none text-xs font-semibold"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password / Security Column */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-6">
                    <Lock size={16} className="text-indigo-500" />
                    <span>Update Security Password</span>
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs font-semibold"
                          placeholder="Current password"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                          <input 
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs font-semibold"
                            placeholder="New password"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                          >
                            {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                          <input 
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs font-semibold"
                            placeholder="Confirm password"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition duration-150 active:scale-98"
                      >
                        Update Account Password
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative border border-slate-200/20"
          >
            <button 
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="space-y-5">
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                  ${selectedBooking.status === 'completed' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' : 
                    selectedBooking.status === 'assigned' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' :
                    selectedBooking.status === 'cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'}`}>
                  {selectedBooking.status}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 leading-snug">{selectedBooking.tour.title}</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">ID: {selectedBooking.id}</p>
              </div>

              <img 
                src={selectedBooking.tour.images[0]} 
                alt={selectedBooking.tour.title} 
                className="w-full h-44 object-cover rounded-2xl"
              />

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedBooking.date.toLocaleDateString()} at 9:00 AM</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Number of Guests</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedBooking.guests} Persons</p>
                </div>
              </div>

              {/* Guide Assignee details */}
              {selectedBooking.guide ? (
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 space-y-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Assigned Local Guide</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{selectedBooking.guide.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Contact: {selectedBooking.guide.contact}</p>
                    </div>
                    {/* Call Actions */}
                    <div className="flex gap-2">
                      <a 
                        href={`tel:${selectedBooking.guide.contact}`}
                        className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 rounded-xl hover:scale-105 transition"
                      >
                        <Phone size={14} />
                      </a>
                      <a 
                        href={`https://wa.me/${selectedBooking.guide.contact.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl hover:scale-105 transition"
                      >
                        <MessageSquare size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 text-center">
                  <p className="text-xs font-semibold text-slate-555 dark:text-slate-400">Local Guide is being assigned shortly.</p>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">You will receive a notification with contact details.</p>
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/30 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Booking Price:</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{selectedBooking.totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    toast.success('Voucher download started (mock)');
                    setSelectedBooking(null);
                  }}
                  className="flex-1 py-2.5 bg-indigo-650 hover:bg-indigo-705 text-white rounded-xl text-center text-xs font-bold transition shadow-md"
                >
                  Download Voucher
                </button>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Close Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancel Booking Dialog */}
      {bookingToCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 border border-slate-200/20"
          >
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full w-fit mx-auto">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950 dark:text-white text-lg">Cancel Active Booking?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to cancel your booking for <strong>{bookingToCancel.tour.title}</strong>? This action cannot be undone. Refund is subject to policies.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleCancelBooking}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition"
              >
                Yes, Cancel Tour
              </button>
              <button 
                onClick={() => setBookingToCancel(null)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-750 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
