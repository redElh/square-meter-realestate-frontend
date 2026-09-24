const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { getReviews, addReview } = require('../services/airtable');

// ── Rate limiting — 5 reviews / 15 min per IP (brute-force / spam) ──
const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' },
  // Use IP + forwarded header; express-rate-limit handles it
});

// ── Validation & sanitization helpers ────────────────────────────────
const NAME_MIN = 2;
const NAME_MAX = 50;
const COMMENT_MIN = 10;
const COMMENT_MAX = 500;
const NAME_REGEX = /^[\p{L}\s'.-]+$/u;
const URL_PATTERN = /(https?:\/\/|www\.)/i;
const INJECTION_PATTERNS = [
  /<\s*script/i,
  /<\s*iframe/i,
  /<\s*object/i,
  /<\s*embed/i,
  /<\s*svg[^>]*on/i,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /vbscript\s*:/i,
  /\bon\w+\s*=/i,
];

function containsInjection(v) {
  return INJECTION_PATTERNS.some((re) => re.test(v));
}

function sanitizePlainText(v) {
  if (typeof v !== 'string') return '';
  let s = v.replace(/\0/g, '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  s = s.replace(/(javascript|data|vbscript)\s*:/gi, '');
  s = s.replace(/on\w+\s*=/gi, '');
  return s.slice(0, 1000);
}

function validateName(raw) {
  if (typeof raw !== 'string') return 'Le nom est requis.';
  const v = raw.trim();
  if (!v) return 'Le nom est requis.';
  if (v.length < NAME_MIN) return `Le nom doit contenir au moins ${NAME_MIN} caractères.`;
  if (v.length > NAME_MAX) return `Le nom ne peut pas dépasser ${NAME_MAX} caractères.`;
  if (containsInjection(v)) return 'Caractères non autorisés dans le nom.';
  if (URL_PATTERN.test(v)) return 'Les liens ne sont pas autorisés dans le nom.';
  if (!NAME_REGEX.test(v)) return 'Le nom contient des caractères non autorisés.';
  return null;
}

function validateComment(raw) {
  if (typeof raw !== 'string') return 'Le commentaire est requis.';
  const v = raw.trim();
  if (!v) return 'Le commentaire est requis.';
  if (v.length < COMMENT_MIN) return `Le commentaire doit contenir au moins ${COMMENT_MIN} caractères.`;
  if (v.length > COMMENT_MAX) return `Le commentaire ne peut pas dépasser ${COMMENT_MAX} caractères.`;
  if (containsInjection(v)) return 'Contenu non autorisé dans le commentaire.';
  if (URL_PATTERN.test(v)) return 'Les liens ne sont pas autorisés dans le commentaire.';
  if (/(.)\1{7,}/.test(v)) return 'Caractères répétés excessifs.';
  return null;
}

function validateRating(raw) {
  const r = Number(raw);
  if (!Number.isFinite(r)) return 'La note est requise.';
  if (r < 1 || r > 5) return 'La note doit être entre 1 et 5.';
  const rounded = Math.round(r * 10) / 10;
  if (Math.abs(rounded - r) > 0.001) return 'Note invalide.';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const reviews = await getReviews();
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    res.status(500).json({ success: false, error: 'Erreur interne. Veuillez réessayer.' });
  }
});

router.post('/', reviewLimiter, async (req, res) => {
  try {
    const { name, rating, comment, website } = req.body || {};

    // Honeypot — if filled, silently pretend success (confuse bots)
    if (typeof website === 'string' && website.trim() !== '') {
      console.warn('Review honeypot triggered from', req.ip);
      return res.status(201).json({ success: true, review: null });
    }

    // Reject unexpected extra fields (mass assignment protection)
    const allowed = new Set(['name', 'rating', 'comment', 'website']);
    const extra = Object.keys(req.body || {}).filter((k) => !allowed.has(k));
    if (extra.length > 0) {
      return res.status(400).json({ success: false, error: 'Champs non autorisés.' });
    }

    // Strict validation
    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ success: false, error: nameErr });
    const ratingErr = validateRating(rating);
    if (ratingErr) return res.status(400).json({ success: false, error: ratingErr });
    const commentErr = validateComment(comment);
    if (commentErr) return res.status(400).json({ success: false, error: commentErr });

    // Sanitize before storage (defense in depth)
    const safeName = sanitizePlainText(name);
    const safeComment = sanitizePlainText(comment);
    const safeRating = Math.round(Number(rating) * 10) / 10;

    // Re-check after sanitization
    if (safeName.length < NAME_MIN || safeName.length > NAME_MAX) {
      return res.status(400).json({ success: false, error: 'Nom invalide après nettoyage.' });
    }
    if (safeComment.length < COMMENT_MIN || safeComment.length > COMMENT_MAX) {
      return res.status(400).json({ success: false, error: 'Commentaire invalide après nettoyage.' });
    }

    const review = await addReview({ name: safeName, rating: safeRating, comment: safeComment });
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    res.status(500).json({ success: false, error: 'Erreur interne. Veuillez réessayer.' });
  }
});

module.exports = router;
