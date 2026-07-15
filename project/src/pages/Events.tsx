import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Events: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'Music' | 'Cultural' | 'Food' | 'Nightlife'>('All');

    useEffect(() => {
        fetch('http://localhost:5000/api/events?upcoming=true')
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load events', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const filteredEvents = filter === 'All'
        ? events
        : events.filter(event => event.category === filter);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Header */}
            <div className="relative py-20 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 opacity-60">
                    <img
                        src="https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=1600&q=80"
                        alt="Goa Events"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg font-serif"
                    >
                        Goa Events Calendar
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-200 max-w-2xl mx-auto"
                    >
                        Discover the vibrant pulse of Goa through festivals, parties, and cultural gatherings.
                    </motion.p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap gap-3 justify-center">
                    {['All', 'Music', 'Cultural', 'Food', 'Nightlife'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat as any)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${filter === cat
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
                        >
                            <div className="relative h-48">
                                <img
                                    src={event.image_url || event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                                    {event.category}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <div className="text-white font-bold text-lg">{event.price}</div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(event.start_date || event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {event.location}
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {event.description}
                                </p>

                                <button
                                    onClick={() => navigate(`/events/${event.id}`)}
                                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No events found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
