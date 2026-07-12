const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'host' and 'port' if not using Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Application-specific password recommended
  },
});

// Generic send email function
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Goa Tours" <${process.env.EMAIL_USER}>`, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw logic error, just log it so the app doesn't crash during a booking
    return null;
  }
};

const sendBookingConfirmation = async (booking, tour, user) => {
  const subject = `Booking Confirmation: ${tour.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Booking Confirmed!</h2>
      <p>Dear ${user.full_name},</p>
      <p>Thank you for booking with us. Here are your tour details:</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${tour.title}</h3>
        <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
        <p><strong>Guests:</strong> ${booking.guests}</p>
        <p><strong>Total Price:</strong> ₹${booking.total_price}</p>
      </div>

      <p>We look forward to seeing you!</p>
      <p>Best regards,<br/>Goa Tours Team</p>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

const sendBookingReminder = async (booking, tour, guide, user, adminEmail) => {
  // 1. Send to User
  const userSubject = `Reminder: Your tour is tomorrow! - ${tour.title}`;
  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Tour Reminder</h2>
      <p>Dear ${user.full_name},</p>
      <p>This is a reminder for your upcoming tour tomorrow:</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${tour.title}</h3>
        <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${tour.destination_name || 'Meeting Point'}</p>
        ${guide ? `<p><strong>Your Guide:</strong> ${guide.name} (${guide.contact})</p>` : ''}
      </div>

      <p>See you soon!</p>
    </div>
  `;
  await sendEmail(user.email, userSubject, userHtml);

  // 2. Send to Admin
  if (adminEmail) {
    const adminSubject = `Tour Tomorrow: ${tour.title} (Booking #${booking.id})`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h3>Upcoming Tour Reminder</h3>
        <p><strong>Tour:</strong> ${tour.title}</p>
        <p><strong>Customer:</strong> ${user.full_name} (${user.email})</p>
        <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
        <p><strong>Guests:</strong> ${booking.guests}</p>
        <p><strong>Guide:</strong> ${guide ? guide.name : 'Not Assigned'}</p>
      </div>
    `;
    await sendEmail(adminEmail, adminSubject, adminHtml);
  }
};

const sendGuideAssignedEmail = async (booking, tour, guide, user) => {
  const subject = `Guide Assigned: ${tour.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Guide Assigned!</h2>
      <p>Dear ${user.full_name},</p>
      <p>A guide has been assigned for your upcoming tour. Here are the details:</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${tour.title}</h3>
        <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
        
        <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px;">
            <div style="text-align: center; margin-bottom: 15px;">
              <img src="${guide.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(guide.name)}&background=random`}" 
                   alt="${guide.name}" 
                   style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #ddd;" />
            </div>
            <p><strong>Guide Name:</strong> ${guide.name}</p>
            <p><strong>Contact:</strong> ${guide.contact}</p>
            <p><strong>Specialty:</strong> ${guide.specialty || 'General'}</p>
            ${guide.languages ? `<p><strong>Languages:</strong> ${guide.languages}</p>` : ''}
            ${guide.experience_years ? `<p><strong>Experience:</strong> ${guide.experience_years} Years</p>` : ''}
        </div>
      </div>

      <p>Your guide will meet you at the designated meeting point.</p>
      <p>Best regards,<br/>Goa Tours Team</p>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

const sendPasswordResetEmail = async (email, resetLink) => {
  const subject = 'Reset Your Password - Goa Tours';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password. If this was you, please click the button below to set a new password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>

      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 12px;">सुशेगादGoa</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

module.exports = {
  sendBookingConfirmation,
  sendBookingReminder,
  sendGuideAssignedEmail,
  sendPasswordResetEmail
};
