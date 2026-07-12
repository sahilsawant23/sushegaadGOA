const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

const allTours = [
    {
        title: 'North Goa Beach Hopping Adventure',
        description: 'Explore the famous beaches of North Goa including Baga, Calangute, and Anjuna with water sports and beach shacks.',
        price: 2500,
        duration_hours: 8,
        category: "Beach",
        destination_name: "North Goa",
        image_url: 'https://t4.ftcdn.net/jpg/04/16/74/29/360_F_416742930_RhUSxwxlYwNBpTGzN4kVTdWuYcmRnGv5.jpg'
    },
    {
        title: 'Heritage Walk through Old Goa',
        description: 'Discover the rich Portuguese heritage of Goa with visits to ancient churches and historical sites.',
        price: 1800,
        duration_hours: 4,
        category: 'Heritage',
        destination_name: 'Old Goa',
        image_url: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/12/13130227/bascilica.jpg'
    },
    {
        title: 'Adventure Sports Extravaganza',
        description: 'Ultimate adventure package featuring scuba diving, parasailing, jet skiing, and more.',
        price: 4500,
        duration_hours: 6,
        category: 'Adventure',
        destination_name: 'Grande Island',
        image_url: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg'
    },
    {
        title: 'Goan Culinary Journey',
        description: 'Taste the authentic flavors of Goa with cooking classes, spice plantation visits, and food tours.',
        price: 3200,
        duration_hours: 5,
        category: 'Food',
        destination_name: 'Ponda',
        image_url: 'https://7seasfly.com/wp-content/uploads/2024/01/plantation.jpg'
    },
    {
        title: 'South Goa Serenity Tour',
        description: 'Experience the peaceful beaches and laid-back vibe of South Goa including Palolem and Colva.',
        price: 2800,
        duration_hours: 8,
        category: 'Beach',
        destination_name: 'South Goa',
        image_url: 'https://media.istockphoto.com/id/1126115232/photo/beautiful-palolem-beach-goa-in-india-during-sunrise-soft-sand-with-water-current-waves-and.jpg?s=612x612&w=0&k=20&c=JOkcpE9H1JIt-8VpeufLmHIy5lR3HOQdr69gTYGuiA4='
    },
    {
        title: 'Spiritual Temples of Goa',
        description: 'Discover Goa’s spiritual side with visits to centuries-old Hindu temples, rituals, and sacred ponds.',
        price: 1600,
        duration_hours: 4,
        category: 'Spiritual',
        destination_name: 'Ponda',
        image_url: 'https://inditales.com/wp-content/uploads/2014/04/shri-mangeshi-temple-ponda-goa.jpg'
    },
    {
        title: 'Dudhsagar Waterfalls Trek & Jeep Safari',
        description: 'Experience the majestic Dudhsagar Falls with a jeep safari and a scenic trek through the lush forest.',
        price: 2700,
        duration_hours: 7,
        category: 'Adventure',
        destination_name: 'Mollem National Park',
        image_url: 'https://media1.thrillophilia.com/filestore/fd6sv77lx6aa7oydowfuuctd6mzw_1467290460_dudhsagar_main.jpg'
    },
    {
        title: 'Goan Artist Village & Pottery Workshop',
        description: 'Interact with Goan artists, witness local crafts, and take part in a hands-on pottery workshop.',
        price: 2000,
        duration_hours: 4,
        category: 'Art',
        destination_name: 'Bicholim',
        image_url: 'https://www.unicocostabrava.com/uploads/imagenes/40-lugares-taller-de-ceramicaimg.jpg'
    },
    {
        title: 'Goa River Rafting Expedition',
        description: 'Thrill-seekers can enjoy river rafting in Goa’s Mhadei River with rapids surrounded by lush forests.',
        price: 2400,
        duration_hours: 5,
        category: 'Adventure',
        destination_name: 'Mhadei River',
        image_url: 'https://images.unsplash.com/photo-1627241129356-137242cf14f0?q=80&w=1234&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        title: 'Goa Hidden Waterfalls & Jungle Trek',
        description: 'Explore hidden waterfalls and trek through Goa’s untouched jungle trails with a local guide.',
        price: 2100,
        duration_hours: 6,
        category: 'Nature',
        destination_name: 'Netravali',
        image_url: 'https://images.prismic.io/indiahike/8c493cfe-3526-45ee-ba8c-f4b16d2e1c2e_Goa+Netravali+Forest+Trek_Trekking+through+heart+of+Netravali+forest_Suhas+Saya_Banner+Image.jpg?auto=compress,format&rect=0,200,1600,800&w=1200&h=600'
    },
    {
        title: 'Cultural Immersion Experience',
        description: 'Dive deep into Goan culture with village visits, traditional dance performances, and local crafts.',
        price: 2200,
        duration_hours: 6,
        category: 'Culture',
        destination_name: 'Central Goa',
        image_url: 'https://www.navhindtimes.in/wp-content/uploads/2024/03/DSC_2763.jpg'
    },
    {
        title: 'Goa Nightlife & Club Crawl',
        description: 'Experience Goa’s famous nightlife with beach clubs, live music, and night markets.',
        price: 2200,
        duration_hours: 5,
        category: 'Culture',
        destination_name: 'Baga',
        image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNsdWIlMjBwYXJ0eXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        title: 'Ayurvedic Wellness Retreat',
        description: 'Relax and rejuvenate with Ayurveda therapies and yoga on serene Goan beaches.',
        price: 4800,
        duration_hours: 8,
        category: 'Wellness',
        destination_name: 'South Goa',
        image_url: 'https://bookretreats.com/cdn-cgi/image/width=1200,quality=65,f=auto,sharpen=1,fit=cover,gravity=auto/assets/photo/retreat/0m/22k/22147/p_640741/1000_1634449746.jpg'
    },
    {
        title: 'Goa Eco Village Experience',
        description: 'Stay in an eco-village, farm with locals, and learn about sustainability.',
        price: 2000,
        duration_hours: 8,
        category: 'Culture',
        destination_name: 'North Goa',
        image_url: 'https://www.agoda.com/wp-content/uploads/2024/06/8-Tambdi-Surla-Waterfall-Trek-Trekking-in-Goa.jpg'
    },
    {
        title: 'Goa Wildlife Safari',
        description: 'Encounter wildlife and birdwatching in Goa’s national parks.',
        price: 2600,
        duration_hours: 5,
        category: 'Nature',
        destination_name: 'Bondla Wildlife Sanctuary',
        image_url: 'https://triplina.com/wp-content/uploads/2022/11/Dudhsagar-Waterfall-Goa3-scaled.jpg'
    }
];

