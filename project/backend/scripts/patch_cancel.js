const fs = require('fs');

let code = fs.readFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', 'utf8');

const targetStr = `module.exports = router;`;

const newCode = `
// Cancel Booking Endpoint
router.post('/bookings/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    await conn.execute('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', id]);
    conn.release();
    
    // Also update in memory store
    const bookingIndex = bookingsMemoryStore.findIndex(b => String(b.id) === String(id));
    if (bookingIndex !== -1) {
      bookingsMemoryStore[bookingIndex].status = 'cancelled';
      if (typeof saveFallbackData === 'function') saveFallbackData();
    }
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error, falling back:', error.message);
    const { id } = req.params;
    const bookingIndex = bookingsMemoryStore.findIndex(b => String(b.id) === String(id));
    if (bookingIndex !== -1) {
      bookingsMemoryStore[bookingIndex].status = 'cancelled';
      if (typeof saveFallbackData === 'function') saveFallbackData();
      return res.json({ message: 'Booking cancelled successfully (offline mode)' });
    }
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

module.exports = router;`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newCode);
  fs.writeFileSync('f:/e drive data/sahil/GOA website/project/backend/routes.js', code, 'utf8');
  console.log('Successfully added /bookings/:id/cancel endpoint');
} else {
  console.log('Target string module.exports = router; not found');
}
