import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowLeft, Star, Users } from 'lucide-react';
import { goaNightlife } from '../data/nightlifeData';
import ImageSlider from '../components/common/ImageSlider';

const NightlifeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const venue = goaNightlife.find(v => v.id === id);

    if (!venue) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue not found</h2>
                    <button
                        onClick={() => navigate('/nightlife')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Nightlife
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Back Button */}
            <div className="bg-gray-800 sticky top-16 z-40 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/nightlife')}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Nightlife</span>
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
                    <ImageSlider images={venue.images} alt={venue.name} />
                </motion.div>

                {/* Venue Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gray-800 rounded-xl p-8 shadow-lg"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">{venue.name}</h1>

                    <div className="flex items-center space-x-4 text-gray-300 mb-6">
                        <div className="flex items-center space-x-1">
                            <MapPin className="h-5 w-5" />
                            <span>{venue.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="h-5 w-5" />
                            <span>{venue.openingHours}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <span className="font-semibold">{venue.rating}</span>
                            <span>({venue.reviewCount} reviews)</span>
                        </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-8">{venue.description}</p>

                    {/* Atmosphere */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Atmosphere</h2>
                        <p className="text-lg text-gray-300 bg-gray-700 p-4 rounded-lg">
                            {venue.atmosphere}
                        </p>
                    </div>

                    {/* Highlights */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Highlights</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {venue.highlights.map((highlight: string, index: number) => (
                                <li key={index} className="flex items-center space-x-3 text-gray-300">
                                    <Star className="h-5 w-5 text-purple-400 flex-shrink-0" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Music Genre */}
                    {venue.musicGenre && venue.musicGenre.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Music Genre</h2>
                            <div className="flex flex-wrap gap-2">
                                {venue.musicGenre.map((genre: string, index: number) => (
                                    <span
                                        key={index}
                                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Best For */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Best For</h2>
                        <div className="flex flex-wrap gap-2">
                            {venue.bestFor.map((item: string, index: number) => (
                                <span
                                    key={index}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                                >
                                    <Users className="h-4 w-4" />
                                    <span>{item}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
                        <div className="flex flex-wrap gap-2">
                            {venue.features.map((feature: string, index: number) => (
                                <span
                                    key={index}
                                    className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Nearby Beach */}
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-gray-300">
                            <span className="font-semibold text-white">Nearby Beach:</span> {venue.nearbyBeach}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NightlifeDetails;
