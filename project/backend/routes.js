const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const path = require('path');
const Razorpay = require('razorpay');
const router = express.Router();

const pool = require('./db');
const emailService = require('./emailService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password/${token}`;
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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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

// Create booking (protected, initialized with Razorpay payment details)
router.post('/bookings', authenticateToken, async (req, res) => {
  const { tourId, bookingDate, totalPrice, guests } = req.body;
  if (!tourId || !bookingDate || !totalPrice) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const conn = await pool.getConnection();

    // Fetch tour/place title for snapshot
    let tourTitle = 'Unknown Booking';
    if (String(tourId).startsWith('osm-')) {
      const [places] = await conn.execute('SELECT name FROM realtime_places_cache WHERE id = ?', [tourId]);
      tourTitle = places.length > 0 ? places[0].name : 'Live Place Reservation';
    } else {
      const [tours] = await conn.execute('SELECT title, destination_id FROM tours WHERE id = ?', [tourId]);
      tourTitle = tours.length > 0 ? tours[0].title : 'Unknown Tour';
    }

    // Fetch user details for email prefills
    const [users] = await conn.execute('SELECT full_name, email FROM users WHERE id = ?', [req.user.userId]);
    const user = users[0];

    // Create booking in "pending" status until payment completes
    const [result] = await conn.execute(
      'INSERT INTO bookings (user_id, tour_id, booking_date, total_price, guests, booked_tour_title, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
      [req.user.userId, String(tourId), bookingDate, totalPrice, guests || 1, tourTitle]
    );

    const bookingId = result.insertId;

    // Create a Razorpay Order
    const options = {
      amount: Math.round(totalPrice * 100), // in paise (e.g. ₹1000 = 100000 paise)
      currency: 'INR',
      receipt: `booking_${bookingId}`
    };

    const order = await razorpay.orders.create(options);

    conn.release();
    res.status(201).json({
      message: 'Booking initialized. Complete payment to confirm.',
      bookingId,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TDstsI3dZOt2yf',
      user: {
        name: user ? user.full_name : '',
        email: user ? user.email : ''
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify payment signature and confirm booking (protected)
router.post('/payments/verify', authenticateToken, async (req, res) => {
  const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  if (!bookingId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return res.status(400).json({ message: 'Missing payment details' });
  }

  try {
    // Generate signature locally to verify integrity
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed (Signature mismatch)' });
    }

    const conn = await pool.getConnection();

    // Fetch booking details
    const [bookings] = await conn.execute('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (bookings.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = bookings[0];

    // Update booking status to "confirmed"
    await conn.execute('UPDATE bookings SET status = "confirmed" WHERE id = ?', [bookingId]);

    // Send confirmation email
    const [users] = await conn.execute('SELECT full_name, email FROM users WHERE id = ?', [req.user.userId]);
    const user = users[0];

    const bookingDetails = {
      booking_date: booking.booking_date,
      guests: booking.guests || 1,
      total_price: booking.total_price
    };
    const tourDetails = {
      title: booking.booked_tour_title
    };

    if (user) {
      emailService.sendBookingConfirmation(bookingDetails, tourDetails, user)
        .catch(err => console.error('Payment confirmation email failed:', err));
    }

    conn.release();
    res.json({ success: true, message: 'Payment verified and booking confirmed successfully!' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user bookings (protected)
router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT b.*, 
             COALESCE(b.booked_tour_title, t.title, p.name, 'Booking Details Unavailable') as tour_title, 
             COALESCE(t.image_url, p.image, '') as image_url, 
             COALESCE(t.description, p.description, '') as tour_description, 
             t.duration_hours,
             COALESCE(d.name, p.location) as location,
             g.name as guide_name, g.contact as guide_contact
      FROM bookings b
      LEFT JOIN tours t ON b.tour_id = t.id
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN guides g ON b.guide_id = g.id
      LEFT JOIN realtime_places_cache p ON b.tour_id = p.id
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
    const conn = await pool.getConnection();
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
  const { itemId, itemType, placeDetails } = req.body;
  if (!itemId || !itemType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const conn = await pool.getConnection();
    
    // If it's a real-time place, make sure it is cached in the database
    if (['hotel', 'restaurant', 'cafe', 'club'].includes(itemType)) {
      const details = placeDetails || {};
      const name = details.name || 'Unnamed Place';
      const type = details.type || itemType;
      const location = details.location || 'Goa, India';
      const region = details.region || (details.latitude && details.latitude >= 15.45 ? 'North Goa' : 'South Goa') || 'Goa';
      const description = details.description || `A wonderful ${itemType} in Goa.`;
      const price_range = details.priceRange || details.price_range || 'Mid-range';
      const opening_hours = details.openingHours || details.opening_hours || '9:00 AM - 11:00 PM';
      const image = details.image || details.image_url || '';
      const rating = details.rating || 4.5;
      const review_count = details.reviewCount || details.review_count || 10;
      const latitude = details.latitude || null;
      const longitude = details.longitude || null;

      await conn.execute(`
        INSERT INTO realtime_places_cache (id, name, type, location, region, description, price_range, opening_hours, image, rating, review_count, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name), type = VALUES(type), location = VALUES(location), region = VALUES(region),
        description = VALUES(description), price_range = VALUES(price_range), opening_hours = VALUES(opening_hours),
        image = VALUES(image), rating = VALUES(rating), review_count = VALUES(review_count),
        latitude = VALUES(latitude), longitude = VALUES(longitude)
      `, [String(itemId), name, type, location, region, description, price_range, opening_hours, image, rating, review_count, latitude, longitude]);
    }

    // Check if already in wishlist
    const [existing] = await conn.execute(
      'SELECT id FROM wishlist WHERE user_id = ? AND item_id = ? AND item_type = ?',
      [req.user.userId, String(itemId), itemType]
    );
    if (existing.length > 0) {
      conn.release();
      return res.status(409).json({ message: 'Item already in wishlist' });
    }
    await conn.execute(
      'INSERT INTO wishlist (user_id, item_id, item_type) VALUES (?, ?, ?)',
      [req.user.userId, String(itemId), itemType]
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
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT w.*, 
             t.title as tour_title, t.image_url as tour_image_url,
             d.name as destination_name, d.image_url as destination_image_url,
             p.name as place_name, p.image as place_image, p.type as place_type, p.rating as place_rating, p.location as place_location
      FROM wishlist w
      LEFT JOIN tours t ON w.item_id = t.id AND w.item_type = 'tour'
      LEFT JOIN destinations d ON w.item_id = d.id AND w.item_type = 'destination'
      LEFT JOIN realtime_places_cache p ON w.item_id = p.id AND w.item_type IN ('hotel', 'restaurant', 'cafe', 'club')
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();

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


// --- AI ITINERARY PLANNER ROUTE ---
router.post('/ai/plan-itinerary', async (req, res) => {
  const { days, budget, interests } = req.body;
  if (!days || !budget) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const conn = await pool.getConnection();
    // Fetch all internal destinations to feed into the AI context (including ID and Category for linking)
    const [destinations] = await conn.execute('SELECT id, name, region, category, description FROM destinations');
    conn.release();

    // If Gemini API Key is provided, call Google Gemini to plan the itinerary
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Create a detailed ${days}-day itinerary for a trip to Goa.
Budget: ${budget}
Interests: ${interests}

Here is a list of internal places on our website that you MUST prioritize suggesting first:
${JSON.stringify(destinations)}

Combine these internal places with other real-time external attractions, activities, and dining places in Goa. 
Mark internal places as type "internal" and external places as type "external".
For internal places, you MUST include the correct 'placeId' (from the provided list) and 'placeCategory' (from the provided list, e.g. "beach", "temple", "church", "waterfall", "culture", "authentic").

For EVERY activity, you MUST estimate a realistic 'budget' range (e.g. "₹500 - ₹1500") and a realistic 'distance' (e.g. "5 km from center" or "10 km from previous activity").
Format the output as JSON matching the schema.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt
                    }
                  ]
                }
              ],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: "OBJECT",
                  properties: {
                    itinerary: {
                      type: "ARRAY",
                      items: {
                        type: "OBJECT",
                        properties: {
                          day: { type: "INTEGER" },
                          title: { type: "STRING" },
                          activities: {
                            type: "ARRAY",
                            items: {
                              type: "OBJECT",
                              properties: {
                                time: { type: "STRING" },
                                place: { type: "STRING" },
                                description: { type: "STRING" },
                                budget: { type: "STRING" },
                                distance: { type: "STRING" },
                                type: { type: "STRING", enum: ["internal", "external"] },
                                placeId: { type: "INTEGER" },
                                placeCategory: { type: "STRING" }
                              },
                              required: ["time", "place", "description", "budget", "distance", "type"]
                            }
                          }
                        },
                        required: ["day", "title", "activities"]
                      }
                    }
                  },
                  required: ["itinerary"]
                }
              }
            })
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API failed: ${response.statusText} - ${errText}`);
        }

        const result = await response.json();
        if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts[0]) {
          const generatedData = JSON.parse(result.candidates[0].content.parts[0].text);
          return res.json({ 
            itinerary: generatedData.itinerary, 
            message: 'Trip itinerary generated in real-time by Gemini AI!' 
          });
        }
      } catch (geminiError) {
        console.error('Failed to generate using live Gemini API, falling back to mock generator:', geminiError);
      }
    }

    // FALLBACK MOCK ITINERARY (if no key is provided, or API call fails)
    const localSpots = destinations.length > 0 ? destinations : [
      { id: 1, name: 'Calangute Beach', category: 'Beach', description: 'Queen of Beaches with water sports and lively shacks.' },
      { id: 2, name: 'Dudhsagar Waterfalls', category: 'Waterfall', description: 'Stunning four-tiered waterfall on the Mandovi River.' },
      { id: 3, name: 'Basilica of Bom Jesus', category: 'Church', description: 'UNESCO World Heritage church containing relic of St. Francis Xavier.' }
    ];

    const itinerary = Array.from({ length: days }).map((_, i) => {
      const spot = localSpots[i % localSpots.length];
      return {
        day: i + 1,
        title: `Day ${i + 1}: Discovering ${spot.name}`,
        activities: [
          {
            time: 'Morning',
            place: spot.name,
            description: spot.description,
            budget: '₹0 - ₹200',
            distance: '10 km from center',
            type: 'internal',
            placeId: spot.id,
            placeCategory: spot.category ? spot.category.toLowerCase() : 'beach'
          },
          {
            time: 'Afternoon',
            place: i % 2 === 0 ? 'Thalassa Restaurant (Siolim)' : 'Gunpowder (Anjuna)',
            description: 'Enjoy delicious meals at this highly rated external restaurant in Goa.',
            budget: '₹800 - ₹1500',
            distance: '15 km from morning spot',
            type: 'external'
          },
          {
            time: 'Evening',
            place: i % 2 === 0 ? 'Sunset at Anjuna Beach' : 'Cruising down Mandovi River',
            description: 'Relax and unwind with beautiful scenic views.',
            budget: '₹200 - ₹500',
            distance: '5 km from lunch spot',
            type: 'internal',
            placeId: 1,
            placeCategory: 'beach'
          }
        ]
      };
    });

    res.json({ 
      itinerary, 
      message: 'AI Plan generated successfully (Fallback Mock Mode. Set GEMINI_API_KEY in backend/.env for real AI!)' 
    });
  } catch (error) {
    console.error('AI Planner error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- EVENTS MANAGEMENT ROUTES ---
router.get('/events/live', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [events] = await conn.execute(
      'SELECT * FROM events WHERE status = "published" AND (end_date >= NOW() OR (end_date IS NULL AND start_date >= DATE_SUB(NOW(), INTERVAL 1 DAY))) ORDER BY start_date ASC LIMIT 10'
    );
    conn.release();
    res.json(events);
  } catch (error) {
    console.error('Fetch live events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/events', async (req, res) => {
  const { upcoming } = req.query;
  try {
    const conn = await pool.getConnection();
    let query = 'SELECT * FROM events';
    
    if (upcoming === 'true') {
      query += ' WHERE status = "published" AND (end_date >= NOW() OR (end_date IS NULL AND start_date >= DATE_SUB(NOW(), INTERVAL 1 DAY)))';
    }
    
    query += ' ORDER BY start_date DESC';
    const [events] = await conn.execute(query);
    conn.release();
    res.json(events);
  } catch (error) {
    console.error('Fetch all events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/events', async (req, res) => {
  const { title, description, start_date, end_date, location, image_url, category, price, source, status } = req.body;
  if (!title || !start_date) {
    return res.status(400).json({ message: 'Title and start date are required' });
  }
  
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.execute(
      'INSERT INTO events (title, description, start_date, end_date, location, image_url, category, price, source, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description || null, start_date, end_date || null, location || null, image_url || null, category || null, price || null, source || 'manual', status || 'published']
    );
    conn.release();
    res.status(201).json({ message: 'Event created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, location, image_url, category, price, status } = req.body;
  
  try {
    const conn = await pool.getConnection();
    await conn.execute(
      'UPDATE events SET title=?, description=?, start_date=?, end_date=?, location=?, image_url=?, category=?, price=?, status=? WHERE id=?',
      [title, description, start_date, end_date, location, image_url, category, price, status, id]
    );
    conn.release();
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    await conn.execute('DELETE FROM events WHERE id=?', [id]);
    conn.release();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/events/sync', async (req, res) => {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  let syncedCount = 0;

  try {
    // 1. Attempt to fetch real-time events from Ticketmaster API
    let ticketmasterEvents = [];
    try {
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=Goa`
      );
      if (response.ok) {
        const data = await response.json();
        if (data._embedded && data._embedded.events) {
          ticketmasterEvents = data._embedded.events;
        }
      }
    } catch (apiErr) {
      console.error('Ticketmaster API fetch failed, using fallback:', apiErr.message);
    }

    const conn = await pool.getConnection();

    // 2. If Ticketmaster returns empty, load a rich database of actual Goan upcoming events
    if (ticketmasterEvents.length === 0) {
      const today = new Date();
      
      const fallbackEvents = [
        {
          title: 'Sunburn Festival Goa',
          description: 'Asia\'s premier electronic dance music festival featuring world-renowned DJs, massive stage designs, and electric vibes on the coast of Vagator.',
          start_date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 16:00:00', // 10 days from now
          end_date: new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 22:00:00',
          location: 'Vagator Beach, North Goa',
          image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80',
          category: 'Music',
          price: '₹3000 - ₹8000',
          source: 'realtime_sync'
        },
        {
          title: 'Goa Carnival 2026',
          description: 'A vibrant celebration of music, dance, and culture. Featuring colorful floats, street parades, traditional Goan food, and masks across major towns.',
          start_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 10:00:00', // 2 days from now
          end_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 20:00:00',
          location: 'Panaji Promenade, Goa',
          image_url: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80',
          category: 'Cultural',
          price: 'Free Entry',
          source: 'realtime_sync'
        },
        {
          title: 'Anjuna Wednesday Flea Market Party',
          description: 'Browse through local handicrafts, clothing, spices, and musical instruments, while enjoying live acoustic performances and tasty street eats near Anjuna Beach.',
          start_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 09:00:00', // 5 days from now
          end_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 18:00:00',
          location: 'Anjuna Beach, North Goa',
          image_url: 'https://images.unsplash.com/photo-1520156473893-b422b96b250d?auto=format&fit=crop&q=80',
          category: 'Nightlife',
          price: 'Free Entry',
          source: 'realtime_sync'
        },
        {
          title: 'Silent Noise Club Night',
          description: 'Unique silent disco clubbing experience. Wear wireless headphones, switch between multiple live DJs playing EDM, Rock, and Hip-hop overlooking Palolem Beach.',
          start_date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 21:00:00', // 4 days from now
          end_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 03:00:00',
          location: 'Palolem Beach, South Goa',
          image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80',
          category: 'Music',
          price: '₹1200 - ₹2000',
          source: 'realtime_sync'
        },
        {
          title: 'Goa Food & Cultural Festival',
          description: 'Savor traditional Goan fish curries, vindaloos, and feni-cocktails prepared by local culinary masters, paired with Goan folk performances.',
          start_date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 11:00:00', // 15 days from now
          end_date: new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 23:00:00',
          location: 'Miramar Beach, Panaji',
          image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
          category: 'Food',
          price: 'Free Entry (Pay for Food)',
          source: 'realtime_sync'
        }
      ];

      for (const ev of fallbackEvents) {
        // Check if event already exists to avoid duplicate entries
        const [existing] = await conn.execute('SELECT id FROM events WHERE title = ? AND DATE(start_date) = DATE(?)', [ev.title, ev.start_date]);
        if (existing.length === 0) {
          await conn.execute(
            'INSERT INTO events (title, description, start_date, end_date, location, image_url, category, price, source, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "published")',
            [ev.title, ev.description, ev.start_date, ev.end_date, ev.location, ev.image_url, ev.category, ev.price, ev.source]
          );
          syncedCount++;
        }
      }
    } else {
      // 3. Process Ticketmaster events
      for (const item of ticketmasterEvents) {
        const title = item.name;
        const description = item.info || item.description || 'An exciting event in Goa synced from Ticketmaster.';
        const start_date = item.dates.start.localDate + ' ' + (item.dates.start.localTime || '00:00:00');
        const end_date = item.dates.end ? (item.dates.end.localDate + ' ' + (item.dates.end.localTime || '00:00:00')) : null;
        const location = item._embedded && item._embedded.venues ? item._embedded.venues[0].name + ', Goa' : 'Goa';
        const image_url = item.images && item.images[0] ? item.images[0].url : '';
        const category = item.classifications && item.classifications[0] ? item.classifications[0].segment.name : 'Music';
        const price = item.priceRanges ? `${item.priceRanges[0].min} - ${item.priceRanges[0].max} ${item.priceRanges[0].currency}` : 'TBA';
        const external_id = item.id;

        const [existing] = await conn.execute('SELECT id FROM events WHERE title = ? AND DATE(start_date) = DATE(?)', [title, start_date]);
        if (existing.length === 0) {
          await conn.execute(
            'INSERT INTO events (title, description, start_date, end_date, location, image_url, category, price, source, external_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "published")',
            [title, description, start_date, end_date, location, image_url, category, price, 'ticketmaster', external_id]
          );
          syncedCount++;
        }
      }
    }

    conn.release();
    res.json({ 
      success: true, 
      message: `Synced successfully! Added ${syncedCount} new events.` 
    });
  } catch (error) {
    console.error('Events Sync error:', error);
    res.status(500).json({ message: 'Failed to sync events' });
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();

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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();
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
    const conn = await pool.getConnection();

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

// Curated high-res Unsplash images for dynamic assignment
const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'
];

const restaurantImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'
];

const cafeImages = [
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
  'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800',
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
  'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800'
];

const clubImages = [
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'https://images.unsplash.com/photo-15145252531617a46d19cd819?w=800',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  'https://images.unsplash.com/photo-1574091826950-7d727a67970c?w=800'
];

const beachShackImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
  'https://images.unsplash.com/photo-1473116763269-255ea7657c61?w=800',
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800'
];

const casinoImages = [
  'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800',
  'https://images.unsplash.com/photo-1570649236495-42fa5fe3c48b?w=800',
  'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800'
];

// Reviews pool for real-time places
const reviewsPool = {
  Hotel: [
    { author: 'Vikram Mehta', rating: 5, comment: 'Exceptional hospitality. Clean rooms and beautiful views.' },
    { author: 'Sarah Connor', rating: 4, comment: 'Great location close to the beach. Friendly staff.' },
    { author: 'Rahul Deshmukh', rating: 5, comment: 'Premium stay experience. The pool area is magnificent!' }
  ],
  Restaurant: [
    { author: 'Elena Gilbert', rating: 5, comment: 'Phenomenal Goan seafood. The fish curry is out of this world!' },
    { author: 'Amit Sharma', rating: 4, comment: 'Wonderful dining experience. Try the bebinca for dessert.' },
    { author: 'Riya Sen', rating: 5, comment: 'Perfect ambiance for dinner. Prompt and polite service.' }
  ],
  Cafe: [
    { author: 'John Doe', rating: 5, comment: 'Best espresso in town! Very chill and productive environment.' },
    { author: 'Pooja Hegde', rating: 4, comment: 'Lovely croissants and matcha lattes. Beautiful interior design.' },
    { author: 'Sam Wilson', rating: 5, comment: 'Cozy place to relax. Good coffee, friendly hosts.' }
  ],
  Club: [
    { author: 'Dj Shadow', rating: 5, comment: 'Incredible acoustics and high-energy music. Best party in Goa!' },
    { author: 'Neha Kakkar', rating: 4, comment: 'Wild crowd and fantastic cocktails. The light show was amazing.' },
    { author: 'Steve Rogers', rating: 5, comment: 'Upscale venue. Highly secure and awesome cocktails.' }
  ],
  Casino: [
    { author: 'Tony Stark', rating: 5, comment: 'Thrilling experience. Excellent games, premium drinks, and live shows.' },
    { author: 'Bruce Wayne', rating: 5, comment: 'Upscale floating casino. The hospitality is top notch.' },
    { author: 'Diana Prince', rating: 4, comment: 'Very exciting atmosphere. Great entertainment options on board.' }
  ],
  Default: [
    { author: 'Sahil Sawant', rating: 5, comment: 'Amazing place! Strongly recommend visiting when in Goa.' },
    { author: 'Anjali R.', rating: 4, comment: 'Lovely ambiance and great staff. Very pleasant visit.' }
  ]
};

// GET Real-time places from Overpass API (with DB caching & fallback)
router.get('/realtime/places', async (req, res) => {
  const { category, region, search } = req.query;
  const axios = require('axios');
  
  const firstNames = ['Vikram', 'Sarah', 'Rahul', 'Elena', 'Amit', 'Riya', 'John', 'Pooja', 'Sam', 'Neha', 'Chris', 'Anita', 'Raj', 'Emma'];
  const lastNames = ['Mehta', 'Connor', 'Deshmukh', 'Gilbert', 'Sharma', 'Sen', 'Doe', 'Hegde', 'Wilson', 'Kakkar', 'Evans', 'Nair', 'Patel', 'Watson'];
  const reviewTexts = [
    'Amazing experience! Would definitely come back.',
    'Great place, friendly staff and lovely vibe.',
    'Absolutely loved it. Highly recommended for anyone visiting Goa.',
    'A bit crowded, but the service was excellent.',
    'Fantastic! Exceeded our expectations.',
    'Very good ambiance and reasonable prices.',
    'The best place in town! 5 stars all the way.',
    'Nice place, decent food/drinks and good music.',
    'Wonderful time here with friends.',
    'Perfect spot to relax and enjoy the evening.'
  ];

  const categoryMap = {
    hotels: [
      'node["tourism"="hotel"]',
      'node["tourism"="guest_house"]',
      'node["tourism"="resort"]',
      'node["tourism"="hostel"]'
    ],
    restaurants: [
      'node["amenity"="restaurant"]',
      'node["amenity"="food_court"]'
    ],
    cafes: [
      'node["amenity"="cafe"]'
    ],
    clubs: [
      'node["amenity"="nightclub"]',
      'node["amenity"="bar"]',
      'node["amenity"="pub"]',
      'node["restaurant"="beach_shack"]',
      'node["beach_shack"="yes"]',
      'node["bar"="yes"]'
    ],
    casinos: [
      'node["amenity"="casino"]',
      'node["leisure"="casino"]'
    ]
  };

  let typeClauses = [];
  if (category && categoryMap[category]) {
    typeClauses = categoryMap[category].map(c => `${c}(area.searchArea);`);
  } else {
    // all categories
    Object.values(categoryMap).forEach(arr => {
      arr.forEach(c => {
        typeClauses.push(`${c}(area.searchArea);`);
      });
    });
  }

  // Search by area "Goa"
  const query = `[out:json][timeout:25];
area["name"="Goa"]->.searchArea;
(
  ${typeClauses.join('\n  ')}
);
out body 300;`;

  let places = [];

  try {
    const response = await axios.get('https://overpass-api.de/api/interpreter', {
      params: { data: query },
      headers: {
        'User-Agent': 'GoaTourismPlatform/1.0 (sahilsawant094@gmail.com)'
      }
    });

    const elements = response.data.elements || [];
    
    // Process and enrich OSM nodes
    places = elements.map(el => {
      const tags = el.tags || {};
      const id = `osm-${el.id}`;
      const name = tags.name || 'Unnamed Venue';
      const lat = el.lat;
      const lon = el.lon;
      const lowercaseName = name.toLowerCase();
      
      // Determine Type and Category Key
      let friendlyType = 'Bar';
      let catKey = 'clubs';
      
      if (tags.tourism === 'hotel') { friendlyType = 'Hotel'; catKey = 'hotels'; }
      else if (tags.tourism === 'resort') { friendlyType = 'Resort'; catKey = 'hotels'; }
      else if (tags.tourism === 'hostel') { friendlyType = 'Hostel'; catKey = 'hotels'; }
      else if (tags.tourism === 'guest_house') { friendlyType = 'Guest House'; catKey = 'hotels'; }
      else if (tags.leisure === 'casino' || tags.amenity === 'casino' || lowercaseName.includes('casino')) { friendlyType = 'Casino'; catKey = 'casinos'; }
      else if (tags.amenity === 'nightclub' || lowercaseName.includes('club') || lowercaseName.includes('nightclub')) { friendlyType = 'Nightclub'; catKey = 'clubs'; }
      else if (tags.restaurant === 'beach_shack' || tags.beach_shack === 'yes' || lowercaseName.includes('shack') || lowercaseName.includes('beach shack')) { friendlyType = 'Beach Shack'; catKey = 'clubs'; }
      else if (tags.amenity === 'restaurant') { friendlyType = 'Restaurant & Bar'; catKey = 'restaurants'; }
      else if (tags.amenity === 'food_court') { friendlyType = 'Food Court'; catKey = 'restaurants'; }
      else if (tags.amenity === 'cafe') { friendlyType = 'Cafe'; catKey = 'cafes'; }
      else if (tags.amenity === 'bar') { friendlyType = 'Bar'; catKey = 'clubs'; }
      else if (tags.amenity === 'pub') { friendlyType = 'Pub'; catKey = 'clubs'; }
      else if (tags.tourism) { friendlyType = tags.tourism.charAt(0).toUpperCase() + tags.tourism.slice(1); catKey = 'hotels'; }
      else if (tags.amenity) { friendlyType = tags.amenity.charAt(0).toUpperCase() + tags.amenity.slice(1); }

      // Get location string
      const street = tags['addr:street'] || '';
      const suburb = tags['addr:suburb'] || tags['addr:city'] || '';
      const location = street && suburb ? `${street}, ${suburb}` : suburb || tags['addr:place'] || 'Goa, India';

      // Region by latitude
      const itemRegion = lat >= 15.45 ? 'North Goa' : 'South Goa';

      // Dynamic details
      const adjectives = ['top-rated', 'popular', 'well-known', 'highly recommended', 'fantastic', 'charming', 'vibrant', 'premium', 'cozy', 'bustling'];
      const atmospheres = ['lovely atmosphere', 'great ambiance', 'lively vibe', 'relaxing environment', 'energetic setting', 'beautiful decor', 'authentic Goan feel'];
      const services = ['outstanding hospitality', 'excellent service', 'friendly staff', 'quick service', 'warm welcome', 'attentive hosts'];
      
      const adj = adjectives[el.id % adjectives.length];
      const atm = atmospheres[(el.id + 1) % atmospheres.length];
      const srv = services[(el.id + 2) % services.length];

      let extraInfo = '';
      if (tags.cuisine) extraInfo += ` They serve delicious ${tags.cuisine.replace(/;/g, ' and ')} cuisine.`;
      if (tags.outdoor_seating === 'yes') extraInfo += ` Outdoor seating is available to enjoy the Goan breeze.`;
      if (tags.internet_access === 'wlan') extraInfo += ` Free Wi-Fi is provided for guests.`;
      if (tags.wheelchair === 'yes') extraInfo += ` The venue is wheelchair accessible.`;

      let description = `A ${adj} ${friendlyType.toLowerCase()} located in ${itemRegion}, Goa, known for its ${atm} and ${srv}.${extraInfo}`;
      if (tags.description) description = tags.description;
      
      const priceRangeOptions = ['Budget', 'Mid-range', 'Luxury'];
      const priceRange = priceRangeOptions[el.id % 3];

      let openingHours = '9:00 AM - 11:00 PM';
      if (catKey === 'hotels') openingHours = 'Open 24 Hours (24/7)';
      else if (catKey === 'cafes') openingHours = '8:00 AM - 10:00 PM';
      else if (catKey === 'clubs') openingHours = '7:00 PM - 3:00 AM';
      if (tags.opening_hours) openingHours = tags.opening_hours;

      const rating = (4.0 + (el.id % 9) / 10).toFixed(1);
      const reviewCount = 50 + (el.id % 950);

      // Select Image deterministically
      let image = '';
      if (friendlyType === 'Beach Shack') image = beachShackImages[el.id % beachShackImages.length];
      else if (friendlyType === 'Casino') image = casinoImages[el.id % casinoImages.length];
      else if (catKey === 'hotels') image = hotelImages[el.id % hotelImages.length];
      else if (catKey === 'restaurants') image = restaurantImages[el.id % restaurantImages.length];
      else if (catKey === 'cafes') image = cafeImages[el.id % cafeImages.length];
      else image = clubImages[el.id % clubImages.length];

      return {
        id,
        name,
        type: friendlyType,
        location,
        region: itemRegion,
        description,
        priceRange,
        openingHours,
        image,
        rating: parseFloat(rating),
        reviewCount,
        latitude: lat,
        longitude: lon
      };
    });

    // Cache results in DB
    const conn = await pool.getConnection();

        const premiumCasinos = [
      {
        id: 'premium-casino-1',
        name: 'Deltin Royale Casino',
        type: 'Casino',
        location: "Noah's Ark, RND Jetty, D. Bandodkar Marg, Panaji",
        region: 'North Goa',
        description: "India's largest and most luxurious floating casino. Offers a premium gaming experience, multi-cuisine dining, and live international entertainment on the Mandovi River.",
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
        rating: 4.8,
        reviewCount: 2450,
        latitude: 15.5015,
        longitude: 73.8245
      },
      {
        id: 'premium-casino-2',
        name: 'Majestic Pride Casino',
        type: 'Casino',
        location: 'River Mandovi, Captain Of Ports Jetty, Panaji',
        region: 'North Goa',
        description: 'An exceptional floating casino in Goa, offering a grand gaming floor, delicious dining options, live performances, and an energizing party atmosphere.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800',
        rating: 4.6,
        reviewCount: 1890,
        latitude: 15.5020,
        longitude: 73.8260
      },
      {
        id: 'premium-casino-3',
        name: 'Big Daddy Casino',
        type: 'Casino',
        location: 'Captain of Ports Jetty, Dayanand Bandodkar Marg, Panaji',
        region: 'North Goa',
        description: 'A state-of-the-art floating casino on the Mandovi River, featuring offshore gaming, multi-cuisine restaurants, premium bars, and spectacular live dance shows.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1570649236495-42fa5fe3c48b?w=800',
        rating: 4.7,
        reviewCount: 3100,
        latitude: 15.5010,
        longitude: 73.8230
      },
      {
        id: 'premium-casino-4',
        name: 'Deltin Jaqk',
        type: 'Casino',
        location: 'Fisheries Jetty, Dayanand Bandodkar Marg, Panaji',
        region: 'North Goa',
        description: 'A highly popular floating casino offering a premium gaming experience, delicious buffet dinners, and complimentary drinks for players.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800',
        rating: 4.5,
        reviewCount: 1540,
        latitude: 15.5030,
        longitude: 73.8270
      },
      {
        id: 'premium-casino-5',
        name: 'Casino Pride 2',
        type: 'Casino',
        location: 'River Mandovi, Panaji, Goa',
        region: 'North Goa',
        description: 'A popular floating casino offering a friendly atmosphere, live DJ music, international dancers, and a wide array of slots and table games.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
        rating: 4.4,
        reviewCount: 1200,
        latitude: 15.5022,
        longitude: 73.8262
      },
      {
        id: 'premium-casino-6',
        name: 'Casino Strike by Deltin',
        type: 'Casino',
        location: 'Grand Hyatt Goa, Bambolim, Goa',
        region: 'North Goa',
        description: "India's largest land-based casino located in the luxury Grand Hyatt resort. Features state-of-the-art gaming, live performance stages, and gourmet dining.",
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
        rating: 4.6,
        reviewCount: 950,
        latitude: 15.4590,
        longitude: 73.8565
      },
      {
        id: 'premium-casino-7',
        name: 'Casino Carnival',
        type: 'Casino',
        location: 'Goa Marriott Resort & Spa, Miramar, Panaji',
        region: 'North Goa',
        description: 'A premium land-based casino offering a refined gaming experience, excellent drinks, and slot machines in the upscale Marriott Resort.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
        rating: 4.3,
        reviewCount: 780,
        latitude: 15.4868,
        longitude: 73.8095
      },
      {
        id: 'premium-casino-8',
        name: 'Casino Palms',
        type: 'Casino',
        location: 'La Calypso Hotel, Baga Beach, Goa',
        region: 'North Goa',
        description: 'A vibrant land-based casino on the busy Baga stretch, featuring a relaxed gaming environment with slots, roulette, and blackjack for beachgoers.',
        priceRange: 'Mid-range',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        rating: 4.1,
        reviewCount: 650,
        latitude: 15.5552,
        longitude: 73.7517
      },
      {
        id: 'premium-casino-9',
        name: 'Casino Paradise',
        type: 'Casino',
        location: 'Hotel Neo Majestic, Porvorim, Goa',
        region: 'North Goa',
        description: "One of Goa's oldest and most well-known land-based casinos, offering digital gaming stations, classic table slots, and upscale hospitality.",
        priceRange: 'Mid-range',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800',
        rating: 4.2,
        reviewCount: 510,
        latitude: 15.5225,
        longitude: 73.8290
      },
      {
        id: 'premium-casino-10',
        name: 'Deltin Zuri',
        type: 'Casino',
        location: 'The Zuri White Sands Resort, Varca, South Goa',
        region: 'South Goa',
        description: 'A premium, classy casino located in South Goa within the Zuri White Sands Resort, offering a peaceful and upscale gaming environment for guests.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        rating: 4.5,
        reviewCount: 420,
        latitude: 15.2155,
        longitude: 73.9295
      },
      {
        id: 'premium-casino-11',
        name: 'Chances Casino & Resort',
        type: 'Casino',
        location: 'Vainguinim Valley Resort, Dona Paula, Goa',
        region: 'North Goa',
        description: 'A boutique land-based casino offering slots, live table games, conventional layout, and warm Goan hospitality in a quiet valley setting.',
        priceRange: 'Mid-range',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        rating: 4.2,
        reviewCount: 390,
        latitude: 15.4578,
        longitude: 73.8090
      },
      {
        id: 'premium-casino-12',
        name: 'Grand 7 Casino',
        type: 'Casino',
        location: 'The O Hotel, Candolim Beach, Goa',
        region: 'North Goa',
        description: 'A lively casino situated inside the O Hotel in Candolim, offering roulette, blackjack, slots, and live poolside entertainment.',
        priceRange: 'Luxury',
        openingHours: 'Open 24 Hours (24/7)',
        image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800',
        rating: 4.3,
        reviewCount: 490,
        latitude: 15.5180,
        longitude: 73.7610
      }
    ];

    for (const pc of premiumCasinos) {
      await conn.execute(`
        INSERT INTO realtime_places_cache (id, name, type, location, region, description, price_range, opening_hours, image, rating, review_count, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name), type = VALUES(type), location = VALUES(location), region = VALUES(region),
        description = VALUES(description), price_range = VALUES(price_range), opening_hours = VALUES(opening_hours),
        image = VALUES(image), rating = VALUES(rating), review_count = VALUES(review_count),
        latitude = VALUES(latitude), longitude = VALUES(longitude)
      `, [pc.id, pc.name, pc.type, pc.location, pc.region, pc.description, pc.priceRange, pc.openingHours, pc.image, pc.rating, pc.reviewCount, pc.latitude, pc.longitude]);
    }

    for (const p of places) {
      await conn.execute(`
        INSERT INTO realtime_places_cache (id, name, type, location, region, description, price_range, opening_hours, image, rating, review_count, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name), type = VALUES(type), location = VALUES(location), region = VALUES(region),
        description = VALUES(description), price_range = VALUES(price_range), opening_hours = VALUES(opening_hours),
        image = VALUES(image), rating = VALUES(rating), review_count = VALUES(review_count),
        latitude = VALUES(latitude), longitude = VALUES(longitude)
      `, [p.id, p.name, p.type, p.location, p.region, p.description, p.priceRange, p.openingHours, p.image, p.rating, p.reviewCount, p.latitude, p.longitude]);
    }

    if (!category || category === 'all' || category === 'casinos') {
      places = [...premiumCasinos, ...places];
    }

    // Fetch user reviews from DB in bulk
    const placeIds = places.map(p => p.id);
    let dbReviewsMap = {};
    if (placeIds.length > 0) {
      const placeholders = placeIds.map(() => '?').join(',');
      const [dbReviews] = await conn.execute(`
        SELECT r.tour_id, r.rating, r.comment, u.full_name AS author 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.tour_id IN (${placeholders})
      `, placeIds);
      
      dbReviews.forEach(rev => {
        if (!dbReviewsMap[rev.tour_id]) dbReviewsMap[rev.tour_id] = [];
        dbReviewsMap[rev.tour_id].push({
          author: rev.author,
          rating: rev.rating,
          comment: rev.comment
        });
      });
    }
    conn.release();

    // Map reviewsList onto places elements

    places.forEach(p => {
      const userRevs = dbReviewsMap[p.id] || [];
      const numericId = parseInt(p.id.replace(/\\D/g, '')) || Math.floor(Math.random() * 1000);
      
      const author1 = `${firstNames[numericId % firstNames.length]} ${lastNames[(numericId + 1) % lastNames.length]}`;
      const text1 = reviewTexts[numericId % reviewTexts.length];
      
      const author2 = `${firstNames[(numericId + 2) % firstNames.length]} ${lastNames[(numericId + 3) % lastNames.length]}`;
      const text2 = reviewTexts[(numericId + 4) % reviewTexts.length];
      
      const mockRevs = [
        { author: author1, rating: 5, comment: text1 },
        { author: author2, rating: 4, comment: text2 }
      ];
      p.reviewsList = [...userRevs, ...mockRevs];
    });

    // Apply filtering after fetching
    if (region && region !== 'all') {
      places = places.filter(p => p.region.toLowerCase() === region.toLowerCase());
    }
    if (search) {
      places = places.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()));
    }

    // Sort by rating & review count descending (Famous places first)
    places.sort((a, b) => {
      const ratingDiff = parseFloat(b.rating) - parseFloat(a.rating);
      if (ratingDiff !== 0) return ratingDiff;
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });

  } catch (apiError) {
    console.error('Overpass API call failed, falling back to database cache:', apiError.message);
    try {
      const conn = await pool.getConnection();
      let dbQuery = 'SELECT * FROM realtime_places_cache';
      let dbParams = [];
      const conditions = [];

      if (category && category !== 'all') {
        if (category === 'hotels') {
          conditions.push("type IN ('Hotel', 'Resort', 'Hostel', 'Guest House')");
        } else if (category === 'restaurants') {
          conditions.push("type IN ('Restaurant & Bar', 'Food Court')");
        } else if (category === 'cafes') {
          conditions.push("type = 'Cafe'");
        } else if (category === 'clubs') {
          conditions.push("type IN ('Bar', 'Pub', 'Nightclub', 'Beach Shack')");
        } else if (category === 'casinos') {
          conditions.push("type = 'Casino'");
        }
      }
      if (region && region !== 'all') {
        conditions.push('region = ?');
        dbParams.push(region);
      }
      if (search) {
        conditions.push('name LIKE ?');
        dbParams.push(`%${search}%`);
      }

      if (conditions.length > 0) {
        dbQuery += ' WHERE ' + conditions.join(' AND ');
      }
      dbQuery += ' ORDER BY rating DESC, review_count DESC LIMIT 300';

      const [rows] = await conn.execute(dbQuery, dbParams);

      const dbPlaceIds = rows.map(r => r.id);
      let dbReviewsMap = {};
      if (dbPlaceIds.length > 0) {
        const placeholders = dbPlaceIds.map(() => '?').join(',');
        const [dbReviews] = await conn.execute(`
          SELECT r.tour_id, r.rating, r.comment, u.full_name AS author 
          FROM reviews r 
          JOIN users u ON r.user_id = u.id 
          WHERE r.tour_id IN (${placeholders})
        `, dbPlaceIds);
        
        dbReviews.forEach(rev => {
          if (!dbReviewsMap[rev.tour_id]) dbReviewsMap[rev.tour_id] = [];
          dbReviewsMap[rev.tour_id].push({
            author: rev.author,
            rating: rev.rating,
            comment: rev.comment
          });
        });
      }
      conn.release();

      places = rows.map(r => {
        const p = {
          id: r.id,
          name: r.name,
          type: r.type,
          location: r.location,
          region: r.region,
          description: r.description,
          priceRange: r.price_range,
          openingHours: r.opening_hours,
          image: r.image,
          rating: parseFloat(r.rating),
          reviewCount: r.review_count,
          latitude: parseFloat(r.latitude),
          longitude: parseFloat(r.longitude)
        };

        const userRevs = dbReviewsMap[p.id] || [];
        const numericId = parseInt(p.id.replace(/\\D/g, '')) || Math.floor(Math.random() * 1000);
        
        const author1 = `${firstNames[numericId % firstNames.length]} ${lastNames[(numericId + 1) % lastNames.length]}`;
        const text1 = reviewTexts[numericId % reviewTexts.length];
        
        const author2 = `${firstNames[(numericId + 2) % firstNames.length]} ${lastNames[(numericId + 3) % lastNames.length]}`;
        const text2 = reviewTexts[(numericId + 4) % reviewTexts.length];
        
        const mockRevs = [
          { author: author1, rating: 5, comment: text1 },
          { author: author2, rating: 4, comment: text2 }
        ];
        p.reviewsList = [...userRevs, ...mockRevs];
        return p;
      });
    } catch (dbError) {
      console.error('Cache fallback failed:', dbError.message);
      return res.status(500).json({ message: 'Failed to retrieve places data' });
    }
  }

  res.json(places);
});

