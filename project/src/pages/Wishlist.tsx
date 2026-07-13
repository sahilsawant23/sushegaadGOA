import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Clock, Users, Trash2, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const Wishlist: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tours');
  const { getWishlistByType, removeFromWishlist } = useWishlist();

  const handleRemoveFromWishlist = (type: string, id: string) => {
    removeFromWishlist(id, type as any);
  };

  const shareItem = (item: any) => {
    if (navigator.share) {
      navigator.share({
        title: item.title || item.name,
        text: item.description,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast.success('Link copied to clipboard');
    }
  };

  const getItemsForActiveTab = () => {
    if (activeTab === 'tours') return getWishlistByType('tour');
    if (activeTab === 'beaches') return getWishlistByType('beach');
    if (activeTab === 'nightlife') return getWishlistByType('nightlife');
    if (activeTab === 'places') {
      return [
        ...getWishlistByType('hotel'),
        ...getWishlistByType('restaurant'),
        ...getWishlistByType('cafe'),
        ...getWishlistByType('club')
      ];
    }
    return [];
  };

  const getItemsForActiveTabCount = (tabId: string) => {
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

  const tabs = [
    { id: 'tours', name: 'Tours', count: getItemsForActiveTabCount('tours') },
    { id: 'beaches', name: 'Beaches', count: getItemsForActiveTabCount('beaches') },
    { id: 'nightlife', name: 'Nightlife', count: getItemsForActiveTabCount('nightlife') },
    { id: 'places', name: 'Hotels & Dining', count: getItemsForActiveTabCount('places') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400">Save your favorite tours, beaches, and nightlife spots</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tours Tab */}
        {activeTab === 'tours' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getWishlistByType('tour').map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => shareItem(tour)}
                      className="p-2 bg-white dark:bg-gray-700 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist('tours', tour.id)}
                      className="p-2 bg-white dark:bg-gray-700 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tour.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{tour.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{tour.rating}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({tour.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Max {tour.maxGroupSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{tour.price.toLocaleString()}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">per person</span>
                    </div>
                    <Link
                      to={`/tours/${tour.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Beaches Tab */}
        {activeTab === 'beaches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getWishlistByType('beach').map((beach, index) => (
              <motion.div
                key={beach.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={beach.image}
                    alt={beach.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => shareItem(beach)}
                      className="p-2 bg-white dark:bg-gray-700 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist('beaches', beach.id)}
                      className="p-2 bg-white dark:bg-gray-700 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{beach.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{beach.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${beach.crowdLevel === 'Deserted' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        beach.crowdLevel === 'Peaceful' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                          beach.crowdLevel === 'Moderate' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                      {beach.crowdLevel}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{beach.distanceFromPanaji}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {beach.bestFor.slice(0, 2).join(', ')}
                    </div>
                    <Link
                      to={`/destinations/beach/${beach.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Nightlife Tab */}
        {activeTab === 'nightlife' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getWishlistByType('nightlife').map((venue, index) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => shareItem(venue)}
                      className="p-2 bg-white dark:bg-gray-700 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist('nightlife', venue.id)}
                      className="p-2 bg-white dark:bg-gray-700 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{venue.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{venue.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{venue.rating}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({venue.reviewCount})</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${venue.priceRange === 'Budget' ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' :
                        venue.priceRange === 'Mid-range' ? 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30' :
                          'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                      }`}>
                      {venue.priceRange}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {venue.musicGenre.slice(0, 2).join(', ')}
                    </div>
                    <Link
                      to={`/nightlife/${venue.id}`}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Hotels & Dining Tab */}
        {activeTab === 'places' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getItemsForActiveTab().map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-gray-150 dark:bg-gray-700">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                    {place.type}
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => shareItem(place)}
                      className="p-2 bg-white dark:bg-gray-750 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors shadow-md text-gray-700 dark:text-gray-200"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(place.type.toLowerCase().includes('hotel') ? 'hotel' : place.type.toLowerCase().includes('restaurant') ? 'restaurant' : place.type.toLowerCase().includes('cafe') ? 'cafe' : 'club', place.id)}
                      className="p-2 bg-white dark:bg-gray-750 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors shadow-md text-red-650"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{place.name}</h3>
                    <p className="text-gray-650 dark:text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">{place.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{place.rating}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">({place.reviewCount})</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[150px] truncate">{place.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{place.openingHours}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-gray-450 dark:hover:text-blue-400 transition-colors"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {getItemsForActiveTab().length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items in your wishlist</h3>
          <p className="text-gray-600 dark:text-gray-450 mb-6">Start exploring and save your favorite {activeTab === 'places' ? 'hotels & dining spots' : activeTab} to your wishlist</p>
          <Link
            to={activeTab === 'tours' ? '/tours' : activeTab === 'beaches' ? '/destinations' : activeTab === 'nightlife' ? '/nightlife' : '/places'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md shadow-blue-500/20"
          >
            Explore {activeTab === 'places' ? 'Hotels & Dining' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;