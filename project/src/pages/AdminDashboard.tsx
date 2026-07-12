import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, TrendingUp, Eye, Trash2, LogOut, Search, FileDown, Plus, X, Shield } from 'lucide-react';
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
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'guides' | 'messages' | 'reviews' | 'events' | 'settings'>('overview');

  const [showAddTour, setShowAddTour] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter States
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all');

  useEffect(() => {
    if (state.isLoading) return;
    if (!state.user || !state.isAdmin) {
      // navigate('/login'); // uncomment in prod
    } else {
      loadDashboardData();
    }
  }, [state.isAdmin, state.isLoading, state.user]);

  // Filter effect
  useEffect(() => {
    let result = bookings;

    // 1. Search Filter
    if (bookingSearch) {
      const lower = bookingSearch.toLowerCase();
      result = result.filter(b => {
        const dateStr = new Date(b.booking_date).toLocaleDateString().toLowerCase();
        return (
          (b.user_profiles?.full_name || '').toLowerCase().includes(lower) ||
          (b.tours?.title || '').toLowerCase().includes(lower) ||
          (b.guide?.name || '').toLowerCase().includes(lower) ||
          dateStr.includes(lower) ||
          b.id.includes(lower)
        );
      });
    }

    // 2. Status Filter
    if (bookingFilterStatus !== 'all') {
      result = result.filter(b => b.status === bookingFilterStatus);
    }

    // 3. Date Filter
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
        // Map backend flat structure (guide_id, guide_name) to frontend object (guide: {id, name})
        const mappedBookings = data.map((b: any) => ({
          ...b,
          guide: b.guide_id ? { id: b.guide_id, name: b.guide_name } : null
        }));
        setBookings(mappedBookings);
      }

      const guidesRes = await fetch(`${API_BASE_URL}/admin/guides`, { headers });
      if (guidesRes.ok) setGuides(await guidesRes.json());

      const msgsRes = await fetch(`${API_BASE_URL}/admin/messages`, { headers });
      if (msgsRes.ok) setMessages(await msgsRes.json());

      const reviewsRes = await fetch(`${API_BASE_URL}/admin/reviews`, { headers });
      if (reviewsRes.ok) setReviews(await reviewsRes.json());

      const eventsRes = await fetch(`${API_BASE_URL}/events`); // Public endpoint serves all we need for list
      if (eventsRes.ok) setEvents(await eventsRes.json());

      const destRes = await fetch(`${API_BASE_URL}/destinations`);
      if (destRes.ok) setDestinations(await destRes.json());

    } catch (error) {
      console.error('Error loading data:', error);
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
    } catch (e) { console.error(e); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (Number(userId) === Number(state.profile?.id)) {
      alert("You cannot delete your own admin account.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user? This will also cancel all their bookings and remove their reviews/wishlist items.")) return;
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

  const renderUserModal = () => {
    if (!selectedUser) return null;

    // Filter bookings for this user
    const userBookings = bookings.filter(b => Number(b.user_id) === Number(selectedUser.id));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-left">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <p className="text-sm text-gray-500">ID: {selectedUser.id}</p>
            </div>
            <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Profile Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{selectedUser.full_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Role</p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : selectedUser.role === 'guide' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {selectedUser.role || 'user'}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Joined Date</p>
                  <p className="font-medium text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Activity Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Bookings</p>
                  <p className="text-lg font-bold text-gray-900">{userBookings.length}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Spent</p>
                  <p className="text-lg font-bold text-green-600">₹{userBookings.reduce((sum, b) => sum + Number(b.total_price), 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 border-b pb-2 mb-2">Booking History</h3>
            {userBookings.length > 0 ? (
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userBookings.map((b) => (
                      <tr key={b.id}>
                        <td className="px-4 py-2 font-medium text-gray-900">#{b.id.toString().slice(0, 8)}</td>
                        <td className="px-4 py-2 text-gray-600">{b.tours?.title || 'Unknown Tour'}</td>
                        <td className="px-4 py-2 text-gray-600">{new Date(b.booking_date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 font-semibold text-gray-900">₹{b.total_price}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No bookings found for this user.</p>
            )}
          </div>

          <div className="mt-8 flex justify-end border-t pt-4">
            <button
              onClick={() => setSelectedUser(null)}
              className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };


  const getStatusButtonClass = (status: string) => {
    const base = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
    if (bookingFilterStatus === status) {
      return `${base} bg-blue-600 text-white shadow-md`;
    }
    return `${base} bg-white text-gray-700 hover:bg-gray-100 border border-gray-200`;
  };

  const getDateButtonClass = (filter: string) => {
    const base = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
    if (dateFilter === filter) {
      return `${base} bg-blue-600 text-white shadow-md`;
    }
    return `${base} bg-white text-gray-700 hover:bg-gray-100 border border-gray-200`;
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const handleExport = () => {
    // Simple CSV export of bookings
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
  };

  const stats = [
    { name: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'bg-blue-500' },
    { name: 'Total Bookings', value: analytics.totalBookings, icon: Calendar, color: 'bg-green-500' },
    { name: 'Total Revenue', value: `₹${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-yellow-500' },
    { name: 'Growth Rate', value: '+12%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  if (state.isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {state.profile?.full_name || 'Admin'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={handleExport} className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                <FileDown size={18} />
                <span>Export Data</span>
              </button>
              <button onClick={() => setShowAddTour(true)} className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                <Plus size={18} />
                <span>Add Tour</span>
              </button>
              <button onClick={handleLogout} className="flex items-center space-x-2 bg-gray-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition border border-red-100">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="border-b border-gray-200 min-w-max">
            <nav className="flex space-x-8">
              {(['overview', 'users', 'bookings', 'guides', 'messages', 'reviews', 'events', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{booking.user_profiles?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{booking.tours?.title || 'Unknown Tour'}</p>
                    </div>
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
                {bookings.length === 0 && <p className="text-gray-500 text-center py-4">No recent bookings.</p>}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">New Users</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
                {users.length === 0 && <p className="text-gray-500 text-center py-4">No new users.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">User Directory</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['User', 'Email', 'Role', 'Joined', 'Bookings', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{user.customer_data?.total_bookings || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button onClick={() => setSelectedUser(user)} className="text-blue-600 hover:text-blue-900"><Eye size={16} /></button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && <div className="p-8 text-center text-gray-500">No users found.</div>}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Booking Management</h3>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">

                  {/* Search */}
                  <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by user, tour, date, guide..."
                      className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* Date Filters */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button onClick={() => setDateFilter('all')} className={getDateButtonClass('all')}>All Dates</button>
                      <button onClick={() => setDateFilter('today')} className={getDateButtonClass('today')}>Today</button>
                      <button onClick={() => setDateFilter('tomorrow')} className={getDateButtonClass('tomorrow')}>Tomorrow</button>
                    </div>

                    {/* Status Filters */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button onClick={() => setBookingFilterStatus('all')} className={getStatusButtonClass('all')}>All</button>
                      <button onClick={() => setBookingFilterStatus('assigned')} className={getStatusButtonClass('assigned')}>Assigned</button>
                      <button onClick={() => setBookingFilterStatus('confirmed')} className={getStatusButtonClass('confirmed')}>Confirmed</button>
                      <button onClick={() => setBookingFilterStatus('cancelled')} className={getStatusButtonClass('cancelled')}>Cancelled</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['ID', 'Customer', 'Tour', 'Date', 'Amount', 'Status', 'Guide'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.id.toString().slice(0, 8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.user_profiles?.full_name || 'Deleted User'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.tours?.title || 'Deleted Tour'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(booking.booking_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹{booking.total_price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <BookingAssigner booking={booking} guides={guides} bookings={bookings} token={localStorage.getItem('token')} onAssign={loadDashboardData} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && <div className="p-8 text-center text-gray-500">No bookings match your search.</div>}
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <GuidesTab guides={guides} bookings={bookings} setGuides={setGuides} token={localStorage.getItem('token')} />
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Incoming Messages</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Date', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{msg.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{msg.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{msg.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{msg.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{msg.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {messages.length === 0 && <div className="p-8 text-center text-gray-500">No messages found.</div>}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">User Reviews</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Date', 'Tour', 'User', 'Rating', 'Comment', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rev.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rev.tour_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{rev.user_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{rev.comment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleDeleteReview(rev.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {reviews.length === 0 && <div className="p-8 text-center text-gray-500">No reviews found.</div>}
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsTab profile={state.profile} token={localStorage.getItem('token')} />
        )}

        {activeTab === 'events' && (
          <EventsTab events={events} onUpdate={loadDashboardData} token={localStorage.getItem('token')} />
        )}
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
};

// --- Sub Components ---

// --- Sub Components ---

const BookingAssigner: React.FC<{ booking: any, guides: any[], bookings: any[], token: string | null, onAssign: () => void }> = ({ booking, guides, bookings, token, onAssign }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(booking.guide ? booking.guide.id : ''); // Note: frontend booking.guide is object {name, contact}, wait. 
  // The frontend mapping in fetchBookings maps `booking.guide` to an object. But we need ID.
  // We need to fix the frontend mapping to include ID or find it. 
  // Actually the guides list has IDs. 
  // Let's assume we can match by name if ID is missing in `booking.guide`, or better update fetch logic.
  // Looking at fetchBookings: `guide: b.guide_id ? { name: b.guide_name... } : null`. 
  // It loses the ID! I need to update fetchBookings first.

  // WAIT: I should update the fetchBookings mapping in the main component to include `id` in `booking.guide`.
  // For now, I'll temporarily fix it here assuming I will receive `guide: { id, name ... }`.

  const handleAssign = async () => {
    if (!selectedGuide) return;

    // Check if unassigning
    const body = selectedGuide === 'unassign' ? { guideId: null } : { guideId: selectedGuide };

    try {
      await fetch(`${API_BASE_URL}/admin/bookings/${booking.id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      setIsEditing(false);
      onAssign();
    } catch (e) { console.error(e); }
  };

  // If Cancelled, show nothing or status
  if (booking.status === 'cancelled') return <span className="text-gray-400 text-xs italic">N/A</span>;

  // If Assigned and not editing, show name + Change button
  if (booking.guide && !isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-green-600 font-medium">{booking.guide.name}</span>
        <button onClick={() => setIsEditing(true)} className="text-blue-600 text-xs hover:underline">Change</button>
      </div>
    );
  }

  // Helper to check availability
  const isGuideAvailable = (guideId: number) => {
    // Check if guide is assigned to ANY booking on the SAME day, excluding current booking
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);

    return !bookings.some(b => {
      if (b.id === booking.id) return false; // Ignore self
      if (b.status === 'cancelled') return false;
      if (!b.guide) return false;
      // We need guide ID here. If b.guide doesn't have ID, we have a problem.
      // Assuming I fix mapping: b.guide.id === guideId
      // If not fixed yet, this might fail. I MUST FIX MAPPING.
      const otherDate = new Date(b.date);
      otherDate.setHours(0, 0, 0, 0);
      return b.guide.id === guideId && otherDate.getTime() === bookingDate.getTime();
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        className="border rounded text-xs p-1 max-w-[150px]"
        value={selectedGuide}
        onChange={e => setSelectedGuide(e.target.value)}
      >
        <option value="">Select Guide</option>
        {booking.guide && <option value="unassign">Unassign Guide</option>}
        {guides.map(g => {
          const available = isGuideAvailable(g.id);
          return (
            <option key={g.id} value={g.id} disabled={!available} className={!available ? 'text-gray-400' : ''}>
              {g.name} {!available ? '(Busy)' : ''}
            </option>
          );
        })}
      </select>
      <div className="flex space-x-1">
        <button onClick={handleAssign} disabled={!selectedGuide} className="bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50">OK</button>
        {isEditing && <button onClick={() => setIsEditing(false)} className="text-gray-500 text-xs px-1">X</button>}
      </div>
    </div>
  );
};

interface Guide {
  id: number;
  name: string;
  contact: string;
  specialty: string;
  languages?: string;
  experience_years?: string | number;
  image_url?: string;
  status: string;
  is_verified: boolean;
  whatsapp_number?: string;
}

const GuidesTab: React.FC<{ guides: any[], bookings: any[], setGuides: any, token: string | null }> = ({ guides, bookings, setGuides, token }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newGuide, setNewGuide] = useState({
    name: '', contact: '', specialty: '',
    languages: '', experience_years: '', image_url: '', whatsapp_number: ''
  });
  /* New state for View Mode: 'profile' (Name click) vs 'verification' (Verify button click) */
  const [viewMode, setViewMode] = useState<'profile' | 'verification'>('verification');

  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null);
  const [guideDetails, setGuideDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchGuideDetails = async (id: number, mode: 'profile' | 'verification' = 'verification') => {
    setIsLoadingDetails(true);
    setViewMode(mode); // Set the mode
    try {
      const res = await fetch(`${API_BASE_URL}/admin/guides/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGuideDetails(data);
        setSelectedGuideId(id);
      } else {
        alert('Failed to fetch guide details');
      }
    } catch (e) {
      console.error(e);
      alert('Error fetching details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // ...

  const renderDetailsModal = () => {
    if (!selectedGuideId || !guideDetails) return null;
    const { profile, documents, portfolio } = guideDetails;

    // Filter documents based on viewMode
    // Profile Mode: Show only 'license'
    // Verification Mode: Show ALL
    const visibleDocuments = viewMode === 'profile'
      ? documents.filter((d: any) => d.document_type.includes('license'))
      : documents;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {viewMode === 'profile' ? 'Guide Profile' : 'Verification Review'}
            </h2>
            <button 
              onClick={() => { 
                setSelectedGuideId(null); 
                setShowRejectionForm(false); 
                setRejectionReason(''); 
              }} 
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isLoadingDetails ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Col: Profile */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Profile Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Full Name</p>
                      <p className="font-medium">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <p className="font-medium">{profile.contact}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">WhatsApp</p>
                      <p className="font-medium">{profile.whatsapp_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <span className={`px-2 py-1 rounded text-xs ${profile.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {profile.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    {profile.rejection_reason && !profile.is_verified && (
                      <div className="col-span-2 mt-2 p-2.5 bg-red-50 border border-red-100 text-red-800 rounded-lg text-xs">
                        <strong>Verification Feedback:</strong> {profile.rejection_reason}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Bio</p>
                    <p className="text-sm mt-1">{profile.bio || 'No bio provided.'}</p>
                  </div>
                </div>

                {/* Right Col: Documents */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    {viewMode === 'profile' ? 'Guide License' : 'Submitted Documents'}
                  </h3>
                  {visibleDocuments && visibleDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {visibleDocuments.map((doc: any) => (
                        <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                          <div>
                            <p className="font-medium capitalize">{doc.document_type.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">Uploaded: {new Date(doc.created_at || Date.now()).toLocaleDateString()}</p>
                          </div>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <FileDown className="h-4 w-4 mr-1" /> View
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      {viewMode === 'profile' ? 'No license uploaded.' : 'No documents uploaded.'}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Portfolio / Gallery</h3>
                {portfolio && portfolio.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {portfolio.map((item: any) => (
                      <div key={item.id} className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`} alt="Portfolio" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No portfolio items.</p>
                )}
              </div>

              {/* Only show Action Buttons in Verification Mode */}
              {viewMode === 'verification' && (
                <div className="mt-8 border-t pt-6">
                  {showRejectionForm ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                      <label className="block text-sm font-semibold text-red-800">Rejection Reason / Request Changes Details</label>
                      <textarea
                        className="w-full p-2 border border-red-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
                        rows={3}
                        placeholder="Describe the changes required (e.g., 'Please upload a clearer image of your Guide License')"
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                      />
                      <div className="flex justify-end space-x-3 text-sm">
                        <button 
                          onClick={() => { setShowRejectionForm(false); setRejectionReason(''); }} 
                          className="px-3 py-1.5 border rounded hover:bg-gray-50 text-gray-700 bg-white"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleVerifyGuide(profile.id, 'rejected', rejectionReason)} 
                          disabled={!rejectionReason.trim()}
                          className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 shadow font-semibold disabled:opacity-50"
                        >
                          Submit Rejection
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowRejectionForm(true)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
                      >
                        Reject / Request Changes
                      </button>
                      <button
                        onClick={() => handleVerifyGuide(profile.id, 'verified')}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow font-semibold"
                      >
                        Approve & Verify Guide
                      </button>
                    </div>
                  )}
                </div>
              )}

            </>
          )}
        </div>
      </div>
    );
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
        alert(`Guide ${status} successfully`);
        // Update local state to reflect change immediately
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
        fetchGuides(); // Refresh list background
      } else {
        const errText = await res.text();
        console.error('Verify failed:', res.status, errText);
        alert(`Action failed: ${res.status} - ${errText}`);
      }
    } catch (e) {
      console.error(e);
      alert(`Error: ${e}`);
    }
  };

  const AVAILABLE_LANGUAGES = ['English', 'Hindi', 'Konkani', 'Marathi', 'Russian', 'French', 'German', 'Spanish'];
  const AVAILABLE_SPECIALTIES = ['History', 'Culture', 'Nature', 'Food', 'Adventure', 'Art', 'Nightlife', 'Spiritual'];

  const handleLanguageToggle = (lang: string) => {
    const current = newGuide.languages ? newGuide.languages.split(', ').filter(l => l) : [];
    const updated = current.includes(lang)
      ? current.filter(l => l !== lang)
      : [...current, lang];
    setNewGuide({ ...newGuide, languages: updated.join(', ') });
  };

  const handleSpecialtyToggle = (spec: string) => {
    const current = newGuide.specialty ? newGuide.specialty.split(', ').filter(s => s) : [];
    const updated = current.includes(spec)
      ? current.filter(s => s !== spec)
      : [...current, spec];
    setNewGuide({ ...newGuide, specialty: updated.join(', ') });
  };

  // Determine global availability based on "Today"
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
        setNewGuide({ name: '', contact: '', specialty: '', languages: '', experience_years: '', image_url: '', whatsapp_number: '' });
      }
    } catch (e) { console.error(e); }
  };



  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">Guides & Locals</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Availability for Today ({today.toLocaleDateString()})</span>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className={`px-4 py-2 rounded text-sm transition ${showAdd ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          {showAdd ? 'Cancel' : 'Add New Guide'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold mb-3">New Guide Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input placeholder="Full Name" className="p-2 border rounded" required value={newGuide.name} onChange={e => setNewGuide({ ...newGuide, name: e.target.value })} />
            <input placeholder="Contact Info" className="p-2 border rounded" required value={newGuide.contact} onChange={e => setNewGuide({ ...newGuide, contact: e.target.value })} />
            <input placeholder="WhatsApp Number (e.g., 919876543210)" className="p-2 border rounded" value={newGuide.whatsapp_number} onChange={e => setNewGuide({ ...newGuide, whatsapp_number: e.target.value })} />
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-xs text-gray-500 mb-1">Specialties</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SPECIALTIES.map(spec => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => handleSpecialtyToggle(spec)}
                    className={`px-3 py-1 rounded-full text-xs border ${newGuide.specialty.includes(spec)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-xs text-gray-500 mb-1">Languages Spoken</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-3 py-1 rounded-full text-xs border ${newGuide.languages.includes(lang)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <input placeholder="Experience (Years)" type="number" className="p-2 border rounded" value={newGuide.experience_years} onChange={e => setNewGuide({ ...newGuide, experience_years: e.target.value })} />
            <input placeholder="Image URL (Optional)" className="p-2 border rounded" value={newGuide.image_url} onChange={e => setNewGuide({ ...newGuide, image_url: e.target.value })} />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Save Guide</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guide</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verification</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {guides.map((g: Guide) => {
              // Priority: Manual Status -> Booking Status
              const isBooked = bookings.some(b => {
                const d = new Date(b.booking_date); // Use booking_date not date
                d.setHours(0, 0, 0, 0);
                // Fix for possible missing guide id relation if not mapped yet, but g.id is safe
                // b.guide might be null if not assigned
                return b.guide && b.guide.id === g.id && d.getTime() === today.getTime() && b.status !== 'cancelled';
              });

              let statusLabel = 'Available';
              let statusColor = 'bg-green-100 text-green-800';

              if (g.status === 'busy' || g.status === 'offline') {
                statusLabel = 'Busy (Manual)';
                statusColor = 'bg-red-100 text-red-800';
              } else if (isBooked) {
                statusLabel = 'Booked Today';
                statusColor = 'bg-yellow-100 text-yellow-800';
              } else {
                statusLabel = 'Available';
                statusColor = 'bg-green-100 text-green-800';
              }

              return (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => fetchGuideDetails(g.id, 'profile')}
                      className="flex items-center hover:bg-gray-100 p-2 -ml-2 rounded-lg transition-colors text-left group w-full"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 mr-2 group-hover:bg-blue-200 transition-colors">
                        {g.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{g.name}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{g.contact}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <div className="font-medium">{g.specialty}</div>
                    <div className="text-xs text-gray-500">{g.languages}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{g.experience_years}y</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start space-y-2">
                      {g.is_verified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield className="w-3 h-3 mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Unverified
                        </span>
                      )}
                      <button
                        onClick={() => fetchGuideDetails(g.id)}
                        className="text-blue-600 hover:text-blue-900 text-xs underline"
                      >
                        View / Verify
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{g.whatsapp_number || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {guides.length === 0 && <p className="text-center py-4 text-gray-500">No guides added yet.</p>}
      </div>

      {selectedGuideId && renderDetailsModal()}
    </div>
  );
};

const SettingsTab: React.FC<{ profile: any, token: string | null }> = ({ profile, token }) => {
  const [passData, setPassData] = useState({ email: profile?.email || '', currentPass: '', newPass: '' });
  const [msg, setMsg] = useState('');

  // Sync email
  useEffect(() => {
    if (profile?.email && !passData.email) {
      setPassData(prev => ({ ...prev, email: profile.email }));
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!passData.email) { setMsg('Error: Email is required.'); return; }

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
      } else {
        setMsg('Error: ' + data.message);
      }
    } catch (e) { console.error(e); setMsg('Request failed'); }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
      <h3 className="text-lg font-semibold mb-6">Admin Account Settings</h3>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
          <input className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" value={passData.email} onChange={e => setPassData({ ...passData, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password (Required)</label>
          <input type="password" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" required value={passData.currentPass} onChange={e => setPassData({ ...passData, currentPass: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
          <input type="password" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" value={passData.newPass} onChange={e => setPassData({ ...passData, newPass: e.target.value })} placeholder="Leave blank to keep current" />
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium">Update Profile</button>
        </div>
        {msg && <div className={`mt-4 p-3 rounded text-sm text-center ${msg.startsWith('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg}</div>}
      </form>
    </div>
  );
};

// --- Add Tour Modal ---
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
        setTimeout(onClose, 1500); // Close after success
      } else {
        const d = await res.json();
        setMsg('Error: ' + d.message);
      }
    } catch (e) { setMsg('Failed to connect.'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Add New Tour</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Tour Title</label>
              <input className="w-full border p-2 rounded" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Destination</label>
              <select className="w-full border p-2 rounded" required value={formData.destinationId} onChange={e => setFormData({ ...formData, destinationId: e.target.value })}>
                <option value="">Select Destination</option>
                {destinations.map(d => <option key={d.id} value={d.id}>{d.name} ({d.region})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Assign Guide (Optional)</label>
              <select className="w-full border p-2 rounded" value={formData.guideId} onChange={e => setFormData({ ...formData, guideId: e.target.value })}>
                <option value="">No Guide / Self-Guided</option>
                {guides.map(g => <option key={g.id} value={g.id}>{g.name} ({g.is_verified ? 'Verified' : 'Unverified'})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="Adventure">Adventure</option>
                <option value="Nature">Nature</option>
                <option value="Heritage">Heritage</option>
                <option value="Food">Food</option>
                <option value="Relaxation">Relaxation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price (₹)</label>
              <input type="number" className="w-full border p-2 rounded" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration (Hours)</label>
              <input type="number" className="w-full border p-2 rounded" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input placeholder="https://..." className="w-full border p-2 rounded" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="w-full border p-2 rounded h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
            </div>
          </div>

          {msg && <p className={`text-center font-medium ${msg.startsWith('Success') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
