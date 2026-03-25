# Data Handling, Storage & Privacy

## 1. Data Collection Points

### Property Inquiry Forms
- **Fields:** Name, email, phone, message, property reference
- **Transmission:** HTTPS POST → `/api/send-property-inquiry`
- **Optional:** CV attachment (base64 encoded)

### Career Application Forms
- **Fields:** Name, email, phone, resume/CV file, position, cover letter
- **Transmission:** HTTPS POST → `/api/send-property-inquiry` with `emailType=careers`

### Contact Forms
- **Fields:** Inquiry type, subject, message, name, email, phone
- **Transmission:** HTTPS POST → `/api/send-property-inquiry`

### Metadata Automatically Captured
- IP address (server logs)
- User-Agent, Accept-Language headers
- Submission timestamp
- Referrer URL

### NOT Collected
- Geographic location (no GPS)
- Browsing history except forms
- Device tracking, fingerprinting
- Social media profiles

## 2. Form Submission Flow

### Email Delivery Architecture

```
User Submits Form (HTTPS)
    ↓ (JSON payload)
Vercel Serverless Function /api/send-property-inquiry
    ↓
[1] Validate & Log Request
[2] Optionally Translate to French (if language ≠ FR)
[3] Format as HTML Email
[4] Select Email Provider (choose 1):
    - Gmail SMTP (App Password auth)
    - Custom SMTP server
    - SendGrid API
[5] Send via Nodemailer
    ↓
Email Provider Servers
    ↓
Internal Team Inbox
```

### Email Provider Options

| Provider | Method | Security | Use Case |
|----------|--------|----------|----------|
| **Gmail** | SMTP (587, TLS) | App password (no Gmail password stored) | Quick setup, small teams |
| **Custom SMTP** | SMTP (587/465) | TLS/SSL, credentials in env vars | Corporate infrastructure |
| **SendGrid** | API key + SMTP gateway | API key in env vars | Production volume, delivery tracking |

### Translation During Submission
- If user language ≠ French: subject + body auto-translated to French
- Translation service: LibreTranslate (free, default) or DeepL (premium, optional)
- Translated email sent to recipient team
- User receives confirmation in original language

## 3. Data Storage & Retention

### Email Inbox (Recipient)
- **Duration:** Indefinite (managed by recipient and email provider)
- **Location:** Gmail/Outlook/SendGrid/custom provider servers
- **Backup:** Automatic by provider
- **Deletion:** Manual by recipient or automatic per provider retention policy

### Server-Side Logs
- **Duration:** 30 days (Vercel automatic rotation)
- **Location:** Vercel infrastructure (US by default, EU optional)
- **Content:** Request metadata, errors, email addresses (may leak in logs)
- **Access:** Repository owner via Vercel dashboard
- **Purge:** Automatic

### Application Database
- **Status:** NO persistent database for inquiries
- **Reason:** Inquiries sent directly to email; stateless architecture
- **Details:** No CRM integration, no inquiry logs, no contact table
- **Advantage:** Minimal data retention, reduced privacy risk

### Browser Storage (Client-Side)
- **LocalStorage:** Only app preferences (language, currency)
- **SessionStorage:** Temporary form state during editing
- **Cookies:** None (no tracking cookies)
- **Duration:** User-controlled, cleared on browser privacy reset

### Optional: Article View Metrics (Redis/KV)
- **Duration:** 90 days (configurable)
- **Location:** Upstash Redis or Vercel KV managed cloud
- **Content:** Article ID + anonymous count (no user PII)
- **Retention:** Auto-expire after configured period

## 4. Data Retention Policy Table

| Data Type | Retention | Storage | Deletion |
|-----------|-----------|---------|----------|
| Inquiry emails | Indefinite* | Email inbox | Manual by recipient |
| CV attachments | Indefinite* | Email inbox | Manual by recipient |
| Server logs | 30 days | Vercel | Automatic |
| Browser cache | User-controlled | User device | Browser clear cache |
| Article views | 90 days | Redis/KV | Auto-expire |

*Indefinite because stored by external email provider; cannot control retention.

## 5. Data Security

### In Transit (HTTPS/TLS)
- All form submissions: TLS 1.2+ encrypted
- All email transmission: TLS encrypted
- External API calls: HTTPS only
- No plaintext HTTP transmission

### At Rest
- API keys: Encrypted by Vercel environment variables
- Email inboxes: Encrypted by provider (Gmail, Outlook, SendGrid)
- Logs: Encrypted at Vercel
- No end-to-end encryption (relies on HTTPS + provider encryption)

### Access Control
- Forms: Public (no authentication required; vulnerable to spam)
- Email inboxes: Internal team only (password protected)
- API keys: Environment variables, never logged
- Logs: Repository owner via Vercel dashboard
- Rate limiting: NOT implemented (risk of bulk spam)

### Known Limitations
- No CAPTCHA implemented (spam vulnerability)
- No authentication on forms (anyone can submit)
- Personal data may appear in logs for 30 days
- Email backups may retain data indefinitely

## 6. Third-Party Data Sharing

### APIMO API
- **Sent:** Only agency credentials (internal use)
- **Received:** Property listings only
- **User Data:** No personal info sent

### Google Generative AI (Gemini)
- **Sent:** Only chat message text (no identifiers)
- **Received:** AI response
- **Retention:** Check Google AI privacy policy
- **Risk:** Message content may be retained for service improvement

### Google Maps (Review Scraper)
- **Data:** Public reviews only (headless scraping)
- **User Data:** No personal info sent

### WordPress Blog
- **Data:** Article content only
- **User Data:** No personal info sent

### Translation Services
- **LibreTranslate:** Inquiry text sent to service (may be logged)
- **DeepL:** Same (premium service, different retention)
- **Risk:** Text containing personal info may be retained

### Email Providers
- **Data:** Email subject + body + attachments
- **Retention:** Per provider policy (Gmail indefinite, etc.)

## 7. Legal & Compliance

### GDPR (EU)
- **Lawful Basis:** Legitimate interest (inquiry processing)
- **User Rights:**
  - Access: Contact CONTACT_EMAIL for copy
  - Deletion: Manual process (5–10 business days)
  - Portability: Limited (not stored in app database)
- **Data Controller:** Internal team (recipient)

### Recommendations for Full Compliance
- Add visible privacy notice on forms
- Implement consent checkbox for data processing
- Maintain data processing agreement with email provider
- Log and audit inquiries for compliance
- Implement automated deletion for inquiries > 90 days

### Historical Incident
- **Jan 2026:** Gemini API key accidentally committed
- **Detection:** GitHub secret scanning detected and reported to Google
- **Resolution:** Google auto-revoked the key immediately
- **Impact:** No user data compromised
- **Action:** New key generated and secured

## 8. User Rights & Requests

### Data Subject Access Request (DSAR)
- Contact: CONTACT_EMAIL
- Provide: Name, email, inquiry date
- Response: 30 days (GDPR requirement)

### Right to Deletion
- Contact: CONTACT_EMAIL
- Action: Manual deletion from inbox
- Timeline: 5–10 business days
- Limitation: Cannot remove from provider backups

### Incident Reporting
- Contact: CONTACT_EMAIL
- Response: 5 business days

---

**Last Updated:** March 2026
**Status:** Requires consent implementation for full GDPR compliance
