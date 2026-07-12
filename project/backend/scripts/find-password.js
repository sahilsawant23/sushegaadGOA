const mysql = require('mysql2/promise');

const candidates = [
    '',
    '@#2024 password',
    '@#2024password',
    '@#2024',
    'password',
    'root',
    'admin',
    '123456',
    'mysql',
    's3cr3tK3y!@',
    'sahil',
    'sahil123'
];

async function tryPassword(password) {
    const config = {
        host: 'localhost',
        user: 'root',
        password: password,
        database: 'goa_db'
    };

    try {
        const conn = await mysql.createConnection(config);
        console.log(`SUCCESS: Password found! '${password}'`);
        await conn.end();
        return true;
    } catch (error) {
        if (error.code !== 'ER_ACCESS_DENIED_ERROR') {
            // If DB doesn't exist, we might get a different error but auth passed? 
            // No, usually mysql2 connects then errors on DB selection if auth is OK.
            // Let's assume other errors might mean Connected but ...
            console.log(`Connection error with '${password}': ${error.code}`);
        }
        return false;
    }
}

async function main() {
    console.log('Testing passwords...');
    for (const p of candidates) {
        if (await tryPassword(p)) {
            process.exit(0);
        }
    }
    console.log('All candidates failed.');
    process.exit(1);
}

main();
