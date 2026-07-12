import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Destinations: React.FC = () => {
  const destinations = [
    {
      id: 1,
      name: 'North Goa',
      description: 'Famous beaches, nightlife, and water sports',
      image: 'https://img.freepik.com/free-photo/beautiful-diamond-beach-penida-island-bali-indonesia_181624-41884.jpg?semt=ais_hybrid&w=740',
      highlights: ['Baga Beach', 'Calangute', 'Anjuna', 'Saturday Market']
    },
    {
      id: 2,
      name: 'South Goa',
      description: 'Peaceful beaches and luxury resorts',
      image: 'https://www.shutterstock.com/image-photo/goa-indiajanuary-21-2019palolem-beach-600nw-2357797653.jpg',
      highlights: ['Palolem Beach', 'Colva', 'Butterfly Beach', 'Cabo de Rama']
    },
    {
      id: 3,
      name: 'Old Goa',
      description: 'Portuguese heritage and historic churches',
      image: 'https://t3.ftcdn.net/jpg/03/62/17/20/360_F_362172040_ux7I8LhLOcMhYgGgXiAKD5l16qBrrl2c.jpg',
      highlights: ['Basilica of Bom Jesus', 'Se Cathedral', 'Fontainhas', 'Latin Quarter']
    },
    {
      id: 4,
      name: 'Central Goa',
      description: 'Spice plantations and cultural experiences',
      image: 'https://i.pinimg.com/736x/cb/b0/93/cbb0932c7e9829997c2ce238b66305cf.jpg',
      highlights: ['Spice Gardens', 'Dudhsagar Falls', 'Bondla Wildlife', 'Traditional Villages']
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Goa Destinations
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From bustling beaches to serene villages, discover the diverse regions of Goa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link to={`/destinations/${destination.name.toLowerCase().replace(' ', '-')}`}>
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                    <p className="text-gray-200 mb-4">{destination.description}</p>

                    <div className="space-y-1">
                      {destination.highlights.map((highlight, idx) => (
                        <div key={idx} className="text-sm text-gray-300">
                          • {highlight}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-semibold">Explore {destination.name}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/destinations"
            className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <span>View All Destinations</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Beach Guide Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center transition-colors duration-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Complete Goa Beach Guide</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Discover all beaches from Polem in the south to Arambol in the north. Each beach has its own character,
            from turtle nesting sites to vibrant nightlife scenes.
          </p>
          <Link
            to="/destinations"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <span>Explore All Beaches</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Destinations;