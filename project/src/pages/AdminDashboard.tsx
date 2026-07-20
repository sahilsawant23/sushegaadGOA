import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, DollarSign, TrendingUp, Eye, Trash2, LogOut, Search, FileDown,
  Plus, X, Shield, Menu, Power, Sparkles, Star, MessageSquare, Clock, MapPin,
  Settings, Award, HelpCircle, Phone, FileText, CheckCircle, AlertCircle, ArrowUpRight, Bike
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EventsTab } from '../components/admin/EventsTab';
import toast from 'react-hot-toast';

interface User {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  role?: string;
  customer_data?: {
    total_bookings?: number;
  };
}

interface RentalBooking {
  id: string;
  booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  driving_license: string;
  vehicle_name: string;
  category: string;
  daily_price: number;
  rental_days: number;
  pickup_hub: string;
  pickup_date: string;
  dropoff_date: string;
  total_amount: number;
  deposit: number;
  payment_id: string;
  payment_status: string;
  status: string;
  created_at: string;
}

interface Booking {
  id: string;
  user_id?: string | number;
  user_profiles?: {
    full_name: string;
  };
  tours?: {
    title: string;
  };
  booking_date: string;
  total_price: number;
  status: string;
  guide?: any;
}

interface Analytics {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
}

interface Guide {
  is_verified: any;
  languages: ReactNode;
  experience_years: ReactNode;
  whatsapp_number: string;
  id: number;
  name: string;
  contact: string;
  specialty: string;
  status: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
}

interface Review {
  id: number;
  user_name: string;
  tour_title: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location: string;
  category: string;
  price: string;
  source: string;
  image_url: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const AdminDashboard: React.FC = () => {
  const { state, signOut } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rentalBookings, setRentalBookings] = useState<RentalBooking[]>([]);
  const [rentalSearch, setRentalSearch] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'rentals' | 'guides' | 'messages' | 'reviews' | 'events' | 'settings'>('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  const [showAddTour, setShowAddTour] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter States
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all');

  useEffect(() => {
    if (state.isLoading) return;
    if (!state.user || !state.isAdmin) {
      // Allow bypass in dev/testing, but navigate to login in prod if unauthorized
      // navigate('/login');
    }
    loadDashboardData();
  }, [state.isAdmin, state.isLoading, state.user]);

  // Filter bookings logic
  useEffect(() => {
    let result = bookings;

    if (bookingSearch) {
      const lower = bookingSearch.toLowerCase();
      result = result.filter(b => {
        const dateStr = new Date(b.booking_date).toLocaleDateString().toLowerCase();
        return (
          (b.user_profiles?.full_name || '').toLowerCase().includes(lower) ||
          (b.tours?.title || '').toLowerCase().includes(lower) ||
          (b.guide?.name || '').toLowerCase().includes(lower) ||
          dateStr.includes(lower) ||
          b.id.toString().includes(lower)
        );
      });
    }

    if (bookingFilterStatus !== 'all') {
      result = result.filter(b => b.status === bookingFilterStatus);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateFilter === 'today') {
      result = result.filter(b => {
        const d = new Date(b.booking_date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
    } else if (dateFilter === 'tomorrow') {
      result = result.filter(b => {
        const d = new Date(b.booking_date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === tomorrow.getTime();
      });
    }

    setFilteredBookings(result);
  }, [bookings, bookingSearch, bookingFilterStatus, dateFilter]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const analyticsRes = await fetch(`${API_BASE_URL}/admin/analytics`, { headers });
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());

      const usersRes = await fetch(`${API_BASE_URL}/admin/users`, { headers });
      if (usersRes.ok) setUsers(await usersRes.json());

      const bookingsRes = await fetch(`${API_BASE_URL}/admin/bookings`, { headers });
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        const mappedBookings = data.map((b: any) => ({
          ...b,
          guide: b.guide_id ? { id: b.guide_id, name: b.guide_name } : null
        }));
        setBookings(mappedBookings);
      }

      const guidesRes = await fetch(`${API_BASE_URL}/admin/guides`, { headers });
      if (guidesRes.ok) setGuides(await guidesRes.json());

      const rentalsRes = await fetch(`${API_BASE_URL}/admin/rental-bookings`);
      if (rentalsRes.ok) setRentalBookings(await rentalsRes.json());

      const msgsRes = await fetch(`${API_BASE_URL}/admin/messages`, { headers });
      if (msgsRes.ok) setMessages(await msgsRes.json());

      const reviewsRes = await fetch(`${API_BASE_URL}/admin/reviews`, { headers });
      if (reviewsRes.ok) setReviews(await reviewsRes.json());

      const eventsRes = await fetch(`${API_BASE_URL}/events`);
      if (eventsRes.ok) setEvents(await eventsRes.json());

      const destRes = await fetch(`${API_BASE_URL}/destinations`);
      if (destRes.ok) setDestinations(await destRes.json());

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleUpdateRentalStatus = async (bookingId: string, status: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/rental-bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      toast.success(`Booking ${bookingId} status updated to: ${status}`);
      setRentalBookings(prev =>
        prev.map(b => (b.booking_id === bookingId || b.id === bookingId ? { ...b, status } : b))
      );
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadDashboardData();
      toast.success('Message deleted');
    } catch (e) { console.error(e); }
  };

  const handleDeleteReview = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadDashboardData();
      toast.success('Review deleted');
    } catch (e) { console.error(e); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (Number(userId) === Number(state.profile?.id)) {
      toast.error("You cannot delete your own admin account.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user? This will cancel bookings & remove reviews.")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'User deleted successfully.');
        loadDashboardData();
      } else {
        toast.error(data.message || 'Failed to delete user.');
      }
    } catch (e) {
      console.error('Delete user error:', e);
      toast.error('Failed to connect to backend.');
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Customer', 'Tour', 'Date', 'Price', 'Status', 'Guide'];
    const rows = filteredBookings.map(b => [
      b.id,
      b.user_profiles?.full_name || '',
      b.tours?.title || '',
      new Date(b.booking_date).toLocaleDateString(),
      b.total_price,
      b.status,
      b.guide?.name || 'Unassigned'
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Bookings exported successfully');
  };

  const menuItems = [
    { id: 'overview' as const, icon: Clock, label: 'Overview' },
    { id: 'users' as const, icon: Users, label: 'User Directory' },
    { id: 'bookings' as const, icon: Calendar, label: 'Bookings & Orders' },
    { id: 'rentals' as const, icon: Bike, label: 'Scooter & Car Rentals 🛵' },
    { id: 'guides' as const, icon: Award, label: 'Guides & Verification' },
    { id: 'messages' as const, icon: MessageSquare, label: 'Inbound Messages' },
    { id: 'reviews' as const, icon: Star, label: 'User Reviews' },
    { id: 'events' as const, icon: Sparkles, label: 'Manage Events' },
    { id: 'settings' as const, icon: Settings, label: 'Admin Settings' }
  ];

  const SidebarItem = ({ id, icon: Icon, label }: any) => {
    const isSelected = activeTab === id;
    return (
      <button
        onClick={() => { setActiveTab(id); setMenuOpen(false); }}
        className={`relative w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl text-sm font-medium transition-all group duration-200
        ${isSelected
            ? 'text-indigo-650 dark:text-indigo-400 bg-indigo-50/75 dark:bg-indigo-950/40 shadow-sm font-semibold'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'}`}
      >
        <Icon size={20} className={`${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors'}`} />
        <span>{label}</span>
        {isSelected && (
          <motion.div
            layoutId="activeTabGlow"
            className="absolute right-0 top-3 bottom-3 w-1 bg-indigo-650 dark:bg-indigo-400 rounded-full"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </button>
    );
  };

  const getStatusButtonClass = (status: string) => {
    const base = "px-4 py-2 rounded-xl text-xs font-bold transition-colors active:scale-98 shadow-sm";
    if (bookingFilterStatus === status) {
      return `${base} bg-indigo-600 text-white shadow-indigo-600/10`;
    }
    return `${base} bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50`;
  };

  const getDateButtonClass = (filter: string) => {
    const base = "px-4 py-2 rounded-xl text-xs font-bold transition-colors active:scale-98 shadow-sm";
    if (dateFilter === filter) {
      return `${base} bg-indigo-650 text-white shadow-indigo-650/10`;
    }
    return `${base} bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50`;
  };

  const stats = [
    { name: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'from-blue-500 to-indigo-500' },
    { name: 'Total Bookings', value: analytics.totalBookings, icon: Calendar, color: 'from-emerald-500 to-teal-500' },
    { name: 'Total Revenue', value: `₹${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-amber-500 to-orange-500' },
    { name: 'Growth Rate', value: '+12%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 fixed h-full z-10">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
            <div className="relative h-12 w-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-extrabold text-xl shadow-inner border border-white/20">
              {state.profile?.full_name ? state.profile.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-slate-950 dark:text-white truncate max-w-[160px] leading-tight">{state.profile?.full_name || 'Admin'}</h2>
            <span className="text-xs text-indigo-650 dark:text-indigo-400 font-semibold uppercase tracking-wider">System Director</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem key={item.id} id={item.id} icon={item.icon} label={item.label} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-[0.98]"
          >
            <MapPin size={15} className="text-indigo-500" />
            <span>Go to Live Website</span>
          </button>
          <button
            onClick={async () => { await signOut(); navigate('/login'); }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-transparent text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all active:scale-[0.98]"
          >
            <Power size={15} />
            <span>Log Out Account</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center sticky top-0 z-20 transition-all">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-indigo-650 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {state.profile?.full_name ? state.profile.full_name.charAt(0).toUpperCase() : 'A'}
          </div>
          <h1 className="font-bold text-slate-900 dark:text-white leading-tight">Admin System</h1>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
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
                className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100"
              >
                <MapPin size={20} className="text-indigo-500" />
                <span>Live Website</span>
              </button>
              <button
                onClick={async () => { await signOut(); navigate('/login'); }}
                className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium hover:bg-rose-50"
              >
                <Power size={20} />
                <span>Log Out</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Frame */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">

        {/* Desk Header Bar */}
        <header className="bg-white/50 dark:bg-slate-900/30 px-8 py-5 hidden md:flex justify-between items-center border-b border-slate-200/30 dark:border-slate-800/10">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white capitalize flex items-center gap-2">
              <span>{activeTab === 'bookings' ? 'Bookings & Orders' : activeTab === 'guides' ? 'Guides & Verification' : activeTab}</span>
              <Sparkles size={16} className="text-indigo-500 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Control panel system monitoring platform workspace.</p>
          </div>
          <div className="flex items-center space-x-3">
            {activeTab === 'bookings' && (
              <button onClick={handleExport} className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 px-4.5 py-2 rounded-2xl transition text-xs font-bold">
                <FileDown size={14} />
                <span>Export Bookings</span>
              </button>
            )}
            <button onClick={() => setShowAddTour(true)} className="flex items-center space-x-2 bg-indigo-650 hover:bg-indigo-700 text-white px-4.5 py-2 rounded-2xl transition text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-98">
              <Plus size={14} />
              <span>Create New Tour</span>
            </button>
          </div>
        </header>

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
                {/* Stats Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={stat.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm hover:shadow transition duration-200 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.name}</p>
                        <h3 className="text-2xl font-black text-slate-850 dark:text-white leading-tight">{stat.value}</h3>
                      </div>
                      <div className={`bg-gradient-to-tr ${stat.color} p-3.5 rounded-2xl text-white shadow-md`}>
                        <stat.icon size={20} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Double Split column lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Bookings Box */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">Recent Orders Feed</h3>
                      <button onClick={() => setActiveTab('bookings')} className="text-xs font-bold text-indigo-650 hover:underline flex items-center gap-0.5">
                        <span>All Bookings</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                    <div className="space-y-3.5">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-850/40 border border-slate-200/20 rounded-2xl hover:bg-slate-100/50 transition">
                          <div>
                            <p className="font-extrabold text-xs text-slate-850 dark:text-white">{booking.user_profiles?.full_name || 'Client'}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">{booking.tours?.title || 'Unknown Tour'}</p>
                          </div>
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full 
                            ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' :
                              booking.status === 'cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20' :
                                'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20'}`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                      {bookings.length === 0 && <p className="text-xs text-slate-400 py-6 text-center">No bookings added.</p>}
                    </div>
                  </div>

                  {/* New Users Box */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">New Users Joined</h3>
                      <button onClick={() => setActiveTab('users')} className="text-xs font-bold text-indigo-650 hover:underline flex items-center gap-0.5">
                        <span>User Directory</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                    <div className="space-y-3.5">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-850/40 border border-slate-200/20 rounded-2xl hover:bg-slate-100/50 transition">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-xs text-slate-850 dark:text-white">{user.full_name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{user.email}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                      {users.length === 0 && <p className="text-xs text-slate-400 py-6 text-center">No users joined.</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/85 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">User Account Directory</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
                    <thead className="bg-slate-55/30 dark:bg-slate-850/30 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <tr>
                        {['User Profile', 'Email Address', 'Privilege', 'Joined', 'Bookings', 'Workspace'].map(h => (
                          <th key={h} className="px-6 py-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/20 transition">
                          <td className="px-6 py-4 font-extrabold text-slate-850 dark:text-white flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-50 text-indigo-650 rounded-full flex items-center justify-center font-bold text-xs">
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <span>{user.full_name}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide
                              ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                              {user.role || 'user'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-450">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-slate-850 dark:text-slate-200">{user.customer_data?.total_bookings || 0}</td>
                          <td className="px-6 py-4 text-slate-400 space-x-3">
                            <button onClick={() => setSelectedUser(user)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 transition"><Eye size={15} /></button>
                            <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-rose-600 transition"><Trash2 size={15} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {users.length === 0 && <div className="p-8 text-center text-slate-400">No users found in system.</div>}
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/85 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">Booking Management</h3>

                  {/* Filters Row */}
                  <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center pt-2">
                    {/* Search Field */}
                    <div className="relative w-full lg:w-96">
                      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search by customer, tour, date, guide..."
                        className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full text-xs font-semibold rounded-xl"
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {/* Date Filters */}
                      <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl gap-1">
                        <button onClick={() => setDateFilter('all')} className={getDateButtonClass('all')}>All Dates</button>
                        <button onClick={() => setDateFilter('today')} className={getDateButtonClass('today')}>Today</button>
                        <button onClick={() => setDateFilter('tomorrow')} className={getDateButtonClass('tomorrow')}>Tomorrow</button>
                      </div>

                      {/* Status Filters */}
                      <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl gap-1">
                        <button onClick={() => setBookingFilterStatus('all')} className={getStatusButtonClass('all')}>All</button>
                        <button onClick={() => setBookingFilterStatus('assigned')} className={getStatusButtonClass('assigned')}>Assigned</button>
                        <button onClick={() => setBookingFilterStatus('confirmed')} className={getStatusButtonClass('confirmed')}>Confirmed</button>
                        <button onClick={() => setBookingFilterStatus('cancelled')} className={getStatusButtonClass('cancelled')}>Cancelled</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
                    <thead className="bg-slate-55/30 dark:bg-slate-850/30 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <tr>
                        {['ID', 'Customer', 'Tour', 'Booking Date', 'Amount Paid', 'Status Badge', 'Guide Assignment'].map(h => (
                          <th key={h} className="px-6 py-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/20 transition">
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">#{booking.id.toString().slice(0, 8)}</td>
                          <td className="px-6 py-4 text-slate-850 dark:text-slate-200">{booking.user_profiles?.full_name || 'Deleted User'}</td>
                          <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate">{booking.tours?.title || 'Deleted Tour'}</td>
                          <td className="px-6 py-4 text-slate-450">{new Date(booking.booking_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-black text-slate-900 dark:text-white">₹{booking.total_price}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                              ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                                booking.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                  'bg-yellow-50 text-yellow-700'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            <BookingAssigner booking={booking} guides={guides} bookings={bookings} token={localStorage.getItem('token')} onAssign={loadDashboardData} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredBookings.length === 0 && <div className="p-8 text-center text-slate-400 font-semibold">No bookings matched filters.</div>}
                </div>
              </motion.div>
            )}

            {activeTab === 'rentals' && (
              <motion.div
                key="rentals"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Rental Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Rentals</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{rentalBookings.length}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <Bike className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rental Revenue</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        ₹{rentalBookings.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Security Deposit Held</p>
                      <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                        ₹{rentalBookings.reduce((sum, r) => sum + (Number(r.deposit) || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                      <Shield className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Bookings</p>
                      <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                        {rentalBookings.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Main Table Container */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">
                        Commercial Scooter & Vehicle Rental Orders
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Real-time payment records, customer details & vehicle status</p>
                    </div>

                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search by customer, vehicle, license, phone..."
                        className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full text-xs font-semibold rounded-xl"
                        value={rentalSearch}
                        onChange={(e) => setRentalSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Booking Ref</th>
                          <th className="px-6 py-4">Customer & License</th>
                          <th className="px-6 py-4">Vehicle & Hub</th>
                          <th className="px-6 py-4">Rental Duration</th>
                          <th className="px-6 py-4">Payment & Txn ID</th>
                          <th className="px-6 py-4">Status & Dispatch</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                        {rentalBookings
                          .filter(r => {
                            if (!rentalSearch) return true;
                            const q = rentalSearch.toLowerCase();
                            return (
                              r.customer_name?.toLowerCase().includes(q) ||
                              r.customer_phone?.toLowerCase().includes(q) ||
                              r.vehicle_name?.toLowerCase().includes(q) ||
                              r.driving_license?.toLowerCase().includes(q) ||
                              r.booking_id?.toLowerCase().includes(q)
                            );
                          })
                          .map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                              
                              {/* Booking Ref */}
                              <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50">
                                  {r.booking_id}
                                </span>
                              </td>

                              {/* Customer & License */}
                              <td className="px-6 py-4">
                                <div className="font-extrabold text-slate-900 dark:text-white">{r.customer_name}</div>
                                <div className="text-[11px] text-slate-400">{r.customer_phone}</div>
                                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                                  DL: {r.driving_license}
                                </div>
                              </td>

                              {/* Vehicle & Hub */}
                              <td className="px-6 py-4">
                                <div className="font-extrabold text-slate-800 dark:text-slate-200">{r.vehicle_name}</div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin className="h-3 w-3 text-rose-500" /> {r.pickup_hub}
                                </div>
                              </td>

                              {/* Rental Duration */}
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-900 dark:text-white">{r.rental_days} Days</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  Pickup: {r.pickup_date}
                                </div>
                              </td>

                              {/* Payment & Txn ID */}
                              <td className="px-6 py-4">
                                <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                  ₹{r.total_amount?.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-slate-400">Deposit: ₹{r.deposit}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  {r.payment_id}
                                </div>
                              </td>

                              {/* Status & Dispatch */}
                              <td className="px-6 py-4">
                                <select
                                  value={r.status || 'Confirmed'}
                                  onChange={(e) => handleUpdateRentalStatus(r.booking_id || r.id, e.target.value)}
                                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="Confirmed">🟢 Confirmed</option>
                                  <option value="Vehicle Handed Over">🔑 Vehicle Handed Over</option>
                                  <option value="Completed">🏁 Completed & Returned</option>
                                  <option value="Cancelled">🔴 Cancelled</option>
                                </select>
                              </td>

                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {rentalBookings.length === 0 && (
                      <div className="p-12 text-center text-slate-400 font-semibold">
                        No scooter or car rental bookings found.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'guides' && (
              <motion.div
                key="guides"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <GuidesTab guides={guides} bookings={bookings} setGuides={setGuides} token={localStorage.getItem('token')} />
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/85 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">Incoming Support Messages</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
                    <thead className="bg-slate-55/30 dark:bg-slate-850/30 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <tr>
                        {['Date', 'Sender Name', 'Email Address', 'Phone Call', 'Subject Line', 'Message Description', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                      {messages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/20 transition">
                          <td className="px-6 py-4 text-slate-450">{new Date(msg.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{msg.name}</td>
                          <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-bold">{msg.email}</td>
                          <td className="px-6 py-4 text-slate-550">{msg.phone || '-'}</td>
                          <td className="px-6 py-4 font-extrabold text-slate-800 dark:text-white max-w-[120px] truncate">{msg.subject}</td>
                          <td className="px-6 py-4 text-slate-500 max-w-sm truncate">{msg.message}</td>
                          <td className="px-6 py-4">
                            <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-rose-600 transition"><Trash2 size={15} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {messages.length === 0 && <div className="p-8 text-center text-slate-400 font-semibold">No messages found.</div>}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/85 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">User Reviews Moderation</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
                    <thead className="bg-slate-55/30 dark:bg-slate-850/30 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <tr>
                        {['Date', 'Tour Title', 'User Name', 'Rating Rating', 'Comment details', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                      {reviews.map((rev) => (
                        <tr key={rev.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/20 transition">
                          <td className="px-6 py-4 text-slate-450">{new Date(rev.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-[150px] truncate">{rev.tour_title}</td>
                          <td className="px-6 py-4 text-slate-550">{rev.user_name}</td>
                          <td className="px-6 py-4">
                            <div className="flex text-yellow-400 gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-550 max-w-sm truncate">{rev.comment}</td>
                          <td className="px-6 py-4">
                            <button onClick={() => handleDeleteReview(rev.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-rose-600 transition"><Trash2 size={15} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {reviews.length === 0 && <div className="p-8 text-center text-slate-400 font-semibold">No reviews left.</div>}
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <EventsTab events={events} onUpdate={loadDashboardData} token={localStorage.getItem('token')} />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsTab profile={state.profile || { email: state.user?.email }} token={localStorage.getItem('token')} />
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

      {/* Add Tour Modal */}
      {showAddTour && (
        <AddTourModal
          onClose={() => setShowAddTour(false)}
          destinations={destinations}
          guides={guides}
          token={localStorage.getItem('token')}
        />
      )}

      {/* User Details Modal */}
      {selectedUser && renderUserModal()}

    </div>
  );

  // Modal for renderUserModal
  function renderUserModal() {
    if (!selectedUser) return null;
    const userBookings = bookings.filter(b => Number(b.user_id) === Number(selectedUser.id));

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative border border-slate-200/20"
        >
          <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-400">
            <X size={18} />
          </button>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Traveler Details Summary</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">User Account Database ID: {selectedUser.id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4.5 bg-slate-50 dark:bg-slate-850/50 rounded-2xl border border-slate-200/20">
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">Profile Fields</h4>
                <div className="space-y-2 text-xs">
                  <p><span className="text-slate-400 font-semibold">Name:</span> <strong className="text-slate-800 dark:text-slate-200 ml-1">{selectedUser.full_name}</strong></p>
                  <p><span className="text-slate-400 font-semibold">Email:</span> <strong className="text-slate-800 dark:text-slate-200 ml-1">{selectedUser.email}</strong></p>
                  <p><span className="text-slate-400 font-semibold">Access Privilege:</span> <span className="ml-1 bg-slate-150 px-2 py-0.5 rounded text-[10px] font-bold capitalize">{selectedUser.role || 'user'}</span></p>
                  <p><span className="text-slate-400 font-semibold">Registration Date:</span> <strong className="text-slate-800 dark:text-slate-200 ml-1">{new Date(selectedUser.created_at).toLocaleDateString()}</strong></p>
                </div>
              </div>
              <div className="space-y-3.5 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3.5 md:pt-0 md:pl-6">
                <h4 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">Accounting Metrics</h4>
                <div className="space-y-2 text-xs">
                  <p><span className="text-slate-400 font-semibold">Reservations Booked:</span> <strong className="text-slate-800 dark:text-slate-200 ml-1">{userBookings.length}</strong></p>
                  <p><span className="text-slate-400 font-semibold">Total Revenue Generated:</span> <strong className="text-emerald-500 ml-1">₹{userBookings.reduce((sum, b) => sum + Number(b.total_price), 0).toLocaleString()}</strong></p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Booking History list</h4>
              {userBookings.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-850/50 text-[10px] uppercase font-bold text-slate-400">
                      <tr>
                        <th className="px-4 py-2.5">ID</th>
                        <th className="px-4 py-2.5">Tour title</th>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Price</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-350">
                      {userBookings.map((b) => (
                        <tr key={b.id}>
                          <td className="px-4 py-2.5 font-bold text-slate-850 dark:text-white">#{b.id.toString().slice(0, 8)}</td>
                          <td className="px-4 py-2.5 truncate max-w-[150px]">{b.tours?.title || 'Unknown Tour'}</td>
                          <td className="px-4 py-2.5">{new Date(b.booking_date).toLocaleDateString()}</td>
                          <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">₹{b.total_price}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${b.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No bookings found for user.</p>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedUser(null)} className="px-5 py-2 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 text-xs font-bold rounded-xl transition">Close</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
};

// --- Sub Components ---

const BookingAssigner: React.FC<{ booking: any, guides: any[], bookings: any[], token: string | null, onAssign: () => void }> = ({ booking, guides, bookings, token, onAssign }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(booking.guide ? booking.guide.id : '');

  const handleAssign = async () => {
    if (!selectedGuide) return;
    const body = selectedGuide === 'unassign' ? { guideId: null } : { guideId: selectedGuide };

    try {
      const res = await fetch(`${API_BASE_URL}/admin/bookings/${booking.id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setIsEditing(false);
        onAssign();
        toast.success(selectedGuide === 'unassign' ? 'Guide unassigned' : 'Guide assigned successfully');
      } else {
        toast.error('Failed to assign guide');
      }
    } catch (e) { console.error(e); }
  };

  const isGuideAvailable = (guideId: number) => {
    const bookingDate = new Date(booking.booking_date);
    bookingDate.setHours(0, 0, 0, 0);

    return !bookings.some(b => {
      if (b.id === booking.id) return false;
      if (b.status === 'cancelled') return false;
      if (!b.guide) return false;

      const otherDate = new Date(b.booking_date);
      otherDate.setHours(0, 0, 0, 0);
      return b.guide.id === guideId && otherDate.getTime() === bookingDate.getTime();
    });
  };

  if (booking.status === 'cancelled') return <span className="text-slate-400 text-xs italic">N/A</span>;

  if (booking.guide && !isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-emerald-600 font-bold">{booking.guide.name}</span>
        <button onClick={() => setIsEditing(true)} className="text-indigo-650 hover:underline text-[10px] font-bold">Edit</button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <select
        className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs px-2 py-1 outline-none font-semibold text-slate-700 dark:text-slate-300"
        value={selectedGuide}
        onChange={e => setSelectedGuide(e.target.value)}
      >
        <option value="">Select Guide</option>
        {booking.guide && <option value="unassign">Unassign Guide</option>}
        {guides.map(g => {
          const available = isGuideAvailable(g.id);
          return (
            <option key={g.id} value={g.id} disabled={!available} className={!available ? 'text-slate-400' : ''}>
              {g.name} {!available ? '(Busy)' : ''}
            </option>
          );
        })}
      </select>
      <div className="flex space-x-1">
        <button onClick={handleAssign} disabled={!selectedGuide} className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold disabled:opacity-50 transition active:scale-98">OK</button>
        {isEditing && <button onClick={() => setIsEditing(false)} className="text-slate-400 text-xs px-1 hover:text-slate-600"><X size={14} /></button>}
      </div>
    </div>
  );
};

const GuidesTab: React.FC<{ guides: any[], bookings: any[], setGuides: any, token: string | null }> = ({ guides, bookings, setGuides, token }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newGuide, setNewGuide] = useState({
    name: '', contact: '', specialty: '',
    languages: '', experience_years: '', image_url: '', whatsapp_number: ''
  });
  const [viewMode, setViewMode] = useState<'profile' | 'verification'>('verification');

  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null);
  const [guideDetails, setGuideDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchGuideDetails = async (id: number, mode: 'profile' | 'verification' = 'verification') => {
    setIsLoadingDetails(true);
    setViewMode(mode);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/guides/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGuideDetails(data);
        setSelectedGuideId(id);
      } else {
        toast.error('Failed to fetch guide details');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error fetching details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleVerifyGuide = async (id: number, status: 'verified' | 'rejected', reason?: string) => {
    if (!window.confirm(`Are you sure you want to mark this guide as ${status}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/guides/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, rejectionReason: reason })
      });
      if (res.ok) {
        toast.success(`Guide ${status} successfully`);
        if (guideDetails) {
          setGuideDetails({
            ...guideDetails,
            profile: {
              ...guideDetails.profile,
              is_verified: status === 'verified' ? 1 : 0,
              rejection_reason: status === 'rejected' ? (reason || null) : null
            }
          });
        }
        setShowRejectionForm(false);
        setRejectionReason('');
        fetchGuides();
      } else {
        const errText = await res.text();
        toast.error(`Action failed: ${errText}`);
      }
    } catch (e) {
      console.error(e);
      toast.error(`Error verifying guide`);
    }
  };

  const AVAILABLE_LANGUAGES = ['English', 'Hindi', 'Konkani', 'Marathi', 'Russian', 'French', 'German', 'Spanish'];
  const AVAILABLE_SPECIALTIES = ['History', 'Culture', 'Nature', 'Food', 'Adventure', 'Art', 'Nightlife', 'Spiritual'];

  const handleLanguageToggle = (lang: string) => {
    const current = newGuide.languages ? newGuide.languages.split(', ').filter(l => l) : [];
    const updated = current.includes(lang) ? current.filter(l => l !== lang) : [...current, lang];
    setNewGuide({ ...newGuide, languages: updated.join(', ') });
  };

  const handleSpecialtyToggle = (spec: string) => {
    const current = newGuide.specialty ? newGuide.specialty.split(', ').filter(s => s) : [];
    const updated = current.includes(spec) ? current.filter(s => s !== spec) : [...current, spec];
    setNewGuide({ ...newGuide, specialty: updated.join(', ') });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchGuides = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/guides`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setGuides(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchGuides(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/guides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newGuide)
      });
      if (res.ok) {
        setShowAdd(false);
        fetchGuides();
        toast.success('Guide added successfully');
        setNewGuide({ name: '', contact: '', specialty: '', languages: '', experience_years: '', image_url: '', whatsapp_number: '' });
      }
    } catch (e) { console.error(e); }
  };

  const renderDetailsModal = () => {
    if (!selectedGuideId || !guideDetails) return null;
    const { profile, documents, portfolio } = guideDetails;

    const visibleDocuments = viewMode === 'profile'
      ? documents.filter((d: any) => d.document_type.includes('license'))
      : documents;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6 relative border border-slate-200/20"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {viewMode === 'profile' ? 'Guide Profile File' : 'Government Verification Review'}
            </h2>
            <button
              onClick={() => {
                setSelectedGuideId(null);
                setShowRejectionForm(false);
                setRejectionReason('');
              }}
              className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400"
            >
              <X size={18} />
            </button>
          </div>

          {isLoadingDetails ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4.5 bg-slate-50 dark:bg-slate-850/50 rounded-2xl border border-slate-200/20">
                {/* Left Col: Info */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">Profile Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
                    <div>
                      <p className="text-slate-400">Full Name</p>
                      <p className="text-slate-850 dark:text-white font-extrabold mt-0.5">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Email Address</p>
                      <p className="text-slate-850 dark:text-white font-extrabold mt-0.5">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Contact Number</p>
                      <p className="text-slate-850 dark:text-white font-extrabold mt-0.5">{profile.contact}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">WhatsApp Line</p>
                      <p className="text-slate-850 dark:text-white font-extrabold mt-0.5">{profile.whatsapp_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Verification Status</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase mt-1 tracking-wide
                        ${profile.is_verified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {profile.is_verified ? 'Verified' : 'Pending Review'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Guide Description Bio</p>
                    <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{profile.bio || 'No bio provided.'}</p>
                  </div>
                </div>

                {/* Right Col: Documents */}
                <div className="space-y-3.5 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3.5 md:pt-0 md:pl-6">
                  <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
                    {viewMode === 'profile' ? 'Guide Tourism License' : 'Submitted Credentials'}
                  </h3>
                  {visibleDocuments && visibleDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {visibleDocuments.map((doc: any) => (
                        <div key={doc.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
                          <div>
                            <p className="font-extrabold text-xs capitalize text-slate-850 dark:text-white">{doc.document_type.replace('_', ' ')}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Uploaded: {new Date(doc.created_at || Date.now()).toLocaleDateString()}</p>
                          </div>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-indigo-650 dark:text-indigo-450 hover:underline text-xs font-bold"
                          >
                            <FileText className="h-4 w-4 mr-1" /> View Full
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No verification files uploaded.</p>
                  )}
                </div>
              </div>

              {/* Portfolio Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Portfolio / Gallery</h3>
                {portfolio && portfolio.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {portfolio.map((item: any) => (
                      <div key={item.id} className="aspect-square bg-slate-50 dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-inner">
                        <img src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`} alt="Portfolio" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No photos in portfolio gallery.</p>
                )}
              </div>

              {/* Action Buttons in Verification Mode */}
              {viewMode === 'verification' && (
                <div className="mt-8 border-t pt-4">
                  {showRejectionForm ? (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 space-y-3">
                      <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider">Rejection Reason / Request Changes Details</label>
                      <textarea
                        className="w-full p-3 border border-rose-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900 font-semibold"
                        rows={3}
                        placeholder="Please specify changes needed (e.g., Guide license ID has expired, upload recent license image)"
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                      />
                      <div className="flex justify-end space-x-3 text-xs">
                        <button
                          onClick={() => { setShowRejectionForm(false); setRejectionReason(''); }}
                          className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-700 bg-white font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleVerifyGuide(profile.id, 'rejected', rejectionReason)}
                          disabled={!rejectionReason.trim()}
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md font-bold disabled:opacity-50"
                        >
                          Submit Rejection
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-4 text-xs font-bold">
                      <button
                        onClick={() => setShowRejectionForm(true)}
                        className="px-4 py-2 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50/50"
                      >
                        Reject Verification
                      </button>
                      <button
                        onClick={() => handleVerifyGuide(profile.id, 'verified')}
                        className="px-6 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10"
                      >
                        Approve & Verify Guide
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/85 p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">Local Guides Registry</h3>
          <span className="inline-block text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-2 py-0.5 rounded font-bold">Today: {today.toLocaleDateString()}</span>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm active:scale-98
            ${showAdd
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-indigo-600/10'}`}
        >
          {showAdd ? 'Cancel Add' : 'Register New Guide'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/20 space-y-4">
          <h4 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">New Guide Profile Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
              <input placeholder="Full Name" className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl outline-none" required value={newGuide.name} onChange={e => setNewGuide({ ...newGuide, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Info</label>
              <input placeholder="Contact Info" className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl outline-none" required value={newGuide.contact} onChange={e => setNewGuide({ ...newGuide, contact: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp Number</label>
              <input placeholder="e.g. 919876543210" className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl outline-none" value={newGuide.whatsapp_number} onChange={e => setNewGuide({ ...newGuide, whatsapp_number: e.target.value })} />
            </div>

            <div className="col-span-full space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Languages Spoken</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition duration-150 active:scale-95
                      ${newGuide.languages.includes(lang)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-full space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Guide Specialties</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SPECIALTIES.map(spec => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => handleSpecialtyToggle(spec)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition duration-150 active:scale-95
                      ${newGuide.specialty.includes(spec)
                        ? 'bg-purple-650 text-white border-purple-650'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Experience (Years)</label>
              <input placeholder="Experience" type="number" className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl outline-none" value={newGuide.experience_years} onChange={e => setNewGuide({ ...newGuide, experience_years: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Image URL (Optional)</label>
              <input placeholder="https://..." className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl outline-none" value={newGuide.image_url} onChange={e => setNewGuide({ ...newGuide, image_url: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition active:scale-98">Create Guide Profile</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
          <thead className="bg-slate-55/30 dark:bg-slate-850/30 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <tr>
              <th className="px-6 py-3">Guide Name</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Specialty / Languages</th>
              <th className="px-6 py-3">Experience</th>
              <th className="px-6 py-3">Availability</th>
              <th className="px-6 py-3">Verification Badge</th>
              <th className="px-6 py-3">WhatsApp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
            {guides.map((g: Guide) => {
              const isBooked = bookings.some(b => {
                const d = new Date(b.booking_date);
                d.setHours(0, 0, 0, 0);
                return b.guide && b.guide.id === g.id && d.getTime() === today.getTime() && b.status !== 'cancelled';
              });

              let statusLabel = 'Available';
              let statusColor = 'bg-green-50 text-green-700';

              if (g.status === 'busy' || g.status === 'offline') {
                statusLabel = 'Busy (Manual)';
                statusColor = 'bg-rose-50 text-rose-700';
              } else if (isBooked) {
                statusLabel = 'Booked Today';
                statusColor = 'bg-yellow-50 text-yellow-700';
              }

              return (
                <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/20 transition">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => fetchGuideDetails(g.id, 'profile')}
                      className="flex items-center hover:bg-slate-100/50 dark:hover:bg-slate-800/40 p-1.5 -ml-1.5 rounded-xl transition text-left group w-full"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-650 flex items-center justify-center font-bold text-xs mr-2">
                        {g.name.charAt(0)}
                      </div>
                      <span className="font-extrabold text-slate-850 dark:text-white group-hover:text-indigo-650 transition">{g.name}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{g.contact}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <p className="font-bold text-slate-800 dark:text-white">{g.specialty}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{g.languages}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-850 dark:text-slate-350">{g.experience_years} years</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start space-y-1">
                      {g.is_verified ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700">
                          <Shield size={10} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          Unverified
                        </span>
                      )}
                      <button
                        onClick={() => fetchGuideDetails(g.id)}
                        className="text-indigo-650 dark:text-indigo-400 hover:underline text-[10px] font-bold"
                      >
                        Verification review
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-450">{g.whatsapp_number || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {guides.length === 0 && <p className="text-center py-8 text-slate-400 font-semibold">No registered local guides found.</p>}
      </div>

      {selectedGuideId && renderDetailsModal()}
    </div>
  );
};

const SettingsTab: React.FC<{ profile: any, token: string | null }> = ({ profile, token }) => {
  const [passData, setPassData] = useState({ email: profile?.email || '', currentPass: '', newPass: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.email && !passData.email) {
      setPassData(prev => ({ ...prev, email: profile.email }));
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    if (!passData.email) { setMsg('Error: Email is required.'); setLoading(false); return; }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: passData.email, password: passData.currentPass, newPassword: passData.newPass })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Success: ' + data.message);
        setPassData({ ...passData, currentPass: '', newPass: '' });
        toast.success('Admin profile updated successfully');
      } else {
        setMsg('Error: ' + data.message);
        toast.error(data.message || 'Update failed');
      }
    } catch (e) { console.error(e); setMsg('Request failed'); }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-6 max-w-lg mx-auto shadow-sm space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Settings size={16} className="text-indigo-500" />
          <span>Admin Account Settings</span>
        </h3>
        <p className="text-xs text-slate-400">Modify email logins and secure passcode credentials.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4 text-xs font-semibold">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Admin Username Email</label>
          <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" value={passData.email} onChange={e => setPassData({ ...passData, email: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Current Admin Password (Required)</label>
          <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" required value={passData.currentPass} onChange={e => setPassData({ ...passData, currentPass: e.target.value })} placeholder="••••••••" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">New System Password (Optional)</label>
          <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" value={passData.newPass} onChange={e => setPassData({ ...passData, newPass: e.target.value })} placeholder="Leave blank to keep current" />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={loading} className="w-full bg-indigo-650 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition font-bold active:scale-98 shadow shadow-indigo-600/10">
            {loading ? 'Saving Changes...' : 'Save Profile Settings'}
          </button>
        </div>
        {msg && <div className={`p-3 rounded-xl text-center font-bold text-[11px] ${msg.startsWith('Success') ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'}`}>{msg}</div>}
      </form>
    </div>
  );
};

const AddTourModal: React.FC<{ onClose: () => void, destinations: any[], guides: any[], token: string | null }> = ({ onClose, destinations, guides, token }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', destinationId: '', category: 'Adventure', price: '', duration: '', maxParticipants: '', imageUrl: '', guideId: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMsg('Success! Tour added.');
        toast.success('Tour created successfully');
        setTimeout(onClose, 1500);
      } else {
        const d = await res.json();
        setMsg('Error: ' + d.message);
        toast.error(d.message || 'Creation failed');
      }
    } catch (e) { setMsg('Failed to connect.'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200/20"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Create New Travel Tour</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-650 p-2 hover:bg-slate-100 rounded-full transition"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tour Title</label>
              <input className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Scuba Diving at Grand Island" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Select Destination</label>
              <select className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none" required value={formData.destinationId} onChange={e => setFormData({ ...formData, destinationId: e.target.value })}>
                <option value="">Select Destination</option>
                {destinations.map(d => <option key={d.id} value={d.id}>{d.name} ({d.region})</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Assign Local Guide (Optional)</label>
              <select className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none" value={formData.guideId} onChange={e => setFormData({ ...formData, guideId: e.target.value })}>
                <option value="">No Guide / Self-Guided</option>
                {guides.map(g => <option key={g.id} value={g.id}>{g.name} ({g.is_verified ? 'Verified' : 'Unverified'})</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Category Group</label>
              <select className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="Adventure">Adventure</option>
                <option value="Nature">Nature</option>
                <option value="Heritage">Heritage</option>
                <option value="Food">Food</option>
                <option value="Relaxation">Relaxation</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Base Price (₹)</label>
              <input type="number" className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Duration (Hours)</label>
              <input type="number" className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
            </div>

            <div className="col-span-full space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Image URL banner</label>
              <input placeholder="https://..." className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
            </div>

            <div className="col-span-full space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tour Details Description</label>
              <textarea className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what clients will experience during this tour..."></textarea>
            </div>
          </div>

          {msg && <p className={`text-center font-bold text-[11px] ${msg.startsWith('Success') ? 'text-green-600' : 'text-rose-600'}`}>{msg}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Close</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 transition shadow shadow-indigo-650/10 active:scale-98">
              {loading ? 'Creating...' : 'Create Tour Listing'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
