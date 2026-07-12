import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, MapPin, Heart } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Happy Travelers', value: '10,000+' },
    { icon: Award, label: 'Years Experience', value: '15+' },
    { icon: MapPin, label: 'Tour Packages', value: '50+' },
    { icon: Heart, label: 'Customer Rating', value: '4.9/5' }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Born and raised in Goa, Rajesh has been exploring every corner of this beautiful state for over 20 years.'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Tours',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'With a background in hospitality, Priya ensures every tour is perfectly planned and executed.'
    },
    {
      name: 'Carlos D\'Souza',
      role: 'Heritage Guide',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Carlos specializes in Goa\'s Portuguese heritage and brings history to life through his storytelling.'
    }
  ];

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1600&q=80"
            alt="About Us"
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
              About GoaExplorer
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your trusted partner in discovering the magic, beauty, and culture of Goa
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Founded in 2009, GoaExplorer was born from a passion for sharing the incredible beauty and rich culture of Goa with travelers from around the world. What started as a small local tour company has grown into one of Goa's most trusted tourism partners.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We believe that travel is not just about seeing places, but about experiencing cultures, meeting people, and creating memories that last a lifetime. Our team of local experts and passionate guides are dedicated to showing you the real Goa - beyond the typical tourist spots.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                From the pristine beaches of the coast to the spice plantations of the interior, from ancient Portuguese churches to vibrant local markets, we curate experiences that capture the true essence of this incredible destination.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://files.worldsbestweddingphotos.com/s3fs-public/inline-images/proud-groom-with-groomsmen-julien-laurent-georges.jpg?VersionId=wy8kUonDARPQ_IpFiuhwaZ864KBgw.3q"
                alt="About GoaExplorer"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg transition-colors duration-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg transition-colors duration-200">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To provide authentic, memorable, and sustainable tourism experiences that showcase the best of Goa while supporting local communities and preserving our natural and cultural heritage for future generations.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg transition-colors duration-200">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To be recognized as the leading provider of exceptional tourism experiences in Goa, known for our commitment to quality, sustainability, and authentic local insights that create lasting memories for our guests.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transition-colors duration-200"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transition-colors duration-200">
              <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Authenticity</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">We showcase the real Goa through genuine local experiences.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transition-colors duration-200">
              <div className="bg-green-100 dark:bg-green-900/40 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">We strive for excellence in every aspect of our service.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transition-colors duration-200">
              <div className="bg-orange-100 dark:bg-orange-900/40 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Community</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">We support and work closely with local communities.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transition-colors duration-200">
              <div className="bg-purple-100 dark:bg-purple-900/40 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Sustainability</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">We promote responsible tourism that protects our environment.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;