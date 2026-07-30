import React, { useState, useEffect } from 'react';
import { VendorListing } from '../types';
import { Store, DollarSign, Calendar, TrendingUp, CheckCircle, Clock, ToggleLeft, ToggleRight, Shield, UserCheck, Plus, X, ArrowLeft, LogOut, Utensils, Bike, Waves } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const MOCK_VENDOR_LISTINGS: VendorListing[] = [
  {
    id: 'v-1',
    title: 'Curlies Beach Shack & Sunset Deck',
    type: 'Beach Shack',
    location: 'Anjuna Beach',
    activeBookings: 14,
    revenueThisMonth: 142000,
    rating: 4.8,
    status: 'Active'
  },
  {
    id: 'v-2',
    title: 'Goa Thar & Scooter Self Drive Fleet',
    type: 'Scooter & Car Rental',
    location: 'Airport / Panjim',
    activeBookings: 28,
    revenueThisMonth: 215000,
    rating: 4.9,
    status: 'Active'
  },
  {
    id: 'v-3',
    title: 'Calangute Extreme Water Sports',
    type: 'Water Sports Operator',
    location: 'Calangute Beach',
    activeBookings: 9,
    revenueThisMonth: 86000,
    rating: 4.7,
    status: 'Active'
  },
  {
    id: 'v-4',
    title: 'Sattari Heritage Feni Distillery',
    type: 'Artisan Workshop',
    location: 'Valpoi, Sattari',
    activeBookings: 5,
    revenueThisMonth: 48000,
    rating: 5.0,
    status: 'Active'
  }
];

const VendorPortal: React.FC = () => {
  const { state, signOut } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState<VendorListing[]>(MOCK_VENDOR_LISTINGS);
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings' | 'payouts'>('listings');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vendorSession, setVendorSession] = useState<any>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<VendorListing['type']>('Beach Shack');
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const fetchListings = () => {
      const saved = localStorage.getItem('goa_vendor_listings');
      if (saved) {
        try {
          setListings(JSON.parse(saved));
        } catch (e) {}
      }
    };

    fetchListings();

    const savedSession = localStorage.getItem('vendor_active_session');
    if (savedSession) {
      try {
        setVendorSession(JSON.parse(savedSession));
      } catch (e) {
        console.error(e);
      }
    }

    window.addEventListener('storage', fetchListings);
    window.addEventListener('goa_vendor_update', fetchListings);
    const timer = setInterval(fetchListings, 2000);

    return () => {
      window.removeEventListener('storage', fetchListings);
      window.removeEventListener('goa_vendor_update', fetchListings);
      clearInterval(timer);
    };
  }, []);

  const toggleStatus = (id: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Active' ? 'Seasonal Pause' : 'Active';
          toast.success(`Updated ${item.title} status to ${nextStatus}`);
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation) {
      toast.error('Please enter title and location');
      return;
    }

    const createdItem: VendorListing = {
      id: `v-${Date.now()}`,
      title: newTitle,
      type: newType,
      location: newLocation,
      activeBookings: 0,
      revenueThisMonth: 0,
      rating: 5.0,
      status: 'Pending Review'
    };

    const updatedListings = [createdItem, ...listings];
    setListings(updatedListings);
    localStorage.setItem('goa_vendor_listings', JSON.stringify(updatedListings));
    window.dispatchEvent(new Event('goa_vendor_update'));

    toast.success(`Submitted "${newTitle}"! Pending Admin Verification before going live on website.`);
    setNewTitle('');
    setNewLocation('');
    setIsAddModalOpen(false);
  };

  const totalRevenue = listings.reduce((sum, item) => sum + item.revenueThisMonth, 0);
  const totalBookings = listings.reduce((sum, item) => sum + item.activeBookings, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar for Portal Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={state.isAdmin ? "/admin/dashboard" : "/"}
            className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{state.isAdmin ? "Back to Admin Dashboard" : "Back to Website"}</span>
          </Link>

          <div className="flex items-center space-x-3">
            {vendorSession && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                Partner: {vendorSession.businessName} ({vendorSession.businessCategory})
              </span>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('vendor_active_session');
                signOut();
                navigate('/');
              }}
              className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold bg-rose-50 dark:bg-rose-950 px-3 py-1.5 rounded-xl"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full w-fit mb-3">
              <UserCheck className="w-4 h-4" />
              <span>Verified Partner Portal</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Shack & Vendor Management Portal 🏪
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage your beach shacks, dining menus, vehicle rentals, water sports slots, and revenue payouts.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition self-start md:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>+ Add Shack / Service Listing</span>
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Monthly Revenue</span>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-600 font-bold block mt-1">+18.4% from last month</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Guest Bookings</span>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-2xl">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalBookings} Reserved Slots
            </span>
            <span className="text-xs text-blue-600 font-bold block mt-1">94% occupancy rate</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Partner Rating</span>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              4.85 / 5.0 ⭐
            </span>
            <span className="text-xs text-amber-600 font-bold block mt-1">Based on 320 verified reviews</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'listings'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            My Active Shacks & Services ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'bookings'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Incoming Reservations
          </button>
        </div>

        {/* Listings List */}
        {activeTab === 'listings' ? (
          <div className="space-y-4">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-300">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                      {item.type} • {item.location}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Bookings: <strong>{item.activeBookings} active</strong></span>
                      <span>Revenue: <strong>₹{item.revenueThisMonth.toLocaleString('en-IN')}</strong></span>
                      <span>Rating: <strong>⭐ {item.rating}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-xl ${
                        item.status === 'Active'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : item.status === 'Pending Review'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.status === 'Pending Review' ? '⏳ Pending Admin Approval' : item.status}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleStatus(item.id)}
                    className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  >
                    {item.status === 'Active' ? (
                      <ToggleRight className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
            <Clock className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Booking Dispatch Active</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
              All incoming tourist bookings are auto-matched and dispatched via SMS & WhatsApp to registered Goan partner numbers.
            </p>
          </div>
        )}

        {/* Add Listing Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Add New Shack or Business Listing
              </h3>

              <form onSubmit={handleAddListing} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Listing Name / Shack Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Souza Lobo Shack / Baga Parasailing"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="Beach Shack">Beach Shack</option>
                    <option value="Scooter & Car Rental">Scooter & Car Rental</option>
                    <option value="Water Sports Operator">Water Sports Operator</option>
                    <option value="Artisan Workshop">Artisan Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Location in Goa *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Calangute Beach / Candolim"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-lg transition text-sm mt-2"
                >
                  Publish Listing to Sushegaad GOA
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VendorPortal;
