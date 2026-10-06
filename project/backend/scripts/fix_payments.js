const fs = require('fs');
const routesPath = 'f:/e drive data/sahil/GOA website/project/backend/routes.js';
let routes = fs.readFileSync(routesPath, 'utf8');

// We need to replace the whole /payments/verify endpoint
const verifyStart = routes.indexOf("router.post('/payments/verify'");
const verifyEnd = routes.indexOf("});", verifyStart) + 3;
const oldVerify = routes.substring(verifyStart, verifyEnd);

const newVerify = `router.post('/payments/verify', authenticateToken, async (req, res) => {
  const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  if (!bookingId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return res.status(400).json({ message: 'Missing payment details' });
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed (Signature mismatch)' });
    }

    const conn = await pool.getConnection();
    const [bookings] = await conn.execute('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (bookings.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = bookings[0];
    await conn.execute('UPDATE bookings SET status = "confirmed" WHERE id = ?', [bookingId]);
    
    const [users] = await conn.execute('SELECT full_name, email FROM users WHERE id = ?', [req.user.userId]);
    const user = users[0];

    const bookingDetails = { booking_date: booking.booking_date, guests: booking.guests || 1, total_price: booking.total_price };
    const tourDetails = { title: booking.booked_tour_title };

    if (user) {
      emailService.sendBookingConfirmation(bookingDetails, tourDetails, user).catch(() => {});
    }

    conn.release();
    return res.json({ success: true, message: 'Payment verified and booking confirmed successfully!' });
  } catch (error) {
    console.warn('[DB Fallback] Payment verify using memory store:', error.message);
    
    // Memory store fallback
    const bookingIndex = bookingsMemoryStore.findIndex(b => b.id == bookingId || b.id === bookingId);
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    bookingsMemoryStore[bookingIndex].status = 'confirmed';
    saveFallbackData();
    
    const memUser = usersMemoryStore.find(u => u.id == req.user.userId) || { full_name: 'Customer', email: req.user.email };
    
    const bookingDetails = {
      booking_date: bookingsMemoryStore[bookingIndex].booking_date,
      guests: bookingsMemoryStore[bookingIndex].guests || 1,
      total_price: bookingsMemoryStore[bookingIndex].total_price
    };
    const tourDetails = { title: bookingsMemoryStore[bookingIndex].booked_tour_title };
    
    emailService.sendBookingConfirmation(bookingDetails, tourDetails, memUser).catch(() => {});
    
    return res.json({ success: true, message: 'Payment verified and booking confirmed (Memory Fallback)' });
  }
});`;

routes = routes.replace(oldVerify, newVerify);

// Let's also check `/bookings/:id/cancel` and `/bookings` to make sure they have saveFallbackData()
const bookingsFallbackStart = routes.indexOf("console.warn('[DB Fallback] Bookings using memory store:");
if (bookingsFallbackStart !== -1) {
  const pushIdx = routes.indexOf("bookingsMemoryStore.push({", bookingsFallbackStart);
  if (pushIdx !== -1) {
    const endPush = routes.indexOf("});", pushIdx) + 3;
    const oldPush = routes.substring(pushIdx, endPush);
    const newPush = oldPush + "\\n    saveFallbackData();";
    if (!oldPush.includes("saveFallbackData")) {
      routes = routes.replace(oldPush, newPush);
    }
  }
}

fs.writeFileSync(routesPath, routes, 'utf8');
console.log('Fixed payments and bookings endpoints');
