export interface Waterfall {
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyPlaces: string[];
  safetyTips: string;
  bestSeason: string;
  id: number;
  name: string;
  location: string;
  region: string;
  description: string;
  height: string;
  bestTimeToVisit: string;
  difficulty: string;
  highlights: string[];
  image: string;
  images: string[];
  distanceFromPanaji: string;
  entryFee: string;
}

export const goaWaterfalls: Waterfall[] = [
  {
    id: 1,
    name: "Dudhsagar Falls",
    location: "Mollem, Goa-Karnataka Border",
    region: "South Goa",
    description: "Dudhsagar Falls, also known as the 'Sea of Milk' due to its milky white waters, is one of India's most spectacular waterfalls and the fifth tallest waterfall in the country. Located on the Goa-Karnataka border, this majestic cascade plunges from a staggering height of 310 meters through four distinct tiers, creating a breathtaking spectacle that has earned it the title of one of Asia's most beautiful waterfalls. The falls are fed by the Mandovi River and are surrounded by lush Western Ghats forests, making it a paradise for nature lovers, photographers, and adventure seekers. Visitors can enjoy the view from various vantage points, including a thrilling train journey that passes right under the falls, or embark on a moderate trek to reach the base for an up-close experience. The area is rich in biodiversity and offers opportunities for birdwatching and wildlife spotting.",
    height: "310 meters",
    bestTimeToVisit: "June to September (Monsoon)",
    difficulty: "Moderate",
    highlights: ["310m height", "Four tiers", "Monsoon spectacle", "Trek to base"],
    image: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg",
    images: [
      "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg",
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
      "https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg"
    ],
    distanceFromPanaji: "60 km",
    entryFee: "₹50",
    coordinates: {
      lat: 15.3144,
      lng: 74.3154
    },
    nearbyPlaces: ["Bhagwan Mahavir Wildlife Sanctuary", "Tambdi Surla Temple", "Mollem National Park", "Castle Rock", "Anjaneri Fort", "Amboli Ghat", "Bondla Wildlife Sanctuary", "Mhadei Wildlife Sanctuary", "Kavlem Caves"],
    safetyTips: "Wear sturdy shoes for the 1-2 hour trek to the base. Avoid swimming in strong currents as the water flow can be extremely powerful. Carry sufficient water, snacks, and insect repellent. Check weather conditions before visiting, especially during monsoon when paths can be slippery. Respect the natural environment and follow park guidelines. Avoid visiting alone; go in groups. Keep a safe distance from the edge of viewpoints. If trekking, inform someone about your plans and expected return time. Photography is allowed but be careful with equipment near water.",
    bestSeason: "The monsoon season from June to September is the absolute best time to visit Dudhsagar Falls when the waterfall is at its most spectacular, with thunderous cascades and mist-filled air creating a magical atmosphere. During this period, the falls transform into a roaring powerhouse, offering the most dramatic views and the chance to witness nature's raw power. However, the trek can be challenging due to heavy rains and slippery paths. The post-monsoon months of October to November offer good flow with clearer skies, while the dry season from December to May sees reduced water volume but easier trekking conditions and fewer crowds."
  },
  {
    id: 2,
    name: "Arvalem Falls",
    location: "Arvalem, Sanvordem",
    region: "South Goa",
    description: "Arvalem Falls, also known as Arvalem Waterfall or Sula Vine, is a charming and serene waterfall located in the village of Arvalem in South Goa. This picturesque cascade is surrounded by lush green forests and offers a tranquil escape from the hustle and bustle of city life. The waterfall creates a natural swimming pool at its base, making it an ideal spot for picnics, photography, and family outings. The surrounding area is rich in flora and fauna, with numerous nature trails that allow visitors to explore the Western Ghats biodiversity. The falls are particularly stunning after monsoon rains when the water flow is at its peak, creating a misty atmosphere and rainbow formations. It's a perfect destination for nature lovers, birdwatchers, and those seeking peaceful relaxation amidst Goa's natural beauty. The site also holds cultural significance and is often visited by locals for traditional ceremonies.",
    height: "20 meters",
    bestTimeToVisit: "June to September",
    difficulty: "Easy",
    highlights: ["Lush surroundings", "Swimming pool", "Photography spot", "Nature trails"],
    image: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg",
    images: [
      "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg",
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
      "https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg"
    ],
    distanceFromPanaji: "45 km",
    entryFee: "Free",
    coordinates: {
      lat: 15.2833,
      lng: 74.1167
    },
    nearbyPlaces: ["Netravali Wildlife Sanctuary", "Tambdi Surla Temple", "Cotigao Wildlife Sanctuary", "Mahadev Temple", "Sula Vineyards", "Chorla Ghat", "Kavlem Caves", "Dudhsagar Falls", "Bhagwan Mahavir Wildlife Sanctuary", "Rivona Caves"],
    safetyTips: "Swim only in the designated natural pool area and avoid strong currents. Watch for slippery rocks and algae on surfaces, especially after rain. Avoid visiting during heavy monsoon when water levels are high and paths are muddy. Respect the natural environment by not littering and following local guidelines. Wear appropriate footwear for walking on uneven terrain. Keep a safe distance from the waterfall edge. Avoid drinking untreated water from the falls. If swimming, go with companions and supervise children closely. Check for any wildlife in the area before entering. Visit during daylight hours for safety.",
    bestSeason: "The monsoon season from June to September is ideal for visiting Arvalem Falls when the waterfall is at its most impressive, with full water flow creating a spectacular cascade and natural swimming pool. The lush greenery is at its peak during this time, and the misty atmosphere adds to the magical ambiance. However, the area can be muddy and slippery, so caution is advised. The post-monsoon months of October to November offer pleasant weather with good water flow and clearer skies, making it easier to explore the surroundings. The dry season from December to May sees reduced water volume but crystal-clear pools and comfortable trekking conditions."
  },
  {
    id: 3,
    name: "Kesarval Springs",
    location: "Kesarval, Loutolim",
    region: "South Goa",
    description: "Kesarval Springs, also known as Kesarval Waterfall, is a pristine natural spring located in the village of Kesarval in South Goa. This hidden gem features crystal-clear water cascading gently over laterite rock formations, creating a serene and picturesque setting amidst dense forest surroundings. The springs are fed by underground water sources and maintain their clarity throughout the year, offering visitors a chance to witness the natural beauty of Goa's freshwater ecosystems. The area is characterized by its unique laterite cliffs that have been shaped by centuries of water flow, creating natural pools and mini-waterfalls. It's an excellent spot for nature photography, birdwatching, and peaceful contemplation. The surrounding forest is home to various species of birds, butterflies, and small mammals, making it a biodiversity hotspot. The springs hold cultural significance for local communities and are often associated with traditional water rituals and ceremonies.",
    height: "15 meters",
    bestTimeToVisit: "October to May",
    difficulty: "Easy",
    highlights: ["Crystal clear water", "Natural spring", "Laterite cliffs", "Forest setting"],
    image: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg",
    images: [
      "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg",
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
      "https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg"
    ],
    distanceFromPanaji: "25 km",
    entryFee: "Free",
    coordinates: {
      lat: 15.2833,
      lng: 73.9833
    },
    nearbyPlaces: ["Loutolim Beach", "Velsao Beach", "Shantadurga Temple", "Nagueshi Temple", "Raia Beach", "Siridao Beach", "Benaulim Beach", "Colva Beach", "Margao City", "Chandor Village"],
    safetyTips: "The spring water appears clean but should not be consumed without proper treatment due to potential natural contaminants. Be aware of wildlife in the forest area and maintain a safe distance. Stick to established paths to avoid getting lost or disturbing the natural habitat. Visit only during daylight hours for safety and to respect wildlife patterns. Wear appropriate clothing and footwear for walking on uneven laterite surfaces. Avoid littering and help preserve the pristine environment. If bringing children, supervise them closely near water areas. Check for any slippery algae on rocks before stepping. Respect local customs and avoid disturbing any ongoing rituals. Carry insect repellent as the forest area may have mosquitoes.",
    bestSeason: "The dry season from October to May is the best time to visit Kesarval Springs when the water is at its clearest and most pristine, allowing visitors to fully appreciate the crystal-clear cascades and natural pools. During this period, the weather is pleasant, and the forest surroundings are lush without the heavy monsoon humidity. The springs maintain good water flow even in drier months due to their underground sources. The post-monsoon months of October to November offer the clearest water after seasonal rains have washed away any sediment. The cooler winter months of December to February provide comfortable visiting conditions, while March to May sees slightly warmer weather but still excellent visibility."
  },
  {
    id: 4,
    name: 'Tambdi Surla Falls',
    location: 'Bhagwan Mahavir Wildlife Sanctuary',
    region: 'South Goa',
    description: 'A scenic seasonal waterfall located near the historic Tambdi Surla Temple, surrounded by dense forests of the Western Ghats.',
    height: '25 meters',
    bestTimeToVisit: 'July to September',
    difficulty: 'Moderate',
    highlights: [
      'Ancient Tambdi Surla Temple nearby',
      'Dense forest surroundings',
      'Monsoon waterfall'
    ],
    image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg',
    images: [
      'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    distanceFromPanaji: '65 km',
    entryFee: 'Free',
    coordinates: { lat: 15.3140, lng: 74.2380 },
    nearbyPlaces: ['Tambdi Surla Temple', 'Mollem National Park'],
    safetyTips: 'Wear trekking shoes and avoid slippery paths during heavy monsoon.',
    bestSeason: 'Monsoon'
  },
  {
    id: 5,
    name: 'Netravali Waterfalls',
    location: 'Netravali Wildlife Sanctuary',
    region: 'South Goa',
    description: 'A pristine waterfall hidden inside the Netravali Wildlife Sanctuary, ideal for eco-tourism and nature exploration.',
    height: '30 meters',
    bestTimeToVisit: 'August to October',
    difficulty: 'Moderate',
    highlights: [
      'Wildlife sanctuary',
      'Eco-tourism spot',
      'Less crowded'
    ],
    image: 'https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg',
    images: [
      'https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg',
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800'
    ],
    distanceFromPanaji: '55 km',
    entryFee: '₹50',
    coordinates: { lat: 15.1410, lng: 74.1110 },
    nearbyPlaces: ['Netravali Bubbling Lake', 'Wildlife Sanctuary Trails'],
    safetyTips: 'Entry allowed only during daytime; follow forest department rules.',
    bestSeason: 'Monsoon'
  },
  {
    id: 6,
    name: 'Hivre Falls',
    location: 'Valpoi, Sattari',
    region: 'North Goa',
    description: 'A lesser-known waterfall in the Sattari region, surrounded by thick forests and hills.',
    height: '20 meters',
    bestTimeToVisit: 'August to October',
    difficulty: 'Moderate',
    highlights: [
      'Hidden waterfall',
      'Forest trek',
      'Peaceful location'
    ],
    image: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg',
    images: [
      'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    distanceFromPanaji: '48 km',
    entryFee: 'Free',
    coordinates: { lat: 15.5900, lng: 74.1000 },
    nearbyPlaces: ['Valpoi Town', 'Mhadei Wildlife Sanctuary'],
    safetyTips: 'Visit with local guidance and avoid slippery trails.',
    bestSeason: 'Monsoon'
  },
  {
    id: 7,
    name: 'Sada Waterfalls',
    location: 'Sada, Sanguem',
    region: 'North Goa',
    description: 'A beautiful monsoon waterfall formed by streams from the Western Ghats, popular among trekkers.',
    height: '18 meters',
    bestTimeToVisit: 'July to September',
    difficulty: 'Moderate',
    highlights: [
      'Monsoon trekking',
      'Green landscapes',
      'Photography spot'
    ],
    image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg',
    images: [
      'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg'
    ],
    distanceFromPanaji: '50 km',
    entryFee: 'Free',
    coordinates: { lat: 15.2000, lng: 74.2000 },
    nearbyPlaces: ['Sanguem Town', 'Local Villages'],
    safetyTips: 'Avoid visiting during heavy rainfall.',
    bestSeason: 'Monsoon'
  },
  {
    id: 8,
    name: 'Bamanbudo Falls',
    location: 'Mollem, Western Ghats',
    region: 'South Goa',
    description: 'A roadside waterfall on the Goa–Karnataka highway, easily accessible and popular during monsoon.',
    height: '15 meters',
    bestTimeToVisit: 'June to September',
    difficulty: 'Easy',
    highlights: [
      'Roadside waterfall',
      'Easy access',
      'Monsoon attraction'
    ],
    image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg',
    images: [
      'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg'
    ],
    distanceFromPanaji: '70 km',
    entryFee: 'Free',
    coordinates: { lat: 15.3170, lng: 74.2450 },
    nearbyPlaces: ['Mollem National Park', 'Dudhsagar Falls'],
    safetyTips: 'Stay away from highway traffic and slippery rocks.',
    bestSeason: 'Monsoon'
  },
  {
    id: 9,
    name: 'Charavane Falls',
    location: 'Bicholim',
    region: 'North Goa',
    description: 'A serene waterfall accessible via a short trek, surrounded by lush greenery and hills.',
    height: '18 meters',
    bestTimeToVisit: 'July to September',
    difficulty: 'Easy',
    highlights: [
      'Short trek',
      'Scenic views',
      'Photography spot'
    ],
    image: 'https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg',
    images: [
      'https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg'
    ],
    distanceFromPanaji: '40 km',
    entryFee: 'Free',
    coordinates: { lat: 15.5600, lng: 73.9400 },
    nearbyPlaces: ['Bicholim Town', 'Saptakoteshwar Temple'],
    safetyTips: 'Be careful on wet rocks.',
    bestSeason: 'Monsoon'
  },
  {
    id: 10,
    name: 'Kalsa Waterfalls',
    location: 'Sattari Forest Range',
    region: 'North Goa',
    description: 'A hidden waterfall deep inside the Sattari forests, ideal for adventurous travelers.',
    height: '22 meters',
    bestTimeToVisit: 'August to October',
    difficulty: 'Difficult',
    highlights: [
      'Remote location',
      'Adventure trek',
      'Untouched nature'
    ],
    image: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg',
    images: [
      'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg'
    ],
    distanceFromPanaji: '52 km',
    entryFee: 'Free',
    coordinates: { lat: 15.6200, lng: 74.0800 },
    nearbyPlaces: ['Mhadei Wildlife Sanctuary', 'Valpoi'],
    safetyTips: 'Visit only with experienced guides.',
    bestSeason: 'Monsoon'
  }
];

export const getWaterfallsByRegion = (region: string): Waterfall[] => {
  return goaWaterfalls.filter(waterfall => waterfall.region === region);
};

export const getWaterfallById = (id: number): Waterfall | undefined => {
  return goaWaterfalls.find(waterfall => waterfall.id === id);
};
