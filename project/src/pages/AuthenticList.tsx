import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import { goaAuthenticExperiences } from '../data/authenticData';
import { useWishlist } from '../context/WishlistContext';

const AuthenticList: React.FC = () => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(String(item.id), 'authentic')) {
      removeFromWishlist(String(item.id), 'authentic');
    } else {
      addToWishlist(item, 'authentic');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {goaAuthenticExperiences.map((item) => {
        const isWishlisted = isInWishlist(String(item.id), 'authentic');
        return (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={(e) => toggleWishlist(e, item)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform z-10"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
              <div className="flex items-center space-x-1 text-gray-500 text-sm mb-4">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              <Link
                to={`/destination/authentic/${item.id}`}
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

export default AuthenticList;
