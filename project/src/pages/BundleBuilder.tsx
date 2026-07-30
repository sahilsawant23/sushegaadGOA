import React, { useState } from 'react';
import { BundleItem } from '../types';
import { Sparkles, CheckCircle2, ShoppingCart, Percent, Compass, Home, Car, Anchor, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

const BUNDLE_OPTIONS: BundleItem[] = [
  // Stays
  {
    id: 'stay-1',
    category: 'stay',
    title: 'Luxury Heritage Portuguese Villa with Pool',
    subtitle: 'Private 3BHK Villa in Anjuna',
    pricePerDay: 4500,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    location: 'Anjuna, North Goa',
    features: ['Private Pool', 'Complimentary Breakfast', 'High-speed Wi-Fi']
  },
  {
    id: 'stay-2',
    category: 'stay',
    title: 'Sea-View Luxury Beach Cottage',
    subtitle: 'Wooden Eco Shack on Palolem Beach',
    pricePerDay: 2800,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    location: 'Palolem, South Goa',
    features: ['Direct Beach Access', 'Air Conditioned', 'Sunset Balcony']
  },
  // Transport
  {
    id: 'trans-1',
    category: 'transport',
    title: 'Mahindra Thar Convertible 4x4',
    subtitle: 'Self-drive open top SUV',
    pricePerDay: 3200,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    location: 'Panjim / Airport Delivery',
    features: ['Unlimited KMs', 'Full Insurance', 'Free Helmet/Accessories']
  },
  {
    id: 'trans-2',
    category: 'transport',
    title: 'Vespa Retro Scooter / Honda Activa 6G',
    subtitle: 'Easy beach cruiser scooter',
    pricePerDay: 450,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    location: 'All Goa Delivery',
    features: ['2 Helmets included', 'Fuel Full-to-Full', '24/7 Roadside Assistance']
  },
  // Activity
  {
    id: 'act-1',
    category: 'activity',
    title: 'Grande Island Scuba Diving & Snorkeling',
    subtitle: 'Includes boat trip + PADI instructor',
    pricePerDay: 2500,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    location: 'Sinquerim Jetty',
    features: ['Underwater HD Videos', 'Breakfast & Buffet Lunch', 'No Swimming Needed']
  },
  {
    id: 'act-2',
    category: 'activity',
    title: '5-in-1 Baga Water Sports Combo',
    subtitle: 'Parasailing + Jet Ski + Banana Boat',
    pricePerDay: 1800,
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    location: 'Baga Beach',
    features: ['Safety Life Jackets', 'Certified Instructors', 'Parasailing Dip included']
  },
  // Experience
  {
    id: 'exp-1',
    category: 'experience',
    title: 'Mandovi Luxury Sunset Catamaran Cruise',
    subtitle: 'Live Goan Folk Dance & Drinks',
    pricePerDay: 1200,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    location: 'Panjim River Cruise Jetty',
    features: ['Live DJ & Cultural Show', 'Welcome Drink & Snacks', '2 Hour Sunset Sail']
  },
  {
    id: 'exp-2',
    category: 'experience',
    title: 'Sahakari Spice Plantation Guided Feast',
    subtitle: 'Botanical tour + Traditional buffet',
    pricePerDay: 800,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    location: 'Ponda',
    features: ['Herbal Tea Welcome', 'Banana Leaf Lunch', 'Spice Garland Greeting']
  }
];

const BundleBuilder: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<{
    stay?: BundleItem;
    transport?: BundleItem;
    activity?: BundleItem;
    experience?: BundleItem;
  }>({});

  const [days, setDays] = useState<number>(3);

  const categories: { key: 'stay' | 'transport' | 'activity' | 'experience'; label: string; icon: React.ReactNode }[] = [
    { key: 'stay', label: '1. Choose Stay', icon: <Home className="w-4 h-4" /> },
    { key: 'transport', label: '2. Choose Ride', icon: <Car className="w-4 h-4" /> },
    { key: 'activity', label: '3. Water Sport / Adventure', icon: <Anchor className="w-4 h-4" /> },
    { key: 'experience', label: '4. Culture / Cruise', icon: <Sun className="w-4 h-4" /> }
  ];

  const handleSelect = (category: 'stay' | 'transport' | 'activity' | 'experience', item: BundleItem) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: prev[category]?.id === item.id ? undefined : item
    }));
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  let discountRate = 0;
  if (selectedCount === 2) discountRate = 0.10;
  else if (selectedCount === 3) discountRate = 0.18;
  else if (selectedCount === 4) discountRate = 0.25;

  const rawTotal = Object.values(selectedItems)
    .filter(Boolean)
    .reduce((sum, item) => sum + (item?.pricePerDay || 0) * (item?.category === 'stay' || item?.category === 'transport' ? days : 1), 0);

  const discountAmount = Math.round(rawTotal * discountRate);
  const finalTotal = rawTotal - discountAmount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-8 md:p-12 mb-10 shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Smart Bundle Discount Engine</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Dynamic Vacation Bundle Builder 🧳
            </h1>
            <p className="text-blue-100 text-base md:text-lg mb-6">
              Combine your Villa Stay + Scooter/Car + Scuba/Sports + Sunset Cruise into one master itinerary and unlock up to <strong>25% instant bundle savings</strong>!
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20 text-xs font-semibold">
                <span>Days of Trip:</span>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={days}
                  onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 px-2 py-1 rounded-lg bg-white text-slate-900 font-bold text-center"
                />
              </div>

              <div className="flex items-center space-x-2 bg-yellow-400 text-slate-900 px-4 py-2 rounded-2xl font-bold text-xs shadow-md">
                <Percent className="w-4 h-4" />
                <span>Current Discount Level: {(discountRate * 100).toFixed(0)}% OFF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress discount bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-10">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
            <span>Bundle Discount Meter ({selectedCount} of 4 categories selected)</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{discountRate * 100}% Savings</span>
          </h3>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500"
              style={{ width: `${(selectedCount / 4) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs mt-3 font-semibold text-slate-500 dark:text-slate-400">
            <span className={selectedCount >= 1 ? 'text-indigo-600 dark:text-indigo-400' : ''}>1 Item (Base)</span>
            <span className={selectedCount >= 2 ? 'text-indigo-600 dark:text-indigo-400' : ''}>2 Items (10% OFF)</span>
            <span className={selectedCount >= 3 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>3 Items (18% OFF)</span>
            <span className={selectedCount >= 4 ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : ''}>4 Items (25% MAX OFF)</span>
          </div>
        </div>

        {/* Selection Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {categories.map(({ key, label, icon }) => (
            <div key={key} className="space-y-4">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800">
                <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
                  {icon}
                </span>
                <span>{label}</span>
              </div>

              {BUNDLE_OPTIONS.filter((o) => o.category === key).map((item) => {
                const isSelected = selectedItems[key]?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(key, item)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full shadow">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2 border-slate-100 dark:border-slate-800 mt-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        ₹{item.pricePerDay.toLocaleString('en-IN')} {key === 'stay' || key === 'transport' ? '/day' : '/person'}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Master Summary Card */}
        <div className="sticky bottom-6 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-indigo-600/30 rounded-2xl border border-indigo-500/30">
              <Compass className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block">
                Your Custom Vacation Package ({days} Days Trip)
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-white">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
                {discountAmount > 0 && (
                  <span className="text-sm line-through text-slate-400">
                    ₹{rawTotal.toLocaleString('en-IN')}
                  </span>
                )}
                {discountAmount > 0 && (
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    Saved ₹{discountAmount.toLocaleString('en-IN')}!
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (selectedCount === 0) {
                toast.error('Please select at least 1 item to build your bundle!');
                return;
              }
              toast.success(`Booked Custom ${selectedCount}-Item Goa Package!`);
            }}
            className="w-full md:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Book Entire Bundle (1-Click)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BundleBuilder;
