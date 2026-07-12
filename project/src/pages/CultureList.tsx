import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Heart } from 'lucide-react';
import { festivals } from '../data/cultureData';
import { useWishlist } from '../context/WishlistContext';

const CultureList: React.FC = () => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const toggleWishlist = (e: React.MouseEvent, festival: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist(String(festival.id), 'culture')) {
            removeFromWishlist(String(festival.id), 'culture');
        } else {
            addToWishlist(festival, 'culture');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {festivals.map((festival) => {
                const isWishlisted = isInWishlist(String(festival.id), 'culture');
                return (
                    <div key={festival.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                        <div className="relative overflow-hidden h-48">
                            <img
                                src={festival.images[0] || 'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800'}
                                alt={festival.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                                {festival.category}
                            </div>
                            <button
                                onClick={(e) => toggleWishlist(e, festival)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform z-10"
                            >
                                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{festival.name}</h3>
                            <div className="flex items-center space-x-1 text-gray-500 text-sm mb-2">
                                <MapPin className="h-4 w-4" />
                                <span>{festival.location}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500 text-sm mb-4">
                                <Calendar className="h-4 w-4" />
                                <span>{festival.dates}</span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">{festival.description}</p>
                            <Link
                                to={`/destination/culture/${festival.id}`}
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CultureList;

