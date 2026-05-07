#!/usr/bin/env node
/**
 * Generate sitemap entries for property detail pages using Apimo API
 * Loads env from .env.local if present, fetches properties and injects
 * <url> entries into public/sitemap.xml before </urlset>.
 */

const dotenv = require('dotenv');
// Load .env then .env.local (create-react-app uses .env.local for local env vars)
dotenv.config();
dotenv.config({ path: './.env.local' });
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const PUBLIC_SITEMAP = path.join(__dirname, '..', 'public', 'sitemap.xml');

const providerId = process.env.APIMO_PROVIDER_ID || '4567';
const token = process.env.APIMO_TOKEN || process.env.APIMO_TOKEN || '';
const agencyId = process.env.APIMO_AGENCY_ID || process.env.APIMO_AGENCY_ID || '25311';

if (!token) {
  console.error('APIMO_TOKEN not set in env. Cannot generate property sitemap entries.');
  process.exit(1);
}

const auth = Buffer.from(`${providerId}:${token}`).toString('base64');

async function fetchProperties() {
  const url = `https://api.apimo.pro/agencies/${agencyId}/properties?limit=1000`;
  console.log('Fetching properties from Apimo:', url);
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    }
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Apimo API error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.properties || data.data || [];
}

function makeUrlEntry(loc, lastmod, changefreq = 'monthly', priority = '0.7') {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

async function main() {
  try {
    if (!fs.existsSync(PUBLIC_SITEMAP)) {
      console.error('public/sitemap.xml not found at', PUBLIC_SITEMAP);
      process.exit(1);
    }

    const properties = await fetchProperties();
    console.log(`Fetched ${properties.length} properties`);

    const entries = properties.map(p => {
      const id = p.id || p.reference;
      const updated = p.updated_at || p.updatedAt || new Date().toISOString().split('T')[0];
      const loc = `https://squaremeter.ma/properties/${id}`;
      return makeUrlEntry(loc, updated, 'weekly', '0.8');
    }).join('');

    let sitemap = fs.readFileSync(PUBLIC_SITEMAP, 'utf8');

    // Remove existing property detail url entries to avoid duplicates
    sitemap = sitemap.replace(/<url>[\s\S]*?<loc>https:\/\/squaremeter\.ma\/properties[\s\S]*?<\/url>\n?/g, '');

    // Insert before closing </urlset>
    const idx = sitemap.lastIndexOf('</urlset>');
    if (idx === -1) throw new Error('Invalid sitemap.xml: missing </urlset>');

    const newSitemap = sitemap.slice(0, idx) + entries + '\n' + sitemap.slice(idx);
    fs.writeFileSync(PUBLIC_SITEMAP, newSitemap, 'utf8');
    console.log('Successfully updated public/sitemap.xml with property entries');
  } catch (err) {
    console.error('Failed to generate sitemap entries:', err.message);
    process.exit(1);
  }
}

main();
