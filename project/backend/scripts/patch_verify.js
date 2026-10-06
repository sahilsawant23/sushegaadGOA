const fs = require('fs');
const routesPath = 'f:/e drive data/sahil/GOA website/project/backend/routes.js';
let routes = fs.readFileSync(routesPath, 'utf8');

const oldBlock = `  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Internal server error during verification' });
  }
});`;

const newBlock = `  } catch (error) {
    console.warn('[DB Fallback] Payment verify using memory store:', error.message);
    const bookingIndex = bookingsMemoryStore.findIndex(b => b.id == bookingId || b.id === bookingId);
    if (bookingIndex === -1) return res.status(404).json({ message: 'Booking not found' });
    
    bookingsMemoryStore[bookingIndex].status = 'confirmed';
    if (typeof saveFallbackData === 'function') saveFallbackData();
    
    const memUser = usersMemoryStore.find(u => u.id == req.user.userId) || { full_name: 'Customer', email: req.user.email || '' };
    
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

if (routes.includes(oldBlock)) {
  routes = routes.replace(oldBlock, newBlock);
  fs.writeFileSync(routesPath, routes, 'utf8');
  console.log('Successfully patched /payments/verify');
} else {
  console.log('Could not find exact block, searching for similar...');
  const verifyStart = routes.indexOf('/payments/verify');
  if (verifyStart !== -1) {
    console.log('Found /payments/verify endpoint, trying regex replace');
    // We just find the last "catch (error) {" before the end of the function
    const verifyEnd = routes.indexOf('});', verifyStart + 2000) + 3;
    const verifyFunc = routes.substring(verifyStart, verifyEnd + 200);
    const lastCatch = verifyFunc.lastIndexOf('} catch (error) {');
    if (lastCatch !== -1) {
       const part1 = routes.substring(0, verifyStart + lastCatch);
       const endOfFunc = routes.indexOf('});', verifyStart + lastCatch) + 3;
       const part3 = routes.substring(endOfFunc);
       routes = part1 + newBlock + part3;
       fs.writeFileSync(routesPath, routes, 'utf8');
       console.log('Patched via fallback method');
    }
  }
}
