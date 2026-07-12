require('dotenv').config({ path: '.env' });
const axios = require('axios');

async function testRapidAPI() {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        console.error('❌ RAPIDAPI_KEY is missing in .env');
        return;
    }

    console.log('🔑 Using API Key:', apiKey.substring(0, 5) + '...');

    // We know x-api-key works. Now finding the search endpoint.
    const base = 'https://api.openwebninja.com/realtime-events-data';
    const endpoints = [
        '/search',
        '/search-events',
        '/events',
        '/get-events',
        '/'
    ];

    for (const ep of endpoints) {
        const testUrl = base + ep;
        console.log(`\n🧪 Testing Endpoint: ${ep}...`);
        try {
            const response = await axios.get(testUrl, {
                params: {
                    query: 'Events in Goa', // Standard param
                    date: 'any'
                },
                headers: { 'x-api-key': apiKey },
                validateStatus: () => true
            });

            console.log(`   Status: ${response.status}`);
            if (response.status === 200) {
                console.log('   ✅ SUCCESS!');
                console.log('   Preview:', JSON.stringify(response.data).substring(0, 100));
                return;
            } else {
                // Log message to see if it says "Endpoint not found" vs "Missing params"
                console.log('   ❌ Failed:', JSON.stringify(response.data).substring(0, 100));
            }
        } catch (err) {
            console.log('   ❌ Network Error:', err.message);
        }
    }


}

testRapidAPI();
