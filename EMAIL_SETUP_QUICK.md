# Email Setup Guide - Quick Start

## 📧 How to Receive Property Inquiry Emails

### Step 1: Install Dependencies

```bash
npm install
```

This will install `nodemailer` which was just added to package.json.

### Step 2: Configure Your Email Service

Choose ONE of the following options:

---

#### ✅ **Option 1: Gmail (Easiest - Recommended)**

1. **Enable 2-Step Verification** on your Google Account:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification" → Turn on

2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password (like: `abcd efgh ijkl mnop`)

3. **Add to your `.env.local` file**:
   ```bash
   CONTACT_EMAIL=your-email@gmail.com
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
   ```

**⚠️ Important**: Use the **App Password**, NOT your regular Gmail password!

---

#### Option 2: Outlook/Office365

Add to your `.env.local` file:
```bash
CONTACT_EMAIL=your-email@outlook.com
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-outlook-password
```

---

#### Option 3: Custom Domain / Other SMTP

Add to your `.env.local` file:
```bash
CONTACT_EMAIL=contact@yourdomain.com
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@yourdomain.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@yourdomain.com
```

---

### Step 3: Test It!

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Navigate to the form**:
   ```
   http://localhost:3000/selling-multistep
   ```

3. **Fill out all 4 steps** and submit

4. **Check your email** - you should receive the inquiry!

---

## 🚀 For Production (Vercel)

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add the same variables** you used in `.env.local`

3. **Deploy**:
   ```bash
   vercel deploy --prod
   ```

---

## ✅ Troubleshooting

### "Email not received"
- ✅ Check spam/junk folder
- ✅ Verify CONTACT_EMAIL is correct
- ✅ Check console for error messages
- ✅ Verify email credentials are correct

### "Gmail: Less secure app access"
- ✅ Use App Password (not regular password)
- ✅ Make sure 2-Step Verification is enabled

### "SMTP connection error"
- ✅ Check SMTP_HOST is correct
- ✅ Verify SMTP_PORT (usually 587 or 465)
- ✅ Check firewall isn't blocking the port

---

## 📋 Quick Reference

### Environment Variables You Need:

**Minimum (Gmail)**:
```
CONTACT_EMAIL=your@gmail.com
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**Minimum (SMTP)**:
```
CONTACT_EMAIL=your@domain.com
SMTP_HOST=smtp.domain.com
SMTP_PORT=587
SMTP_USER=your@domain.com
SMTP_PASSWORD=yourpassword
```

---

## 🎯 What Happens When Form is Submitted?

1. User fills form in their language (EN, FR, ES, etc.)
2. Email preview modal appears
3. User reviews and clicks "Send"
4. Email is translated to French (if needed)
5. Email is sent to `CONTACT_EMAIL`
6. Success message appears
7. User is redirected

---

## 📨 Example Email You'll Receive:

```
From: user@example.com
To: your-email@squaremeter.com
Subject: Demande d'estimation immobilière - Essaouira 40000

Chère équipe Square Meter,

Je souhaite obtenir une estimation professionnelle pour mon bien immobilier.
Vous trouverez ci-dessous tous les détails pertinents :

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DÉTAILS DU BIEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Adresse du bien : Essaouira 40000
🏠 Type de bien : Maison
📐 Surface : 100 m²
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MES COORDONNÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Nom complet : Rida Elhiri
📧 Email : redaelhiri9@gmail.com
📞 Téléphone : 0623094246

Je me tiens à votre disposition pour discuter de l'évaluation de mon bien.

Cordialement,
Rida Elhiri
```

---

**Need Help?** Check the console logs for detailed error messages!
