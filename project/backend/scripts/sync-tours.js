require('dotenv').config({ path: '../.env' }); // Adjust path if needed, or assume ENV vars set
const mysql = require('mysql2/promise');

const toursData = [
    {
        id: '1',
        title: 'North Goa Beach Hopping',
        category: 'Beach',
        description: 'Explore the vibrant beaches of North Goa including Baga, Calangute, and Anjuna',
        price: 2500,
        duration: '8 hours',
        rating: 4.5,
        reviewCount: 234,
        image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
        location: 'North Goa'
    },
    {
        id: '2',
        title: 'Old Goa Heritage Tour',
        category: 'Heritage',
        description: 'Visit historic churches, cathedrals, and Portuguese architecture in Old Goa',
        price: 1800,
        duration: '6 hours',
        rating: 4.7,
        reviewCount: 189,
        image: 'https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg',
        location: 'Old Goa'
    },
    {
        id: '3',
        title: 'Dudhsagar Waterfall Adventure',
        category: 'Adventure',
        description: 'Trek to the majestic Dudhsagar Falls and enjoy the natural beauty',
        price: 3200,
        duration: '10 hours',
        rating: 4.8,
        reviewCount: 312,
        image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg',
        location: 'Mollem'
    },
    {
        id: '4',
        title: 'Spice Plantation Tour',
        category: 'Culture',
        description: 'Experience authentic Goan spice plantations with traditional lunch',
        price: 2000,
        duration: '5 hours',
        rating: 4.4,
        reviewCount: 156,
        image: 'https://images.unsplash.com/photo-1596040033229-a0b3b7d8c9f8',
        location: 'Ponda'
    },
    {
        id: '5',
        title: 'Goan Food Trail',
        category: 'Food',
        description: 'Taste authentic Goan cuisine and learn about local food culture',
        price: 2200,
        duration: '4 hours',
        rating: 4.6,
        reviewCount: 198,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
        location: 'Panaji'
    },
    {
        id: '6',
        title: 'South Goa Serenity',
        category: 'Beach',
        description: 'Discover peaceful beaches of South Goa - Palolem, Agonda, and Butterfly Beach',
        price: 2800,
        duration: '8 hours',
        rating: 4.9,
        reviewCount: 267,
        image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg',
        location: 'South Goa'
    },
    {
        id: '7',
        title: 'Scuba Diving Experience',
        category: 'Adventure',
        description: 'Explore underwater marine life with professional diving instructors',
        price: 4500,
        duration: '3 hours',
        rating: 4.7,
        reviewCount: 145,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        location: 'Grande Island'
    },
    {
        id: '8',
        title: 'Fontainhas Walking Tour',
        category: 'Heritage',
        description: 'Walk through the colorful Latin Quarter and learn about Portuguese influence',
        price: 1500,
        duration: '3 hours',
        rating: 4.5,
        reviewCount: 123,
        image: 'https://images.unsplash.com/photo-1609504373567-acda19c93dc4',
        location: 'Panaji'
    },
    {
        id: '9',
        title: 'Sunset Cruise',
        category: 'Culture',
        description: 'Enjoy a romantic sunset cruise on the Mandovi River with live music',
        price: 1800,
        duration: '2 hours',
        rating: 4.6,
        reviewCount: 201,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        location: 'Panaji'
    },
    {
        id: '10',
        title: 'Goan Village Experience',
        category: 'Culture',
        description: 'Immerse yourself in traditional Goan village life and customs',
        price: 1900,
        duration: '6 hours',
        rating: 4.4,
        reviewCount: 134,
        image: 'https://images.unsplash.com/photo-1596040033229-a0b3b7d8c9f8',
        location: 'Divar Island'
    },
    {
        id: '11',
        title: 'Divar Island E-Bike Tour',
        category: 'Adventure',
        description: 'Explore the scenic Divar Island on electric bikes, visiting ancient ruins and scenic spots.',
        price: 1500,
        duration: '4 hours',
        rating: 4.8,
        reviewCount: 95,
        image: 'https://images.unsplash.com/photo-1519114056088-b877cb07127e',
        location: 'Divar Island'
    },
    {
        id: '12',
        title: 'Chorao Island Bird Watching',
        category: 'Nature',
        description: 'Early morning boat ride through mangroves to spot diverse bird species at Dr. Salim Ali Bird Sanctuary.',
        price: 1200,
        duration: '3 hours',
        rating: 4.6,
        reviewCount: 82,
        image: 'https://images.unsplash.com/photo-1444464666168-49d633b867c7',
        location: 'Chorao Island'
    },
    {
        id: '13',
        title: 'Temple Trail of Ponda',
        category: 'Culture',
        description: 'A spiritual journey visiting the majestic temples of Ponda including Mangueshi and Shantadurga.',
        price: 1800,
        duration: '6 hours',
        rating: 4.7,
        reviewCount: 150,
        image: 'https://images.unsplash.com/photo-1562981035-7c152a5cbe7e',
        location: 'Ponda'
    },
    {
        id: '14',
        title: 'Panjim Street Food Crawl',
        category: 'Food',
        description: 'Taste the best local snacks like Cutlet Pao, Rissois, and Ros Omelette in the capital city.',
        price: 1000,
        duration: '3 hours',
        rating: 4.5,
        reviewCount: 200,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea287bc3a55',
        location: 'Panaji'
    },
    {
        id: '15',
        title: 'Bicholim Pottery Village Visit',
        category: 'Art',
        description: 'Visit a traditional pottery village, watch artisans at work, and try your hand at the wheel.',
        price: 1400,
        duration: '4 hours',
        rating: 4.9,
        reviewCount: 65,
        image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9',
        location: 'Bicholim'
    },
    {
        id: '16',
        title: 'Feni Distillery Tour & Tasting',
        category: 'Food',
        description: 'Learn the traditional process of making Cashew Feni and enjoy a tasting session.',
        price: 1600,
        duration: '3 hours',
        rating: 4.6,
        reviewCount: 110,
        image: 'https://images.unsplash.com/photo-1542614471-001ccf2b44c0',
        location: 'Sattari'
    },
    {
        id: '17',
        title: 'Grand Island Boat Trip & Snorkeling',
        category: 'Adventure',
        description: 'Full day boat trip including snorkeling, dolphin watching, and a beach BBQ lunch.',
        price: 2500,
        duration: '7 hours',
        rating: 4.5,
        reviewCount: 310,
        image: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527',
        location: 'Grand Island'
    },
    {
        id: '18',
        title: 'Netravali Bubbling Lake Trek',
        category: 'Hidden Places',
        description: 'Discover the mysterious bubbling lake of Netravali and trek through dense forests.',
        price: 2000,
        duration: '6 hours',
        rating: 4.8,
        reviewCount: 50,
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
        location: 'Sanguem'
    },
    {
        id: '19',
        title: 'Tambdi Surla Ancient Temple Trek',
        category: 'Culture',
        description: 'Hike to the oldest surviving temple in Goa, built in the 12th century, hidden in the forest.',
        price: 2200,
        duration: '5 hours',
        rating: 4.9,
        reviewCount: 180,
        image: 'https://images.unsplash.com/photo-1518182170546-0766ce6f1156',
        location: 'Mollem'
    },
    {
        id: '20',
        title: 'South Goa Heritage Drive',
        category: 'Culture',
        description: 'Drive past magnificent Indo-Portuguese mansions in Loutolim and Chandor.',
        price: 2500,
        duration: '6 hours',
        rating: 4.7,
        reviewCount: 140,
        image: 'https://images.unsplash.com/photo-1596726197475-2964a25035f2',
        location: 'Salcete'
    },
    {
        id: '21',
        title: 'Crab Catching & Backwater Cruise',
        category: 'Nature',
        description: 'A fun activity catching crabs using traditional traps followed by a tasty crab dinner.',
        price: 1800,
        duration: '4 hours',
        rating: 4.5,
        reviewCount: 90,
        image: 'https://images.unsplash.com/photo-1621841957884-f2a832c388d1',
        location: 'Chapora River'
    },
    {
        id: '22',
        title: 'Goan Bread Making Workshop',
        category: 'Food',
        description: 'Learn to bake traditional Goan breads like Poi and Unde from local bakers.',
        price: 1200,
        duration: '3 hours',
        rating: 4.8,
        reviewCount: 75,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
        location: 'Majorda'
    },
    {
        id: '23',
        title: 'Arvalem Caves & Waterfall Tour',
        category: 'Hidden Places',
        description: 'Explore the rock-cut Pandava caves and visit the scenic Arvalem waterfall nearby.',
        price: 1500,
        duration: '4 hours',
        rating: 4.6,
        reviewCount: 95,
        image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9',
        location: 'Sanquelim'
    },
    {
        id: '24',
        title: 'Cabo de Rama Fort & Sunset',
        category: 'Beauty',
        description: 'Visit the ruins of Cabo de Rama Fort and watch a stunning sunset over the Arabian Sea.',
        price: 1400,
        duration: '4 hours',
        rating: 4.7,
        reviewCount: 220,
        image: 'https://images.unsplash.com/photo-1615891636187-5f0535e5d366',
        location: 'Canacona'
    },
    {
        id: '25',
        title: 'Museum of Christian Art Tour',
        category: 'Art',
        description: 'Admire a unique collection of Indo-Portuguese Christian art at the convent of Santa Monica.',
        price: 800,
        duration: '2 hours',
        rating: 4.5,
        reviewCount: 60,
        image: 'https://images.unsplash.com/photo-1548625361-12e2c88d8b63',
        location: 'Old Goa'
    },
    {
        id: '26',
        title: 'Houses of Goa Museum Visit',
        category: 'Art',
        description: 'A dedicated museum showcasing the unique architectural history of Goan houses.',
        price: 900,
        duration: '2 hours',
        rating: 4.7,
        reviewCount: 88,
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
        location: 'Porvorim'
    },
    {
        id: '27',
        title: 'Mario Miranda Gallery Tour',
        category: 'Art',
        description: 'Celebrate the work of Goa’s most famous cartoonist, Mario Miranda, at his gallery.',
        price: 500,
        duration: '1.5 hours',
        rating: 4.8,
        reviewCount: 112,
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
        location: 'Porvorim'
    },
    {
        id: '28',
        title: 'Devil\'s Canyon Trek',
        category: 'Hidden Places',
        description: 'A challenging trek to the eerie and beautiful rock formations of Devcharacho Kond.',
        price: 1800,
        duration: '5 hours',
        rating: 4.6,
        reviewCount: 40,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
        location: 'Mollem'
    },
    {
        id: '29',
        title: 'Butterfly Conservatory Visit',
        category: 'Nature',
        description: 'Walk through a tropical garden filled with free-flying butterflies of various species.',
        price: 700,
        duration: '2 hours',
        rating: 4.5,
        reviewCount: 130,
        image: 'https://images.unsplash.com/photo-1473210471205-d1ceb2c34273',
        location: 'Ponda'
    },
    {
        id: '30',
        title: 'Goa Chitra Museum Tour',
        category: 'Culture',
        description: 'Explore an ethnographic museum preserving Goa’s traditional agrarian lifestyle and artifacts.',
        price: 1000,
        duration: '3 hours',
        rating: 4.7,
        reviewCount: 92,
        image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3',
        location: 'Benaulim'
    },
    {
        id: '31',
        title: 'Reis Magos Fort & Arts Center',
        category: 'Art',
        description: 'Visit the restored fort which now serves as a cultural and arts center with exhibitions.',
        price: 600,
        duration: '2 hours',
        rating: 4.4,
        reviewCount: 105,
        image: 'https://images.unsplash.com/photo-1599831513783-5ec9650059c3',
        location: 'Verem'
    },
    {
        id: '32',
        title: 'Ancestral Goa (Big Foot)',
        category: 'Culture',
        description: 'Walk through a mock village depicting Goan life from the past, including the Big Foot legend.',
        price: 800,
        duration: '3 hours',
        rating: 4.3,
        reviewCount: 200,
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9',
        location: 'Loutolim'
    },
    {
        id: '33',
        title: 'Cumbarjua Backwater Crocodile Safari',
        category: 'Nature',
        description: 'A boat trip in the backwaters of Cumbarjua to spot Mugger crocodiles in the wild.',
        price: 1500,
        duration: '3 hours',
        rating: 4.5,
        reviewCount: 78,
        image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
        location: 'Cumbarjua'
    },
    {
        id: '34',
        title: 'Three Kings Chapel Mystery Walk',
        category: 'Hidden Places',
        description: 'Visit the haunted Three Kings Chapel and enjoy panoramic views of the coastline.',
        price: 500,
        duration: '1.5 hours',
        rating: 4.6,
        reviewCount: 160,
        image: 'https://images.unsplash.com/photo-1475713409426-ff7ed25ba285',
        location: 'Cansaulim'
    },
    {
        id: '35',
        title: 'Terekhol Fort Heritage Stay & Tour',
        category: 'History',
        description: 'Cross the river to the northernmost tip of Goa to visit the historic Terekhol Fort.',
        price: 1200,
        duration: '4 hours',
        rating: 4.5,
        reviewCount: 55,
        image: 'https://images.unsplash.com/photo-1629215082156-f87fb56e4315',
        location: 'Pernem'
    },
    {
        id: '36',
        title: 'Silent Noise Party Experience',
        category: 'Nightlife',
        description: 'Experience the unique headphone party at Palolem, partying without noise pollution.',
        price: 1000,
        duration: '4 hours',
        rating: 4.7,
        reviewCount: 300,
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        location: 'Palolem'
    }
];

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function syncTours() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        for (const tour of toursData) {
            // 1. Sync Destination
            let destinationId = null;
            if (tour.location) {
                // Check if exists
                const [existingDest] = await connection.execute(
                    'SELECT id FROM destinations WHERE name = ?',
                    [tour.location]
                );

                if (existingDest.length > 0) {
                    destinationId = existingDest[0].id;
                } else {
                    // Create new destination
                    // Try to infer region somewhat or default 'Central'
                    let region = 'Central Goa';
                    if (['North Goa', 'Baga', 'Calangute', 'Anjuna', 'Vagator', 'Arpora', 'Candolim', 'Panaji', 'Old Goa', 'Bicholim', 'Pernem'].includes(tour.location)) region = 'North Goa';
                    if (['South Goa', 'Palolem', 'Agonda', 'Colva', 'Benaulim', 'Margao', 'Canacona', 'Cabo de Rama', 'Cansaulim', 'Loutolim', 'Majorda', 'Salcete', 'Sanguem'].includes(tour.location)) region = 'South Goa';

                    const [result] = await connection.execute(
                        'INSERT INTO destinations (name, region, description, category, created_at) VALUES (?, ?, ?, ?, NOW())',
                        [tour.location, region, `Explore ${tour.location}`, tour.category]
                    );
                    destinationId = result.insertId;
                    console.log(`Created destination: ${tour.location} (ID: ${destinationId})`);
                }
            }

            // 2. Sync Tour
            // Check if tour title exists to avoid duplicate
            const [existingTour] = await connection.execute(
                'SELECT id FROM tours WHERE title = ?',
                [tour.title]
            );

            const durationHours = parseInt(tour.duration) || 0; // naive parsing "8 hours" -> 8

            if (existingTour.length === 0) {
                await connection.execute(
                    `INSERT INTO tours 
                    (title, description, destination_id, category, price, duration_hours, max_participants, rating, review_count, image_url, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                    [
                        tour.title,
                        tour.description,
                        destinationId,
                        tour.category,
                        tour.price,
                        durationHours,
                        15, // Default max participants
                        tour.rating,
                        tour.reviewCount,
                        tour.image
                    ]
                );
                console.log(`Inserted tour: ${tour.title}`);
            } else {
                console.log(`Tour already exists: ${tour.title}`);
                // Optional: Update it?
                // await connection.execute('UPDATE tours SET ... WHERE id = ?', [...])
            }
        }

        console.log('Sync completed.');
        connection.release();
        process.exit(0);

    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
}

syncTours();
