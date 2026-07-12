const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

const sampleEvents = [
    {
        title: 'Sunburn Goa 2026',
        description: 'Get ready for the ultimate electronic dance music experience! Sunburn Goa 2026 is back bigger and louder at the iconic Vagator Beach. Spanning three electrifying days, this festival brings together the world’s top DJs, state-of-the-art stage mesmerizing visuals, and pulsating beats that will keep you dancing until dawn.\n\nBeyond the music, explore a vibrant flea market, adventure zones, and curated food stalls offering global cuisines. Whether you are a dedicated EDM fan or just looking for the party of a lifetime, Sunburn offers an atmosphere charged with energy, love, and unity. Don’t miss out on Asia’s premiere music festival experience!',
        start_date: new Date(Date.now() + 86400000 * 10).toISOString().slice(0, 19).replace('T', ' '), // 10 days from now
        location: 'Vagator Beach, North Goa',
        category: 'Music',
        price: '₹4,500 onwards',
        mood: 'Electric & High Energy ⚡',
        highlights: '["World Top 100 DJs", "Laser Shows", "Beach Stages", "After Parties"]',
        image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
        gallery_images: '["https://images.unsplash.com/photo-1470225620780-dba8ba36b745", "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9", "https://images.unsplash.com/photo-1514525253440-b393452e8d26", "https://images.unsplash.com/photo-1545128485-c400e7702796"]',
        ticket_url: 'https://in.bookmyshow.com/sunburn'
    },
    {
        title: 'Goa Carnival 2026',
        description: 'Experience the colorful heritage of Goa at the annual Goa Carnival! This four-day extravaganza precedes Lent and is a time of feasting, dancing, and merrymaking. The streets of Panjim, Margao, Vasco, and Mapusa come alive with grand parades featuring spectacular floats, masked dancers, and live bands performing traditional folk music.\n\nLed by the legendary King Momo, who declares the decree of "Eat, Drink and Be Merry," the Carnival is a true reflection of Goa’s colonial history and vibrant local culture. Join the locals in the famous "Red and Black" dance, indulge in authentic Goan delicacies, and witness the joyful spirit that defines this coastal paradise.',
        start_date: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 19).replace('T', ' '), // 5 days from now
        location: 'Panjim & Margao',
        category: 'Cultural',
        price: 'Free',
        mood: 'Colorful & Joyful 🎭',
        highlights: '["Grand Parade", "Costume Contest", "Live Bands", "Street Food"]',
        image_url: 'https://images.unsplash.com/photo-1560965306-69d95f87b32d?w=800&q=80',
        gallery_images: '["https://images.unsplash.com/photo-1560965306-69d95f87b32d", "https://images.unsplash.com/photo-1517457373958-b7bdd4587205", "https://images.unsplash.com/photo-1629814272111-92b02a9b3a98", "https://images.unsplash.com/photo-1514222709107-a180c68d72b4"]',
    },
    {
        title: 'Saturday Night Market',
        description: 'The Saturday Night Market in Arpora is not just a shopping destination; it’s a cultural phenomenon. As the sun sets, this sprawling open-air market lights up with hundreds of stalls offering everything from handmade jewelry, gypsy fashion, and spices to vintage artifacts and home decor.\n\nThe vibe is set by live concerts on the central stage, featuring bands from around the world. Grab a cocktail from one of the many bars, sample mouth-watering street food from global cuisines, and soak in the bohemian atmosphere. It’s the perfect place to spend a Saturday evening with friends, shopping, eating, and grooving under the stars.',
        start_date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 19).replace('T', ' '), // 3 days from now
        location: 'Arpora, North Goa',
        category: 'Nightlife',
        price: 'Free Entry',
        mood: 'Bohemian & Chill 🌙',
        highlights: '["Live Reggae Music", "Global Street Food", "Handmade Crafts", "Cocktail Bars"]',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        gallery_images: '["https://images.unsplash.com/photo-1555939594-58d7cb561ad1", "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", "https://images.unsplash.com/photo-1626084226065-950c44161f03", "https://images.unsplash.com/photo-1511516412963-801b050c92aa"]',
    },
    {
        title: 'Goa Food & Wine Festival',
        description: 'Calling all foodies and wine connoisseurs! The Goa Food & Wine Festival is a celebration of the region’s rich culinary landscape. Held at the scenic Miramar Beach, this event features pop-up stalls from Goa’s top restaurants, showcasing fresh seafood, traditional vindaloos, and modern fusion dishes.\n\nPair your meal with a selection of fine domestic and international wines, or try the local heritage spirit, Feni. With cooking demonstrations by celebrity chefs, grape stomping events, and live jazz music playing in the background, it’s a sophisticated yet relaxed weekend of gastronomic delight.',
        start_date: new Date(Date.now() + 86400000 * 20).toISOString().slice(0, 19).replace('T', ' '),
        location: 'Miramar Beach',
        category: 'Food',
        price: '₹500 Entry',
        mood: 'Sophisticated & Delicious 🍷',
        highlights: '["Wine Tasting", "Cooking Demos", "Seafood BBQ", "Live Jazz"]',
        image_url: 'https://images.unsplash.com/photo-1516954973981-1b9195a14d59?w=800&q=80',
        gallery_images: '["https://images.unsplash.com/photo-1516954973981-1b9195a14d59", "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327", "https://images.unsplash.com/photo-1559339352-11d035aa65de", "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb"]',
        ticket_url: 'https://insider.in/goa-food-wine'
    }
];

async function seedEvents() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // DELETE old manual data to ensure no duplicates and fresh descriptions
        await connection.execute("DELETE FROM events WHERE source = 'manual'");

        for (const event of sampleEvents) {
            await connection.execute(
                `INSERT INTO events (title, description, start_date, location, image_url, gallery_images, category, price, ticket_url, mood, highlights, source, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual', 'published')`,
                [event.title, event.description, event.start_date, event.location, event.image_url, event.gallery_images || '[]', event.category, event.price, event.ticket_url || '', event.mood, event.highlights]
            );
            console.log(`Seeded: ${event.title}`);
        }

        console.log('Sample events seeded successfully!');
        await connection.end();
    } catch (error) {
        console.error('Error seeding events:', error);
    }
}

seedEvents();
