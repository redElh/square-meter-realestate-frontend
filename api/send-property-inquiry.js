// Vercel Serverless Function to send property inquiry emails
// Includes automatic translation to French using translation API

// Import nodemailer for email sending
const nodemailer = require('nodemailer');

async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Log the req.body to debug
    console.log('🔍 Handler received req.body:', req.body);
    console.log('🔍 Handler req.body type:', typeof req.body);
    console.log('🔍 Handler req.body keys:', req.body ? Object.keys(req.body) : 'null/undefined');
    
    // Check if body exists
    if (!req.body) {
      throw new Error('Request body is undefined. Body parser middleware may not be working.');
    }
    
    const { subject, content, formData, currentLanguage, emailType } = req.body;
    
    // Log specific CV data for careers applications
    if (emailType === 'careers') {
      console.log('🎓 CAREERS APPLICATION DETECTED');
      console.log('   - Has formData:', !!formData);
      console.log('   - formData keys:', formData ? Object.keys(formData) : 'null');
      console.log('   - Has cvBase64:', !!formData?.cvBase64);
      console.log('   - cvBase64 length:', formData?.cvBase64?.length || 0);
      console.log('   - cvFilename:', formData?.cvFilename);
      console.log('   - cvMimetype:', formData?.cvMimetype);
    }

    // Translate to French if not already in French
    let translatedSubject = subject;
    let translatedContent = content;

    if (currentLanguage !== 'fr') {
      // Use translation service to translate to French
      try {
        const translationResponse = await translateToFrench(subject, content, currentLanguage);
        translatedSubject = translationResponse.subject;
        translatedContent = translationResponse.content;
      } catch (translationError) {
        console.error('Translation error:', translationError);
        // Continue with original text if translation fails
      }
    }

    // Prepare email data
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@squaremeter.com';
    const CONTACT_EMAIL2 = process.env.CONTACT_EMAIL2 || 'contact@squaremeter.com';
    const CONTACT_EMAIL3 = process.env.CONTACT_EMAIL3 || 'contact@squaremeter.com';
    
    // Determine recipient based on email type and subject
    let recipientEmail = CONTACT_EMAIL; // Default for general contact
    let emailSenderName = 'Square Meter';
    
    if (emailType === 'careers') {
      // Careers applications go to CONTACT_EMAIL2
      recipientEmail = CONTACT_EMAIL2;
      emailSenderName = 'Square Meter - Service de candidature';
    } else if (emailType === 'contact' && formData.subject) {
      // Contact form: visit or info requests go to CONTACT_EMAIL3
      if (formData.subject === 'visit' || formData.subject === 'info') {
        recipientEmail = CONTACT_EMAIL3;
      }
    }
    
    console.log('📧 Email routing:', {
      emailType,
      subject: formData.subject,
      recipientEmail,
      senderName: emailSenderName
    });
    
    const emailData = {
      to: recipientEmail,
      from: formData.email,
      subject: translatedSubject,
      text: translatedContent,
      html: formatEmailAsHtml(translatedContent, formData),
      replyTo: formData.email,
      senderName: emailSenderName
    };

    console.log('🔍 DEBUG: About to check emailType for CV attachment');
    console.log('🔍 DEBUG: emailType value:', emailType);
    console.log('🔍 DEBUG: emailType === "careers":', emailType === 'careers');

    // Add CV attachment for career applications
    if (emailType === 'careers') {
      console.log('🎓 CAREERS: Checking for CV attachment...');
      console.log('   formData exists:', !!formData);
      console.log('   formData.cvBase64 exists:', !!formData?.cvBase64);
      console.log('   formData.cvBase64 type:', typeof formData?.cvBase64);
      console.log('   formData.cvBase64 length:', formData?.cvBase64?.length || 0);
      
      if (formData && formData.cvBase64 && formData.cvBase64.length > 0) {
        console.log('📎 Creating CV attachment...');
        console.log('   Filename:', formData.cvFilename);
        console.log('   Mimetype:', formData.cvMimetype);
        
        try {
          // Create buffer from base64
          const cvBuffer = Buffer.from(formData.cvBase64, 'base64');
          console.log('   ✅ Buffer created, size:', cvBuffer.length, 'bytes');
          
          emailData.attachments = [{
            filename: formData.cvFilename || 'cv.pdf',
            content: cvBuffer,
            contentType: formData.cvMimetype || 'application/pdf'
          }];
          console.log('   ✅ Attachment object created successfully');
          console.log('   ✅ Attachment will be sent with email');
        } catch (error) {
          console.error('   ❌ Error creating attachment buffer:', error);
        }
      } else {
        console.log('   ⚠️ WARNING: No CV data found!');
        console.log('   - This should not happen for careers applications');
        console.log('   - Check if cvBase64 is being sent from frontend');
      }
    }

    // Send email
    console.log('📧 Sending email to:', emailData.to);
    console.log('📎 Attachments in emailData:', emailData.attachments ? emailData.attachments.length : 0);
    if (emailData.attachments && emailData.attachments.length > 0) {
      console.log('📎 Attachment details:', emailData.attachments[0].filename, 'Size:', emailData.attachments[0].content.length, 'bytes');
    }
    await sendEmail(emailData);

    // Store inquiry in database (optional)
    await storeInquiry(formData, translatedSubject, translatedContent);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      translatedToFrench: currentLanguage !== 'fr'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
}

