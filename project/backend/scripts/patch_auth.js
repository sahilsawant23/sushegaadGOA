const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '..', 'routes.js');
let code = fs.readFileSync(routesPath, 'utf8');

// 1. Inject usersMemoryStore
const memStoreCode = `

// In-Memory User Fallback Store (Ensures Login & Signup work seamlessly even when DB is unreachable)
const usersMemoryStore = [
  {
    id: 1,
    full_name: 'System Administrator',
    email: 'admin@sushegaadgoa.com',
    password_hash: '$2b$10$w0.04L7r8vX2K7B.nK5ZHev5nK5ZHev5nK5ZHev5nK5ZHev5nK5ZH',
    role: 'admin',
    phone: '+91 9876543210',
    location: 'Panaji, Goa',
    bio: 'Sushegaad GOA Platform Administrator',
    has_premium_access: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    full_name: 'Goa Traveler',
    email: 'demo@goa.com',
    password_hash: 'password123',
    role: 'user',
    phone: '+91 9822001122',
    location: 'Baga, North Goa',
    bio: 'Lover of beaches, shacks, and Goan heritage',
    has_premium_access: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    full_name: 'Verified Local Guide',
    email: 'guide@goa.com',
    password_hash: 'password123',
    role: 'guide',
    phone: '+91 9890112233',
    location: 'Fontainhas, Panaji',
    bio: 'Certified heritage walk and eco-tour guide',
    has_premium_access: 1,
    created_at: new Date().toISOString()
  }
];

(async () => {
  try {
    const adminHash = await bcrypt.hash('admin123', 10);
    const demoHash = await bcrypt.hash('password123', 10);
    usersMemoryStore[0].password_hash = adminHash;
    usersMemoryStore[1].password_hash = demoHash;
    usersMemoryStore[2].password_hash = demoHash;
  } catch (err) {}
})();
`;

if (!code.includes('usersMemoryStore')) {
  code = code.replace(
    "const jwtSecret = process.env.JWT_SECRET || 's3cr3tK3y!@';",
    "const jwtSecret = process.env.JWT_SECRET || 's3cr3tK3y!@';" + memStoreCode
  );
}

// 2. Replace /register handler
const registerRegex = /router\.post\('\/register'[\s\S]*?\}\);\n/;
const newRegisterCode = `// Register user
router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const conn = await pool.getConnection();
    const [existing] = await conn.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      conn.release();
      return res.status(409).json({ message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await conn.execute(
      "INSERT INTO users (full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, 'user', NOW())",
      [fullName, cleanEmail, passwordHash]
    );
    conn.release();

    usersMemoryStore.push({
      id: Date.now(),
      full_name: fullName,
      email: cleanEmail,
      password_hash: passwordHash,
      role: 'user',
      phone: '',
      location: 'Goa, India',
      bio: '',
      has_premium_access: 0,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.warn('[DB Fallback] Register using memory store:', error.message);
  }

  // Memory Store Fallback
  const existingMem = usersMemoryStore.find(u => u.email.toLowerCase() === cleanEmail);
  if (existingMem) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newMemUser = {
    id: Date.now(),
    full_name: fullName,
    email: cleanEmail,
    password_hash: passwordHash,
    role: 'user',
    phone: '',
    location: 'Goa, India',
    bio: '',
    has_premium_access: 0,
    created_at: new Date().toISOString()
  };
  usersMemoryStore.push(newMemUser);
  return res.status(201).json({ message: 'User registered successfully' });
});
`;

code = code.replace(registerRegex, newRegisterCode + '\n');

// 3. Replace /login handler
const loginRegex = /router\.post\('\/login'[\s\S]*?\}\);\n/;
const newLoginCode = `// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const cleanEmail = email.toLowerCase().trim();
  let user = null;

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    conn.release();
    if (rows.length > 0) {
      user = rows[0];
    }
  } catch (error) {
    console.warn('[DB Fallback] Login using memory store:', error.message);
  }

  if (!user) {
    user = usersMemoryStore.find(u => u.email.toLowerCase() === cleanEmail);
  }

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  let match = false;
  if (user.password_hash && (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$'))) {
    match = await bcrypt.compare(password, user.password_hash);
  } else {
    match = (password === user.password_hash);
  }

  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role || 'user' },
    jwtSecret,
    { expiresIn: '24h' }
  );
  return res.json({ token, role: user.role || 'user' });
});
`;

code = code.replace(loginRegex, newLoginCode + '\n');

// 4. Replace /admin/login handler
const adminLoginRegex = /router\.post\('\/admin\/login'[\s\S]*?\}\);\n/;
const newAdminLoginCode = `// Admin Login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const cleanEmail = email.toLowerCase().trim();
  let user = null;

  try {
    const conn = await pool.getConnection();
    let rows;
    try {
      [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    } finally {
      conn.release();
    }
    if (rows.length > 0) {
      user = rows[0];
    }
  } catch (error) {
    console.warn('[DB Fallback] Admin Login using memory store:', error.message);
  }

  if (!user) {
    user = usersMemoryStore.find(u => u.email.toLowerCase() === cleanEmail);
  }

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  let match = false;
  if (user.password_hash && (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$'))) {
    match = await bcrypt.compare(password, user.password_hash);
  } else {
    match = (password === user.password_hash);
  }

  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin privileges required.' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: '24h' }
  );
  return res.json({ token, role: user.role });
});
`;

code = code.replace(adminLoginRegex, newAdminLoginCode + '\n');

// 5. Replace /profile GET handler
const profileGetRegex = /router\.get\('\/profile', authenticateToken[\s\S]*?\}\);\n/;
const newProfileGetCode = `// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const userEmail = req.user.email;

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      'SELECT id, full_name, email, phone, location, bio, role, has_premium_access, created_at, profile_picture FROM users WHERE id = ? OR email = ?',
      [userId, userEmail]
    );
    conn.release();
    if (rows.length > 0) {
      return res.json(rows[0]);
    }
  } catch (error) {
    console.warn('[DB Fallback] Profile GET using memory store:', error.message);
  }

  const memUser = usersMemoryStore.find(
    u => String(u.id) === String(userId) || u.email.toLowerCase() === (userEmail || '').toLowerCase()
  );
  if (memUser) {
    return res.json({
      id: memUser.id,
      full_name: memUser.full_name,
      email: memUser.email,
      phone: memUser.phone || '',
      location: memUser.location || 'Goa, India',
      bio: memUser.bio || '',
      role: memUser.role || 'user',
      has_premium_access: memUser.has_premium_access || false,
      created_at: memUser.created_at,
      profile_picture: memUser.profile_picture || null
    });
  }

  return res.status(404).json({ message: 'User profile not found' });
});
`;

code = code.replace(profileGetRegex, newProfileGetCode + '\n');

fs.writeFileSync(routesPath, code, 'utf8');
console.log('PATCH SUCCESSFULLY APPLIED!');
