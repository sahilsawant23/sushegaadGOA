import React, { useState } from 'react';
import { CULINARY_EXPERIENCES } from '../data/culinaryData';
import { CulinaryExperience } from '../types';
import { Utensils, Star, MapPin, Users, Clock, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CulinaryExperiences: React.FC = () => {
  const [experiences] = useState<CulinaryExperience[]>(CULINARY_EXPERIENCES);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<CulinaryExperience | null>(null);

  const filters = ['All', 'Home Dine', 'Cooking Masterclass', 'Spice Plantation Lunch'];

  const filteredExps = experiences.filter((e) =>
    selectedFilter === 'All' ? true : e.type === selectedFilter
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-rose-600 to-red-700 text-white p-8 md:p-12 mb-10 shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-4">
              <Utensils className="w-3.5 h-3.5" />
              <span>Authentic Local Food Culture</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Goan Culinary & Home Dining 🥘
            </h1>
            <p className="text-rose-100 text-base md:text-lg mb-6">
              Dine inside 200-year-old ancestral Goan homes, learn secret spice recipes (*Xacuti, Vindaloo, Sol Kadi*) from Goan grandmothers, and experience traditional farm feasts.
            </p>

            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                    selectedFilter === f
                      ? 'bg-white text-rose-900 shadow-md'
                      : 'bg-black/20 text-white hover:bg-black/30'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredExps.map((exp) => (
            <div
              key={exp.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-xl">
                    {exp.type}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-900 dark:text-white text-xs font-bold px-3 py-1 rounded-xl flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{exp.rating} ({exp.reviewCount})</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 text-xs text-rose-600 dark:text-rose-400 font-bold mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location} • Hosted by {exp.hostName}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {exp.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-3 mb-4">
                    {exp.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {exp.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-auto flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Per Person</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{exp.pricePerPerson.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => {
                    toast.success(`Booked ${exp.title}! Host ${exp.hostName} notified.`);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition"
                >
                  Reserve Meal Slot 🍽️
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CulinaryExperiences;
