import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';

// ── Security constants ──────────────────────────────────────────────
const NAME_MIN = 2;
const NAME_MAX = 50;
const COMMENT_MIN = 10;
const COMMENT_MAX = 500;
// Allow Unicode letters, spaces, apostrophes, hyphens, dots
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
  /\bon\w+\s*=/i, // onerror=, onload=, etc.
];
const RATE_LIMIT_MS = 60_000; // 1 submission / minute (client-side)
const RATE_LIMIT_KEY = 'review:lastSubmitAt';

function containsInjection(value: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(value));
}

function sanitizePlainText(value: string): string {
  // Strip all HTML, keep text only
  const clean = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  // Extra: remove null bytes and normalize whitespace
  return clean.replace(/\0/g, '').replace(/\s+/g, ' ').trim();
}

function validateName(raw: string): string | null {
  const v = raw.trim();
  if (!v) return 'Votre nom est requis.';
  if (v.length < NAME_MIN) return `Votre nom doit contenir au moins ${NAME_MIN} caractères.`;
  if (v.length > NAME_MAX) return `Votre nom ne peut pas dépasser ${NAME_MAX} caractères.`;
  if (containsInjection(v)) return 'Caractères non autorisés détectés.';
  if (URL_PATTERN.test(v)) return 'Les liens ne sont pas autorisés dans le nom.';
  if (!NAME_REGEX.test(v)) return 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets.';
  return null;
}

function validateComment(raw: string): string | null {
  const v = raw.trim();
  if (!v) return 'Votre commentaire est requis.';
  if (v.length < COMMENT_MIN) return `Votre commentaire doit contenir au moins ${COMMENT_MIN} caractères.`;
  if (v.length > COMMENT_MAX) return `Votre commentaire ne peut pas dépasser ${COMMENT_MAX} caractères.`;
  if (containsInjection(v)) return 'Contenu non autorisé détecté (HTML / script).';
  if (URL_PATTERN.test(v)) return 'Les liens ne sont pas autorisés dans le commentaire.';
  // Reject excessive repeated characters (spam)
  if (/(.)\1{7,}/.test(v)) return 'Caractères répétés excessifs détectés.';
  return null;
}

function validateRating(rating: number): string | null {
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return 'Veuillez sélectionner une note entre 1 et 5.';
  // Allow one decimal place
  const rounded = Math.round(rating * 10) / 10;
  if (Math.abs(rounded - rating) > 0.001) return 'Note invalide.';
  return null;
}

