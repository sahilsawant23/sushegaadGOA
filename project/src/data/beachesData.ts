export interface Beach {
  id: string;
  name: string;
  region: 'South Goa' | 'North Goa';
  description: string;
  highlights: string[];
  activities: string[];
  accessibility: 'Easy' | 'Moderate' | 'Difficult';
  crowdLevel: 'Deserted' | 'Peaceful' | 'Moderate' | 'Crowded';
  bestFor: string[];
  nearbyAttractions: string[];
  facilities: string[];
  image: string;
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceFromPanaji: string;
  bestTimeToVisit: string[];
  bestSeason?: string;
  safetyTips?: string;
}

export const goaBeaches: Beach[] = [
  // South Goa Beaches
  {
    id: 'polem',
    name: 'Polem Beach',
    region: 'South Goa',
    description: 'Polem Beach is the southernmost beach in Goa, situated right near the Karnataka border. It is a pristine, golden-sand stretch that remains largely untouched by mass tourism. The beach offers a sense of absolute seclusion, making it perfect for those who want to escape the world. At the northern end, a small backwater stream meets the sea, creating a unique landscape. From here, you can often see fish jumping and eagles soaring. It is a favorite spot for spotting dolphins and migratory birds.',
    highlights: [
      'Southernmost beach in Goa',
      'Clean and deserted',
      'Backwater access',
      'Island visits possible',
      'Near Karnataka border'
    ],
    activities: ['Island hopping', 'Backwater exploration', 'Photography', 'Peaceful walks'],
    accessibility: 'Moderate',
    crowdLevel: 'Deserted',
    bestFor: ['Solitude seekers', 'Nature lovers', 'Photography enthusiasts'],
    nearbyAttractions: ['Karnataka border', 'Backwater islands'],
    facilities: ['Basic amenities'],
    image: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?cs=srgb&dl=pexels-fabianwiktor-994605.jpg&fm=jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0074, lng: 74.0245 },
    distanceFromPanaji: '65 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'The ideal time to visit Polem is between November and March when the humidity is lower and the sea breeze is pleasant. This is also the best time for boat rides to nearby islands. Monsoon visits are scenic but water activities are restricted.',
    safetyTips: 'As an isolated beach, it is advisable to leave before dark. Swimming should be done with caution as there are no lifeguards on duty. Carry your own water and snacks as shacks are limited.'
  },
  {
    id: 'xendrem',
    name: 'Xendrem Beach',
    region: 'South Goa',
    description: 'Xendrem Beach is a hidden jewel south of Galgibaga, enclosed by steep cliffs and dense vegetation. It is a wild, rugged beach that feels like a private island. The journey to reach it involves navigating narrow paths, which deters most casual tourists. The beach is rocky in parts, with small coves of soft sand, making it an adventurous destination for explorers. It is one of the few places in Goa where you can sit for hours without seeing another soul.',
    highlights: [
      'Wild and secluded',
      'Perfect for day-trips',
      'Untouched natural beauty',
      'Away from crowds'
    ],
    activities: ['Day trips', 'Nature walks', 'Photography', 'Relaxation'],
    accessibility: 'Moderate',
    crowdLevel: 'Deserted',
    bestFor: ['Adventure seekers', 'Day trippers', 'Nature enthusiasts'],
    nearbyAttractions: ['Polem Beach'],
    facilities: ['Minimal facilities'],
    image: 'https://media.gettyimages.com/id/587967500/photo/sunset-on-ashvem-beach-mandrem-goa-india-while-locals-play-volleyball-on-november-30-2014.jpg?s=612x612&w=0&k=20&c=GPLpnx7mqKWD6HhJo71J0wf8Ih4l5ZpUwR4zlqZmauE=',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0124, lng: 74.0285 },
    distanceFromPanaji: '63 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Best visited during the dry season (October-April) as the access paths can become treacherous/slippery during the monsoons. Winter sunsets here are spectacular.',
    safetyTips: 'Swimming is risky due to underwater rocks and lack of lifeguards. Ensure you have clear directions before setting out, as mobile network coverage can be patchy.'
  },
  {
    id: 'galgibaga',
    name: 'Galgibaga Beach',
    region: 'South Goa',
    description: 'Known as the "Turtle Beach," Galgibaga is one of the three designated nesting sites for the endangered Olive Ridley turtles in Goa. This protected status has kept the beach devoid of shacks and bright lights, preserving its natural pristine state. The beach is a long, straight stretch of silver sand with a dense forest of casuarina trees providing shade. The southern end where the Galgibag River meets the sea is particularly scenic and calm.',
    highlights: [
      'Olive ridley turtle nesting site',
      'Eco-tourism destination',
      'Galgibag River confluence',
      'Wildlife conservation area'
    ],
    activities: ['Turtle watching', 'Eco-tourism', 'River exploration', 'Wildlife photography'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Eco-tourists', 'Wildlife enthusiasts', 'Conservation supporters'],
    nearbyAttractions: ['Turtle nesting site', 'Galgibag River'],
    facilities: ['Eco-tourism facilities', 'Conservation center'],
    image: 'https://goa-tourism.org.in/images//tourist-places/galgibaga-beach-goa/galgibaga-beach-goa-photo-gallery-goa-tourism.jpg.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0174, lng: 74.0325 },
    distanceFromPanaji: '61 km',
    bestTimeToVisit: ['November', 'December', 'January', 'February'],
    bestSeason: 'November to February is the turtle nesting season, which is the most significant time to visit. To see hatchlings, visit around March-April. The weather is cool and breezy during these months.',
    safetyTips: 'Do not use bright lights or flash photography at night as it disorients the turtles. Keep noise levels low. Respect the fenced nesting areas and do not disturb the wildlife.'
  },
  {
    id: 'talpona',
    name: 'Talpona Beach',
    region: 'South Goa',
    description: 'Talpona is one of the few remaining beaches in Goa that retains a village charm. It is located at the mouth of the Talpona River, offering a stunning mix of river and sea views. The beach is wide and expansive, covered in soft golden sand. It is largely undeveloped, with just a couple of small shacks, making it ideal for those who want to read a book under the trees or take long, undisturbed naps. The water here is known for being clean and relatively safe for swimming.',
    highlights: [
      'Clean and deserted',
      'Transparent Arabian Sea',
      'Rocky outcrops',
      'Talpon River confluence',
      'Pure waters'
    ],
    activities: ['Swimming', 'Rock exploration', 'Photography', 'Peaceful walks'],
    accessibility: 'Easy',
    crowdLevel: 'Deserted',
    bestFor: ['Peace seekers', 'Swimmers', 'Photography enthusiasts'],
    nearbyAttractions: ['Talpon River', 'Rocky formations'],
    facilities: ['Basic amenities'],
    image: 'https://www.trawell.in/admin/images/upload/12190563Talpona_Beach_Main.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0224, lng: 74.0365 },
    distanceFromPanaji: '59 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'October to March offers perfect beach weather. The post-monsoon greenery along the river is particularly vibrant in October.',
    safetyTips: 'Currents can be strong near the river mouth; swim in the designated beach areas. There are very few facilities, so bring necessities.'
  },
  {
    id: 'rajbag',
    name: 'Rajbag Beach',
    region: 'South Goa',
    description: 'Rajbag Beach is an elegant stretch of coastline found just south of Patnem. It is dominated by the presence of a luxury 5-star resort but the beach itself is public and incredibly clean. The Talpona River separates Rajbag from the southern beaches, and a ferry ride across is a charming experience. The beach has a sophisticated, quiet vibe, with manicured surroundings and beautiful dunes.',
    highlights: [
      'Luxury resort beach',
      'Rocky outcrops',
      'Lalit Golf and Spa Resort',
      'Talpon River confluence',
      'Upscale amenities'
    ],
    activities: ['Golf', 'Spa treatments', 'Luxury dining', 'Water sports'],
    accessibility: 'Easy',
    crowdLevel: 'Moderate',
    bestFor: ['Luxury travelers', 'Golf enthusiasts', 'Spa lovers'],
    nearbyAttractions: ['Lalit Golf and Spa Resort', 'Talpon River'],
    facilities: ['5-star resort', 'Golf course', 'Spa', 'Fine dining'],
    image: 'https://www.trawell.in/admin/images/upload/121905765Rajbagh_Beach_Main.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0274, lng: 74.0405 },
    distanceFromPanaji: '57 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'The winter season (November-February) is perfect for enjoying the luxury amenities and golf. The weather is dry and sunny.',
    safetyTips: 'While safe, the beach can get isolated in parts not monitored by hotel security. Standard beach safety applies.'
  },
  {
    id: 'patnem',
    name: 'Patnem Beach',
    region: 'South Goa',
    description: 'Patnem is the quieter, more laid-back sibling of the famous Palolem Beach. It attracts a crowd that loves the Palolem vibe but wants to avoid the noise and density. The beach is lined with chic shacks and yoga schools, creating a wellness-oriented atmosphere. The crescent shape protects the waters, making it safe for swimming. It\'s a place where days are spent lounging in shacks and evenings are for slow dinners by the sea.',
    highlights: [
      'Quiet twin of Palolem',
      'Peaceful atmosphere',
      'Less crowded alternative',
      'Beautiful coastline'
    ],
    activities: ['Relaxation', 'Yoga', 'Beach walks', 'Swimming'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Peace seekers', 'Yoga enthusiasts', 'Couples'],
    nearbyAttractions: ['Palolem Beach'],
    facilities: ['Beach shacks', 'Yoga centers', 'Guesthouses'],
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/db/24/cf/img-20180113-210414-273.jpg?w=1200&h=-1&s=1',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0324, lng: 74.0445 },
    distanceFromPanaji: '55 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'October through March is the high season with all shacks and yoga centers fully operational. December and January are busiest but still retain a relaxed charm.',
    safetyTips: 'Swimming is generally safe here. Be mindful of occasional soliciting by vendors, though it is less than other major beaches.'
  },
  {
    id: 'colomb',
    name: 'Colomb Beach',
    region: 'South Goa',
    description: 'Colomb is a tiny, horseshoe-shaped cove nestled between Palolem and Patnem. It is more of a fishing bay than a swimming beach, characterized by large rocks called "Pandava\'s Drums" which are said to resonate when struck (though this is a local myth). The beach is a rustic charm with eco-friendly huts on the rocks. It is famous for the "Silent Noise" headphone parties held nearby, offering a unique nightlife experience without noise pollution.',
    highlights: [
      'Cozy small beach',
      'Organic food options',
      'Pandavas drum experience',
      'Silent Noise Club nearby',
      'Unique cultural experience'
    ],
    activities: ['Organic dining', 'Cultural experiences', 'Silent parties', 'Beach relaxation'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Culture enthusiasts', 'Organic food lovers', 'Unique experiences'],
    nearbyAttractions: ['Silent Noise Club', 'Palolem Beach'],
    facilities: ['Organic restaurants', 'Cultural venues', 'Beach shacks'],
    image: 'https://cdn.thegoavilla.com/image/CID_0153_d83e2845baf062c21d68d31fe9dab562.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0374, lng: 74.0485 },
    distanceFromPanaji: '53 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'The party season in December-January is the best time if you want to experience the Silent Noise events. For quiet relaxation, the shoulder months of October and February are great.',
    safetyTips: 'The beach is rocky; be careful when walking or swimming. It is not ideal for swimming during high tide.'
  },
  {
    id: 'palolem',
    name: 'Palolem Beach',
    region: 'South Goa',
    description: 'Palolem is the jewel of South Goa, renowned for its perfect crescent shape and calm, shallow waters. The beach is lined with tilting coconut palms and colorful wooden beach huts, creating a postcard-perfect setting. It is vibrant yet relaxed, striking a balance between party vibes and chilled-out lounging. You can take a boat trip to see dolphins or visit the nearby Butterfly Beach. At the northern end, a small island called can be reached by walking through the water during low tide.',
    highlights: [
      'Most popular South Goa beach',
      'Crescent-shaped coastline',
      'Palm trees and sand',
      'Silent discos',
      'Canacona Island nearby',
      'Backwaters access'
    ],
    activities: ['Silent discos', 'Island hopping', 'Backwater tours', 'Beach parties', 'Water sports'],
    accessibility: 'Easy',
    crowdLevel: 'Crowded',
    bestFor: ['Party lovers', 'Backpackers', 'Island explorers'],
    nearbyAttractions: ['Canacona Island', 'Backwaters', 'Butterfly Beach'],
    facilities: ['Guest houses', 'Beach shacks', 'Restaurants', 'Water sports'],
    image: 'https://media.istockphoto.com/id/157579910/photo/the-beach.jpg?s=612x612&w=0&k=20&c=aMk67AmzIVD_S1Nibww8ytUdyub2ck3HNQ3uTvuPWPI=',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0424, lng: 74.0525 },
    distanceFromPanaji: '51 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'November to March is the peak season with perfect weather and a lively atmosphere. Christmas and New Year specifically see the beach transform into a festive hub.',
    safetyTips: 'While safe, it can get crowded. Keep an eye on your belongings. When walking to the island, be aware of the tide schedule to ensure a safe return.'
  },
  {
    id: 'butterfly',
    name: 'Butterfly Beach',
    region: 'South Goa',
    description: 'Butterfly Beach is a semi-circular cove that looks like a hidden paradise. It is named after the myriad of butterflies that can be seen flying over the hilltop blossoms. Accessible mainly by boat from Palolem or Agonda (or a trek through the forest), its isolation is its charm. The beach is a great spot to watch playful dolphins in the distance. The golden sands and translucent waters make it one of the most photogenic spots in Goa.',
    highlights: [
      'Butterfly watching',
      'Dolphin spotting',
      'Most photogenic beach',
      'Forest trekking access',
      'Boat access available',
      'Secluded location'
    ],
    activities: ['Butterfly watching', 'Dolphin spotting', 'Photography', 'Forest trekking', 'Boat trips'],
    accessibility: 'Difficult',
    crowdLevel: 'Deserted',
    bestFor: ['Nature photographers', 'Adventure seekers', 'Wildlife enthusiasts'],
    nearbyAttractions: ['Palolem Beach', 'Forest trails'],
    facilities: ['Minimal facilities', 'Boat services from Palolem'],
    image: 'https://curlytales.com/wp-content/uploads/2020/10/53236479_310537179649791_5821590045949884028_n-1.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0474, lng: 74.0565 },
    distanceFromPanaji: '49 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February'],
    bestSeason: 'Best visited in the morning during winter months (Nov-Feb) to spot dolphins and avoid the afternoon heat, as there is little shade.',
    safetyTips: 'There are no facilities or lifeguards here. Plan your return boat trip in advance. If trekking, wear proper shoes as the path goes through dense vegetation.'
  },
  {
    id: 'agonda',
    name: 'Agonda Beach',
    region: 'South Goa',
    description: 'Agonda Beach is wide, quiet, and pristine, famous for being a nesting site for Olive Ridley turtles. It has a very laid-back vibe, distinct from the party atmosphere of other beaches. The beach is long enough that you can always find a secluded spot. At the southern end, there are large rock formations that are great for climbing and photography. Agonda is often cited as one of the best beaches in Asia for its cleanliness and tranquility.',
    highlights: [
      'Asia\'s #1 beach 2018',
      'TripAdvisor award winner',
      'Isolated and pristine',
      'Rock formations',
      'Small northern bay',
      'Perfect for solitude'
    ],
    activities: ['Solitude', 'Photography', 'Rock exploration', 'Swimming', 'Sunset viewing'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Solitude seekers', 'Award-winning destination', 'Photography'],
    nearbyAttractions: ['Rock formations', 'Northern bay'],
    facilities: ['Beach shacks', 'Guesthouses', 'Restaurants'],
    image: 'https://media.istockphoto.com/id/859845026/photo/beach-in-goa-india.jpg?s=612x612&w=0&k=20&c=Z8tUTVszkmnRfZU_-_27goIfbnDKlI65sAdMMzbGxMQ=',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0524, lng: 74.0605 },
    distanceFromPanaji: '47 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'October to March. Many establishments close down during the monsoon. The sunsets here are consistent stunners.',
    safetyTips: 'Swimming can be dangerous due to undercurrents and sharp drop-offs in some areas. Swim only near the lifeguard stations. Respect the turtle nesting sites.'
  },
  {
    id: 'cola',
    name: 'Cola Beach',
    region: 'South Goa',
    description: 'Cola Beach is a stunning hidden gem that offers a "Blue Lagoon" experience. It features a fresh water lagoon right next to the sea, separated by a narrow strip of sand. You can swim in the calm lagoon or the wavy sea. The beach is flanked by hills and palm groves, giving it a very private and exclusive feel. It is less accessible than others, requiring a bumpy ride down a dirt track, which keeps the crowds away.',
    highlights: [
      'Two tiny bays',
      'Beautiful blue lagoon',
      'Hidden gem',
      'Romantic setting',
      'Pristine waters'
    ],
    activities: ['Lagoon swimming', 'Photography', 'Romantic walks', 'Kayaking'],
    accessibility: 'Moderate',
    crowdLevel: 'Peaceful',
    bestFor: ['Couples', 'Photographers', 'Hidden gem seekers'],
    nearbyAttractions: ['Blue lagoon', 'Twin bays'],
    facilities: ['Limited facilities', 'Beach huts'],
    image: 'https://goa-tourism.org.in/images/places-to-visit/headers/cola-beach-goa-entry-fee-timings-holidays-reviews-header.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0574, lng: 74.0645 },
    distanceFromPanaji: '45 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter months are best. The lagoon is fullest and cleanest post-monsoon (October-November).',
    safetyTips: 'The approach road is rough; hire a local jeep if your vehicle isn\'t suitable. Swimming in the lagoon is safe, but be careful in the sea due to rocks.'
  },
  {
    id: 'kakolem',
    name: 'Kakolem Beach (Tiger Beach)',
    region: 'South Goa',
    description: 'Kakolem, also known as Tiger Beach, is one of the most secluded and wild beaches in Goa. Legend says tigers used to roam here. It is a tiny cove dominated by high cliffs and lush greenery. A small fresh water spring flows down the hillside onto the beach. Access is challenging, involving a steep descent, but the reward is a beach that you might have entirely to yourself. It is raw, rugged, and breathtaking.',
    highlights: [
      'Also known as Tiger Beach',
      'Small isolated cove',
      'Surrounded by hills',
      'Sea access preferred',
      'Tiger legend',
      'Completely undeveloped'
    ],
    activities: ['Adventure access', 'Photography', 'Exploration', 'Swimming'],
    accessibility: 'Difficult',
    crowdLevel: 'Deserted',
    bestFor: ['Adventure seekers', 'Explorers', 'Solitude lovers'],
    nearbyAttractions: ['Hills', 'Secluded coves'],
    facilities: ['No facilities'],
    image: 'https://travelentice.com/wp-content/uploads/2021/09/Kakolem-beach-in-Goa.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0624, lng: 74.0685 },
    distanceFromPanaji: '43 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February'],
    bestSeason: 'Adventure enthusiasts should visit in winter. Avoid during monsoon as the path down is dangerous.',
    safetyTips: 'The currents are very strong here, and there are no lifeguards. It is safer to wade than to swim deep. There is no mobile network.'
  },
  {
    id: 'cabo-de-rama',
    name: 'Cabo de Rama Beach',
    region: 'South Goa',
    description: 'This beach is located at the foot of the historic Cabo de Rama Fort. It is a wild and rocky beach with a dense grove of palm trees that makes for a perfect picnic spot. The view of the beach from the fort above is spectacular. The beach is relatively quiet and offers a mix of history and nature. It is a great place to watch the sunset after exploring the fort ruins.',
    highlights: [
      'Near Cabo de Rama fort',
      'Dense grove setting',
      'Historical significance',
      'Perfect for picnics',
      'Fort views'
    ],
    activities: ['Picnicking', 'Fort exploration', 'Historical tours', 'Photography'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['History buffs', 'Families', 'Picnic lovers'],
    nearbyAttractions: ['Cabo de Rama Fort', 'Historical sites'],
    facilities: ['Picnic areas', 'Fort access'],
    image: 'https://travelentice.com/wp-content/uploads/2022/01/Cabo-de-Rama-Fort-and-Beach-Uncover-the-Unexplored-Gem-of-Goa.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0674, lng: 74.0725 },
    distanceFromPanaji: '41 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Late afternoons in winter are the best time to visit to combine the fort tour with a sunset on the beach.',
    safetyTips: 'Swimming is tricky due to weeds and rocks. It is better suited for wading and picnicking.'
  },
  {
    id: 'canaguinim',
    name: 'Canaguinim Beach',
    region: 'South Goa',
    description: 'Canaguinim consists of two small beaches (North and South) separated by a small hill. It is a wild, less frequented beach suitable for those who love raw nature. The southern art is pebbly while the northern part is sandy. It is generally very quiet, with maybe just a few fishermen around. The lack of commercial activity preserves its pristine charm.',
    highlights: [
      'Two small wild beaches',
      'Perfect for day-trips',
      'Long walk opportunities',
      'Untouched nature',
      'Serene setting'
    ],
    activities: ['Day trips', 'Long walks', 'Nature exploration', 'Photography'],
    accessibility: 'Moderate',
    crowdLevel: 'Peaceful',
    bestFor: ['Day trippers', 'Walking enthusiasts', 'Nature lovers'],
    nearbyAttractions: ['Twin beaches', 'Natural landscapes'],
    facilities: ['Minimal facilities'],
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/e8/00/d1/canaguinim-beach.jpg?w=1200&h=-1&s=1',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0724, lng: 74.0765 },
    distanceFromPanaji: '39 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Dry season is essential as there is no shelter. Winter afternoons are pleasant.',
    safetyTips: 'The beach has a steep drop into the sea in some parts; swimming is not recommended for beginners. Bring your own supplies.'
  },
  {
    id: 'betul',
    name: 'Betul Beach',
    region: 'South Goa',
    description: 'Betul Beach is unique because it is located on the southern bank of the Sal River where it meets the Arabian Sea. It is a fishing village marked by the presence of the historic Betul Fort and a lighthouse. The beach is known for its silvers sands and the abundance of fresh seafood, especially Goa\'s finest mussels. It has a romantic, old-world charm.',
    highlights: [
      'Sal River confluence',
      'Picturesque and romantic',
      'Betul Fort nearby',
      'Lighthouse views',
      'River meeting sea'
    ],
    activities: ['Romantic walks', 'Fort exploration', 'Lighthouse visits', 'River cruises'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Couples', 'Fort enthusiasts', 'Lighthouse lovers'],
    nearbyAttractions: ['Betul Fort', 'Lighthouse', 'Sal River'],
    facilities: ['Fort access', 'Lighthouse', 'River cruises'],
    image: 'https://oneboard.app/_next/static/media/baghabeach.e23ac324.webp',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0774, lng: 74.0805 },
    distanceFromPanaji: '37 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Visit in winter to enjoy the pleasant river breeze. Evenings are best for views of the fishing boats returning.',
    safetyTips: 'Swimming near the river mouth can be dangerous due to currents. Stick to the sea-facing side. It is a working fishing beach, so be respectful of the nets and boats.'
  },
  {
    id: 'mobor',
    name: 'Mobor Beach',
    region: 'South Goa',
    description: 'Mobor is the southern tip of the long stretch of white sand that starts at Cavelossim. It is a playground for the wealthy, dominated by luxury resorts like the Leela. However, the beach is open to all and offers pristine white sands and water sports. The Sal River hugs the beach on the east, creating a beautiful peninsula. It is cleaner and more exclusive than its northern neighbors.',
    highlights: [
      'Southern Cavelossim extension',
      'Leela Palace Kempinski',
      'Holiday Inn Resort',
      'Very few crowds',
      'Perfect for relaxation'
    ],
    activities: ['Luxury relaxation', 'Hotel amenities', 'Spa treatments', 'Fine dining'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Luxury travelers', 'Relaxation seekers', 'Hotel guests'],
    nearbyAttractions: ['Luxury resorts', 'Cavelossim Beach'],
    facilities: ['5-star hotels', 'Spa', 'Fine dining', 'Water sports'],
    image: 'https://www.explorebees.com/uploads/Mobor%20Beach.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0824, lng: 74.0845 },
    distanceFromPanaji: '35 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'November to March is perfect for water sports and sunbathing. The upscale shacks are fully operational during this time.',
    safetyTips: 'Safe for swimming with lifeguards usually present near the hotels. Prices for food and water sports can be higher here due to the luxury setting.'
  },
  {
    id: 'cavelossim',
    name: 'Cavelossim Beach',
    region: 'South Goa',
    description: 'Cavelossim offers a perfect blend of serenity and activity. The beach is famous for its contrasting black lava rocks against white sand. It is flanked by the Arabian Sea on one side and the Sal River on the other. It is a favorite spot for dolphin watching cruises on the river. The beach is clean, the shacks are high quality, and the vibe is sophisticated yet relaxed.',
    highlights: [
      '10km long clean beach',
      'Family-friendly',
      'Popular with foreigners',
      'Sal River proximity',
      'Bird watching cruises',
      'Developed infrastructure'
    ],
    activities: ['Family time', 'Sal River cruises', 'Bird watching', 'Water sports', 'Fine dining'],
    accessibility: 'Easy',
    crowdLevel: 'Moderate',
    bestFor: ['Families', 'Foreign tourists', 'Bird watchers'],
    nearbyAttractions: ['Sal River', 'Bird watching spots', 'Village life'],
    facilities: ['Hotels', 'Restaurants', 'Water sports', 'River cruises'],
    image: 'https://d26dp53kz39178.cloudfront.net/media/uploads/Travel_Guide_Images/Cavelossim-beach_result-1657098323905.webp',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0874, lng: 74.0885 },
    distanceFromPanaji: '33 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'November to February offers the best climate. River cruises are best enjoyed in the late afternoon.',
    safetyTips: 'Swimming is safe in designated areas. Be cautious of touts selling boat trips; book through reputable operators.'
  },
  {
    id: 'fatrade-carmona',
    name: 'Fatrade & Carmona Beach',
    region: 'South Goa',
    description: 'These are the quiet stretches of sand north of Cavelossim. They are essentially the backyards of the local villages and a few resorts. The sand is white and soft, and the beach is wide. It is perfect for those who want the beauty of Varca/Cavelossim but with absolute silence. You will mostly find local fishermen and guests from nearby resorts here.',
    highlights: [
      'Two connected beaches',
      'Whitish sand',
      'Same stretch as Varka',
      'Expensive hotels',
      'Premium location'
    ],
    activities: ['Luxury beach time', 'Hotel amenities', 'Beach walks', 'Photography'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Luxury travelers', 'Premium beach experience', 'Hotel guests'],
    nearbyAttractions: ['Varka Beach', 'Luxury resorts'],
    facilities: ['Expensive hotels', 'Premium amenities', 'Fine dining'],
    image: 'https://mediaim.expedia.com/destination/1/7e5baf004deab35b0bf0c9fdcaf329d5.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0924, lng: 74.0925 },
    distanceFromPanaji: '31 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter months are ideal. Because it is less crowded, it feels private and exclusive all season.',
    safetyTips: 'There are fewer lifeguards here compared to the main beaches. Swim responsibly.'
  },
  {
    id: 'varca',
    name: 'Varca Beach',
    region: 'South Goa',
    description: 'Varca is known for its incredible collection of wooden fishing boats lined up on the shore. The beach is exceptionally clean with fine white sand. It is a quieter alternative to Benaulim and Colva but still has a good selection of high-end resorts and shacks. The water is clear and inviting, and dolphin spotting trips are popular here.',
    highlights: [
      'Cavelossim-Mobor extension',
      'Romantic destination',
      'Family-friendly',
      'High-quality hotels',
      'Premium beach strip'
    ],
    activities: ['Romantic getaways', 'Family vacations', 'Luxury amenities', 'Beach relaxation'],
    accessibility: 'Easy',
    crowdLevel: 'Moderate',
    bestFor: ['Couples', 'Families', 'Luxury seekers'],
    nearbyAttractions: ['Cavelossim Beach', 'Mobor Beach', 'Luxury resorts'],
    facilities: ['High-quality hotels', 'Restaurants', 'Spa services', 'Water sports'],
    image: 'https://goa-tourism.org.in/images/places-to-visit/headers/varca-beach-goa-timings-entry-fee-goa-tourism-header-cr-traveling-camera.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.0974, lng: 74.0965 },
    distanceFromPanaji: '29 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'October to March. The sea is calmest during these months, making it great for swimming and boat trips.',
    safetyTips: 'Generally very safe. Watch out for fishing nets if you walk far from the main area.'
  },
  {
    id: 'benaulim',
    name: 'Benaulim Beach',
    region: 'South Goa',
    description: 'Benaulim is a charming beach town that strikes a balance between peace and facilities. It is famous for its history—mythology says this is where Lord Parashurama\'s arrow landed to create Goa. Today, it is a favorite for families and older travelers. The beach is broad with white sand, and the village behind it is full of traditional houses and good restaurants. It is also a carpentry hub of Goa (where traditional boats are made).',
    highlights: [
      'Long stretch to Colva',
      'Fishing boats and trawlers',
      'Tree-lined coast',
      'Water sports available',
      'Taj Exotica hotel',
      'Traditional fishing culture'
    ],
    activities: ['Water sports', 'Fishing boat watching', 'Luxury hotel amenities', 'Beach walks'],
    accessibility: 'Easy',
    crowdLevel: 'Moderate',
    bestFor: ['Water sports enthusiasts', 'Culture observers', 'Luxury travelers'],
    nearbyAttractions: ['Taj Exotica', 'Colva Beach', 'Fishing villages'],
    facilities: ['5-star hotel', 'Water sports', 'Restaurants', 'Fishing boats'],
    image: 'https://t3.ftcdn.net/jpg/03/62/24/94/360_F_362249455_XGvR55u8caEpNi05bbIDIgyJ5Lup6QCU.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.1024, lng: 74.1005 },
    distanceFromPanaji: '27 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter season for the best beach experience. It is a great place to spend Christmas with many local celebrations.',
    safetyTips: 'Safe for families. Bullfighting events (unofficial) sometimes happen in the fields nearby, which can be interesting but unpredictable.'
  },
  {
    id: 'colva',
    name: 'Colva Beach',
    region: 'South Goa',
    description: 'Colva is the commercial hub of South Goa\'s coastline. It is the most popular beach for domestic tourists and locals. The beach entrance is bustling with shops, street food stalls, and activity. However, if you walk a few hundred meters away from the main entrance, the beach becomes quiet and serene. It features distinct white powdery sand. The nightlife here is more active than other South Goa beaches.',
    highlights: [
      'Near Margao city',
      'Popular with locals',
      'Indian tourist favorite',
      'Water sports available',
      'Developed infrastructure',
      'Average-priced options'
    ],
    activities: ['Water sports', 'Local culture', 'Shopping in Margao', 'Beach activities'],
    accessibility: 'Easy',
    crowdLevel: 'Crowded',
    bestFor: ['Budget travelers', 'Local culture enthusiasts', 'Water sports'],
    nearbyAttractions: ['Margao city', 'Local markets', 'Churches'],
    facilities: ['Hotels', 'Restaurants', 'Water sports', 'Shopping'],
    image: 'https://goa-tourism.org.in/images/places-to-visit/headers/colva-beach-goa-entry-fee-timings-holidays-reviews-header.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.1074, lng: 74.1045 },
    distanceFromPanaji: '25 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'October to May. Avoid weekends if you dislike crowds. It is very lively during holidays.',
    safetyTips: 'It can get very crowded, so keep track of your group. Lifeguards are present and active here. Swimming near the main entrance is monitored.'
  },
  {
    id: 'sernabatim',
    name: 'Sernabatim Beach',
    region: 'South Goa',
    description: 'Sernabatim is an idyllic extension of Colva beach, offering the perfect escape from the crowds. It is a favorite spot for watching sunsets and finding beautiful seashells. The beach is cleaner and calmer, with just a few well-spaced shacks. It feels miles away from the hustle of Colva despite being just a short walk south.',
    highlights: [
      'Southern Colva extension',
      'Quieter than Colva',
      'Pure beach experience',
      'Less crowded',
      'Clean environment'
    ],
    activities: ['Peaceful relaxation', 'Swimming', 'Beach walks', 'Photography'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Peace seekers', 'Families', 'Clean beach lovers'],
    nearbyAttractions: ['Colva Beach', 'Margao'],
    facilities: ['Basic amenities', 'Beach shacks'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Sernabatim_Beach_South_Goa.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.1124, lng: 74.1085 },
    distanceFromPanaji: '23 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter season for the best sunsets and shell collecting. It is peaceful year-round.',
    safetyTips: 'Very safe and clean beach. Suitable for families.'
  },
  {
    id: 'betalbatim',
    name: 'Betalbatim Beach',
    region: 'South Goa',
    description: 'Known as the "Sunset Beach" of Goa, Betalbatim offers some of the most spectacular sunset views. It is located north of Colva and is known for its bioluminescent plankton that sometimes makes the water glow at night. The beach is wide, flat, and hard-packed, making it excellent for walking or jogging. It is less commercial, with pine trees lining the shore instead of coconut palms.',
    highlights: [
      'Fast developing area',
      'Best sunset viewing',
      'Many beach shacks',
      'Northern and southern shacks',
      'Growing popularity'
    ],
    activities: ['Sunset watching', 'Beach dining', 'Photography', 'Relaxation'],
    accessibility: 'Easy',
    crowdLevel: 'Moderate',
    bestFor: ['Sunset lovers', 'Photographers', 'Beach dining'],
    nearbyAttractions: ['Sunset points', 'Beach shacks'],
    facilities: ['Beach shacks', 'Restaurants', 'Sunset viewing areas'],
    image: 'https://media1.thrillophilia.com/filestore/b0y5bepsj3t3d1npex3bba1vm27x_shutterstock_1429980617.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.1174, lng: 74.1125 },
    distanceFromPanaji: '21 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'November to February. Evenings are the main attraction here.',
    safetyTips: 'If looking for bioluminescence, go on a dark moonless night. Swimming is safe in designated zones.'
  },
  {
    id: 'utorda',
    name: 'Utorda Beach',
    region: 'South Goa',
    description: 'Utorda is a silky white sand beach that looks like it belongs in the Caribbean. It is located north of Majorda and is extremely clean and quiet. The sea is calm and safe for swimming, making it a favorite for families with kids. There are a few good shacks serving fresh seafood, but it never feels crowded. It is a place for pure relaxation.',
    highlights: [
      'Small and peaceful',
      'Clean environment',
      '15.1km from Vasco',
      'Serene year-round',
      'Few tourists',
      'Fishing boats present'
    ],
    activities: ['Peaceful relaxation', 'Fishing boat watching', 'Beach walks', 'Photography'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Peace seekers', 'Clean beach lovers', 'Fishing culture'],
    nearbyAttractions: ['Vasco da Gama', 'Fishing villages'],
    facilities: ['Beach shacks', 'Basic amenities'],
    image: 'https://assets.simplotel.com/simplotel/image/upload/x_0,y_194,w_3819,h_2149,r_0,c_crop,q_80,fl_progressive/w_500,f_auto,c_fit/kenilworth-resort-spa-goa/beach_in_goa_ibl4k9',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.1224, lng: 74.1165 },
    distanceFromPanaji: '19 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter months are delightful. The water is exceptionally calm.',
    safetyTips: 'Very safe beach. Great for novice swimmers.'
  },
  {
    id: 'arossim-cansaulim',
    name: 'Arossim & Cansaulim Beach',
    region: 'South Goa',
    description: 'These twin beaches are a photographer\'s paradise, offering wide sandy shores and fewer crowds. Arossim is known for water sports like windsurfing and sailing, while Cansaulim is famous for the Three Kings Church feast (held on a nearby hill). The sand here is incredibly white and the beach is backed by dense palm groves. It is one of the most picturesque stretches in South Goa.',
    highlights: [
      'Small and quiet',
      'Same sand stretch',
      'Close to Vasco',
      'Palm trees',
      'Colorful fishing boats',
      'Bird colonies'
    ],
    activities: ['Bird watching', 'Water sports', 'Fishing boat photography', 'Peaceful walks'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Bird watchers', 'Photography', 'Peace seekers'],
    nearbyAttractions: ['Vasco da Gama', 'Bird colonies', 'Fishing villages'],
    facilities: ['Water sports', 'Basic amenities'],
    image: 'https://storage.googleapis.com/goa-app-12a91.appspot.com/2022-03-15T15%3A36%3A02.225Zarossim-beach-2.webp?GoogleAccessId=firebase-adminsdk-zeqcj%40goa-app-12a91.iam.gserviceaccount.com&Expires=16447017600&Signature=QfZbAqscMz6HUO%2FS8sMjNnPinIsGzcrf%2FpBcDYk7gTbUj2MS4J%2FAhQPM7%2FvX3M7rp8Org0%2FR%2F6Pj%2BIBdqrf1XRRSsJq9jWUJsZwAhowltnTpGgzAUvwb0sbF0JGPJq0Xm7RCiCh53gYnCjpWrNolU6FuNplke4PQmd%2FURuHUsXkTHmEmCcVtADERfFSrhLOUD0JfvstzaySShNxYQTPaekJzn7NQl%2BgPRdhmzZCQO%2FgOrhlEeBQnMuvPygGKXeO0xfky%2FYJpS%2FoRCOk2kesnEyK5T3voOWEeHetRFm9YZu81a5qhrSPKOEMqpTmq9Ma93p27jEkHnMef4X1A9%2FPfhA%3D%3D',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.1274, lng: 74.1205 },
    distanceFromPanaji: '17 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'January is special due to the Three Kings Feast. Otherwise, regular winter season is best.',
    safetyTips: 'Generally safe. During the feast, the nearby roads can get jammed.'
  },
  {
    id: 'holland-issorsim',
    name: 'Holland-Issorsim Beach',
    region: 'South Goa',
    description: 'Hollant Beach (often called Holland) is unique as it is the only beach in Goa where you can see the sunrise (due to the curve of the bay). It is a rocky bay with shallow, calm water free of currents, making it the safest beach for swimming. At low tide, the water is so clear you can see corals and marine life, making it a great spot for snorkeling and kayaking.',
    highlights: [
      'Marine life viewing',
      'Coral observation',
      'Surface water visibility',
      'Excellent for kayaking',
      'Clear waters',
      'Marine biodiversity'
    ],
    activities: ['Marine life watching', 'Coral viewing', 'Kayaking', 'Snorkeling'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Marine enthusiasts', 'Kayakers', 'Snorkelers'],
    nearbyAttractions: ['Marine life spots', 'Coral areas'],
    facilities: ['Kayak rentals', 'Marine viewing areas'],
    image: 'https://www.trawell.in/admin/images/upload/12190573Issorcim_Beach_Main.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.1324, lng: 74.1245 },
    distanceFromPanaji: '15 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February'],
    bestSeason: 'Morning visits during winter are essential to appreciate the sunrise and clear waters.',
    safetyTips: 'The beach is rocky during low tide, so wear appropriate footwear if exploring the pools. It is very safe for swimming.'
  },
  {
    id: 'velsao',
    name: 'Velsao Beach',
    region: 'South Goa',
    description: 'Velsao is a beach of solitude, characterized by its silver sands and the presence of migratory birds. It is visually striking with the lily-covered lakes near the beach. It is very quiet and typically devoid of tourists, offering a very local feel. The road to the beach passes through picturesque villages. It is a perfect spot for unwinding.',
    highlights: [
      'Near Dabolim airport',
      'Very serene',
      'Few tourists',
      'Perfect for long walks',
      'Airport proximity',
      'Peaceful atmosphere'
    ],
    activities: ['Long walks', 'Peaceful relaxation', 'Photography', 'Solitude'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Long walk enthusiasts', 'Airport travelers', 'Peace seekers'],
    nearbyAttractions: ['Dabolim Airport', 'Vasco da Gama'],
    facilities: ['Basic amenities', 'Airport access'],
    image: 'https://media.tripinvites.com/places/vasco-da-gama/velsao-beach/Early-morning-View-of-Velsao-beach.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.1374, lng: 74.1285 },
    distanceFromPanaji: '13 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter season. It is a great first or last stop due to airport proximity.',
    safetyTips: 'Isolated area; standard safety precautions apply. Not much in terms of food or water, so bring your own.'
  },
  // North Goa Beaches
  {
    id: 'candolim',
    name: 'Candolim Beach',
    region: 'North Goa',
    description: 'Candolim Beach marks the beginning of the famous North Goa beach belt. Unlike its busier neighbors, Candolim retains a relatively calm and upscale atmosphere. The beach is backed by dunes covered in scrub, which is a unique feature. It is home to the stranded "River Princess" ship (though now largely salvaged) which was a landmark for years. The main road running parallel to the beach is packed with high-end restaurants and shops.',
    highlights: [
      'First major North Goa beach',
      'One of top 3 popular beaches',
      'Many beach shacks',
      'Sun beds and umbrellas',
      'Shopping and dining',
      'Water sports hub'
    ],
    activities: ['Water sports', 'Beach dining', 'Shopping', 'Sunbathing', 'Beach parties'],
    accessibility: 'Easy',
    crowdLevel: 'Crowded',
    bestFor: ['Water sports', 'Beach dining', 'Shopping', 'Nightlife'],
    nearbyAttractions: ['Panaji', 'Fort Aguada', 'Calangute Beach'],
    facilities: ['Beach shacks', 'Water sports', 'Shops', 'Restaurants', 'Hotels'],
    image: 'https://media.istockphoto.com/id/2150162389/photo/fort-aguada-at-the-candolim-beach-in-north-goa-india.jpg?s=612x612&w=0&k=20&c=XerC8z1ckv9cOMf2222f8IkcPRBtGyJ3Jt674y-63HU=',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.5167, lng: 73.7667 },
    distanceFromPanaji: '15 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Peak season is December-January, synonymous with the Sunburn Festival (often held nearby).',
    safetyTips: 'The beach drops steeply into the water in some places, so be careful. It is well-monitored by lifeguards.'
  },
  {
    id: 'calangute',
    name: 'Calangute Beach',
    region: 'North Goa',
    description: 'Dubbed the "Queen of Beaches," Calangute is the largest and arguably the most popular beach in North Goa. It is a hub of activity, teeming with sunbeds, shacks, and tourists from all over the world. The energy here is infectious. From parasailing to banana boat rides, every water sport imaginable is available here. The streets leading to the beach are lined with shops selling souvenirs, clothes, and jewelry.',
    highlights: [
      'Part of Calangute-Baga stretch',
      'Very commercial',
      'Developed infrastructure',
      'Fewer shacks than Candolim',
      'Popular tourist destination',
      'Queen of beaches'
    ],
    activities: ['Beach activities', 'Water sports', 'Shopping', 'Dining', 'Nightlife'],
    accessibility: 'Easy',
    crowdLevel: 'Crowded',
    bestFor: ['Commercial beach experience', 'Shopping', 'Dining', 'Water sports'],
    nearbyAttractions: ['Baga Beach', 'Candolim Beach', 'Markets'],
    facilities: ['Hotels', 'Restaurants', 'Shops', 'Water sports', 'Markets'],
    image: 'https://www.shutterstock.com/image-photo/goa-indiajanuary-21-2019palolem-beach-600nw-2357797653.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.5433, lng: 73.7533 },
    distanceFromPanaji: '16 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Visit November to February for the full tourist experience. It gets extremely hot and crowded in May.',
    safetyTips: 'Very crowded, so watch your belongings. Swim only in designated zones marked by flags.'
  },
  {
    id: 'baga',
    name: 'Baga Beach',
    region: 'North Goa',
    description: 'Baga is famous for its vibrant nightlife and the iconic Tito\'s Lane. Where Calangute ends, Baga begins. The beach is a continuous party, with shacks playing loud music and offering candlelit dinners on the sand. The Baga Creek, where the river flows into the sea, offers a scenic spot for fishing and spotting birds. It is the place to be if you want to be in the center of the action.',
    highlights: [
      'Northernmost of big 3',
      'Excellent restaurants',
      'Happening nightlife',
      'Baga River confluence',
      'Party destination',
      'Vibrant atmosphere'
    ],
    activities: ['Nightlife', 'Fine dining', 'Water sports', 'Beach parties', 'River activities'],
    accessibility: 'Easy',
    crowdLevel: 'Crowded',
    bestFor: ['Party lovers', 'Nightlife enthusiasts', 'Fine dining', 'Water sports'],
    nearbyAttractions: ['Baga River', 'Calangute Beach', 'Night markets'],
    facilities: ['Restaurants', 'Bars', 'Clubs', 'Water sports', 'Hotels'],
    image: 'https://t4.ftcdn.net/jpg/04/16/74/29/360_F_416742930_RhUSxwxlYwNBpTGzN4kVTdWuYcmRnGv5.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.5567, lng: 73.7517 },
    distanceFromPanaji: '18 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'New Year\'s Eve at Baga is legendary. Winter is the party season.',
    safetyTips: 'The sea can be rough; obey lifeguard whistles. Be cautious at night when leaving clubs.'
  },
  {
    id: 'anjuna',
    name: 'Anjuna Beach',
    region: 'North Goa',
    description: 'Anjuna is steep in history as the cradle of the hippie movement in Goa. It is famous for its rocky coastline, trance parties, and the Wednesday Flea Market. The beach is narrower than Baga or Calangute but has a unique charm with red laterite cliffs. It attracts a free-spirited crowd and offers some of the best sunset views from its beachside shacks like Curlies.',
    highlights: [
      'Former hippie destination',
      'Liberal spirit',
      'Lively nightlife',
      'Famous flea market',
      '1960s-70s heritage',
      'Bohemian atmosphere'
    ],
    activities: ['Flea market shopping', 'Nightlife', 'Cultural experiences', 'Beach parties', 'Trance parties'],
    accessibility: 'Easy',
    crowdLevel: 'Crowded',
    bestFor: ['Flea market lovers', 'Nightlife', 'Cultural experiences', 'Hippie heritage'],
    nearbyAttractions: ['Anjuna Flea Market', 'Chapora Fort', 'Vagator Beach'],
    facilities: ['Flea market', 'Restaurants', 'Bars', 'Guesthouses', 'Shops'],
    image: 'https://www.tourmyindia.com/states/goa/image/anjuna-beach-banner.webp',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.5733, lng: 73.7400 },
    distanceFromPanaji: '21 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Wednesdays in winter are a must for the flea market. December for the parties.',
    safetyTips: 'The beach is very rocky in the water; be careful not to cut your feet. There can be strong undertows.'
  },
  {
    id: 'vagator',
    name: 'Vagator Beach',
    region: 'North Goa',
    description: 'Split into Big Vagator and Little Vagator (Ozran) by a seaside headland, this beach sits dramatically under the shadow of the Chapora Fort (famous from the movie "Dil Chahta Hai"). It offers stunning views of red cliffs meeting the sea. The vibe is laid-back and scenic, attracting a mix of backpackers and sunset watchers. The rocky outcrops make for dramatic photo opportunities.',
    highlights: [
      'Chapora Fort foothills',
      'Quieter than Anjuna',
      'Popular with foreigners',
      'Fort views',
      'Chapora River confluence',
      'Rocky outcrops'
    ],
    activities: ['Fort exploration', 'Photography', 'Sunset viewing', 'Beach relaxation', 'River activities'],
    accessibility: 'Easy',
    crowdLevel: 'Moderate',
    bestFor: ['Fort enthusiasts', 'Photography', 'Foreign tourists', 'Sunset viewing'],
    nearbyAttractions: ['Chapora Fort', 'Chapora River', 'Anjuna Beach'],
    facilities: ['Beach shacks', 'Restaurants', 'Guesthouses', 'Fort access'],
    image: 'https://s7ap1.scene7.com/is/image/incredibleindia/vagator-beach-goa-3-musthead-hero?qlt=82&ts=1742185883265',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.5967, lng: 73.7333 },
    distanceFromPanaji: '23 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter sunsets from the fort or the beach are unparalleled.',
    safetyTips: 'The hike up to the fort is steep and slippery; wear good shoes. Swimming near the rocks is dangerous.'
  },
  {
    id: 'ashvem',
    name: 'Ashvem Beach',
    region: 'North Goa',
    description: 'Ashvem is a long, flat, and pristine stretch of sand that feels worlds away from the crowds of Baga. It has become the chic, upmarket face of North Goa, known for its boutique resorts and beach clubs. It is also famous for being a nesting site for Olive Ridley turtles. The beach is great for surfing beginners due to the gentle waves.',
    highlights: [
      '1.5km long beach',
      'Peaceful and serene',
      'Many shacks and cafes',
      'Yoga retreats',
      'Meditation centers',
      'Foreign tourist favorite'
    ],
    activities: ['Yoga', 'Meditation', 'Beach dining', 'Relaxation', 'Wellness activities'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Yoga enthusiasts', 'Wellness seekers', 'Foreign tourists', 'Peaceful relaxation'],
    nearbyAttractions: ['Yoga centers', 'Meditation retreats', 'Mandrem Beach'],
    facilities: ['Beach shacks', 'Yoga centers', 'Cafes', 'Wellness centers', 'Guesthouses'],
    image: 'https://www.shutterstock.com/image-photo/ashwem-beach-goa-december-2014-600nw-1062707588.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.6833, lng: 73.7167 },
    distanceFromPanaji: '30 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'October to March is peak season. It is very quiet in monsoons.',
    safetyTips: 'Generally safe. Be respectful of the turtle nesting sites if marked.'
  },
  {
    id: 'mandrem',
    name: 'Mandrem Beach',
    region: 'North Goa',
    description: 'Mandrem is arguably the most beautiful beach in North Goa, known for its white sands and the creek that runs parallel to the shoreline during high tide. Several bamboo bridges span the creek, connecting the hotels to the beach, which adds a charming touch. It is diverse center for yoga and wellness, attracting a crowd looking for health and peace.',
    highlights: [
      'Small and picturesque',
      'Creek meeting sea',
      'Bamboo bridges',
      'Beach huts',
      'Ayurveda schools',
      'Relaxation destination'
    ],
    activities: ['Ayurveda treatments', 'Creek exploration', 'Beach camping', 'Relaxation', 'Photography'],
    accessibility: 'Easy',
    crowdLevel: 'Peaceful',
    bestFor: ['Ayurveda enthusiasts', 'Camping lovers', 'Relaxation seekers', 'Photography'],
    nearbyAttractions: ['Creek', 'Bamboo bridges', 'Ayurveda centers', 'Ashvem Beach'],
    facilities: ['Beach huts', 'Ayurveda schools', 'Shacks', 'Restaurants', 'Camping areas'],
    image: 'https://cdn.thegoavilla.com/static/img/articles/mandrem-beach.jpg',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.7167, lng: 73.7000 },
    distanceFromPanaji: '32 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter months are idyllic. The creek is fullest at high tide.',
    safetyTips: 'The beach is very flat and safe for swimming. The bridges can be rickety, so watch your step.'
  },
  {
    id: 'arambol',
    name: 'Arambol Beach',
    region: 'North Goa',
    description: 'Arambol is the capital of the alternative traveler scene in Goa. It has a distinct bohemian vibe, with drum circles at sunset, impromptu markets selling handmade jewelry, and travelers practicing poi or yoga. A short walk past the rocky headland leads to the famous Sweet Water Lake and a Banyan tree in the jungle (famous for its "Baba"). It is a place of community and creativity.',
    highlights: [
      'Northernmost developed beach',
      'Sandy and rocky',
      'Laid-back atmosphere',
      'Bohemian culture',
      'Liberal environment',
      'Foreign tourist hub'
    ],
    activities: ['Alternative culture', 'Bohemian lifestyle', 'Beach walks', 'Sunset viewing', 'Cultural experiences'],
    accessibility: 'Easy',
    crowdLevel: 'Moderate',
    bestFor: ['Bohemian travelers', 'Alternative culture', 'Foreign tourists', 'Liberal atmosphere'],
    nearbyAttractions: ['Sweet water lake', 'Cliff walks', 'Mandrem Beach'],
    facilities: ['Beach shacks', 'Guesthouses', 'Restaurants', 'Cultural venues'],
    image: 'https://media.istockphoto.com/id/1307387478/photo/beach-in-goa-india.jpg?s=612x612&w=0&k=20&c=zzvttCRQL6ugKqxMUikr6JVl4eNfdo9E61PdLv90_SU=',
    images: [
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
    ],
    coordinates: { lat: 15.6883, lng: 73.7017 },
    distanceFromPanaji: '35 km',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'The winter season is when the Arambol community is most active. Sunset drum circles are a daily ritual.',
    safetyTips: 'The market area can get crowded. Be careful if swimming near the rocks. The walk to the sweet water lake involves some uneven terrain.'
  }
];

export const getBeachesByRegion = (region: string) => {
  return goaBeaches.filter(beach => beach.region === region);
};
