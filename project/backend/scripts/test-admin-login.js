// using global fetch

async function testLogin(role, email, password) {
    console.log(`Testing ${role} login with ${email}...`);
    try {
        const res = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const status = res.status;
        const data = await res.json();
        console.log(`Status: ${status}`);
        console.log(`Response:`, data);

        if (role === 'admin' && status === 200) console.log('PASS: Admin logged in successfully.');
        else if (role === 'user' && status === 403) console.log('PASS: User rejected as expected.');
        else console.log('FAIL: Unexpected ' + status);
        console.log('---');
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

async function run() {
    // 1. Admin Login (Should pass)
    await testLogin('admin', 'admin@goaexplorer.com', 'admin123');

    // 2. User Login (Should fail with 403 if it hits admin endpoint)
    // Need a user. 'john@example.com' 'password123' is typical seed. Or I can use 'test@example.com'
    // Let's assume one exists or create one if needed, but I'll try generic.
    // Actually, I'll use the user I logged in with before?
    // I'll quickly register a temp user to be sure.

    // Register temp user
    await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'normaluser@test.com', password: 'user123', fullName: 'Normal User' })
    }).catch(() => { });

    await testLogin('user', 'normaluser@test.com', 'user123');
}

run();
