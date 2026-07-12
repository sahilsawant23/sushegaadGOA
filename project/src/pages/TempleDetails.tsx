import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Check, DollarSign } from 'lucide-react';
import { goaTemples } from '../data/templeData';
import ImageSlider from '../components/common/ImageSlider';

const TempleDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // Temple IDs are strings like "shantadurga", "mangueshi" etc.
    const temple = goaTemples.find(c => c.id === (id || ''));

    if (!temple) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">temple not found</h2>
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
                    <ImageSlider images={temple.images} alt={temple.name} />
                </motion.div>

                {/* temple Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-xl p-8 shadow-lg"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{temple.name}</h1>

                    <div className="flex items-center space-x-4 text-gray-600 mb-6">
                        <div className="flex items-center space-x-1">
                            <MapPin className="h-5 w-5" />
                            <span>{temple.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <DollarSign className="h-5 w-5" />
                            <span>Entry: {temple.entryFee}</span>
                        </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">{temple.description}</p>

                    {/* Architecture */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Architecture</h2>
                        <p className="text-lg text-gray-700 bg-purple-50 p-4 rounded-lg">
                            {temple.architecture}
                        </p>
                    </div>

                    {/* History */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">History</h2>
                        <p className="text-gray-700 leading-relaxed">{temple.history}</p>
                    </div>

                    {/* Significance */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Significance</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {temple.significance.map((item: string, index: number) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-purple-600 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Nearby Places */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Nearby Places</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {temple.nearbyPlaces.map((place: string, index: number) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                    <span>{place}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Best Time to Visit */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Best Time to Visit</h2>
                        <p className="text-lg text-gray-700">{temple.bestTimeToVisit}</p>
                    </div>

                    {/* Distance Info */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                            <span className="font-semibold">Distance from Panaji:</span> {temple.distanceFromPanaji}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TempleDetails;
