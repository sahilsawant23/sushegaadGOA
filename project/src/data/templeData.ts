import { ReactNode } from "react";

export interface Temple {
  entryFee: ReactNode;
  history: ReactNode;
  nearbyPlaces: string[];
  id: string;
  name: string;
  location: string;
  region: 'North Goa' | 'South Goa';
  description: string;
  deity: string;
  architecture: string;
  significance: string[];
  festivals: string[];
  timings: string;
  dressCode: string;
  bestTimeToVisit: string[];
  image: string;
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceFromPanaji: string;
  bestSeason?: string;
  safetyTips?: string;
}

export const goaTemples: Temple[] = [
  {
    id: 'shantadurga',
    name: 'Shri Shantadurga Temple',
    location: 'Kavlem, Ponda',
    region: 'South Goa',
    description: 'The Shri Shantadurga Temple is one of the most prominent and largest temple complexes in Goa, dedicated to Goddess Shantadurga, the deity of peace. The goddess is believed to have mediated a quarrel between Lord Shiva and Lord Vishnu, hence the name "Shanta" (peace). The temple complex stands as a shining example of the unique Indo-Portuguese architectural style that defines Goan temples, featuring a distinct deepastambha (lamp tower), large courtyards, and European-influenced arched windows and chandeliers. Set amidst the lush greenery of Ponda, the temple exudes a serene spiritual energy that attracts thousands of devotees and tourists alike.\n\nThe main idol of the Goddess is flanked by small idols of Shiva and Vishnu, symbolizing her role as the peacemaker. The temple interiors are adorned with intricate marble work and beautiful glass chandeliers that add to its grandeur. The complex also includes a large water tank and guest houses for pilgrims. The annual Zatra (festival) held here is a spectacle of faith and culture, transforming the quiet village into a vibrant hub of celebration.',
    deity: 'Goddess Shantadurga',
    architecture: 'Indo-Portuguese',
    significance: [
      'One of the richest temples in Goa',
      'Goddess of peace and prosperity',
      'Important pilgrimage site',
      'Beautiful architecture'
    ],
    festivals: ['Navratri', 'Shivratri', 'Zatra'],
    timings: '6:00 AM - 10:00 PM',
    dressCode: 'Traditional attire, covered shoulders and knees',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'The winter months from October to March are the ideal time to visit the Shantadurga Temple. magnificent annual Zatra usually takes place in January, which is a fantastic time to witness the cultural vibrancy of the place. During these cooler months, the weather is pleasant for exploring the large temple complex without the discomfort of the summer heat. The monsoon season (June to September) also offers a lush, green, and peaceful atmosphere, though travel can be wet.',
    safetyTips: 'As a place of worship, conservative dress is strictly enforced; shoulders and knees must be covered. Photography is generally not allowed inside the main sanctum sanctorum. Remove footwear before entering the temple main hall. Respect the local customs and maintain silence within the prayer hall. During festivals like the Zatra, the temple can get extremely crowded, so plan your visit accordingly and be mindful of your belongings.',
    image: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.4017, lng: 73.9828 },
    distanceFromPanaji: '33 km',
    nearbyPlaces: ['Ponda Market', 'Spice Plantations', 'Dudhsagar Waterfall'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'safa-shahouri',
    name: 'Safa Shahouri Mosque',
    location: 'Ponda',
    region: 'South Goa',
    description: 'The Safa Shahouri Masjid is a hidden historical gem and one of the oldest mosques in Goa, built in 1560 by the usage of Ibrahim Adil Shah, the Sultan of Bijapur. It is the only remaining mosque of the 27 that were once built in the Ponda region during the Adil Shahi reign. The mosque stands as a solitary structure on a raised platform, surrounded by a large masonry tank with mihrab motifs, which is a signature of its Indo-Islamic architectural style. The serene atmosphere and the reflection of the mosque in the crystal-clear waters of the tank create a picturesque setting.\n\nThe structure is relatively simple yet elegant, with a tiled roof typical of Goan architecture, blending Islamic and local styles. It is surrounded by lush gardens and laterite ruins that hint at a once-larger complex. The location offers a peaceful retreat and a dive into the pre-Portuguese Islamic history of Goa, making it a favorite spot for history buffs and photographers.',
    deity: 'Islamic Place of Worship',
    architecture: 'Indo-Islamic',
    significance: [
      'Historical monument',
      'Adil Shahi architecture',
      'Symbol of cultural harmony',
      'Heritage site'
    ],
    festivals: ['Ramzan', 'Eid'],
    timings: '9:00 AM - 5:30 PM',
    dressCode: 'Modest clothing required',
    bestTimeToVisit: ['October', 'November', 'December', 'January'],
    bestSeason: 'The best time to visit is during the winter months from October to March when the weather is cool and pleasant for exploring the outdoor grounds. The site looks particularly beautiful during the monsoon season when the surrounding gardens are lush green and the tank is full, although rain might hinder exploration.',
    safetyTips: 'Visitors should dress modestly. While it is a protected monument, it is also a place of worship, so respectful behavior is expected. Be careful around the edges of the water tank as there are no railings. Photography is allowed in the outer complex, but it is polite to ask for permission if people are praying.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.4050, lng: 74.0100 },
    distanceFromPanaji: '28 km',
    nearbyPlaces: ['Ponda Market', 'Spice Plantations'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'mahalaxmi-bandora',
    name: 'Shri Mahalaxmi Temple',
    location: 'Bandora, Ponda',
    region: 'South Goa',
    description: 'The Shri Mahalaxmi Temple in Bandora is a revered shrine dedicated to Goddess Mahalaxmi, the goddess of power and strength. Unlike the typical image of Mahalaxmi with four hands, the idol here features the Goddess holding a kaustubh (jewel) in her hand and has a distinct warrior-like appearance, believed to be the form she took to defeat demons. The temple architecture is a classic example of Konkani temple style with a sabhamandap (main hall) adorned with chandeliers and a gallery of wooden carvings depicting various incarnations of Lord Vishnu.\n\nThis temple is believed to be one of the few that survived the Portuguese inquisition by being moved from its original location in the 16th century. It holds immense spiritual significance for the local community. The temple complex includes additional shrines for other deities and a beautiful temple tank. The annual Zatra and Navratri celebrations here are grand affairs, drawing devotees from all over the state.',
    deity: 'Goddess Mahalaxmi',
    architecture: 'Traditional Goan',
    significance: [
      'Ancient temple',
      'Important local deity',
      'Spiritual center',
      'Cultural importance'
    ],
    festivals: ['Navratri', 'Zatra'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire recommended',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February'],
    bestSeason: 'Visit between October and March for the most comfortable weather. The Navratri festival in October is a particularly special time to visit, as the entire temple is decorated and special religious and cultural programs are held.',
    safetyTips: 'Dress conservatively; avoid shorts and sleeveless tops. Remove shoes before entering the temple. Photography inside the inner sanctum is strictly prohibited. If visiting during a festival, be prepared for crowds and long queues.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.3965, lng: 73.9920 },
    distanceFromPanaji: '29 km',
    nearbyPlaces: ['Bandora Village', 'Local Temples'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'betal-temple',
    name: 'Shri Betal Temple',
    location: 'Navelim',
    region: 'South Goa',
    description: 'The Shri Betal Temple is a unique and significant center of folk worship in Goa, dedicated to Lord Betal, a warrior deity and a form of Shiva known as the Aghora form. The deity is worshipped as a protector of the village and is depicted standing on a human skull, symbolizing the triumph over death and evil. This temple provides a fascinating insight into the pre-Vedic and tribal traditions that have merged with mainstream Hinduism in Goa.\n\nThe temple structure is simple but charged with a powerful spiritual atmosphere. Unlike the ornate Indo-Portuguese temples, this shrine focuses more on the raw power of the deity. Lord Betal is traditionally offered liquor and footwear by devotees, a unique custom associated with his role as a wandering guardian spirit. The annual Zatra is a major event where the deity is taken out in a procession, accompanied by traditional music and fervent devotion.',
    deity: 'Lord Betal',
    architecture: 'Traditional Goan',
    significance: [
      'Village guardian deity',
      'Folk traditions',
      'Local faith',
      'Cultural heritage'
    ],
    festivals: ['Zatra'],
    timings: '6:00 AM - 8:00 PM',
    dressCode: 'Traditional attire',
    bestTimeToVisit: ['November', 'December'],
    bestSeason: 'The winter months are best for visiting. The annual Zatra, usually held in April or May, is the most culturally immersive time to visit, although it can be quite hot. For a quieter spiritual experience, visit during the cooler months.',
    safetyTips: 'Respect the unique local traditions, which may differ from standard Hindu practices. Dress modestly. Photography permissions should be sought before taking pictures of the deity or rituals.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.2500, lng: 73.9700 },
    distanceFromPanaji: '35 km',
    nearbyPlaces: ['Navelim Village', 'Local Markets'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'rudreshwar',
    name: 'Shri Rudreshwar Temple',
    location: 'Verna',
    region: 'South Goa',
    description: 'Located in the verdant surroundings near the Harvalem Waterfalls, the Shri Rudreshwar Temple is an ancient shrine dedicated to Lord Shiva. The temple holds a special place in the hearts of Goans as it is believed to be a place to perform rituals for the departed souls. The linga form of Shiva here is known as Rudreshwar, facing the waterfall, which adds a mystical element to the location. The sound of the cascading water creates a soothing backdrop for meditation and prayer.\n\nThe temple complex has undergone renovations but retains its spiritual core. Early morning visits are particularly enchanting when the mist rises from the waterfall and the temple bells chime. The site is also historically significant, with adjacent ancient rock-cut caves known as the Pandava caves, suggesting a history of settlement and worship dating back over a millennium. It is a perfect blend of nature, history, and spirituality.',
    deity: 'Lord Rudreshwar (Shiva)',
    architecture: 'Traditional Goan',
    significance: [
      'Shiva worship',
      'Peaceful environment',
      'Spiritual retreat',
      'Village importance'
    ],
    festivals: ['Mahashivratri'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire',
    bestTimeToVisit: ['December', 'January', 'February'],
    bestSeason: 'The best time to visit is immediately post-monsoon (September to November) when the nearby waterfall is in full flow, or during winter (December to February) for pleasant weather. Mahashivratri is a major festival here with grand celebrations.',
    safetyTips: 'Maintain silence and decorum, especially if rituals are being performed. The steps leading to the waterfall can be slippery, so exercise caution. Modest dress is required.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.3300, lng: 73.9500 },
    distanceFromPanaji: '25 km',
    nearbyPlaces: ['Verna Plateau', 'Industrial Area'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'navdurga',
    name: 'Shri Navdurga Temple',
    location: 'Madkai, Ponda',
    region: 'South Goa',
    description: 'The Shri Navdurga Temple in Madkai is dedicated to Goddess Navdurga, a fierce yet benevolent form of Goddess Ganpatimule. The idol is unique as it depicts a tilted head, which local legends attribute to the Goddess agreeing to a devotee\'s request. This temple is famous for its massive annual Zatra held in November, where the deity is taken out in a grand "Sangodd" (boat festival) in the nearby lake, a spectacle that is rare and visually stunning.\n\nThe temple architecture is grand, featuring a tall deepastambha and spacious sabhamandaps. The surroundings are peaceful, typical of Goan village temples, with coconut groves and paddy fields adding to the charm. The temple serves as the central point of social and cultural life for the Madkai village, preserving century-old traditions and rituals.',
    deity: 'Goddess Navdurga',
    architecture: 'Traditional Goan',
    significance: [
      'Navdurga worship',
      'Village deity',
      'Cultural importance',
      'Spiritual center'
    ],
    festivals: ['Navratri'],
    timings: '6:00 AM - 8:30 PM',
    dressCode: 'Traditional attire preferred',
    bestTimeToVisit: ['October', 'November'],
    bestSeason: 'November is the absolute best month to visit to witness the unique boat festival during the Zatra. Otherwise, the winter months offer a pleasant climate for a spiritual visit.',
    safetyTips: 'Dress appropriately. During the crowd of the Zatra, be mindful of personal space and belongings. Photography of the idols is generally not permitted.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.4200, lng: 74.0200 },
    distanceFromPanaji: '32 km',
    nearbyPlaces: ['Madkai Village', 'Spice Plantations'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'shri-kamleshwar',
    name: 'Shri Kamleshwar Temple',
    location: 'Marcela',
    region: 'North Goa',
    description: 'Situated in the temple town of Marcela, the Shri Kamleshwar Temple is a serene abode of Lord Shiva. The temple is known for its mystical atmosphere and is believed to be a place of potent spiritual vibrations. The Swayambhu (self-manifested) linga here is the main object of worship. The temple complex is modest but beautifully maintained, offering a quiet escape from the hustle of daily life.\n\nMarcela is known for having the highest density of temples in Goa, and Kamleshwar is one of its jewels. It plays a significant role in the local "Chikhal Kalo" festival (mud festival) celebrated in the village, which is a unique and playful devotional event dedicated to baby Krishna, taking place in the monsoons on the temple grounds.',
    deity: 'Lord Kamleshwar (Shiva)',
    architecture: 'Traditional Goan',
    significance: [
      'Shiva temple',
      'Peaceful location',
      'Village importance',
      'Spiritual calm'
    ],
    festivals: ['Mahashivratri'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire',
    bestTimeToVisit: ['December', 'January'],
    bestSeason: 'Visit during Mahashivratri for traditional festivities. If you are interested in unique culture, visiting during the monsoon (July) for the Chikhal Kalo festival in the nearby grounds is a once-in-a-lifetime experience.',
    safetyTips: 'Standard temple etiquette applies: Remove shoes, dress modestly, and maintain silence. If visiting for Chikhal Kalo, be prepared to get muddy!',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.4500, lng: 73.9700 },
    distanceFromPanaji: '18 km',
    nearbyPlaces: ['Marcela Village', 'Local Temples'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'keshavraj',
    name: 'Shri Keshavraj Temple',
    location: 'Kesarval',
    region: 'South Goa',
    description: 'Nestled in the lush forests near the Kesarval springs, the Shri Keshavraj Temple is a hidden sanctuary dedicated to Lord Vishnu. This temple is an oasis of calm, located away from main roads and surrounded by betel nut and coconut plantations. The journey to the temple involves a short, refreshing walk through the greenery, making the pilgrimage itself a nature trail.\n\nThe deity is ancient, and the temple retains an old-world charm with its wooden pillars and tiled roof. It is a favorite spot for those seeking solitude and meditation. The sound of birds and the rustling leaves provide a natural soundtrack to this spiritual haven.',
    deity: 'Lord Keshavraj (Vishnu)',
    architecture: 'Stone-built Goan',
    significance: [
      'Forest temple',
      'Ancient origin',
      'Nature surroundings',
      'Spiritual retreat'
    ],
    festivals: ['Zatra'],
    timings: '6:00 AM - 7:00 PM',
    dressCode: 'Traditional attire',
    bestTimeToVisit: ['November', 'December'],
    bestSeason: 'The cooler winter months are ideal for enjoying the walk to the temple. The monsoon season also transforms the surroundings into a vibrant green paradise, though paths may be slippery.',
    safetyTips: 'The path can be slippery, especially during rains, so wear good walking shoes. It is a remote location, so it is best to visit during daylight hours.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.3470, lng: 73.9770 },
    distanceFromPanaji: '22 km',
    nearbyPlaces: ['Kesarval Springs', 'Verna Plateau'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'mahadeva-curdi',
    name: 'Curdi Mahadeva Temple',
    location: 'Curdi',
    region: 'South Goa',
    description: 'The Curdi Mahadeva Temple is fascinating submerged wonder. It is an ancient 10th-century temple dedicated to Lord Shiva that was originally located in the village of Curdi. When the Salaulim Dam was built, the entire village, including this temple, was submerged. Uniquely, the temple was dismantled and relocated to higher ground nearby, but the original site and other structures still emerge from the receding waters during the dry summer months (April-May).\n\nThe "relocated" temple stands as a testament to heritage conservation, but the true magic lies in visiting the original site during summer when the water recedes, revealing cracked earth and the ruins of a lost village. It is a poignant and surreal experience, offering a stark reminder of the passage of time. The architecture is of the Kadamba period, simple stone construction that has withstood the test of water and time.',
    deity: 'Lord Mahadeva (Shiva)',
    architecture: 'Ancient Stone',
    significance: [
      'Submerged heritage site',
      'Ancient Shiva temple',
      'Historical importance',
      'Unique seasonal visibility'
    ],
    festivals: ['Mahashivratri'],
    timings: 'Seasonal Access',
    dressCode: 'Traditional attire',
    bestTimeToVisit: ['April', 'May'],
    bestSeason: 'This is a strictly seasonal destination. You must visit in late April or May when the water level of the Salaulim Dam is low enough to reveal the submerged ruins. For the rest of the year, it remains underwater.',
    safetyTips: 'The terrain can be uneven and dusty during summer; wear comfortable shoes and carry water as there are no shops nearby. It is a remote location, so arrange your transport accordingly.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.0500, lng: 74.0000 },
    distanceFromPanaji: '70 km',
    nearbyPlaces: ['Salaulim Dam', 'Sanguem'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'chandreshwar',
    name: 'Chandreshwar Bhoothnath Temple',
    location: 'Paroda',
    region: 'South Goa',
    description: 'Perched on the Chandranath Hill, the Chandreshwar Bhoothnath Temple offers both spiritual solace and breathtaking panoramic views of South Goa. Dedicated to Lord Shiva as the "Lord of the Moon" (Chandreshwar), the temple is ancient, with references dating back to the Bhoja dynasty who ruled Goa before the Portuguese. The Shiva Linga here is said to ooze water with the rays of the moon, a mystical phenomenon that draws believers.\n\nThe climb to the temple involves a series of steps, making it a mini-trek that rewards visitors with cool breeze and scenic vistas. The temple complex is traditional and serene. It is an excellent spot for watching the sunset, where spirituality meets natural beauty.',
    deity: 'Lord Chandreshwar (Shiva)',
    architecture: 'Traditional Goan',
    significance: [
      'Hilltop temple',
      'Scenic views',
      'Spiritual importance',
      'Popular trekking spot'
    ],
    festivals: ['Mahashivratri'],
    timings: '6:00 AM - 7:00 PM',
    dressCode: 'Traditional attire',
    bestTimeToVisit: ['December', 'January'],
    bestSeason: 'Winter months are best for the climb as the weather is cool. Visiting during a full moon night is particularly auspicious and special due to the temple\'s connection with the moon.',
    safetyTips: 'Be prepared for a climb; wear comfortable footwear. Carry water. Monkeys can be present on the hill, so be careful with food items.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.2300, lng: 73.9300 },
    distanceFromPanaji: '40 km',
    nearbyPlaces: ['Paroda Village', 'Viewpoints'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'lakshmi-narayan',
    name: 'Shri Lakshmi Narayan Temple',
    location: 'Kundaim',
    region: 'North Goa',
    description: 'The Shri Lakshmi Narayan Temple in Kundaim is a beautiful shrine dedicated to the divine couple, Lord Vishnu and Goddess Lakshmi. The temple is a fine example of Kuladevata (family deity) temples in Goa, maintained with great devotion by the community. The architecture features a bright and welcoming facade with a large deepastambha at the entrance.\n\nThe temple is known for its peaceful ambiance and cleanliness. It hosts a unique "Jatra" where folk dramas and plays are performed, keeping the local culture alive. The idol of Lakshmi Narayan is intricately carved and is a sight to behold during the heavy ornamentation of festival days.',
    deity: 'Lord Lakshmi Narayan',
    architecture: 'Traditional Goan',
    significance: [
      'Vishnu worship',
      'Village temple',
      'Peaceful atmosphere',
      'Cultural value'
    ],
    festivals: ['Vaikuntha Ekadashi'],
    timings: '6:00 AM - 8:30 PM',
    dressCode: 'Traditional attire',
    bestTimeToVisit: ['November', 'December'],
    bestSeason: 'The winter season is perfect for visiting. The annual festival season brings the village to life with cultural performances.',
    safetyTips: 'Standard temple dress code applies. Maintain silence in the prayer hall.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.4800, lng: 73.9500 },
    distanceFromPanaji: '16 km',
    nearbyPlaces: ['Kundaim Industrial Area', 'Local Villages'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'shantadurga-fatorpa',
    name: 'Shri Shantadurga Temple (Fatorpa)',
    location: 'Fatorpa',
    region: 'South Goa',
    description: 'This temple at Fatorpa is another significant shrine dedicated to Goddess Shantadurga, affectionately known here as "FatorpekariN". It is famous for its massive Zatra (Jatra) celebrated in December/January, which is one of the biggest in South Goa, attracting huge crowds and a fair-like atmosphere. The temple itself is a large, imposing structure with modern renovations but traditional core values.\n\nThe Goddess here is revered as a powerful mother figure, and people of all faiths, including Christians, come to offer prayers and oil. The "Rathotsav" (Chariot Festival) is the highlight, where the deity is taken around in a beautifully decorated chariot.',
    deity: 'Goddess Shantadurga',
    architecture: 'Traditional Goan',
    significance: [
      'Shantadurga worship',
      'Village deity',
      'Cultural importance',
      'Peaceful surroundings'
    ],
    festivals: ['Navratri', 'Zatra'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire preferred',
    bestTimeToVisit: ['October', 'November'],
    bestSeason: 'The Fatorpa Zatra involves large crowds and is a must-see cultural event if you are in Goa during December/January. For a quiet visit, choose other months.',
    safetyTips: 'During Zatra, the crowds are immense; keep children close and watch your wallet. Dress modestly at all times.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.2100, lng: 73.9500 },
    distanceFromPanaji: '45 km',
    nearbyPlaces: ['Fatorpa Village', 'Local Markets'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'mangueshi',
    name: 'Shri Mangueshi Temple',
    location: 'Mangueshi, Priol',
    region: 'South Goa',
    description: 'The Shri Mangueshi Temple is arguably the most famous and visited temple in Goa. Its elegant structure, with the signature seven-story deepastambha (lamp tower) at the entrance, is an icon of Goan heritage. Dedicated to Lord Manguesh, an incarnation of Shiva, the temple is located in Priol, surrounded by lush hills. The legend goes that Lord Shiva scared Parvati by turning into a tiger here, prompting her to cry "Trahi Mam Girisha" (Protect me, Lord of Mountains), which evolved into "Manguesh".\n\nThe temple complex includes a large water tank, assembly halls, and pilgrims\' quarters. The main temple floor is paved with white marble. The annual Zatra, where the rath (chariot) is pulled by thousands of devotees, is a grand spectacle. The lighting of the lamp tower with oil lamps on festival nights is a breathtaking sight.',
    deity: 'Lord Mangueshi (Shiva)',
    architecture: 'Traditional Goan',
    significance: [
      'One of the oldest temples in Goa',
      'Important Shiva temple',
      'Beautiful architecture',
      'Peaceful location'
    ],
    festivals: ['Mahashivratri', 'Navratri', 'Zatra'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire, covered shoulders and knees',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter is the best season. Mahashivratri (usually February/March) is celebrated with great fervor and is the best time to see the temple in all its glory.',
    safetyTips: 'This involves a strict dress code; sarongs are often available for rent if you are not dressed appropriately, but it is better to come prepared. Photography is restricted in many areas.',
    image: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.4333, lng: 73.9833 },
    distanceFromPanaji: '22 km',
    nearbyPlaces: ['Priol Fort', 'Spice Plantations', 'Local Markets'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'mahalsa',
    name: 'Shri Mahalsa Temple',
    location: 'Mardol, Ponda',
    region: 'South Goa',
    description: 'The Shri Mahalsa Temple in Mardol is dedicated to Goddess Mahalsa, who is worshipped as the Mohini avatar of Lord Vishnu. This makes it unique as one of the few temples where Vishnu is worshipped in a female form. The temple is renowned for its stunning wooden carvings on the pillars and the roof, depicting scenes from the Ramayana and Mahabharata. A massive brass bell at the entrance has its own history, having been transferred from a church.\n\nThe temple courtyard features a towering 40-foot deepastambha which is lit up on festival days, creating a magical aura. The Goddess is considered very powerful, and oaths taken in her name are taken very seriously in the local court of law (traditionally).',
    deity: 'Goddess Mahalsa',
    architecture: 'Traditional Goan',
    significance: [
      'Unique architecture',
      'Spiritual significance',
      'Goddess Parvati incarnation',
      'Peaceful environment'
    ],
    festivals: ['Navratri', 'Mahashivratri', 'Zatra'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire, covered shoulders and knees',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'The festival of "Kojagiri Purnima" (full moon after monsoon) is celebrated beautifully here. Winter months are generally ideal for a visit.',
    safetyTips: 'Dress conservatively. Do not touch the idols or enter the inner sanctum. Silence is expected in the main hall.',
    image: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.3833, lng: 73.9667 },
    distanceFromPanaji: '25 km',
    nearbyPlaces: ['Ponda Market', 'Local Temples', 'Spice Plantations'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'naguesh',
    name: 'Shri Naguesh Temple',
    location: 'Bandora, Ponda',
    region: 'South Goa',
    description: 'The Shri Naguesh Temple is dedicated to Naguesh (Nagnath), an ancient form of Lord Shiva. Unlike many other temples that were shifted during the Portuguese era, this temple has stood in its original location since ancient times, as evidenced by stone inscriptions dating back to 1413 AD. The temple is set by a large, beautiful water tank giving it a very cool and serene atmosphere.\n\nThe interiors are vibrant with wood carvings illustrating the Ramayana. The reflection of the temple in the clear waters of the tank is a photographer\'s delight. It is a quiet place, less commercialized than others, perfect for meditation.',
    deity: 'Lord Naguesh (Shiva)',
    architecture: 'Traditional Goan',
    significance: [
      'Surrounded by nature',
      'Peaceful atmosphere',
      'Lord Shiva temple',
      'Spiritual retreat'
    ],
    festivals: ['Mahashivratri', 'Navratri', 'Zatra'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire, covered shoulders and knees',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'The winter season is best. The temple tank is beautiful year-round, but evenings are especially peaceful.',
    safetyTips: 'Maintain the sanctity of the water tank; do not wash feet or throw items in it. Proper dress code is required.',
    image: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.3667, lng: 73.9667 },
    distanceFromPanaji: '28 km',
    nearbyPlaces: ['Bandora Market', 'Spice Plantations', 'Local Temples'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'ramnathi',
    name: 'Shri Ramnathi Temple',
    location: 'Bandivade, Ponda',
    region: 'South Goa',
    description: 'The Shri Ramnathi Temple holds a special legend: it is believed to be the place where Lord Rama worshipped Lord Shiva to atone for the sin of killing Ravana (who was a brahmin). Hence the name Ramnathi (Lord of Rama). The temple belongs to the Chitrapur Saraswat community but welcomes all. The temple structure is elegant, with a silver screen in the sanctum sanctorum.\n\nIt is one of a cluster of powerful temples in the Ponda region. The atmosphere is one of disciplined devotion. The temple has a spacious sabhamandap and offers facilities for various poojas and rituals.',
    deity: 'Lord Ramnathi (Shiva)',
    architecture: 'Traditional Goan',
    significance: [
      'Beautiful architecture',
      'Spiritual significance',
      'Lord Shiva temple',
      'Peaceful environment'
    ],
    festivals: ['Ramnavami', 'Navratri', 'Zatra'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire, covered shoulders and knees',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Ram Navami is a key festival here. Winter months provide the most comfortable climate for visiting.',
    safetyTips: 'This is a strictly traditional temple. Men may be asked to remove shirts for certain inner rituals (though not for general darshan). Women must dress modestly.',
    image: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.3500, lng: 73.9667 },
    distanceFromPanaji: '30 km',
    nearbyPlaces: ['Ponda Market', 'Spice Plantations', 'Local Markets'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'damodar',
    name: 'Shri Damodar Temple',
    location: 'Zambaulim, Sanguem',
    region: 'South Goa',
    description: 'Situated on the banks of the Kushavati River, the Shri Damodar Temple in Zambaulim is a site of immense faith. The river itself is believed to have healing properties. The deity, Lord Damodar (Shiva), was originally in Margao but was moved here. The temple is the center of the famous "Shigmo" festival celebrations in the region, which is Goa\'s version of Holi, celebrated with colorful pageantry.\n\nThe setting is picturesque and calm, away from the tourist tracks. Devotees often take a dip in the river before entering the temple. The architecture combines modern touches with traditional layout.',
    deity: 'Lord Damodar (Shiva)',
    architecture: 'Traditional Goan',
    significance: [
      'Located on river banks',
      'Beautiful surroundings',
      'Lord Shiva temple',
      'Peaceful location'
    ],
    festivals: ['Mahashivratri', 'Navratri', 'Zatra'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire, covered shoulders and knees',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'The Shigmo festival (around March) is the most vibrant time to witness the cultural explosion at this temple. Winters are pleasant for a regular visit.',
    safetyTips: 'The river current can vary, so be careful if stepping into the water. Moderate dress code applies.',
    image: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.1833, lng: 74.0833 },
    distanceFromPanaji: '45 km',
    nearbyPlaces: ['Kushavati River', 'Sanguem Wildlife', 'Local Markets'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'saptakoteshwar',
    name: 'Shri Saptakoteshwar Temple',
    location: 'Narve, Bicholim',
    region: 'North Goa',
    description: 'The Saptakoteshwar Temple has a tumultuous and resilient history. Dedicated to Lord Saptakoteshwar (Shiva), a deity worshipped by the Kadamba dynasty kings, the original temple was on Divar Island. After multiple destructions and relocations due to foreign invasions, it was finally rebuilt in Narve by Chhatrapati Shivaji Maharaj in 1668. This makes it a significant monument of Maratha architecture influence in Goa.\n\nThe temple is visually distinct with a faceted deepastambha and a European-style shallow dome proper. Located in a secluded valley, it includes carved rock niches in the hillside, thought to be ancient Buddhist caves. It is a place of deep history and quiet reverence.',
    deity: 'Lord Saptakoteshwar (Shiva)',
    architecture: 'Traditional Goan',
    significance: [
      'One of oldest temples in Goa',
      'Great historical significance',
      'Lord Shiva temple',
      'Ancient architecture'
    ],
    festivals: ['Mahashivratri', 'Navratri', 'Zatra'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire, covered shoulders and knees',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Mahashivratri is a major event. The winter season is perfect for exploring the nearby caves and the temple grounds.',
    safetyTips: 'Respect the historical value of the site. The area is quiet and somewhat isolated, so plan transport ahead.',
    image: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.5167, lng: 73.9167 },
    distanceFromPanaji: '35 km',
    nearbyPlaces: ['Bicholim Market', 'Fort Aguada', 'Local Temples'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'brahma',
    name: 'Shri Brahma Temple',
    location: 'Brahma-Karmali, Sattari',
    region: 'North Goa',
    description: 'The Shri Brahma Temple in Sattari is a rarity, being one of the very few temples in India dedicated to Lord Brahma, the Creator. The main idol of Brahma stands tall and is an exquisite piece of 12th-century Kadamba art, intricately carved from black stone. It depicts the deity with a beard, holding a ladle, Vedas, kamandalu, and chanting beads.\n\nLocated in a remote village, the temple setting is rustic and untouched by commercial tourism. It offers a unique spiritual experience, connecting visitors to an ancient cult of worship that has largely faded elsewhere. The journey to the temple takes you through the scenic hinterlands of Goa.',
    deity: 'Lord Brahma',
    architecture: 'Traditional Goan',
    significance: [
      'Rare Brahma temple',
      'Unique architecture',
      'Spiritual significance',
      'Peaceful location'
    ],
    festivals: ['Brahmotsav', 'Navratri', 'Zatra'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire, covered shoulders and knees',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
    bestSeason: 'Winter is the best time for the drive to Sattari. The temple is less crowded year-round, offering a peaceful visit anytime.',
    safetyTips: 'The location is remote; ensure your vehicle is in good condition. Dress conservatively.',
    image: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.4167, lng: 74.0000 },
    distanceFromPanaji: '40 km',
    nearbyPlaces: ['Sattari Hills', 'Spice Plantations', 'Local Markets'],
    entryFee: undefined,
    history: undefined
  },
  {
    id: 'mahalasa-narayani',
    name: 'Shri Mahalasa Narayani Temple',
    location: 'Mardol, Ponda',
    region: 'South Goa',
    description: 'This temple in Mardol reveres Goddess Mahalasa Narayani, a female incarnation of Vishnu. It is one of the most celebrated temples in Goa, known for its sheer grandeur and the magical atmosphere of its courtyard. The huge deepastambha made of brass is a major attraction, one of the largest of its kind. The temple has a very high ceiling with intricate paintings and wood carvings.\n\nIt is said that the Goddess here never returns a devotee empty-handed. The area around the temple is bustling with small shops selling puja items and local sweets, creating a lively ecosystem.',
    deity: 'Goddess Mahalasa Narayani',
    architecture: 'Goan Hindu',
    significance: ['Unique deity worship', 'Beautiful temple tank', 'Historic significance', 'Peaceful atmosphere'],
    festivals: ['Mahalasa Jayanti', 'Navratri', 'Diwali'],
    timings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire preferred, covered shoulders and knees',
    bestTimeToVisit: ['October', 'November', 'December', 'January', 'February'],
    bestSeason: 'Visit during the Zatra or Navratri for a spectacular view of the lit-up temple and deepastambha. Winters are pleasant.',
    safetyTips: 'Strict dress code enforcement. Be respectful of the local customs.',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg',
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
      "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800",
      "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg"
    ],
    coordinates: { lat: 15.4167, lng: 73.9833 },
    distanceFromPanaji: '26 km',
    nearbyPlaces: ['Shantadurga Temple', 'Mangeshi Temple', 'Ponda Market'],
    entryFee: undefined,
    history: undefined
  }
];

export const getTemplesByRegion = (region: 'North Goa' | 'South Goa') => {
  return goaTemples.filter(temple => temple.region === region);
};

export const getTempleById = (id: string) => {
  return goaTemples.find(temple => temple.id === id);
};

export const getTemplesByDeity = (deity: string) => {
  return goaTemples.filter(temple => temple.deity.toLowerCase().includes(deity.toLowerCase()));
};
