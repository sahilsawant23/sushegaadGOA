async function testUserAuth() {
    console.log('Testing User Authentication...');
    const API_URL = 'http://localhost:5000/api';
    const testUser = {
        fullName: 'Test User ' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };

    // 1. Test Registration
    console.log(`\n1. Registering user: ${testUser.email}`);
    try {
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        console.log('Register Status:', regRes.status);
        const regData = await regRes.json();
        console.log('Register Body:', regData);

        if (!regRes.ok) throw new Error('Registration failed');
    } catch (e) {
        console.error('Registration Error:', e.message);
        return;
    }

    // 2. Test Login
    console.log(`\n2. Logging in user: ${testUser.email}`);
    try {
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });

        console.log('Login Status:', loginRes.status);
        const loginData = await loginRes.json();
        console.log('Login Body:', loginData);

        if (!loginRes.ok) throw new Error('Login failed');
        console.log('SUCCESS: User auth flow verified.');
    } catch (e) {
        console.error('Login Error:', e.message);
    }
}

testUserAuth();
