import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowLeft, Check, Calendar as CalendarIcon } from 'lucide-react';
import { festivals, getFestivalsByCategory } from '../data/cultureData';
import ImageSlider from '../components/common/ImageSlider';

const CultureDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const festival = festivals.find(f => f.id === id);

    if (!festival) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Festival not found</h2>
                    <button
                        onClick={() => navigate('/destinations')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Destinations
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="bg-white sticky top-16 z-40 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/destinations')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                    <ImageSlider images={festival.images} alt={festival.name} />
                </motion.div>

                {/* Festival Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-xl p-8 shadow-lg"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold capitalize mb-3">
                                {festival.category}
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{festival.name}</h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                        <div className="flex items-center space-x-1">
                            <MapPin className="h-5 w-5" />
                            <span>{festival.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-5 w-5" />
                            <span>{festival.dates}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="h-5 w-5" />
                            <span>{festival.duration}</span>
                        </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8 text-lg">{festival.longDescription}</p>

                    {/* Highlights */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {festival.highlights.map((highlight: string, index: number) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Activities */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Activities</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {festival.activities.map((activity: string, index: number) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                    <span>{activity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Best Time & Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                                <span>Best Time to Visit</span>
                            </h3>
                            <p className="text-gray-700">{festival.bestTime}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">Travel Tips</h3>
                            <ul className="space-y-1">
                                {festival.tips.map((tip: string, index: number) => (
                                    <li key={index} className="text-gray-700 text-sm">• {tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Booking Info */}
                    {festival.bookingInfo && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h3 className="font-semibold text-gray-900 mb-2">Booking Information</h3>
                            <p className="text-gray-700">{festival.bookingInfo}</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default CultureDetails;

