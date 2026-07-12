import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Download, Phone, X, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Bookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<any | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Map backend format to frontend expectation
        const formatted = data.map((b: any) => ({
          id: `BK${b.id}`, // Format ID
          dbId: b.id, // Actual DB ID for API calls
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
          paymentId: 'PAID',
          guide: b.guide_id ? { name: b.guide_name, contact: b.guide_contact } : null
        }));
        setBookings(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingToCancel.dbId}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Booking cancelled successfully');
        // Update local state
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Auto-update status for past bookings to 'completed'
  const bookingsWithUpdatedStatus = bookings.map(booking => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);

    // If booking date has passed and status is not cancelled, mark as completed
    if (bookingDate < today && booking.status !== 'cancelled' && booking.status !== 'completed') {
      return { ...booking, status: 'completed' };
    }
    return booking;
  });

  const upcomingBookings = bookingsWithUpdatedStatus.filter(booking => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate >= today && booking.status !== 'cancelled';
  });

  const pastBookings = bookingsWithUpdatedStatus.filter(booking => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate < today && booking.status !== 'cancelled';
  });

  const cancelledBookings = bookingsWithUpdatedStatus.filter(booking => booking.status === 'cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-600';
      case 'assigned': return 'bg-purple-100 text-purple-600';
      case 'completed': return 'bg-blue-100 text-blue-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const tabs = [
    { id: 'upcoming', name: 'Upcoming', count: upcomingBookings.length },
    { id: 'past', name: 'Past', count: pastBookings.length },
    { id: 'cancelled', name: 'Cancelled', count: cancelledBookings.length }
  ];

  const getCurrentBookings = () => {
    switch (activeTab) {
      case 'upcoming': return upcomingBookings;
      case 'past': return pastBookings;
      case 'cancelled': return cancelledBookings;
      default: return [];
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Bookings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your upcoming trips and view past adventures</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <span>{tab.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Bookings List */}
        <div className="space-y-6">
          {getCurrentBookings().map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={booking.tour.images[0]}
                      alt={booking.tour.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.tour.title}</h3>
                      <p className="text-gray-600 mb-2">Booking ID: {booking.id}</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">₹{booking.totalPrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Amount</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Tour Date</div>
                      <div className="font-semibold">{booking.date.toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Guests</div>
                      <div className="font-semibold">{booking.guests} {booking.guests === 1 ? 'Person' : 'People'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-semibold">{booking.tour.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-semibold">{booking.tour.location}</div>
                    </div>
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Booked on {booking.bookingDate.toLocaleDateString()}
                  </div>
                  <div className="flex space-x-3">
                    {/* Only show cancel button for upcoming bookings */}
                    {activeTab === 'upcoming' && (booking.status === 'confirmed' || booking.status === 'assigned') && (
                      <>
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                          <Download className="h-4 w-4" />
                          <span>Voucher</span>
                        </button>

                        {/* Cancel Button - Only for upcoming bookings */}
                        <button
                          onClick={() => setBookingToCancel(booking)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel Tour</span>
                        </button>

                        {/* View Details Modal Trigger */}
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Info className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                      </>
                    )}

                    {/* Past bookings - no cancel button */}
                    {activeTab === 'past' && booking.status === 'completed' && (
                      <>
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                          <Download className="h-4 w-4" />
                          <span>Voucher</span>
                        </button>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Info className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                        <Link
                          to="/tours"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Book Again
                        </Link>
                      </>
                    )}

                    {booking.status === 'cancelled' && (
                      <span className="text-gray-400 text-sm italic">Booking Cancelled</span>
                    )}
                  </div>
                </div>

                {/* Guide Details Section */}
                {booking.guide && booking.status !== 'cancelled' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 bg-blue-50 -mx-6 -mb-6 p-4 px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Your Guide</div>
                        <div className="font-semibold text-gray-900">{booking.guide.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {booking.guide.contact && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{booking.guide.contact}</span>
                        </div>
                      )}
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Assigned</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {getCurrentBookings().length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {activeTab} bookings</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming tours. Start planning your next adventure!"
                : activeTab === 'past'
                  ? "You haven't completed any tours yet."
                  : "You don't have any cancelled bookings."
              }
            </p>
            <Link
              to="/tours"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Explore Tours
            </Link>
          </motion.div>
        )}
      </div>

      {/* Tour Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-48">
                <img
                  src={selectedBooking.tour.images[0]}
                  alt={selectedBooking.tour.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedBooking.tour.title}</h2>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {selectedBooking.tour.duration}</span>
                  <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {selectedBooking.tour.location}</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Tour Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedBooking.tour.description}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Booking Info</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Date:</div>
                    <div className="font-medium">{selectedBooking.date.toLocaleDateString()}</div>
                    <div className="text-gray-500">Guests:</div>
                    <div className="font-medium">{selectedBooking.guests}</div>
                    <div className="text-gray-500">Amount:</div>
                    <div className="font-medium text-blue-600">₹{selectedBooking.totalPrice}</div>
                    <div className="text-gray-500">Status:</div>
                    <div className="font-medium capitalize">{selectedBooking.status}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {bookingToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Cancel Tour?</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to cancel your booking for <strong>{bookingToCancel.tour.title}</strong>? This action cannot be undone.
              </p>

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setBookingToCancel(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full"
                >
                  No, Keep it
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors w-full"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Bookings;