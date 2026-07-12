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

async function addTicketUrlColumn() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Add ticket_url column
        try {
            await connection.execute(`
                ALTER TABLE events
                ADD COLUMN ticket_url VARCHAR(500) AFTER price;
            `);
            console.log('Added ticket_url column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ticket_url column already exists.');
            } else {
                throw err;
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Error updating schema:', error);
    }
}

addTicketUrlColumn();
