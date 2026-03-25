# Technology Stack Documentation

## Frontend

### Core Framework
- **React** 19.2.3 — UI component library and virtual DOM
- **TypeScript** 4.9.5 — Static type checking and development safety
- **React Router** 7.9.3 — Client-side routing and navigation

### Styling & UI
- **Tailwind CSS** 3.4.18 — Utility-first CSS framework
- **Tailwind Typography** 0.5.19 — Prose styling plugin
- **Heroicons** 2.2.0 — SVG icon library
- **PostCSS** 8.5.6 — CSS tooling
- **Autoprefixer** 10.4.21 — Vendor prefix management

### Internationalization (i18n)
- **i18next** 23.11.5 — Translation framework
- **react-i18next** 14.1.0 — React bindings for i18next
- **i18next-browser-languagedetector** 8.2.0 — Automatic language detection
- **i18next-http-backend** 3.0.2 — Translation file loading over HTTP

### State Management & Data Fetching
- **TanStack React Query** 5.90.2 — Server state management and synchronization
- **React Hook Form** 7.65.0 — Performant form handling
- **Zod** 4.1.12 — TypeScript-first schema validation

### Form & Validation
- **@hookform/resolvers** 5.2.2 — Zod integration with React Hook Form
- **libphonenumber-js** 1.12.34 — International phone number validation
- **zxcvbn** 4.4.2 — Password strength estimation

### Utilities & SEO
- **Axios** 1.13.2 — HTTP client for API calls
- **Framer Motion** 12.23.24 — Animation library
- **React Helmet Async** 2.0.5 — Document head management (Meta tags, SEO)
- **currency-codes** 2.2.0 — Currency code lookup
- **iso-639-1** 3.1.5 — ISO language code lookups

### Testing
- **@testing-library/react** 16.3.0 — React component testing
- **@testing-library/jest-dom** 6.9.1 — Jest matchers

## Backend (Serverless Functions)

### Runtime
- **Node.js** (Vercel/AWS Lambda runtime) — Serverless execution

### Email Delivery
- **Nodemailer** 6.9.7 — Multi-provider email sending
  - **Gmail SMTP:** App Password authentication, TLS encryption
  - **Custom SMTP:** Support for Outlook, Yahoo, corporate mail servers
  - **SendGrid:** API gateway for production-grade delivery
  - **Features:** HTML/plaintext templates, attachment support (CV files), reply-to handling

### HTTP & API
- **http-proxy-middleware** 3.0.5 — API request proxying and routing
- **node-fetch** 2.7.0 — Server-side fetch implementation

### Web Automation
- **Playwright** 1.58.1 — Headless browser automation for Google Maps review scraping
- **Cheerio** 1.1.0 — Server-side DOM manipulation

### Build & Config
- **craco** 7.1.0 — Create React App override (Tailwind, PostCSS config)
- **react-scripts** 5.0.1 — Build and dev server orchestration

## External Services

### Real Estate Data
- **APIMO API** — Property listing provider
  - Authentication: Token-based with agency ID routing
  - Data: Property listings, details, availability

### AI Services
- **Google Generative AI (Gemini)** (@google/generative-ai 0.24.1)
  - Model: gemini-2.0-flash-exp
  - Use: Natural language Q&A for property search, multilingual support
  - Security: API key in environment variables, no data logging by app

### Reviews & Content
- **Google Maps Scraper** (Playwright-based)
  - Free scraping (no API key), extracts ratings, reviews, metadata
- **WordPress REST API**
  - Data: Blog articles and magazine content

### Data Caching
- **Upstash Redis / Vercel KV**
  - Use: Article view count metrics
  - Retention: Configurable (default 90 days)

### Translation (Optional)
- **LibreTranslate** (default): Free, no API key
- **DeepL** (premium option): Higher quality, API key auth

## Infrastructure & Deployment

### Hosting Platform
- **Vercel** — Serverless deployment
  - Functions: Node.js runtime, 512–1024 MB memory, 10–60s timeout
  - Builds with Create React App
  - Environment: Production, preview branches
  - Configuration: vercel.json

## Development Tools
- npm (package management)
- ESLint + TypeScript
- Jest (testing framework)
- Playwright (E2E testing capability)

## Performance Profile
- Main JS bundle: ~862 KB (gzipped)
- CSS: ~13.4 KB (gzipped)
- Lazy-loaded chunks: ~1.76 KB (gzipped)
- Build time: ~2–3 minutes

## Dependency Security
- No high-severity vulnerabilities in current dependencies
- Active maintenance cycle (2024–2025 updates)
- Secrets managed via environment variables only

---

**Last Updated:** March 2026
