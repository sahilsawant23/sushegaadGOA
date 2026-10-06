const fs = require('fs');

const routesPath = 'f:/e drive data/sahil/GOA website/project/backend/routes.js';
let routes = fs.readFileSync(routesPath, 'utf8');

const oldReturn = "return res.json(staticPlaces);";
const newReturn = `
      let filteredStatic = staticPlaces;
      if (category && category !== 'all') {
        if (category === 'hotels') {
          filteredStatic = staticPlaces.filter(p => ['Hotel', 'Resort', 'Hostel', 'Guest House'].includes(p.type));
        } else if (category === 'restaurants') {
          filteredStatic = staticPlaces.filter(p => ['Restaurant & Bar', 'Food Court'].includes(p.type));
        } else if (category === 'cafes') {
          filteredStatic = staticPlaces.filter(p => p.type === 'Cafe');
        } else if (category === 'clubs') {
          filteredStatic = staticPlaces.filter(p => ['Bar', 'Pub', 'Nightclub', 'Beach Shack', 'Club/Bar'].includes(p.type));
        } else if (category === 'casinos') {
          filteredStatic = staticPlaces.filter(p => p.type === 'Casino');
        } else {
          filteredStatic = []; // If it's temples, beaches, etc., we have no static fallback for those in this list
        }
      }
      return res.json(filteredStatic);
`;

if (routes.includes(oldReturn)) {
  routes = routes.replace(oldReturn, newReturn);
  fs.writeFileSync(routesPath, routes, 'utf8');
  console.log('Fixed staticPlaces fallback!');
} else {
  console.log('Could not find return res.json(staticPlaces);');
}
