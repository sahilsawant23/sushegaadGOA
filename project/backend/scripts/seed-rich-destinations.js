
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};


// ---------------------------------------------------------
// DATA SOURCES (Manually Adapted from TS files)
// ---------------------------------------------------------

const ALL_DESTINATIONS = [
    // --- BEACHES (Sample selection for North/South) ---
    {
        name: 'Polem Beach',
        region: 'South Goa',
        category: 'Beach',
        description: 'The southernmost beach in Goa, near the Karnataka border. Polem is deserted and clean with a backwater at the northern end where you can visit some islands.',
        image_url: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?cs=srgb&dl=pexels-fabianwiktor-994605.jpg&fm=jpg',
        gallery_images: [
            "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
            "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg"
        ],
        details: {
            highlights: ['Southernmost beach in Goa', 'Clean and deserted', 'Backwater access'],
            bestFor: ['Solitude seekers', 'Nature lovers'],
            bestTimeToVisit: ['October', 'November', 'December', 'January', 'February'],
            coordinates: { lat: 15.0074, lng: 74.0245 },
            distanceFromPanaji: '65 km',
            facilities: ['Basic amenities']
        }
    },
    {
        name: 'Palolem Beach',
        region: 'South Goa',
        category: 'Beach',
        description: 'The most popular beach in South Goa. A long crescent-shaped beach with palm trees bending over the sand, small guest houses and lodges, and popular "silent discos".',
        image_url: 'https://media.istockphoto.com/id/157579910/photo/the-beach.jpg?s=612x612&w=0&k=20&c=aMk67AmzIVD_S1Nibww8ytUdyub2ck3HNQ3uTvuPWPI=',
        gallery_images: [
            "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
            "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg"
        ],
        details: {
            highlights: ['Crescent-shaped coastline', 'Silent discos', 'Canacona Island nearby'],
            bestFor: ['Party lovers', 'Backpackers', 'Island explorers'],
            bestTimeToVisit: ['October', 'November', 'December', 'January', 'February', 'March'],
            coordinates: { lat: 15.0424, lng: 74.0525 },
            distanceFromPanaji: '51 km',
            facilities: ['Guest houses', 'Beach shacks', 'Restaurants', 'Water sports']
        }
    },
    {
        name: 'Agonda Beach',
        region: 'South Goa',
        category: 'Beach',
        description: 'Ranked as Asia\'s #1 beach for 2018 by TripAdvisor Travelers\' Choice® awards. An isolated beach perfect for solitude.',
        image_url: 'https://media.istockphoto.com/id/859845026/photo/beach-in-goa-india.jpg?s=612x612&w=0&k=20&c=Z8tUTVszkmnRfZU_-_27goIfbnDKlI65sAdMMzbGxMQ=',
        gallery_images: [
            "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
        ],
        details: {
            highlights: ["Asia's #1 beach 2018", "Isolated and pristine", "Olive Ridley turtle nesting"],
            bestFor: ['Solitude seekers', 'Photography', 'Nature lovers'],
            bestTimeToVisit: ['October', 'November', 'December', 'January', 'February'],
            coordinates: { lat: 15.0524, lng: 74.0605 },
            distanceFromPanaji: '47 km',
            facilities: ['Beach shacks', 'Guesthouses']
        }
    },
    {
        name: 'Butterfly Beach',
        region: 'South Goa',
        category: 'Beach',
        description: 'A secluded and small beach where you will see plenty of butterflies and have a chance to see dolphins. Accessible by boat or trek.',
        image_url: 'https://curlytales.com/wp-content/uploads/2020/10/53236479_310537179649791_5821590045949884028_n-1.jpg',
        gallery_images: [
            "https://images.unsplash.com/photo-1544249159-8fa9a103c81e?w=800&q=80",
            "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg"
        ],
        details: {
            highlights: ['Butterfly watching', 'Dolphin spotting', 'Secluded location'],
            bestFor: ['Nature photographers', 'Adventure seekers'],
            difficulty: 'Moderate',
            bestTimeToVisit: ['October', 'November', 'December', 'January', 'February'],
            coordinates: { lat: 15.0474, lng: 74.0565 },
            distanceFromPanaji: '49 km',
            facilities: ['None']
        }
    },
    {
        name: 'Calangute Beach',
        region: 'North Goa',
        category: 'Beach',
        description: 'Known as the "Queen of Beaches", Calangute offers water sports, shacks, and a lively atmosphere.',
        image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000',
        gallery_images: [
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
            "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800"
        ],
        details: {
            highlights: ['Queen of Beaches', 'Water sports hub', 'Lively nightlife'],
            bestFor: ['Families', 'Groups', 'First-time visitors'],
            coordinates: { lat: 15.5494, lng: 73.7535 },
            distanceFromPanaji: '15 km',
            facilities: ['Sunbeds', 'Water sports', 'Changing rooms', 'Lifeguards']
        }
    },
    {
        name: 'Baga Beach',
        region: 'North Goa',
        category: 'Beach',
        description: 'Famous for its nightlife, Brittos shack, and water sports. A seamless extension of Calangute but with a more energetic vibe.',
        image_url: 'https://images.unsplash.com/photo-1590497678310-9076bc1f939e?auto=format&fit=crop&q=80&w=1000',
        gallery_images: [
            "https://images.unsplash.com/photo-1590497678310-9076bc1f939e",
            "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg"
        ],
        details: {
            highlights: ['Titos Lane nightlife', 'Water sports', 'Shacks'],
            bestFor: ['Party lovers', 'Youth', 'Adrenaline junkies'],
            coordinates: { lat: 15.5553, lng: 73.7517 },
            distanceFromPanaji: '16 km',
            facilities: ['Clubs', 'Shacks', 'Water sports', 'Parking']
        }
    },

    // --- NIGHTLIFE (from nightlifeData.ts) ---
    {
        name: "Tito's",
        region: 'North Goa',
        category: 'Nightlife',
        description: 'Iconic nightclub on the famous Tito\'s Lane, known for its legendary parties and vibrant atmosphere.',
        image_url: 'https://titosgoa.com/wp-content/uploads/2022/08/titos-club-goa.jpg',
        gallery_images: [
            "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
            "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
        ],
        details: {
            type: 'Nightclub',
            location: "Tito's Lane, Baga Beach",
            openingHours: '9:00 PM - 3:00 AM',
            priceRange: 'Mid-range',
            musicGenre: ['Electronic', 'House', 'Commercial', 'Bollywood'],
            highlights: ['Legendary Goa nightclub', 'Live DJ performances', 'Beachfront access'],
            bestFor: ['Party lovers', 'Dance enthusiasts'],
            rating: 4.3
        }
    },
    {
        name: 'Club LPK (Love, Passion, Karma)',
        region: 'North Goa',
        category: 'Nightlife',
        description: 'A popular waterfront club with a unique ambiance, offering an unforgettable nightlife experience with stunning sculpted interiors.',
        image_url: 'https://media1.thrillophilia.com/filestore/y03andn3e7nhvd21gjlrpq1semha_lpk-club-in-goa-banner.jpg',
        gallery_images: [
            "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
            "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg"
        ],
        details: {
            type: 'Nightclub',
            location: 'Calangute Beach',
            openingHours: '8:00 PM - 3:00 AM',
            priceRange: 'Luxury',
            musicGenre: ['House', 'Electronic', 'Lounge'],
            highlights: ['Waterfront location', 'Unique sculpted design', 'Stunning views'],
            bestFor: ['Couples', 'Sophisticated crowd', 'Special occasions'],
            rating: 4.3
        }
    },
    {
        name: 'Curlies Beach Shack',
        region: 'North Goa',
        category: 'Nightlife',
        description: 'A legendary beach shack in Anjuna, famous for its parties and lively atmosphere, representing authentic Goa trance culture.',
        image_url: 'https://goa-tourism.org.in/images/places-to-visit/headers/curlies-goa-header-goa-tourism.jpg.jpg',
        gallery_images: [
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
            "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
        ],
        details: {
            type: 'Beach Shack',
            location: 'Anjuna Beach',
            openingHours: '10:00 AM - 2:00 AM',
            priceRange: 'Budget',
            musicGenre: ['Trance', 'Electronic', 'Psychedelic'],
            highlights: ['Legendary parties', 'Beachfront', 'Authentic vibe'],
            bestFor: ['Beach parties', 'Trance lovers'],
            rating: 4.4
        }
    },
    {
        name: 'Silent Noise Club',
        region: 'South Goa',
        category: 'Nightlife',
        description: 'A unique silent disco experience popular in South Goa, where guests wear wireless headphones and dance to their choice of music channels.',
        image_url: 'https://static.toiimg.com/photo/52291913.cms',
        gallery_images: [
            "https://images.unsplash.com/photo-5145252531617a46d19cd819?w=800",
            "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg"
        ],
        details: {
            type: 'Nightclub',
            location: 'Palolem Beach, South Goa',
            openingHours: '8:00 PM - 2:00 AM',
            priceRange: 'Mid-range',
            musicGenre: ['Multiple Channels', 'Electronic', 'Pop'],
            highlights: ['Silent disco', 'Wireless headphones', 'Interactive experience'],
            bestFor: ['Unique experiences', 'Innovation lovers', 'Quiet zones'],
            rating: 4.7
        }
    },

    // --- TEMPLES (from templeData.ts) ---
    {
        name: 'Shri Shantadurga Temple',
        region: 'South Goa',
        category: 'Spiritual',
        description: 'Dedicated to Goddess Shantadurga, the goddess of peace. The temple has a beautiful blend of Indo-Portuguese architecture.',
        image_url: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        gallery_images: [
            "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
            "https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg"
        ],
        details: {
            deity: 'Goddess Shantadurga',
            location: 'Kavlem, Ponda',
            timings: '6:00 AM - 10:00 PM',
            dressCode: 'Traditional attire, covered shoulders and knees',
            bestTimeToVisit: ['October', 'November', 'December'],
            highlights: ['Richest temple in Goa', 'Indo-Portuguese architecture'],
            coordinates: { lat: 15.4017, lng: 73.9828 },
            distanceFromPanaji: '33 km'
        }
    },
    {
        name: 'Shri Mangeshi Temple',
        region: 'South Goa',
        category: 'Spiritual',
        description: 'Dedicated to Lord Mangueshi, an incarnation of Lord Shiva. Known for its beautiful architecture, huge Deepastambha (lamp tower), and peaceful surroundings.',
        image_url: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        gallery_images: [
            "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg",
            "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
        ],
        details: {
            deity: 'Lord Mangueshi (Shiva)',
            location: 'Mangueshi, Priol',
            timings: '6:00 AM - 9:00 PM',
            dressCode: 'Traditional attire',
            highlights: ['Major Shiva temple', 'Seven-story Lamp Tower', 'Water tank'],
            coordinates: { lat: 15.4333, lng: 73.9833 },
            distanceFromPanaji: '22 km'
        }
    },
    {
        name: 'Tambdi Surla Temple',
        region: 'South Goa',
        category: 'Spiritual',
        description: 'The oldest temple in Goa, built in the 12th century. A Shaivite temple made of basalt stone, dedicated to Lord Shiva.',
        image_url: 'https://images.unsplash.com/photo-1627894451037-567475d68800?auto=format&fit=crop&q=80&w=1000',
        gallery_images: [
            "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg"
        ],
        details: {
            deity: 'Lord Shiva',
            location: 'Mollem National Park',
            timings: '8:00 AM - 5:30 PM',
            highlights: ['Oldest temple in Goa', 'Hemadpanthi style architecture', 'Basalt stone carving'],
            coordinates: { lat: 15.3140, lng: 74.2380 },
            distanceFromPanaji: '65 km'
        }
    },

    // --- CHURCHES (from churchData.ts) ---
    {
        name: 'Basilica of Bom Jesus',
        region: 'Old Goa',
        category: 'Heritage',
        description: 'A UNESCO World Heritage Site housing the mortal remains of St. Francis Xavier. This 16th-century church is a masterpiece of Baroque architecture.',
        image_url: 'https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg',
        gallery_images: [
            "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
            "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg"
        ],
        details: {
            location: 'Old Goa',
            architecture: 'Baroque',
            history: 'Built in 1605',
            timings: '9:00 AM - 6:30 PM',
            highlights: ['Mortal remains of St. Francis Xavier', 'UNESCO World Heritage Site', 'Golden Altars'],
            coordinates: { lat: 15.4989, lng: 73.9133 },
            distanceFromPanaji: '10 km'
        }
    },
    {
        name: 'Se Cathedral',
        region: 'Old Goa',
        category: 'Heritage',
        description: 'The largest church in Asia, dedicated to St. Catherine. It creates a stunning impression with its Portuguese-Manueline architecture.',
        image_url: 'https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg',
        gallery_images: [
            "https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800"
        ],
        details: {
            location: 'Old Goa',
            architecture: 'Portuguese-Manueline',
            timings: '7:30 AM - 6:00 PM',
            highlights: ['Largest church in Asia', 'Golden Bell', 'Fifteen Altars'],
            coordinates: { lat: 15.4985, lng: 73.9129 },
            distanceFromPanaji: '10 km'
        }
    },
    {
        name: 'Our Lady of the Immaculate Conception Church',
        region: 'North Goa',
        category: 'Heritage',
        description: 'One of Goa\'s most iconic churches, overlooking the main square of Panaji with its zigzag staircases and bright white facade.',
        image_url: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4?w=800',
        gallery_images: [
            "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
            "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg"
        ],
        details: {
            location: 'Panaji',
            architecture: 'Portuguese Baroque',
            timings: '9:30 AM - 12:30 PM, 3:30 PM - 7:30 PM',
            highlights: ['Iconic zigzag stairs', 'City view', 'Ancient bell'],
            coordinates: { lat: 15.4909, lng: 73.8278 },
            distanceFromPanaji: '0 km'
        }
    },

    // --- WATERFALLS (from waterfallData.ts) ---
    {
        name: 'Dudhsagar Waterfalls',
        region: 'Central Goa',
        category: 'Nature',
        description: 'A majestic four-tiered waterfall on the Mandovi River, resembling a "Sea of Milk". At 310 meters, it is one of India\'s tallest waterfalls.',
        image_url: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg',
        gallery_images: [
            "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
            "https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg"
        ],
        details: {
            height: '310 meters',
            bestSeason: 'June to September (Monsoon)',
            difficulty: 'Moderate',
            location: 'Mollem National Park',
            highlights: ['Milk-like appearance', 'Railway bridge passing through', 'Jeep safari access'],
            coordinates: { lat: 15.3144, lng: 74.3154 },
            distanceFromPanaji: '60 km',
            entryFee: '₹50'
        }
    },
    {
        name: 'Arvalem Waterfalls',
        region: 'South Goa',
        category: 'Nature',
        description: 'A scenic waterfall located near the Pandava (Arvalem) Caves. It falls from a height of 50 meters into a lake at the bottom.',
        image_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=1000',
        gallery_images: [
            "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg"
        ],
        details: {
            height: '50 meters',
            bestSeason: 'Monsoon (June-October)',
            difficulty: 'Easy',
            location: 'Sanquelim',
            highlights: ['Historic caves nearby', 'Rudreshwar Temple nearby', 'Picnic spot'],
            coordinates: { lat: 15.2833, lng: 74.1167 },
            distanceFromPanaji: '45 km'
        }
    },

    // --- HIDDEN GEMS (from hiddenGemsData.ts) ---
    {
        name: 'Netravali Bubble Lake',
        region: 'South Goa',
        category: 'Hidden Gem',
        description: 'A sacred tank (Budbudyanchi Tali) known for its mysterious bubbles that rise continuously to the surface. It is located near the Gopinath Temple.',
        image_url: 'https://images.unsplash.com/photo-1582294154848-8df090c2e42c?w=800&q=80',
        gallery_images: [],
        details: {
            location: 'Sanguem, South Goa',
            bestTime: 'Anytime',
            difficulty: 'Easy',
            highlights: ['Mysterious rising bubbles', 'Sacred tank', 'Peaceful temple surroundings']
        }
    },
    {
        name: 'Harvalem Waterfalls (Hidden Gem)', // Duplicate name handling logic would simply update or skip. Let's name distinct.
        region: 'North Goa',
        category: 'Hidden Gem',
        description: 'A scenic waterfall cascading down from a height of 50 meters, near Arvalem Caves.',
        image_url: 'https://images.unsplash.com/photo-1622306236966-28564db4430e?w=800&q=80',
        gallery_images: [],
        details: {
            location: 'Sanquelim',
            bestTime: 'Monsoon',
            difficulty: 'Easy'
        }
    },
    {
        name: 'Cabo de Rama Fort',
        region: 'South Goa',
        category: 'Hidden Gem', // Also Heritage, but categorized here for completeness
        description: 'One of the oldest forts in Goa, offering panoramic views of the Arabian Sea. It has a rich history and a small church inside.',
        image_url: 'https://images.unsplash.com/photo-1598424268600-4743285c5314?w=800&q=80',
        gallery_images: [],
        details: {
            location: 'Canacona',
            bestTime: 'Sunset',
            difficulty: 'Easy',
            highlights: ['Panoramic ocean views', 'Sunset point', 'Historic ruins']
        }
    },
    {
        name: 'Chorla Ghats',
        region: 'North Goa',
        category: 'Hidden Gem',
        description: 'A stunning mountain range offering breathtaking views, lush greenery, and rare biodiversity. Perfect for a scenic drive.',
        image_url: 'https://images.unsplash.com/photo-1626354674063-8a3fc42d765d?w=800&q=80',
        gallery_images: [],
        details: {
            location: 'Goa-Karnataka-Maharashtra border',
            bestTime: 'Winter (Nov-Feb)',
            difficulty: 'Easy drive',
            highlights: ['Scenic drive', 'Biodiversity', 'Mist-covered peaks']
        }
    },
    {
        name: 'Fontainhas (Latin Quarter)',
        region: 'Old Goa',
        category: 'Heritage',
        description: 'The Latin Quarter of Panjim, known for its colorful Portuguese-style houses, narrow winding streets, and art galleries. A photographer\'s delight.',
        image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
        gallery_images: [
            "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
            "https://images.unsplash.com/photo-1620766165457-a8085ddccd79?w=800"
        ],
        details: {
            location: 'Panjim',
            architecture: 'Portuguese Colonial',
            bestTime: 'Early Morning or Late Afternoon',
            highlights: ['Colorful Houses', 'Gitanjali Gallery', 'Walking Tours', 'Azulejos Tiles'],
            bestFor: ['Photographers', 'Culture Lovers', 'Walking Tours'],
            coordinates: { lat: 15.4947, lng: 73.8309 },
            distanceFromPanaji: '1 km'
        }
    },
    {
        name: 'Reis Magos Fort',
        region: 'North Goa',
        category: 'Heritage',
        description: 'A restored 16th-century fort overlooking the Mandovi River, offering panoramic views and a cultural center with art exhibitions.',
        image_url: 'https://images.unsplash.com/photo-1596706037000-85fbd245780a?w=800',
        gallery_images: [
            "https://images.unsplash.com/photo-1596706037000-85fbd245780a?w=800",
            "https://images.unsplash.com/photo-1678165037145-9852f5569426?w=800"
        ],
        details: {
            location: 'Verem',
            architecture: 'Laterite Stone Fort',
            timings: '9:30 AM - 5:00 PM (Closed Mondays)',
            entryFee: '₹50',
            highlights: ['River Views', 'Art Gallery', 'Canon Battery'],
            coordinates: { lat: 15.5009, lng: 73.8096 },
            distanceFromPanaji: '8 km'
        }
    },
    {
        name: 'Sahakari Spice Farm',
        region: 'Central Goa',
        category: 'Nature',
        description: 'A genuine spice farm where you can see spices growing, enjoy a traditional Goan lunch, and learn about organic farming.',
        image_url: 'https://images.unsplash.com/photo-1621914902263-c79a29d67396?w=800',
        gallery_images: [],
        details: {
            location: 'Ponda',
            bestTime: 'Morning (before lunch)',
            highlights: ['Spice Tour', 'Elephant Ride', 'Traditional Lunch', 'Cashew Feni Distillation']
        }
    },
    {
        name: 'Bondla Wildlife Sanctuary',
        region: 'Central Goa',
        category: 'Nature',
        description: 'A small but popular wildlife sanctuary with a mini zoo, deer safari park, botanical gardens, and nature trails. Great for families.',
        image_url: 'https://images.unsplash.com/photo-1547285906-8d5918749a15?w=800',
        gallery_images: [],
        details: {
            location: 'Ponda',
            timings: '9:00 AM - 5:00 PM (Closed Thursdays)',
            entryFee: '₹50 adults, ₹10 children',
            highlights: ['Mini Zoo', 'Deer Safari', 'Nature Trails', 'Botanical Garden']
        }
    },
    {
        name: 'Big Foot Goa (Ancestral Goa)',
        region: 'Central Goa',
        category: 'Culture',
        description: 'An open-air museum recreating a traditional Goan village from the past, featuring statues, artifacts, and the "Big Foot" rock carving.',
        image_url: 'https://images.unsplash.com/photo-1595167664426-6814b6215758?w=800',
        gallery_images: [],
        details: {
            location: 'Loutolim',
            timings: '9:00 AM - 6:00 PM',
            entryFee: '₹50 - ₹100',
            highlights: ['Big Foot Legend', 'Traditional Village', 'Handicrafts Center']
        }
    }
];

async function seedRichDestinations() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        for (const place of ALL_DESTINATIONS) {
            // Check if exists
            const [existing] = await conn.execute('SELECT id FROM destinations WHERE name = ?', [place.name]);

            const detailsJson = JSON.stringify(place.details);
            const galleryJson = JSON.stringify(place.gallery_images);

            if (existing.length === 0) {
                // Insert
                await conn.execute(
                    `INSERT INTO destinations 
                    (name, region, description, category, image_url, gallery_images, details) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [place.name, place.region, place.description, place.category, place.image_url, galleryJson, detailsJson]
                );
                console.log(`Added: ${place.name}`);
            } else {
                // Update specific rich fields
                await conn.execute(
                    `UPDATE destinations 
                    SET 
                        description = ?, 
                        region = ?,
                        category = ?,
                        image_url = ?,
                        gallery_images = ?, 
                        details = ? 
                    WHERE id = ?`,
                    [place.description, place.region, place.category, place.image_url, galleryJson, detailsJson, existing[0].id]
                );
                console.log(`Updated (Rich Data): ${place.name}`);
            }
        }

        console.log('Finished seeding rich destination data.');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

seedRichDestinations();
