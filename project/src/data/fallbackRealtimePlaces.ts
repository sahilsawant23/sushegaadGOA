export interface FallbackPlace {
    id: string;
    name: string;
    type: string;
    location: string;
    region: 'North Goa' | 'South Goa';
    description: string;
    priceRange: 'Budget' | 'Mid-range' | 'Luxury';
    openingHours: string;
    image: string;
    rating: number;
    reviewCount: number;
    latitude?: number;
    longitude?: number;
    reviewsList?: { author: string; rating: number; comment: string }[];
}

export const fallbackRealtimePlaces: FallbackPlace[] = [
    // --- CASINOS ---
    {
        id: 'premium-casino-1',
        name: 'Deltin Royale Casino',
        type: 'Casino',
        location: "Noah's Ark, RND Jetty, D. Bandodkar Marg, Panaji",
        region: 'North Goa',
        description: "India's largest and most luxurious floating casino. Offers a premium gaming experience, multi-cuisine dining, and live international entertainment on the Mandovi River.",
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
        rating: 4.8,
        reviewCount: 2450,
        latitude: 15.5015,
        longitude: 73.8245,
        reviewsList: [
            { author: 'Vikram Mehta', rating: 5, comment: 'World-class offshore casino experience in Panaji! Excellent food and games.' },
            { author: 'Sarah Connor', rating: 5, comment: 'Lively vibe and great entertainment options on Mandovi river.' }
        ]
    },
    {
        id: 'premium-casino-2',
        name: 'Majestic Pride Casino',
        type: 'Casino',
        location: 'River Mandovi, Captain Of Ports Jetty, Panaji',
        region: 'North Goa',
        description: 'An exceptional floating casino in Goa, offering a grand gaming floor, delicious dining options, live performances, and an energizing party atmosphere.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800',
        rating: 4.6,
        reviewCount: 1890,
        latitude: 15.5020,
        longitude: 73.8260,
        reviewsList: [
            { author: 'Rahul Deshmukh', rating: 4, comment: 'Very lively atmosphere with great live DJ and dance performances.' }
        ]
    },
    {
        id: 'premium-casino-3',
        name: 'Big Daddy Casino',
        type: 'Casino',
        location: 'Captain of Ports Jetty, Dayanand Bandodkar Marg, Panaji',
        region: 'North Goa',
        description: 'A state-of-the-art floating casino on the Mandovi River, featuring offshore gaming, multi-cuisine restaurants, premium bars, and spectacular live dance shows.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1570649236495-42fa5fe3c48b?w=800',
        rating: 4.7,
        reviewCount: 3100,
        latitude: 15.5010,
        longitude: 73.8230,
        reviewsList: [
            { author: 'Elena Gilbert', rating: 5, comment: 'Super luxurious boat with non-stop gaming and buffet.' }
        ]
    },
    {
        id: 'premium-casino-4',
        name: 'Casino Strike by Deltin',
        type: 'Casino',
        location: 'Grand Hyatt Goa, Bambolim, Goa',
        region: 'North Goa',
        description: "India's largest land-based casino located in the luxury Grand Hyatt resort. Features state-of-the-art gaming, live performance stages, and gourmet dining.",
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
        rating: 4.6,
        reviewCount: 950,
        latitude: 15.4590,
        longitude: 73.8565
    },

    // --- HOTELS & RESORTS ---
    {
        id: 'hotel-1',
        name: 'Taj Fort Aguada Resort & Spa',
        type: 'Resort',
        location: 'Sinquerim Beach, Candolim, North Goa',
        region: 'North Goa',
        description: 'A romantic 5-star beachfront resort steeped in history, offering panoramic ocean views, lush gardens, and signature Taj hospitality.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        rating: 4.9,
        reviewCount: 1420,
        latitude: 15.4920,
        longitude: 73.7680,
        reviewsList: [
            { author: 'Amit Sharma', rating: 5, comment: 'Breathtaking ocean views and legendary Taj hospitality.' }
        ]
    },
    {
        id: 'hotel-2',
        name: 'The Zuri White Sands Resort',
        type: 'Resort',
        location: 'Varca Beach, Salcete, South Goa',
        region: 'South Goa',
        description: 'An award-winning luxury beach resort located on the pristine Varca beach with sprawling pools, casino, and peaceful surroundings.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        rating: 4.7,
        reviewCount: 880,
        latitude: 15.2155,
        longitude: 73.9295
    },
    {
        id: 'hotel-3',
        name: 'The Hosteller Anjuna',
        type: 'Hostel',
        location: 'Anjuna Beach Road, North Goa',
        region: 'North Goa',
        description: 'Vibrant backpacker hostel with a pool, co-working space, and lively community vibe just minutes away from Anjuna beach.',
        priceRange: 'Budget',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
        rating: 4.4,
        reviewCount: 520,
        latitude: 15.5830,
        longitude: 73.7430
    },

    // --- CLUBS & BEACH SHACKS ---
    {
        id: 'club-1',
        name: "Tito's Nightclub",
        type: 'Nightclub',
        location: "Tito's Lane, Baga Beach, North Goa",
        region: 'North Goa',
        description: "The most famous nightclub in Goa, featuring multi-genre music, open-air bar, and legendary DJ nights.",
        priceRange: 'Mid-range',
        openingHours: '7:00 PM - 3:00 AM',
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800',
        rating: 4.5,
        reviewCount: 3820,
        latitude: 15.5560,
        longitude: 73.7520,
        reviewsList: [
            { author: 'Pooja Hegde', rating: 5, comment: 'Electric energy! Always a classic night out when visiting Baga.' }
        ]
    },
    {
        id: 'club-2',
        name: 'Curlies Beach Shack',
        type: 'Beach Shack',
        location: 'Anjuna Beach, North Goa',
        region: 'North Goa',
        description: 'Iconic beachfront shack famous for trance music parties, sunset views, fresh seafood, and relaxed beach lounge seating.',
        priceRange: 'Mid-range',
        openingHours: '9:00 AM - 3:00 AM',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        rating: 4.4,
        reviewCount: 2900,
        latitude: 15.5780,
        longitude: 73.7380
    },
    {
        id: 'club-3',
        name: 'Club Cubana',
        type: 'Nightclub',
        location: 'Arpora Hill, North Goa',
        region: 'North Goa',
        description: 'Known as the "Nightclub in the Sky", featuring a hilltop swimming pool, open canopy dance floors, and breathtaking views.',
        priceRange: 'Luxury',
        openingHours: '9:30 PM - 4:00 AM',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
        rating: 4.6,
        reviewCount: 2150,
        latitude: 15.5680,
        longitude: 73.7620
    },

    // --- RESTAURANTS & BARS ---
    {
        id: 'rest-1',
        name: 'Thalassa Greek Restaurant',
        type: 'Restaurant & Bar',
        location: 'Vagator / Siolim, North Goa',
        region: 'North Goa',
        description: 'Stunning cliffside Greek restaurant overlooking the Arabian sea, famous for authentic Mediterranean cuisine and spectacular sunset views.',
        priceRange: 'Luxury',
        openingHours: '12:00 PM - 1:00 AM',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        rating: 4.7,
        reviewCount: 4100,
        latitude: 15.6020,
        longitude: 73.7390,
        reviewsList: [
            { author: 'Sam Wilson', rating: 5, comment: 'Unbeatable sunset location and incredible Greek mezze platter.' }
        ]
    },
    {
        id: 'rest-2',
        name: "Martin's Corner",
        type: 'Restaurant & Bar',
        location: 'Ranvaddo, Betalbatim, South Goa',
        region: 'South Goa',
        description: 'Legendary Goan seafood restaurant serving authentic Fish Curry Rice, Pork Vindaloo, and fresh lobster with live acoustic music.',
        priceRange: 'Mid-range',
        openingHours: '11:30 AM - 11:30 PM',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        rating: 4.8,
        reviewCount: 3500,
        latitude: 15.2850,
        longitude: 73.9120
    },
    {
        id: 'rest-3',
        name: "Fisherman's Wharf",
        type: 'Restaurant & Bar',
        location: 'Cavelossim Beach, South Goa',
        region: 'South Goa',
        description: 'Riverside dining experience along the Sal river in South Goa, blending fusion cuisine, Goan flavors, and soothing water views.',
        priceRange: 'Mid-range',
        openingHours: '12:00 PM - 11:00 PM',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        rating: 4.6,
        reviewCount: 2200,
        latitude: 15.1740,
        longitude: 73.9450
    },

    // --- CAFES ---
    {
        id: 'cafe-1',
        name: 'Artjuna Garden Cafe',
        type: 'Cafe',
        location: 'Anjuna-Monteiro Vaddo, North Goa',
        region: 'North Goa',
        description: 'Charming open-air garden cafe and lifestyle store serving organic breakfasts, artisan coffee, fresh juices, and Mediterranean salads.',
        priceRange: 'Mid-range',
        openingHours: '7:30 AM - 10:30 PM',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        rating: 4.7,
        reviewCount: 1650,
        latitude: 15.5810,
        longitude: 73.7450
    },
    {
        id: 'cafe-2',
        name: 'Eva Cafe',
        type: 'Cafe',
        location: 'Anjuna Beach, North Goa',
        region: 'North Goa',
        description: 'Boho-chic sea-facing cafe right on the rocks of Anjuna, offering panoramic ocean vistas, avocado toast, and relaxing coffee.',
        priceRange: 'Mid-range',
        openingHours: '9:00 AM - 8:00 PM',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
        rating: 4.5,
        reviewCount: 1280,
        latitude: 15.5840,
        longitude: 73.7410
    },
    {
        id: 'cafe-3',
        name: 'Cafe Bodega',
        type: 'Cafe',
        location: 'Sunaparanta Centre for the Arts, Altinho, Panaji',
        region: 'North Goa',
        description: 'Serene courtyard cafe set inside a hilltop art gallery in Panaji, famous for fresh bakes, gourmet sandwiches, and quiet ambiance.',
        priceRange: 'Budget',
        openingHours: '10:00 AM - 7:00 PM',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
        rating: 4.6,
        reviewCount: 940,
        latitude: 15.4950,
        longitude: 73.8290
    }
];
