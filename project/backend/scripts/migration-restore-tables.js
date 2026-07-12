const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
    multipleStatements: true
};

async function migrate() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Restoring tables...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS destinations (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              region VARCHAR(100),
              description TEXT,
              category VARCHAR(100),
              latitude DECIMAL(10, 8),
              longitude DECIMAL(11, 8),
              image_url VARCHAR(500),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS tours (
              id INT AUTO_INCREMENT PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              description TEXT,
              destination_id INT,
              category VARCHAR(100),
              price DECIMAL(10, 2) NOT NULL,
              duration_hours INT,
              max_participants INT,
              rating DECIMAL(3, 2) DEFAULT 0,
              review_count INT DEFAULT 0,
              image_url VARCHAR(500),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (destination_id) REFERENCES destinations(id)
            );

            CREATE TABLE IF NOT EXISTS guides (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              contact VARCHAR(255),
              specialty VARCHAR(255),
              status VARCHAR(50) DEFAULT 'available',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Add booking/review tables if needed, but error was about destinations
        `);
        console.log('Tables restored.');

        // Seed destinations if empty
        const [dRows] = await conn.execute('SELECT count(*) as count FROM destinations');
        if (dRows[0].count === 0) {
            console.log('Seeding initial destination...');
            await conn.execute(`INSERT INTO destinations (name, region, category) VALUES ('Calangute Beach', 'North Goa', 'Beach')`);
        }

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

migrate();
