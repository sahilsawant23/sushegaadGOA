const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
    try {
        const apiKey = process.env.RAPIDAPI_KEY;
        console.log("Key:", apiKey ? "Exists" : "Missing");
        const options = {
            method: 'GET',
            url: 'https://api.openwebninja.com/local-business-data/search-local-businesses',
            params: {
                query: 'casinos in Goa',
                limit: 2
            },
            headers: {
                'x-api-key': apiKey
            }
        };
        const response = await axios.request(options);
        console.log(JSON.stringify(response.data).substring(0, 500));
    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}
test();
