import { CulinaryExperience } from '../types';

export const CULINARY_EXPERIENCES: CulinaryExperience[] = [
  {
    id: 'cul-1',
    title: 'Authentic Goan Fish Curry & Sol Kadi with the Fernandes Family',
    hostName: 'Chef Maria & Antonio Fernandes',
    location: 'Salcete, South Goa',
    type: 'Home Dine',
    pricePerPerson: 1200,
    duration: '3 hours',
    dietary: 'Fish Curry Special',
    rating: 4.9,
    reviewCount: 54,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    description: 'Dine in an ancestral 200-year-old Goan villa. Enjoy fresh catch of Kingfish curry, coconut rice, clams sukka, and homemade Sol Kadi while hearing tales of old Goa.',
    highlights: ['Welcome Feni cocktail', 'Fresh catch from Betul harbor', 'Ancestral home tour', 'Homemade Bebinca dessert']
  },
  {
    id: 'cul-2',
    title: 'Traditional Goan Catholic & Hindu Cooking Masterclass',
    hostName: 'Chef Sujata Naik',
    location: 'Ponda, North Goa',
    type: 'Cooking Masterclass',
    pricePerPerson: 1800,
    duration: '4 hours',
    dietary: 'Traditional Veg & Goan Thali',
    rating: 4.8,
    reviewCount: 32,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
    description: 'Learn to roast and grind aromatic Goan spices from scratch. Cook authentic Pork/Chicken Vindaloo, Mushroom Xacuti, and Kismur salad.',
    highlights: ['Hands-on spice grinding', 'Recipe booklet included', 'Taste testing all dishes', 'Local market tour included']
  },
  {
    id: 'cul-3',
    title: 'Organic Spice Plantation Garden Feast & Feni Tasting',
    hostName: 'Sahakari Farm Culinary Team',
    location: 'Curti, Ponda',
    type: 'Spice Plantation Lunch',
    pricePerPerson: 950,
    duration: '2.5 hours',
    dietary: 'Multi-course Seafood',
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    description: 'Guided walk through spice gardens followed by a buffet served on banana leaves featuring organic vegetables, fried prawns, crab curry, and fresh cashew juice.',
    highlights: ['Banana leaf traditional feast', 'Botanical spice tour', 'Elephant bath view optional', 'Complimentary spiced tea']
  }
];
