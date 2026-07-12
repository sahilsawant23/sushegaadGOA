const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const emailService = require('../emailService');

async function testGuideEmail() {
    console.log('Testing Guide Assignment Email...');

    // Mock Data
    const booking = { booking_date: new Date(), guests: 2 };
    const tour = { title: 'Test Spice Plantation Tour' };
    const guide = {
        name: 'Rahul Guide',
        contact: '+91 9876543210',
        specialty: 'History & Culture'
    };
    // Send to the admin/configured email for testing
    const user = {
        email: process.env.EMAIL_USER, // Send to self
        full_name: 'Test Customer'
    };

    if (!user.email) {
        console.error('❌ EMAIL_USER not set in .env');
        return;
    }

    try {
        await emailService.sendGuideAssignedEmail(booking, tour, guide, user);
        console.log('✅ Guide assignment email sent successfully to', user.email);
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
}

testGuideEmail();
