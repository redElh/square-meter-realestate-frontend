const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  return transporter;
}

async function sendPasswordResetEmail(email, resetLink) {
  const transport = getTransporter();
  if (!transport) {
    console.warn('No email transporter configured. Reset link:', resetLink);
    return;
  }

  const fromAddress = process.env.GMAIL_USER || 'noreply@squaremeter.com';

  await transport.sendMail({
    from: `"Square Meter" <${fromAddress}>`,
    to: email,
    subject: 'Password Reset - Square Meter',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #023927;">Password Reset Request</h2>
        <p>You have requested to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #023927; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <hr style="border: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Square Meter - Your Real Estate Platform</p>
      </div>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
