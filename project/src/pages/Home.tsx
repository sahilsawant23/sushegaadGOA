import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedTours from '../components/home/FeaturedTours';
import Destinations from '../components/home/Destinations';
import Testimonials from '../components/home/Testimonials';
import EventsSlider from '../components/home/EventsSlider';
import RentalBanner from '../components/home/RentalBanner';

const Home: React.FC = () => {
  return (
    <div className="relative">
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
