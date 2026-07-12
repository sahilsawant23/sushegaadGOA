import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

interface Destination {
    id: number;
    name: string;
    description: string;
    image_url: string;
    region: string;
    category: string;
}

const RegionDetails: React.FC = () => {
    const { regionName } = useParams<{ regionName: string }>();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    // Format region name from slug (e.g. "north-goa" -> "North Goa")
    const formattedRegion = regionName
        ? regionName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Goa';

    useEffect(() => {
        setLoading(true);
        // Fetch all destinations and filter by region
        fetch('http://localhost:5000/api/destinations')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((data: any[]) => {
                // Defensive check to ensure data is an array
                const validData = Array.isArray(data) ? data : [];

                const regionDestinations = validData.filter(dest =>
                    dest.region?.toLowerCase() === formattedRegion.toLowerCase() ||
                    (formattedRegion === 'Central Goa' && dest.region === 'Ponda') ||
                    (formattedRegion === 'Central Goa' && dest.region === 'Central Goa')
                );
                setDestinations(regionDestinations);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching destinations:', err);
                setLoading(false);
            });
    }, [formattedRegion]);

    const getHeroImage = () => {
        switch (formattedRegion) {
            case 'North Goa': return 'https://img.freepik.com/free-photo/beautiful-diamond-beach-penida-island-bali-indonesia_181624-41884.jpg?semt=ais_hybrid&w=740';
            case 'South Goa': return 'https://www.shutterstock.com/image-photo/goa-indiajanuary-21-2019palolem-beach-600nw-2357797653.jpg';
            case 'Old Goa': return 'https://t3.ftcdn.net/jpg/03/62/17/20/360_F_362172040_ux7I8LhLOcMhYgGgXiAKD5l16qBrrl2c.jpg';
            case 'Central Goa': return 'https://i.pinimg.com/736x/cb/b0/93/cbb0932c7e9829997c2ce238b66305cf.jpg';
            default: return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000';
        }
    };

    const getDescription = () => {
        switch (formattedRegion) {
            case 'North Goa': return 'Famous for its electrifying nightlife, bustling flea markets, and water sports at Calangute and Baga beaches.';
            case 'South Goa': return 'A paradise for peace lovers, known for its pristine, less-crowded white sand beaches and luxury resorts.';
            case 'Old Goa': return 'The historical heart of Goa, home to UNESCO World Heritage churches and Portuguese colonial architecture.';
            case 'Central Goa': return 'Rich in culture and spice plantations, offering a glimpse into the traditional Goan way of life.';
            default: return 'Explore the beautiful regions of Goa.';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-blue-500 text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Hero Section */}
            <div className="relative h-[50vh] overflow-hidden">
                <img
                    src={getHeroImage()}
                    alt={formattedRegion}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">{formattedRegion}</h1>
                        <p className="text-xl max-w-2xl mx-auto drop-shadow-md">{getDescription()}</p>
                    </div>
                </div>
            </div>

            {/* Destinations Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Top Places in {formattedRegion}</h2>

                {destinations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((dest, index) => (
                            <motion.div
                                key={dest.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={dest.image_url}
                                        alt={dest.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                        {dest.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {dest.region || 'Goa'}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{dest.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                                        {dest.description}
                                    </p>
                                    <Link
                                        to={dest.category ? `/destination/${dest.category.toLowerCase()}/${dest.id}` : '#'}
                                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No listings found</h3>
                        <p className="text-gray-500">We are currently updating our database for {formattedRegion}. Check back soon!</p>
                        <Link to="/destinations" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Explore All Destinations
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegionDetails;
