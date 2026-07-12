const pool = require('../db');

async function createContactTable() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status ENUM('new', 'read', 'replied') DEFAULT 'new'
      )
    `;

        await connection.execute(createTableQuery);
        console.log('contact_messages table created or already exists.');

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

createContactTable();
