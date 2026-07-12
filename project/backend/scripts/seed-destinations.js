
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

const destinations = [
    // --- BEACHES ---
    {
        name: 'Calangute Beach',
        region: 'North Goa',
        description: 'Known as the "Queen of Beaches", Calangute offers water sports, shacks, and a lively atmosphere.',
        category: 'Beach',
        image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Baga Beach',
        region: 'North Goa',
        description: 'Famous for its nightlife, Brittos shack, and water sports like parasailing and jet skiing.',
        category: 'Beach',
        image_url: 'https://images.unsplash.com/photo-1590497678310-9076bc1f939e?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Palolem Beach',
        region: 'South Goa',
        description: 'A scenic, crescent-shaped beach known for its silent noise parties and dolphin spotting trips.',
        category: 'Beach',
        image_url: 'https://images.unsplash.com/photo-1582298533036-654dbf838421?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Anjuna Beach',
        region: 'North Goa',
        description: 'Famous for its trance parties, the Wednesday Flea Market, and rocky shores.',
        category: 'Beach',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Morjim Beach',
        region: 'North Goa',
        description: 'Known as "Little Russia" and a nesting site for Olive Ridley sea turtles.',
        category: 'Beach',
        image_url: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Colva Beach',
        region: 'South Goa',
        description: 'One of the oldest and largest beaches in South Goa with fine white sand.',
        category: 'Beach',
        image_url: 'https://images.unsplash.com/photo-1616194726053-b09e25d4826d?auto=format&fit=crop&q=80&w=1000'
    },

    // --- RESTAURANTS ---
    {
        name: 'Gunpowder',
        region: 'North Goa',
        description: 'Set in a heritage Portuguese home, serving delicious South Indian cuisine with a twist.',
        category: 'Food',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Thalassa',
        region: 'North Goa',
        description: 'Famous Greek taverna overlooking the ocean, known for its sunset views and vibrant atmosphere.',
        category: 'Food',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Martins Corner',
        region: 'South Goa',
        description: 'A legendary spot for authentic Goan seafood and live music, a favorite of locals and celebs.',
        category: 'Food',
        image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Fisherman\'s Wharf',
        region: 'South Goa',
        description: 'Riverside dining offering a perfect blend of Goan hospitality and diverse cuisine.',
        category: 'Food',
        image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Vinayak Family Restaurant',
        region: 'North Goa',
        description: 'A hidden gem famous for its authentic Goan Fish Thali and relaxed vibe.',
        category: 'Food',
        image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1000'
    },

    // --- BARS / NIGHTLIFE ---
    {
        name: 'Tito\'s Lane',
        region: 'North Goa',
        description: 'The heart of Goa\'s nightlife, featuring Club Tito\'s and Café Mambo.',
        category: 'Nightlife', // Mapped to 'Bar' conceptually or new category
        image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'LPK Waterfront',
        region: 'North Goa',
        description: 'Love Passion Karma - a stunning club with unique architecture located by the river.',
        category: 'Nightlife',
        image_url: 'https://images.unsplash.com/photo-1570742138248-c990262b9a78?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'SinQ Night Club',
        region: 'North Goa',
        description: 'An upbeat lounge and nightclub with a poolside deck and contemporary vibe.',
        category: 'Nightlife',
        image_url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=1000'
    },

    // --- TEMPLES / HERITAGE (Grouping under Heritage/Culture) ---
    {
        name: 'Basilica of Bom Jesus',
        region: 'Old Goa',
        description: 'UNESCO World Heritage site containing the mortal remains of St. Francis Xavier.',
        category: 'Heritage',
        image_url: 'https://images.unsplash.com/photo-1596707328659-c292f72bc837?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Shanta Durga Temple',
        region: 'Ponda',
        description: 'A beautiful temple dedicated to Shantadurga, the goddess who mediates between Vishnu and Shiva.',
        category: 'Spiritual',
        image_url: 'https://images.unsplash.com/photo-1627894451037-567475d68800?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Mangeshi Temple',
        region: 'Ponda',
        description: 'One of the largest and most prominent temples in Goa, dedicated to Lord Shiva.',
        category: 'Spiritual',
        image_url: 'https://images.unsplash.com/photo-1582555314731-9543e59535bf?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Se Cathedral',
        region: 'Old Goa',
        description: 'The largest church in Asia, dedicated to Catherine of Alexandria.',
        category: 'Heritage',
        image_url: 'https://images.unsplash.com/photo-1568285517-5e6a3d666d9b?auto=format&fit=crop&q=80&w=1000'
    },

    // --- WATERFALLS / NATURE ---
    {
        name: 'Dudhsagar Waterfalls',
        region: 'South Goa',
        description: 'A majestic four-tiered waterfall located on the Mandovi River, looking like a sea of milk.',
        category: 'Nature',
        image_url: 'https://images.unsplash.com/photo-1541243187289-54316d2ca85d?auto=format&fit=crop&q=80&w=1000'
    },
    {
        name: 'Arvalem Waterfalls',
        region: 'North Goa',
        description: 'A scenic waterfall located near the Pandava Caves, popular for picnics.',
        category: 'Nature',
        image_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=1000'
    }
];

async function seedDestinations() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        for (const place of destinations) {
            // Check availability to avoid duplicates if re-run (names might match partially, using exact match here)
            const [existing] = await conn.execute('SELECT id FROM destinations WHERE name = ?', [place.name]);

            if (existing.length === 0) {
                await conn.execute(
                    'INSERT INTO destinations (name, region, description, category, image_url) VALUES (?, ?, ?, ?, ?)',
                    [place.name, place.region, place.description, place.category, place.image_url]
                );
                console.log(`Added: ${place.name}`);
            } else {
                console.log(`Skipped (Exists): ${place.name}`);
            }
        }

        console.log('Seeding completed.');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

seedDestinations();
