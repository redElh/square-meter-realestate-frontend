# Vercel Environment Variables Setup

## Required Environment Variables

Before deploying to Vercel, make sure to add these environment variables in your Vercel project settings:

### AI Assistant Configuration

1. **REACT_APP_GEMINI_API_KEY**
   - Google Gemini AI API key for the chatbot
   - Value: `AIzaSyC42wqPiC9ZmLXpGCgyVLYywyNLr2MWhnc`
   - Get from: https://aistudio.google.com/app/apikey
   - Note: This is a FREE API key

### Email Configuration

1. **GMAIL_USER**
   - Your Gmail address used for sending emails
   - Value: `redaelhiri9@gmail.com`

2. **GMAIL_APP_PASSWORD**
   - Gmail App Password (NOT your regular Gmail password)
   - Value: `uonnrlzgmazoxysq`
   - Note: Generate this from Google Account Settings > Security > 2-Step Verification > App passwords

3. **CONTACT_EMAIL**
   - General contact form submissions (default)
   - Value: `Essaouira@m2squaremeter.com`
   - Used for: General inquiries, buy/sell/rent/estimation requests

4. **CONTACT_EMAIL2**
   - Career applications
   - Value: `direction@m2squaremeter.com`
   - Used for: All career/job applications with CV attachments

5. **CONTACT_EMAIL3**
   - Property visit & information requests
   - Value: `Squaremeter@apilead3.net`
   - Used for: "Visite privée" and "Demande d'information" from property detail pages

## Email Routing Logic

The system automatically routes emails based on:

| Source | Subject/Type | Recipient |
|--------|-------------|-----------|
| Careers Form | Any | CONTACT_EMAIL2 (direction@m2squaremeter.com) |
| Contact Form | "visit" (Visite privée) | CONTACT_EMAIL3 (Squaremeter@apilead3.net) |
| Contact Form | "info" (Demande d'information) | CONTACT_EMAIL3 (Squaremeter@apilead3.net) |
| Contact Form | All other subjects | CONTACT_EMAIL (Essaouira@m2squaremeter.com) |
| Property Inquiry | Any | CONTACT_EMAIL (Essaouira@m2squaremeter.com) |

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add each variable with its value
4. Select the environments: Production, Preview, Development (or as needed)
5. Click **Save**
6. Redeploy your application for changes to take effect

## Testing

After deployment, test each form type:
- ✅ General contact form → should go to CONTACT_EMAIL
- ✅ Property visit request → should go to CONTACT_EMAIL3
- ✅ Property info request → should go to CONTACT_EMAIL3
- ✅ Career application → should go to CONTACT_EMAIL2

## Local Development

For local development, ensure your `.env.local` file contains all five variables with the correct values (already configured).

## Security Notes

- Never commit `.env.local` to git (already in .gitignore)
- App passwords are safer than regular passwords for SMTP
- Rotate Gmail App Password if compromised
