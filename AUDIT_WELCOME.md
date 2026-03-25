## 📖 Welcome to the Square Meter Real Estate Audit

Thank you for your interest! Here's where to find **quickly** what you need.

---

## 🚀 Quick Start (5 min)

**You are:**

### 👔 Recruiter / Hiring Manager?
Go to: **→ [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** → "Recruiter" Section

You'll discover:
- Code quality (TypeScript, React 19, modern patterns)
- Technology choices and justification
- System architecture
- Ability to manage security and compliance

**Time:** ~40 min

---

### 🔒 Security / GDPR Compliance Audit?
Go to: **→ [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** → "Compliance Audit" Section

You'll find:
- **Exactly** where form data goes (email inbox, indefinite)
- Transmission modes (Gmail SMTP, Custom SMTP, SendGrid)
- How data is encrypted (TLS) and where
- GDPR compliance (Lawful Basis, User Rights, incidents)
- Improvement points (consent, rate-limiting, CAPTCHA)

**Key Documents:**
- [DATA_HANDLING.md](DATA_HANDLING.md) — Everything on storage and retention
- [SECURITY_NOTICE.md](SECURITY_NOTICE.md) — API key leak incident and fixes

**Time:** ~30 min

---

### 💻 Developer (Onboarding)?
Go to: **→ [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** → "Developer" Section

You'll find:
- Project structure and navigation
- How to modify code
- Dependencies and their versions
- How to deploy

**Key Documents:**
- [README.md](README.md) — Overview
- [ARCHITECTURE.md](ARCHITECTURE.md) — System flows
- [TECH_STACK.md](TECH_STACK.md) — All dependencies
- `/api` folder — Endpoints (email, AI, google-reviews)
- `/src` folder — React code

**Time:** ~1h

---

## 📚 All Documents Explained

| 📄 File | ⏱️ Duration | 🎯 Purpose |
|---------|--------|-----------|  
| **[DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** | 5 min | **← START HERE** Guides you to the right documents |
| **[README.md](README.md)** | 5 min | Project overview |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | 10 min | How components (frontend, API, services) interact |
| **[TECH_STACK.md](TECH_STACK.md)** | 15 min | Technologies used (React, Tailwind, Nodemailer, Vercel, etc.) |
| **[DATA_HANDLING.md](DATA_HANDLING.md)** | 20 min | **CRITICAL FOR AUDIT** Where data goes, how it's sent, retained |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | 10 min | How to deploy on Vercel |
| **[SECURITY_NOTICE.md](SECURITY_NOTICE.md)** | 5 min | Resolved leak incident (Gemini key), best practices |

---

## 🔑 Key Points to Understand

### 💌 How Forms Work (Inquiry, Careers, Contact)

```
User fills form
    ↓ (HTTPS POST)
Vercel server receives data
    ↓
Translates to French (if language ≠ FR)
    ↓
Sends email via:  Gmail SMTP  OR  Custom SMTP  OR  SendGrid
    ↓
Arrives in recipient's inbox
    ↓ (INDEFINITE - no app DB)
```

**⚠️ Important:** Data is **NOT stored** in app database. It goes directly to recipient email. Retention: see [DATA_HANDLING.md](DATA_HANDLING.md)

### 🌍 Supported Languages
- French (FR)
- English (EN)
- Spanish (ES)
- German (DE)
- Arabic (AR)
- Russian (RU)

### 🤖 AI Assistant (Chatbot)
- Powered by: Google Gemini API
- Stateless (no conversation logs in app)
- Message texts sent to Google (check their privacy policy)

### 📊 Data Collected in Logs
- IP address
- Timestamp
- User-Agent
- Retention: 30 days (Vercel auto-purge)
- ⚠️ May contain PII (emails, etc)

---

## ✅ Audit Checklist

### Security
- [ ] HTTPS/TLS used everywhere
- [ ] API keys in environment variables (never in code)
- [ ] .env files ignored by Git
- [ ] Historical leak (Gemini key) well documented and resolved
- ⚠️ [ ] No rate-limiting on forms (consider adding)
- ⚠️ [ ] No CAPTCHA (consider adding for spam protection)

### GDPR Compliance
- [ ] Minimal data collection (what's necessary)
- [ ] No tracking cookies
- [ ] No geolocation
- [ ] TLS encryption in transit
- ⚠️ [ ] No explicit consent (recommended: add checkbox)
- ⚠️ [ ] Users can request deletion (manual process 5-10 days)

### Code Quality
- [ ] TypeScript for type-safety
- [ ] Modern React 19 with current patterns
- [ ] Tailwind CSS (structure, maintainability)
- [ ] Complete i18n framework (6 languages)
- [ ] ESLint ruleset applied
- ⚠️ [ ] Some ESLint warnings (see npm run build)

### Infrastructure
- [ ] Vercel deployment (CDN, edge functions)
- [ ] Production build every 2-3 min
- [ ] Secure env vars configuration
- [ ] vercel.json properly configured (timeouts, memory)

---

## 📞 Quick Questions

**Q: Where is user data stored?**
→ In recipient's email inbox. See [DATA_HANDLING.md](DATA_HANDLING.md) section 3.

**Q: Is it GDPR-compliant?**
→ Respects principles. Improvement recommendations in [DATA_HANDLING.md](DATA_HANDLING.md) section 7.

**Q: How are CVs sent?**
→ Base64 → Nodemailer email attachment. Details in [DATA_HANDLING.md](DATA_HANDLING.md) section 2.

**Q: Which technologies would you recommend changing?**
→ No major concerns. See [TECH_STACK.md](TECH_STACK.md) for justification of each choice.

**Q: Any security incidents?**
→ One only (Jan 2026, Gemini key). Well managed and resolved. See [SECURITY_NOTICE.md](SECURITY_NOTICE.md).

---

## 🚀 Next Steps

1. **Read** [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) (guides you to the right path)
2. **Review** files for your profile (Recruiter/Compliance/Developer)
3. **Check** the checklist items above
4. **Contact** team for specific questions

---

## 👋 For Recruiting Team

**Tell the team:**

> 👋 Welcome! Start here → [AUDIT_WELCOME.md](AUDIT_WELCOME.md)
> 
> You'll find:
> - **Recruiter:** go to [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) → "Recruiter" (40 min)
> - **Security/GDPR Audit:** go to [DATA_HANDLING.md](DATA_HANDLING.md) + checklist (30 min)
> - **Dev Onboarding:** go to [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) → "Developer" (1h)
>
> **Key Points:**
> - Stack: React 19 + TypeScript + Vercel serverless ✅
> - Forms: Sent via email (Gmail/SMTP/SendGrid), no DB ✅  
> - Data: TLS encrypted, secure env vars, 30d logs ✅
> - GDPR: Compliant with principles, improvement recommendations ✅
> - Incident: API key leaked → quickly fixed ✅

---

## 📊 Summary

```
✅ Cleanup: 44 unnecessary files removed + core docs rewritten
✅ New Docs: TECH_STACK.md + DATA_HANDLING.md + DOCUMENTATION_GUIDE.md + AUDIT_WELCOME.md
✅ Security Hardened: .env removed from git, .gitignore updated, .env.example sanitized
✅ Ready for GitHub: Professional, audit-ready, secure
```

**Repository is now:**
- ✅ Clean & professional
- ✅ Ready for GitHub sharing
- ✅ Documented for external audit
- ✅ Compliant with best practices (secrets, ignore, structure)

---

**Created:** March 2026  
**Status:** Ready for external audit  
**Questions?** See [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) "Support" section
