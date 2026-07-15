import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Loader, CheckCircle, Compass, Route, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ItineraryItem {
  time: string;
  place: string;
  description: string;
  budget: string;
  distance: string;
  type: 'internal' | 'external';
  placeId?: number;
  placeCategory?: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryItem[];
}

const INTERESTS_OPTIONS = [
  { id: 'beaches', label: '🏖️ Pristine Beaches', category: 'Beaches' },
  { id: 'nightlife', label: '🎉 Nightlife & Clubs', category: 'Nightlife' },
  { id: 'history', label: '🏛️ Heritage & History', category: 'Heritage' },
  { id: 'adventure', label: '🏄 Adventure & Water Sports', category: 'Adventure' },
  { id: 'food', label: '🥘 Goan Food & Shacks', category: 'Food' },
  { id: 'spiritual', label: '🛕 Temples & Churches', category: 'Spiritual' },
  { id: 'nature', label: '🌲 Nature & Waterfalls', category: 'Nature' },
];

const AITripPlanner: React.FC = () => {
  // Load initial values from localStorage to persist state when hitting "back"
  const [days, setDays] = useState<number>(() => {
    const saved = localStorage.getItem('ai_planner_days');
    return saved ? parseInt(saved, 10) : 3;
  });
  const [budgetAmount, setBudgetAmount] = useState<number>(() => {
    const saved = localStorage.getItem('ai_planner_budget_amount');
    return saved ? parseInt(saved, 10) : 15000;
  });
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('ai_planner_currency') || 'INR';
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai_planner_interests');
    return saved ? JSON.parse(saved) : [];
  });
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(() => {
    const saved = localStorage.getItem('ai_planner_itinerary');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Sync state values to localStorage
  useEffect(() => {
    localStorage.setItem('ai_planner_days', days.toString());
  }, [days]);

  useEffect(() => {
    localStorage.setItem('ai_planner_budget_amount', budgetAmount.toString());
  }, [budgetAmount]);

  useEffect(() => {
    localStorage.setItem('ai_planner_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('ai_planner_interests', JSON.stringify(selectedInterests));
  }, [selectedInterests]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest!');
      return;
    }
    setLoading(true);
    setItinerary(null);
    localStorage.removeItem('ai_planner_itinerary');

    const formattedInterests = selectedInterests
      .map((id) => INTERESTS_OPTIONS.find((opt) => opt.id === id)?.category)
      .join(', ');

    try {
      const response = await fetch('http://localhost:5000/api/ai/plan-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days,
          budget: `${currency} ${budgetAmount}`,
          interests: formattedInterests,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setItinerary(data.itinerary);
        localStorage.setItem('ai_planner_itinerary', JSON.stringify(data.itinerary));
        toast.success('Your personalized Goan getaway is ready!');
      } else {
        toast.error(data.message || 'Failed to generate itinerary');
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDays(3);
    setBudgetAmount(15000);
    setCurrency('INR');
    setSelectedInterests([]);
    setItinerary(null);
    localStorage.removeItem('ai_planner_days');
    localStorage.removeItem('ai_planner_budget_amount');
    localStorage.removeItem('ai_planner_currency');
    localStorage.removeItem('ai_planner_interests');
    localStorage.removeItem('ai_planner_itinerary');
    toast.success('Planner reset successfully.');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 text-blue-600 dark:text-blue-400">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            AI Itinerary Planner
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Plan your trip to Goa in real-time. Select your duration, budget, and interests to generate a custom day-by-day plan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Trip Preferences
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center text-xs font-semibold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 gap-1 transition-colors"
                title="Reset preferences and itinerary"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Trip Duration (Days)
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-5 h-5 absolute left-3 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value, 10))}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Trip Budget
                </label>
                <div className="flex gap-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="py-2.5 px-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                  <div className="relative flex-grow flex items-center">
                    <DollarSign className="w-5 h-5 absolute left-3 text-gray-400" />
                    <input
                      type="number"
                      min="100"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(parseInt(e.target.value, 10) || 0)}
                      placeholder="Amount"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.id);
                    return (
                      <button
                        type="button"
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={`px-3 py-2 rounded-full text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {interest.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> Generating...
                  </>
                ) : (
                  'Plan My Trip'
                )}
              </button>
            </form>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-7">
            {itinerary ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Your Travel Plan
                  </h2>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full font-bold">
                    Goa Itinerary
                  </span>
                </div>

                {itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-6 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center mr-3 font-bold text-sm">
                        {day.day}
                      </span>
                      {day.title}
                    </h3>

                    <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 pl-6 space-y-8">
                      {day.activities.map((activity, idx) => {
                        const isInternal = activity.type === 'internal' && activity.placeId && activity.placeCategory;
                        const placeCategoryLower = activity.placeCategory ? activity.placeCategory.toLowerCase() : '';

                        return (
                          <div key={idx} className="relative">
                            {/* Dot marker */}
                            <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 bg-blue-600" />
                            
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                  {activity.time}
                                </span>
                                {activity.type === 'external' ? (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded font-semibold">
                                    Real-time External
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded font-semibold">
                                    Website Place
                                  </span>
                                )}
                                {activity.budget && (
                                  <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium flex items-center gap-0.5">
                                    <DollarSign className="w-3 h-3 text-gray-400" /> {activity.budget}
                                  </span>
                                )}
                                {activity.distance && (
                                  <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium flex items-center gap-0.5">
                                    <Route className="w-3 h-3 text-gray-400" /> {activity.distance}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                {isInternal ? (
                                  <Link 
                                    to={`/destination/${placeCategoryLower}/${activity.placeId}`} 
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1"
                                  >
                                    {activity.place}
                                    <span className="text-[10px] font-normal text-gray-400">(View Site Details)</span>
                                  </Link>
                                ) : (
                                  activity.place
                                )}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[350px] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-6 text-center shadow-sm">
                <Compass className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Ready to Plan?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  Fill in your choices on the left and click the button to design your Goan holiday program.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AITripPlanner;
