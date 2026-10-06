const fs = require('fs');
let code = fs.readFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', 'utf8');

// 1. Fix the category logic in OSM mapping
const oldMappingBlock = `      let friendlyType = 'Bar';
      let catKey = 'clubs';
      
      if (tags.tourism === 'hotel') { friendlyType = 'Hotel'; catKey = 'hotels'; }
      else if (tags.tourism === 'resort') { friendlyType = 'Resort'; catKey = 'hotels'; }
      else if (tags.tourism === 'hostel') { friendlyType = 'Hostel'; catKey = 'hotels'; }
      else if (tags.tourism === 'guest_house') { friendlyType = 'Guest House'; catKey = 'hotels'; }
      else if (tags.leisure === 'casino' || tags.amenity === 'casino' || lowercaseName.includes('casino')) { friendlyType = 'Casino'; catKey = 'casinos'; }
      else if (tags.amenity === 'nightclub' || lowercaseName.includes('club') || lowercaseName.includes('nightclub')) { friendlyType = 'Nightclub'; catKey = 'clubs'; }
      else if (tags.restaurant === 'beach_shack' || tags.beach_shack === 'yes' || lowercaseName.includes('shack') || lowercaseName.includes('beach shack')) { friendlyType = 'Beach Shack'; catKey = 'clubs'; }
      else if (tags.amenity === 'restaurant') { friendlyType = 'Restaurant & Bar'; catKey = 'restaurants'; }
      else if (tags.amenity === 'food_court') { friendlyType = 'Food Court'; catKey = 'restaurants'; }
      else if (tags.amenity === 'cafe') { friendlyType = 'Cafe'; catKey = 'cafes'; }
      else if (tags.amenity === 'bar') { friendlyType = 'Bar'; catKey = 'clubs'; }
      else if (tags.amenity === 'pub') { friendlyType = 'Pub'; catKey = 'clubs'; }
      else if (tags.tourism) { friendlyType = tags.tourism.charAt(0).toUpperCase() + tags.tourism.slice(1); catKey = 'hotels'; }
      else if (tags.amenity) { friendlyType = tags.amenity.charAt(0).toUpperCase() + tags.amenity.slice(1); }`;

const newMappingBlock = `      let friendlyType = 'Place';
      let catKey = 'other';
      
      if (tags.tourism === 'hotel') { friendlyType = 'Hotel'; catKey = 'hotels'; }
      else if (tags.tourism === 'resort') { friendlyType = 'Resort'; catKey = 'hotels'; }
      else if (tags.tourism === 'hostel') { friendlyType = 'Hostel'; catKey = 'hotels'; }
      else if (tags.tourism === 'guest_house') { friendlyType = 'Guest House'; catKey = 'hotels'; }
      else if (tags.leisure === 'casino' || tags.amenity === 'casino' || lowercaseName.includes('casino')) { friendlyType = 'Casino'; catKey = 'casinos'; }
      else if (tags.amenity === 'nightclub' || lowercaseName.includes('club') || lowercaseName.includes('nightclub')) { friendlyType = 'Nightclub'; catKey = 'clubs'; }
      else if (tags.restaurant === 'beach_shack' || tags.beach_shack === 'yes' || lowercaseName.includes('shack') || lowercaseName.includes('beach shack')) { friendlyType = 'Beach Shack'; catKey = 'clubs'; }
      else if (tags.amenity === 'restaurant') { friendlyType = 'Restaurant & Bar'; catKey = 'restaurants'; }
      else if (tags.amenity === 'food_court') { friendlyType = 'Food Court'; catKey = 'restaurants'; }
      else if (tags.amenity === 'cafe') { friendlyType = 'Cafe'; catKey = 'cafes'; }
      else if (tags.amenity === 'bar') { friendlyType = 'Bar'; catKey = 'clubs'; }
      else if (tags.amenity === 'pub') { friendlyType = 'Pub'; catKey = 'clubs'; }
      else if (tags.natural === 'beach' || lowercaseName.includes('beach')) { friendlyType = 'Beach'; catKey = 'beaches'; }
      else if (tags.amenity === 'place_of_worship') {
         if (tags.religion === 'hindu') { friendlyType = 'Temple'; catKey = 'temples'; }
         else if (tags.religion === 'christian') { friendlyType = 'Church'; catKey = 'churches'; }
         else { friendlyType = 'Place of Worship'; catKey = 'culture'; }
      }
      else if (tags.waterway === 'waterfall') { friendlyType = 'Waterfall'; catKey = 'waterfalls'; }
      else if (tags.historic === 'ruins' || tags.historic === 'monument') { friendlyType = 'Authentic'; catKey = 'authentic'; }
      else if (tags.tourism === 'museum' || tags.amenity === 'arts_centre') { friendlyType = 'Culture'; catKey = 'culture'; }
      else if (tags.tourism) { friendlyType = tags.tourism.charAt(0).toUpperCase() + tags.tourism.slice(1); catKey = 'hotels'; }
      else if (tags.amenity) { friendlyType = tags.amenity.charAt(0).toUpperCase() + tags.amenity.slice(1); }`;

