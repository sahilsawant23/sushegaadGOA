// using native fetch

async function testTours() {
    console.log('--- Testing GET /api/tours ---');
    try {
        // Using native fetch if available (Node 18+) or we need to check if axios is installed.
        // Let's assume fetch is available or use http module. simpler to use fetch.
        const response = await fetch('http://localhost:5000/api/tours');
        if (!response.ok) {
            console.error('❌ Request failed:', response.status, response.statusText);
            try {
                const errData = await response.json();
                console.error('Error Details:', JSON.stringify(errData, null, 2));
            } catch (e) {
                console.error('Could not parse error body:', await response.text());
            }
            return;
        }

        const data = await response.json();
        console.log(`✅ Request successful. Received ${Array.isArray(data) ? data.length : 'invalid'} items.`);

        if (Array.isArray(data) && data.length > 0) {
            console.log('First Item Sample:', JSON.stringify(data[0], null, 2));
        } else {
            console.warn('⚠️ No tours found in the database.');
        }

    } catch (error) {
        console.error('❌ Fetch error:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

testTours();
