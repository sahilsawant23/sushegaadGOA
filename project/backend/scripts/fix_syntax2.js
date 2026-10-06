const fs = require('fs');
let code = fs.readFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', 'utf8');
const lines = code.split(/\r?\n/);

// Find the line index containing "}); }"
const idx = lines.findIndex(l => l.includes('}); }'));
if (idx !== -1) {
  // Check if the next lines are "  }" and "});"
  if (lines[idx + 1].trim() === '}' && lines[idx + 2].trim() === '});') {
    lines.splice(idx, 3, '});');
    fs.writeFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', lines.join('\n'), 'utf8');
    console.log('Successfully fixed syntax error by splicing lines');
  } else {
    console.log('Next lines did not match exactly, found:', lines[idx+1], lines[idx+2]);
  }
} else {
  console.log('Could not find "}); }"');
}
