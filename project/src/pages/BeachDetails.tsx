import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Check } from 'lucide-react';
import { goaBeaches } from '../data/beachesData';
import ImageSlider from '../components/common/ImageSlider';

const BeachDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Use id directly as string, matching beachesData.ts
    const beach = goaBeaches.find(b => b.id === id);

    if (!beach) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Beach not found ({id})</h2>
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
                    <ImageSlider images={beach.images} alt={beach.name} />
                </motion.div>

                {/* Beach Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-xl p-8 shadow-lg"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{beach.name}</h1>

                    <div className="flex items-center space-x-4 text-gray-600 mb-6">
                        <div className="flex items-center space-x-1">
                            <MapPin className="h-5 w-5" />
                            <span>{beach.region}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>{beach.crowdLevel} Crowd</span>
                        </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8 text-lg">{beach.description}</p>

                    {/* Highlights */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                        <div className="flex flex-wrap gap-2">
                            {beach.highlights.map((highlight, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                                >
                                    {highlight}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Activities */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Activities</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {beach.activities.map((activity, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="h-2 w-2 bg-orange-500 rounded-full" />
                                    <span className="text-gray-700">{activity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Facilities */}
                    {beach.facilities && beach.facilities.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {beach.facilities.map((facility, index) => (
                                    <li key={index} className="flex items-center space-x-3">
                                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                                        <span>{facility}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Best For */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Best For</h2>
                        <div className="flex flex-wrap gap-3">
                            {beach.bestFor.map((item, index) => (
                                <span key={index} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Nearby Attractions */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Nearby Attractions</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {beach.nearbyAttractions.map((place, index) => (
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
                        <div className="flex flex-wrap gap-2">
                            {beach.bestTimeToVisit.map((month, index) => (
                                <span key={index} className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-md">
                                    {month}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Distance Info */}
                    <div className="bg-blue-50 p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-1">Distance from Panaji</h3>
                            <p className="text-blue-700">{beach.distanceFromPanaji}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-lg font-semibold text-blue-900 mb-1">Accessibility</h3>
                            <p className="text-blue-700">{beach.accessibility}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BeachDetails;
