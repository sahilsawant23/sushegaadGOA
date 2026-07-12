try {
    const db = require('../db');
    console.log('Imported db.js successfully. Waiting for connection log...');

    // Keep alive briefly to allow async connection attempt in db.js to finish logging
    setTimeout(() => {
        console.log('Diagnosis complete.');
        process.exit(0);
    }, 2000);
} catch (err) {
    console.error('Import failed:', err);
}
