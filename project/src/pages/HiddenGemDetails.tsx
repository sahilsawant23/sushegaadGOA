import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import { hiddenGemsData, HiddenGem } from '../data/hiddenGemsData';

const HiddenGemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [gem, setGem] = useState<HiddenGem | null>(null);

    useEffect(() => {
        const foundGem = hiddenGemsData.find(g => g.id === id);
        if (foundGem) {
            setGem(foundGem);
        } else {
            navigate('/hidden-gems');
        }
    }, [id, navigate]);

    if (!gem) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={gem.image}
                    alt={gem.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                <div className="absolute top-6 left-6 z-20">
                    <Link
                        to="/hidden-gems"
                        className="flex items-center text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Gems
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center text-amber-400 mb-4 font-medium tracking-wide">
                            <MapPin className="w-5 h-5 mr-2" />
                            {gem.location}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 font-serif drop-shadow-2xl">
                            {gem.title}
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12"
                    >
                        <div className="flex flex-wrap gap-4 mb-8">
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${gem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                gem.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                                Difficulty: {gem.difficulty}
                            </span>
                            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-bold flex items-center">
                                <Calendar className="w-4 h-4 mr-2" /> Best Time: {gem.bestTime}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About this Gem</h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                            {gem.description}
                        </p>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What to Expect</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></span>
                                    <span className="text-gray-600 dark:text-gray-400">Pristine and untouched nature</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></span>
                                    <span className="text-gray-600 dark:text-gray-400">Less crowd, more peace</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></span>
                                    <span className="text-gray-600 dark:text-gray-400">Authentic local experience</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></span>
                                    <span className="text-gray-600 dark:text-gray-400">Photographer's paradise</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Sidebar / Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Visit With Us Card */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl shadow-xl p-8 text-white text-center">
                            <h3 className="text-2xl font-bold mb-4">Want to visit here?</h3>
                            <p className="opacity-90 mb-8">
                                Let us handle the logistics. Book a guided tour with us to this hidden gem and experience it like a local.
                            </p>
                            <Link
                                to={`/contact?subject=Visit ${gem.title}`}
                                className="block w-full py-4 bg-white text-amber-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Visit With Us
                            </Link>
                        </div>

                        {/* Directions Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Self Explore?</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                                Feeling adventurous? Get directions and explore directly on Google Maps.
                            </p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gem.title + ' ' + gem.location + ' Goa')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full py-3 border-2 border-gray-200 dark:border-gray-700 hover:border-amber-500 text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-500 rounded-xl font-bold transition-all"
                            >
                                Get Directions <ExternalLink className="ml-2 w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default HiddenGemDetails;