// 2. Fix the DB fallback query conditions
const oldDbBlock = `      if (category && category !== 'all') {
        if (category === 'hotels') {
          conditions.push("type IN ('Hotel', 'Resort', 'Hostel', 'Guest House')");
        } else if (category === 'restaurants') {
          conditions.push("type IN ('Restaurant & Bar', 'Food Court')");
        } else if (category === 'cafes') {
          conditions.push("type = 'Cafe'");
        } else if (category === 'clubs') {
          conditions.push("type IN ('Bar', 'Pub', 'Nightclub', 'Beach Shack')");
        } else if (category === 'casinos') {
          conditions.push("type = 'Casino'");
        }
      }`;

const newDbBlock = `      if (category && category !== 'all') {
        if (category === 'hotels') {
          conditions.push("type IN ('Hotel', 'Resort', 'Hostel', 'Guest House')");
        } else if (category === 'restaurants') {
          conditions.push("type IN ('Restaurant & Bar', 'Food Court')");
        } else if (category === 'cafes') {
          conditions.push("type = 'Cafe'");
        } else if (category === 'clubs') {
          conditions.push("type IN ('Bar', 'Pub', 'Nightclub', 'Beach Shack')");
        } else if (category === 'casinos') {
          conditions.push("type = 'Casino'");
        } else if (category === 'beaches') {
          conditions.push("type = 'Beach'");
        } else if (category === 'temples') {
          conditions.push("type = 'Temple'");
        } else if (category === 'churches') {
          conditions.push("type = 'Church'");
        } else if (category === 'waterfalls') {
          conditions.push("type = 'Waterfall'");
        } else if (category === 'authentic') {
          conditions.push("type = 'Authentic'");
        } else if (category === 'culture') {
          conditions.push("type = 'Culture'");
        }
      }`;

if (code.includes(oldMappingBlock) && code.includes(oldDbBlock)) {
  code = code.replace(oldMappingBlock, newMappingBlock);
  code = code.replace(oldDbBlock, newDbBlock);
  fs.writeFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', code, 'utf8');
  console.log('Successfully patched realtime mapping and DB fallback in routes.js!');
} else {
  console.log('Failed to match blocks exactly. I will use regex or partial matches.');
  // Safe partial patch
  const dbStartIdx = code.indexOf(`      if (category && category !== 'all') {`);
  const dbEndIdx = code.indexOf(`      }`, dbStartIdx + 100);
  if (dbStartIdx !== -1 && dbEndIdx !== -1) {
    code = code.substring(0, dbStartIdx) + newDbBlock + code.substring(dbEndIdx + 7);
  }
  
  const mapStartIdx = code.indexOf(`      let friendlyType = 'Bar';`);
  const mapEndIdx = code.indexOf(`else if (tags.amenity) { friendlyType = tags.amenity.charAt(0).toUpperCase() + tags.amenity.slice(1); }`);
  if (mapStartIdx !== -1 && mapEndIdx !== -1) {
    code = code.substring(0, mapStartIdx) + newMappingBlock + code.substring(mapEndIdx + 101);
  }
  fs.writeFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', code, 'utf8');
  console.log('Patched via fallback offsets!');
}
