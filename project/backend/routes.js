const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const path = require('path');
const router = express.Router();

const pool = require('./db');
const emailService = require('./emailService');

const jwtSecret = process.env.JWT_SECRET || 's3cr3tK3y!@';

// Helper to get connection from pool (backward compatibility if needed, 
// but better to use pool.execute directly)
async function getConnection() {
  return await pool.getConnection();
}

// Register user
router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const conn = await getConnection();
    const [existing] = await conn.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      conn.release();
      return res.status(409).json({ message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // Default role is 'user'. Admin must be set manually in DB for now.
    await conn.execute(
      'INSERT INTO users (full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, "user", NOW())',
      [fullName, email, passwordHash]
    );
    conn.release();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    conn.release();
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing authorization header' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Admin Login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }
  try {
    const conn = await getConnection();
    let rows;
    try {
      [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    } finally {
      conn.release();
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Strict Admin Check
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Admin Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function verifyAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
}

const multer = require('multer');

// --- PASSWORD RESET ROUTES ---

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      conn.release();
      // Use 200 OK even if email not found to prevent enumeration
      // But for debugging/dev, we might want to know. 
      // User requested functionality: "user will enter the email where he will get the password change link".
      // I'll return OK but not send email.
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const user = rows[0];
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    await conn.execute(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [token, expiry, user.id]
    );
    conn.release();

    // Send Email
    const resetLink = `http://127.0.0.1:5173/reset-password/${token}`;
    await emailService.sendPasswordResetEmail(email, resetLink);

    res.json({ message: 'If that email exists, a reset link has been sent.' });

  } catch (error) {
    console.error('Forgot Password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const conn = await getConnection();

    // Find user by token and check expiry
    const [rows] = await conn.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (rows.length === 0) {
      conn.release();
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = rows[0];
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password and clear token
    await conn.execute(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [passwordHash, user.id]
    );
    conn.release();

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset Password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});

// Upload Profile Picture
router.post('/profile/avatar', authenticateToken, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  try {
    const conn = await getConnection();
    await conn.execute(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [imageUrl, req.user.userId]
    );
    conn.release();

    res.json({ message: 'Profile picture updated', imageUrl });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const conn = await getConnection();

    const [rows] = await conn.execute('SELECT id, full_name, email, phone, location, bio, role, has_premium_access, created_at, profile_picture FROM users WHERE id = ?', [req.user.userId]);
    conn.release();
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, email, phone, location, bio } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }

  try {
    const conn = await getConnection();
    try {
      // Check email uniqueness if changed
      const [existing] = await conn.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.userId]
      );
      if (existing.length > 0) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      // Update
      await conn.execute(
        'UPDATE users SET full_name = ?, email = ?, phone = ?, location = ?, bio = ? WHERE id = ?',
        [name, email, phone || null, location || null, bio || null, req.user.userId]
      );

      // Return updated info
      res.json({
        message: 'Profile updated successfully',
        user: { name, email, phone, location, bio }
      });

    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all destinations
router.get('/destinations', async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM destinations ORDER BY created_at DESC');
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Destinations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get destination by ID
router.get('/destinations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM destinations WHERE id = ?', [id]);
    conn.release();
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Destination by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get destinations by category
router.get('/destinations/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM destinations WHERE category = ? ORDER BY created_at DESC', [category]);
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Destinations by category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all tours
router.get('/tours', async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT t.*, d.name as destination_name, d.region,
             g.name as guide_name, g.is_verified as guide_verified, g.image_url as guide_image
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN guides g ON t.guide_id = g.id
      ORDER BY t.created_at DESC
    `);
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Tours error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get tours by category
router.get('/tours/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT t.*, d.name as destination_name, d.region
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      WHERE t.category = ?
      ORDER BY t.created_at DESC
    `, [category]);
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Tours by category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get tour by ID
router.get('/tours/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT t.*, d.name as destination_name, d.region,
             g.name as guide_name, g.is_verified as guide_verified, g.image_url as guide_image, g.whatsapp_number
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN guides g ON t.guide_id = g.id
      WHERE t.id = ?
    `, [id]);
    conn.release();
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Tour by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create booking (protected)
router.post('/bookings', authenticateToken, async (req, res) => {
  const { tourId, bookingDate, totalPrice, guests } = req.body;
  if (!tourId || !bookingDate || !totalPrice) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const conn = await getConnection();

    // Fetch tour title for snapshot
    const [tours] = await conn.execute('SELECT title, destination_id FROM tours WHERE id = ?', [tourId]);
    const tourTitle = tours.length > 0 ? tours[0].title : 'Unknown Tour';

    // Fetch user details for email
    const [users] = await conn.execute('SELECT full_name, email FROM users WHERE id = ?', [req.user.userId]);
    const user = users[0];

    const [result] = await conn.execute(
      'INSERT INTO bookings (user_id, tour_id, booking_date, total_price, guests, booked_tour_title) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.userId, tourId, bookingDate, totalPrice, guests || 1, tourTitle]
    );

    // Send email asynchronously (fire and forget)
    const bookingDetails = {
      booking_date: bookingDate,
      guests: guests || 1,
      total_price: totalPrice
    };
    const tourDetails = {
      title: tourTitle
    };

    if (user) {
      emailService.sendBookingConfirmation(bookingDetails, tourDetails, user).catch(err => console.error('Email send failed:', err));
    }

    conn.release();
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user bookings (protected)
router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT b.*, 
             COALESCE(b.booked_tour_title, t.title, 'Tour Details Unavailable') as tour_title, 
             t.image_url, t.description as tour_description, t.duration_hours,
             d.name as location,
             g.name as guide_name, g.contact as guide_contact
      FROM bookings b
      LEFT JOIN tours t ON b.tour_id = t.id
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN guides g ON b.guide_id = g.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.userId]);
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel booking (protected)
router.put('/bookings/:id/cancel', authenticateToken, async (req, res) => {
  const bookingId = req.params.id;
  try {
    const conn = await getConnection();
    // Verify ownership and status
    const [rows] = await conn.execute('SELECT user_id, status FROM bookings WHERE id = ?', [bookingId]);
    if (rows.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (rows[0].user_id !== req.user.userId) {
      conn.release();
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (rows[0].status === 'cancelled') {
      conn.release();
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    await conn.execute('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', bookingId]);
    conn.release();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add to wishlist (protected)
router.post('/wishlist', authenticateToken, async (req, res) => {
  const { itemId, itemType } = req.body;
  if (!itemId || !itemType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const conn = await getConnection();
    // Check if already in wishlist
    const [existing] = await conn.execute(
      'SELECT id FROM wishlist WHERE user_id = ? AND item_id = ? AND item_type = ?',
      [req.user.userId, itemId, itemType]
    );
    if (existing.length > 0) {
      conn.release();
      return res.status(409).json({ message: 'Item already in wishlist' });
    }
    await conn.execute(
      'INSERT INTO wishlist (user_id, item_id, item_type) VALUES (?, ?, ?)',
      [req.user.userId, itemId, itemType]
    );
    conn.release();
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user wishlist (protected)
router.get('/wishlist', authenticateToken, async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT w.*, t.title as tour_title, t.image_url, d.name as destination_name
      FROM wishlist w
      LEFT JOIN tours t ON w.item_id = t.id AND w.item_type = 'tour'
      LEFT JOIN destinations d ON w.item_id = d.id AND w.item_type = 'destination'
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [req.user.userId]);
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove from wishlist (protected)
router.delete('/wishlist/:type/:itemId', authenticateToken, async (req, res) => {
  const { type, itemId } = req.params;
  try {
    const conn = await getConnection();
    const [result] = await conn.execute(
      'DELETE FROM wishlist WHERE item_id = ? AND item_type = ? AND user_id = ?',
      [itemId, type, req.user.userId]
    );
    conn.release();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove wishlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add review (protected)
router.post('/reviews', authenticateToken, async (req, res) => {
  const { tourId, rating, comment } = req.body;
  if (!tourId || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  try {
    const conn = await getConnection();
    await conn.execute(
      'INSERT INTO reviews (user_id, tour_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.userId, tourId, rating, comment || null]
    );
    // Update tour rating
    await conn.execute(`
      UPDATE tours
      SET rating = (SELECT AVG(rating) FROM reviews WHERE tour_id = ?),
          review_count = (SELECT COUNT(*) FROM reviews WHERE tour_id = ?)
      WHERE id = ?
    `, [tourId, tourId, tourId]);
    conn.release();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get reviews for a tour
router.get('/reviews/:tourId', async (req, res) => {
  const { tourId } = req.params;
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT r.*, u.full_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.tour_id = ?
      ORDER BY r.created_at DESC
    `, [tourId]);
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- ADMIN ROUTES ---

// Create new tour (Admin)
router.post('/admin/tours', authenticateToken, verifyAdmin, async (req, res) => {
  const { title, description, destinationId, category, price, duration, maxParticipants, imageUrl, guideId } = req.body;

  if (!title || !destinationId || !price) {
    return res.status(400).json({ message: 'Title, Destination, and Price are required' });
  }

  try {
    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO tours (title, description, destination_id, category, price, duration_hours, max_participants, image_url, guide_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [title, description || '', destinationId, category || 'General', price, duration || 0, maxParticipants || 10, imageUrl || '', guideId || null]
    );
    conn.release();
    res.status(201).json({ message: 'Tour created successfully', tourId: result.insertId });
  } catch (error) {
    console.error('Create Tour error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Admin Analytics
router.get('/admin/analytics', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();

    // Total Users
    const [userRows] = await conn.execute('SELECT COUNT(*) as count FROM users');
    const totalUsers = userRows[0].count;

    // Total Bookings
    const [bookingRows] = await conn.execute('SELECT COUNT(*) as count FROM bookings');
    const totalBookings = bookingRows[0].count;

    // Total Revenue
    const [revenueRows] = await conn.execute('SELECT SUM(total_price) as total FROM bookings');
    const totalRevenue = revenueRows[0].total || 0;

    conn.release();

    res.json({
      totalUsers,
      totalBookings,
      totalRevenue: parseFloat(totalRevenue)
    });
  } catch (error) {
    console.error('Admin Analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All Users (Admin)
router.get('/admin/users', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT u.id, u.full_name, u.email, u.created_at, u.role,
      (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id) as total_bookings
      FROM users u
      ORDER BY u.created_at DESC
    `);
    conn.release();

    // Map to frontend expected structure
    const users = rows.map(u => ({
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      created_at: u.created_at,
      role: u.role,
      customer_data: {
        total_bookings: u.total_bookings
      }
    }));

    res.json(users);
  } catch (error) {
    console.error('Admin Users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete User (Admin)
router.delete('/admin/users/:id', authenticateToken, verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Prevent self-deletion
  if (Number(userId) === Number(req.user.userId)) {
    return res.status(400).json({ message: 'You cannot delete your own admin account.' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1. Delete user wishlist items
    await conn.execute('DELETE FROM wishlist WHERE user_id = ?', [userId]);

    // 2. Delete user reviews
    await conn.execute('DELETE FROM reviews WHERE user_id = ?', [userId]);

    // 3. Delete user transactions
    await conn.execute('DELETE FROM transactions WHERE user_id = ?', [userId]);

    // 4. Delete user bookings
    await conn.execute('DELETE FROM bookings WHERE user_id = ?', [userId]);

    // 5. Check if user is a guide and clean up guide records
    const [guides] = await conn.execute('SELECT id FROM guides WHERE user_id = ?', [userId]);
    if (guides.length > 0) {
      const guideId = guides[0].id;
      // Set guide_id to NULL in bookings where this guide was assigned
      await conn.execute('UPDATE bookings SET guide_id = NULL, status = "confirmed" WHERE guide_id = ?', [guideId]);
      // Delete documents and portfolio
      await conn.execute('DELETE FROM guide_documents WHERE guide_id = ?', [guideId]);
      await conn.execute('DELETE FROM guide_portfolio WHERE guide_id = ?', [guideId]);
      // Delete guide profile
      await conn.execute('DELETE FROM guides WHERE id = ?', [guideId]);
    }

    // 6. Delete user account
    const [result] = await conn.execute('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ message: 'User not found' });
    }

    await conn.commit();
    conn.release();
    res.json({ message: 'User and all associated records deleted successfully.' });

  } catch (error) {
    console.error('Delete User error:', error);
    if (conn) {
      await conn.rollback();
      conn.release();
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All Bookings (Admin)
router.get('/admin/bookings', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT b.id, b.booking_date, b.total_price, b.created_at, b.status,
             b.user_id,
             u.full_name as user_name,
             t.title as tour_title,
             g.name as guide_name,
             g.id as guide_id
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN tours t ON b.tour_id = t.id
      LEFT JOIN guides g ON b.guide_id = g.id
      ORDER BY b.created_at DESC
    `);
    conn.release();

    const bookings = rows.map(b => ({
      id: b.id.toString(),
      user_id: b.user_id,
      booking_date: b.booking_date,
      total_price: b.total_price,
      status: b.status || 'confirmed',
      user_profiles: {
        full_name: b.user_name
      },
      tours: {
        title: b.tour_title
      },
      guide: b.guide_id ? {
        id: b.guide_id,
        name: b.guide_name
      } : null
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Admin Bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- GUIDES MANAGEMENT ---

// Get all guides
router.get('/admin/guides', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM guides ORDER BY name ASC');
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Get Guides error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add new guide
router.post('/admin/guides', authenticateToken, verifyAdmin, async (req, res) => {
  const { name, contact, specialty, languages, experience_years, image_url } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      'INSERT INTO guides (name, contact, specialty, languages, experience_years, image_url, whatsapp_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, contact, specialty, languages || 'English', experience_years || 0, image_url || '', req.body.whatsapp_number || '']
    );
    conn.release();
    res.status(201).json({ message: 'Guide added successfully' });
  } catch (error) {
    console.error('Add Guide error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify/Unverify Guide


// Assign guide to booking
router.put('/admin/bookings/:id/assign', authenticateToken, verifyAdmin, async (req, res) => {
  const { guideId } = req.body;
  const bookingId = req.params.id;
  try {
    const conn = await getConnection();

    if (!guideId || guideId === 'unassign') {
      // Unassign Limit: Set guide_id to NULL and status to confirmed (or keeps current status aside from assigned)
      await conn.execute(
        'UPDATE bookings SET guide_id = NULL, status = ? WHERE id = ?',
        ['confirmed', bookingId]
      );
    } else {
      // Assign Guide
      await conn.execute(
        'UPDATE bookings SET guide_id = ?, status = ? WHERE id = ?',
        [guideId, 'assigned', bookingId]
      );

      // Fetch details for email notification
      const [rows] = await conn.execute(`
        SELECT b.booking_date, b.guests,
               u.email, u.full_name,
               t.title,
               g.name as guide_name, g.contact as guide_contact, g.specialty as guide_specialty,
               g.languages as guide_languages, g.experience_years as guide_experience, g.image_url as guide_image
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN tours t ON b.tour_id = t.id
        JOIN guides g ON g.id = ? 
        WHERE b.id = ?
    `, [guideId, bookingId]);

      if (rows.length > 0) {
        const data = rows[0];
        const booking = { booking_date: data.booking_date, guests: data.guests };
        const tour = { title: data.title };
        const user = { email: data.email, full_name: data.full_name };
        const guide = {
          name: data.guide_name,
          contact: data.guide_contact,
          specialty: data.guide_specialty,
          languages: data.guide_languages,
          experience_years: data.guide_experience,
          image_url: data.guide_image
        };

        // Fire and forget email
        if (typeof emailService !== 'undefined' && emailService.sendGuideAssignedEmail) {
          emailService.sendGuideAssignedEmail(booking, tour, guide, user)
            .catch(err => console.error('Failed to send guide assignment email:', err));
        }
      }
    }

    conn.release();
    res.json({ message: 'Guide updated successfully' });

  } catch (error) {
    console.error('Assign Guide error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Admin Profile (Email/Password)
router.put('/admin/profile', authenticateToken, verifyAdmin, async (req, res) => {
  const { email, password, newPassword } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const conn = await getConnection();
    try {
      // 1. Verify credentials (current password)
      const [rows] = await conn.execute('SELECT * FROM users WHERE id = ?', [req.user.userId]);
      if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

      const admin = rows[0];
      // If updating password, require current password check
      if (newPassword || (email !== admin.email)) {
        if (!password) return res.status(400).json({ message: 'Current password required to change sensitive info' });
        const match = await bcrypt.compare(password, admin.password_hash);
        if (!match) return res.status(401).json({ message: 'Incorrect current password' });
      }

      // 2. Update
      let query = 'UPDATE users SET email = ?';
      let params = [email];

      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        query += ', password_hash = ?';
        params.push(hashedPassword);
      }

      query += ' WHERE id = ?';
      params.push(req.user.userId);

      await conn.execute(query, params);

      res.json({ message: 'Admin profile updated successfully. Please re-login if you changed credentials.' });

    } catch (dbError) {
      if (dbError.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email already currently in use by another account.' });
      }
      throw dbError;
    } finally {
      conn.release();
    }

  } catch (error) {
    console.error('Update Admin Profile error:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

// --- REVIEWS ---

// Submit a review
router.post('/reviews', authenticateToken, async (req, res) => {
  const { tour_id, rating, comment } = req.body;
  const user_id = req.user.userId;

  if (!tour_id || !rating) {
    return res.status(400).json({ message: 'Tour ID and rating are required' });
  }

  try {
    const conn = await getConnection();

    // Optional: Verify user booked this tour and date < now
    // For now, we trust the UI state (button only shows if allowed)

    await conn.execute(
      'INSERT INTO reviews (user_id, tour_id, rating, comment) VALUES (?, ?, ?, ?)',
      [user_id, tour_id, rating, comment]
    );

    conn.release();
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Submit Review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get reviews for a tour
router.get('/reviews/:tourId', async (req, res) => {
  const { tourId } = req.params;
  try {
    const conn = await getConnection();

    // Get reviews with user names
    const [rows] = await conn.execute(`
      SELECT r.*, u.full_name as user_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.tour_id = ?
      ORDER BY r.created_at DESC
    `, [tourId]);

    // Calculate average
    const [avgRows] = await conn.execute(`
        SELECT AVG(rating) as avgRating, COUNT(*) as count 
        FROM reviews 
        WHERE tour_id = ?
    `, [tourId]);

    conn.release();

    res.json({
      reviews: rows,
      average: avgRows[0].avgRating || 0,
      count: avgRows[0].count || 0
    });
  } catch (error) {
    console.error('Get Reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Contact Form Submission
router.post('/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO contact_messages (name, email, phone, subject, message, created_at)
           VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email, phone || '', subject || 'General Inquiry', message]
    );
    conn.release();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact Form error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- ADMIN MESSAGES & REVIEWS ---

// Get all messages
router.get('/admin/messages', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Admin Messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete message
router.delete('/admin/messages/:id', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    await conn.execute('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    conn.release();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Delete Message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all reviews (for admin)
router.get('/admin/reviews', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT r.*, u.full_name as user_name, t.title as tour_title
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN tours t ON r.tour_id = t.id
      ORDER BY r.created_at DESC
    `);
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Admin Reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete review
router.delete('/admin/reviews/:id', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    await conn.execute('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    conn.release();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete Review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// --- GUIDE ROUTES (GOVERNMENT DEMO PHASE 2) ---

// Guide Registration (Separate from User Registration)
router.post('/guide/register', async (req, res) => {
  const { email, password, fullName, phone } = req.body;

  if (!email || !password || !fullName || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const conn = await getConnection();

    // Check if email exists
    const [existing] = await conn.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      conn.release();
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 1. Create User with role 'guide'
    const [userRes] = await conn.execute(
      'INSERT INTO users (full_name, email, password_hash, role, phone, created_at) VALUES (?, ?, ?, "guide", ?, NOW())',
      [fullName, email, passwordHash, phone]
    );
    const userId = userRes.insertId;

    // 2. Create Guide Entry linked to User
    await conn.execute(
      'INSERT INTO guides (name, contact, status, user_id, is_verified, created_at) VALUES (?, ?, "available", ?, 0, NOW())',
      [fullName, phone, userId]
    );

    conn.release();
    res.status(201).json({ message: 'Guide registered successfully. Please login to upload documents.' });

  } catch (error) {
    console.error('Guide Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Guide Dashboard Data
router.get('/guide/dashboard', authenticateToken, async (req, res) => {
  if (req.user.role !== 'guide') return res.status(403).json({ message: 'Access denied' });

  try {
    const conn = await getConnection();

    // Get Guide Details
    const [guideRows] = await conn.execute('SELECT * FROM guides WHERE user_id = ?', [req.user.userId]);
    if (guideRows.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Guide profile not found' });
    }
    const guide = guideRows[0];

    // Get Guide Documents
    const [docs] = await conn.execute('SELECT * FROM guide_documents WHERE guide_id = ?', [guide.id]);

    // Get Guide Portfolio
    const [portfolio] = await conn.execute('SELECT * FROM guide_portfolio WHERE guide_id = ? ORDER BY created_at DESC', [guide.id]);

    // Get Recent Assigned Bookings
    const [bookings] = await conn.execute(`
      SELECT b.*, t.title as tour_title, u.full_name as user_name, u.phone as user_contact
      FROM bookings b
      JOIN tours t ON b.tour_id = t.id
      JOIN users u ON b.user_id = u.id
      WHERE b.guide_id = ?
      ORDER BY b.booking_date ASC
      LIMIT 10
    `, [guide.id]);

    conn.release();
    res.json({
      profile: guide,
      documents: docs,
      portfolio: portfolio,
      bookings: bookings
    });

  } catch (error) {
    console.error('Guide Dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload Guide Document
// Note: In a real app we would use Multer middleware here. 
// For demo, we might mock the upload or use existing multer if configured.
// Assuming client sends a 'fileUrl' (maybe from a separate upload endpoint or simulated).
// Let's add a generic upload endpoint first if not exists, or just accept URL.
// We will accept 'fileUrl' in body for simplicity or add Multer later.
// Using existing 'upload' middleware defined above for simplicity
// Note: Existing middleware restricts to images. Ensure documents are uploaded as images for this demo.

// Generic File Upload Endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // Return accessible URL. Server static 'uploads' folder must be served.
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

router.post('/guide/documents', authenticateToken, async (req, res) => {
  const { documentType, fileUrl } = req.body; // Expects JSON with URL from /upload
  if (req.user.role !== 'guide') return res.status(403).json({ message: 'Access denied' });

  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id FROM guides WHERE user_id = ?', [req.user.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Guide not found' });

    // Check if document of this type already exists for this guide and delete it (or clean up file)
    // Ideally we should delete the old file from disk too, but for now we just remove the DB record
    await conn.execute(
      'DELETE FROM guide_documents WHERE guide_id = ? AND document_type = ?',
      [rows[0].id, documentType]
    );

    await conn.execute(
      'INSERT INTO guide_documents (guide_id, document_type, file_url, status) VALUES (?, ?, ?, "pending")',
      [rows[0].id, documentType, fileUrl]
    );
    conn.release();
    res.json({ message: 'Document uploaded' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/guide/portfolio', authenticateToken, async (req, res) => {
  const { imageUrl, caption } = req.body;
  if (req.user.role !== 'guide') return res.status(403).json({ message: 'Access denied' });

  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id FROM guides WHERE user_id = ?', [req.user.userId]);

    await conn.execute(
      'INSERT INTO guide_portfolio (guide_id, image_url, caption) VALUES (?, ?, ?)',
      [rows[0].id, imageUrl, caption || '']
    );
    conn.release();
    res.json({ message: 'Portfolio image added' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Guide Status
router.put('/guide/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  console.log('Toggle Status Request:', { userId: req.user.userId, status }); // DEBUG

  if (req.user.role !== 'guide') return res.status(403).json({ message: 'Access denied' });

  try {
    const conn = await getConnection();
    const [result] = await conn.execute(
      'UPDATE guides SET status = ? WHERE user_id = ?',
      [status, req.user.userId]
    );
    console.log('Update Result:', result); // DEBUG
    conn.release();
    res.json({ message: `Status updated to ${status}` });
  } catch (error) {
    console.error('Update Status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/guide/portfolio/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'guide') return res.status(403).json({ message: 'Access denied' });
  const imageId = req.params.id;
  console.log('Delete Portfolio Request:', { userId: req.user.userId, imageId }); // DEBUG

  try {
    const conn = await getConnection();
    // Verify ownership
    const [rows] = await conn.execute(
      'SELECT gp.id FROM guide_portfolio gp JOIN guides g ON gp.guide_id = g.id WHERE gp.id = ? AND g.user_id = ?',
      [imageId, req.user.userId]
    );
    console.log('Ownership Check Rows:', rows); // DEBUG

    if (rows.length === 0) {
      conn.release();
      console.log('Image not found or access denied for user', req.user.userId); // DEBUG
      return res.status(404).json({ message: 'Image not found or access denied' });
    }

    await conn.execute('DELETE FROM guide_portfolio WHERE id = ?', [imageId]);
    conn.release();
    res.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Delete Portfolio error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Guide Profile
router.put('/guide/profile', authenticateToken, async (req, res) => {
  const { name, contact, bio, languages, experience_years, specialty } = req.body;

  if (req.user.role !== 'guide') return res.status(403).json({ message: 'Access denied' });

  try {
    const conn = await getConnection();

    // Update Guide Details
    await conn.execute(
      `UPDATE guides 
       SET name = ?, contact = ?, bio = ?, languages = ?, experience_years = ?, specialty = ? 
       WHERE user_id = ?`,
      [name, contact, bio, languages, experience_years, specialty, req.user.userId]
    );
    conn.release();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Full Guide Details for Admin
router.get('/admin/guides/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const conn = await getConnection();
    const [guideRows] = await conn.execute(`
      SELECT g.*, u.email 
      FROM guides g 
      LEFT JOIN users u ON g.user_id = u.id 
      WHERE g.id = ?
    `, [req.params.id]);

    if (guideRows.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Guide not found' });
    }
    const guide = guideRows[0];

    // Get Documents
    const [documents] = await conn.execute('SELECT * FROM guide_documents WHERE guide_id = ?', [guide.id]);

    // Get Portfolio
    const [portfolio] = await conn.execute('SELECT * FROM guide_portfolio WHERE guide_id = ? ORDER BY created_at DESC', [guide.id]);

    conn.release();

    res.json({
      profile: guide,
      documents,
      portfolio
    });

  } catch (error) {
    console.error('Fetch Guide Details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify/Reject Guide
// Verify/Reject Guide
router.put('/admin/guides/:id/verify', authenticateToken, async (req, res) => {
  const guideId = req.params.id;
  console.log('VERIFY HIT - ID:', guideId, 'Body:', req.body);

  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  if (!guideId) return res.status(400).json({ message: 'Guide ID required' });

  const { status, rejectionReason } = req.body; // status: 'verified' | 'rejected'
  const isVerified = status === 'verified' ? 1 : 0;
  const reason = status === 'rejected' ? (rejectionReason || null) : null;

  try {
    const conn = await getConnection();

    // Explicitly cast to string
    const guideIdString = String(guideId);

    await conn.execute(
      'UPDATE guides SET is_verified = ?, rejection_reason = ? WHERE id = ?',
      [isVerified, reason, guideIdString]
    );

    conn.release();
    res.json({ message: `Guide ${status === 'verified' ? 'verified' : 'rejected'} successfully` });

  } catch (error) {
    console.error('Verify Guide error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
// --- CONTACT & MESSAGES ---

// Send "Contact Us" message
router.post('/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const conn = await getConnection();
    await conn.execute(
      'INSERT INTO messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, phone || null, subject || 'General Inquiry', message]
    );
    conn.release();

    // Optional: Send email notification to admin using emailService
    // await emailService.sendContactNotification(name, email, subject, message);

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all messages (Admin)
router.get('/admin/messages', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM messages ORDER BY created_at DESC');
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Get Messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete message (Admin)
router.delete('/admin/messages/:id', authenticateToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    await conn.execute('DELETE FROM messages WHERE id = ?', [id]);
    conn.release();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete Message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- PAYMENT ROUTES (MOCK) ---

router.post('/payment/create-order', authenticateToken, async (req, res) => {
  // In a real app, this would interact with a payment gateway (Razorpay/Stripe)
  // For now, we just return a mock "order ID"
  res.json({
    orderId: 'ORDER_' + Date.now(),
    amount: 999, // 999 INR
    currency: 'INR'
  });
});

router.post('/payment/verify', authenticateToken, async (req, res) => {
  const { orderId } = req.body; // In real app, verify signature/payment status from gateway

  try {
    const conn = await getConnection();

    // 1. Record Transaction
    await conn.execute(
      'INSERT INTO transactions (user_id, amount, description) VALUES (?, ?, ?)',
      [req.user.userId, 999.00, 'Hidden Gems Premium Access']
    );

    // 2. Grant Access
    await conn.execute(
      'UPDATE users SET has_premium_access = TRUE WHERE id = ?',
      [req.user.userId]
    );

    conn.release();

    res.json({ success: true, message: 'Payment successful! Access granted.' });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
// --- EVENTS ROUTES ---

// Get all events
router.get('/events', async (req, res) => {
  try {
    const conn = await getConnection();
    // Fetch published events, sorted by date (nearest first)
    const [rows] = await conn.execute(`
            SELECT * FROM events 
            WHERE status = 'published' AND start_date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
            ORDER BY start_date ASC
        `);
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Get Events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM events WHERE id = ?', [req.params.id]);
    conn.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get Event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: Create Event
router.post('/admin/events', authenticateToken, verifyAdmin, async (req, res) => {
  const { title, description, start_date, end_date, location, image_url, gallery_images, category, price, ticket_url, mood, highlights } = req.body;
  if (!title || !start_date || !location) {
    return res.status(400).json({ message: 'Title, Start Date, and Location are required' });
  }

  try {
    const conn = await getConnection();
    // Ensure highlights is stored as JSON string if it's an array, or plain text
    const highlightsStr = Array.isArray(highlights) ? JSON.stringify(highlights) : highlights;
    const galleryStr = Array.isArray(gallery_images) ? JSON.stringify(gallery_images) : gallery_images;

    await conn.execute(
      `INSERT INTO events (title, description, start_date, end_date, location, image_url, gallery_images, category, price, ticket_url, mood, highlights, source, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual', 'published')`,
      [title, description || '', start_date, end_date || null, location, image_url || '', galleryStr || '[]', category || 'Other', price || 'Free', ticket_url || '', mood || '', highlightsStr || '']
    );
    conn.release();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Create Event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: Delete Event
router.delete('/admin/events/:id', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    await conn.execute('DELETE FROM events WHERE id = ?', [req.params.id]);
    conn.release();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete Event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: Sync Google Events via OpenWebNinja Direct API
router.post('/admin/events/sync', authenticateToken, verifyAdmin, async (req, res) => {
  const apiKey = process.env.RAPIDAPI_KEY; // Using the same env var name for convenience, though it's a direct key now
  if (!apiKey) {
    return res.status(500).json({ message: 'RAPIDAPI_KEY (Direct API Key) is missing in .env file' });
  }

  try {
    const axios = require('axios');

    // Direct OpenWebNinja Endpoint
    // Confirmed via debug script that /search-events works with x-api-key
    const options = {
      method: 'GET',
      url: 'https://api.openwebninja.com/realtime-events-data/search-events',
      params: {
        query: 'Events in Goa',
        date: 'any',
        is_virtual: 'false',
        start: '0',
        timezone: 'Asia/Kolkata'
      },
      headers: {
        'x-api-key': apiKey
      }
    };

    const response = await axios.request(options);
    // Robustly handle data structure
    const eventsData = response.data.data || response.data.events || [];

    if (eventsData.length === 0) {
      console.log('No events found inside response keys:', Object.keys(response.data));
    }

    let addedCount = 0;
    const conn = await getConnection();

    for (const event of eventsData) {
      // Map Fields
      const title = event.title || event.name || 'Untitled Event';
      const description = event.description || 'Event in Goa';

      // Parse Date
      let start_date = new Date();
      if (event.start_time) {
        start_date = new Date(event.start_time * 1000);
        if (isNaN(start_date.getTime())) start_date = new Date(event.start_time);
      } else if (event.date && event.date.start_date) {
        start_date = new Date(event.date.start_date);
      }

      const end_date = null;

      const venue = event.venue || {};
      const location = event.location || venue.full_address || venue.name || 'Goa, India';

      const image_url = event.thumbnail || event.image || '';
      const category = 'Other';

      const ticket_info = event.ticket_info || [];
      const price = ticket_info.length > 0 ? (ticket_info[0].cost || 'See Details') : 'See Details';
      const ticket_url = event.link || (ticket_info.length > 0 ? ticket_info[0].link : '') || '';

      const external_id = event.event_id || event.id || Math.random().toString(36).substring(7);

      // Upsert
      await conn.execute(
        `INSERT INTO events (title, description, start_date, end_date, location, image_url, category, price, ticket_url, source, external_id, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'google_events', ?, 'published')
                 ON DUPLICATE KEY UPDATE 
                 title = VALUES(title), description = VALUES(description), start_date = VALUES(start_date), 
                 location = VALUES(location), image_url = VALUES(image_url), ticket_url = VALUES(ticket_url)`,
        [title, description.substring(0, 500), start_date, end_date, location, image_url, category, price, ticket_url, external_id]
      );
      addedCount++;
    }

    conn.release();
    res.json({ message: `Sync successful! Processed ${eventsData.length} events.` });

  } catch (error) {
    console.error('API Sync error:', error);
    const msg = error.response ? JSON.stringify(error.response.data) : error.message;
    res.status(500).json({ message: 'Failed to sync with API', error: msg });
  }
});

module.exports = router;
