const fs = require('fs');
let code = fs.readFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', 'utf8');

// The pattern is probably:
// console.warn('[Global DB Fallback Captured 500]');\n});
// Let's replace it with:
// console.warn('[Global DB Fallback Captured 500]');\n  }\n});

code = code.replace(/console\.warn\('\\[Global DB Fallback Captured 500\\]'\);\r?\n\}\);/g, "console.warn('[Global DB Fallback Captured 500]');\n  }\n});");

fs.writeFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', code, 'utf8');
console.log('Fixed missing braces');
