import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      comment: 'Amazing experience! The tour guides were knowledgeable and friendly. Goa exceeded all my expectations.',
      tour: 'North Goa Beach Hopping',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      name: 'Raj Patel',
      location: 'Mumbai, India',
      rating: 5,
      comment: 'Perfect family vacation! Kids loved the water sports and we enjoyed the cultural tours. Highly recommended.',
      tour: 'Cultural Immersion Experience',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      location: 'London, UK',
      rating: 5,
      comment: 'The heritage walk was fascinating! Learning about Goa\'s Portuguese history was incredible.',
      tour: 'Heritage Walk through Old Goa',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  return (
    <section className="py-16 bg-blue-50 dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Read authentic reviews from our happy customers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <Quote className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.comment}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{testimonial.tour}</p>
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
          className="text-center mt-12"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg inline-block transition-colors duration-200">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">4.9</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">1,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;