// Test CV attachment with actual email sending
require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function testCVAttachmentEmail() {
  console.log('🧪 Testing CV Attachment Email...\n');
  
  // Create a test PDF
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 85
>>
stream
BT
/F1 12 Tf
100 700 Td
(TEST CV FOR CAREERS APPLICATION) Tj
0 -20 Td
(This is a test resume file.) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000317 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
451
%%EOF`;

  const pdfBuffer = Buffer.from(pdfContent, 'utf-8');
  const base64Content = pdfBuffer.toString('base64');
  
  console.log('📄 Test CV created:');
  console.log('   Size:', pdfBuffer.length, 'bytes');
  console.log('   Base64 length:', base64Content.length, 'characters\n');
  
  // Create transporter
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
  
  // Convert base64 back to buffer (simulating what the API does)
  const cvBuffer = Buffer.from(base64Content, 'base64');
  console.log('📎 Creating attachment from base64...');
  console.log('   Buffer size:', cvBuffer.length, 'bytes\n');
  
  // Prepare email with attachment
  const emailOptions = {
    from: `"Square Meter - Service de candidature" <${process.env.GMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
    subject: 'Test: Nouvelle candidature - Test User',
    text: `Bonjour,

Une nouvelle candidature a été reçue via le site web.

INFORMATIONS PERSONNELLES
Prénom : Test
Nom : User
Email : test@example.com

EXPERIENCE PROFESSIONNELLE
Niveau d'expérience : Débutant (moins d'1 an)

REGION SOUHAITEE
Essaouira

CV JOINT
Nom du fichier : test-cv.pdf

Cette candidature nécessite votre attention.

Cordialement,
Square Meter - Service de candidature`,
    html: `<html><body>
<p>Bonjour,</p>
<p>Une nouvelle candidature a été reçue via le site web.</p>
<h3>INFORMATIONS PERSONNELLES</h3>
<p>Prénom : Test<br>
Nom : User<br>
Email : test@example.com</p>
<h3>EXPERIENCE PROFESSIONNELLE</h3>
<p>Niveau d'expérience : Débutant (moins d'1 an)</p>
<h3>REGION SOUHAITEE</h3>
<p>Essaouira</p>
<h3>CV JOINT</h3>
<p>Nom du fichier : test-cv.pdf</p>
<p>Cette candidature nécessite votre attention.</p>
<p>Cordialement,<br>Square Meter - Service de candidature</p>
</body></html>`,
    attachments: [{
      filename: 'test-cv.pdf',
      content: cvBuffer,
      contentType: 'application/pdf'
    }]
  };
  
  try {
    console.log('📧 Sending email with CV attachment...');
    console.log('   From: "Square Meter - Service de candidature"');
    console.log('   To:', emailOptions.to);
    console.log('   Attachment:', emailOptions.attachments[0].filename);
    console.log('   Attachment size:', emailOptions.attachments[0].content.length, 'bytes\n');
    
    const info = await transporter.sendMail(emailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n🎉 Test completed successfully!');
    console.log('📧 Check your inbox at:', emailOptions.to);
    console.log('📎 The email should have a downloadable "test-cv.pdf" attachment');
    
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
}

testCVAttachmentEmail().catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
