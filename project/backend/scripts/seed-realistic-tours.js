const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

const toursToSeed = [
    {
        title: "Dudhsagar Waterfalls Trek",
        description: "A majestic four-tiered waterfall located on the Mandovi River. Includes a jeep safari through the Mollem National Park and a refreshing swim.",
        category: "Nature",
        duration_hours: 8,
        price: 1800,
        destination_name: "Dudhsagar",
        image_url: "https://images.unsplash.com/photo-1544252899-72c219602a95?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Old Goa Heritage Walk",
        description: "Explore the UNESCO World Heritage sites of Old Goa, including the Basilica of Bom Jesus and Se Cathedral. Dive into the Portuguese history of Goa.",
        category: "Cultural",
        duration_hours: 4,
        price: 800,
        destination_name: "Old Goa",
        image_url: "https://images.unsplash.com/photo-1590391696245-5606d04fc4e4?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Spice Plantation Tour",
        description: "A sensory journey through Goa's famous spice farms. Learn about various spices, enjoy a traditional Goan buffet, and see an elephant bath.",
        category: "Nature",
        duration_hours: 5,
        price: 1200,
        destination_name: "Ponda",
        image_url: "https://images.unsplash.com/photo-1596541223841-450f75e39626?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Grand Island Scuba Diving",
        description: "Experience the underwater world of Goa. Includes boat ride, training, diving equipment, underwater photos, and snacks.",
        category: "Adventure",
        duration_hours: 7,
        price: 3500,
        destination_name: "Grand Island",
        image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1000"
    }
];

async function seedTours() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        for (const tour of toursToSeed) {
            // 1. Check or Create Destination
            let destId;
            const [dests] = await conn.execute('SELECT id FROM destinations WHERE name = ?', [tour.destination_name]);
            if (dests.length > 0) {
                destId = dests[0].id;
            } else {
                console.log(`Creating destination: ${tour.destination_name}`);
                const [dRes] = await conn.execute(
                    'INSERT INTO destinations (name, description, category, region, image_url) VALUES (?, ?, ?, ?, ?)',
                    [tour.destination_name, `Beautiful ${tour.destination_name} in Goa`, 'General', 'North Goa', tour.image_url]
                );
                destId = dRes.insertId;
            }

            // 2. Check or Create Tour
            const [existingTours] = await conn.execute('SELECT id FROM tours WHERE title = ?', [tour.title]);
            if (existingTours.length === 0) {
                console.log(`Creating tour: ${tour.title}`);
                await conn.execute(
                    `INSERT INTO tours (title, description, category, duration_hours, price, destination_id, image_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [tour.title, tour.description, tour.category, tour.duration_hours, tour.price, destId, tour.image_url]
                );
            } else {
                console.log(`Tour already exists: ${tour.title}`);
                // Optional: Update description if needed
                await conn.execute('UPDATE tours SET description = ?, image_url = ? WHERE id = ?',
                    [tour.description, tour.image_url, existingTours[0].id]);
            }
        }

        console.log('Seeding complete.');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

seedTours();
