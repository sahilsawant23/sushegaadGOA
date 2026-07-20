import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">सुशेगादGoa</span>
            </div>
            <p className="text-gray-300">
              Your trusted partner for exploring the beautiful beaches, rich heritage, and vibrant culture of Goa.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/tours" className="text-gray-300 hover:text-white transition-colors">Tours</Link></li>
              <li><Link to="/rentals" className="text-blue-400 font-semibold hover:text-white transition-colors">Scooter & Bike Rentals 🛵</Link></li>
              <li><Link to="/destinations" className="text-gray-300 hover:text-white transition-colors">Destinations</Link></li>
              <li><Link to="/places" className="text-gray-300 hover:text-white transition-colors">Places & Nightlife</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white transition-colors">Events Calendar</Link></li>
            </ul>
          </div>

          {/* Tour Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tour Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/tours?category=Beach" className="text-gray-300 hover:text-white transition-colors">Beach Tours</Link></li>
              <li><Link to="/tours?category=Heritage" className="text-gray-300 hover:text-white transition-colors">Heritage Walks</Link></li>
              <li><Link to="/tours?category=Adventure" className="text-gray-300 hover:text-white transition-colors">Adventure Sports</Link></li>
              <li><Link to="/tours?category=Culture" className="text-gray-300 hover:text-white transition-colors">Cultural Tours</Link></li>
              <li><Link to="/tours?category=Food" className="text-gray-300 hover:text-white transition-colors">Food Tours</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">info@goaexplorer.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                <span className="text-gray-300">
                  123 Beach Road, Panaji<br />
                  Goa 403001, India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 सुशेगादGoa. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;