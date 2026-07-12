import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Check, Clock, DollarSign } from 'lucide-react';
import { goaAuthenticExperiences } from '../data/authenticData';

const AuthenticDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const experience = goaAuthenticExperiences.find((exp) => exp.id === Number(id));

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience not found</h2>
          <button
            onClick={() => navigate('/destinations')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white sticky top-16 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/destinations')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Destinations</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="h-64 md:h-80 overflow-hidden">
            <img
              src={experience.image}
              alt={experience.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {experience.name}
              </h1>
              <p className="text-gray-600 mb-3">
                {experience.type} • {experience.region}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <span className="inline-flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{experience.location}</span>
                </span>
                <span className="inline-flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{experience.duration}</span>
                </span>
                <span className="inline-flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>{experience.price}</span>
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Experience Overview</h2>
              <p className="text-gray-700 leading-relaxed">{experience.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-3">Highlights</h2>
                <ul className="space-y-2">
                  {experience.highlights.map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">What&apos;s Included</h2>
                <ul className="space-y-2">
                  {experience.includes.map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-3">Best Time To Experience</h2>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                  {experience.bestTimeToVisit}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">Travel Tip</h2>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  Located about {experience.distanceFromPanaji} from Panaji, this is a perfect half-day
                  experience to combine with nearby attractions and local food spots.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-gray-700">
              <h3 className="font-semibold mb-2">Suggested Itinerary</h3>
              <p className="mb-1">
                • Start from Panaji and arrive at {experience.location} ({experience.distanceFromPanaji}).
              </p>
              <p className="mb-1">
                • Spend the first hour getting introduced to the experience and meeting your local hosts.
              </p>
              <p className="mb-1">
                • Next {experience.duration.toLowerCase()} enjoying key highlights like{' '}
                {experience.highlights.slice(0, 3).join(', ')}.
              </p>
              <p>
                • Wrap up with a relaxed conversation with locals and plan nearby visits to complete your
                authentic Goan day.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthenticDetails;


