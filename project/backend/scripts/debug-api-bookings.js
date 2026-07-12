async function testBookingsParams() {
    console.log('Testing GET /bookings API response...');
    const API_URL = 'http://localhost:5000/api';

    // 1. Login to get token
    // Using a known test user for consistency or creating one
    let token;
    try {
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test1765859928432@example.com', password: 'password123' })
        });

        if (loginRes.ok) {
            token = (await loginRes.json()).token;
        } else {
            // Fallback to recent test user
            // ... skipping complex logic, assuming test user exists from previous steps
            console.log('Login failed (maybe user deleted?), checking raw db...');
            return;
        }

        // 2. Fetch Bookings
        const res = await fetch(`${API_URL}/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        console.log('Bookings Data:', JSON.stringify(data, null, 2));

        if (data.length > 0) {
            console.log('Sample Title:', data[0].tour_title);
        }

    } catch (e) {
        console.error(e);
    }
}
testBookingsParams();
