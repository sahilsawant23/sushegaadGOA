import React from 'react';
import { Link } from 'react-router-dom';
import { Bike, ShieldCheck, MapPin, Zap, ChevronRight } from 'lucide-react';

export const RentalBanner: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-gray-950 font-bold text-xs">
              <Zap className="h-3.5 w-3.5 fill-current" /> Self-Drive Transport Hub
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Rent Scooters, Royal Enfields & Thar Jeeps in Goa 🛵
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Explore North & South Goa at your own pace with verified commercial yellow-plate rentals. Free pickup at MOPA Airport, Dabolim Airport, Thivim & beach hubs.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-blue-200 font-medium">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> 100% Legal Yellow Plates
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <MapPin className="h-4 w-4 text-cyan-400" /> 8 Pickup Hubs
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Bike className="h-4 w-4 text-amber-400" /> Free ISI Helmets
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
            <Link
              to="/rentals"
              className="btn-primary !text-lg !px-8 !py-4 shadow-xl hover:scale-105 transition-all"
            >
              Browse Rental Fleet 🛵
              <ChevronRight className="h-5 w-5" />
            </Link>
            <span className="text-[11px] text-gray-300 text-center font-medium">Starting at just ₹450/day</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalBanner;
