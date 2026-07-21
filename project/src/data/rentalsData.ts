export interface RentalVehicle {
  id: string;
  name: string;
  category: 'scooter' | 'cruiser' | 'sports' | 'electric' | 'jeep';
  categoryLabel: string;
  badge?: string;
  image: string;
  dailyPrice: number;
  hourlyPrice: number;
  engineCc: string;
  transmission: 'Automatic' | 'Manual';
  mileage: string;
  deposit: number;
  seatingCapacity: number;
  fuelType: 'Petrol' | 'Electric';
  rating: number;
  reviewCount: number;
  features: string[];
  popularFor: string;
  description: string;
}

export interface PickupHub {
  id: string;
  name: string;
  region: 'North Goa' | 'South Goa' | 'Airports & Railway';
  landmark: string;
  address: string;
  operatingHours: string;
}

export interface RentalAddon {
  id: string;
  name: string;
  pricePerDay: number;
  description: string;
  recommended?: boolean;
}

export interface SafetyRule {
  icon: string;
  title: string;
  description: string;
}

export const PICKUP_HUBS: PickupHub[] = [
  {
    id: 'mopa-airport',
    name: 'MOPA Airport (GOX)',
    region: 'Airports & Railway',
    landmark: 'Arrival Terminal Gate 3 Rental Hub',
    address: 'Manohar International Airport, Pernem, Goa 403512',
    operatingHours: '24/7 Available'
  },
  {
    id: 'dabolim-airport',
    name: 'Dabolim Airport (GOI)',
    region: 'Airports & Railway',
    landmark: 'Outside Exit Gate Taxi & Scooter Hub',
    address: 'Goa International Airport, Dabolim, Goa 403801',
    operatingHours: '24/7 Available'
  },
  {
    id: 'thivim-station',
    name: 'Thivim Railway Station',
    region: 'Airports & Railway',
    landmark: 'Station Parking Stand A',
    address: 'Thivim, North Goa 403502',
    operatingHours: '06:00 AM - 10:00 PM'
  },
  {
    id: 'madgaon-station',
    name: 'Madgaon Junction Station',
    region: 'Airports & Railway',
    landmark: 'Platform 1 Auto/Scooter Plaza',
    address: 'Margao, South Goa 403601',
    operatingHours: '06:00 AM - 10:00 PM'
  },
  {
    id: 'calangute-hub',
    name: 'Calangute Beach Central',
    region: 'North Goa',
    landmark: 'Near Calangute Mall & Main Circle',
    address: 'Calangute - Baga Road, North Goa 403516',
    operatingHours: '07:00 AM - 11:00 PM'
  },
  {
    id: 'anjuna-circle',
    name: 'Anjuna Beach Circle',
    region: 'North Goa',
    landmark: 'Near Starco Junction',
    address: 'Anjuna Flea Market Road, North Goa 403509',
    operatingHours: '08:00 AM - 10:30 PM'
  },
  {
    id: 'panjim-bus-stand',
    name: 'Panjim KTC Bus Stand',
    region: 'North Goa',
    landmark: 'Patto Plaza Bike Terminal',
    address: 'Panaji, North Goa 403001',
    operatingHours: '07:00 AM - 10:00 PM'
  },
  {
    id: 'palolem-hub',
    name: 'Palolem Beach Main Road',
    region: 'South Goa',
    landmark: 'Near Palolem Auto Stand',
    address: 'Canacona, South Goa 403702',
    operatingHours: '08:00 AM - 09:00 PM'
  }
];

export const RENTAL_ADDONS: RentalAddon[] = [
  {
    id: 'damage-cover',
    name: 'Zero Deductible Damage Protection',
    pricePerDay: 99,
    description: 'Covers minor scratches, body damage, and puncture repairs with zero liability.',
    recommended: true
  },
  {
    id: 'extra-helmet',
    name: 'Pillion Rider Helmet (ISI Certified)',
    pricePerDay: 50,
    description: '1 Helmet is included FREE. Add a high-quality 2nd helmet for your passenger.',
    recommended: true
  },
  {
    id: 'prepaid-fuel',
    name: 'Full Tank Fuel Prepaid',
    pricePerDay: 299,
    description: 'Pick up vehicle with a full tank & return it at any fuel level. No hassle!',
    recommended: false
  },
  {
    id: 'phone-holder',
    name: 'Waterproof Mobile Mount & USB Charger',
    pricePerDay: 40,
    description: 'Secure handlebar smartphone mount for easy Google Maps navigation while riding.',
    recommended: true
  }
];

