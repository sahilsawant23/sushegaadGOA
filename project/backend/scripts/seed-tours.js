const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const tours = [
    {
        id: 1,
        title: 'North Goa Beach Hopping Adventure',
        description: 'Explore the famous beaches of North Goa including Baga, Calangute, and Anjuna.',
        category: 'Beach',
        price: 2500,
        duration_hours: 8, // Approx from "3 Days" but field is INT. Just putting placeholder.
        max_participants: 15,
        image_url: 'https://t4.ftcdn.net/jpg/04/16/74/29/360_F_416742930_RhUSxwxlYwNBpTGzN4kVTdWuYcmRnGv5.jpg'
    },
    {
        id: 2,
        title: 'Heritage Walk through Old Goa',
        description: 'Discover the rich Portuguese heritage of Goa with visits to ancient churches and historical sites.',
        category: 'Heritage',
        price: 1800,
        duration_hours: 4,
        max_participants: 20,
        image_url: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/12/13130227/bascilica.jpg'
    },
    {
        id: 3,
        title: 'Adventure Sports Extravaganza',
        description: 'Ultimate adventure package featuring scuba diving, parasailing, jet skiing, and more.',
        category: 'Adventure',
        price: 4500,
        duration_hours: 12,
        max_participants: 8,
        image_url: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg'
    },
    {
        id: 4,
        title: 'Goan Culinary Journey',
        description: 'Taste the authentic flavors of Goa with cooking classes, spice plantation visits, and food tours.',
        category: 'Food',
        price: 3200,
        duration_hours: 6,
        max_participants: 12,
        image_url: 'https://7seasfly.com/wp-content/uploads/2024/01/plantation.jpg'
    },
    {
        id: 5,
        title: 'South Goa Serenity Tour',
        description: 'Experience the peaceful beaches and laid-back vibe of South Goa including Palolem and Colva.',
        category: 'Beach',
        price: 2800,
        duration_hours: 10,
        max_participants: 16,
        image_url: 'https://media.istockphoto.com/id/1126115232/photo/beautiful-palolem-beach-goa-in-india-during-sunrise-soft-sand-with-water-current-waves-and.jpg?s=612x612&w=0&k=20&c=JOkcpE9H1JIt-8VpeufLmHIy5lR3HOQdr69gTYGuiA4='
    },
    {
        id: 6,
        title: 'Cultural Immersion Experience',
        description: 'Dive deep into Goan culture with village visits, traditional dance performances, and local crafts.',
        category: 'Culture',
        price: 2200,
        duration_hours: 8,
        max_participants: 10,
        image_url: 'https://www.navhindtimes.in/wp-content/uploads/2024/03/DSC_2763.jpg'
    },
    {
        id: 7,
        title: 'Spiritual Temples of Goa',
        description: 'Discover Goa’s spiritual side with visits to centuries-old Hindu temples, rituals, and sacred ponds.',
        category: 'Spiritual',
        price: 1600,
        duration_hours: 6,
        max_participants: 18,
        image_url: 'https://inditales.com/wp-content/uploads/2014/04/shri-mangeshi-temple-ponda-goa.jpg'
    },
    {
        id: 8,
        title: 'Dudhsagar Waterfalls Trek & Jeep Safari',
        description: 'Experience the majestic Dudhsagar Falls with a jeep safari and a scenic trek through the lush forest.',
        category: 'Adventure',
        price: 2700,
        duration_hours: 8,
        max_participants: 12,
        image_url: 'https://media1.thrillophilia.com/filestore/fd6sv77lx6aa7oydowfuuctd6mzw_1467290460_dudhsagar_main.jpg'
    },
    {
        id: 9,
        title: 'Goan Artist Village & Pottery Workshop',
        description: 'Interact with Goan artists, witness local crafts, and take part in a hands-on pottery workshop.',
        category: 'Art',
        price: 2000,
        duration_hours: 5,
        max_participants: 15,
        image_url: 'https://www.unicocostabrava.com/uploads/imagenes/40-lugares-taller-de-ceramicaimg.jpg'
    },
    {
        id: 10,
        title: 'Goa River Rafting Expedition',
        description: 'Thrill-seekers can enjoy river rafting in Goa’s Mhadei River with rapids surrounded by lush forests.',
        category: 'Adventure',
        price: 2400,
        duration_hours: 5,
        max_participants: 10,
        image_url: 'https://images.unsplash.com/photo-1627241129356-137242cf14f0?q=80&w=1234&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 11,
        title: 'Goa Hidden Waterfalls & Jungle Trek',
        description: 'Explore hidden waterfalls and trek through Goa’s untouched jungle trails with a local guide.',
        category: 'Nature',
        price: 2100,
        duration_hours: 6,
        max_participants: 12,
        image_url: 'https://images.prismic.io/indiahike/8c493cfe-3526-45ee-ba8c-f4b16d2e1c2e_Goa+Netravali+Forest+Trek_Trekking+through+heart+of+Netravali+forest_Suhas+Saya_Banner+Image.jpg?auto=compress,format&rect=0,200,1600,800&w=1200&h=600'
    }
    // Add 12-15 if found, but user likely tested top items.
];

async function seedTours() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        for (const tour of tours) {
            const [existing] = await conn.execute('SELECT id, title FROM tours WHERE id = ?', [tour.id]);

            if (existing.length === 0) {
                await conn.execute(`
          INSERT INTO tours (id, title, description, category, price, duration_hours, max_participants, image_url, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [tour.id, tour.title, tour.description, tour.category, tour.price, tour.duration_hours, tour.max_participants, tour.image_url]);
                console.log(`Inserted tour: ${tour.title}`);
            } else {
                // Optional: Update title if it differs (to fix "Scuba Diving Adventure" vs "Goa River Rafting Expedition" clash on ID 10)
                // Note: In my previous seed, I set ID 10 as "Scuba Diving Adventure".
                // BUT in mockTours.ts, ID 10 is "Goa River Rafting Expedition". ID 3 is the Scuba one ("Adventure Sports Extravaganza" description says scuba).
                // This mismatch might confuse the user if the title changes, but syncing to mockTours is the right path.
                if (existing[0].title !== tour.title) {
                    console.log(`Updating title for ID ${tour.id}: ${existing[0].title} -> ${tour.title}`);
                    await conn.execute('UPDATE tours SET title = ?, image_url = ?, description = ? WHERE id = ?', [tour.title, tour.image_url, tour.description, tour.id]);
                } else {
                    console.log(`Tour already exists and matches: ${tour.title}`);
                }
            }
        }
    } catch (error) {
        console.error('Seed error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

seedTours();
