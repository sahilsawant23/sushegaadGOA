import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Booking: React.FC = () => {
  const { tourId: id } = useParams<{ tourId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  // useAuth provides context if needed, but not using state here directly anymore

  // State handles both booking data and tour details
  const bookingData = location.state || {};
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get initial guests from location.state
  const getInitialGuests = React.useMemo(() => {
    const stateData = location.state || {};
    if (stateData.guests !== undefined && stateData.guests !== null) {
      const guestsValue = typeof stateData.guests === 'number' 
        ? stateData.guests 
        : parseInt(String(stateData.guests), 10);
      // Ensure it's a valid number >= 1
      if (!isNaN(guestsValue) && guestsValue >= 1) {
        return guestsValue;
      }
    }
    return 1;
  }, [location.state]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    date: bookingData.date || '',
    guests: getInitialGuests,
    specialRequests: '',
    contactInfo: {
      phone: '',
      emergencyContact: '',
      dietaryRestrictions: ''
    },
    paymentInfo: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    }
  });

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);

    if (id.startsWith('osm-')) {
      fetch(`http://localhost:5000/api/realtime/places/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Place not found');
          return res.json();
        })
        .then(data => {
          const transformed = {
            id: data.id,
            title: data.name,
            price: data.priceRange === 'Budget' ? 500 : data.priceRange === 'Mid-range' ? 1500 : 4000,
            images: [data.image],
            maxGroupSize: 15,
            isPlace: true,
            placeType: data.type
          };
          setTour(transformed);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          toast.error("Could not load reservation details");
          setLoading(false);
        });
      return;
    }

    fetch(`http://localhost:5000/api/tours/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Tour not found');
        return res.json();
      })
      .then(data => {
        const transformed = {
          ...data,
          images: data.image_url ? [data.image_url] : (data.images || []),
          maxGroupSize: data.maxGroupSize || data.max_participants || 10
        };
        setTour(transformed);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Could not load tour details");
        setLoading(false);
      });
  }, [id]);

  // Update formData when location.state is available or changes
  React.useEffect(() => {
    const stateData = location.state || {};
    if (stateData.guests !== undefined && stateData.guests !== null) {
      const guestsValue = typeof stateData.guests === 'number' 
        ? stateData.guests 
        : parseInt(String(stateData.guests), 10);
      if (!isNaN(guestsValue) && guestsValue >= 1) {
        setFormData(prev => {
          // Only update if different to avoid unnecessary re-renders
          if (prev.guests !== guestsValue) {
            return { ...prev, guests: guestsValue };
          }
          return prev;
        });
      }
    }
    if (stateData.date) {
      setFormData(prev => {
        // Only update if different to avoid unnecessary re-renders
        if (prev.date !== stateData.date) {
          return { ...prev, date: stateData.date };
        }
        return prev;
      });
    }
  }, [location.state]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour not found</h2>
          <button
            onClick={() => navigate('/tours')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = tour.price * formData.guests;
  const steps = ['Details', 'Contact Info', 'Payment', 'Confirmation'];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate date before submitting
      if (!formData.date) {
        toast.error(tour.isPlace ? 'Please select a reservation date' : 'Please select a tour date');
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error(tour.isPlace ? 'Cannot book reservations for past dates. Please select a future date.' : 'Cannot book tours for past dates. Please select a future date.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to complete booking');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tourId: tour.id,
          bookingDate: formData.date,
          // If guests is undefined locally, default to 1.
          guests: formData.guests || 1,
          totalPrice: totalPrice
        })
      });

      if (response.ok) {
        toast.success('Booking confirmed! You will receive a confirmation email shortly.');
        navigate('/bookings'); // Redirect to My Bookings, not Dashboard, so they see it.
      } else {
        const err = await response.json();
        toast.error(err.message || 'Booking failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Booking failed. Please try again.');
    }
  };

  const handleInputChange = (section: string, field: string, value: string | number) => {
    if (section === 'root') {
      setFormData({ ...formData, [field]: value });
    } else {
      setFormData({
        ...formData,
        [section]: { ...formData[section as keyof typeof formData], [field]: value }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => {
              if (tour.isPlace) {
                navigate(`/destination/place/${id}`);
              } else {
                navigate(`/tours/${id}`);
              }
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{tour.isPlace ? 'Back to Details' : 'Back to Tour Details'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${index + 1 <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Step {currentStep}: {steps[currentStep - 1]}
              </h2>

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tour.isPlace ? 'Reservation Date' : 'Tour Date'}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const selected = new Date(selectedDate);
                          selected.setHours(0, 0, 0, 0);
                          
                          if (selected < today) {
                            toast.error('Cannot book tours for past dates. Please select a future date.');
                            return;
                          }
                          handleInputChange('root', 'date', selectedDate);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Please select a future date</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        key={`guests-select-${formData.guests}`}
                        value={formData.guests}
                        onChange={(e) => handleInputChange('root', 'guests', parseInt(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {tour && tour.maxGroupSize ? (
                          [...Array(tour.maxGroupSize)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))
                        ) : (
                          <option value={formData.guests}>
                            {formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}
                          </option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('root', 'specialRequests', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      value={formData.contactInfo.emergencyContact}
                      onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Emergency contact number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Restrictions (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.contactInfo.dietaryRestrictions}
                      onChange={(e) => handleInputChange('contactInfo', 'dietaryRestrictions', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Vegetarian, vegan, allergies, etc."
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Lock className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">Your payment information is secure and encrypted</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={formData.paymentInfo.cardholderName}
                      onChange={(e) => handleInputChange('paymentInfo', 'cardholderName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.paymentInfo.cardNumber}
                        onChange={(e) => handleInputChange('paymentInfo', 'cardNumber', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={formData.paymentInfo.expiryDate}
                        onChange={(e) => handleInputChange('paymentInfo', 'expiryDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={formData.paymentInfo.cvv}
                        onChange={(e) => handleInputChange('paymentInfo', 'cvv', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for booking with us. You will receive a confirmation email with your tour details.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {currentStep === 3 ? (
                    <button
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Complete Booking
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg sticky top-32"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

              <div className="space-y-4">
                <div>
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">{tour.title}</h4>
                  <p className="text-sm text-gray-600">{tour.location}</p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formData.date || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">{formData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person:</span>
                    <span className="font-medium">₹{tour.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;