/**
 * Send email using nodemailer
 */
async function sendEmail(emailData) {
  // Create transporter based on available configuration
  let transporter;

  // Option 1: Gmail (requires App Password)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    console.log('📧 Using Gmail SMTP configuration');
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  // Option 2: Custom SMTP
  else if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  // Option 3: SendGrid SMTP
  else if (process.env.SENDGRID_API_KEY) {
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }
  // No email service configured
  else {
    console.warn('⚠️ No email service configured. Please set environment variables.');
    console.log('Email data:', emailData);
    return;
  }

  // Send email
  const senderName = emailData.senderName || 'Square Meter';
  console.log('📧 Preparing to send email with sender:', senderName);
  console.log('📎 Has attachments:', !!emailData.attachments && emailData.attachments.length > 0);
  
  const info = await transporter.sendMail({
    from: `"${senderName}" <${process.env.SMTP_FROM || process.env.GMAIL_USER || 'noreply@squaremeter.com'}>`,
    to: emailData.to,
    replyTo: emailData.replyTo,
    subject: emailData.subject,
    text: emailData.text,
    html: emailData.html,
    attachments: emailData.attachments || [],
  });

  console.log('✅ Email sent successfully:', info.messageId);
  if (emailData.attachments && emailData.attachments.length > 0) {
    console.log('✅ With', emailData.attachments.length, 'attachment(s)');
  }
  return info;
}

/**
 * Translate text to French using LibreTranslate or similar service
 */
async function translateToFrench(subject, content, sourceLang) {
  // Option 1: Use LibreTranslate (free, open-source)
  const TRANSLATE_API_URL = process.env.TRANSLATE_API_URL || 'https://libretranslate.com/translate';
  
  try {
    // Translate subject
    const subjectResponse = await fetch(TRANSLATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: subject,
        source: sourceLang,
        target: 'fr',
        format: 'text',
      }),
    });

    // Translate content
    const contentResponse = await fetch(TRANSLATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: content,
        source: sourceLang,
        target: 'fr',
        format: 'text',
      }),
    });

    if (!subjectResponse.ok || !contentResponse.ok) {
      throw new Error('Translation API error');
    }

    const subjectData = await subjectResponse.json();
    const contentData = await contentResponse.json();

    return {
      subject: subjectData.translatedText,
      content: contentData.translatedText,
    };
  } catch (error) {
    console.error('Translation failed:', error);
    // Fallback: return original text
    return { subject, content };
  }
}

/**
 * Format email content as HTML for better presentation
 */
function formatEmailAsHtml(content, formData) {
  const htmlContent = content
    .replace(/\n/g, '<br>')
    .replace(/━{30,}/g, '<hr style="border: 0; border-top: 2px solid #023927; margin: 20px 0;">');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6; 
      color: #333; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px;
    }
    .header { 
      background: #023927; 
      color: white; 
      padding: 20px; 
      text-align: center; 
      margin-bottom: 30px;
    }
    .content { 
      background: #ffffff; 
      padding: 30px; 
      border: 1px solid #e0e0e0;
    }
    .footer { 
      text-align: center; 
      color: #666; 
      font-size: 12px; 
      margin-top: 30px; 
      padding-top: 20px; 
      border-top: 1px solid #e0e0e0;
    }
    hr { 
      border: 0; 
      border-top: 2px solid #023927; 
      margin: 20px 0; 
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-weight: 300;">Square Meter</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Excellence Immobilière</p>
  </div>
  <div class="content">
    ${htmlContent}
  </div>
  <div class="footer">
    <p>Square Meter - Excellence Immobilière</p>
    <p>123 Avenue de Luxe, 75008 Paris, France</p>
    <p>+33 1 23 45 67 89 | contact@squaremeter.com</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Store inquiry in database (optional)
 */
async function storeInquiry(formData, subject, content) {
  // Implement database storage here
  // Example: Store in Firebase, MongoDB, PostgreSQL, etc.
  console.log('📝 Storing inquiry:', {
    timestamp: new Date().toISOString(),
    formData,
    subject,
    content: content.substring(0, 100) + '...',
  });
  
  // For now, just log it
  return true;
}

// Export for both Vercel (ES6) and local development (CommonJS)
module.exports = handler;
module.exports.default = handler;
