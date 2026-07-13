import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Search, Heart, Star, Navigation, Coffee, Bed, UtensilsCrossed, PartyPopper, Coins } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface Place {
    id: string;
    name: string;
    type: string;
    location: string;
    region: 'North Goa' | 'South Goa';
    description: string;
    priceRange: 'Budget' | 'Mid-range' | 'Luxury';
    openingHours: string;
    image: string;
    rating: number;
    reviewCount: number;
    latitude: number;
    longitude: number;
    reviewsList?: { author: string; rating: number; comment: string; }[];
}

const RealtimeExplorer: React.FC = () => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'hotels' | 'restaurants' | 'cafes' | 'clubs' | 'casinos'>(
        window.location.pathname.includes('nightlife') ? 'clubs' : 'all'
    );
    const [selectedRegion, setSelectedRegion] = useState<'all' | 'North Goa' | 'South Goa'>('all');
    const [selectedPrice, setSelectedPrice] = useState<'all' | 'Budget' | 'Mid-range' | 'Luxury'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const fetchPlaces = async () => {
        setLoading(true);
        setError(null);
        try {
            // Call the newly created backend endpoint
            const url = `http://localhost:5000/api/realtime/places?category=${selectedCategory}&region=${selectedRegion}&search=${encodeURIComponent(searchQuery)}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch real-time places');
            }
            const data = await response.json();
            setPlaces(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred while loading places.');
        } finally {
            setLoading(false);
        }
    };

    // Refetch when filters that change backend queries are changed (Category)
    // For Region and Search, the backend also filters, but we can call fetchPlaces to get fresh data
    useEffect(() => {
        fetchPlaces();
    }, [selectedCategory, selectedRegion]);

    // Handle search input with debouncing or user-triggered search
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPlaces();
    };

    const mapToWishlistType = (type: string): 'hotel' | 'restaurant' | 'cafe' | 'club' => {
        const t = type.toLowerCase();
        if (t.includes('hotel') || t.includes('resort') || t.includes('hostel') || t.includes('guest')) return 'hotel';
        if (t.includes('restaurant') || t.includes('food')) return 'restaurant';
        if (t.includes('cafe')) return 'cafe';
        return 'club';
    };

    const toggleWishlist = async (e: React.MouseEvent, place: Place) => {
        e.preventDefault();
        e.stopPropagation();
        const wishlistType = mapToWishlistType(place.type);
        const inWish = isInWishlist(place.id, wishlistType);

        if (inWish) {
            await removeFromWishlist(place.id, wishlistType);
        } else {
            // We pass the full place details so the backend can cache it when wishlisted
            await addToWishlist(place, wishlistType);
        }
    };

    // Open/Closed Status Logic
    const checkIsOpen = (openingHours: string): boolean => {
        if (!openingHours) return true;
        const cleanHours = openingHours.toLowerCase();
        if (cleanHours.includes('24 hours') || cleanHours.includes('24/7') || cleanHours.includes('open 24')) return true;

        try {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTime = currentHour * 60 + currentMinute;

            const parts = cleanHours.split('-');
            if (parts.length !== 2) return true;

            const parseTime = (timeStr: string): number => {
                const time = timeStr.trim();
                const isPM = time.includes('pm');
                const isAM = time.includes('am');
                const numericPart = time.replace(/(am|pm)/g, '').trim();
                const [hStr, mStr] = numericPart.split(':');
                let hour = parseInt(hStr, 10);
                const minute = mStr ? parseInt(mStr, 10) : 0;

                if (isPM && hour < 12) hour += 12;
                if (isAM && hour === 12) hour = 0;

                return hour * 60 + minute;
            };

            const startTime = parseTime(parts[0]);
            const endTime = parseTime(parts[1]);

            if (endTime > startTime) {
                return currentTime >= startTime && currentTime <= endTime;
            } else {
                // Overnight hours
                return currentTime >= startTime || currentTime <= endTime;
            }
        } catch (e) {
            return true;
        }
    };

    // Client-side filtering for Price Range
    const filteredPlaces = places.filter(place => {
        const matchesPrice = selectedPrice === 'all' || place.priceRange === selectedPrice;
        // Search filter fallback (client-side in case they type without clicking search button)
        const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            place.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPrice && matchesSearch;
    });

    const categoryTabs = [
        { id: 'all', label: 'All Places', icon: <MapPin className="h-4 w-4" /> },
        { id: 'hotels', label: 'Hotels & Resorts', icon: <Bed className="h-4 w-4" /> },
        { id: 'restaurants', label: 'Restaurants', icon: <UtensilsCrossed className="h-4 w-4" /> },
        { id: 'cafes', label: 'Cafés', icon: <Coffee className="h-4 w-4" /> },
        { id: 'clubs', label: 'Clubs & Bars', icon: <PartyPopper className="h-4 w-4" /> },
        { id: 'casinos', label: 'Casinos', icon: <Coins className="h-4 w-4" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">            {/* Premium Hero Section */}
            <div className="relative py-24 bg-gray-950 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
                        alt="Goa Hotels & Dining"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-blue-500 font-semibold tracking-wider uppercase text-sm">
                            {window.location.pathname.includes('nightlife') ? 'Vibrant Night Scene' : 'Real-time Location Discovery'}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 mb-6 tracking-tight font-serif">
                            {window.location.pathname.includes('nightlife') ? 'Goa Nightlife & Clubs' : 'Hotels, Dining & Clubs'}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            {window.location.pathname.includes('nightlife')
                                ? 'Experience the vibrant nightlife of Goa - from legendary beach shacks to upscale nightclubs, bars, and floating casinos, updated live.'
                                : 'Discover real-time hotels, gourmet restaurants, charming cafés, and high-energy nightclubs across Goa powered by live updates.'}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Search & Filters Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-10 border border-gray-100 dark:border-gray-700 transition-all duration-200">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Search Input */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by name, cuisine, type or address..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 dark:bg-gray-750 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
                            />
                        </div>
                        {/* Search Button */}
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Search
                        </button>
                    </form>

                    {/* Filter Badges & Selectors */}
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                        {/* Category Selectors */}
                        <div className="flex flex-wrap gap-2">
                            {categoryTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedCategory(tab.id as any)}
                                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === tab.id
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                            : 'bg-gray-50 dark:bg-gray-700 text-gray-650 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Region & Price Filters */}
                        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                            {/* Region Filter */}
                            <div className="flex flex-col w-full sm:w-auto">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Region</label>
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value as any)}
                                    className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-semibold text-gray-750 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Regions</option>
                                    <option value="North Goa">North Goa</option>
                                    <option value="South Goa">South Goa</option>
                                </select>
                            </div>

                            {/* Price Filter */}
                            <div className="flex flex-col w-full sm:w-auto">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Budget Level</label>
                                <select
                                    value={selectedPrice}
                                    onChange={(e) => setSelectedPrice(e.target.value as any)}
                                    className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-semibold text-gray-750 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Budgets</option>
                                    <option value="Budget">Budget Friendly</option>
                                    <option value="Mid-range">Mid-range</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status States */}
                {loading ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Fetching real-time places in Goa...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-2xl p-6 text-center shadow-md">
                        <p className="font-bold text-lg mb-2">Error Loading Live Data</p>
                        <p className="mb-4 text-sm">{error}</p>
                        <button
                            onClick={fetchPlaces}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredPlaces.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-md">
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold mb-2">No places found</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Try refining your search terms or selecting a different category.</p>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSelectedRegion('all');
                                setSelectedPrice('all');
                                setSearchQuery('');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Results Count Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedCategory === 'all'
                                    ? 'Live Venues in Goa'
                                    : categoryTabs.find(t => t.id === selectedCategory)?.label}
                                <span className="text-gray-500 dark:text-gray-400 text-base font-normal ml-2">
                                    ({filteredPlaces.length} live results)
                                </span>
                            </h2>
                        </div>

                        {/* Places Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredPlaces.map((place, index) => {
                                    const wishlistType = mapToWishlistType(place.type);
                                    const isWishlisted = isInWishlist(place.id, wishlistType);
                                    const isOpen = checkIsOpen(place.openingHours);

                                    return (
                                        <motion.div
                                            key={place.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-150/40 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                                        >
                                            {/* Media section */}
                                            <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                                                <Link to={`/destination/place/${place.id}`}>
                                                    <img
                                                        src={place.image}
                                                        alt={place.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                </Link>
                                                {/* Category badge */}
                                                <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide">
                                                    {place.type}
                                                </div>
                                                {/* Wishlist Button */}
                                                <button
                                                    onClick={(e) => toggleWishlist(e, place)}
                                                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/95 dark:bg-gray-800/95 shadow-md hover:scale-110 active:scale-95 transition-all text-gray-500 dark:text-gray-300"
                                                >
                                                    <Heart
                                                        className={`h-5 w-5 transition-colors ${isWishlisted
                                                                ? 'fill-red-500 text-red-500'
                                                                : 'text-gray-400 dark:text-gray-400 group-hover:text-red-400'
                                                            }`}
                                                    />
                                                </button>
                                                {/* Price level badge */}
                                                <div className="absolute bottom-4 right-4 bg-black/65 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                                                    <span className={`font-semibold ${place.priceRange === 'Budget' ? 'text-green-400' :
                                                            place.priceRange === 'Mid-range' ? 'text-orange-400' :
                                                                'text-purple-400'
                                                        }`}>
                                                        {place.priceRange}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details section */}
                                            <div className="p-6 flex-grow flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <Link to={`/destination/place/${place.id}`} className="block w-full">
                                                            <h3 className="text-xl font-bold text-gray-950 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                {place.name}
                                                            </h3>
                                                        </Link>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                                                        {place.description}
                                                    </p>

                                                    {/* Attributes list */}
                                                    <div className="space-y-3 mb-6">
                                                        {/* Location */}
                                                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                                            <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
                                                            <span className="text-xs line-clamp-1">{place.location}</span>
                                                        </div>
                                                        {/* Opening Hours & Status */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                                                <Clock className="h-4 w-4 flex-shrink-0 text-blue-500" />
                                                                <span className="text-xs font-medium">{place.openingHours}</span>
                                                            </div>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${isOpen
                                                                    ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                                                                    : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                                                                }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'
                                                                    }`}></span>
                                                                {isOpen ? 'Open Now' : 'Closed'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Latest Review Snippet */}
                                                    {place.reviewsList && place.reviewsList.length > 0 && (
                                                        <div className="mt-4 mb-2 p-3 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-150/30 dark:border-gray-700/20">
                                                            <p className="text-[11px] italic text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                                                &ldquo;{place.reviewsList[0].comment}&rdquo;
                                                            </p>
                                                            <p className="text-[9px] text-right font-bold text-gray-400 dark:text-gray-550 mt-1">
                                                                &mdash; {place.reviewsList[0].author}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Bar */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                                    {/* Rating */}
                                                    <div className="flex items-center space-x-1.5">
                                                        <Star className="h-4.5 w-4.5 text-yellow-400 fill-current" />
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                            {place.rating}
                                                        </span>
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                                            ({place.reviewCount})
                                                        </span>
                                                    </div>

                                                    {/* Buttons */}
                                                    <div className="flex items-center space-x-1.5">
                                                        <a
                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.location)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-blue-650 dark:text-gray-400 dark:hover:text-blue-350 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/20"
                                                        >
                                                            <Navigation className="h-3 w-3" />
                                                            <span>Directions</span>
                                                        </a>
                                                        <Link
                                                            to={`/destination/place/${place.id}`}
                                                            className="inline-flex items-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors py-1.5 px-3 rounded-lg shadow-sm"
                                                        >
                                                            Explore
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RealtimeExplorer;
