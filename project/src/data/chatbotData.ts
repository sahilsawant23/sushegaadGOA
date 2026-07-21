import { QuickReply } from '../types/chatbot';
import { mockTours } from './mockTours';
import { goaBeaches } from './beachesData';

export const welcomeMessage = "Welcome to Sushegaad Goa! I'm your travel support assistant. I can help you discover amazing tours, beautiful beaches, and plan your perfect Goa adventure. How can I assist you today?";

export const quickReplies: QuickReply[] = [
  { id: 'tours', text: 'Find Tours', action: 'show_tours' },
  { id: 'beaches', text: 'Explore Beaches', action: 'show_beaches' },
  { id: 'nightlife', text: 'Nightlife Guide', action: 'show_nightlife' },
  { id: 'help', text: 'Need Help', action: 'show_help' },
];

export const tourCategories = [
  { id: 'beach', text: 'Beach Tours', action: 'filter_tours_beach' },
  { id: 'heritage', text: 'Heritage Tours', action: 'filter_tours_heritage' },
  { id: 'adventure', text: 'Adventure Tours', action: 'filter_tours_adventure' },
  { id: 'culture', text: 'Cultural Tours', action: 'filter_tours_culture' },
  { id: 'food', text: 'Food Tours', action: 'filter_tours_food' },
];

export const beachRegions = [
  { id: 'north', text: 'North Goa Beaches', action: 'show_north_beaches' },
  { id: 'south', text: 'South Goa Beaches', action: 'show_south_beaches' },
  { id: 'popular', text: 'Popular Beaches', action: 'show_popular_beaches' },
];

export const helpTopics = [
  { id: 'booking', text: 'How to Book', action: 'help_booking' },
  { id: 'payment', text: 'Payment Info', action: 'help_payment' },
  { id: 'cancellation', text: 'Cancellation Policy', action: 'help_cancellation' },
  { id: 'contact', text: 'Contact Support', action: 'help_contact' },
];

export const chatbotResponses = {
  greeting: [
    "Hello! Ready to explore the beautiful beaches and rich culture of Goa?",
    "Hi there! I'm here to help you plan an amazing Goa adventure!",
    "Welcome! Let me help you discover the best of Goa's tours and experiences.",
  ],
  
  tours: {
    general: "Here are our popular tour categories. Which type of experience interests you most?",
    beach: `**Beach Tours in Goa**\n\nDiscover pristine beaches from North to South Goa! Our beach tours include:\n• Water sports and activities\n• Beach hopping experiences\n• Sunset viewing spots\n• Local beach culture\n\nWould you like to see specific beach tour packages?`,
    heritage: `**Heritage Tours**\n\nExplore Goa's rich Portuguese heritage:\n• Old Goa churches and cathedrals\n• Fontainhas Latin Quarter\n• Historical forts and monuments\n• Colonial architecture tours\n\nShall I show you our heritage tour options?`,
    adventure: `**Adventure Tours**\n\nGet your adrenaline pumping with:\n• Scuba diving and snorkeling\n• Parasailing and jet skiing\n• River cruises and kayaking\n• Jungle treks and wildlife\n\nReady for some adventure? Let me show you our packages!`,
    culture: `**Cultural Tours**\n\nImmerse yourself in Goan culture:\n• Traditional village visits\n• Local festivals and celebrations\n• Art and craft workshops\n• Music and dance performances\n\nInterested in cultural experiences?`,
    food: `**Food Tours**\n\nTaste the flavors of Goa:\n• Spice plantation visits\n• Cooking classes with locals\n• Street food tours\n• Feni distillery visits\n\nHungry for a culinary adventure?`,
  },
  
  beaches: {
    general: "Goa has 40+ stunning beaches! Which region would you like to explore?",
    north: `**North Goa Beaches**\n\nVibrant and lively beaches perfect for:\n• **Baga & Calangute**: Water sports and nightlife\n• **Anjuna**: Famous flea market and parties\n• **Vagator**: Scenic cliffs and Chapora Fort\n• **Arambol**: Bohemian atmosphere and yoga\n\nWhich North Goa beach interests you?`,
    south: `**South Goa Beaches**\n\nPeaceful and pristine beaches ideal for:\n• **Palolem**: Crescent-shaped paradise\n• **Agonda**: Asia's #1 beach (TripAdvisor)\n• **Butterfly Beach**: Secluded and photogenic\n• **Colva**: Family-friendly with amenities\n\nWant to know more about any South Goa beach?`,
    popular: `**Most Popular Beaches**\n\n1. **Palolem** - South Goa's crown jewel\n2. **Baga** - North Goa's party central\n3. **Anjuna** - Hippie heritage and flea market\n4. **Agonda** - Award-winning pristine beach\n5. **Calangute** - Queen of beaches\n\nWhich one would you like to visit?`,
  },
  
  nightlife: `**Goa Nightlife Guide**\n\n**North Goa Hotspots:**\n• Tito's & Mambo's (Baga)\n• Club LPK (Calangute)\n• Curlies Beach Shack (Anjuna)\n\n**South Goa Experiences:**\n• Silent Noise Club (Unique silent disco)\n• Beach shacks in Palolem\n• Casino cruises\n\nWhat type of nightlife experience are you looking for?`,
  
  help: {
    booking: `**How to Book Tours**\n\n1. Browse tours on our website\n2. Select your preferred date and group size\n3. Fill in traveler details\n4. Make secure payment\n5. Receive instant confirmation\n\n• Free cancellation up to 24 hours before tour\n• Instant booking confirmation\n• 24/7 customer support`,
    payment: `**Payment Information**\n\n**Accepted Methods:**\n• Credit/Debit Cards (Visa, Mastercard)\n• UPI (GPay, PhonePe, Paytm)\n• Net Banking\n• Digital Wallets\n\n• All payments are 100% secure and encrypted\n• No hidden charges\n• Instant payment confirmation`,
    cancellation: `**Cancellation Policy**\n\n• **Free cancellation** up to 24 hours before tour\n• **50% refund** for cancellations 12-24 hours before\n• **No refund** for cancellations less than 12 hours\n• **Full refund** for weather-related cancellations\n\n• Contact support for special circumstances`,
    contact: `**Contact Support**\n\n**24/7 Customer Support:**\nPhone: +91 9876543210\nEmail: support@sushegaadgoa.com\nLive Chat: Available on website\nOffice: 123 Beach Road, Panaji, Goa\n\nResponse time: Within 2 hours`,
  },
  
  fallback: [
    "I'm not sure I understand. Could you please rephrase your question?",
    "Let me help you with that! Could you be more specific about what you're looking for?",
    "I'd love to help! Try asking about tours, beaches, nightlife, or booking information.",
  ],
  
  booking_intent: "Great! I can help you book a tour. Let shadow redirects you to our booking page where you can select dates and complete your reservation.",
  
  price_inquiry: "Our tour prices vary based on the package and group size. Most tours range from ₹1,500 to ₹4,500 per person. Would you like to see specific tour prices?",
  
  weather_inquiry: "Goa has a tropical climate! The best time to visit is October to March with pleasant weather. Monsoon season (June-September) brings heavy rains but lush greenery. What time of year are you planning to visit?",
};

