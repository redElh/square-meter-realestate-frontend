# Quick Start Guide - Email Feature

## For Developers

### Test Locally

```bash
# 1. Start the React app
npm start

# 2. Navigate to the form
# http://localhost:3000/selling-multistep

# 3. Fill out the form and submit
# The email preview modal will appear automatically
```

### Using JavaScript Translation (Default - No Setup Required)
✅ Already configured! Just deploy to Vercel.

### Using Python Translation (Optional - Better Quality)

```bash
# 1. Install Python dependencies
pip install -r requirements-translation.txt

# 2. Start the translation service
python api_translation.py

# 3. Update environment variable
PYTHON_TRANSLATION_API=http://localhost:5000
```

## For Product Managers

### Feature Overview
- **What**: Automatic email generation from property inquiry form
- **Languages**: Displays in 6 languages (EN, FR, ES, DE, AR, RU)
- **Translation**: Always sent in French to the agency
- **UX**: Beautiful preview modal, editable content, instant feedback

### User Journey
1. User fills property details (4 steps)
2. Clicks "Submit"
3. Sees generated email in their language
4. Can edit before sending
5. Clicks "Send"
6. Gets success confirmation
7. Auto-redirected to thank you page

## For Designers

### UI Components Added
1. **Email Preview Modal**
   - Full-screen overlay with backdrop blur
   - White card with 2px black border
   - No border radius (sharp corners)
   - Editable fields with focus states
   - Primary and secondary buttons

2. **Alert Notifications**
   - Top-right fixed position
   - Success: White BG, green border, green icon
   - Error: White BG, red border, red icon
   - Fade-in animation
   - Dismissible

### Design System Compliance
✅ Colors match brand palette
✅ Typography uses site fonts
✅ Spacing follows 4px/8px grid
✅ Animations are subtle and smooth
✅ Border radius = 0 (sharp corners)
✅ Responsive on all devices

## For QA

### Test Cases

#### TC1: Email Generation
- [ ] Fill form in English → Email in English
- [ ] Fill form in French → Email in French
- [ ] Fill form in Spanish → Email in Spanish
- [ ] Fill form in German → Email in German
- [ ] Fill form in Arabic → Email in Arabic (RTL)
- [ ] Fill form in Russian → Email in Russian

#### TC2: Form Data Accuracy
- [ ] Address appears in email
- [ ] Property type appears correctly
- [ ] All selected features listed
- [ ] Contact info matches input
- [ ] Timeline/motivation included

#### TC3: Modal Functionality
- [ ] Modal opens after form submit
- [ ] Subject is editable
- [ ] Content is editable
- [ ] Cancel button closes modal
- [ ] Send button shows loading state
- [ ] Close X button works

#### TC4: Translation
- [ ] English email sent in French
- [ ] Spanish email sent in French
- [ ] German email sent in French
- [ ] Already French remains French

#### TC5: Alerts
- [ ] Success alert appears on send
- [ ] Success alert auto-closes (3s)
- [ ] Error alert appears on failure
- [ ] Alert can be manually dismissed

#### TC6: Responsive
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Modal scrolls on small screens

## For DevOps

### Environment Variables Required

```bash
# Minimum (JavaScript only)
CONTACT_EMAIL=contact@squaremeter.com

# Optional (Python translation)
PYTHON_TRANSLATION_API=https://your-python-service.com
DEEPL_API_KEY=your_key_here

# Email service (one of these)
SENDGRID_API_KEY=your_key
# OR
MAILGUN_API_KEY=your_key
MAILGUN_DOMAIN=mg.yourdomain.com
```

### Deploy Checklist
- [ ] Environment variables set
- [ ] API endpoint accessible
- [ ] Translation service running (if using Python)
- [ ] Email service configured
- [ ] Test email sends successfully
- [ ] Monitor error rates

### Monitoring

**Watch for**:
- Translation API failures (fallback to original text)
- Email sending failures (check email service status)
- High error rates in `/api/send-property-inquiry`
- Slow response times (>2s)

## Common Issues & Solutions

### Issue: Modal doesn't appear
**Solution**: Check browser console for JS errors, verify form data is complete

### Issue: Email not sending
**Solution**: Check email service API key, verify CONTACT_EMAIL is set

### Issue: Translation fails
**Solution**: Normal - will send in original language, check translation API status

### Issue: Alert doesn't show
**Solution**: Check network tab for API response, verify showAlert state updates

### Issue: Mobile layout broken
**Solution**: Test on real device, check responsive classes, verify viewport meta tag

## Support

- **Documentation**: See `TRANSLATION_SETUP.md` and `EMAIL_FEATURE_COMPLETE.md`
- **Code**: See inline comments in `SellingMultiStep.tsx` and `send-property-inquiry.js`
- **Issues**: Report bugs in project management system
- **Questions**: Contact development team

## Quick Links

- Form: `/selling-multistep`
- API Endpoint: `/api/send-property-inquiry`
- Translation Service: `python api_translation.py`
- Setup Docs: `TRANSLATION_SETUP.md`
- Complete Docs: `EMAIL_FEATURE_COMPLETE.md`

---

**Status**: ✅ Production Ready  
**Last Updated**: January 15, 2026  
**Version**: 1.0.0
