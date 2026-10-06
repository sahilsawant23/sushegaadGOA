const fs = require('fs');
let code = fs.readFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', 'utf8');

const targetStr = `const jwtSecret = process.env.JWT_SECRET || 's3cr3tK3y!@';

// In-Memory User Fallback Store (Ensures Login & Signup work seamlessly even when DB is unreachable)
const bookingsMemoryStore = [];
const rentalsMemoryStore = [];

const usersMemoryStore = [`;

const replacement = `const jwtSecret = process.env.JWT_SECRET || 's3cr3tK3y!@';

// Fallback Store Implementation
const fallbackFile = path.join(__dirname, 'fallback_data.json');

let bookingsMemoryStore = [];
let rentalsMemoryStore = [];
let usersMemoryStore = [];

// Load Fallback Data
try {
  if (fs.existsSync(fallbackFile)) {
    const data = JSON.parse(fs.readFileSync(fallbackFile, 'utf8'));
    if (data.usersMemoryStore) usersMemoryStore = data.usersMemoryStore;
    if (data.bookingsMemoryStore) bookingsMemoryStore = data.bookingsMemoryStore;
    if (data.rentalsMemoryStore) rentalsMemoryStore = data.rentalsMemoryStore;
    console.log('[Fallback] Loaded fallback data from fallback_data.json');
  }
} catch (e) {
  console.error('[Fallback] Failed to load fallback data:', e.message);
}

// Function to save fallback data
function saveFallbackData() {
  try {
    const data = {
      usersMemoryStore,
      bookingsMemoryStore,
      rentalsMemoryStore
    };
    fs.writeFileSync(fallbackFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('[Fallback] Failed to save fallback data:', e.message);
  }
}

// Expose globally or at least in module scope so it's accessible
global.saveFallbackData = saveFallbackData;

// Seed initial fallback data if empty
if (usersMemoryStore.length === 0) {
  usersMemoryStore.push(...[`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', code, 'utf8');
  console.log('Successfully patched saveFallbackData and loadFallbackData in routes.js!');
} else {
  console.log('Target string not found!');
}
