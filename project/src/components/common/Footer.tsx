import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, ShieldAlert } from 'lucide-react';
import EmergencySOSModal from './EmergencySOSModal';

const Footer: React.FC = () => {
  const [showSOS, setShowSOS] = useState(false);

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-blue-600 text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">सुशेगाद<span className="text-blue-400">Goa</span></span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your trusted partner for exploring the beautiful beaches, rich Portuguese heritage, vibrant nightlife, and authentic culture of Goa.
            </p>
            <div className="flex space-x-4 pt-2">
              <Facebook className="h-5 w-5 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-slate-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-slate-400 hover:text-rose-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/tours" className="text-slate-300 hover:text-white transition-colors">Tours & Activities</Link></li>
              <li><Link to="/rentals" className="text-blue-400 font-semibold hover:text-white transition-colors">Scooter & Bike Rentals 🛵</Link></li>
              <li><Link to="/group-planner" className="text-amber-400 font-semibold hover:text-white transition-colors">Group Trip Planner 👥</Link></li>
              <li><Link to="/destinations" className="text-slate-300 hover:text-white transition-colors">Destinations</Link></li>
              <li><Link to="/nightlife" className="text-slate-300 hover:text-white transition-colors">Nightlife Explorer</Link></li>
            </ul>
          </div>

          {/* Safety Radar & Links */}
          <div>
            <h3 className="text-base font-bold text-white mb-4">Safety & Information</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setShowSOS(true)}
                  className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-2 transition-colors"
                >
                  <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" /> Emergency SOS Radar 🚨
                </button>
              </li>
              <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors">About Sushegaad Goa</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/events" className="text-slate-300 hover:text-white transition-colors">Upcoming Events Calendar</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-bold text-white mb-4">Contact & Assistance</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-slate-300">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-slate-300">support@sushegaadgoa.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-1" />
                <span className="text-slate-300">
                  123 Beach Road, Panaji<br />
                  Goa 403001, India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
            <p>© 2026 सुशेगादGoa. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency SOS Radar Modal */}
      <EmergencySOSModal
        isOpen={showSOS}
        onClose={() => setShowSOS(false)}
      />
    </footer>
  );
};

export default Footer;