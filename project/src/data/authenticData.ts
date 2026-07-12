export interface AuthenticExperience {
  id: number;
  name: string;
  type: string;
  location: string;
  region: string;
  description: string;
  duration: string;
  price: string;
  highlights: string[];
  image: string;
  distanceFromPanaji: string;
  bestTimeToVisit: string;
  includes: string[];
}

export const goaAuthenticExperiences: AuthenticExperience[] = [
  {
    id: 1,
    name: "Traditional Goan Cooking Class",
    type: "Culinary",
    location: "Local Village, North Goa",
    region: "North Goa",
    description: "Learn to cook authentic Goan dishes with local ingredients and traditional methods from experienced local chefs.",
    duration: "4 hours",
    price: "₹2,500",
    highlights: ["Hands-on cooking", "Local ingredients", "Traditional recipes", "Take-home recipes"],
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    distanceFromPanaji: "15 km",
    bestTimeToVisit: "October to May",
    includes: ["Ingredients", "Recipe booklet", "Traditional spices", "Lunch"]
  },
  {
    id: 2,
    name: "Feni Distillery Tour",
    type: "Cultural",
    location: "Local Distillery, South Goa",
    region: "South Goa",
    description: "Experience the traditional art of cashew feni making, Goa's famous spirit, and learn about local distillation techniques.",
    duration: "3 hours",
    price: "₹1,800",
    highlights: ["Traditional distillation", "Tasting session", "History of feni", "Local culture"],
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    distanceFromPanaji: "30 km",
    bestTimeToVisit: "November to April",
    includes: ["Guided tour", "Tasting", "Traditional snacks", "Photo session"]
  },
  {
    id: 3,
    name: "Local Village Homestay",
    type: "Cultural Immersion",
    location: "Traditional Village, Central Goa",
    region: "Central Goa",
    description: "Stay with a local Goan family, experience village life, participate in daily activities, and learn about Goan traditions.",
    duration: "2 days/1 night",
    price: "₹4,500",
    highlights: ["Local family stay", "Village life", "Traditional activities", "Cultural exchange"],
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    distanceFromPanaji: "20 km",
    bestTimeToVisit: "October to May",
    includes: ["Accommodation", "Local meals", "Cultural activities", "Village tour"]
  },
  {
    id: 4,
    name: "Traditional Fishing Experience",
    type: "Adventure",
    location: "Local Fishing Village, North Goa",
    region: "North Goa",
    description: "Join local fishermen for a traditional fishing expedition, learn about sustainable fishing practices, and enjoy fresh seafood.",
    duration: "6 hours",
    price: "₹3,200",
    highlights: ["Traditional fishing", "Sustainable practices", "Fresh seafood", "Ocean experience"],
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    distanceFromPanaji: "25 km",
    bestTimeToVisit: "November to April",
    includes: ["Boat ride", "Fishing equipment", "Fresh seafood lunch", "Local guide"]
  },
  {
    id: 5,
    name: "Coconut Toddy Tapping Experience",
    type: "Cultural",
    location: "Rural Village, North Goa",
    region: "North Goa",
    description: "Witness and participate in the traditional art of coconut toddy tapping with local toddy tappers, learning age-old techniques passed through generations.",
    duration: "2 hours",
    price: "₹1,200",
    highlights: [
      "Live toddy tapping",
      "Traditional techniques",
      "Local interaction",
      "Cultural learning"
    ],
    image: "https://images.pexels.com/photos/4202924/pexels-photo-4202924.jpeg",
    distanceFromPanaji: "18 km",
    bestTimeToVisit: "October to March",
    includes: ["Local guide", "Demonstration", "Fresh toddy tasting"]
  },
  {
    id: 6,
    name: "Backwater Kayaking at Chorao Island",
    type: "Nature & Adventure",
    location: "Chorao Island, Mandovi River",
    region: "North Goa",
    description: "Kayak through serene mangroves and backwaters of Chorao Island, spotting birds and experiencing Goa’s untouched natural beauty.",
    duration: "3 hours",
    price: "₹2,000",
    highlights: [
      "Mangrove kayaking",
      "Bird watching",
      "Peaceful backwaters",
      "Eco-tourism experience"
    ],
    image: "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg",
    distanceFromPanaji: "10 km",
    bestTimeToVisit: "November to February",
    includes: ["Kayak & gear", "Safety equipment", "Local instructor"]
  },
  {
    id: 7,
    name: "Pottery Village Experience at Bicholim",
    type: "Craft & Culture",
    location: "Bicholim Village",
    region: "North Goa",
    description: "Explore the traditional pottery-making process in Bicholim, interact with artisans, and try your hand at shaping clay.",
    duration: "2.5 hours",
    price: "₹1,500",
    highlights: [
      "Pottery demonstration",
      "Hands-on clay work",
      "Meet local artisans",
      "Traditional craftsmanship"
    ],
    image: "https://images.pexels.com/photos/3095769/pexels-photo-3095769.jpeg",
    distanceFromPanaji: "35 km",
    bestTimeToVisit: "October to April",
    includes: ["Workshop materials", "Artisan guidance", "Souvenir item"]
  },
  {
    id: 8,
    name: "Cashew Plantation Walk & Tasting",
    type: "Agriculture & Culture",
    location: "Cashew Plantation, South Goa",
    region: "South Goa",
    description: "Walk through lush cashew plantations, learn about cashew harvesting, processing, and taste fresh cashew products.",
    duration: "2 hours",
    price: "₹1,400",
    highlights: [
      "Cashew cultivation",
      "Processing explanation",
      "Local tasting",
      "Plantation walk"
    ],
    image: "https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg",
    distanceFromPanaji: "40 km",
    bestTimeToVisit: "February to May",
    includes: ["Guided walk", "Cashew tasting", "Local snacks"]
  },
  {
    id: 9,
    name: "Goan Village Bicycle Tour",
    type: "Cultural Immersion",
    location: "Aldona & Surrounding Villages",
    region: "North Goa",
    description: "Cycle through scenic Goan villages, paddy fields, and heritage homes while learning about local life and traditions.",
    duration: "4 hours",
    price: "₹2,200",
    highlights: [
      "Village cycling",
      "Heritage houses",
      "Local interactions",
      "Scenic countryside"
    ],
    image: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
    distanceFromPanaji: "25 km",
    bestTimeToVisit: "November to February",
    includes: ["Bicycle", "Helmet", "Local guide", "Refreshments"]
  },
  {
    id: 10,
    name: "Traditional Goan Folk Dance Evening",
    type: "Cultural Performance",
    location: "Cultural Center, South Goa",
    region: "South Goa",
    description: "Enjoy an evening of traditional Goan folk dances like Fugdi and Dhalo, performed by local artists in authentic attire.",
    duration: "1.5 hours",
    price: "₹1,000",
    highlights: [
      "Live folk dance",
      "Traditional costumes",
      "Cultural storytelling",
      "Music & rhythm"
    ],
    image: "https://images.pexels.com/photos/7525075/pexels-photo-7525075.jpeg",
    distanceFromPanaji: "28 km",
    bestTimeToVisit: "October to March",
    includes: ["Live performance", "Cultural briefing"]
  }
];

export const getAuthenticExperiencesByRegion = (region: string): AuthenticExperience[] => {
  return goaAuthenticExperiences.filter(experience => experience.region === region);
};

export const getAuthenticExperiencesByType = (type: string): AuthenticExperience[] => {
  return goaAuthenticExperiences.filter(experience => experience.type === type);
};
