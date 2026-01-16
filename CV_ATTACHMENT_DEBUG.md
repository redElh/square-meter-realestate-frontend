## CV Attachment Debugging Guide

### Changes Made

1. **Frontend (Careers.tsx)**
   - Added detailed console logging for CV file reading
   - Logs file name, size, and base64 length
   - Logs submission data before sending to API

2. **Backend (send-property-inquiry.js)**
   - Added comprehensive logging for careers applications
   - Logs cvBase64 presence, length, filename, and mimetype
   - Logs buffer creation and attachment details
   - Logs sender name and attachment count

### How to Test

1. **Open Browser Console (F12)**
   - Navigate to Careers page
   - Fill out the form
   - Upload a CV file (PDF, DOC, or DOCX)
   - Click Submit

2. **Check Frontend Logs**
   You should see:
   ```
   📄 Reading CV file: [filename] Size: [bytes] bytes
   ✅ CV converted to base64, length: [number]
   📤 Sent careers application with CV: {cvFilename: "...", cvBase64Length: ..., hasCV: true}
   ```

3. **Check Server Logs (Vercel or local)**
   You should see:
   ```
   🎓 CAREERS APPLICATION DETECTED
      - Has formData: true
      - formData keys: [...]
      - Has cvBase64: true
      - cvBase64 length: [number]
      - cvFilename: [filename]
      - cvMimetype: [mimetype]
   
   📎 Adding CV attachment: {...}
      Buffer created, size: [bytes] bytes
   ✅ CV attachment created successfully
   
   📧 Sending email to: [email]
   📎 Attachments in emailData: 1
   📎 Attachment details: [filename] Size: [bytes] bytes
   
   📧 Preparing to send email with sender: Square Meter - Service de candidature
   📎 Has attachments: true
   ✅ Email sent successfully: [messageId]
   ✅ With 1 attachment(s)
   ```

### Common Issues and Solutions

#### Issue 1: No base64 in frontend
**Symptom**: Frontend shows "⚠️ No CV file selected!"
**Solution**: Ensure file is actually selected before submitting

#### Issue 2: Base64 not reaching API
**Symptom**: API shows "⚠️ No CV attachment - cvBase64 is missing or empty"
**Cause**: JSON payload might be too large or getting truncated
**Solution**: Check Vercel body size limits (default 4.5MB). For larger files, consider:
- Compressing the file before upload
- Using a different upload mechanism (direct to storage)
- Increasing Vercel limits in vercel.json

#### Issue 3: Attachment created but not in email
**Symptom**: API logs show "✅ CV attachment created successfully" but email has no attachment
**Possible causes**:
1. Email provider stripping attachments (security)
2. Email client blocking attachments
3. Nodemailer configuration issue
4. SMTP relay not supporting attachments

**Solutions**:
- Check spam/junk folder
- Check email provider logs (Gmail, SendGrid, etc.)
- Verify SMTP credentials have attachment permissions
- Test with a different email client

#### Issue 4: Email shows filename but no download link
**Symptom**: Email body shows "Nom du fichier: cv.pdf" but no attachment
**Cause**: Attachment not properly added to nodemailer email object
**Status**: FIXED - Buffer now properly created and passed to nodemailer

### Vercel Configuration

If using Vercel, ensure your `vercel.json` includes:

```json
{
  "functions": {
    "api/send-property-inquiry.js": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

### Email Provider Specific Notes

**Gmail**:
- Maximum attachment size: 25MB
- Requires app password (not regular password)
- May block executable files even in PDF

**SendGrid**:
- Maximum attachment size: 30MB
- API has different limits than SMTP
- Check attachment permissions in account

**Custom SMTP**:
- Check server attachment limits
- Verify MIME types are allowed
- Test with simple text file first

### Testing with Small File

Create a simple text file (test.txt) with minimal content and try uploading that first.
This helps isolate if the issue is with:
- File size
- File type
- PDF format
- Binary encoding

### Current Implementation

The attachment is created as:
```javascript
{
  filename: formData.cvFilename || 'cv.pdf',
  content: Buffer.from(formData.cvBase64, 'base64'),
  contentType: formData.cvMimetype || 'application/pdf'
}
```

This is the standard nodemailer format and should work with all email providers.
