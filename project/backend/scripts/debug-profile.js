// using global fetch available in Node.js 18+

async function testProfileFetch() {
    console.log('Testing /api/profile fetch...');

    // 1. Login
    const loginRes = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@goaexplorer.com', password: 'admin123' })
    });

    if (!loginRes.ok) {
        console.log('Login failed: ' + loginRes.status);
        console.log(await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. Token:', token.substring(0, 20) + '...');

    // 2. Fetch Profile
    const profileRes = await fetch('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Profile Status:', profileRes.status);
    const profileText = await profileRes.text();
    console.log('Profile Response:', profileText);
}

testProfileFetch();
