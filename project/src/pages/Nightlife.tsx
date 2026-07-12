import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Filter, Search, Heart, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { goaNightlife } from '../data/nightlifeData';

const Nightlife: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState<'all' | 'North Goa' | 'South Goa'>('all');
    const [selectedType, setSelectedType] = useState<'all' | 'Nightclub' | 'Beach Shack' | 'Bar' | 'Casino' | 'Restaurant & Bar'>('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState<'all' | 'Budget' | 'Mid-range' | 'Luxury'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const toggleWishlist = (e: React.MouseEvent, venue: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist(String(venue.id), 'nightlife')) {
            removeFromWishlist(String(venue.id), 'nightlife');
        } else {
            addToWishlist(venue, 'nightlife');
        }
    };

    const filteredVenues = goaNightlife.filter(venue => {
        const matchesRegion = selectedRegion === 'all' || venue.region === selectedRegion;
        const matchesType = selectedType === 'all' || venue.type === selectedType;
        const matchesPriceRange = selectedPriceRange === 'all' || venue.priceRange === selectedPriceRange;
        const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.location.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesRegion && matchesType && matchesPriceRange && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Hero Section */}
            <div className="relative py-20 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1600&q=80"
                        alt="Goa Nightlife"
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
                            Goa Nightlife
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Experience the vibrant nightlife of Goa - from legendary beach shacks to upscale nightclubs and floating casinos
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-12 transition-colors duration-200">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search nightlife..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-colors duration-200"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col gap-4 items-end">
                            <div className="flex flex-wrap gap-4 items-center justify-end">
                                {/* Region Filter */}
                                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors duration-200">
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

                                {/* Price Filter */}
                                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors duration-200">
                                    {['all', 'Budget', 'Mid-range', 'Luxury'].map((price) => (
                                        <button
                                            key={price}
                                            onClick={() => setSelectedPriceRange(price as any)}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedPriceRange === price
                                                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {price === 'all' ? 'All Prices' : price}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type Filter (Chips) */}
                            <div className="flex flex-wrap gap-2 justify-end">
                                {['all', 'Nightclub', 'Beach Shack', 'Bar', 'Casino', 'Restaurant & Bar'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type as any)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedType === type
                                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                    >
                                        {type === 'all' ? 'All Types' : type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedRegion === 'all' ? 'All Venues' : `${selectedRegion} Venues`}
                        <span className="text-gray-500 dark:text-gray-400 text-lg font-normal ml-2">({filteredVenues.length})</span>
                    </h2>
                </div>

                {/* Venues Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVenues.map((venue, index) => {
                        const isWishlisted = isInWishlist(String(venue.id), 'nightlife');

                        return (
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
                                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {venue.type}
                                    </div>
                                    <button
                                        onClick={(e) => toggleWishlist(e, venue)}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-110 transition-transform z-10"
                                    >
                                        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-300'}`} />
                                    </button>
                                    <div className="absolute top-16 right-4 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full backdrop-blur-sm">
                                        <span className={`text-xs font-semibold ${venue.priceRange === 'Budget' ? 'text-green-600 dark:text-green-400' :
                                            venue.priceRange === 'Mid-range' ? 'text-orange-600 dark:text-orange-400' :
                                                'text-purple-600 dark:text-purple-400'
                                            }`}>
                                            {venue.priceRange}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{venue.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{venue.description}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">{venue.region}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{venue.rating}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 mb-4">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">{venue.openingHours}</span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1">
                                            {venue.musicGenre.slice(0, 2).map((genre: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2 py-1 rounded"
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/nightlife/${venue.id}`}
                                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredVenues.length === 0 && (
                    <div className="text-center py-12">
                        <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No venues found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Nightlife;
