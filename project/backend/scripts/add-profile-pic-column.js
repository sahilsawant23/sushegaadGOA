const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

async function addProfilePicColumn() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'goa_db'
    });

    try {
        console.log('Connected to database.');

        // Check if column exists
        const [columns] = await connection.execute(
            "SHOW COLUMNS FROM users LIKE 'profile_picture'"
        );

        if (columns.length === 0) {
            console.log('Adding profile_picture column...');
            await connection.execute(
                "ALTER TABLE users ADD COLUMN profile_picture VARCHAR(500)"
            );
            console.log('Column added successfully.');
        } else {
            console.log('Column profile_picture already exists.');
        }

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await connection.end();
    }
}

addProfilePicColumn();
