const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '..', 'routes.js');
let content = fs.readFileSync(routesPath, 'utf8');

// Fix 1: Broken map close at line 3818
const target1 = "        ];\r    } catch (dbError) {";
const target1_alt = "        ];\n    } catch (dbError) {";
const replacement1 = `        ];
        return {
          ...p,
          reviews: userRevs.length > 0 ? userRevs : mockRevs
        };
      });
    } catch (dbError) {`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
  console.log('Fix 1 applied (CRLF version)');
} else if (content.includes(target1_alt)) {
  content = content.replace(target1_alt, replacement1);
  console.log('Fix 1 applied (LF version)');
} else {
  console.log('Fix 1 target not found, trying regex...');
  content = content.replace(/\];\s*\r?\n?\s*\} catch \(dbError\) \{/, replacement1);
}

// Fix 2: Corrupt trailing syntax at line 4167
const target2 = `  }
});, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});`;
const target2_crlf = `  }\r\n});, error);\r\n    res.status(500).json({ message: 'Internal server error' });\r\n  }\r\n});`;

if (content.includes(target2)) {
  content = content.replace(target2, '  }\n});');
  console.log('Fix 2 applied (LF version)');
} else if (content.includes(target2_crlf)) {
  content = content.replace(target2_crlf, '  }\n});');
  console.log('Fix 2 applied (CRLF version)');
} else {
  console.log('Fix 2 target not found, trying regex...');
  content = content.replace(/\}\);\s*,\s*error\);[\s\S]*?\}\);\s*\r?\n?\s*\}\);/, '});');
}

fs.writeFileSync(routesPath, content, 'utf8');
console.log('Syntax fixes written to routes.js');
