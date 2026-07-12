const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function createEventsTable() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                start_date DATETIME NOT NULL,
                end_date DATETIME,
                location VARCHAR(255),
                image_url VARCHAR(500),
                category VARCHAR(100),
                price VARCHAR(100),
                source VARCHAR(50) DEFAULT 'manual', -- 'manual' or 'ticketmaster'
                external_id VARCHAR(255), -- ID from Ticketmaster
                status VARCHAR(50) DEFAULT 'published',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_external (source, external_id)
            );
        `;

        await connection.execute(createTableQuery);
        console.log('Events table created successfully.');

        await connection.end();
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

createEventsTable();
