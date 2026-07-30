import React, { useState } from 'react';
import { Leaf, ShieldCheck, TreePine, Recycle, Calculator, Heart, MapPin, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ECO_INITIATIVES = [
  {
    id: 'eco-1',
    title: 'Anjuna & Arambol Beach Clean-up Drive',
    organizer: 'Goa Clean Seas NGO',
    date: 'Every Saturday, 7:00 AM',
    location: 'North Goa Coastline',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800',
    participants: 140,
    impact: '2.4 Tons plastic collected monthly'
  },
  {
    id: 'eco-2',
    title: 'Dr. Salim Ali Bird Sanctuary Kayak Eco-Tour',
    organizer: 'Chorao Mangrove Alliance',
    date: 'Daily Morning & Evening',
    location: 'Chorao Island',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    participants: 85,
    impact: 'Silent electric & paddle kayaks preserving bird habitats'
  },
  {
    id: 'eco-3',
    title: 'Netravali Forest & Spice Eco-Homestay Certification',
    organizer: 'South Goa Wildlife Trust',
    date: 'Year-Round',
    location: 'Sanguem, South Goa',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    participants: 45,
    impact: '100% solar powered & rain-harvested zero plastic stay'
  }
];

const EcoTourism: React.FC = () => {
  // Travel Carbon Calculator State
  const [transportMode, setTransportMode] = useState<'flight' | 'train' | 'car'>('flight');
  const [distanceKm, setDistanceKm] = useState<number>(600); // e.g. Mumbai to Goa ~ 550-600km
  const [travelers, setTravelers] = useState<number>(2);

  // Carbon factor: Flight ~ 0.15kg/km, Train ~ 0.04kg/km, Car ~ 0.12kg/km per person
  const factor = transportMode === 'flight' ? 0.15 : transportMode === 'train' ? 0.04 : 0.12;
  const estimatedCO2Kg = Math.round(distanceKm * factor * travelers);
  const saplingsNeeded = Math.max(1, Math.ceil(estimatedCO2Kg / 20)); // 1 mangrove sapling offsets ~ 20kg CO2 per year

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white p-8 md:p-12 mb-10 shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <Leaf className="w-3.5 h-3.5 text-emerald-300" />
              <span>Responsible Travel & Heritage Preservation</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Eco-Tourism & Sustainability 🌿
            </h1>
            <p className="text-emerald-100 text-base md:text-lg mb-6">
              Keep Goa green and pristine! Discover eco-certified stays, join ocean clean-up drives, and calculate your travel carbon footprint to plant mangrove saplings in Zuari estuary.
            </p>
          </div>
        </div>

        {/* Carbon Calculator */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg mb-12">
          <div className="flex items-center space-x-3 mb-6 border-b pb-4 border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Goa Travel Carbon Footprint Calculator
              </h2>
              <p className="text-xs text-slate-500">Estimate your trip emissions and offset by planting trees in Goa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Mode of Transport to Goa</label>
              <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
                {(['flight', 'train', 'car'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTransportMode(m)}
                    className={`flex-1 py-2 text-xs font-bold capitalize rounded-xl transition ${
                      transportMode === m ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">One-Way Distance (KM)</label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseInt(e.target.value) || 100)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Number of Travelers</label>
              <input
                type="number"
                min="1"
                max="20"
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold"
              />
            </div>
          </div>

          {/* Calculator Output */}
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-md">
                <TreePine className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Estimated Carbon Impact</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {estimatedCO2Kg} kg CO₂ <span className="text-xs font-normal text-slate-500">({saplingsNeeded} Mangrove Saplings to offset)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                toast.success(`Thank you! ₹${saplingsNeeded * 100} pledged to plant ${saplingsNeeded} Mangrove saplings in Goa!`);
              }}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg transition text-xs flex items-center justify-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Plant {saplingsNeeded} Mangroves (₹{saplingsNeeded * 100})</span>
            </button>
          </div>
        </div>

        {/* Eco Initiatives List */}
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
          Community Eco-Drives & Green Stays 🌊
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ECO_INITIATIVES.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-xl">
                    Eco Certified
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 mb-3">
                    Organized by <strong>{item.organizer}</strong>
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs text-slate-600 dark:text-slate-300 font-medium">
                    🌱 {item.impact}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <button
                  onClick={() => toast.success(`Registered as volunteer for ${item.title}!`)}
                  className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-2xl text-xs transition"
                >
                  Join / Volunteer Drive
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EcoTourism;
