# Deployment Guide

This project is designed for Vercel deployment with React frontend + serverless API routes.

## 1. Prerequisites

- Vercel project connected to this repository
- Required environment variables configured in Vercel dashboard

## 2. Required Environment Variables

Set values in Vercel Project Settings > Environment Variables.

Core app and data:
- APIMO_PROVIDER_ID
- APIMO_TOKEN
- APIMO_AGENCY_ID

AI assistant:
- REACT_APP_GEMINI_API_KEY

Email delivery (choose one provider path):
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

Optional translation and article views:
- TRANSLATE_API_URL
- KV_REDIS_URL
- KV_REST_API_URL
- KV_REST_API_TOKEN

Never commit real credentials to Git.

## 3. Deploy

Automatic path:
- Push to the connected production branch.

CLI path:

```bash
npm install -g vercel
vercel --prod
```

## 4. Post-Deploy Verification

- Verify property pages and filters load correctly
- Verify API-backed features respond without errors:
  - property inquiries
  - chatbot endpoint
  - google reviews endpoint
  - article view tracking
- Verify multilingual navigation and page rendering
- Verify contact/inquiry emails are delivered

## 5. Operational Notes

- ChromaDB is intended for local or custom-hosted usage. Serverless production environments generally use fallback flows when vector services are unavailable.
- Keep all secrets in platform-managed env vars.
- Rotate any key immediately if there is a leak suspicion.
