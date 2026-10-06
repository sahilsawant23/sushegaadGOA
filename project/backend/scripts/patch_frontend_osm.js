const fs = require('fs');
const path = require('path');

const pagesDir = 'f:/e drive data/sahil/GOA website/project/src/pages';

function patchFrontendFetch(filename, oldEndpoint, newEndpoint) {
    const fullPath = path.join(pagesDir, filename);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(oldEndpoint, newEndpoint);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Patched " + filename);
    } else {
        console.log(filename + " not found");
    }
}

// Destinations.tsx for beaches
patchFrontendFetch('Destinations.tsx', '${API_BASE_URL}/realtime/places', '${API_BASE_URL}/realtime/places?category=beaches');

// TempleList.tsx
patchFrontendFetch('TempleList.tsx', '${API_BASE_URL}/destinations/category/Temple', '${API_BASE_URL}/realtime/places?category=temples');

// ChurchesList.tsx
patchFrontendFetch('ChurchesList.tsx', '${API_BASE_URL}/destinations/category/Church', '${API_BASE_URL}/realtime/places?category=churches');

// WaterfallList.tsx
patchFrontendFetch('WaterfallList.tsx', '${API_BASE_URL}/destinations/category/Waterfall', '${API_BASE_URL}/realtime/places?category=waterfalls');

// AuthenticList.tsx
patchFrontendFetch('AuthenticList.tsx', '${API_BASE_URL}/destinations/category/Authentic', '${API_BASE_URL}/realtime/places?category=authentic');

// CultureList.tsx
patchFrontendFetch('CultureList.tsx', '${API_BASE_URL}/destinations/category/Culture', '${API_BASE_URL}/realtime/places?category=culture');
