import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Heart, MapPin, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface DashboardItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  link: string;
  color: string;
}

interface RecentActivityItem {
  id: string;
  type: 'booking' | 'wishlist' | 'review';
  title: string;
  date: Date;
  dateLabel: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const { state: wishlistState } = useWishlist();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);


  // Redirect admin to admin dashboard
  useEffect(() => {
    if (state.user && state.isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [state.user, state.isAdmin, navigate]);

  // Fetch bookings logic
  useEffect(() => {
    const fetchActivities = async () => {
      let bookings: any[] = [];
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await fetch('http://localhost:5000/api/bookings', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            bookings = data;
          }
        }
      } catch (error) {
        console.error('Failed to fetch bookings for activity', error);
      }

      // Process Bookings
      const bookingActivities: RecentActivityItem[] = bookings.map((b: any) => ({
        id: `booking-${b.id}`,
        type: 'booking',
        title: `Booked ${b.tour_title}`,
        date: new Date(b.created_at || b.booking_date),
        dateLabel: '', // Will calculate below
        icon: Calendar,
      }));

      // Process Wishlist
      const wishlistActivities: RecentActivityItem[] = wishlistState.items.map((item) => ({
        id: `wishlist-${item.id}`,
        type: 'wishlist',
        title: `Added ${item.data.title || item.data.name} to wishlist`,
        date: new Date(item.addedAt),
        dateLabel: '',
        icon: Heart,
      }));

      // Merge and Sort
      const allActivities = [...bookingActivities, ...wishlistActivities].sort((a, b) => b.date.getTime() - a.date.getTime());

      // Format Date Label (Time Ago)
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

      setActivities(formattedActivities.slice(0, 5)); // Top 5

    };

    fetchActivities();
  }, [wishlistState.items]); // Re-run when wishlist changes

  const dashboardItems: DashboardItem[] = [
    {
      icon: Calendar,
      title: 'My Bookings',
      description: 'View and manage your tour bookings',
      link: '/bookings',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Heart,
      title: 'Wishlist',
      description: 'Tours you want to book later',
      link: '/wishlist',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: User,
      title: 'Profile',
      description: 'Update your personal information',
      link: '/profile',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Manage your account settings',
      link: '/settings',
      color: 'bg-gray-100 text-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {state.profile?.full_name || state.user?.email || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your bookings, discover new tours, and plan your next adventure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              {dashboardItems.map((item) => (
                <Link
                  key={item.title} // better unique key than index
                  to={item.link}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Link>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/tours"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors text-center"
                >
                  <MapPin className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium">Browse Tours</span>
                </Link>
                <Link
                  to="/destinations"
                  className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition-colors text-center"
                >
                  <MapPin className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium">Explore Destinations</span>
                </Link>
                <Link
                  to="/contact"
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors text-center"
                >
                  <Settings className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium">Contact Support</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg mb-6"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{state.profile?.full_name || state.user?.email || 'User'}</h3>
                <p className="text-gray-600 mb-4">{state.user?.email ?? 'No email provided'}</p>
                <Link
                  to="/profile"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <activity.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.dateLabel}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

