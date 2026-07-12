const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function migrate() {
    console.log('Starting Government Demo Phase 2 Migration...');
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // 1. Update Users Table Role Enum
        // Note: modify column with enum is tricky in MySQL if data exists, but we are just appending.
        try {
            // Check if 'guide' is already in enum (simple check: try to insert, if fails... no, let's just ALTER)
            // ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'guide') DEFAULT 'user';
            console.log('Updating users role ENUM...');
            await conn.query("ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'guide') DEFAULT 'user'");
            console.log('Users role ENUM updated.');
        } catch (e) {
            console.log('Table users might already have guide role or error:', e.message);
        }

        // 2. Add user_id to guides table
        try {
            console.log('Adding user_id to guides table...');
            // Check if column exists first? Or just try ADD COLUMN and catch "Duplicate column"
            await conn.query("ALTER TABLE guides ADD COLUMN user_id INT");
            await conn.query("ALTER TABLE guides ADD CONSTRAINT fk_guides_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL");
            console.log('user_id added to guides.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Column user_id already exists in guides.');
            } else {
                console.error('Error adding user_id:', e.message);
            }
        }

        // 3. Create guide_documents table
        console.log('Creating guide_documents table...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS guide_documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                guide_id INT NOT NULL,
                document_type VARCHAR(50) NOT NULL COMMENT 'aadhar, license, police_clearance',
                file_url VARCHAR(500) NOT NULL,
                status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
            )
        `);
        console.log('guide_documents table created.');

        // 4. Create guide_portfolio table
        console.log('Creating guide_portfolio table...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS guide_portfolio (
                id INT AUTO_INCREMENT PRIMARY KEY,
                guide_id INT NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                caption VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
            )
        `);
        console.log('guide_portfolio table created.');

        console.log('Migration completed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

migrate();
