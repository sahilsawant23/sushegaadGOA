import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
const FeaturedTours: React.FC = () => {
  const [featuredTours, setFeaturedTours] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/tours')
      .then(res => res.json())
      .then(data => {
        // Take first 3 tours
        const tours = Array.isArray(data) ? data.slice(0, 3).map((tour: any) => ({
          ...tour,
          // Handle images: preferred image_url, fallback to first item of images array
          images: tour.image_url ? [tour.image_url] : (tour.images || []),
          duration: tour.duration || `${tour.duration_hours || 0} hours`,
          maxGroupSize: tour.maxGroupSize || tour.max_participants,
          reviewCount: tour.reviewCount || tour.review_count || 0
        })) : [];
        setFeaturedTours(tours);
      })
      .catch(err => console.error('Failed to load featured tours', err));
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Tours & Experiences
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover our most popular tours and create unforgettable memories in beautiful Goa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={tour.image_url || (tour.images && tour.images[0]) || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'}
                  alt={tour.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 px-2 py-1 rounded-full">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{tour.category}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tour.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{tour.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{tour.rating}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({tour.reviewCount})</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Max {tour.maxGroupSize}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{tour.price.toLocaleString()}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">per person</span>
                  </div>
                  <Link
                    to={`/tours/${tour.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/tours"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <span>View All Tours</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedTours;