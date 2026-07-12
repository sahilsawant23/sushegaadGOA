import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Calendar, MapPin, ChevronLeft, ChevronRight, Tag, RefreshCw, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setCurrentImageIndex(0);
        setLoading(true);
        fetch(`http://localhost:5000/api/events/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Event not found');
                return res.json();
            })
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                navigate('/events');
            });
    }, [id, navigate]);

    const images = event ? [
        event.image_url || event.image,
        ...(event.gallery_images ? (() => {
            try {
                const parsed = JSON.parse(event.gallery_images);
                return Array.isArray(parsed) ? parsed : [];
            } catch { return []; }
        })() : [])
    ].filter(Boolean) : [];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-200">
            {/* Image Slider / Hero Section */}
            <div className="relative h-[60vh] bg-gray-900 overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.img
                        key={currentImageIndex}
                        src={images[currentImageIndex]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        alt={event?.title}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                {/* Slider Controls */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute bottom-0 left-0 right-0 px-8 pt-8 pb-32 max-w-7xl mx-auto pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pointer-events-auto"
                    >
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                {event?.category || 'Event'}
                            </span>
                            {event?.price && (
                                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                    {event.price === 'Free' || event.price === 'Free Entry' ? 'Free Entry' : event.price}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg font-serif">
                            {event?.title}
                        </h1>
                        <div className="flex flex-col md:flex-row md:items-center text-gray-200 gap-4 md:gap-8">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                                {new Date(event?.start_date || event?.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-red-400" />
                                {event?.location}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <button
                    onClick={() => navigate('/events')}
                    className="absolute top-8 left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-20"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Event</h2>

                            {/* Mood Badge */}
                            {event.mood && (
                                <div className="mb-6">
                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">
                                        ✨ Vibe: {event.mood}
                                    </span>
                                </div>
                            )}

                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">
                                {event.description}
                            </p>

                            {/* Highlights Section */}
                            {event.highlights && (
                                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="mr-2">🎉</span> Event Highlights
                                    </h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {(() => {
                                            try {
                                                const highlights = JSON.parse(event.highlights);
                                                return Array.isArray(highlights) ? highlights.map((h: string, i: number) => (
                                                    <li key={i} className="flex items-center text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                                                        {h}
                                                    </li>
                                                )) : <li>{event.highlights}</li>;
                                            } catch {
                                                return <li>{event.highlights}</li>;
                                            }
                                        })()}
                                    </ul>
                                </div>
                            )}
                        </section>

                        <section className="bg-white rounded-2xl p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Terms & Additional Info</h2>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <Tag className="w-5 h-5 mr-3 text-blue-500 mt-0.5" />
                                    <span>Source: {event.source === 'manual' ? 'Direct Listing' : (event.source === 'google_events' ? 'Google Events' : event.source)}</span>
                                </li>
                                <li className="flex items-start">
                                    <RefreshCw className="w-5 h-5 mr-3 text-blue-500 mt-0.5" />
                                    <span>Status: {event.status}</span>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <div className="mb-6">
                                <span className="text-gray-500 text-sm font-medium">Price</span>
                                <div className="text-3xl font-bold text-gray-900 mt-1">{event.price}</div>
                            </div>

                            {event.ticket_url ? (
                                <a
                                    href={event.ticket_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition flex items-center justify-center mb-4"
                                >
                                    Book Tickets Now
                                    <ExternalLink className="w-5 h-5 ml-2" />
                                </a>
                            ) : (
                                <button onClick={() => window.location.href = `mailto:contact@goaevents.com?subject=Booking Inquiry: ${event.title}`} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition flex items-center justify-center mb-4">
                                    Contact to Book
                                </button>
                            )}

                            <p className="text-xs text-center text-gray-500">
                                {event.ticket_url ? 'You will be redirected to the official booking partner.' : 'Contact us directly for reservations.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