// AI Response Generator
export const generateBotResponse = (userMessage: string, _context: string = ''): string => {
  const message = userMessage.toLowerCase();
  
  // Greeting patterns
  if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return chatbotResponses.greeting[Math.floor(Math.random() * chatbotResponses.greeting.length)];
  }
  
  // Tour inquiries
  if (message.includes('tour') || message.includes('package') || message.includes('trip')) {
    if (message.includes('beach')) return chatbotResponses.tours.beach;
    if (message.includes('heritage') || message.includes('church') || message.includes('fort')) return chatbotResponses.tours.heritage;
    if (message.includes('adventure') || message.includes('water sport') || message.includes('diving')) return chatbotResponses.tours.adventure;
    if (message.includes('culture') || message.includes('village') || message.includes('traditional')) return chatbotResponses.tours.culture;
    if (message.includes('food') || message.includes('spice') || message.includes('cooking')) return chatbotResponses.tours.food;
    return chatbotResponses.tours.general;
  }
  
  // Beach inquiries
  if (message.includes('beach')) {
    if (message.includes('north')) return chatbotResponses.beaches.north;
    if (message.includes('south')) return chatbotResponses.beaches.south;
    if (message.includes('popular') || message.includes('best')) return chatbotResponses.beaches.popular;
    return chatbotResponses.beaches.general;
  }
  
  // Nightlife inquiries
  if (message.includes('nightlife') || message.includes('club') || message.includes('bar') || message.includes('party')) {
    return chatbotResponses.nightlife;
  }
  
  // Booking inquiries
  if (message.includes('book') || message.includes('reserve') || message.includes('how to book')) {
    return chatbotResponses.help.booking;
  }
  
  // Price inquiries
  if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
    return chatbotResponses.price_inquiry;
  }
  
  // Weather inquiries
  if (message.includes('weather') || message.includes('climate') || message.includes('best time')) {
    return chatbotResponses.weather_inquiry;
  }
  
  // Payment inquiries
  if (message.includes('payment') || message.includes('pay')) {
    return chatbotResponses.help.payment;
  }
  
  // Cancellation inquiries
  if (message.includes('cancel') || message.includes('refund')) {
    return chatbotResponses.help.cancellation;
  }
  
  // Contact inquiries
  if (message.includes('contact') || message.includes('support') || message.includes('help')) {
    return chatbotResponses.help.contact;
  }
  
  // Fallback response
  return chatbotResponses.fallback[Math.floor(Math.random() * chatbotResponses.fallback.length)];
};

// Get tour suggestions based on user preferences
export const getTourSuggestions = (category?: string) => {
  if (!category) return mockTours.slice(0, 3);
  
  const filtered = mockTours.filter((tour: { category: string; }) => 
    tour.category.toLowerCase() === category.toLowerCase()
  );
  
  return filtered.length > 0 ? filtered.slice(0, 3) : mockTours.slice(0, 3);
};

// Get beach suggestions based on region
export const getBeachSuggestions = (region?: string) => {
  if (!region) return goaBeaches.slice(0, 3);
  
  const filtered = goaBeaches.filter(beach => 
    beach.region.toLowerCase().includes(region.toLowerCase())
  );
  
  return filtered.length > 0 ? filtered.slice(0, 3) : goaBeaches.slice(0, 3);
};