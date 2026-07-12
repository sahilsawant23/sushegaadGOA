const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
};

async function fixAdminRole() {
    let conn;
    try {
        console.log('Connecting to DB...');
        conn = await mysql.createConnection(dbConfig);

        const email = 'admin@goaexplorer.com';
        console.log(`Fixing role for ${email}...`);

        // Check current state
        const [users] = await conn.execute('SELECT id, role FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            console.log('User not found!');
            return;
        }
        console.log('Current state:', users[0]);

        // Force update
        const [result] = await conn.execute("UPDATE users SET role = 'admin' WHERE email = ?", [email]);
        console.log('Update result:', result);

        // Verify
        const [updated] = await conn.execute('SELECT id, role FROM users WHERE email = ?', [email]);
        console.log('New state:', updated[0]);

        if (updated[0].role === 'admin') {
            console.log('SUCCESS: Role is now admin.');
        } else {
            console.log('FAIL: Role is still ' + updated[0].role);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

fixAdminRole();
