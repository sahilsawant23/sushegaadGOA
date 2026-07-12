import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, MapPin, Calendar, Heart, ArrowLeft, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ShareButton from '../components/common/ShareButton';

const TourDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/tours/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Tour not found');
        return res.json();
      })
      .then(async data => {
        // Fetch reviews
        let reviews = [];
        let avgRating = 0;
        let reviewCount = 0;
        try {
          const reviewRes = await fetch(`http://localhost:5000/api/reviews/${id}`);
          if (reviewRes.ok) {
            const reviewData = await reviewRes.json();
            if (Array.isArray(reviewData)) {
              reviews = reviewData;
              reviewCount = reviewData.length;
              if (reviewCount > 0) {
                const total = reviewData.reduce((acc: number, r: any) => acc + r.rating, 0);
                avgRating = total / reviewCount;
              }
            } else if (reviewData.reviews) {
              // Fallback for object format
              reviews = reviewData.reviews;
              avgRating = reviewData.average || 0;
              reviewCount = reviewData.count || 0;
            }
          }
        } catch (e) { console.error('Error fetching reviews:', e); }

        // Transform API data to match component structure
        const transformed = {
          ...data,
          images: data.image_url ? [data.image_url] : (data.images || []),
          highlights: data.highlights || ['Beautiful scenery', 'Verified guide', 'Lunch included', 'Transport support'],
          included: data.included || ['Guide', 'Entry fees', 'Water'],
          excluded: data.excluded || ['Personal expenses', 'Tips'],
          itinerary: data.itinerary || [
            { day: 1, title: 'Experience Day', description: data.description, activities: ['Sightseeing', 'Activity session'], meals: ['Lunch'] }
          ],
          duration: data.duration || `${data.duration_hours || 0} hours`,
          maxGroupSize: data.maxGroupSize || data.max_participants || 10,
          reviewCount: reviewCount || data.reviewCount || 0,
          rating: avgRating || data.rating || 0,
          reviews: reviews
        };
        setTour(transformed);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

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

  const handleBookNow = () => {
    if (!state.isAuthenticated) {
      navigate('/login', { state: { returnTo: `/tours/${id}` } });
      return;
    }
    navigate(`/booking/${id}`, {
      state: {
        date: selectedDate,
        guests: guests,
        totalPrice: tour.price * guests
      }
    });
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'itinerary', name: 'Itinerary' },
    { id: 'includes', name: 'What\'s Included' },
    { id: 'reviews', name: 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white sticky top-16 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/tours')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tours</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="relative rounded-xl overflow-hidden mb-4">
                <img
                  src={tour.images[selectedImageIndex]}
                  alt={tour.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {tour.category}
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2 rounded-full ${isWishlisted ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600'} hover:bg-opacity-80 transition-colors`}
                  >
                    <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <ShareButton
                    title={tour.title}
                    text={`Check out this tour: ${tour.title} in Goa!`}
                    url={window.location.href}
                  />
                </div>
              </div>

              {tour.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {tour.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden ${selectedImageIndex === index ? 'ring-2 ring-blue-600' : ''}`}
                    >
                      <img
                        src={image}
                        alt={`${tour.title} ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Tour Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{tour.rating}</span>
                      <span>({tour.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">₹{tour.price.toLocaleString()}</div>
                  <div className="text-gray-500">per person</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-semibold">Duration</div>
                    <div className="text-gray-600">{tour.duration}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-semibold">Group Size</div>
                    <div className="text-gray-600">Max {tour.maxGroupSize}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Star className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-semibold">Difficulty</div>
                    <div className="text-gray-600">{tour.difficulty || 'Moderate'}</div>
                  </div>
                </div>
              </div>

              {/* Verified Host Section */}
              {tour.guide_name && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {tour.guide_image ? (
                      <img src={tour.guide_image} alt={tour.guide_name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                        {tour.guide_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-900">Hosted by {tour.guide_name}</h3>
                        {tour.guide_verified ? (
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center space-x-1" title="Government Verified Local">
                            <Check className="w-3 h-3" />
                            <span>Verified Local</span>
                          </span>
                        ) : (
                          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">Unverified</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Local Expert & Guide</p>
                    </div>
                  </div>

                  {tour.whatsapp_number && (
                    <a
                      href={`https://wa.me/${tour.whatsapp_number}?text=Hi, I am interested in your tour: ${tour.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                      <span>Direct Chat</span>
                    </a>
                  )}
                </div>
              )}

              {/* Tabs */}
              <div className="border-b mb-6">
                <nav className="flex space-x-8">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-6">{tour.description}</p>
                    <h3 className="text-xl font-bold mb-4">Highlights</h3>
                    <ul className="space-y-2">
                      {tour.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-600" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    {tour.itinerary.map((day: { day: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; activities: any[]; meals: any[]; }, index: React.Key | null | undefined) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-2">Day {day.day}: {day.title}</h3>
                        <p className="text-gray-700 mb-4">{day.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Activities</h4>
                            <ul className="space-y-1">
                              {day.activities.map((activity, idx) => (
                                <li key={idx} className="text-gray-600">• {activity}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Meals</h4>
                            <ul className="space-y-1">
                              {day.meals.map((meal, idx) => (
                                <li key={idx} className="text-gray-600">• {meal}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'includes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-green-600">What's Included</h3>
                      <ul className="space-y-2">
                        {tour.included.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                          <li key={index} className="flex items-center space-x-3">
                            <Check className="h-5 w-5 text-green-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-red-600">What's Not Included</h3>
                      <ul className="space-y-2">
                        {tour.excluded.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                          <li key={index} className="flex items-center space-x-3">
                            <X className="h-5 w-5 text-red-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="text-center mb-8">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{tour.rating?.toFixed(1) || '0.0'}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < Math.round(tour.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <div className="text-gray-600">Based on {tour.reviewCount} reviews</div>
                    </div>

                    <div className="space-y-6">
                      {tour.reviews && tour.reviews.length > 0 ? (
                        tour.reviews.map((review: any) => (
                          <div key={review.id} className="bg-white border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                                  {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <div className="font-semibold">{review.user_name || 'Anonymous'}</div>
                                  <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">No reviews yet. Be the first to rate this tour!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg sticky top-32"
            >
              <h3 className="text-xl font-bold mb-6">Book This Tour</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[...Array(tour.maxGroupSize)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span>₹{tour.price.toLocaleString()} × {guests} guests</span>
                  <span>₹{(tour.price * guests).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>₹{(tour.price * guests).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={!selectedDate}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
              >
                {state.isAuthenticated ? 'Book Now' : 'Login to Book'}
              </button>

              <div className="mt-4 text-center text-sm text-gray-600">
                Free cancellation up to 24 hours before the tour
              </div>
            </motion.div>
          </div>
        </div >
      </div >
    </div >
  );
};

export default TourDetails;