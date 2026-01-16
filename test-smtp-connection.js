// Quick test to verify SMTP connection
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSMTPConnection() {
  console.log('🧪 Testing SMTP Connection...\n');
  
  console.log('Credentials check:');
  console.log('  GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ Not set');
  console.log('  GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Not set');
  console.log('');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('📧 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
    
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Square Meter - Test" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Test Email - CV Attachment',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<p>This is a test email to verify SMTP configuration.</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.error('\n💡 Possible solutions:');
    console.error('1. Check if GMAIL_USER and GMAIL_APP_PASSWORD are set in .env');
    console.error('2. Verify the Gmail App Password is correct');
    console.error('3. Enable "Less secure app access" in Gmail (if not using App Password)');
    console.error('4. Check your firewall/network settings');
    console.error('5. Try using a different port (465, 587, 2525)');
  }
}

testSMTPConnection();
