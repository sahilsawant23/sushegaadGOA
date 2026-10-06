const fs = require('fs');
let code = fs.readFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', 'utf8');
code = code.replace("}); }\\r\\n  }\\r\\n});", "});");
code = code.replace("}); }\\n  }\\n});", "});");
fs.writeFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', code, 'utf8');
console.log('Fixed syntax error!');
