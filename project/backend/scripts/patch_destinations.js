const fs = require('fs');
const path = require('path');

const API_IMPORT = "import { API_BASE_URL } from '../config';";
const REACT_IMPORT_RE = /import React(?:, \{[^}]+\})? from 'react';/;

function patchFile(filename, arrayName, categoryName) {
    const fullPath = path.join(__dirname, '../../src/pages', filename);
    let code = fs.readFileSync(fullPath, 'utf8');

    // Skip if already patched
    if (code.includes('setRealtimeItems')) {
        console.log(`Already patched ${filename}`);
        return;
    }

    // Add API_BASE_URL import if not present
    if (!code.includes('API_BASE_URL')) {
        code = code.replace(/import { Link }/, `${API_IMPORT}\nimport { Link }`);
    }

    // Update React import to include useState, useEffect
    if (!code.includes('useState')) {
        code = code.replace(REACT_IMPORT_RE, "import React, { useState, useEffect } from 'react';");
    }

    // Find the component start
    const compStartRe = new RegExp(`const ${filename.replace('.tsx', '')}: React.FC[^=]*= \\([^)]*\\) => \\{`);
    
    const fetchLogic = `
  const [realtimeItems, setRealtimeItems] = useState<any[]>(${arrayName});

  useEffect(() => {
    let isMounted = true;
    fetch(\`\${API_BASE_URL}/destinations/category/${categoryName}\`)
      .then(res => res.ok ? res.json() : [])
      .then((data: any[]) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mappedData = data.map(d => ({
            ...d,
            image: d.image_url || d.image,
            location: d.details?.location || d.location || 'Goa'
          }));
          setRealtimeItems(prev => {
            const existingIds = new Set(prev.map(p => String(p.id)));
            const newItems = mappedData.filter(item => !existingIds.has(String(item.id)));
            return [...prev, ...newItems];
          });
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);
`;

    code = code.replace(compStartRe, (match) => {
        return match + '\n' + fetchLogic;
    });

    // Replace the use of the arrayName with realtimeItems
    // Example: const filteredTemples = goaTemples.filter(
    const arrayUsageRe = new RegExp(`= ${arrayName}\\.`, 'g');
    code = code.replace(arrayUsageRe, `= realtimeItems.`);

    // For AuthenticList.tsx and CultureList.tsx which directly map:
    // {goaAuthenticExperiences.map((item) => {
    const mapRe = new RegExp(`\\{${arrayName}\\.map`, 'g');
    code = code.replace(mapRe, `{realtimeItems.map`);

    fs.writeFileSync(fullPath, code, 'utf8');
    console.log(`Patched ${filename} successfully!`);
}

patchFile('TempleList.tsx', 'goaTemples', 'Temple');
patchFile('ChurchesList.tsx', 'goaChurches', 'Church');
patchFile('WaterfallList.tsx', 'goaWaterfalls', 'Waterfall');
patchFile('AuthenticList.tsx', 'goaAuthenticExperiences', 'Authentic');
patchFile('CultureList.tsx', 'goaCultureFestivals', 'Culture'); // Check name for Culture
