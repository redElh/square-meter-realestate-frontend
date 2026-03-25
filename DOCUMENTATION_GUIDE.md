# Documentation Reading Guide

Welcome to the technical analysis of the Square Meter Real Estate project. This guide helps you navigate the documentation efficiently for your audit.

## 📋 Recommended Reading Structure

### 1. **Start Here** → [README.md](README.md)
   - **Duration:** 5 minutes
   - **Content:** Project overview, folder structure, main capabilities
   - **Goal:** Understand what the application does and its basic stack

### 2. **Technical Architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)
   - **Duration:** 10 minutes
   - **Content:** System components (frontend, API, external services), request flows
   - **Goal:** Understand how different elements interact

### 3. **Detailed Technology Stack** → [TECH_STACK.md](TECH_STACK.md)
   - **Duration:** 15 minutes
   - **Content:** Complete list of dependencies, versions, usage justifications
   - **Key Sections:**
     - Frontend: React, TypeScript, Tailwind, i18n
     - Backend: Nodemailer, serverless API
     - External Services: APIMO, Gemini AI, WordPress
     - Infrastructure: Vercel, build configuration
   - **Goal:** Validate the quality and relevance of technology choices

### 4. **Data Management & Forms** → [DATA_HANDLING.md](DATA_HANDLING.md)
   - **Duration:** 20 minutes
   - **Content:** Form transmission modes, storage, retention, security
   - **Key Sections:**
     - Collection points (inquiry, careers, contact forms)
     - **SMTP Transmission Architecture:** Gmail, Custom SMTP, SendGrid
     - **Storage:** Email inbox (INDEFINITE), logs (30 days), no persistent DB
     - **Security:** TLS in-transit, env vars, known limitations
     - **GDPR:** User rights, compliance, incidents
   - **Goal:** Evaluate GDPR compliance and security risks

### 5. **Deployment & Infrastructure** → [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
   - **Duration:** 10 minutes
   - **Content:** Environment variables, Vercel deployment process
   - **Goal:** Understand how the app deploys to production

### 6. **Security & Secrets** → [SECURITY_NOTICE.md](SECURITY_NOTICE.md)
   - **Duration:** 5 minutes
   - **Content:** Gemini API key leak history, applied fixes
   - **Goal:** Evaluate security incident management

## 🎯 Reading by Persona

### **Recruiter / Technical Manager**
1. README.md (overview)
2. TECH_STACK.md (quality of choices)
3. ARCHITECTURE.md (complexity and design)
4. DATA_HANDLING.md (security/GDPR awareness)

**Total Time:** ~40 minutes

### **Compliance Audit (GDPR/Security)**
1. DATA_HANDLING.md (collection points, storage, retention)
2. SECURITY_NOTICE.md (incident response)
3. DEPLOYMENT_GUIDE.md (secret management)
4. .env.example (required environment variables)

**Total Time:** ~30 minutes

### **Developer (Onboarding)**
1. README.md (project structure)
2. ARCHITECTURE.md (system flows)
3. TECH_STACK.md (dependencies to know)
4. api/ folder (endpoints)
5. src/ folder (React structure)

**Total Time:** ~1 hour

## 📂 Important Files to Review

### Content Files
| File | Purpose | Audience |
|------|---------|----------|
| [README.md](README.md) | Project overview | Everyone |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design | Techs, Managers |
| [TECH_STACK.md](TECH_STACK.md) | Dependencies & versions | Techs, Recruiters |
| [DATA_HANDLING.md](DATA_HANDLING.md) | Data, forms, GDPR | Compliance, Techs |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Vercel deployment | DevOps, Techs |
| [SECURITY_NOTICE.md](SECURITY_NOTICE.md) | Incidents and fixes | Security, Managers |

### Configuration Files
| File | Purpose |
|------|----------|
| [.env.example](.env.example) | Required environment variables |
| [package.json](package.json) | npm dependencies, scripts |
| [vercel.json](vercel.json) | Vercel config (timeouts, memory) |
| [tsconfig.json](tsconfig.json) | TypeScript configuration |
| [tailwind.config.js](tailwind.config.js) | Tailwind CSS configuration |

### Source Code
| Folder | Purpose |
|--------|----------|
| [src/](src/) | React code (components, pages, services) |
| [api/](api/) | Vercel serverless functions (email, AI, etc.) |
| [public/](public/) | Static assets |

## 🔍 Key Points to Validate

### For Code Quality Audit
- ✅ TypeScript used for type safety
- ✅ Modern React 19 with hooks
- ✅ Tailwind CSS (no inline styles)
- ✅ i18n support (6 languages: FR, EN, ES, DE, AR, RU)
- ⚠️ ESLint warnings in some files (see build warnings)

### For Security Audit
- ✅ HTTPS/TLS on all transports
- ✅ Secrets in env vars (never in code)
- ✅ .env files ignored by Git
- ⚠️ No rate limiting on forms (spam vulnerability)
- ⚠️ No CAPTCHA implemented
- ⚠️ Personal data may appear in logs (30 days)

### For GDPR Audit
- ✅ Forms collect minimal data
- ✅ No tracking cookies
- ✅ No geolocation
- ✅ TLS encryption in transit
- ⚠️ No explicit consent (should add)
- ⚠️ Indefinite data retention (email provider)
- ⚠️ No consent for third-party services (Gemini, translation)

## 💡 Frequently Asked Questions

**Q: Where are form data stored?**
A: In recipient's email inbox (Gmail/SendGrid/SMTP), not in app DB. Retention indefinite.

**Q: How does CV sending work?**
A: Base64 encoded in JSON payload, decoded on server, sent as MIME attachment via Nodemailer.

**Q: Which email providers are supported?**
A: Gmail (SMTP + App Password), Custom SMTP (Outlook, Yahoo, etc.), SendGrid API.

**Q: Does AI (Gemini) have access to user data?**
A: No, only the chat message. No identifiers. Check Google policy for log retention.

**Q: How is French translation handled?**
A: LibreTranslate (free, default) or DeepL (paid). Form texts are translated before sending.

**Q: How to manage API key security?**
A: Each key is a Vercel env var (encrypted). If leaked: rotate immediately.

---

## 📞 Support

For specific questions:
- **Code & Architecture:** Review src/ and api/ files
- **Data & Security:** See DATA_HANDLING.md + SECURITY_NOTICE.md
- **Deployment:** See DEPLOYMENT_GUIDE.md
- **Technologies:** See TECH_STACK.md

**Last Updated:** March 2026
