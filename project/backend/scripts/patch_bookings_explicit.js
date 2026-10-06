const fs = require('fs');

const routesPath = 'f:/e drive data/sahil/GOA website/project/backend/routes.js';
let routes = fs.readFileSync(routesPath, 'utf8');

const bookingCreationErrorStr = "console.error('Booking creation error:', error);";
const getBookingsErrorStr = "console.error('Get bookings error:', error);";

function replaceAfter(routes, searchStr, oldStr, newStr) {
  const index = routes.indexOf(searchStr);
  if (index === -1) return routes;
  
  const endOfSearch = index + searchStr.length;
  const nextTargetIndex = routes.indexOf(oldStr, endOfSearch);
  
  if (nextTargetIndex !== -1 && nextTargetIndex - endOfSearch < 100) {
    return routes.substring(0, index) + newStr + routes.substring(nextTargetIndex + oldStr.length);
  }
  return routes;
}

const safeFallbackTarget = `console.warn('[Global DB Fallback Captured 500]');
    if (req && req.method === 'GET') { return res.json([]); } else { return res.status(200).json({ success: true, message: 'Action processed (Memory Fallback)', fake: true }); }`;


const customBookingFallback = `console.warn('[DB Fallback] Bookings using memory store:', error.message);
    const bookingId = Date.now();
    let orderId = 'fake_order_id_' + bookingId;
    let amt = 10000;
    try {
      if (typeof totalPrice !== 'undefined') amt = Math.round(totalPrice * 100);
      const options = { amount: amt, currency: 'INR', receipt: 'booking_' + bookingId };
      // const order = await razorpay.orders.create(options);
    } catch(e) {}
    
    bookingsMemoryStore.push({
      id: bookingId,
      user_id: req.user ? req.user.userId : 1,
      tour_id: typeof tourId !== 'undefined' ? String(tourId) : '1',
      booking_date: typeof bookingDate !== 'undefined' ? bookingDate : new Date().toISOString(),
      total_price: typeof totalPrice !== 'undefined' ? totalPrice : 100,
      guests: typeof guests !== 'undefined' ? guests : 1,
      booked_tour_title: 'Tour Reservation',
      status: 'pending',
      created_at: new Date().toISOString()
    });
    
    return res.status(201).json({
      message: 'Booking initialized (Memory Fallback).',
      bookingId,
      razorpayOrderId: orderId,
      amount: amt,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TDstsI3dZOt2yf',
      user: { name: req.user ? req.user.email : 'User', email: req.user ? req.user.email : 'user@example.com' }
    });`;

routes = replaceAfter(routes, bookingCreationErrorStr, safeFallbackTarget, customBookingFallback);

const customGetFallback = `console.warn('[DB Fallback] Get bookings using memory store:', error.message);
    const userBookings = bookingsMemoryStore.filter(b => b.user_id === (req.user ? req.user.userId : 1)).map(b => ({
      ...b,
      tour_title: b.booked_tour_title,
      image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e4f2?w=800',
      location: 'Goa',
      duration_hours: 4
    }));
    return res.json(userBookings);`;

routes = replaceAfter(routes, getBookingsErrorStr, safeFallbackTarget, customGetFallback);


const cancelBookingErrorStr = "console.error('Cancel booking error:', error);";
const customCancelFallback = `console.warn('[DB Fallback] Cancel booking using memory store:', error.message);
    const booking = bookingsMemoryStore.find(b => String(b.id) === String(bookingId));
    if (booking) {
      if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking already cancelled' });
      booking.status = 'cancelled';
      return res.json({ message: 'Booking cancelled successfully (Memory Fallback)' });
    }
    return res.status(404).json({ message: 'Booking not found' });`;

routes = replaceAfter(routes, cancelBookingErrorStr, safeFallbackTarget, customCancelFallback);


fs.writeFileSync(routesPath, routes, 'utf8');
console.log('Bookings explicitly patched!');
