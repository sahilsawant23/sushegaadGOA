import React from 'react';
import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import FeaturedTours from '../components/home/FeaturedTours';
import Destinations from '../components/home/Destinations';
import Testimonials from '../components/home/Testimonials';
import EventsSlider from '../components/home/EventsSlider';
import RentalBanner from '../components/home/RentalBanner';

const Home: React.FC = () => {
  return (
    <div className="relative">
      <SEO 
        title="Sushegaad GOA - Discover Paradise, Stays, Tours & Self-Drive Rentals"
        description="Plan your dream trip to Goa with authentic local experiences, verified shacks, private tours, watersports, and self-drive car rentals."
      />
      <Hero />
      <FeaturedTours />
      <RentalBanner />
      <EventsSlider />
      <Destinations />
      <Testimonials />
    </div>
  );
};

export default Home;
