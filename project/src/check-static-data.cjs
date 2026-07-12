const fs = require('fs');
const path = require('path');

const files = [
    'churchData.ts',
    'templeData.ts',
    'beachesData.ts',
    'waterfallData.ts',
    'nightlifeData.ts'
];

const dataDir = path.join(__dirname, 'data');

files.forEach(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    // Simple regex to find objects in the array. This is approximation but sufficient for structure check.
    // We look for "id:" which starts an object, then check if "region:" exists before the next "id:" or end of array.

    // Split by "id:" to get chunks
    const chunks = content.split(/id:\s*['"]?[\w-]+['"]?/);

    // First chunk is prologue, ignore.
    let missingCount = 0;

    for (let i = 1; i < chunks.length; i++) {
        const chunk = chunks[i];
        // Check if this chunk (which corresponds to an item) has "region:"
        // Note: The last chunk might contain the end of the array, but standard items should have region.
        // We only care if it looks like an object body.

        if (!chunk.includes('region:')) {
            // Try to extract name to identify it
            const nameMatch = chunk.match(/name:\s*['"]([^'"]+)['"]/);
            const name = nameMatch ? nameMatch[1] : `Item #${i}`;
            console.log(`[${file}] Missing region for: ${name}`);
            missingCount++;
        }
    }

    if (missingCount === 0) {
        console.log(`[${file}] All items have region.`);
    }
});
