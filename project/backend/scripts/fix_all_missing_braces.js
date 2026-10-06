const fs = require('fs');
let code = fs.readFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', 'utf8');
let lines = code.split(/\r?\n/);

for (let i = 0; i < lines.length - 1; i++) {
  if (lines[i].includes("console.warn('[Global DB Fallback Captured 500]');") && lines[i+1].trim() === "});") {
    // Insert "  }" before "});"
    lines.splice(i+1, 0, "  }");
    i++; // skip the newly inserted line
  }
}

fs.writeFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', lines.join('\n'), 'utf8');
console.log('Fixed missing braces by inserting "  }" before "});" where needed.');
