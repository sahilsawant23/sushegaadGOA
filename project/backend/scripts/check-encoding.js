const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '..', 'routes.js');
const buffer = fs.readFileSync(routesPath);

console.log('File size:', buffer.length);
console.log('First 4 bytes:', buffer.slice(0, 4));

// Detect UTF-16 LE (BOM: FF FE)
if (buffer[0] === 0xff && buffer[1] === 0xfe) {
  console.log('Detected UTF-16 LE encoding. Converting to UTF-8...');
  const utf16String = buffer.toString('utf16le');
  fs.writeFileSync(routesPath, utf16String, 'utf8');
  console.log('Conversion successful!');
} else {
  console.log('Encoding is not UTF-16 LE with BOM.');
}
