const fs = require('fs');
const routesPath = 'f:/e drive data/sahil/GOA website/project/backend/routes.js';
let routes = fs.readFileSync(routesPath, 'utf8');

// Replace 1: Add saveFallbackData to /register memory fallback
const regOld = `  usersMemoryStore.push(newMemUser);
  return res.status(201).json({ message: 'User registered successfully' });`;
const regNew = `  usersMemoryStore.push(newMemUser);
  saveFallbackData();
  return res.status(201).json({ message: 'User registered successfully' });`;
routes = routes.replace(regOld, regNew);

// Replace 2: Add saveFallbackData to /register DB try-block
const regDbOld = `      has_premium_access: 0,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ message: 'User registered successfully' });`;
const regDbNew = `      has_premium_access: 0,
      created_at: new Date().toISOString()
    });
    saveFallbackData();
    return res.status(201).json({ message: 'User registered successfully' });`;
routes = routes.replace(regDbOld, regDbNew);

// Replace 3: Add saveFallbackData to /guide/register memory fallback
const guideRegOld = `  usersMemoryStore.push(newMemGuide);
  return res.status(201).json({ message: 'Guide registered successfully' });`;
const guideRegNew = `  usersMemoryStore.push(newMemGuide);
  saveFallbackData();
  return res.status(201).json({ message: 'Guide registered successfully' });`;
routes = routes.replace(guideRegOld, guideRegNew);

// Replace 4: Add saveFallbackData to /guide/register DB try-block
const guideDbOld = `      specialties: 'General',
      is_approved: 0,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ message: 'Guide registered successfully' });`;
const guideDbNew = `      specialties: 'General',
      is_approved: 0,
      created_at: new Date().toISOString()
    });
    saveFallbackData();
    return res.status(201).json({ message: 'Guide registered successfully' });`;
routes = routes.replace(guideDbOld, guideDbNew);

fs.writeFileSync(routesPath, routes, 'utf8');
console.log('Fixed register endpoints');
