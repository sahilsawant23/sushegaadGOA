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