export const RENTAL_VEHICLES: RentalVehicle[] = [
  {
    id: 'honda-activa-6g',
    name: 'Honda Activa 6G',
    category: 'scooter',
    categoryLabel: 'Automatic Scooter',
    badge: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
    dailyPrice: 450,
    hourlyPrice: 60,
    engineCc: '110 cc',
    transmission: 'Automatic',
    mileage: '45-50 km/l',
    deposit: 1000,
    seatingCapacity: 2,
    fuelType: 'Petrol',
    rating: 4.8,
    reviewCount: 342,
    features: ['Automatic CVT', 'Underseat Storage', 'Combi Braking System', 'Tubeless Tyres', '1 Free Helmet'],
    popularFor: 'Beach hopping, narrow Goan lanes & market rides',
    description: 'The undisputed king of Goa scooter rentals. Lightweight, smooth, extremely reliable, and perfect for exploring North & South Goa easily.'
  },
  {
    id: 'yamaha-fascino-125',
    name: 'Yamaha Fascino 125 Fi Hybrid',
    category: 'scooter',
    categoryLabel: 'Retro Tourist Favorite',
    badge: 'Goa Tourist Favorite',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    dailyPrice: 500,
    hourlyPrice: 70,
    engineCc: '125 cc (Smart Hybrid)',
    transmission: 'Automatic',
    mileage: '55 km/l',
    deposit: 1000,
    seatingCapacity: 2,
    fuelType: 'Petrol',
    rating: 4.9,
    reviewCount: 488,
    features: ['Smart Motor Generator', 'Super Lightweight (99 kg)', '21L Underseat Boot', 'Quiet Engine Start', '1 Free Helmet'],
    popularFor: 'Cruising coastal cliff roads, easy parking at beach shacks, high fuel economy',
    description: 'Goa’s most beloved scooter choice for tourists! Ultra-lightweight (99 kg) retro design with hybrid power assist, making it effortless to steer through crowded beach lanes and village corners.'
  },
  {
    id: 'vespa-urban-125',
    name: 'Vespa Urban LX 125',
    category: 'scooter',
    categoryLabel: 'Retro Italian Scooter',
    badge: 'Instagram Favorite',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
    dailyPrice: 650,
    hourlyPrice: 85,
    engineCc: '125 cc',
    transmission: 'Automatic',
    mileage: '40 km/l',
    deposit: 1500,
    seatingCapacity: 2,
    fuelType: 'Petrol',
    rating: 4.9,
    reviewCount: 189,
    features: ['Retro Aesthetic', 'Front Disc Brake', 'USB Charging Port', 'Metallic Finish', '1 Premium Helmet'],
    popularFor: 'Scenic coastal photoshoots, Latin Quarter (Fontainhas) aesthetic rides',
    description: 'Ride through Fontainhas and coastal palm avenues in timeless Italian style. Features premium chrome accents and comfortable twin seating.'
  },
  {
    id: 'royal-enfield-classic-350',
    name: 'Royal Enfield Classic 350',
    category: 'cruiser',
    categoryLabel: 'Heritage Cruiser',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    dailyPrice: 1100,
    hourlyPrice: 150,
    engineCc: '349 cc',
    transmission: 'Manual',
    mileage: '35 km/l',
    deposit: 2500,
    seatingCapacity: 2,
    fuelType: 'Petrol',
    rating: 4.9,
    reviewCount: 412,
    features: ['Signature Thump', 'Dual-Channel ABS', 'Teardrop Tank', 'Upright Touring Ergonomics', '2 Helmets'],
    popularFor: 'Long highway cruises between North & South Goa, Dudhsagar trips',
    description: 'Experience the iconic thumping rumble along Goa’s coastal highways and Western Ghats twisties. Smooth J-series engine with superb road grip.'
  },
  {
    id: 'ather-450x-ev',
    name: 'Ather 450X Gen 3 (Electric)',
    category: 'electric',
    categoryLabel: 'Smart Electric Scooter',
    badge: 'Eco Friendly',
    image: 'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&q=80&w=800',
    dailyPrice: 550,
    hourlyPrice: 75,
    engineCc: '6.2 kW Motor',
    transmission: 'Automatic',
    mileage: '105 km Range/Charge',
    deposit: 1500,
    seatingCapacity: 2,
    fuelType: 'Electric',
    rating: 4.7,
    reviewCount: 118,
    features: ['Touchscreen Maps Navigation', 'Warp Speed Mode', 'Free Fast Charging at Ather Grids', 'Zero Emissions'],
    popularFor: 'Eco-conscious travelers, quiet eco-zone explorations, Panjim city rides',
    description: 'Silent, futuristic, and fast. Includes free unlimited charging across 30+ Ather Grid charging points across North & South Goa.'
  },
  {
    id: 'royal-enfield-hunter-350',
    name: 'Royal Enfield Hunter 350',
    category: 'cruiser',
    categoryLabel: 'Roadster Bike',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=800',
    dailyPrice: 950,
    hourlyPrice: 130,
    engineCc: '349 cc',
    transmission: 'Manual',
    mileage: '36 km/l',
    deposit: 2000,
    seatingCapacity: 2,
    fuelType: 'Petrol',
    rating: 4.8,
    reviewCount: 156,
    features: ['Lightweight Chassis', 'Agile City Handling', 'Dual Channel ABS', 'Digital-Analog Meter'],
    popularFor: 'Nimble cafe hopping, sunset chasing, agile roadster experience',
    description: 'Sleeker and lighter than the Classic. Designed for effortless maneuverability through tight beach village streets and hilltop lookout points.'
  },
  {
    id: 'maruti-suzuki-baleno',
    name: 'Maruti Suzuki Baleno Alpha (Automatic)',
    category: 'jeep',
    categoryLabel: 'Premium Hatchback Car',
    badge: 'Top Family Choice',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    dailyPrice: 2200,
    hourlyPrice: 300,
    engineCc: '1197 cc DualJet',
    transmission: 'Automatic',
    mileage: '22 km/l',
    deposit: 3000,
    seatingCapacity: 5,
    fuelType: 'Petrol',
    rating: 4.9,
    reviewCount: 312,
    features: ['AGS Automatic Transmission', 'Chilled Climate Control AC', '360 Camera & Touchscreen Infotainment', 'Spacious 318L Boot for Luggage'],
    popularFor: 'Family beach holidays, luggage transport from airport, rain/sun AC comfort',
    description: 'Goa’s favorite self-drive hatchback car for families and friend groups! Smooth automatic gearbox, ice-cold AC, and ample luggage space for airport transfers.'
  },
  {
    id: 'maruti-suzuki-ertiga',
    name: 'Maruti Suzuki Ertiga ZXi (7 Seater)',
    category: 'jeep',
    categoryLabel: '7-Seater Family MPV',
    badge: 'Best 7-Seater',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    dailyPrice: 3200,
    hourlyPrice: 420,
    engineCc: '1462 cc K15C Hybrid',
    transmission: 'Automatic',
    mileage: '20 km/l',
    deposit: 4000,
    seatingCapacity: 7,
    fuelType: 'Petrol',
    rating: 4.9,
    reviewCount: 420,
    features: ['7 Seater Capacity', 'Dual AC Vents for All 3 Rows', 'Reclining Rear Seats', 'Foldable Seats for Airport Suitcases'],
    popularFor: 'Large group vacations, family airport transfers, 7-person sightseeing trips',
    description: 'The premier 7-seater MPV choice for big families and friend groups visiting Goa! Exceptional comfort with 3-row AC vents, flexible luggage boot, and smooth automatic transmission.'
  },
  {
    id: 'mahindra-thar-4x4',
    name: 'Mahindra Thar 4x4 Convertible',
    category: 'jeep',
    categoryLabel: 'Open Convertible SUV',
    badge: 'Ultimate Adventure',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    dailyPrice: 3800,
    hourlyPrice: 500,
    engineCc: '2200 cc Turbo',
    transmission: 'Automatic',
    mileage: '12 km/l',
    deposit: 5000,
    seatingCapacity: 4,
    fuelType: 'Petrol',
    rating: 4.9,
    reviewCount: 204,
    features: ['Convertible Soft Top', '4x4 All-Terrain', 'Bluetooth Infotainment', 'High Ground Clearance'],
    popularFor: 'Group road trips, open-top sunset drives, South Goa jungle safaris',
    description: 'Feel the tropical Goan breeze with the top down. Yellow-plate commercial tourist registration ready for hassle-free driving across the state.'
  }
];

