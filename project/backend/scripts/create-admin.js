const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'goa_db',
};

const email = process.argv[2];

if (!email) {
    console.log('Usage: node create-admin.js <email>');
    process.exit(1);
}

async function makeAdmin() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);

        const [rows] = await conn.execute('SELECT id, role FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            console.log(`User with email '${email}' not found.`);
            process.exit(1);
        }

        const user = rows[0];
        if (user.role === 'admin') {
            console.log(`User '${email}' is already an admin.`);
        } else {
            await conn.execute('UPDATE users SET role = "admin" WHERE id = ?', [user.id]);
            console.log(`User '${email}' has been promoted to Admin.`);
        }

    } catch (error) {
        console.error('Failed to update user role:', error);
    } finally {
        if (conn) await conn.end();
    }
}

makeAdmin();
