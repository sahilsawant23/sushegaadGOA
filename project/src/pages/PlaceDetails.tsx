// Universal Place Details Component
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Info, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { goaNightlife } from '../data/nightlifeData';
import { goaChurches } from '../data/churchData';
import { goaTemples } from '../data/templeData';
import { goaBeaches } from '../data/beachesData';
import { goaWaterfalls } from '../data/waterfallData';

const PlaceDetails: React.FC = () => {
    const { id, category } = useParams<{ id: string; category?: string }>();
    const navigate = useNavigate();
    const [place, setPlace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>('');

    useEffect(() => {
        setLoading(true);

        const checkStaticData = () => {
            // Helper to adapt static data to new schema
            const adapt = (item: any, cat: string) => ({
                ...item,
                category: cat,
                region: item.region || item.location, // Fallback for region
                image_url: item.image,
                gallery_images: item.images,
                details: {
                    highlights: item.significance || item.highlights,
                    openingHours: item.bestTimeToVisit || item.timings,
                    bestTime: item.bestTimeToVisit ? item.bestTimeToVisit.join(', ') : item.timings,
                    timings: item.timings || (item.bestTimeToVisit ? item.bestTimeToVisit.join(', ') : null),
                    priceRange: item.entryFee,
                    bestFor: item.nearbyPlaces || item.bestFor,
                    history: item.history,
                    architecture: item.architecture,
                    bestSeason: item.bestSeason,
                    safetyTips: item.safetyTips,
                    ...item // spread original just in case
                }
            });

            // check each array
            let found = null;

            // 1. Nightlife
            const nightlife = (goaNightlife as any[]).find((v: any) => String(v.id) === id);
            if (nightlife) found = adapt(nightlife, 'Nightlife');

            // 2. Churches
            if (!found) {
                const church = (goaChurches as any[]).find((v: any) => String(v.id) === id);
                if (church) found = adapt(church, 'Church');
            }

            // 3. Temples
            if (!found) {
                const temple = (goaTemples as any[]).find((v: any) => String(v.id) === id);
                if (temple) found = adapt(temple, 'Temple');
            }

            // 4. Beaches
            if (!found) {
                const beach = (goaBeaches as any[]).find((v: any) => String(v.id) === id);
                if (beach) found = adapt(beach, 'Beach');
            }

            // 5. Waterfalls
            if (!found) {
                const waterfall = (goaWaterfalls as any[]).find((v: any) => String(v.id) === id);
                if (waterfall) found = adapt(waterfall, 'Waterfall');
            }

            return found;
        };

        // Try to find in static data first (fastest and covers legacy IDs)
        const staticData = checkStaticData();
        if (staticData) {
            setPlace(staticData);
            if (staticData.image_url) setActiveImage(staticData.image_url);
            setLoading(false);
            return;
        }

        // If not found statically, try API
        fetch(`http://localhost:5000/api/destinations/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => {
                setPlace(data);
                if (data.image_url) setActiveImage(data.image_url);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!place) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Place not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Parse rich details if they exist (JSON column)
    const details = place.details ? (typeof place.details === 'string' ? JSON.parse(place.details) : place.details) : {};
    const gallery = place.gallery_images ? (typeof place.gallery_images === 'string' ? JSON.parse(place.gallery_images) : place.gallery_images) : [];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Image Gallery / Hero */}
            <div className="relative h-[60vh] md:h-[70vh] bg-gray-900">
                <img
                    src={activeImage || place.image_url}
                    alt={place.name}
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full text-white transition-all z-10"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white uppercase bg-blue-600 rounded-full">
                            {place.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">{place.name}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-200">
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                                <span className="text-lg">{place.region}{details.distanceFromPanaji ? ` • ${details.distanceFromPanaji} from Panaji` : ''}</span>
                            </div>
                            {details.bestTime && (
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-blue-400" />
                                    <span>Best time: {details.bestTime || details.bestSeason}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Main Description & Gallery */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Info className="w-6 h-6 mr-2 text-blue-600" />
                                About {place.name}
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                {place.description}
                                {details.history && (
                                    <span className="block mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <strong className="text-gray-900 dark:text-white">History: </strong> {details.history}
                                    </span>
                                )}
                            </p>

                            {/* Render Highlights if available */}
                            {details.highlights && details.highlights.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Highlights</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {details.highlights.map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Best Season (Long Description) */}
                            {details.bestSeason && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Best Season to Visit</h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {details.bestSeason}
                                    </p>
                                </div>
                            )}

                            {/* Safety Tips / Etiquette */}
                            {details.safetyTips && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                        {place.category === 'Temple' || place.category === 'Church' ? 'Visitor Etiquette & Tips' : 'Safety Tips'}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {details.safetyTips}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Gallery Grid */}
                        {gallery && gallery.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <ImageIcon className="w-6 h-6 mr-2 text-blue-600" />
                                    Photo Gallery
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {gallery.map((img: string, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-800"
                                            onClick={() => setActiveImage(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`${place.name} ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Key Details & Map */}
                    <div className="space-y-8">
                        {/* Info Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Visitor Information</h3>

                            <div className="space-y-4">
                                {details.timings && (
                                    <div className="flex items-start">
                                        <Clock className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Opening Hours</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{details.timings}</p>
                                        </div>
                                    </div>
                                )}

                                {details.entryFee && (
                                    <div className="flex items-start">
                                        <Star className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Entry Fee</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{details.entryFee}</p>
                                        </div>
                                    </div>
                                )}

                                {details.difficulty && (
                                    <div className="flex items-start">
                                        <Info className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Difficulty Level</p>
                                            <p className={`font-medium ${details.difficulty === 'Easy' ? 'text-green-600' :
                                                details.difficulty === 'Moderate' ? 'text-amber-600' : 'text-red-600'
                                                }`}>
                                                {details.difficulty}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {details.bestFor && Array.isArray(details.bestFor) && (
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Best For</p>
                                        <div className="flex flex-wrap gap-2">
                                            {details.bestFor.map((item: string, i: number) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.region} Goa`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                            >
                                <MapPin className="w-5 h-5 mr-2" />
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceDetails;
