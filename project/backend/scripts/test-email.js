const path = require('path');
const nodemailer = require('nodemailer');
// Explicitly point to the .env file in the backend root
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
const result = require('dotenv').config({ path: envPath });

if (result.error) {
    console.error('❌ Error loading .env file:', result.error);
} else {
    console.log('✅ .env file loaded.');
}

async function testEmail() {
    console.log('--- Testing Email Configuration ---');
    console.log('Current Working Directory:', process.cwd());

    // 1. Check Env Vars
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        console.error('❌ Missing EMAIL_USER or EMAIL_PASS in .env file');
        console.log('EMAIL_USER:', user ? 'Set' : 'Missing');
        console.log('EMAIL_PASS:', pass ? 'Set' : 'Missing');
        return;
    }

    console.log('✅ Environment variables found.');
    console.log(`Using user: ${user}`);

    // 2. Create Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    // 3. Verify Connection
    try {
        await transporter.verify();
        console.log('✅ SMTP Connection verified successfully.');
    } catch (error) {
        console.error('❌ SMTP Connection failed:', error);
        return;
    }

    // 4. Send Test Email
    try {
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"Test Script" <${user}>`,
            to: user, // Send to self
            subject: 'Test Email from Goa Website',
            text: 'If you see this, the email configuration is working correctly!'
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
}

testEmail();
