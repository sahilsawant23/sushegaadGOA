const fs = require('fs');
let c = fs.readFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', 'utf8');
c = c.replace(/booking\.status = 'cancelled';/g, "booking.status = 'cancelled'; if (typeof saveFallbackData === 'function') saveFallbackData();");
fs.writeFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', c);
