const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
};

async function checkUser() {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT id, email, role, LENGTH(role) as role_len FROM users WHERE email = ?', ['admin@goaexplorer.com']);
        console.log('User found:', rows);

        // Also check all users
        const [all] = await conn.execute('SELECT id, email, role FROM users');
        console.log('All users:', all);

        await conn.end();
    } catch (e) {
        console.error(e);
    }
}

checkUser();
