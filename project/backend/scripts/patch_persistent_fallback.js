const fs = require('fs');

const routesPath = 'f:/e drive data/sahil/GOA website/project/backend/routes.js';
let routes = fs.readFileSync(routesPath, 'utf8');

// Replace the memory arrays with a persistent store logic
const persistentStoreSetup = `const fs = require('fs');
const path = require('path');
const fallbackDbPath = path.join(__dirname, 'fallback_data.json');

let usersMemoryStore = [];
let bookingsMemoryStore = [];
let rentalsMemoryStore = [];

try {
  if (fs.existsSync(fallbackDbPath)) {
    const data = JSON.parse(fs.readFileSync(fallbackDbPath, 'utf8'));
    usersMemoryStore = data.users || [];
    bookingsMemoryStore = data.bookings || [];
    rentalsMemoryStore = data.rentals || [];
  }
} catch (e) {
  console.error('Error loading fallback db:', e);
}

function saveFallbackData() {
  try {
    fs.writeFileSync(fallbackDbPath, JSON.stringify({
      users: usersMemoryStore,
      bookings: bookingsMemoryStore,
      rentals: rentalsMemoryStore
    }, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback db:', e);
  }
}

// Intercept push to arrays to trigger save (simple proxy or override)
const originalUsersPush = usersMemoryStore.push.bind(usersMemoryStore);
usersMemoryStore.push = function(...args) {
  const res = originalUsersPush(...args);
  saveFallbackData();
  return res;
};

const originalBookingsPush = bookingsMemoryStore.push.bind(bookingsMemoryStore);
bookingsMemoryStore.push = function(...args) {
  const res = originalBookingsPush(...args);
  saveFallbackData();
  return res;
};

const originalRentalsPush = rentalsMemoryStore.push.bind(rentalsMemoryStore);
rentalsMemoryStore.push = function(...args) {
  const res = originalRentalsPush(...args);
  saveFallbackData();
  return res;
};
`;

const arraysStr = `const bookingsMemoryStore = [];
const rentalsMemoryStore = [];

const usersMemoryStore = [];`;

if (routes.includes(arraysStr)) {
  routes = routes.replace(arraysStr, persistentStoreSetup);
} else if (routes.includes('const bookingsMemoryStore = [];')) {
  // alternative match if whitespace differs
  routes = routes.replace(/const bookingsMemoryStore = \[\];[\s\S]*?const usersMemoryStore = \[\];/, persistentStoreSetup);
}

fs.writeFileSync(routesPath, routes, 'utf8');
console.log('Made fallback memory stores persistent across server restarts!');
