const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function createContactTable() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'goa_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log('Connected to database.');

        await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('Contact messages table created successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

createContactTable();