export const GOA_SAFETY_RULES: SafetyRule[] = [
  {
    icon: '',
    title: 'Helmets Mandatory',
    description: 'Wearing an ISI-certified helmet is strictly mandatory by Goa Traffic Police for both rider and pillion rider.'
  },
  {
    icon: '',
    title: 'Yellow Commercial Plate',
    description: 'Ensure your rented vehicle has yellow-on-black registration plates (commercial self-drive permit). Renting white-plate private vehicles is illegal in Goa.'
  },
  {
    icon: '',
    title: 'Carry Driving License & ID',
    description: 'Keep your valid original Indian Driving License or International Driving Permit (IDP) along with your digital booking voucher.'
  },
  {
    icon: '',
    title: 'Strict Zero-Tolerance Drink & Drive',
    description: 'Goa Police conduct random breathalyzer checks across coastal belts. Never drive under the influence of alcohol.'
  }
];

export const RENTAL_FAQS = [
  {
    q: 'What documents are required to pick up a scooter/bike in Goa?',
    a: 'You need a valid original Driving License (DL) for 2-wheelers and an Original Govt ID (Aadhaar Card or Passport). A physical or digital copy of your DL will be verified at the pickup hub.'
  },
  {
    q: 'Is fuel included in the rental price?',
    a: 'Vehicles are provided with sufficient fuel to reach the nearest petrol pump (approx 1 liter). You can return the vehicle with the same fuel level, or opt for our "Prepaid Full Tank" add-on for worry-free returns.'
  },
  {
    q: 'How does the security deposit refund work?',
    a: 'The refundable security deposit (₹1,000 for scooters, ₹2,500 for Enfields, ₹5,000 for Jeeps) is collected at pickup via UPI/Cash/Card and refunded immediately upon returning the vehicle damage-free.'
  },
  {
    q: 'Can I pick up the vehicle at MOPA/Dabolim Airport and return it at Calangute/Panjim?',
    a: 'Yes! We support cross-hub drops across major hubs in North and South Goa for a nominal one-way convenience fee of ₹200.'
  }
];
