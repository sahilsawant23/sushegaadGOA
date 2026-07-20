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
              className="clean-card flex flex-col justify-between group"
            >
              <div>
                <div className="relative overflow-hidden h-60">
                  <img
                    src={tour.image_url || (tour.images && tour.images[0]) || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{tour.category}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{tour.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">{tour.description}</p>

                  <div className="flex items-center justify-between mb-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{tour.rating || '4.9'}</span>
                      <span className="text-xs text-slate-400">({tour.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>Max {tour.maxGroupSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{tour.price?.toLocaleString()}</div>
                      <div className="text-slate-400 text-xs font-medium">per traveler</div>
                    </div>
                    <Link
                      to={`/tours/${tour.id}`}
                      className="btn-primary !px-4 !py-2.5 !text-sm"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
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
            className="btn-primary !text-base !px-8 !py-3.5"
          >
            <span>Explore All 50+ Tours</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedTours;