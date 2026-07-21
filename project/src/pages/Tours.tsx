import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Clock, Users, Filter, Search, SlidersHorizontal, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompare } from '../context/CompareContext';

const Tours: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCompare, items } = useCompare();

  const categories = ['all', 'Beach', 'Heritage', 'Adventure', 'Culture', 'Food', 'Art', 'Nature', 'Spiritual'];

  const [tours, setTours] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  // Sync state with URL params when they change (e.g. clicking footer links)
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch('http://localhost:5000/api/tours')
      .then(res => res.json())
      .then(data => {
        // Transform data to match component expectations
        const transformedTours = Array.isArray(data) ? data.map((tour: any) => ({
          ...tour,
          // Ensure images array exists for any legacy usage, but prefer image_url
          images: tour.image_url ? [tour.image_url] : (tour.images || []),
          // Map DB fields to component fields
          duration: tour.duration || `${tour.duration_hours || 0} hours`,
          maxGroupSize: tour.maxGroupSize || tour.max_participants,
          reviewCount: tour.reviewCount || tour.review_count || 0
        })) : [];
        setTours(transformedTours);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load tours', err);
        setLoading(false);
      });
  }, []);

  const filteredTours = useMemo(() => {
    if (!tours) return [];
    const filtered = tours.filter(tour => {
      const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tour.description && tour.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tour.destination_name && tour.destination_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
      const price = parseFloat(tour.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort tours
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'duration':
        filtered.sort((a, b) => (a.duration_hours || 0) - (b.duration_hours || 0));
        break;
      default:
        // Default sort (newest or popular)
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [tours, searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      {/* Header */}
      <div className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80"
            alt="Goa Tours"
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
              Explore Goa Tours
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover amazing tours and experiences across beautiful Goa
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours, destinations, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors duration-200">
            <div className="flex flex-col gap-6">
              {/* Category Filter - Scrollable Chips */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}

                  {/* Advanced Compare Button */}
                  <Link
                    to="/compare"
                    className={`ml-auto flex items-center space-x-2 px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${items.length > 0
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border border-transparent'
                      : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
                      }`}
                    onClick={(e) => items.length === 0 && e.preventDefault()}
                  >
                    <span>Compare</span>
                    {items.length > 0 && (
                      <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs">
                        {items.length}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                {/* Price Range */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Price Range</h3>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      ₹0 - ₹{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sort By</h3>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    {[
                      { value: 'popular', label: 'Popular' },
                      { value: 'price-low', label: 'Price: Low' },
                      { value: 'price-high', label: 'Price: High' },
                      { value: 'duration', label: 'Duration' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${sortBy === option.value
                          ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredTours.length} of {tours.length} tours
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full"
            >
              <div className="relative overflow-hidden h-64 shrink-0">
                <img
                  src={tour.image_url || (tour.images && tour.images[0]) || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {tour.category}
                </div>
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 px-2 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{tour.difficulty}</span>
                </div>

                {/* Add to Compare Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCompare({
                      id: tour.id,
                      name: tour.title,
                      image: tour.image_url || (tour.images && tour.images[0]) || '',
                      category: 'tour',
                      price: parseFloat(tour.price),
                      rating: tour.rating,
                      location: tour.destination_name || 'Goa',
                      duration: tour.duration
                    });
                  }}
                  className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  title="Add to Compare"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tour.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{tour.description}</p>

                <div className="flex items-center justify-between mb-4 mt-auto">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tour.rating}</span>
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

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
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

        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;