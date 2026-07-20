import React, { useState, useMemo } from 'react';
import { 
  Bike, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Star, 
  Info, 
  ChevronRight, 
  Filter, 
  Search, 
  Fuel, 
  Gauge, 
  Users, 
  Sparkles,
  HelpCircle,
  FileCheck,
  AlertTriangle,
  X,
  CreditCard,
  Printer
} from 'lucide-react';
import { 
  RENTAL_VEHICLES, 
  PICKUP_HUBS, 
  RENTAL_ADDONS, 
  GOA_SAFETY_RULES, 
  RENTAL_FAQS, 
  RentalVehicle, 
  PickupHub 
} from '../data/rentalsData';
import { toast } from 'react-hot-toast';

export const Rentals: React.FC = () => {
  // Search & Filter State
  const [selectedHub, setSelectedHub] = useState<string>('calangute-hub');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Date State (Defaults: Pick up tomorrow, drop off in 3 days)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDrop = new Date(tomorrow);
  defaultDrop.setDate(defaultDrop.getDate() + 3);

  const [pickupDate, setPickupDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [dropoffDate, setDropoffDate] = useState<string>(defaultDrop.toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState<string>('09:00');
  const [dropoffTime, setDropoffTime] = useState<string>('18:00');

  // Booking Modal State
  const [activeVehicle, setActiveVehicle] = useState<RentalVehicle | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['damage-cover']);
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
    drivingLicense: '',
    notes: ''
  });

  // Confirmed Booking Voucher State
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    vehicle: RentalVehicle;
    hub: PickupHub;
    days: number;
    totalAmount: number;
    deposit: number;
    customer: typeof customerDetails;
    addons: string[];
    pickupDate: string;
    dropoffDate: string;
  } | null>(null);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    if (!pickupDate || !dropoffDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [pickupDate, dropoffDate]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return RENTAL_VEHICLES.filter(v => {
      const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.popularFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Total Price calculation for booking modal
  const activeHubObj = useMemo(() => {
    return PICKUP_HUBS.find(h => h.id === selectedHub) || PICKUP_HUBS[0];
  }, [selectedHub]);

  const priceCalculation = useMemo(() => {
    if (!activeVehicle) return { base: 0, addonsTotal: 0, tax: 0, grandTotal: 0, deposit: 0 };
    const base = activeVehicle.dailyPrice * rentalDays;
    const addonsTotal = RENTAL_ADDONS
      .filter(a => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + (a.pricePerDay * rentalDays), 0);
    const subtotal = base + addonsTotal;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const grandTotal = subtotal + tax;
    return {
      base,
      addonsTotal,
      tax,
      grandTotal,
      deposit: activeVehicle.deposit
    };
  }, [activeVehicle, rentalDays, selectedAddons]);

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerDetails.fullName || !customerDetails.phone || !customerDetails.drivingLicense) {
      toast.error('Please fill in your name, phone number, and Driving License number.');
      return;
    }

    const processConfirmation = async (paymentId?: string) => {
      const bookingId = 'GOA-RENT-' + Math.floor(100000 + Math.random() * 900000);
      const bookingData = {
        bookingId,
        customerName: customerDetails.fullName,
        customerEmail: customerDetails.email || 'customer@example.com',
        customerPhone: customerDetails.phone,
        drivingLicense: customerDetails.drivingLicense,
        vehicleName: activeVehicle?.name,
        category: activeVehicle?.category,
        dailyPrice: activeVehicle?.dailyPrice,
        rentalDays,
        pickupHub: activeHubObj.name,
        pickupDate: `${pickupDate} at ${pickupTime}`,
        dropoffDate: `${dropoffDate} at ${dropoffTime}`,
        totalAmount: priceCalculation.grandTotal,
        deposit: priceCalculation.deposit,
        paymentId: paymentId || 'pay_RZP_OFFLINE_' + Date.now(),
        paymentStatus: 'PAID'
      };

      setConfirmedBooking({
        bookingId,
        vehicle: activeVehicle!,
        hub: activeHubObj,
        days: rentalDays,
        totalAmount: priceCalculation.grandTotal,
        deposit: priceCalculation.deposit,
        customer: { ...customerDetails },
        addons: [...selectedAddons],
        pickupDate: `${pickupDate} at ${pickupTime}`,
        dropoffDate: `${dropoffDate} at ${dropoffTime}`
      });

      // Send rental booking to backend server for Admin Dashboard
      try {
        await fetch('http://localhost:5000/api/rentals/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
      } catch (err) {}

      toast.success(paymentId 
        ? `Razorpay Payment Successful! Txn ID: ${paymentId}` 
        : 'Vehicle booking confirmed! Voucher generated.'
      );
      setActiveVehicle(null);
    };

    // Trigger Razorpay Checkout Popup
    if (typeof (window as any).Razorpay !== 'undefined') {
      try {
        const options = {
          key: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_TDstsI3dZOt2yf',
          amount: Math.round(priceCalculation.grandTotal * 100), // amount in paise
          currency: 'INR',
          name: 'Sushegaad GOA Rentals',
          description: `Self Drive ${activeVehicle?.name} (${rentalDays} Days)`,
          image: activeVehicle?.image,
          handler: function (response: any) {
            processConfirmation(response.razorpay_payment_id || 'RZP_SUCCESS');
          },
          prefill: {
            name: customerDetails.fullName,
            email: customerDetails.email,
            contact: customerDetails.phone
          },
          notes: {
            vehicle: activeVehicle?.name,
            license: customerDetails.drivingLicense,
            hub: activeHubObj.name
          },
          theme: {
            color: '#2563eb'
          }
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.open();
      } catch (err) {
        console.error('Razorpay launch error:', err);
        processConfirmation();
      }
    } else {
      processConfirmation();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 text-white py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-gray-950 mb-4 shadow-sm">
              <Zap className="h-3.5 w-3.5 fill-current" /> Official Yellow-Plate Self Drive Rentals
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Explore Goa On Wheels 🛵
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Rent verified scooters, Royal Enfields, retro Vespas, and convertible Jeeps with zero hassle. Instant airport & beach hub pickups with free helmets and 24/7 roadside assistance.
            </p>
          </div>

          {/* Quick Search & Hub Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pickup Hub */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Pickup Hub Location
                </label>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {PICKUP_HUBS.map(hub => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name} ({hub.region})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup Date & Time */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Pickup Date & Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-28 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dropoff Date & Time */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Return Date & Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    className="w-28 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rental Summary pill */}
              <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-700/50 p-3 rounded-xl border border-blue-100 dark:border-gray-600">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Duration</div>
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{rentalDays} Day{rentalDays > 1 ? 's' : ''}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Selected Hub</div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[120px]">
                    {activeHubObj.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Fleet', icon: Bike },
              { id: 'scooter', label: 'Scooters', icon: Bike },
              { id: 'cruiser', label: 'Royal Enfields & Cruisers', icon: Gauge },
              { id: 'electric', label: 'Electric EV', icon: Zap },
              { id: 'jeep', label: 'Jeeps & Cars', icon: Fuel }
            ].map(cat => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`chip-button ${
                    selectedCategory === cat.id
                      ? 'chip-button-active'
                      : 'chip-button-inactive'
                  }`}
                >
                  <IconComp className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Activa, RE, Vespa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Bike className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold">No vehicles match your search</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Try selecting a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                {/* Vehicle Image & Badge */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden group">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                    {vehicle.type === 'scooter' ? '🛵 Scooter' : vehicle.type === 'cruiser' ? '🏍️ Cruiser Bike' : vehicle.type === 'electric' ? '⚡ EV' : '🚗 Car / SUV'}
                  </div>
                  {vehicle.badge && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-gray-950 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md">
                      {vehicle.badge}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-4">
                      💡 {vehicle.popularFor}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl text-xs mb-4 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
                      <div className="flex flex-col items-center text-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{vehicle.engineCc}</span>
                        <span className="text-[10px] text-gray-400">Power</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-x border-gray-200 dark:border-gray-600">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{vehicle.transmission}</span>
                        <span className="text-[10px] text-gray-400">Gear</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{vehicle.mileage}</span>
                        <span className="text-[10px] text-gray-400">Efficiency</span>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{vehicle.dailyPrice}</span>
                          <span className="text-xs text-gray-500 font-medium">/day</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium">
                          Deposit: ₹{vehicle.deposit} (Refundable)
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveVehicle(vehicle)}
                        className="btn-primary !px-5 !py-2.5 !text-sm shadow-md hover:shadow-lg transition-all"
                      >
                        Book Now
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Safety & Legal Guidelines Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-6 mb-16">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">
              Goa Tourist Self-Drive Safety & Legal Guidelines
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {GOA_SAFETY_RULES.map((rule, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40">
                <div className="text-2xl mb-2">{rule.icon}</div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">{rule.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Accordion Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RENTAL_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-xl">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2 flex items-start gap-2">
                  <span className="text-blue-600 font-bold">Q:</span> {faq.q}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {activeVehicle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 relative">
            <button
              onClick={() => setActiveVehicle(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <img
                src={activeVehicle.image}
                alt={activeVehicle.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0"
              />
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 mb-1">
                  {activeVehicle.categoryLabel}
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {activeVehicle.name}
                </h2>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                  <span>₹{activeVehicle.dailyPrice}/day</span>
                  <span>•</span>
                  <span>{rentalDays} Days Rental</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">1 Free Helmet Included</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Pickup Location Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-600 text-xs">
                <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Pickup & Dropoff Hub: <span className="text-blue-600 dark:text-blue-400 font-bold">{activeHubObj.name}</span>
                </div>
                <div className="text-gray-500 dark:text-gray-400 pl-5">
                  {activeHubObj.landmark} — {activeHubObj.address}
                </div>
                <div className="mt-2 text-gray-600 dark:text-gray-300 pl-5 flex items-center gap-3 font-medium">
                  <span>📅 Pickup: {pickupDate} ({pickupTime})</span>
                  <span>➔</span>
                  <span>📅 Drop: {dropoffDate} ({dropoffTime})</span>
                </div>
              </div>

              {/* Add-ons selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Optional Add-ons & Coverage
                </label>
                <div className="space-y-2">
                  {RENTAL_ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span>{addon.name}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">+₹{addon.pricePerDay * rentalDays} ({rentalDays}d)</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{addon.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Info Form */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Rider Information & Verification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name (as on Driving License)"
                      required
                      value={customerDetails.fullName}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, fullName: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number (WhatsApp)"
                      required
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Driving License No. (e.g. GA-01-2022-1234)"
                      required
                      value={customerDetails.drivingLicense}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, drivingLicense: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-gray-50 dark:bg-gray-900/70 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Vehicle Rate (₹{activeVehicle.dailyPrice} × {rentalDays} days)</span>
                  <span>₹{priceCalculation.base}</span>
                </div>
                {priceCalculation.addonsTotal > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Selected Add-ons</span>
                    <span>₹{priceCalculation.addonsTotal}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>GST (5%)</span>
                  <span>₹{priceCalculation.tax}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold border-t pt-2 border-gray-200 dark:border-gray-700">
                  <span>Refundable Security Deposit (Paid at Hub)</span>
                  <span>₹{priceCalculation.deposit}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 dark:text-white pt-1">
                  <span>Total Rental Amount</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{priceCalculation.grandTotal}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <CreditCard className="h-4 w-4" /> Pay ₹{priceCalculation.grandTotal} via Razorpay & Confirm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMED BOOKING VOUCHER MODAL */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
            <button
              onClick={() => setConfirmedBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Voucher Badge */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/60 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600 dark:text-emerald-300">
                <FileCheck className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Rental Voucher Confirmed!</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Booking ID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{confirmedBooking.bookingId}</span></p>
            </div>

            {/* Voucher Details */}
            <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-xs border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-500">Vehicle Rented:</span>
                <span className="font-bold text-sm">{confirmedBooking.vehicle.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Rider Name:</span>
                <span className="font-semibold">{confirmedBooking.customer.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Driving License:</span>
                <span className="font-mono font-semibold uppercase">{confirmedBooking.customer.drivingLicense}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Pickup Hub:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{confirmedBooking.hub.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Duration:</span>
                <span>{confirmedBooking.days} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Rental Paid:</span>
                <span className="font-extrabold text-blue-600 text-sm">₹{confirmedBooking.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-600 font-semibold">
                <span>Refundable Deposit at Hub:</span>
                <span>₹{confirmedBooking.deposit}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <span>Please show your original Driving License and this digital voucher at <b>{confirmedBooking.hub.name}</b> upon pickup.</span>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.print()}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="h-4 w-4" /> Print Voucher
              </button>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-blue-500/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rentals;
