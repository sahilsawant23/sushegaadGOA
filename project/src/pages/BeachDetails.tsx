import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Check } from 'lucide-react';
import { goaBeaches } from '../data/beachesData';
import ImageSlider from '../components/common/ImageSlider';
import WaterSafetyWidget from '../components/common/WaterSafetyWidget';

const BeachDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Robust fuzzy beach finder with instant fallback
    const rawId = id || '';
    const searchKey = rawId.toLowerCase().replace(/[^a-z0-9]/g, '');

    const foundBeach = goaBeaches.find(b => {
      const bId = String(b.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const bName = String(b.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return bId === searchKey || bName === searchKey || bId.includes(searchKey) || searchKey.includes(bId) || bName.includes(searchKey) || searchKey.includes(bName);
    });

    const formattedTitle = rawId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const defaultBeach = foundBeach || {
      id: rawId || 'baga',
      name: formattedTitle.toLowerCase().includes('beach') ? formattedTitle : `${formattedTitle} Beach`,
      region: 'North Goa',
      description: `Discover the sun-kissed sands, refreshing turquoise waves, and vibrant palm-lined shores of ${formattedTitle}. Perfect for relaxing by the beach shacks, indulging in authentic Goan seafood, and experiencing water adventures.`,
      highlights: ['Golden Sand Coastline', 'Beach Shacks & Dining', 'Sunset Viewpoint', 'Water Sports'],
      activities: ['Swimming', 'Sunset Walk', 'Beachside Dining', 'Photography'],
      crowdLevel: 'Moderate',
      bestFor: ['Families', 'Couples', 'Beach Lovers'],
      nearbyAttractions: ['Coastal Promenade', 'Local Flea Market', 'Water Sports Center'],
      facilities: ['Lifeguard Tower', 'Parking Area', 'Beach Shacks', 'Restrooms'],
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1200'
      ],
      distanceFromPanaji: '18 km',
      bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
      accessibility: 'Easy'
    };

    const [beach, setBeach] = useState<any>(defaultBeach);

    useEffect(() => {
      let isMounted = true;
      
      // Instantly sync beach state to current route target
      setBeach(foundBeach || defaultBeach);

      if (id) {
        // Fetch real-time place data from backend
        fetch(`http://localhost:5000/api/realtime/places/${id}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (isMounted && data) {
              setBeach((prev: any) => ({
                ...prev,
                name: data.name || prev.name,
                region: data.region || prev.region,
                description: data.description || prev.description,
                image: data.image || prev.image,
                images: data.image ? [data.image, ...(prev.images || [])] : prev.images,
                crowdLevel: data.type === 'Beach Shack' ? 'Crowded' : prev.crowdLevel
              }));
            }
          })
          .catch(() => {});
      }
      return () => { isMounted = false; };
    }, [id, searchKey]);

    const sliderImages = (beach.images && beach.images.length > 0)
      ? beach.images 
      : (beach.image ? [beach.image] : ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200']);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            {/* Back Button */}
            <div className="bg-white dark:bg-gray-800 sticky top-16 z-40 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/destinations')}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Destinations</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Image Slider */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <ImageSlider images={sliderImages} alt={beach.name || 'Beach'} />
                </motion.div>

                {/* Beach Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{beach.name}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-6 text-sm">
                        {beach.region && (
                          <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span>{beach.region}</span>
                          </div>
                        )}
                        {beach.crowdLevel && (
                          <div className="flex items-center space-x-1">
                              <Check className="h-4 w-4 text-emerald-500" />
                              <span>{beach.crowdLevel} Crowd</span>
                          </div>
                        )}
                    </div>

                    {beach.description && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-base sm:text-lg">{beach.description}</p>
                    )}

                    {/* Highlights */}
                    {beach.highlights && beach.highlights.length > 0 && (
                      <div className="mb-8">
                          <h2 className="text-xl font-bold mb-4">Highlights</h2>
                          <div className="flex flex-wrap gap-2">
                              {beach.highlights.map((highlight, index) => (
                                  <span
                                      key={index}
                                      className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                  >
                                      {highlight}
                                  </span>
                              ))}
                          </div>
                      </div>
                    )}

                    {/* Activities */}
                    {beach.activities && beach.activities.length > 0 && (
                      <div className="mb-8">
                          <h2 className="text-xl font-bold mb-4">Popular Activities</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {beach.activities.map((activity, index) => (
                                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                      <div className="h-2 w-2 bg-amber-500 rounded-full" />
                                      <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{activity}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                    )}

                    {/* Facilities */}
                    {beach.facilities && beach.facilities.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">Available Facilities</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                {beach.facilities.map((facility, index) => (
                                    <li key={index} className="flex items-center space-x-3">
                                        <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                        <span>{facility}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Best For */}
                    {beach.bestFor && beach.bestFor.length > 0 && (
                      <div className="mb-8">
                          <h2 className="text-xl font-bold mb-4">Best For</h2>
                          <div className="flex flex-wrap gap-3">
                              {beach.bestFor.map((item, index) => (
                                  <span key={index} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 text-sm">
                                      {item}
                                  </span>
                              ))}
                          </div>
                      </div>
                    )}

                    {/* Nearby Attractions */}
                    {beach.nearbyAttractions && beach.nearbyAttractions.length > 0 && (
                      <div className="mb-8">
                          <h2 className="text-xl font-bold mb-4">Nearby Attractions</h2>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              {beach.nearbyAttractions.map((place, index) => (
                                  <li key={index} className="flex items-center space-x-3">
                                      <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                      <span>{place}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                    )}

                    {/* Best Time to Visit */}
                    {beach.bestTimeToVisit && beach.bestTimeToVisit.length > 0 && (
                      <div className="mb-8">
                          <h2 className="text-xl font-bold mb-4">Best Time to Visit</h2>
                          <div className="flex flex-wrap gap-2">
                              {beach.bestTimeToVisit.map((month, index) => (
                                  <span key={index} className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg font-medium">
                                      {month}
                                  </span>
                              ))}
                          </div>
                      </div>
                    )}

                    {/* Live Water Safety & Tide Predictor */}
                    <div className="mb-8">
                        <WaterSafetyWidget beachId={beach.id} beachName={beach.name} region={beach.region} />
                    </div>

                    {/* Distance Info */}
                    <div className="bg-blue-50 dark:bg-gray-700/50 p-6 rounded-2xl flex items-center justify-between border border-blue-100 dark:border-gray-600">
                        <div>
                            <h3 className="text-base font-bold text-blue-950 dark:text-blue-300 mb-1">Distance from Panaji</h3>
                            <p className="text-blue-700 dark:text-blue-200 text-sm font-semibold">{beach.distanceFromPanaji || 'Approx 20 km'}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-base font-bold text-blue-950 dark:text-blue-300 mb-1">Accessibility</h3>
                            <p className="text-blue-700 dark:text-blue-200 text-sm font-semibold">{beach.accessibility || 'Easy Access'}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BeachDetails;
