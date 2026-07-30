import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, ShieldAlert } from 'lucide-react';
import EmergencySOSModal from './EmergencySOSModal';

const Footer: React.FC = () => {
  const [showSOS, setShowSOS] = useState(false);

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-blue-600 text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">सुशेगाद<span className="text-blue-400">Goa</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your trusted travel portal for exploring beaches, heritage, nightlife, and local culture of Goa.
            </p>
            <div className="flex space-x-3 pt-1">
              <Facebook className="h-4 w-4 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-4 w-4 text-slate-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Twitter className="h-4 w-4 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube className="h-4 w-4 text-slate-400 hover:text-rose-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Col 2: Explore & Plan */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Explore & Plan</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/tours" className="text-slate-300 hover:text-white transition-colors">Tours & Activities</Link></li>
              <li><Link to="/rentals" className="text-slate-300 hover:text-white transition-colors">Vehicle Rentals</Link></li>
              <li><Link to="/destinations" className="text-slate-300 hover:text-white transition-colors">Destinations</Link></li>
              <li><Link to="/group-planner" className="text-slate-300 hover:text-white transition-colors">Group Trip Planner</Link></li>
            </ul>
          </div>

          {/* Col 3: Local Culture */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Local Experiences</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/marketplace" className="text-slate-300 hover:text-amber-400 transition-colors">Artisan Marketplace</Link></li>
              <li><Link to="/bundle-builder" className="text-slate-300 hover:text-purple-400 transition-colors">Vacation Bundles</Link></li>
              <li><Link to="/culinary-experiences" className="text-slate-300 hover:text-rose-400 transition-colors">Culinary & Dining</Link></li>
              <li><Link to="/konkani-phrasebook" className="text-slate-300 hover:text-teal-400 transition-colors">Konkani Phrasebook</Link></li>
              <li><Link to="/eco-tourism" className="text-slate-300 hover:text-emerald-400 transition-colors">Eco-Tourism Hub</Link></li>
            </ul>
          </div>

          {/* Col 4: Safety & Partners */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Safety & Partners</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setShowSOS(true)}
                  className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-500 animate-pulse" /> Emergency SOS
                </button>
              </li>
              <li><Link to="/vendor/register" className="text-blue-400 font-semibold hover:text-white transition-colors">Partner With Us</Link></li>
              <li><Link to="/events" className="text-slate-300 hover:text-white transition-colors">Events Calendar</Link></li>
              <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Contact Support</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="text-slate-300">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="text-slate-300">support@sushegaadgoa.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Panaji, Goa 403001</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <p>© 2026 सुशेगादGoa. All rights reserved.</p>
            <div className="flex space-x-6">
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