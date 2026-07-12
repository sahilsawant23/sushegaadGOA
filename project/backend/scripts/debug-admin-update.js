// using global fetch
async function run() {
    try {
        console.log('Debugging Admin Update...');

        // 1. Login
        const loginRes = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@goaexplorer.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            console.error('Login Failed:', loginData);
            return;
        }

        console.log('Login Success. Token acquired.');
        const token = loginData.token;

        // 2. Normal Update (No Change)
        const updateRes = await fetch('http://localhost:5000/api/admin/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ email: 'admin@goaexplorer.com', password: 'admin123', newPassword: '' })
        });
        console.log('Normal Update Status:', updateRes.status); // 200

        // 3. Wrong Password (should be 200 if no email change/newPass)
        const wrongRes = await fetch('http://localhost:5000/api/admin/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ email: 'admin@goaexplorer.com', password: 'WRONG', newPassword: '' })
        });
        console.log('Wrong Pass (No Change) Status:', wrongRes.status);

        // 4. Duplicate Email
        // Register duplicate first
        await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'dup@test.com', password: 'pass', fullName: 'Dup' })
        }).catch(() => { });

        console.log('Testing Duplicate Email...');
        const dupRes = await fetch('http://localhost:5000/api/admin/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ email: 'dup@test.com', password: 'admin123', newPassword: '' })
        });
        const dupData = await dupRes.json();
        console.log('Dup Email Status:', dupRes.status);
        if (dupRes.status === 500) {
            console.log('CRASH MSG:', dupData.message);
        }

    } catch (e) {
        console.error('Script Error:', e);
    }
}

run();
