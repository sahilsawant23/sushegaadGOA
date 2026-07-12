// using global fetch available in Node.js 18+

async function testPasswordUpdate() {
    console.log('Testing /api/admin/profile update...');

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
    console.log('Login successful.');

    // 2. Try to change password (fail case - wrong current pass)
    console.log('Test 1: Wrong current password');
    const failRes = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            email: 'admin@goaexplorer.com',
            password: 'wrongpassword',
            newPassword: 'newadmin123'
        })
    });
    console.log('Status:', failRes.status); // Expect 401
    console.log(await failRes.json());

    // 3. Try to change password (success case - DRY RUN only, don't actually change it to keep it usable for user, OR change and change back)
    // Actually, I'll try to update just the email (keep same) and verify 200 OK.
    // If I change password, I disrupt the user.
    // But the user's issue is SPECIFICALLY about changing password.
    // I will try to change it to 'admin123' (same password)

    console.log('Test 2: Correct current password (setting same password)');
    const successRes = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            email: 'admin@goaexplorer.com',
            password: 'admin123',
            newPassword: 'admin123' // Setting to same to verify flow checks out
        })
    });
    console.log('Status:', successRes.status); // Expect 200
    console.log(await successRes.json());
}

testPasswordUpdate();
