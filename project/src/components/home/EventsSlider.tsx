import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  location: string;
  image_url: string;
  category: string;
  price: string;
}

const EventsSlider: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events/live');
        const data = await response.json();
        if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching live events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="flex gap-4 overflow-hidden w-full max-w-5xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[300px] h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return null; // Hide section if no events
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Live & Upcoming Events
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Discover the most exciting festivals, parties, and cultural events happening in Goa right now.
            </p>
          </div>
          <Link to="/events" className="hidden md:flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium">
            View All Events <ExternalLink className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[320px] md:min-w-[400px] snap-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group border border-gray-100 dark:border-gray-700"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 px-3 py-1 rounded-full text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {event.category || 'Event'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                    {new Date(event.start_date).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 md:hidden text-center">
          <Link to="/events" className="inline-flex items-center text-teal-600 dark:text-teal-400 font-medium">
            View All Events <ExternalLink className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSlider;
