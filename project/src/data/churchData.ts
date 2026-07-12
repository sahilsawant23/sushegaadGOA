export interface Church {
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyPlaces: string[];
  id: number;
  name: string;
  location: string;
  region: string;
  description: string;
  architecture: string;
  history: string;
  significance: string[];
  image: string;
  images: string[];
  distanceFromPanaji: string;
  bestTimeToVisit: string;
  entryFee: string;
}

export const goaChurches: Church[] = [
  {
    id: 1,
    name: "Basilica of Bom Jesus",
    location: "Old Goa",
    region: "Old Goa",
    description: "A UNESCO World Heritage Site housing the mortal remains of St. Francis Xavier, this 16th-century church is a masterpiece of Baroque architecture.",
    architecture: "Baroque",
    history: "Built in 1605, this church represents the golden age of Portuguese colonial architecture in Goa.",
    significance: ["UNESCO World Heritage Site", "St. Francis Xavier's Tomb", "Baroque Architecture"],
    image: "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
    images: [
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg"
    ],
    distanceFromPanaji: "10 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.4989,
      lng: 73.9133
    },
    nearbyPlaces: ["Se Cathedral", "Church of St. Francis of Assisi", "Old Goa Museum"]
  },
  {
    id: 2,
    name: "Se Cathedral",
    location: "Old Goa",
    region: "Old Goa",
    description: "The largest church in Asia, this magnificent structure showcases the grandeur of Portuguese colonial architecture.",
    architecture: "Gothic-Manueline",
    history: "Construction began in 1562 and took nearly 100 years to complete.",
    significance: ["Largest Church in Asia", "Gothic Architecture", "Historical Monument"],
    image: "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
    images: [
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg"
    ],
    distanceFromPanaji: "10 km",
    bestTimeToVisit: "October to May",
    entryFee: "₹10",
    coordinates: {
      lat: 15.4985,
      lng: 73.9129
    },
    nearbyPlaces: ["Basilica of Bom Jesus", "Church of St. Francis of Assisi", "Old Goa Museum"]
  },
  {
    id: 3,
    name: "Church of St. Francis of Assisi",
    location: "Old Goa",
    region: "Old Goa",
    description: "A beautiful example of Portuguese Gothic architecture with stunning interiors and historical significance.",
    architecture: "Gothic",
    history: "Built in the 17th century, this church has witnessed centuries of Goan history.",
    significance: ["Gothic Architecture", "Historical Site", "Cultural Heritage"],
    image: "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
    images: [
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
    ],
    distanceFromPanaji: "10 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.4990,
      lng: 73.9130
    },
    nearbyPlaces: ["Basilica of Bom Jesus", "Se Cathedral", "Old Goa Museum"]
  },
  {
    id: 4,
    name: "Our Lady of the Immaculate Conception Church",
    location: "Panaji",
    region: "North Goa",
    description: "One of Goa's most iconic churches, featuring a stunning white facade and zigzag stairway. This church overlooks the main square of Panaji.",
    architecture: "Portuguese Baroque",
    history: "Originally built in 1541 for sailors to give thanks for safe arrivals, rebuilt in 1619 in its current form.",
    significance: ["Iconic Panaji Landmark", "Portuguese Baroque", "Historic Bell Tower"],
    image: "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
    images: [
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg"
    ],
    distanceFromPanaji: "0 km",
    bestTimeToVisit: "October to March",
    entryFee: "Free",
    coordinates: {
      lat: 15.4909,
      lng: 73.8278
    },
    nearbyPlaces: ["Fontainhas", "Miramar Beach", "Goa State Museum"]
  },
  {
    id: 5,
    name: "Church of St. Cajetan",
    location: "Old Goa",
    region: "Old Goa",
    description: "Modeled after St. Peter's Basilica in Rome, this church is known for its Corinthian architecture and impressive dome.",
    architecture: "Corinthian",
    history: "Built by Italian friars in 1655, inspired by the original design of St. Peter's Basilica in Rome.",
    significance: ["Corinthian Architecture", "Italian Influence", "Impressive Dome"],
    image: "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
    images: [
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800"
    ],
    distanceFromPanaji: "10 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.5005,
      lng: 73.9115
    },
    nearbyPlaces: ["Se Cathedral", "Basilica of Bom Jesus", "Archaeological Museum"]
  },
  {
    id: 6,
    name: "Church of St. Augustine",
    location: "Old Goa",
    region: "Old Goa",
    description: "Now in ruins, this was once one of the largest churches in Goa. The 46-meter tower still stands as a testament to its former glory.",
    architecture: "Augustinian",
    history: "Built in 1602 by Augustinian friars, abandoned in 1835. The tower collapsed in 1931, leaving only one tower standing.",
    significance: ["Historic Ruins", "Tallest Tower in Goa", "Archaeological Site"],
    image: "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
    ],
    distanceFromPanaji: "10 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.5012,
      lng: 73.9108
    },
    nearbyPlaces: ["Se Cathedral", "Church of St. Cajetan", "Monte Hill"]
  },
  {
    id: 7,
    name: "Church of Our Lady of Rosary",
    location: "Old Goa",
    region: "Old Goa",
    description: "One of the earliest churches in Goa, built in Manueline style with a beautiful view of Old Goa from its hilltop location.",
    architecture: "Manueline",
    history: "Built in 1526 by Afonso de Albuquerque to commemorate his victory. One of the oldest churches in Goa.",
    significance: ["Oldest Church in Goa", "Manueline Style", "Hilltop Location"],
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800"
    ],
    distanceFromPanaji: "10 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.5020,
      lng: 73.9125
    },
    nearbyPlaces: ["Basilica of Bom Jesus", "Se Cathedral", "Viceroy's Arch"]
  },
  {
    id: 8,
    name: "Reis Magos Church",
    location: "Reis Magos, Bardez",
    region: "North Goa",
    description: "A beautiful whitewashed church overlooking the Mandovi River, known for its stunning location and historical significance.",
    architecture: "Portuguese Colonial",
    history: "Built in 1555, it served as a fortress church. Recently restored to its former glory.",
    significance: ["Riverside Location", "Fortress Church", "Recently Restored"],
    image: "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
    images: [
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
    ],
    distanceFromPanaji: "6 km",
    bestTimeToVisit: "October to March",
    entryFee: "Free",
    coordinates: {
      lat: 15.5167,
      lng: 73.8333
    },
    nearbyPlaces: ["Reis Magos Fort", "Nerul", "Coco Beach"]
  },
  {
    id: 9,
    name: "Church of Mae de Deus",
    location: "Saligao, Bardez",
    region: "North Goa",
    description: "Known as the 'Mother of God' church, featuring neo-Gothic architecture and beautiful stained glass windows.",
    architecture: "Neo-Gothic",
    history: "Built in 1873, this church is famous for its annual feast and impressive architecture.",
    significance: ["Neo-Gothic Style", "Stained Glass Windows", "Annual Feast"],
    image: "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
    images: [
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800"
    ],
    distanceFromPanaji: "12 km",
    bestTimeToVisit: "October to March",
    entryFee: "Free",
    coordinates: {
      lat: 15.5500,
      lng: 73.7833
    },
    nearbyPlaces: ["Calangute Beach", "Baga Beach", "Saligao Village"]
  },
  {
    id: 10,
    name: "Church of St. Alex",
    location: "Curtorim, Salcete",
    region: "South Goa",
    description: "A magnificent church known for its ornate interiors and beautiful altar, considered one of the finest in Goa.",
    architecture: "Baroque",
    history: "Built in 1597, extensively renovated in the 18th century with elaborate Baroque decorations.",
    significance: ["Ornate Interiors", "Baroque Altar", "Historic Village Church"],
    image: "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
    images: [
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
    ],
    distanceFromPanaji: "30 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.2667,
      lng: 73.9500
    },
    nearbyPlaces: ["Margao", "Colva Beach", "Rachol Seminary"]
  },
  {
    id: 11,
    name: "Holy Spirit Church",
    location: "Margao",
    region: "South Goa",
    description: "The main church of Margao city, featuring impressive Baroque architecture and a beautiful facade.",
    architecture: "Baroque",
    history: "Originally built in 1564, rebuilt in 1675 after being destroyed. The current structure dates from the 18th century.",
    significance: ["Margao Landmark", "Baroque Architecture", "City Center Church"],
    image: "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg"
    ],
    distanceFromPanaji: "33 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.2708,
      lng: 73.9528
    },
    nearbyPlaces: ["Margao Market", "Colva Beach", "Monte Hill"]
  },
  {
    id: 12,
    name: "Church of Our Lady of Piety",
    location: "Divar Island",
    region: "North Goa",
    description: "A charming church on the peaceful Divar Island, offering panoramic views and a serene atmosphere.",
    architecture: "Portuguese Colonial",
    history: "Built in the 16th century, this church serves the island community and is known for its annual Bonderam festival.",
    significance: ["Island Church", "Bonderam Festival", "Panoramic Views"],
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800"
    ],
    distanceFromPanaji: "8 km",
    bestTimeToVisit: "October to March",
    entryFee: "Free",
    coordinates: {
      lat: 15.5167,
      lng: 73.9000
    },
    nearbyPlaces: ["Old Goa", "Ribandar", "Chorao Island"]
  },
  {
    id: 13,
    name: "Three Kings Church",
    location: "Cansaulim, Mormugao",
    region: "South Goa",
    description: "Perched on a hilltop, this church offers breathtaking views and is associated with local legends and the annual Three Kings feast.",
    architecture: "Portuguese Colonial",
    history: "Built in 1599, named after the Biblical Three Wise Men. Known for its hilltop location and annual feast.",
    significance: ["Hilltop Church", "Three Kings Feast", "Panoramic Views"],
    image: "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
    images: [
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
    ],
    distanceFromPanaji: "25 km",
    bestTimeToVisit: "October to March",
    entryFee: "Free",
    coordinates: {
      lat: 15.3833,
      lng: 73.9167
    },
    nearbyPlaces: ["Velsao Beach", "Cansaulim Beach", "Arossim Beach"]
  },
  {
    id: 14,
    name: "Church of St. Anne",
    location: "Talaulim, Tiswadi",
    region: "North Goa",
    description: "Famous for its annual feast and procession, this church is a significant pilgrimage site in Goa.",
    architecture: "Portuguese Baroque",
    history: "Built in 1695, known for the Santana feast which attracts thousands of pilgrims annually.",
    significance: ["Pilgrimage Site", "Annual Santana Feast", "Historic Church"],
    image: "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
    images: [
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800"
    ],
    distanceFromPanaji: "7 km",
    bestTimeToVisit: "October to March",
    entryFee: "Free",
    coordinates: {
      lat: 15.4833,
      lng: 73.9167
    },
    nearbyPlaces: ["Old Goa", "Divar Island", "Chorao Island"]
  },
  {
    id: 15,
    name: "Church of St. Thomas",
    location: "Aldona, Bardez",
    region: "North Goa",
    description: "A beautiful village church known for its peaceful setting and traditional Goan architecture.",
    architecture: "Portuguese Colonial",
    history: "Built in the 17th century, this church serves the traditional Goan village of Aldona.",
    significance: ["Village Church", "Traditional Architecture", "Peaceful Setting"],
    image: "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
    images: [
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
    ],
    distanceFromPanaji: "13 km",
    bestTimeToVisit: "October to March",
    entryFee: "Free",
    coordinates: {
      lat: 15.5833,
      lng: 73.8667
    },
    nearbyPlaces: ["Mapusa", "Corjuem Fort", "Mayem Lake"]
  },
  {
    id: 16,
    name: "St. Alex Church",
    location: "Calangute, Bardez",
    region: "North Goa",
    description: "Distinctive for its unique architectural style featuring two towers and a magnificent dome, St. Alex Church is a landmark of Calangute.",
    architecture: "Indian Baroque",
    history: "Founded in 1595, the current structure was built in 1741 by the villagers. It is one of the few churches in Goa with a cupola false dome.",
    significance: ["Unique Cupola Architecture", "Calangute Landmark", "Rococo Altars"],
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800"
    ],
    distanceFromPanaji: "15 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.5419,
      lng: 73.7636
    },
    nearbyPlaces: ["Calangute Beach", "Candolim Beach", "Baga Beach"]
  },
  {
    id: 17,
    name: "Church of Our Lady of Miracles",
    location: "Mapusa, Bardez",
    region: "North Goa",
    description: "Built on the site of an ancient temple, this church is famous for its annual feast which is celebrated by both Christians and Hindus.",
    architecture: "Portuguese Colonial",
    history: "Originally built in 1594, rebuilt several times afterwards. It stands as a symbol of communal harmony in Goa.",
    significance: ["Communal Harmony", "Annual Feast (Milagres)", "Historic Site"],
    image: "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
    images: [
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
    ],
    distanceFromPanaji: "13 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.5937,
      lng: 73.8142
    },
    nearbyPlaces: ["Mapusa Market", "St. Jerome Church", "Bodgeshwar Temple"]
  },
  {
    id: 18,
    name: "Chapel of St. Sebastian",
    location: "Fontainhas, Panaji",
    region: "North Goa",
    description: "Located in the colorful Latin Quarter, this pristine white chapel is famous for its crucifix where Christ's eyes are open.",
    architecture: "Late Baroque",
    history: "Built in 1818, distinct for its 'Crucifix of the Inquisition' which was brought from the Palace of the Inquisition in Old Goa.",
    significance: ["Latin Quarter Landmark", "Unique Crucifix", "Historic Chapel"],
    image: "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
    images: [
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800"
    ],
    distanceFromPanaji: "1 km",
    bestTimeToVisit: "October to May",
    entryFee: "Free",
    coordinates: {
      lat: 15.4865,
      lng: 73.8322
    },
    nearbyPlaces: ["Fontainhas Heritage Walk", "Gitanjali Gallery", "Panaji Creek"]
  }
];

export const getChurchesByRegion = (region: string): Church[] => {
  return goaChurches.filter(church => church.region === region);
};

export const getChurchById = (id: number): Church | undefined => {
  return goaChurches.find(church => church.id === id);
};
