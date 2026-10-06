const fs = require('fs');

const routesPath = 'f:/e drive data/sahil/GOA website/project/backend/routes.js';
let routes = fs.readFileSync(routesPath, 'utf8');

const persistentLogic = `
const _fs = require('fs');
const _path = require('path');
const fallbackDbPath = _path.join(__dirname, 'fallback_data.json');

function saveFallbackData() {
  try {
    _fs.writeFileSync(fallbackDbPath, JSON.stringify({
      users: usersMemoryStore,
      bookings: bookingsMemoryStore,
      rentals: rentalsMemoryStore
    }, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback db:', e);
  }
}

try {
  if (_fs.existsSync(fallbackDbPath)) {
    const data = JSON.parse(_fs.readFileSync(fallbackDbPath, 'utf8'));
    if (data.users && data.users.length) {
      data.users.forEach(u => usersMemoryStore.push(u));
    }
    if (data.bookings && data.bookings.length) {
      data.bookings.forEach(b => bookingsMemoryStore.push(b));
    }
    if (data.rentals && data.rentals.length) {
      data.rentals.forEach(r => rentalsMemoryStore.push(r));
    }
  }
} catch (e) {
  console.error('Error loading fallback db:', e);
}

// Override push methods
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

// Insert the persistent logic right before the first route definition
if (!routes.includes('function saveFallbackData()')) {
  routes = routes.replace('// Authentication endpoints', persistentLogic + '\\n\\n// Authentication endpoints');
}

fs.writeFileSync(routesPath, routes, 'utf8');
console.log('Persistence applied correctly.');
