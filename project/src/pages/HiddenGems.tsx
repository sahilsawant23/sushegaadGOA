import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, MapPin, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Gem {
    id: number;
    name: string;
    description: string;
    image_url: string;
    region: string;
    category: string;
    details: any;
}

const HiddenGems: React.FC = () => {
    const { state } = useAuth();
    const { isAuthenticated } = state;
    const [gems, setGems] = useState<Gem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Encode "Hidden Gem" as the category
        fetch('http://localhost:5000/api/destinations/category/Hidden%20Gem')
            .then(res => res.json())
            .then(data => {
                const parsedData = data.map((item: any) => ({
                    ...item,
                    details: typeof item.details === 'string' ? JSON.parse(item.details) : item.details || {}
                }));
                setGems(parsedData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching hidden gems:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pt-20">

            {/* Header */}
            <div className="relative py-20 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&q=80"
                        alt="Hidden Goa"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg font-serif">
                            Hidden Gems of Goa
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Explore the untouched, the secret, and the magical side of Goa that few travelers get to see.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="w-10 h-10 animate-spin text-amber-500" />
                    </div>
                ) : !isAuthenticated ? (
                    /* LOCKED STATE */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full mb-8 shadow-inner relative group">
                            <Lock className="w-24 h-24 text-gray-400 dark:text-gray-500 group-hover:text-amber-500 transition-colors duration-500" />
                            <div className="absolute inset-0 border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-full animate-spin-slow"></div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            This Content is Locked
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
                            Join our community of explorers to unlock these exclusive locations. It's free and takes less than a minute!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold shadow-lg shadow-amber-500/30 transition-all transform hover:scale-105 flex items-center justify-center"
                            >
                                Login to Unlock
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                to="/register"
                                className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 text-gray-900 dark:text-white rounded-lg font-bold transition-all flex items-center justify-center"
                            >
                                Create Account
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    /* UNLOCKED STATE */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {gems.map((gem, index) => {
                            const details = gem.details || {};
                            // Use encoded ID for URL if needed, or just ID
                            // Route: /destination/:category/:id or /hidden-gems/:id
                            // App.tsx maps /hidden-gems/:id to PlaceDetails?
                            // Wait, App.tsx had: <Route path="/hidden-gems/:id" element={<HiddenGemDetails />} />
                            // checking App.tsx again...
                            // If I want to use PlaceDetails, I should use /destination/hidden-gem/:id OR update route.
                            // But RegionDetails uses /destination/:category/:id.
                            // If I use /hidden-gems/:id, it might map to the OLD HiddenGemDetails component unless I updated App.tsx too.
                            // Actually, I should update App.tsx to point /hidden-gems/:id to PlaceDetails, OR change the link here to /destination/Hidden Gem/:id.
                            // RegionDetails uses /destination/:category/:id.

                            return (
                                <Link to={`/destination/${gem.category}/${gem.id}`} key={gem.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full"
                                    >
                                        {/* Image & Overlay */}
                                        <div className="relative h-80 overflow-hidden">
                                            <img
                                                src={gem.image_url}
                                                alt={gem.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                            {details.difficulty && (
                                                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                                    {details.difficulty} Access
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center text-amber-400 mb-2">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">{details.location || gem.region}</span>
                                            </div>

                                            <h3 className="text-3xl font-serif font-bold text-white mb-4 group-hover:text-amber-200 transition-colors">
                                                {gem.name}
                                            </h3>

                                            <p className="text-gray-300 line-clamp-2 group-hover:line-clamp-none transition-all duration-300 mb-4 text-sm leading-relaxed">
                                                {gem.description}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-t border-gray-700 pt-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                                <span>BEST TIME: {details.bestTime}</span>
                                                <span className="flex items-center text-amber-500">
                                                    EXPLORE <ArrowRight className="w-3 h-3 ml-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HiddenGems;
