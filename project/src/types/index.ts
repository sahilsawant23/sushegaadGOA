export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  category: 'Beach' | 'Heritage' | 'Adventure' | 'Culture' | 'Food'|'Art'|'Nature'|'Spiritual'|'Wellness';
  rating: number;
  reviewCount: number;
  images: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryDay[];
  location: string;
  maxGroupSize: number;
  ageRestriction: string;
  availability: Date[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bookings: Booking[];
  wishlist: string[];
}

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  tourTitle: string;
  date: Date;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentId?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  tourId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  image: string;
  category: string;
  tags: string[];
}

export interface ArtisanProduct {
  id: string;
  title: string;
  artisanName: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: 'Feni & Spirits' | 'Cashews & Spices' | 'Handicrafts' | 'Kunbi Textiles' | 'Sweets & Preserves';
  ecoCertified: boolean;
  stock: number;
  image: string;
  story: string;
  originVillage: string;
}

export interface BundleItem {
  id: string;
  category: 'stay' | 'transport' | 'activity' | 'experience';
  title: string;
  subtitle: string;
  pricePerDay: number;
  image: string;
  rating: number;
  location: string;
  features: string[];
}

export interface CulinaryExperience {
  id: string;
  title: string;
  hostName: string;
  location: string;
  type: 'Home Dine' | 'Cooking Masterclass' | 'Spice Plantation Lunch';
  pricePerPerson: number;
  duration: string;
  dietary: 'Fish Curry Special' | 'Traditional Veg & Goan Thali' | 'Multi-course Seafood';
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  highlights: string[];
}

export interface KonkaniPhrase {
  id: string;
  english: string;
  konkani: string;
  phonetic: string;
  category: 'Greetings' | 'Dining & Food' | 'Bargaining & Transport' | 'Directions' | 'Emergency';
  audioText: string;
}

export interface VendorListing {
  id: string;
  title: string;
  type: 'Beach Shack' | 'Scooter & Car Rental' | 'Water Sports Operator' | 'Artisan Workshop';
  location: string;
  activeBookings: number;
  revenueThisMonth: number;
  rating: number;
  status: 'Active' | 'Pending Review' | 'Seasonal Pause';
}