async function seedAllTours() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);
        console.log(`Seeding top ${allTours.length} tours from website mock data...`);

        for (const tour of allTours) {
            // 1. Check/Create Destination
            let destId;
            const [dests] = await conn.execute('SELECT id FROM destinations WHERE name = ?', [tour.destination_name]);
            if (dests.length > 0) {
                destId = dests[0].id;
            } else {
                console.log(`Creating destination: ${tour.destination_name}`);
                const [dRes] = await conn.execute(
                    'INSERT INTO destinations (name, description, category, region, image_url) VALUES (?, ?, ?, ?, ?)',
                    [tour.destination_name, `Beautiful location in Goa`, 'General', 'Goa', tour.image_url]
                );
                destId = dRes.insertId;
            }

            // 2. Check/Create Tour
            const [existing] = await conn.execute('SELECT id FROM tours WHERE title = ?', [tour.title]);
            if (existing.length === 0) {
                console.log(`Creating tour: ${tour.title}`);
                await conn.execute(
                    `INSERT INTO tours (title, description, category, duration_hours, price, destination_id, image_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [tour.title, tour.description, tour.category, tour.duration_hours, tour.price, destId, tour.image_url]
                );
            } else {
                console.log(`Updating existing tour: ${tour.title}`);
                await conn.execute(
                    'UPDATE tours SET description = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
                    [tour.description, tour.price, tour.category, tour.image_url, existing[0].id]
                );
            }
        }
        console.log('Sync complete.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

seedAllTours();
