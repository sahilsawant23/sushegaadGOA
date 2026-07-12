export interface NightlifeVenue {
  id: string;
  name: string;
  type: 'Nightclub' | 'Beach Shack' | 'Bar' | 'Casino' | 'Restaurant & Bar';
  location: string;
  region: 'North Goa' | 'South Goa';
  description: string;
  highlights: string[];
  atmosphere: string;
  musicGenre: string[];
  priceRange: 'Budget' | 'Mid-range' | 'Luxury';
  openingHours: string;
  bestFor: string[];
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  features: string[];
  nearbyBeach: string;
}

export const goaNightlife: NightlifeVenue[] = [
  // North Goa - Baga Beach
  {
    id: 'titos-baga',
    name: "Tito's",
    type: 'Nightclub',
    location: "Tito's Lane, Baga Beach",
    region: 'North Goa',
    description: 'Iconic nightclub on the famous Tito\'s Lane, known for its legendary parties and vibrant atmosphere that has been the heart of Goa\'s nightlife for decades.',
    highlights: [
      'Legendary Goa nightclub',
      'Famous Tito\'s Lane location',
      'Multi-level dance floors',
      'Live DJ performances',
      'Beachfront access'
    ],
    atmosphere: 'High-energy, crowded, electric',
    musicGenre: ['Electronic', 'House', 'Commercial', 'Bollywood'],
    priceRange: 'Mid-range',
    openingHours: '9:00 PM - 3:00 AM',
    bestFor: ['Party lovers', 'Young crowds', 'Dance enthusiasts', 'Nightlife veterans'],
    image: 'https://titosgoa.com/wp-content/uploads/2022/08/titos-club-goa.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.3,
    reviewCount: 2847,
    features: ['Large dance floor', 'Multiple bars', 'VIP sections', 'Beach access', 'Live DJs'],
    nearbyBeach: 'Baga Beach'
  },
  {
    id: 'mambos-baga',
    name: "Mambo's",
    type: 'Nightclub',
    location: "Tito's Lane, Baga Beach",
    region: 'North Goa',
    description: 'Popular nightclub adjacent to Tito\'s, offering an equally vibrant party experience with great music and dancing in the heart of Baga\'s nightlife district.',
    highlights: [
      'Part of famous Tito\'s Lane',
      'Great music and dancing',
      'Lively party atmosphere',
      'Popular with tourists',
      'Late night parties'
    ],
    atmosphere: 'Energetic, fun, crowded',
    musicGenre: ['House', 'Electronic', 'Pop', 'Dance'],
    priceRange: 'Mid-range',
    openingHours: '9:30 PM - 3:00 AM',
    bestFor: ['Dancers', 'Music lovers', 'Party groups', 'Young travelers'],
    image: 'https://titosgoa.com/wp-content/uploads/2022/09/cafe-mambo-dive-into-party.jpg?id=4527',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],

    rating: 4.2,
    reviewCount: 1923,
    features: ['Dance floor', 'DJ booth', 'Bar service', 'Party lighting', 'Sound system'],
    nearbyBeach: 'Baga Beach'
  },
  {
    id: 'cape-town-cafe',
    name: 'Cape Town Cafe',
    type: 'Bar',
    location: 'Baga Beach',
    region: 'North Goa',
    description: 'A popular spot with a vibrant crowd, especially known for its nightlife and energetic atmosphere that attracts party-goers from around the world.',
    highlights: [
      'Vibrant party crowd',
      'Popular nightlife spot',
      'Energetic atmosphere',
      'International crowd',
      'Beach proximity'
    ],
    atmosphere: 'Vibrant, international, energetic',
    musicGenre: ['Commercial', 'Pop', 'Electronic', 'International'],
    priceRange: 'Mid-range',
    openingHours: '8:00 PM - 2:30 AM',
    bestFor: ['International travelers', 'Social drinkers', 'Party enthusiasts', 'Beach lovers'],
    image: 'https://im.whatshot.in/img/2020/Mar/86430438-2693038360823517-4036317429062696960-o-1585661819.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.1,
    reviewCount: 1456,
    features: ['Outdoor seating', 'Bar area', 'Music system', 'Beach views', 'International crowd'],
    nearbyBeach: 'Baga Beach'
  },

  // North Goa - Calangute
  {
    id: 'club-lpk',
    name: 'Club LPK (Love, Passion, Karma)',
    type: 'Nightclub',
    location: 'Calangute Beach',
    region: 'North Goa',
    description: 'A popular waterfront club with a unique ambiance, offering an unforgettable nightlife experience with stunning views and exceptional atmosphere.',
    highlights: [
      'Waterfront location',
      'Unique ambiance',
      'Stunning views',
      'Popular destination',
      'Memorable experience'
    ],
    atmosphere: 'Unique, waterfront, sophisticated',
    musicGenre: ['House', 'Electronic', 'Lounge', 'International'],
    priceRange: 'Luxury',
    openingHours: '8:00 PM - 3:00 AM',
    bestFor: ['Couples', 'Sophisticated crowd', 'Waterfront dining', 'Special occasions'],
    image: 'https://media1.thrillophilia.com/filestore/y03andn3e7nhvd21gjlrpq1semha_lpk-club-in-goa-banner.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.3,
    reviewCount: 2156,
    features: ['Waterfront views', 'Unique design', 'Premium service', 'Sophisticated crowd', 'Quality music'],
    nearbyBeach: 'Calangute Beach'
  },
  {
    id: 'hammerzz-nightclub',
    name: 'Hammerzz Nightclub',
    type: 'Nightclub',
    location: 'Calangute',
    region: 'North Goa',
    description: 'A luxury nightclub in Goa featuring multiple levels and attracting a good crowd, known for its upscale atmosphere and premium party experience.',
    highlights: [
      'Luxury nightclub',
      'Multiple levels',
      'Good crowd',
      'Upscale atmosphere',
      'Premium experience'
    ],
    atmosphere: 'Luxury, multi-level, upscale',
    musicGenre: ['Electronic', 'House', 'Commercial', 'International'],
    priceRange: 'Luxury',
    openingHours: '9:00 PM - 3:00 AM',
    bestFor: ['Luxury seekers', 'Upscale crowd', 'Premium experience', 'Special nights'],
    image: 'https://im.whatshot.in/img/2023/Apr/-mgl4010-cropped-1682495161.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.5,
    reviewCount: 1834,
    features: ['Multiple levels', 'Luxury interiors', 'Premium service', 'Quality crowd', 'Upscale experience'],
    nearbyBeach: 'Calangute Beach'
  },

  // North Goa - Candolim
  {
    id: 'sinq-nightclub',
    name: 'SinQ Nightclub',
    type: 'Nightclub',
    location: 'Candolim Beach',
    region: 'North Goa',
    description: 'A popular nightclub with multiple areas for dancing, lounging, and dining, offering a comprehensive entertainment experience in one venue.',
    highlights: [
      'Multiple entertainment areas',
      'Dancing and lounging',
      'Dining options',
      'Comprehensive venue',
      'Popular destination'
    ],
    atmosphere: 'Comprehensive, versatile, popular',
    musicGenre: ['Electronic', 'House', 'Commercial', 'Dance'],
    priceRange: 'Mid-range',
    openingHours: '8:00 PM - 3:00 AM',
    bestFor: ['Versatile entertainment', 'Groups', 'All-in-one experience', 'Varied preferences'],
    image: 'https://sinq.in/wp-content/uploads/2021/10/1.png',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.2,
    reviewCount: 2234,
    features: ['Multiple areas', 'Dance floor', 'Lounge areas', 'Dining space', 'Versatile venue'],
    nearbyBeach: 'Candolim Beach'
  },

  // North Goa - Anjuna
  {
    id: 'curlies-beach-shack',
    name: 'Curlies Beach Shack',
    type: 'Beach Shack',
    location: 'Anjuna Beach',
    region: 'North Goa',
    description: 'A legendary beach shack in Anjuna, famous for its parties and lively atmosphere, representing the authentic Goa beach party culture.',
    highlights: [
      'Legendary beach shack',
      'Famous parties',
      'Lively atmosphere',
      'Authentic Goa culture',
      'Beach party central'
    ],
    atmosphere: 'Legendary, authentic, beach party',
    musicGenre: ['Trance', 'Electronic', 'Psychedelic', 'Goa Trance'],
    priceRange: 'Budget',
    openingHours: '10:00 AM - 2:00 AM',
    bestFor: ['Beach parties', 'Authentic experience', 'Trance music', 'Goa culture'],
    image: 'https://goa-tourism.org.in/images/places-to-visit/headers/curlies-goa-header-goa-tourism.jpg.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.4,
    reviewCount: 3567,
    features: ['Beach location', 'Party atmosphere', 'Trance music', 'Authentic vibe', 'Day and night'],
    nearbyBeach: 'Anjuna Beach'
  },
  {
    id: 'cafe-lilliput',
    name: 'Cafe Lilliput',
    type: 'Beach Shack',
    location: 'Anjuna Beach',
    region: 'North Goa',
    description: 'A popular beach shack and nightclub in Anjuna, known for its lively atmosphere and perfect blend of beach relaxation and party vibes.',
    highlights: [
      'Beach shack and nightclub',
      'Lively atmosphere',
      'Beach relaxation',
      'Party vibes',
      'Popular spot'
    ],
    atmosphere: 'Lively, beachfront, relaxed party',
    musicGenre: ['Electronic', 'Trance', 'House', 'Chill'],
    priceRange: 'Budget',
    openingHours: '9:00 AM - 1:00 AM',
    bestFor: ['Beach lovers', 'Relaxed parties', 'Day to night', 'Casual atmosphere'],
    image: 'https://www.seawatersports.com/images/places/cafe-lilliput.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.1,
    reviewCount: 1876,
    features: ['Beach location', 'Day and night', 'Relaxed vibe', 'Good music', 'Casual dining'],
    nearbyBeach: 'Anjuna Beach'
  },
  {
    id: 'purple-martini',
    name: 'Purple Martini',
    type: 'Restaurant & Bar',
    location: 'Anjuna Beach',
    region: 'North Goa',
    description: 'A chic restaurant and bar in Anjuna, popular for its stunning sunset views and expertly crafted cocktails in an elegant setting.',
    highlights: [
      'Chic restaurant and bar',
      'Stunning sunset views',
      'Expert cocktails',
      'Elegant setting',
      'Popular destination'
    ],
    atmosphere: 'Chic, elegant, sunset views',
    musicGenre: ['Lounge', 'Jazz', 'Chill', 'Ambient'],
    priceRange: 'Luxury',
    openingHours: '5:00 PM - 1:00 AM',
    bestFor: ['Sunset viewing', 'Cocktail lovers', 'Romantic evenings', 'Elegant dining'],
    image: 'https://b.zmtcdn.com/data/pictures/9/130309/004308128c923a6f5886e04887bdd2ba.jpg?output-format=webp&fit=around|771.75:416.25&crop=771.75:416.25;*,*',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.6,
    reviewCount: 1234,
    features: ['Sunset views', 'Cocktail bar', 'Elegant ambiance', 'Quality service', 'Romantic setting'],
    nearbyBeach: 'Anjuna Beach'
  },

  // North Goa - Vagator
  {
    id: 'hilltop-vagator',
    name: 'Hilltop, Vagator',
    type: 'Nightclub',
    location: 'Vagator Beach',
    region: 'North Goa',
    description: 'A well-known open-air venue perched on a hilltop, especially popular for its parties and events with panoramic views of the coastline.',
    highlights: [
      'Open-air hilltop venue',
      'Panoramic views',
      'Popular parties',
      'Special events',
      'Iconic location'
    ],
    atmosphere: 'Open-air, hilltop, panoramic',
    musicGenre: ['Trance', 'Psychedelic', 'Electronic', 'Progressive'],
    priceRange: 'Mid-range',
    openingHours: '9:00 PM - 4:00 AM',
    bestFor: ['Trance lovers', 'Scenic parties', 'Electronic music', 'Unique venues'],
    image: 'https://www.seawatersports.com/images/places/hilltop-nightclub.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.5,
    reviewCount: 2789,
    features: ['Hilltop location', 'Open-air', 'Panoramic views', 'Trance music', 'Unique setting'],
    nearbyBeach: 'Vagator Beach'
  },
  {
    id: 'chronicle-vagator',
    name: 'Chronicle',
    type: 'Nightclub',
    location: 'Little Vagator',
    region: 'North Goa',
    description: 'A well-known nightclub in Little Vagator, offering an intimate yet energetic party experience with quality music and atmosphere.',
    highlights: [
      'Little Vagator location',
      'Intimate atmosphere',
      'Energetic parties',
      'Quality music',
      'Well-known venue'
    ],
    atmosphere: 'Intimate, energetic, quality-focused',
    musicGenre: ['House', 'Electronic', 'Progressive', 'Techno'],
    priceRange: 'Mid-range',
    openingHours: '9:30 PM - 3:00 AM',
    bestFor: ['Intimate parties', 'Quality music', 'Electronic fans', 'Smaller crowds'],
    image: 'https://content.jdmagicbox.com/comp/goa/k4/0832px832.x832.140407123959.t4k4/catalogue/chronicle-vagator-goa-italian-restaurants-3zvh2eh.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.3,
    reviewCount: 1567,
    features: ['Intimate setting', 'Quality sound', 'Electronic music', 'Good crowd', 'Regular events'],
    nearbyBeach: 'Vagator Beach'
  },
  {
    id: 'nyex-beach-club',
    name: 'Nyex Beach Club',
    type: 'Nightclub',
    location: 'Vagator Beach',
    region: 'North Goa',
    description: 'A day and night venue with party, lounging, and dining areas, offering a complete beach club experience from sunrise to sunset.',
    highlights: [
      'Day and night venue',
      'Party and lounging',
      'Dining areas',
      'Complete beach club',
      'Sunrise to sunset'
    ],
    atmosphere: 'Complete beach club, versatile',
    musicGenre: ['House', 'Electronic', 'Lounge', 'Commercial'],
    priceRange: 'Luxury',
    openingHours: '10:00 AM - 3:00 AM',
    bestFor: ['Beach club experience', 'Day parties', 'Lounging', 'Complete entertainment'],
    image: 'https://bridgeclubbers.com/wp-content/uploads/2017/03/NYEX-GOA.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.4,
    reviewCount: 2145,
    features: ['Beach club', 'Day and night', 'Multiple areas', 'Dining', 'Complete experience'],
    nearbyBeach: 'Vagator Beach'
  },
  {
    id: 'club-cubana',
    name: 'Club Cubana',
    type: 'Nightclub',
    location: 'Vagator Beach',
    region: 'North Goa',
    description: 'A popular nightclub known for its vibrant party atmosphere and excellent music, creating unforgettable nights in the heart of Vagator.',
    highlights: [
      'Vibrant party atmosphere',
      'Excellent music',
      'Popular nightclub',
      'Unforgettable nights',
      'Heart of Vagator'
    ],
    atmosphere: 'Vibrant, party-focused, energetic',
    musicGenre: ['Electronic', 'House', 'Commercial', 'Dance'],
    priceRange: 'Mid-range',
    openingHours: '9:00 PM - 3:00 AM',
    bestFor: ['Party atmosphere', 'Music lovers', 'Dancing', 'Energetic crowds'],
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/0e/4c/1b/82/club-cubana-goa.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.2,
    reviewCount: 1923,
    features: ['Party atmosphere', 'Dance floor', 'Good music', 'Energetic crowd', 'Regular events'],
    nearbyBeach: 'Vagator Beach'
  },

  // South Goa
  {
    id: 'silent-noise-club',
    name: 'Silent Noise Club',
    type: 'Nightclub',
    location: 'South Goa',
    region: 'South Goa',
    description: 'A unique silent disco experience popular in South Goa, where guests wear wireless headphones and dance to their choice of music channels.',
    highlights: [
      'Unique silent disco',
      'Wireless headphones',
      'Multiple music channels',
      'Innovative concept',
      'Popular experience'
    ],
    atmosphere: 'Unique, innovative, interactive',
    musicGenre: ['Multiple Channels', 'Electronic', 'Pop', 'Rock'],
    priceRange: 'Mid-range',
    openingHours: '8:00 PM - 2:00 AM',
    bestFor: ['Unique experiences', 'Music variety', 'Innovation lovers', 'Quiet locations'],
    image: 'https://static.toiimg.com/photo/52291913.cms',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.7,
    reviewCount: 1456,
    features: ['Silent disco', 'Wireless headphones', 'Multiple channels', 'Unique concept', 'Interactive'],
    nearbyBeach: 'Palolem Beach'
  },

  {
    id: 'pearl-marina',
    name: 'Pearl Marina',
    type: 'Restaurant & Bar',
    location: 'Cavelossim, South Goa',
    region: 'South Goa',
    description: 'A popular bar and restaurant in Cavelossim, South Goa, offering a refined dining and drinking experience with beautiful marina views.',
    highlights: [
      'Marina views',
      'Refined dining',
      'Popular bar',
      'Cavelossim location',
      'Quality experience'
    ],
    atmosphere: 'Refined, marina views, elegant',
    musicGenre: ['Lounge', 'Jazz', 'Ambient', 'Chill'],
    priceRange: 'Luxury',
    openingHours: '6:00 PM - 1:00 AM',
    bestFor: ['Marina views', 'Refined dining', 'Elegant evenings', 'Quality drinks'],
    image: 'https://content3.jdmagicbox.com/comp/goa/w3/0832px832.x832.190928154423.l6w3/catalogue/pearls-marina-de-santa-cruz-cavelossim-goa-restaurants-and-bars-idbsvsmunk.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.5,
    reviewCount: 1234,
    features: ['Marina views', 'Quality dining', 'Bar service', 'Elegant ambiance', 'Refined experience'],
    nearbyBeach: 'Cavelossim Beach'
  },
  {
    id: 'fat-fish',
    name: 'Fat Fish',
    type: 'Restaurant & Bar',
    location: 'Baga-Arpora Road, Arpora',
    region: 'North Goa',
    description: 'A contemporary, airy seafood restaurant pairing Goan signatures and thalis with a popular bar and a trendy, upscale atmosphere.',
    highlights: [
      'Goan seafood specialties',
      'A/c & open-air seating',
      'Signature thalis',
      'Popular bar',
      'Live music'
    ],
    atmosphere: 'Trendy, lively, family-friendly',

    priceRange: 'Mid-range',
    openingHours: '12pm–12am',
    bestFor: ['Seafood lovers', 'Groups', 'Casual dining', 'Bar scene'],
    image: 'https://d3gw4aml0lneeh.cloudfront.net/assets/locations/XhVpVMFqfmQv.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.5,
    reviewCount: 2900,
    features: ['Bar', 'Live music', 'Goan thali', 'Family dining'],
    nearbyBeach: 'Baga Beach',
    musicGenre: []
  },
  {
    id: 'brittos',
    name: 'Britto’s Restaurant at Baga Beach',
    type: 'Restaurant & Bar',
    location: 'Baga Beach, North Goa',
    region: 'North Goa',
    description: 'An iconic, seaside eatery with legendary status since 1965; known for its energetic vibe, renowned seafood, and robust cocktail bar.',
    highlights: [
      'Beachfront dining',
      'Classic seafood',
      'Cocktail bar',
      'Since 1965',
      'Live music'
    ],
    atmosphere: 'Energetic, classic, beachy',
    priceRange: 'Mid-range',
    openingHours: '8am–11pm',
    bestFor: ['Tourists', 'Groups', 'Seafood fans', 'Beachside meals'],
    image: 'https://d3gw4aml0lneeh.cloudfront.net/assets/locations/13538/GbaFKm9HJHiP.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.2,
    reviewCount: 3300,
    features: ['Beach seating', 'Cocktails', 'Desserts', 'Bar'],
    nearbyBeach: 'Baga Beach',
    musicGenre: []
  },
  {
    id: 'fishermans-wharf',
    name: 'The Fishermans Wharf',
    type: 'Restaurant & Bar',
    location: 'Cavelossim, Salcette, South Goa',
    region: 'South Goa',
    description: 'A rustic riverside restaurant renowned for laid-back ambiance, Goan specialties, live music, and a vibrant bar scene.',
    highlights: [
      'Riverside setting',
      'Live music',
      'Goan seafood',
      'Bar scene',
      'Family friendly'
    ],
    atmosphere: 'Rustic, lively, riverside',
    priceRange: 'Luxury',
    openingHours: '12pm–11pm',
    bestFor: ['Families', 'Seafood', 'Groups', 'River views'],
    image: 'https://cdn.guidetour.in/wp-content/uploads/2023/07/The-Fisherman-Wharf.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.6,
    reviewCount: 2200,
    features: ['Bar', 'River view', 'Live performances', 'Cocktails'],
    nearbyBeach: 'Cavelossim Beach',
    musicGenre: []
  },
  {
    id: 'martins-corner',
    name: "Martin's Corner",
    type: 'Restaurant & Bar',
    location: 'Betalbatim, South Goa',
    region: 'South Goa',
    description: 'Celebrated for its open-air pavilion, live music, and extensive bar, this vibrant institution offers seafood, Indian, and Chinese favorites in a lively setting.',
    highlights: [
      'Open-air pavilion',
      'Live band',
      'Extensive bar menu',
      'Seafood specialties',
      'Family atmosphere'
    ],
    atmosphere: 'Lively, kid-friendly, classic',
    priceRange: 'Mid-range',
    openingHours: '11am–11pm',
    bestFor: ['Families', 'Live music', 'Seafood', 'Big groups'],
    image: 'https://www.acroncandolimresortgoa.com/explore-goa/local-cuisine-in-goa/martins-corner/images/martins-corner.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.4,
    reviewCount: 1800,
    features: ['Live music', 'Outdoor seating', 'Bar', 'Seafood'],
    nearbyBeach: 'Betalbatim Beach',
    musicGenre: []
  },
  {
    id: 'kokni-kanteen',
    name: 'Kokni Kanteen',
    type: 'Restaurant & Bar',
    location: 'Panaji, North Goa',
    region: 'North Goa',
    description: 'Known for coastal Konkani thalis and a nostalgic, vintage-inspired bar vibe, delighting diners craving authentic Goan fare.',
    highlights: [
      'Konkani thalis',
      'Vintage decor',
      'Cocktail bar',
      'Authentic Goan cuisine',
      'Popular for locals'
    ],
    atmosphere: 'Vintage, nostalgic, lively',
    priceRange: 'Budget',
    openingHours: '11:30am–3:30pm, 7pm–11pm',
    bestFor: ['Foodies', 'History lovers', 'Local hangout'],
    image: 'https://content3.jdmagicbox.com/comp/goa/z9/0832px832.x832.160916074734.x1z9/catalogue/kokni-kanteen-panjim-goa-goan-restaurants-hsy5v99gjw.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.6,
    reviewCount: 1450,
    features: ['Bar', 'Konkani thali', 'Local ambience'],
    nearbyBeach: 'Miramar Beach',
    musicGenre: []
  },
  {
    id: 'gunpowder',
    name: 'Gunpowder',
    type: 'Restaurant & Bar',
    location: 'Assagao, North Goa',
    region: 'North Goa',
    description: 'Colorful garden-set destination for curated South Indian fare and a lively outdoor cocktail bar, ideal for dinners and date nights.',
    highlights: [
      'Garden seating',
      'South Indian food',
      'Outdoor bar',
      'Colorful decor',
      'Chill vibe'
    ],
    atmosphere: 'Bohemian, outdoor, lively',
    priceRange: 'Luxury',
    openingHours: '12pm–3:30pm, 6:30pm–10:30pm',
    bestFor: ['Date nights', 'Groups', 'Unique dining'],
    image: 'https://imgmedia.lbb.in/media/2021/10/615e6d09a3d394569ca9d5b3_1633578249231.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.3,
    reviewCount: 1310,
    features: ['Cocktail bar', 'Open air', 'Vegetarian options'],
    nearbyBeach: 'Anjuna Beach',
    musicGenre: []
  },
  {
    id: 'copperleaf',
    name: 'Copperleaf Porvorim',
    type: 'Restaurant & Bar',
    location: 'Porvorim, North Goa',
    region: 'North Goa',
    description: 'A top-rated fine-dining option with focus on Goan seafood, a polished ambiance, and a wine-forward bar, perfect for both authenticity and elegance.',
    highlights: [
      'Fine dining',
      'Seafood delicacies',
      'Wine bar',
      'Polished setting',
      'Family-friendly'
    ],
    atmosphere: 'Elegant, modern, relaxed',
    priceRange: 'Luxury',
    openingHours: '11am–3:30pm, 7pm–11pm',
    bestFor: ['Seafood', 'Fine dining', 'Wine lovers'],
    image: 'https://b.zmtcdn.com/data/pictures/8/19792568/65439144100739d55dbba2a0662091a8.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.7,
    reviewCount: 2200,
    features: ['Bar', 'Wine menu', 'Air-conditioned'],
    nearbyBeach: 'Calangute Beach',
    musicGenre: []
  },
  {
    id: 'lazy-goose',
    name: 'The Lazy Goose',
    type: 'Restaurant & Bar',
    location: 'Under Nerul Bridge, Nerul, North Goa',
    region: 'North Goa',
    description: 'Riverside, nautical-themed hotspot for fresh seafood, upbeat service, and a romantic drinks menu by the water.',
    highlights: [
      'Riverside location',
      'Seafood specialties',
      'Nautical theme',
      'Drinks by the water',
      'Romantic ambiance'
    ],
    atmosphere: 'Chic, romantic, trendy',
    priceRange: 'Luxury',
    openingHours: '11am–11pm',
    bestFor: ['Couples', 'Seafood', 'River views'],
    image: 'https://imgmediagumlet.lbb.in/media/2021/11/61935e5ea43aab6ccfc71236_1637047902875.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.5,
    reviewCount: 1230,
    features: ['Outdoor bar', 'Seafood', 'Live music'],
    nearbyBeach: 'Candolim Beach',
    musicGenre: []
  },
  {
    id: 'bar-de-goa',
    name: 'Bar De Goa',
    type: 'Bar',
    location: 'Porvorim, North Goa',
    region: 'North Goa',
    description: 'Trendy, casual bar-grill with live music, bar games, craft beer, and a hot gathering spot for groups and festivities.',
    highlights: [
      'Live band nights',
      'Craft beer',
      'Bar games',
      'Themed décor',
      'Social vibe'
    ],
    atmosphere: 'Trendy, fun, social',

    priceRange: 'Mid-range',
    openingHours: '5pm–12am',
    bestFor: ['Groups', 'Bar games', 'Live music'],
    image: 'https://b.zmtcdn.com/data/pictures/7/20564577/95d7cd5545dfced5229e569e4f0f9f59.jpg?fit=around|771.75:416.25&crop=771.75:416.25;*,*',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.2,
    reviewCount: 890,
    features: ['Beer bar', 'DJ nights', 'Live shows'],
    nearbyBeach: 'Calangute Beach',
    musicGenre: []
  },
  {
    id: 'joseph-bar',
    name: 'Joseph Bar',
    type: 'Bar',
    location: 'Panjim, Fontainhas, North Goa',
    region: 'North Goa',
    description: 'Cozy, rustic tapas bar famed for unique cocktails, offbeat drinks, live performances, and friendly, historic charm.',
    highlights: [
      'Tapas menu',
      'Signature cocktails',
      'Historic Fontainhas location',
      'Live music',
      'Rustic charm'
    ],
    atmosphere: 'Rustic, historic, artsy',
    priceRange: 'Budget',
    openingHours: '12pm–11pm',
    bestFor: ['Bar hopping', 'Solo travelers', 'Art lovers'],
    image: 'https://makeithappen.co.in/wp-content/uploads/2023/09/joseph-bar-1.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.4,
    reviewCount: 1500,
    features: ['Tapas', 'Cocktails', 'Live acts'],
    nearbyBeach: 'Miramar Beach',
    musicGenre: []
  },
  {
    id: '9pm-bar',
    name: '9pm Bar and Cafe',
    type: 'Bar',
    location: 'Baga-Calangute Road, North Goa',
    region: 'North Goa',
    description: 'Budget-friendly spot with diverse cuisine, inclusive and lively vibe, live shows, and a fun welcoming scene.',
    highlights: [
      'Affordable drinks',
      'Live shows',
      'Global menu',
      'Casual crowd',
      'Nightly entertainment'
    ],
    atmosphere: 'Casual, lively, inclusive',
    priceRange: 'Budget',
    openingHours: '11am–3am',
    bestFor: ['Budget travelers', 'Night owls', 'Groups'],
    image: 'https://b.zmtcdn.com/data/pictures/0/21019320/8b5fe194c6dfa5056dffb4b7e770811c_featured_v2.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.0,
    reviewCount: 890,
    features: ['Bar', 'Live entertainment', 'Budget drinks'],
    nearbyBeach: 'Calangute Beach',
    musicGenre: []
  },
  {
    id: 'deltin-royale',
    name: 'Deltin Royale',
    type: 'Casino',
    location: 'Mandovi River, Panaji',
    region: 'North Goa',
    description: 'A popular floating casino in Goa offering comprehensive nightlife entertainment with gaming, dining, and live shows on the Mandovi River.',
    highlights: [
      'Floating casino',
      'Gaming and entertainment',
      'Mandovi River location',
      'Live shows',
      'Complete experience'
    ],
    atmosphere: 'Luxurious, casino, entertainment',
    musicGenre: ['Live Shows', 'Lounge', 'Entertainment', 'Varied'],
    priceRange: 'Luxury',
    openingHours: '24 Hours',
    bestFor: ['Casino gaming', 'Live entertainment', 'Luxury experience', 'Complete nightlife'],
    image: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/08/16220016/Goa-Casino.png',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.3,
    reviewCount: 3456,
    features: ['Casino gaming', 'Live shows', 'Fine dining', 'Luxury setting', 'River location'],
    nearbyBeach: 'Miramar Beach'
  },
  {
    id: 'Big-daddy',
    name: 'Big-daddy',
    type: 'Casino',
    location: 'Mandovi River, Panaji',
    region: 'North Goa',
    description: 'A popular floating casino in Goa offering comprehensive nightlife entertainment with gaming, dining, and live shows on the Mandovi River.',
    highlights: [
      'Floating casino',
      'Gaming and entertainment',
      'Mandovi River location',
      'Live shows',
      'Complete experience'
    ],
    atmosphere: 'Luxurious, casino, entertainment',
    musicGenre: ['Live Shows', 'Lounge', 'Entertainment', 'Varied'],
    priceRange: 'Luxury',
    openingHours: '24 Hours',
    bestFor: ['Casino gaming', 'Live entertainment', 'Luxury experience', 'Complete nightlife'],
    image: 'https://www.luxurylifestylemag.co.uk/wp-content/uploads/2019/09/big-daddy-ship.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.3,
    reviewCount: 3456,
    features: ['Casino gaming', 'Live shows', 'Fine dining', 'Luxury setting', 'River location'],
    nearbyBeach: 'Miramar Beach'
  },

  {
    id: 'Casino-Pride',
    name: 'Casino Pride',
    type: 'Casino',
    location: 'Mandovi River, Panaji',
    region: 'North Goa',
    description: 'A large, family-friendly casino cruise on the Mandovi, offering classic casino games, live Bollywood-style shows, and private event facilities, popular for celebrations and group gaming.',
    highlights: [
      'Over 2000 gaming seats',
      'Live Bollywood dance shows',
      'Family and kids’ zones',
      'Grand celebration events',
      'River cruise experience'
    ],
    atmosphere: 'Energetic, colorful, celebration',
    musicGenre: ['Bollywood', 'DJ nights', 'Variety acts'],
    priceRange: 'Luxury',
    openingHours: '24 Hours',
    bestFor: ['Group outings', 'Family celebrations', 'Live performances', 'Table games'],
    image: 'https://www.illumania.com/_readwritedata/location_image/7af17f76-486c-4e6c-822e-9ab8d56a8629.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.2,
    reviewCount: 4100,
    features: ['Classic gaming tables', 'Kids’ entertainment', 'Multiple food counters', 'Spacious decks', 'All-night fun'],
    nearbyBeach: 'Miramar Beach'
  },
  {
    id: 'Deltin-Jaqk',
    name: 'Deltin Jaqk',
    type: 'Casino',
    location: 'Mandovi River, Panaji',
    region: 'North Goa',
    description: 'A premium floating casino renowned for its friendly ambiance, variety of gaming floors, and excellent dining options, considered especially beginner-friendly.',
    highlights: [
      '50+ gaming tables',
      'Casual and friendly atmosphere',
      'Bar and live entertainment',
      'Buffet dining inclusive in entry',
      'Family friendly'
    ],
    atmosphere: 'Welcoming, modern, vibrant casino',
    musicGenre: ['Live acts', 'DJ', 'Lounge'],
    priceRange: 'Luxury',
    openingHours: '24 Hours',
    bestFor: ['First-time casino-goers', 'Social gaming', 'Relaxed cruise experience'],
    image: 'https://www.exploreourindia.com/backend/web/images/post/big/8024_Deltin%20Jaqk%20Casino%20goa.webp',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.1,
    reviewCount: 3050,
    features: ['Mix of table games', 'Sunday brunches', 'Sea views', 'Entertainment stage'],
    nearbyBeach: 'Miramar Beach'
  },
  {
    id: 'Majestic-Pride',
    name: 'Majestic Pride Casino',
    type: 'Casino',
    location: 'Mandovi River, Panaji',
    region: 'North Goa',
    description: 'A luxurious cruise-based casino known for its star-studded evenings, festive events, international acts, and vibrant Bollywood-style entertainment on the water.',
    highlights: [
      'Themed nights and New Year parties',
      'International performers and dancers',
      'Contemporary live acts and cabaret',
      'Festive, glitzy décor',
      'Sundeck for panoramic river views'
    ],
    atmosphere: 'Spectacular, festive, extravagant',
    musicGenre: ['Bollywood', 'Cabaret', 'DJ', 'Variety entertainment'],
    priceRange: 'Luxury',
    openingHours: '24 Hours',
    bestFor: ['Special event nights', 'Live shows', 'Glamorous gaming experiences'],
    image: 'https://media1.thrillophilia.com/filestore/ed3kn3vobevt4e8uh6au7remggdo_1610104682_Ship-2.png?w=400&dpr=2',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.0,
    reviewCount: 2100,
    features: ['Live cabaret', 'Global cuisine', 'Themed parties', 'Stunning river backdrop'],
    nearbyBeach: 'Miramar Beach'
  },
  {
    id: 'Casino-Paradise',
    name: 'Casino Paradise',
    type: 'Casino',
    location: 'Neo Majestic Hotel, Porvorim, Bardez, Near Azad Bhavan, Panaji',
    region: 'North Goa',
    description: 'A modern, plush casino within a premium hotel, offering innovative electronic gaming, digital roulette, and a relaxed atmosphere suitable for newcomers and regulars alike.',
    highlights: [
      'Digital gaming stations',
      'Robotic Arm Baccarat',
      'Advanced slot machines',
      'Spacious, modern interiors',
      'Unlimited food and drinks with entry'
    ],
    atmosphere: 'Upscale, contemporary, relaxed',
    musicGenre: ['Lounge', 'Ambient', 'Light live music'],
    priceRange: 'Mid-range',
    openingHours: '24 Hours',
    bestFor: ['Family gaming', 'Electronic casino games', 'Hotel stays', 'Value evenings'],
    image: 'https://farm3.staticflickr.com/2539/3906056191_b42869c172_z.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.0,
    reviewCount: 1600,
    features: ['Electronic roulette', 'Blackjack', 'Baccarat', 'Digital slots'],
    nearbyBeach: 'Calangute Beach'
  },
  {
    id: 'Dunes-Casino',
    name: 'Dunes Casino',
    type: 'Casino',
    location: 'The Zuri White Sands, Varca, South Goa',
    region: 'South Goa',
    description: 'Goa’s only land casino located at a luxury beachside resort, offering table games, pool games, and modern amenities blended with a resort atmosphere.',
    highlights: [
      'Table and pool games',
      'Video machines and slot games',
      'Swim-up bar',
      'Resort pools and spa',
      'Lush tropical setting'
    ],
    atmosphere: 'Laid-back, tropical, casual luxury',
    musicGenre: ['Chill-out', 'Poolside DJ', 'Lounge'],
    priceRange: 'Mid-range',
    openingHours: '24 Hours',
    bestFor: ['Resort guests', 'Poolside gaming', 'Relaxed holiday gaming'],
    image: 'https://cdn.thegoavilla.com/static/img/articles/casino-in-goa.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.1,
    reviewCount: 1350,
    features: ['Table games', 'Resort amenities', 'Poolside entertainment'],
    nearbyBeach: 'Varca Beach'
  },
  {
    id: 'Chances-Casino',
    name: 'Chances Casino',
    type: 'Casino',
    location: 'Dona Paula, Goa',
    region: 'North Goa',
    description: 'A well-known casino renowned for its central location, elegant interiors, slot machines, live gaming, and lively ambiance, favored by both locals and visitors.',
    highlights: [
      'Slot machines and table games',
      'Live entertainment',
      'Excellent customer service',
      'Central location',
      'Family-friendly environment'
    ],
    atmosphere: 'Lively, modern, welcoming',
    musicGenre: ['Live', 'DJ', 'Lounge'],
    priceRange: 'Mid-range',
    openingHours: '11am–4am',
    bestFor: ['Slot enthusiasts', 'Lively gatherings', 'Electronic gaming'],
    image: 'https://chancesgoa.com/wp-content/uploads/2022/06/gallery-casino1.jpg',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.1,
    reviewCount: 1100,
    features: ['Poker', 'Blackjack', 'Themed evenings', 'Central bar'],
    nearbyBeach: 'Dona Paula Beach'
  },
  {
    id: 'Grand7-Casino',
    name: 'Grand 7 Casino',
    type: 'Casino',
    location: 'Candolim, Bardez, North Goa',
    region: 'North Goa',
    description: 'A chic, high-end land casino offering a blend of table games, slot machines, fine dining, and contemporary décor, known for excellent service and entertainment.',
    highlights: [
      'Chic, modern decor',
      'Wide range of games',
      'Gourmet cuisine and bar',
      'Live music',
      'Spacious gaming floor'
    ],
    atmosphere: 'Sophisticated, modern, lively',
    musicGenre: ['Live bands', 'DJ sets', 'Pop'],
    priceRange: 'Luxury',
    openingHours: '24 Hours',
    bestFor: ['Trendy casino-goers', 'Gourmet food', 'Stylish entertainment'],
    image: 'https://storage.googleapis.com/goa-app-12a91.appspot.com/2023-08-08T12%3A23%3A33.863ZWInn-7-Grand-Casino2.webp?GoogleAccessId=firebase-adminsdk-zeqcj%40goa-app-12a91.iam.gserviceaccount.com&Expires=16447017600&Signature=DU1OBGZq2l24bmelQ9ojnnMz4PcN%2Fb57t7udEYLBAH36OKrmJxr83ys17eZsoW1sD1MSAUIL59KziHj3nxWtQOTeqMhtpjmCeMHuzc9WdyFYhijZh93r2m69bq1ytuIafX%2Fnbe2oWmkVpLFHt7pqH2m7zxEVh4hYJFLnVp1XAclIx5Cgh6Dg%2BK5c5dhXN2p%2FyVYxRdElZToj3huYfcfMihKpEXB3DS%2FRPtH1me2NiWIPRPoWKpXnTBo16ExLxAnfH19CIiGnlo7EKDtQFvO51%2FWCyCnt6HVGmnqXNhnLonjIH6GXqfPy%2FsiGPh5XTDb67F2P31Z6Z0mmZpwAeGZzUA%3D%3D',
    images: [
      "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
      "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"
    ],
    rating: 4.0,
    reviewCount: 950,
    features: ['Table games', 'Slots', 'Fine dining', 'Live shows'],
    nearbyBeach: 'Candolim Beach'
  },
  {
    id: 'thallasa-vagator',
    name: 'Thalassa',
    type: 'Restaurant & Bar',
    location: 'Vagator Hilltop',
    region: 'North Goa',
    description: 'Famous Greek restaurant and bar known for sunset views, dancing on tables, and a lively party atmosphere.',
    highlights: [
      'Greek cuisine',
      'Sunset views',
      'Dancing on tables',
      'Party nights',
      'Iconic Goa spot'
    ],
    atmosphere: 'Lively, festive, sunset party',
    musicGenre: ['Commercial', 'House', 'Greek', 'Party'],
    priceRange: 'Luxury',
    openingHours: '5:30 PM - 11:30 PM',
    bestFor: ['Sunset lovers', 'Groups', 'Party dining', 'Tourists'],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    images: [],
    rating: 4.6,
    reviewCount: 5400,
    features: ['Sunset seating', 'Bar', 'DJ nights', 'Dancing'],
    nearbyBeach: 'Vagator Beach'
  },
  {
    id: 'antarese-vagator',
    name: 'Antares Restaurant & Beach Club',
    type: 'Restaurant & Bar',
    location: 'Small Vagator',
    region: 'North Goa',
    description: 'A premium beach club offering gourmet food, craft cocktails, and a relaxed yet stylish nightlife vibe.',
    highlights: [
      'Beachfront dining',
      'Craft cocktails',
      'Premium ambiance',
      'Sunset views',
      'Live DJ'
    ],
    atmosphere: 'Chic, relaxed, upscale',
    musicGenre: ['Lounge', 'House', 'Chill'],
    priceRange: 'Luxury',
    openingHours: '12:00 PM - 12:00 AM',
    bestFor: ['Couples', 'Sunset dining', 'Premium crowd'],
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
    images: [],
    rating: 4.5,
    reviewCount: 2100,
    features: ['Beach views', 'Craft bar', 'Fine dining'],
    nearbyBeach: 'Vagator Beach'
  },
  {
    id: 'leopard-valley',
    name: 'Leopard Valley',
    type: 'Nightclub',
    location: 'Agonda Road, Palolem',
    region: 'South Goa',
    description: 'A jungle nightclub set in a quarry, famous for international DJs and an immersive electronic music experience.',
    highlights: [
      'Jungle nightclub',
      'International DJs',
      'Open-air dance floor',
      'Unique location',
      'Late-night parties'
    ],
    atmosphere: 'Wild, immersive, underground',
    musicGenre: ['Electronic', 'Techno', 'House'],
    priceRange: 'Mid-range',
    openingHours: '10:00 PM - 4:00 AM',
    bestFor: ['Electronic music lovers', 'Late-night partygoers'],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    images: [],
    rating: 4.4,
    reviewCount: 3200,
    features: ['Open-air club', 'DJ stage', 'Large dance floor'],
    nearbyBeach: 'Palolem Beach'
  },
  {
    id: 'colva-beach-shack',
    name: 'Colva Beach Shack',
    type: 'Beach Shack',
    location: 'Colva Beach',
    region: 'South Goa',
    description: 'Relaxed beach shack offering drinks, music, and casual nightlife by the sea.',
    highlights: [
      'Beachside seating',
      'Casual nightlife',
      'Affordable drinks',
      'Live music',
      'Sunset vibes'
    ],
    atmosphere: 'Relaxed, beachy, casual',
    musicGenre: ['Acoustic', 'Chill', 'Pop'],
    priceRange: 'Budget',
    openingHours: '10:00 AM - 11:00 PM',
    bestFor: ['Budget travelers', 'Relaxed evenings'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    images: [],
    rating: 4.1,
    reviewCount: 870,
    features: ['Beach seating', 'Live music', 'Bar'],
    nearbyBeach: 'Colva Beach'
  },
  {
    id: 'soro-porvorim',
    name: 'Soro – The Village Pub',
    type: 'Bar',
    location: 'Porvorim',
    region: 'North Goa',
    description: 'A popular local pub with live music, karaoke nights, and a friendly Goan crowd.',
    highlights: [
      'Live bands',
      'Karaoke nights',
      'Local crowd',
      'Affordable drinks',
      'Friendly vibe'
    ],
    atmosphere: 'Local, lively, friendly',
    musicGenre: ['Live Band', 'Rock', 'Pop'],
    priceRange: 'Mid-range',
    openingHours: '6:00 PM - 12:00 AM',
    bestFor: ['Live music fans', 'Local experience'],
    image: 'https://images.unsplash.com/photo-1763075?w=800',
    images: [],
    rating: 4.3,
    reviewCount: 1600,
    features: ['Live stage', 'Pub food', 'Bar games'],
    nearbyBeach: 'Miramar Beach'
  },
  {
    id: 'palolem-silent-disco',
    name: 'Palolem Silent Disco',
    type: 'Nightclub',
    location: 'Palolem Beach',
    region: 'South Goa',
    description: 'A famous silent disco experience where partygoers dance with headphones under the stars.',
    highlights: [
      'Silent disco',
      'Beachside party',
      'Multiple DJ channels',
      'Unique experience',
      'Night beach vibes'
    ],
    atmosphere: 'Fun, unique, beach party',
    musicGenre: ['Multiple Channels', 'Electronic', 'Bollywood'],
    priceRange: 'Budget',
    openingHours: '8:00 PM - 12:00 AM',
    bestFor: ['Unique nightlife', 'Groups', 'Beach parties'],
    image: 'https://images.unsplash.com/photo-2114365?w=800',
    images: [],
    rating: 4.6,
    reviewCount: 4100,
    features: ['Wireless headphones', 'Beach party'],
    nearbyBeach: 'Palolem Beach'
  },
  {
    id: 'thirsty-bird-cafe',
    name: 'Thirsty Bird Café',
    type: 'Restaurant & Bar',
    location: 'Calangute, North Goa',
    region: 'North Goa',
    description: 'Charming café with relaxed vibes, great cocktails, and a mix of Goan and continental food options.',
    highlights: [
      'Chill ambience',
      'Creative cocktails',
      'Goan & continental menu',
      'Outdoor seating',
      'Great for brunch'
    ],
    atmosphere: 'Relaxed, casual, outdoors',
    musicGenre: ['Chill', 'Acoustic'],
    priceRange: 'Mid-range',
    openingHours: '9:00 AM – 11:00 PM',
    bestFor: ['Brunch', 'Evening drinks', 'Friends group'],
    image: 'https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg',
    images: [],
    rating: 4.4,
    reviewCount: 720,
    features: ['Outdoor seating', 'Cocktail bar'],
    nearbyBeach: 'Calangute Beach'
  },
  {
    id: 'mojo-at-baga',
    name: 'Mojo at Baga',
    type: 'Restaurant & Bar',
    location: 'Baga Beach, North Goa',
    region: 'North Goa',
    description: 'Popular hangout with upbeat music, creative drinks, and a fusion menu perfect for dinner and social nights.',
    highlights: [
      'Fusion cuisine',
      'Live music evenings',
      'Creative drinks',
      'Party vibe',
      'Beach proximity'
    ],
    atmosphere: 'Festive, social, upbeat',
    musicGenre: ['Pop', 'Electronic', 'Live Band'],
    priceRange: 'Mid-range',
    openingHours: '12:00 PM – 12:00 AM',
    bestFor: ['Groups', 'Evening hangouts', 'Beach lovers'],
    image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg',
    images: [],
    rating: 4.3,
    reviewCount: 1020,
    features: ['Live music', 'Bar menu', 'Beachside seating'],
    nearbyBeach: 'Baga Beach'
  },
  {
    id: 'twist-bistro',
    name: 'Twist Bistro & Bar',
    type: 'Restaurant & Bar',
    location: 'Assagao, North Goa',
    region: 'North Goa',
    description: 'Stylish bistro with inventive cocktails, world cuisine, and a relaxed evening vibe — great for dates or dinner groups.',
    highlights: [
      'Stylish interiors',
      'Inventive cocktails',
      'World cuisine',
      'Date night spot',
      'Weekend vibe'
    ],
    atmosphere: 'Elegant, relaxed, social',
    musicGenre: ['Lounge', 'Jazz', 'Chill'],
    priceRange: 'Luxury',
    openingHours: '5:00 PM – 11:00 PM',
    bestFor: ['Couples', 'Dinner dates', 'Social gatherings'],
    image: 'https://images.pexels.com/photos/4195306/pexels-photo-4195306.jpeg',
    images: [],
    rating: 4.6,
    reviewCount: 820,
    features: ['Cocktail bar', 'Fine dining'],
    nearbyBeach: 'Anjuna Beach'
  },
  {
    id: 'goan-dabbas',
    name: 'Goan Dabbas',
    type: 'Restaurant & Bar',
    location: 'Margao, South Goa',
    region: 'South Goa',
    description: 'Traditional Goan cuisine with local seafood, spirits, and a laidback vibe that blends dining with nightlife.',
    highlights: [
      'Authentic Goan food',
      'Seafood specialties',
      'Local spirits',
      'Casual evening hangout',
      'Family-friendly'
    ],
    atmosphere: 'Casual, family-friendly',
    musicGenre: ['Live Band', 'Acoustic'],
    priceRange: 'Mid-range',
    openingHours: '12:00 PM – 11:00 PM',
    bestFor: ['Local cuisine lovers', 'Seafood fans'],
    image: 'https://images.pexels.com/photos/2335126/pexels-photo-2335126.jpeg',
    images: [],
    rating: 4.5,
    reviewCount: 560,
    features: ['Local cuisine', 'Bar menu'],
    nearbyBeach: 'Colva Beach'
  },
  {
    id: 'sunset-cafe-palolem',
    name: 'Sunset Café Palolem',
    type: 'Restaurant & Bar',
    location: 'Palolem Beach, South Goa',
    region: 'South Goa',
    description: 'Relaxed beachside café serving seafood, refreshing cocktails, and beautiful sunset views — perfect for evenings.',
    highlights: [
      'Sunset views',
      'Seafood delights',
      'Refreshing cocktails',
      'Beachside seating',
      'Casual vibes'
    ],
    atmosphere: 'Relaxed, beachy',
    musicGenre: ['Chill', 'Acoustic'],
    priceRange: 'Mid-range',
    openingHours: '10:00 AM – 10:00 PM',
    bestFor: ['Sunset drinks', 'Beach dining'],
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    images: [],
    rating: 4.3,
    reviewCount: 430,
    features: ['Sunset seatings', 'Bar menu'],
    nearbyBeach: 'Palolem Beach'
  },
  {
    id: 'bay-15-beach-club',
    name: 'Bay 15 Beach Club',
    type: 'Restaurant & Bar',
    location: 'Benaulim Beach, South Goa',
    region: 'South Goa',
    description: 'Trendy beach club with chill vibes, creative cocktails, and seafood, offering a relaxed blend of dining and nightlife.',
    highlights: [
      'Beach club vibe',
      'Creative drinks',
      'Seafood menu',
      'Sunset views',
      'Casual parties'
    ],
    atmosphere: 'Beachy, relaxed, social',
    musicGenre: ['Lounge', 'Electronic', 'Chill'],
    priceRange: 'Mid-range',
    openingHours: '11:00 AM – 10:00 PM',
    bestFor: ['Beach lovers', 'Sunset dinners', 'Groups'],
    image: 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg',
    images: [],
    rating: 4.2,
    reviewCount: 620,
    features: ['Beach seating', 'Bar menu'],
    nearbyBeach: 'Benaulim Beach'
  },
  {
    id: 'the-beach-house',
    name: 'The Beach House',
    type: 'Restaurant & Bar',
    location: 'Candolim Beach, North Goa',
    region: 'North Goa',
    description: 'Casual beachside restaurant and bar known for fresh seafood, cocktails, and a relaxed all-day vibe right on the sand.',
    highlights: [
      'Fresh seafood',
      'Beachfront location',
      'All-day bar',
      'Casual dining',
      'Chilled music'
    ],
    atmosphere: 'Beachside, casual, fun',
    musicGenre: ['Chill', 'Acoustic', 'Pop'],
    priceRange: 'Mid-range',
    openingHours: '9:00 AM – 11:00 PM',
    bestFor: ['Beach meals', 'Drinks with friends'],
    image: 'https://images.pexels.com/photos/2619969/pexels-photo-2619969.jpeg',
    images: [],
    rating: 4.4,
    reviewCount: 780,
    features: ['Beach seating', 'Bar menu'],
    nearbyBeach: 'Candolim Beach'
  },
  {
    id: 'shining-star-cafe',
    name: 'Shining Star Café',
    type: 'Restaurant & Bar',
    location: 'Margao, South Goa',
    region: 'South Goa',
    description: 'Cafe & bar with a cozy vibe, live music nights, and a mix of Goan and continental dishes, perfect for relaxed evenings.',
    highlights: [
      'Live music',
      'Cozy interiors',
      'Goan + continental menu',
      'Bar',
      'Evening hangout'
    ],
    atmosphere: 'Cozy, social',
    musicGenre: ['Acoustic', 'Live Band'],
    priceRange: 'Budget',
    openingHours: '10:00 AM – 11:00 PM',
    bestFor: ['Local crowd', 'Live music nights'],
    image: 'https://images.pexels.com/photos/241551/pexels-photo-241551.jpeg',
    images: [],
    rating: 4.1,
    reviewCount: 290,
    features: ['Live music', 'Bar menu'],
    nearbyBeach: 'Colva Beach'
  },
  {
    id: 'the-hangout-goa',
    name: 'The Hangout Goa',
    type: 'Restaurant & Bar',
    location: 'Vasco da Gama, South Goa',
    region: 'South Goa',
    description: 'Casual bar with outdoor seating, local drinks, and occasional DJs — great for a relaxed night out near the city.',
    highlights: [
      'Outdoor bar',
      'Local drinks',
      'DJ nights',
      'Social vibe',
      'Casual crowd'
    ],
    atmosphere: 'Casual, social, relaxed',
    musicGenre: ['Pop', 'DJ Mixes'],
    priceRange: 'Budget',
    openingHours: '5:00 PM – 12:00 AM',
    bestFor: ['Group hangouts', 'Relaxed nightlife'],
    image: 'https://images.pexels.com/photos/2523734/pexels-photo-2523734.jpeg',
    images: [],
    rating: 4.2,
    reviewCount: 510,
    features: ['Outdoor seating', 'DJ nights'],
    nearbyBeach: 'Bogmalo Beach'
  }
];

export const getNightlifeByRegion = (region: 'North Goa' | 'South Goa') => {
  return goaNightlife.filter(venue => venue.region === region);
};

export const getNightlifeByType = (type: NightlifeVenue['type']) => {
  return goaNightlife.filter(venue => venue.type === type);
};

export const getNightlifeByLocation = (location: string) => {
  return goaNightlife.filter(venue =>
    venue.location.toLowerCase().includes(location.toLowerCase())
  );
};

export const getNightlifeById = (id: string) => {
  return goaNightlife.find(venue => venue.id === id);
};

export const getTopRatedNightlife = (limit: number = 5) => {
  return goaNightlife
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getNightlifeByPriceRange = (priceRange: NightlifeVenue['priceRange']) => {
  return goaNightlife.filter(venue => venue.priceRange === priceRange);
};