import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Check, AlertTriangle, Droplets } from 'lucide-react';
import { goaWaterfalls } from '../data/waterfallData';
import ImageSlider from '../components/common/ImageSlider';

const WaterfallDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const waterfall = goaWaterfalls.find(w => w.id === parseInt(id || '0'));

    if (!waterfall) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Waterfall not found</h2>
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
                    <ImageSlider images={waterfall.images} alt={waterfall.name} />
                </motion.div>

                {/* Waterfall Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-xl p-8 shadow-lg"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{waterfall.name}</h1>

                    <div className="flex items-center space-x-4 text-gray-600 mb-6">
                        <div className="flex items-center space-x-1">
                            <MapPin className="h-5 w-5" />
                            <span>{waterfall.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Droplets className="h-5 w-5" />
                            <span>Height: {waterfall.height}</span>
                        </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">{waterfall.description}</p>

                    {/* Highlights */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {waterfall.highlights.map((highlight: string, index: number) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Best Time to Visit */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Best Time to Visit</h2>
                        <p className="text-lg text-gray-700 bg-blue-50 p-4 rounded-lg">
                            {waterfall.bestTimeToVisit}
                        </p>
                    </div>

                    {/* Best Season */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Best Season</h2>
                        <p className="text-gray-700 leading-relaxed">{waterfall.bestSeason}</p>
                    </div>

                    {/* Safety Tips */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            <span>Safety Tips</span>
                        </h2>
                        <p className="text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            {waterfall.safetyTips}
                        </p>
                    </div>

                    {/* Nearby Places */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Nearby Places</h2>
                        <div className="flex flex-wrap gap-2">
                            {waterfall.nearbyPlaces.map((place: string, index: number) => (
                                <span
                                    key={index}
                                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                                >
                                    <MapPin className="h-4 w-4" />
                                    <span>{place}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Entry Fee & Distance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-gray-700">
                                <span className="font-semibold">Entry Fee:</span> {waterfall.entryFee}
                            </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-gray-700">
                                <span className="font-semibold">Distance from Panaji:</span> {waterfall.distanceFromPanaji}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div >
        </div >
    );
};

export default WaterfallDetails;
