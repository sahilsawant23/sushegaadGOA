async function testAddTour() {
    console.log('Testing /api/admin/tours creation...');

    // 1. Login
    const loginRes = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@goaexplorer.com', password: 'admin123' })
    });

    if (!loginRes.ok) {
        console.log('Login failed: ' + loginRes.status);
        return;
    }

    const { token } = await loginRes.json();

    // 2. Get Destinations (need a valid ID)
    const destRes = await fetch('http://localhost:5000/api/destinations');
    const destinations = await destRes.json();
    if (destinations.length === 0) {
        console.log('No destinations found to link tour to.');
        // Create one if needed? For now assume seeds exist.
        return;
    }
    const destId = destinations[0].id;
    console.log('Using Destination ID:', destId);

    // 3. Create Tour
    const tourData = {
        title: 'Debug Tour ' + Date.now(),
        description: 'Created via debug script',
        destinationId: destId,
        category: 'Adventure',
        price: 9999,
        duration: 5,
        maxParticipants: 10,
        imageUrl: 'https://example.com/image.jpg'
    };

    const createRes = await fetch('http://localhost:5000/api/admin/tours', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tourData)
    });

    console.log('Create Tour Status:', createRes.status);
    console.log(await createRes.json());
}

testAddTour();
