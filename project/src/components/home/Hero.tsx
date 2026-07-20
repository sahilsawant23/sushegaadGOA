import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, Bike, Sparkles, CalendarDays, Compass } from 'lucide-react';
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
    <div className="relative min-h-[88vh] flex items-center justify-center overflow-hidden py-12">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1920')`
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-xs tracking-wide mb-6">
            ✨ Experience Goa's Heritage, Beaches & Nightlife
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Discover the True Beauty of <span className="text-blue-400">Goa</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl mb-8 max-w-2xl mx-auto text-slate-200 font-normal leading-relaxed">
            Pristine golden beaches, vibrant seaside parties, rich Portuguese-Goan heritage & authentic coastal culture.
          </p>

          {/* Quick Action Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm font-semibold">
            <Link
              to="/group-planner"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Users className="h-4 w-4" />
              Group Trip Planner
            </Link>

            <Link
              to="/ai-planner"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              AI Trip Planner
            </Link>
          </div>
        </motion.div>

        {/* Clean Professional Search Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-4xl mx-auto border border-slate-200 dark:border-slate-800 text-left"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Where to in Goa?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-slate-900 dark:text-white placeholder-slate-400 font-medium text-sm outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full text-slate-900 dark:text-white font-medium text-sm outline-none bg-transparent dark:[color-scheme:dark]"
              />
            </div>

            <div className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Users className="h-5 w-5 text-slate-400 shrink-0" />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full text-slate-900 dark:text-white font-medium text-sm outline-none bg-transparent"
              >
                <option value="1" className="dark:bg-slate-800">1 Traveler</option>
                <option value="2" className="dark:bg-slate-800">2 Travelers</option>
                <option value="3" className="dark:bg-slate-800">3 Travelers</option>
                <option value="4" className="dark:bg-slate-800">4 Travelers</option>
                <option value="5" className="dark:bg-slate-800">5+ Group</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary w-full !py-3"
            >
              <Search className="h-4 w-4" />
              <span>Search Tours</span>
            </button>
          </form>
        </motion.div>

        {/* Key Platform Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto text-center"
        >
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <div className="text-xl sm:text-2xl font-bold text-white">50+</div>
            <div className="text-xs text-slate-300 font-medium">Curated Tours</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <div className="text-xl sm:text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-slate-300 font-medium">Yellow Plate Fleet</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <div className="text-xl sm:text-2xl font-bold text-white">Live</div>
            <div className="text-xs text-slate-300 font-medium">Ocean Safety Data</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <div className="text-xl sm:text-2xl font-bold text-white">24/7</div>
            <div className="text-xs text-slate-300 font-medium">Local Assistance</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;