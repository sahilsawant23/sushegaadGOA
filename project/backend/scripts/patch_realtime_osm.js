const fs = require('fs');
const path = require('path');

// 1. UPDATE ROUTES.JS
const routesPath = 'f:/e drive data/sahil/GOA website/project/backend/routes.js';
let routes = fs.readFileSync(routesPath, 'utf8');

// Replace categoryMap in routes.js
const oldCategoryMapStr = `const categoryMap = {
    hotels: [
      'node["tourism"="hotel"]',
      'node["tourism"="guest_house"]',
      'node["tourism"="resort"]',
      'node["tourism"="hostel"]'
    ],
    restaurants: [
      'node["amenity"="restaurant"]',
      'node["amenity"="food_court"]'
    ],
    cafes: [
      'node["amenity"="cafe"]'
    ],
    clubs: [
      'node["amenity"="nightclub"]',
      'node["amenity"="bar"]',
      'node["amenity"="pub"]',
      'node["restaurant"="beach_shack"]',
      'node["beach_shack"="yes"]',
      'node["bar"="yes"]'
    ],
    casinos: [
      'node["amenity"="casino"]',
      'node["leisure"="casino"]'
    ]
  };`;

const newCategoryMapStr = `const categoryMap = {
    hotels: ['node["tourism"="hotel"]', 'node["tourism"="guest_house"]', 'node["tourism"="resort"]', 'node["tourism"="hostel"]'],
    restaurants: ['node["amenity"="restaurant"]', 'node["amenity"="food_court"]'],
    cafes: ['node["amenity"="cafe"]'],
    clubs: ['node["amenity"="nightclub"]', 'node["amenity"="bar"]', 'node["amenity"="pub"]', 'node["restaurant"="beach_shack"]', 'node["beach_shack"="yes"]', 'node["bar"="yes"]'],
    casinos: ['node["amenity"="casino"]', 'node["leisure"="casino"]'],
    beaches: ['node["natural"="beach"]'],
    temples: ['node["amenity"="place_of_worship"]["religion"="hindu"]'],
    churches: ['node["amenity"="place_of_worship"]["religion"="christian"]'],
    waterfalls: ['node["waterway"="waterfall"]'],
    authentic: ['node["historic"="ruins"]', 'node["historic"="monument"]'],
    culture: ['node["tourism"="museum"]', 'node["amenity"="arts_centre"]']
  };`;

if (routes.includes(oldCategoryMapStr)) {
  routes = routes.replace(oldCategoryMapStr, newCategoryMapStr);
} else {
  // Try regex replace if formatting is slightly different
  routes = routes.replace(/const categoryMap = \{[\s\S]*?casinos: \[[\s\S]*?\]\s*\};/, newCategoryMapStr);
}

// Update the elements.map logic in routes.js to assign images and types
const oldElementsMapLogic = `      if (tags.tourism === 'hotel' || tags.tourism === 'resort') {
        type = 'Hotel';
        image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
      } else if (tags.amenity === 'restaurant' || tags.amenity === 'food_court') {
        type = 'Restaurant';
        image = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
      } else if (tags.amenity === 'cafe') {
        type = 'Cafe';
        image = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800';
      } else if (tags.amenity === 'nightclub' || tags.amenity === 'bar' || tags.amenity === 'pub') {
        type = 'Club/Bar';
        image = 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800';
      } else if (tags.amenity === 'casino' || tags.leisure === 'casino') {
        type = 'Casino';
        image = 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800';
      }`;

const newElementsMapLogic = `      if (tags.tourism === 'hotel' || tags.tourism === 'resort') {
        type = 'Hotel';
        image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
      } else if (tags.amenity === 'restaurant' || tags.amenity === 'food_court') {
        type = 'Restaurant';
        image = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
      } else if (tags.amenity === 'cafe') {
        type = 'Cafe';
        image = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800';
      } else if (tags.amenity === 'nightclub' || tags.amenity === 'bar' || tags.amenity === 'pub') {
        type = 'Club/Bar';
        image = 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800';
      } else if (tags.amenity === 'casino' || tags.leisure === 'casino') {
        type = 'Casino';
        image = 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800';
      } else if (tags.natural === 'beach') {
        type = 'Beach';
        image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
      } else if (tags.amenity === 'place_of_worship' && tags.religion === 'hindu') {
        type = 'Temple';
        image = 'https://images.unsplash.com/photo-1622306236966-28564db4430e?w=800'; // Random temple-ish image
      } else if (tags.amenity === 'place_of_worship' && tags.religion === 'christian') {
        type = 'Church';
        image = 'https://images.unsplash.com/photo-1548625361-ecde584bb775?w=800'; 
      } else if (tags.waterway === 'waterfall') {
        type = 'Waterfall';
        image = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800';
      } else if (tags.historic === 'ruins' || tags.historic === 'monument') {
        type = 'Authentic';
        image = 'https://images.unsplash.com/photo-1598424268600-4743285c5314?w=800';
      } else if (tags.tourism === 'museum' || tags.amenity === 'arts_centre') {
        type = 'Culture';
        image = 'https://images.unsplash.com/photo-1518998053401-878c735c0754?w=800';
      }`;

if (routes.includes(oldElementsMapLogic)) {
  routes = routes.replace(oldElementsMapLogic, newElementsMapLogic);
} else {
    // regex fallback
    routes = routes.replace(/if \(tags\.tourism === 'hotel'[\s\S]*?type = 'Casino';[\s\S]*?\}/, newElementsMapLogic);
}

fs.writeFileSync(routesPath, routes, 'utf8');


// 2. UPDATE FRONTEND FILES
const pagesDir = 'f:/e drive data/sahil/GOA website/project/src/pages';

function patchFrontendFetch(filename, oldEndpoint, newEndpoint) {
    const fullPath = path.join(pagesDir, filename);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(new RegExp(oldEndpoint.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newEndpoint);
        fs.writeFileSync(fullPath, content, 'utf8');
    }
}

// Destinations.tsx for beaches
patchFrontendFetch('Destinations.tsx', '\${API_BASE_URL}/realtime/places', '\${API_BASE_URL}/realtime/places?category=beaches');

// TempleList.tsx
patchFrontendFetch('TempleList.tsx', '\${API_BASE_URL}/destinations/category/Temple', '\${API_BASE_URL}/realtime/places?category=temples');

// ChurchesList.tsx
patchFrontendFetch('ChurchesList.tsx', '\${API_BASE_URL}/destinations/category/Church', '\${API_BASE_URL}/realtime/places?category=churches');

// WaterfallList.tsx
patchFrontendFetch('WaterfallList.tsx', '\${API_BASE_URL}/destinations/category/Waterfall', '\${API_BASE_URL}/realtime/places?category=waterfalls');

// AuthenticList.tsx
patchFrontendFetch('AuthenticList.tsx', '\${API_BASE_URL}/destinations/category/Authentic', '\${API_BASE_URL}/realtime/places?category=authentic');

// CultureList.tsx
patchFrontendFetch('CultureList.tsx', '\${API_BASE_URL}/destinations/category/Culture', '\${API_BASE_URL}/realtime/places?category=culture');

console.log('Realtime fetching patched successfully!');
