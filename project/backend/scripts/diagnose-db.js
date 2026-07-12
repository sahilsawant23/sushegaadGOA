const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

async function run() {
    const envPassword = process.env.DB_PASSWORD;
    const log = [];
    log.push(`ENV_PASSWORD_JSON: ${JSON.stringify(envPassword)}`);

    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: 'root',
            password: envPassword,
            database: process.env.DB_NAME || 'goa_db'
        });
        log.push('CONNECTION_RESULT: SUCCESS');
        await conn.end();
    } catch (error) {
        log.push(`CONNECTION_RESULT: FAILED - ${error.message}`);
    }

    fs.writeFileSync('password_check.txt', log.join('\n'));
    console.log('Diagnostic finished. Check password_check.txt');
}

run();
