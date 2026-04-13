# Square Meter Real Estate Frontend

Production React application for a multilingual luxury real-estate experience, including property discovery, inquiry workflows, and AI-assisted search.

## Main Capabilities

- Multilingual UI with i18n support (FR, EN, ES, DE, AR, RU)
- Property listing and detail flows
- Inquiry and contact workflows with serverless email delivery
- AI assistant endpoint integration for property-related questions
- Google reviews endpoint integration
- SEO-ready pages and metadata support

## Tech Stack

- React 19 + TypeScript
- React Router
- Tailwind CSS
- i18next / react-i18next
- Vercel Serverless Functions (under api)
- Nodemailer (email delivery)

## Project Structure

frontend/
- src/: React application code
- api/: Vercel serverless functions
- public/: static assets
- services/: local scripts/services used by AI and translation workflows

## Local Setup

1. Install dependencies

	npm install

2. Create your local environment file

	- Copy .env.example to .env.local or .env
	- Fill only your own keys and credentials

3. Start development server

	npm start

4. Build for production

	npm run build

## Environment Variables

The following variables are commonly required depending on enabled features:

- APIMO_PROVIDER_ID
- APIMO_TOKEN
- APIMO_AGENCY_ID
- REACT_APP_GEMINI_API_KEY
- CONTACT_EMAIL
- CONTACT_EMAIL2
- CONTACT_EMAIL3
- GMAIL_USER
- GMAIL_APP_PASSWORD
- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- SMTP_PASSWORD
- SMTP_FROM
- SENDGRID_API_KEY
- TRANSLATE_API_URL
- KV_REDIS_URL or KV_REST_API_URL + KV_REST_API_TOKEN

See .env.example for placeholders and DEPLOYMENT_GUIDE.md for deployment notes.

## Serverless API Endpoints

- api/apimo.js
- api/chatbot.js
- api/google-reviews.js
- api/send-property-inquiry.js
- api/article-views.js
- api/wordpress.js

## Documentation

- ARCHITECTURE.md
- DEPLOYMENT_GUIDE.md
- SECURITY_NOTICE.md
- AI_INTEGRATION_GUIDE.md
- RAG_CHATBOT_GUIDE.md
- TRANSLATION_SETUP.md

## Repository Hygiene

This repository was cleaned to remove implementation-status noise, debug outputs, generated artifacts, and tracked local secret files so it is easier to review in hiring and technical audit contexts.