const ReviewForm: React.FC = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; rating?: string; comment?: string }>({});
  // Honeypot — hidden from real users, bots fill it
  const [website, setWebsite] = useState('');
  const starRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const getRatingFromEvent = useCallback((starIndex: number, clientX: number) => {
    const el = starRefs.current[starIndex];
    if (!el) return starIndex;
    const rect = el.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round((starIndex - 1 + fraction) * 10) / 10;
  }, []);

  const handleStarDown = (starIndex: number, e: React.PointerEvent) => {
    const val = getRatingFromEvent(starIndex, e.clientX);
    // Clamp 1-5
    setRating(Math.min(5, Math.max(1, val)));
  };

  const handleStarMove = useCallback((starIndex: number, e: React.PointerEvent) => {
    const val = getRatingFromEvent(starIndex, e.clientX);
    setHoverRating(Math.min(5, Math.max(0.5, val)));
  }, [getRatingFromEvent]);

  const handleStarLeave = useCallback(() => {
    setHoverRating(0);
  }, []);

  const displayRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: silently succeed if filled (trick bots)
    if (website.trim() !== '') {
      setSuccess(true);
      setFormOpen(false);
      setName('');
      setComment('');
      setRating(0);
      setWebsite('');
      setTimeout(() => setSuccess(false), 4000);
      return;
    }

    // Client-side rate limiting
    try {
      const last = Number(localStorage.getItem(RATE_LIMIT_KEY) || '0');
      if (last && Date.now() - last < RATE_LIMIT_MS) {
        const wait = Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 1000);
        setError(`Veuillez patienter ${wait}s avant de renvoyer un avis.`);
        return;
      }
    } catch {
      // localStorage may be unavailable — ignore
    }

    // Validate all fields
    const nameErr = validateName(name);
    const commentErr = validateComment(comment);
    const ratingErr = validateRating(rating);
    const errors: typeof fieldErrors = {};
    if (nameErr) errors.name = nameErr;
    if (commentErr) errors.comment = commentErr;
    if (ratingErr) errors.rating = ratingErr;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Veuillez corriger les champs indiqués.');
      return;
    }

    setSubmitting(true);
    setError('');
    setFieldErrors({});

    // Sanitize before sending — defense in depth (backend also sanitizes)
    const safeName = sanitizePlainText(name);
    const safeComment = sanitizePlainText(comment);
    const safeRating = Math.round(Math.min(5, Math.max(1, rating)) * 10) / 10;

    // Re-validate sanitized (length may have changed)
    const postNameErr = validateName(safeName);
    const postCommentErr = validateComment(safeComment);
    if (postNameErr || postCommentErr) {
      setError(postNameErr || postCommentErr || 'Contenu invalide après nettoyage.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Include honeypot as empty website field — backend checks it
        body: JSON.stringify({ name: safeName, rating: safeRating, comment: safeComment, website: '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Do not leak raw backend error HTML — show safe message
        const msg = typeof data.error === 'string' ? data.error : 'Échec de l’envoi. Veuillez réessayer.';
        throw new Error(msg);
      }
      try {
        localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      } catch {}
      setSuccess(true);
      setName('');
      setRating(0);
      setComment('');
      setWebsite('');
      setFieldErrors({});
      setTimeout(() => setSuccess(false), 4000);
      setTimeout(() => setFormOpen(false), 1500);
    } catch (err: any) {
      // Escape error text — render as plain text only
      const rawMsg = err?.message || 'Erreur réseau. Veuillez réessayer.';
      setError(sanitizePlainText(String(rawMsg)).slice(0, 300));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16">
      <motion.button
        onClick={() => setFormOpen(true)}
        className="mx-auto flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#023927] text-[#023927] font-inter uppercase text-sm tracking-wide hover:bg-[#023927] hover:text-white transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Donnez votre avis
      </motion.button>

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setFormOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-modal-title"
            >
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setFormOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Fermer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="px-8 pb-8" noValidate>
                <h3 id="review-modal-title" className="text-xl font-inter uppercase text-[#023927] mb-6 text-center">
                  Partager votre expérience
                </h3>

                {/* Honeypot — must stay empty, hidden via CSS off-screen (not display:none so bots fill it) */}
                <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="review-website">Website</label>
                  <input
                    id="review-website"
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name */}
                <div className="mb-5">
                  <label htmlFor="review-name" className="block text-sm font-inter uppercase text-gray-700 mb-2">
                    Votre nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                    minLength={NAME_MIN}
                    maxLength={NAME_MAX}
                    autoComplete="name"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'review-name-error' : undefined}
                    className={`w-full px-4 py-3 border-2 outline-none transition-colors bg-white text-gray-900 font-inter text-sm ${fieldErrors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#023927]'}`}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">{name.length}/{NAME_MAX}</span>
                    {fieldErrors.name && <span id="review-name-error" className="text-xs text-red-600">{fieldErrors.name}</span>}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-5">
                  <label className="block text-sm font-inter uppercase text-gray-700 mb-2">
                    Votre note <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex gap-1 p-1 rounded ${fieldErrors.rating ? 'ring-2 ring-red-300' : ''}`} onPointerLeave={handleStarLeave} role="radiogroup" aria-label="Note">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const fill = Math.max(0, Math.min(1, displayRating - (star - 1)));
                      return (
                        <span
                          key={star}
                          ref={(el) => { starRefs.current[star] = el; }}
                          className="relative inline-block w-9 h-9 cursor-pointer select-none"
                          onPointerDown={(e) => handleStarDown(star, e)}
                          onPointerMove={(e) => handleStarMove(star, e)}
                          role="radio"
                          aria-checked={Math.round(rating * 10) / 10 === star || (rating > star - 1 && rating < star)}
                          aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                        >
                          <svg className="w-full h-full" viewBox="0 0 20 20" aria-hidden="true">
                            <defs>
                              <linearGradient id={`star-grad-${star}`}>
                                <stop offset={`${fill * 100}%`} stopColor="#FFD700" />
                                <stop offset={`${fill * 100}%`} stopColor="#D1D5DB" />
                              </linearGradient>
                            </defs>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill={`url(#star-grad-${star})`} />
                          </svg>
                        </span>
                      );
                    })}
                    <span className="ml-2 text-sm font-inter text-gray-500 self-center" aria-live="polite">
                      {displayRating > 0 ? displayRating.toFixed(1) : ''}
                    </span>
                  </div>
                  {fieldErrors.rating && <p className="text-xs text-red-600 mt-1">{fieldErrors.rating}</p>}
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label htmlFor="review-comment" className="block text-sm font-inter uppercase text-gray-700 mb-2">Votre commentaire <span className="text-red-500">*</span></label>
                  <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience avec Square Meter..."
                    required
                    rows={4}
                    minLength={COMMENT_MIN}
                    maxLength={COMMENT_MAX}
                    aria-invalid={!!fieldErrors.comment}
                    aria-describedby={fieldErrors.comment ? 'review-comment-error' : 'review-comment-hint'}
                    className={`w-full px-4 py-3 border-2 outline-none transition-colors bg-white text-gray-900 font-inter text-sm resize-none ${fieldErrors.comment ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#023927]'}`}
                  />
                  <div className="flex justify-between mt-1">
                    <span id="review-comment-hint" className="text-xs text-gray-400">Les liens et le HTML ne sont pas autorisés.</span>
                    <span className={`text-xs ${comment.length > COMMENT_MAX * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>{comment.length}/{COMMENT_MAX}</span>
                  </div>
                  {fieldErrors.comment && <p id="review-comment-error" className="text-xs text-red-600 mt-1">{fieldErrors.comment}</p>}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#023927] text-white py-4 font-inter uppercase text-sm tracking-wide hover:bg-[#01261c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: submitting ? 1 : 1.01 }}
                  whileTap={{ scale: submitting ? 1 : 0.99 }}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer mon avis'
                  )}
                </motion.button>

                {/* Success */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 text-sm font-inter text-center"
                      role="status"
                    >
                      <svg className="w-5 h-5 inline mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Merci ! Votre avis a été envoyé avec succès.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error — render as plain text only */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-inter text-center break-words"
                      role="alert"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewForm;
