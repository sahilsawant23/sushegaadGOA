export interface Festival {
  id: string;
  name: string;
  category: 'cultural' | 'religious' | 'music' | 'seasonal';
  description: string;
  longDescription: string;
  dates: string;
  duration: string;
  location: string;
  highlights: string[];
  activities: string[];
  images: string[];
  bestTime: string;
  tips: string[];
  bookingInfo?: string;
}

export const festivals: Festival[] = [
  {
    id: 'goa-carnival',
    name: 'Goa Carnival',
    category: 'cultural',
    description: 'A vibrant, week-long celebration with parades, music, and dance, marking the start of Lent.',
    longDescription: 'The Goa Carnival is one of the most famous and colorful festivals in India, celebrated with great enthusiasm across the state. This vibrant celebration features elaborate parades with floats, dancers in elaborate costumes, live music performances, and street parties. The carnival has its roots in Portuguese tradition and is celebrated just before Lent, making it a final celebration before the period of abstinence.',
    dates: 'February/March (before Lent)',
    duration: '3-4 days',
    location: 'Panaji, Margao, Vasco, Mapusa',
    highlights: [
      'Colorful parades with floats',
      'Traditional dance performances',
      'Live music and bands',
      'Street food stalls',
      'Costume competitions',
      'Fireworks displays'
    ],
    activities: [
      'Watch parade floats',
      'Join street parties',
      'Try traditional Goan food',
      'Dance to live music',
      'Photography of costumes',
      'Shop for carnival masks'
    ],
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800',
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800'
    ],
    bestTime: 'February 10-13',
    tips: [
      'Book accommodations early',
      'Wear comfortable shoes',
      'Bring camera for photos',
      'Try local street food',
      'Stay hydrated'
    ]
  },
  {
    id: 'shigmo',
    name: 'Shigmo',
    category: 'cultural',
    description: 'A spring festival with traditional folk dances, vibrant floats, and water activities, celebrating Goas cultural roots.',
    longDescription: 'Shigmo is Goas version of Holi, celebrated as a spring festival that marks the end of winter and beginning of spring. This traditional festival showcases Goas rich cultural heritage through folk dances like Ghode Modni and Fugdi, colorful processions with mythological themes, and water celebrations. The festival is particularly significant in rural Goa where farmers celebrate the harvest season.',
    dates: 'March/April (around Holi)',
    duration: '14 days',
    location: 'Across Goa, especially rural areas',
    highlights: [
      'Traditional folk dances',
      'Colorful processions',
      'Mythological floats',
      'Water celebrations',
      'Harvest rituals',
      'Cultural performances'
    ],
    activities: [
      'Watch folk dances',
      'Participate in processions',
      'Enjoy water activities',
      'Visit villages',
      'Photography of traditions',
      'Taste seasonal sweets'
    ],
    images: [
      'https://images.unsplash.com/photo-1551858448-63a1e5d0acdd?w=800',
      'https://images.unsplash.com/photo-1551858448-63a1e5d0acdd?w=800'
    ],
    bestTime: 'March 15-30',
    tips: [
      'Visit rural villages for authentic experience',
      'Respect local traditions',
      'Wear clothes that can get wet',
      'Bring waterproof camera'
    ]
  },
  {
    id: 'sao-joao',
    name: 'Sao Joao',
    category: 'religious',
    description: 'Celebrated in June, honoring St. John the Baptist, with people jumping into wells and rivers.',
    longDescription: 'Sao Joao is a unique monsoon festival celebrated on June 24th to honor St. John the Baptist. The most distinctive feature is the tradition of young men jumping into wells, streams, and ponds, often wearing crowns of leaves and flowers. The festival includes boat races, traditional music, dance performances, and the famous Sangodd (boat parade) where boats are decorated with themes.',
    dates: 'June 24th',
    duration: '1 day',
    location: 'Across Goa, especially Siolim, Assagao, Calangute',
    highlights: [
      'Jumping into wells/rivers',
      'Leaf and flower crowns',
      'Boat races',
      'Traditional music',
      'Sangodd boat parade',
      'Local feasts'
    ],
    activities: [
      'Watch well-jumping',
      'Attend boat races',
      'Join boat parades',
      'Dance to traditional music',
      'Try local food',
      'Photography of traditions'
    ],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    bestTime: 'June 24',
    tips: [
      'Visit Siolim for best celebrations',
      'Bring rain gear',
      'Respect religious aspects',
      'Join local celebrations'
    ]
  },
  {
    id: 'st-francis-xavier',
    name: 'Feast of St. Francis Xavier',
    category: 'religious',
    description: 'A major religious festival honoring Goas patron saint, with prayers, processions, and celebrations.',
    longDescription: 'The Feast of St. Francis Xavier is one of the most important religious festivals in Goa, held every year on December 3rd. The nine-day novena precedes the feast day, attracting thousands of pilgrims from across India and abroad. The celebrations include special masses, processions carrying the relics of the saint, cultural programs, and a large fair near the Basilica of Bom Jesus.',
    dates: 'December 3rd (Novena starts November 24)',
    duration: '10 days',
    location: 'Old Goa, Basilica of Bom Jesus',
    highlights: [
      'Special masses',
      'Religious processions',
      'Pilgrimage activities',
      'Cultural programs',
      'Traditional fair',
      'Religious ceremonies'
    ],
    activities: [
      'Attend mass',
      'Join processions',
      'Visit Basilica',
      'Shop at fair',
      'Photography of ceremonies',
      'Meet pilgrims'
    ],
    images: [
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800',
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800'
    ],
    bestTime: 'November 24 - December 3',
    tips: [
      'Book accommodations early',
      'Respect religious customs',
      'Visit early morning for mass',
      'Try local food at fair'
    ]
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    category: 'religious',
    description: 'A grand celebration of Lord Ganeshas arrival, with traditional rituals, idol processions, and feasts.',
    longDescription: 'Ganesh Chaturthi in Goa is celebrated with great devotion and grandeur. The festival lasts for 1.5 to 11 days, with beautifully decorated Ganesh idols installed in homes and public pandals. The celebrations include daily prayers, cultural programs, traditional music, and on the final day, grand processions for visarjan (immersion) accompanied by dancing and singing.',
    dates: 'August/September (varies by lunar calendar)',
    duration: '1.5 to 11 days',
    location: 'Across Goa',
    highlights: [
      'Decorated Ganesh idols',
      'Daily prayers and rituals',
      'Cultural programs',
      'Traditional music',
      'Grand processions',
      'Community feasts'
    ],
    activities: [
      'Visit decorated pandals',
      'Attend prayers',
      'Watch cultural programs',
      'Join processions',
      'Try modak sweets',
      'Photography of idols'
    ],
    images: [
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800',
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800'
    ],
    bestTime: 'August-September',
    tips: [
      'Visit both home and public celebrations',
      'Respect religious sentiments',
      'Try traditional sweets',
      'Photograph decorated pandals'
    ]
  },
  {
    id: 'bonderam',
    name: 'Bonderam',
    category: 'seasonal',
    description: 'A monsoon festival celebrated on Divar Island, commemorating historical disputes.',
    longDescription: 'Bonderam is a unique monsoon festival celebrated on Divar Island on the fourth Saturday of August. The festival commemorates the historical disputes between villagers over land boundaries, where flags were used to mark territories. Today, it features colorful flag parades, traditional music, dance performances, and a festive atmosphere despite the monsoon rains.',
    dates: 'Fourth Saturday of August',
    duration: '1 day',
    location: 'Divar Island',
    highlights: [
      'Colorful flag parades',
      'Traditional music',
      'Dance performances',
      'Monsoon celebrations',
      'Island atmosphere',
      'Local traditions'
    ],
    activities: [
      'Watch flag parades',
      'Enjoy monsoon atmosphere',
      'Try local food',
      'Photography of celebrations',
      'Explore Divar Island',
      'Interact with locals'
    ],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    bestTime: 'Fourth Saturday of August',
    tips: [
      'Take ferry to Divar Island',
      'Bring rain gear',
      'Try local island food',
      'Respect island traditions'
    ]
  },
  {
    id: 'sunburn',
    name: 'Sunburn Festival',
    category: 'music',
    description: 'Asias biggest electronic dance music festival, held in December, attracting international DJs and music lovers.',
    longDescription: 'Sunburn Festival is Asia\'s largest electronic dance music festival, held annually in December in Goa. This three-day extravaganza features world-renowned DJs, spectacular stage designs, light shows, and attracts music lovers from across the globe. The festival offers multiple stages, food courts, merchandise stalls, and camping options.',
    dates: 'December 27-29',
    duration: '3 days',
    location: 'Vagator Beach (venue may vary)',
    highlights: [
      'International DJs',
      'Multiple stages',
      'Spectacular light shows',
      'Food courts',
      'Merchandise stalls',
      'Camping options'
    ],
    activities: [
      'Dance to EDM music',
      'Meet international artists',
      'Enjoy light shows',
      'Shop merchandise',
      'Camp at venue',
      'Photography of performances'
    ],
    images: [
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800',
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800'
    ],
    bestTime: 'December 27-29',
    tips: [
      'Book tickets early',
      'Stay hydrated',
      'Wear comfortable shoes',
      'Bring portable charger'
    ]
  },
  {
    id: 'supersonic',
    name: 'Supersonic Festival',
    category: 'music',
    description: 'Another popular EDM festival with international artists and beach parties.',
    longDescription: 'Supersonic Festival is another major EDM festival in Goa, offering a unique beach party experience with international artists, multiple stages, and a vibrant atmosphere. The festival combines music with beach activities, water sports, and luxury experiences.',
    dates: 'February',
    duration: '3 days',
    location: 'Candolim Beach',
    highlights: [
      'Beach parties',
      'International artists',
      'Water activities',
      'Luxury experiences',
      'Multiple stages',
      'Sunset sessions'
    ],
    activities: [
      'Beach parties',
      'Water sports',
      'Sunset sessions',
      'Meet artists',
      'Luxury dining',
      'Photography'
    ],
    images: [
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800',
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800'
    ],
    bestTime: 'February',
    tips: [
      'Book beach accommodations',
      'Try water sports',
      'Attend sunset sessions',
      'Book luxury packages'
    ]
  },
  {
    id: 'grape-escapade',
    name: 'Grape Escapade',
    category: 'seasonal',
    description: 'A gourmet and cultural festival celebrating wine.',
    longDescription: 'Grape Escapade is Goa\'s premier wine and gourmet festival, celebrating the region\'s growing wine culture. The festival features wine tastings from local and international wineries, gourmet food stalls, cooking demonstrations, live music, and cultural performances. It\'s a perfect blend of culinary excellence and cultural entertainment.',
    dates: 'January',
    duration: '3-4 days',
    location: 'Panaji',
    highlights: [
      'Wine tastings',
      'Gourmet food',
      'Cooking demos',
      'Live music',
      'Cultural shows',
      'Wine workshops'
    ],
    activities: [
      'Wine tasting',
      'Food sampling',
      'Cooking classes',
      'Live music',
      'Wine shopping',
      'Meet winemakers'
    ],
    images: [
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800',
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800'
    ],
    bestTime: 'January',
    tips: [
      'Book wine tasting sessions',
      'Try food pairings',
      'Attend workshops',
      'Buy wine souvenirs'
    ]
  },
  {
    id: 'christmas-newyear',
    name: 'Christmas and New Year\'s Eve',
    category: 'seasonal',
    description: 'Goa is known for its lively Christmas celebrations and New Year\'s Eve parties.',
    longDescription: 'Christmas and New Year celebrations in Goa are legendary, with the entire state transforming into a festive wonderland. Churches are beautifully decorated, midnight masses are held, and the beaches come alive with parties, fireworks, and celebrations. From traditional Christmas feasts to beach parties on New Year\'s Eve, Goa offers the perfect blend of tradition and modern celebration.',
    dates: 'December 24-31',
    duration: '8 days',
    location: 'Across Goa',
    highlights: [
      'Church decorations',
      'Midnight masses',
      'Beach parties',
      'Fireworks displays',
      'Traditional feasts',
      'New Year countdowns'
    ],
    activities: [
      'Attend midnight mass',
      'Enjoy beach parties',
      'Watch fireworks',
      'Try Christmas sweets',
      'Join New Year celebrations',
      'Photography of decorations'
    ],
    images: [
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800',
      'https://images.unsplash.com/photo-1544731612-dee97a9c1a4d?w=800'
    ],
    bestTime: 'December 24-31',
    tips: [
      'Book accommodations months in advance',
      'Attend midnight mass',
      'Try traditional sweets',
      'Book beach party tickets'
    ]
  }
];

export const festivalCategories = [
  { id: 'all', name: 'All Festivals', icon: '' },
  { id: 'cultural', name: 'Cultural', icon: '' },
  { id: 'religious', name: 'Religious', icon: '' },
  { id: 'music', name: 'Music & EDM', icon: '' },
  { id: 'seasonal', name: 'Seasonal', icon: '' }
];

export const getFestivalsByCategory = (category: string) => {
  if (category === 'all') return festivals;
  return festivals.filter(festival => festival.category === category);
};

export const getUpcomingFestivals = () => {
  const currentMonth = new Date().getMonth() + 1;
  return festivals.filter(festival => {
    const festivalMonth = getFestivalMonth(festival.dates);
    return festivalMonth >= currentMonth || festivalMonth <= (currentMonth + 2) % 12;
  });
};

const getFestivalMonth = (dates: string): number => {
  const monthMap: { [key: string]: number } = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
    'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
  };
  
  for (const month in monthMap) {
    if (dates.includes(month)) return monthMap[month];
  }
  return 1;
};
