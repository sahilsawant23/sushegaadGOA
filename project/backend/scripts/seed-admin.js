const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
};
console.log('Seed config:', { ...dbConfig, password: dbConfig.password ? '******' : '(empty)' });

async function seedAdmin() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const email = 'admin@goaexplorer.com';
        const password = 'admin123'; // Simple for demo
        const hashedPassword = await bcrypt.hash(password, 10);

        const [existing] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length === 0) {
            await conn.execute(
                'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                ['Super Admin', email, hashedPassword, 'admin']
            );
            console.log('Admin user created.');
            console.log('Admin user found. Verifying role...');
            if (existing[0].role !== 'admin') {
                console.log(`User has role '${existing[0].role}'. Force updating to 'admin' and resetting password...`);
                await conn.execute(
                    'UPDATE users SET role = ?, password_hash = ? WHERE id = ?',
                    ['admin', hashedPassword, existing[0].id]
                );
                console.log('Admin role updated.');
            } else {
                console.log('Admin role is correct. Updating password to ensure access...');
                await conn.execute(
                    'UPDATE users SET password_hash = ? WHERE id = ?',
                    [hashedPassword, existing[0].id]
                );
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

seedAdmin();
