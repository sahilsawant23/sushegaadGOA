async function testBooking() {
    console.log('Testing Booking Creation...');
    const API_URL = 'http://localhost:5000/api';

    // 1. Login to get token
    const loginRes = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test1765859928432@example.com', password: 'password123' })
    });
    // Note: using the user created in previous step if possible, or create new one if needed.
    // Ideally script should be self-contained but hardcoding for speed if user exists.

    let token;
    if (loginRes.ok) {
        const data = await loginRes.json();
        token = data.token;
        console.log('Logged in.');
    } else {
        // Create temp user
        console.log('Creating temp user...');
        const email = `temp${Date.now()}@test.com`;
        await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName: 'Temp User', email, password: 'password123' })
        });
        const lRes = await fetch(`${API_URL}/login`, {
            method: 'POST', body: JSON.stringify({ email, password: 'password123' }), headers: { 'Content-Type': 'application/json' }
        });
        token = (await lRes.json()).token;
    }

    // 2. Create Booking
    const bookingData = {
        tourId: 1, // Assume tour ID 1 exists
        bookingDate: '2025-01-01',
        totalPrice: 100,
        guests: 2
    };

    console.log('Creating booking...');
    const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
    });

    console.log('Status:', res.status);
    console.log(await res.json());
}

testBooking();
