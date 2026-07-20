import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Filter, Search, Heart } from 'lucide-react';
import { goaBeaches, getBeachesByRegion } from '../data/beachesData';
import { getWaterfallsByRegion } from '../data/waterfallData';
import { getTemplesByRegion } from '../data/templeData';
import { useWishlist } from '../context/WishlistContext'; // Import Wishlist Context
import TempleList from './TempleList';
import ChurchList from './ChurchesList';
import WaterfallList from './WaterfallList';
import AuthenticList from './AuthenticList';
import CultureList from './CultureList';

const Destinations: React.FC = () => {
  const { region } = useParams<{ region?: string }>();
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'South Goa' | 'North Goa'>('all');
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState<'all' | 'Deserted' | 'Peaceful' | 'Moderate' | 'Crowded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'beaches' | 'temples' | 'churches' | 'waterfalls' | 'authentic' | 'culture'>('beaches');

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (region) {
      const regionMap: Record<string, 'North Goa' | 'South Goa'> = {
        'north-goa': 'North Goa',
        'south-goa': 'South Goa',
      };

      if (regionMap[region]) {
        setSelectedRegion(regionMap[region]);
      }
    } else {
      setSelectedRegion('all');
    }
  }, [region]);

  const [realtimeBeaches, setRealtimeBeaches] = useState<any[]>(goaBeaches);

  useEffect(() => {
    let isMounted = true;
    fetch('http://localhost:5000/api/realtime/places')
      .then(res => res.ok ? res.json() : [])
      .then((data: any[]) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const apiBeaches = data.filter((item: any) => 
            item.type === 'Beach' || item.type === 'Beach Shack' || item.name.toLowerCase().includes('beach')
          );
          if (apiBeaches.length > 0) {
            setRealtimeBeaches(prev => {
              // Merge API beaches into list without duplicating IDs
              const existingIds = new Set(prev.map(p => String(p.id)));
              const newItems = apiBeaches.filter(b => !existingIds.has(String(b.id)));
              return [...prev, ...newItems];
            });
          }
        }
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, []);

  const toggleWishlist = (e: React.MouseEvent, beach: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(String(beach.id), 'beach')) {
      removeFromWishlist(String(beach.id), 'beach');
    } else {
      addToWishlist(beach, 'beach'); // Ensure 'beach' type matches backend enum/context handling
    }
  };

  const filteredBeaches = realtimeBeaches.filter(beach => {

    const matchesRegion = selectedRegion === 'all' || beach.region === selectedRegion;
    const matchesCrowd = selectedCrowdLevel === 'all' || (beach.crowdLevel && beach.crowdLevel === selectedCrowdLevel);
    const matchesSearch = (beach.name && beach.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (beach.description && beach.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (beach.highlights && beach.highlights.some((h: string) => h.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesRegion && matchesCrowd && matchesSearch;
  });

  const regions = [

    {
      name: 'North Goa',
      description: 'Famous beaches, vibrant nightlife, and bustling markets',
      image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
      beachCount: getBeachesByRegion('North Goa').length,
      highlights: ['Baga Beach', 'Calangute', 'Anjuna Flea Market', 'Chapora Fort']
    },
    {
      name: 'South Goa',
      description: 'Peaceful beaches, luxury resorts, and pristine coastline',
      image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg',
      beachCount: getBeachesByRegion('South Goa').length,
      highlights: ['Palolem Beach', 'Agonda', 'Butterfly Beach', 'Cabo de Rama']
    }
  ];

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      {/* Hero Section */}
      <div className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1581337204873-ef36aa186caa?w=1600&q=80"
            alt="Goa Destinations"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg font-serif">
              {viewMode === 'beaches' ? "Discover Goa's Beaches" :
                viewMode === 'temples' ? "Sacred Temples of Goa" :
                  viewMode === 'churches' ? "Historic Churches of Goa" :
                    viewMode === 'waterfalls' ? "Spectacular Waterfalls of Goa" :
                      viewMode === 'culture' ? "Goa's Rich Culture" :
                        "Authentic Goa Experiences"}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore the stunning coastline, sacred sites, and rich heritage of India's sunshine state.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* View Mode Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'beaches', label: 'Beaches', icon: MapPin },
            { id: 'temples', label: 'Temples', icon: MapPin },
            { id: 'churches', label: 'Churches', icon: MapPin },
            { id: 'waterfalls', label: 'Waterfalls', icon: MapPin },
            { id: 'authentic', label: 'Authentic', icon: MapPin },
            { id: 'culture', label: 'Culture', icon: MapPin }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${viewMode === mode.id
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 shadow-md'
                }`}
            >
              <mode.icon className="h-4 w-4" />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {viewMode === 'beaches' ? (
          <>
            {/* Region Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explore by Region</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regions.map((region) => (
                  <motion.div
                    key={region.name}
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl overflow-hidden cursor-pointer shadow-lg group"
                    onClick={() => setSelectedRegion(region.name as any)}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <img
                      src={region.image}
                      alt={region.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{region.name}</h3>
                      <p className="mb-2 text-gray-200">{region.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          {region.beachCount} Beaches
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-12 transition-colors duration-200">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                {/* Search */}
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search beaches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    {['all', 'North Goa', 'South Goa'].map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region as any)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedRegion === region
                          ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                          }`}
                      >
                        {region === 'all' ? 'All Regions' : region}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {['all', 'Deserted', 'Peaceful', 'Moderate', 'Crowded'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedCrowdLevel(level as any)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedCrowdLevel === level
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                      >
                        {level === 'all' ? 'All Crowds' : level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedRegion === 'all' ? 'All Beaches' : `${selectedRegion} Beaches`}
                <span className="text-gray-500 dark:text-gray-400 text-lg font-normal ml-2">({filteredBeaches.length})</span>
              </h2>
            </div>
            {/* Beaches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBeaches.map((beach, index) => {
                const isWishlisted = isInWishlist(String(beach.id), 'beach');
                return (
                  <motion.div
                    key={String(beach.id)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={beach.image}
                        alt={beach.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {beach.region}
                      </div>

                      {/* Like Button */}
                      <button
                        onClick={(e) => toggleWishlist(e, beach)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-110 transition-transform z-10"
                      >
                        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-300'}`} />
                      </button>

                      <div className="absolute top-16 right-4 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 px-2 py-1 rounded-full">
                        <span className={`text-xs font-semibold ${beach.crowdLevel === 'Deserted' ? 'text-green-600 dark:text-green-400' :
                          beach.crowdLevel === 'Peaceful' ? 'text-blue-600 dark:text-blue-400' :
                            beach.crowdLevel === 'Moderate' ? 'text-orange-600 dark:text-orange-400' :
                              'text-red-600 dark:text-red-400'
                          }`}>
                          {beach.crowdLevel}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{beach.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{beach.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">{beach.distanceFromPanaji}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">{beach.accessibility}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {beach.highlights.slice(0, 3).map((highlight, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                            >
                              {highlight}
                            </span>
                          ))}
                          {beach.highlights.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{beach.highlights.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Best for: {beach.bestFor.slice(0, 2).join(', ')}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <Link
                            to={`/destination/beach/${beach.id}`}
                            className="btn-primary !px-4 !py-2.5 !text-sm font-bold shadow-md hover:shadow-lg transition-all"
                          >
                            Explore ➔
                          </Link>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(beach.name + " beach Goa")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary !px-4 !py-2.5 !text-sm font-semibold border-2 hover:border-amber-500 transition-all"
                          >
                            📍 Map
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredBeaches.length === 0 && (
              <div className="text-center py-12">
                <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No beaches found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters</p>
              </div>
            )}

            {/* Beach Guide */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="bg-blue-600 text-white rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Complete Goa Beach Guide</h2>
                <p className="text-center mb-6 max-w-3xl mx-auto">
                  From the southernmost Polem Beach near Karnataka border to the northernmost Arambol Beach,
                  discover all {goaBeaches.length} beaches of Goa with detailed information about each destination.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2">{getBeachesByRegion('South Goa').length}</div>
                    <div>South Goa Beaches</div>
                    <div className="text-sm text-blue-200 mt-1">Peaceful & Pristine</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">{getBeachesByRegion('North Goa').length}</div>
                    <div>North Goa Beaches</div>
                    <div className="text-sm text-blue-200 mt-1">Vibrant & Lively</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">{goaBeaches.length}</div>
                    <div>Total Beaches</div>
                    <div className="text-sm text-blue-200 mt-1">Complete Coverage</div>
                  </div>
                </div>
              </div>
            </motion.section>
          </>
        ) : viewMode === 'temples' ? (
          <>
            {/* Region Overview for Temples */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explore by Region</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  onClick={() => setSelectedRegion('North Goa')}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1562981035-7c152a5cbe7e?w=800"
                      alt="North Goa Temples"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">North Goa</h3>
                      <p className="text-gray-200">{getTemplesByRegion('North Goa').length} Temples</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">Discover historic temples in North Goa, known for their unique architecture and vibrant festivals.</p>
                    <div className="flex flex-wrap gap-2">
                      {getTemplesByRegion('North Goa').slice(0, 3).map(t => (
                        <span key={t.id} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">{t.name}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  onClick={() => setSelectedRegion('South Goa')}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1544238556-9d32d732822a" // Placeholder, maybe reuse or find better
                      alt="South Goa Temples"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">South Goa</h3>
                      <p className="text-gray-200">{getTemplesByRegion('South Goa').length} Temples</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">Explore ancient spiritual centers in South Goa, surrounded by serene nature and tradition.</p>
                    <div className="flex flex-wrap gap-2">
                      {getTemplesByRegion('South Goa').slice(0, 3).map(t => (
                        <span key={t.id} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">{t.name}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
            <TempleList selectedRegion={selectedRegion} />
          </>
        ) : viewMode === 'churches' ? (
          <>
            {/* Region Overview for Churches */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explore by Region</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  onClick={() => setSelectedRegion('North Goa')}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
                      alt="North Goa Churches"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">North Goa</h3>
                      <p className="text-gray-200">Historic Basilicas & Chapels</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">Visit UNESCO World Heritage sites in Old Goa and iconic churches in Panaji and Bardez.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Basilica of Bom Jesus</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Se Cathedral</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  onClick={() => setSelectedRegion('South Goa')}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
                      alt="South Goa Churches"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">South Goa</h3>
                      <p className="text-gray-200">Village Churches & Sanctuaries</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">Discover serene village churches in Salcete with magnificent Baroque architecture.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Three Kings Chapel</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Holy Spirit Church</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
            <ChurchList selectedRegion={selectedRegion} />

          </>
        ) : viewMode === 'waterfalls' ? (
          <>
            {/* Region Overview for Waterfalls */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explore by Region</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  onClick={() => setSelectedRegion('North Goa')}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                      alt="North Goa"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">North Goa</h3>
                      <p className="text-gray-200">{getWaterfallsByRegion('North Goa').length} waterfalls to explore</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">Majestic waterfalls in North Goa with breathtaking views and serene surroundings.</p>
                    <div className="flex flex-wrap gap-2">
                      {getWaterfallsByRegion('North Goa').slice(0, 3).map(w => (
                        <span key={w.id} className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">{w.name}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  onClick={() => setSelectedRegion('South Goa')}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1544238556-9d32d732822a"
                      alt="South Goa"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">South Goa</h3>
                      <p className="text-gray-200">{getWaterfallsByRegion('South Goa').length} waterfalls to explore</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">Peaceful waterfalls in South Goa surrounded by lush greenery and tranquility.</p>
                    <div className="flex flex-wrap gap-2">
                      {getWaterfallsByRegion('South Goa').slice(0, 3).map(w => (
                        <span key={w.id} className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">{w.name}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
            <WaterfallList selectedRegion={selectedRegion} />

          </>
        ) : viewMode === 'culture' ? (
          <>
            {/* Region Overview for Culture */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Goa's Cultural Festivals</h2>
              <div className="grid grid-cols-1 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800"
                      alt="Cultural Festivals"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">Cultural Festivals</h3>
                      <p className="text-gray-200">Experience the vibrant festivals of Goa</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">From traditional celebrations like Goa Carnival and Shigmo to modern music festivals like Sunburn, discover the rich cultural heritage of Goa through its festivals and events.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Goa Carnival</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Shigmo</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Sunburn Festival</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
            <CultureList />
          </>
        ) : (
          <>
            {/* Region Overview for Authentic Experiences */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explore by Region</h2>
              <div className="grid grid-cols-1 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                      alt="Authentic Goa"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">Authentic Goa</h3>
                      <p className="text-gray-200">Unique cultural experiences to explore</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
            <AuthenticList />
          </>
        )}
      </div>
    </div>
  );
};

export default Destinations;
