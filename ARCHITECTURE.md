# Architecture Overview

## System Summary

The project is a React frontend deployed with Vercel serverless functions.

- Frontend: routing, UI, localization, page composition
- Serverless API: email, property data integrations, chatbot, content metrics
- External services: APIMO, Gemini, SMTP providers, Redis/KV, optional translation provider

## Runtime Components

### Frontend (src)

- App entry and routing are defined in src/App.tsx
- App initialization is in src/index.tsx
- Main concerns:
  - property browsing and detail pages
  - multilingual UI and locale-aware content
  - contact and inquiry forms
  - AI assistant integration

### API Layer (api)

Vercel functions expose backend behavior without a standalone server:

- api/apimo.js: property data proxy and integration logic
- api/send-property-inquiry.js: email sending and request formatting
- api/chatbot.js: AI assistant backend route
- api/google-reviews.js: review aggregation/scraping endpoint
- api/article-views.js: article metrics endpoint
- api/wordpress.js: WordPress content endpoint

## Request Flows

### Property Discovery Flow

1. User opens listings page
2. Frontend requests property data through API integration routes
3. Result set is filtered/sorted client-side and rendered
4. Property detail pages load targeted data for selected entries

### Inquiry Email Flow

1. User submits inquiry/career/contact form
2. Frontend posts payload to api/send-property-inquiry.js
3. API validates payload, optionally translates content, and sends via configured provider
4. API returns success/error response for UI feedback

### AI Assistant Flow

1. User sends prompt in assistant UI
2. Frontend sends message to api/chatbot.js
3. API invokes Gemini model with language-specific prompt strategy
4. Response is returned to UI and rendered in the active language context

## Configuration Model

- Client and server behavior depend on environment variables
- Sensitive secrets must be provided only through environment managers (local untracked env files and deployment platform env config)
- Example placeholders are maintained in .env.example

## Deployment Model

- Build: npm run build
- Frontend static assets + serverless functions are deployed by Vercel
- Function runtime constraints are configured in vercel.json

## Security Notes

- Never commit real API keys, SMTP passwords, or private tokens
- Restrict CORS and input validation where possible for public routes
- Rotate credentials immediately when exposed