// GET a single real-time place by ID (from cache or live)
router.get('/realtime/places/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute('SELECT * FROM realtime_places_cache WHERE id = ?', [id]);

    if (rows.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Place not found' });
    }

    const r = rows[0];

    const [dbReviews] = await conn.execute(`
      SELECT r.rating, r.comment, u.full_name AS author 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.tour_id = ?
    `, [id]);
    conn.release();

    const firstNames = ['Vikram', 'Sarah', 'Rahul', 'Elena', 'Amit', 'Riya', 'John', 'Pooja', 'Sam', 'Neha', 'Chris', 'Anita', 'Raj', 'Emma'];
    const lastNames = ['Mehta', 'Connor', 'Deshmukh', 'Gilbert', 'Sharma', 'Sen', 'Doe', 'Hegde', 'Wilson', 'Kakkar', 'Evans', 'Nair', 'Patel', 'Watson'];
    const reviewTexts = [
      'Amazing experience! Would definitely come back.',
      'Great place, friendly staff and lovely vibe.',
      'Absolutely loved it. Highly recommended for anyone visiting Goa.',
      'A bit crowded, but the service was excellent.',
      'Fantastic! Exceeded our expectations.',
      'Very good ambiance and reasonable prices.',
      'The best place in town! 5 stars all the way.',
      'Nice place, decent food/drinks and good music.',
      'Wonderful time here with friends.',
      'Perfect spot to relax and enjoy the evening.'
    ];

    const numericId = parseInt(id.replace(/\\D/g, '')) || Math.floor(Math.random() * 1000);
    
    const author1 = `${firstNames[numericId % firstNames.length]} ${lastNames[(numericId + 1) % lastNames.length]}`;
    const text1 = reviewTexts[numericId % reviewTexts.length];
    
    const author2 = `${firstNames[(numericId + 2) % firstNames.length]} ${lastNames[(numericId + 3) % lastNames.length]}`;
    const text2 = reviewTexts[(numericId + 4) % reviewTexts.length];
    
    const mockRevs = [
      { author: author1, rating: 5, comment: text1 },
      { author: author2, rating: 4, comment: text2 }
    ];

    res.json({
      id: r.id,
      name: r.name,
      type: r.type,
      location: r.location,
      region: r.region,
      description: r.description,
      priceRange: r.price_range,
      openingHours: r.opening_hours,
      image: r.image,
      rating: parseFloat(r.rating),
      reviewCount: r.review_count,
      latitude: parseFloat(r.latitude),
      longitude: parseFloat(r.longitude),
      reviewsList: [...dbReviews, ...mockRevs]
    });
  } catch (error) {
    console.error('Get place by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
