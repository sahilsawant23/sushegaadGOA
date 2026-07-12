import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase().includes('nightlife') || searchQuery.toLowerCase().includes('club') || searchQuery.toLowerCase().includes('bar') || searchQuery.toLowerCase().includes('casino') || searchQuery.toLowerCase().includes('beach shack')) {
      navigate(`/nightlife?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/tours?search=${encodeURIComponent(searchQuery)}&guests=${guests}&date=${checkInDate}`);
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.pexels.com/photos/165754/pexels-photo-165754.jpeg')`
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover the Magic of
            <span className="text-blue-400 block">Beautiful Goa</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            From pristine beaches to rich Portuguese heritage, experience the best of Goa with our expertly crafted tours and adventures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/events"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/50 backdrop-blur-sm px-8 py-3 rounded-full font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center min-w-[200px]"
            >
              Upcoming Events
            </Link>
            <Link
              to="/hidden-gems"
              className="bg-amber-500/80 hover:bg-amber-500 text-white backdrop-blur-sm px-8 py-3 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-amber-500/30 flex items-center justify-center min-w-[200px]"
            >
              Hidden Gems
            </Link>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto transition-colors duration-200"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <MapPin className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full text-gray-900 dark:text-white outline-none bg-transparent dark:[color-scheme:dark]"
              />
            </div>

            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Users className="h-5 w-5 text-gray-400" />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full text-gray-900 dark:text-white outline-none bg-transparent pr-2"
              >
                <option value="1" className="dark:bg-gray-800">1 Guest</option>
                <option value="2" className="dark:bg-gray-800">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Search Tours</span>
            </button>
          </form>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white-400">50+</div>
            <div className="text-lg">Tour Packages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white-400">10,000+</div>
            <div className="text-lg">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white-400">15+</div>
            <div className="text-lg">Years Experience</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;