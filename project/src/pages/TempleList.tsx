import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import { goaTemples } from '../data/templeData';
import { useWishlist } from '../context/WishlistContext';

interface TempleListProps {
  selectedRegion?: 'all' | 'South Goa' | 'North Goa';
}

const TempleList: React.FC<TempleListProps> = ({ selectedRegion = 'all' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (e: React.MouseEvent, temple: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(temple.id, 'temple')) {
      removeFromWishlist(temple.id, 'temple');
    } else {
      addToWishlist(temple, 'temple');
    }
  };

  const filteredTemples = goaTemples.filter(temple =>
    selectedRegion === 'all' || temple.region === selectedRegion
  );

  const sortedTemples = [...filteredTemples].sort((a, b) => a.region.localeCompare(b.region));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sortedTemples.map((temple) => {
        const isWishlisted = isInWishlist(temple.id, 'temple');
        return (
          <div
            key={temple.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={temple.image}
                alt={temple.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                {temple.region}
              </div>
              <button
                onClick={(e) => toggleWishlist(e, temple)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform z-10"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{temple.name}</h3>
              <div className="flex items-center space-x-1 text-gray-500 text-sm mb-4">
                <MapPin className="h-4 w-4" />
                <span>{temple.location}</span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{temple.description}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link
                  to={`/destination/temple/${temple.id}`}
                  className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold"
                >
                  View Details
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.name + " temple Goa")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  Directions
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TempleList;
