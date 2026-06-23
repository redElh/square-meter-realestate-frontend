import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewForm: React.FC = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
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
    setRating(val);
  };

  const handleStarMove = useCallback((starIndex: number, e: React.PointerEvent) => {
    const val = getRatingFromEvent(starIndex, e.clientX);
    setHoverRating(val);
  }, [getRatingFromEvent]);

  const handleStarLeave = useCallback(() => {
    setHoverRating(0);
  }, []);

  const displayRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), rating, comment: comment.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit review');
      }
      setSuccess(true);
      setName('');
      setRating(0);
      setComment('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message);
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
            >
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setFormOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="px-8 pb-8">
                <h3 className="text-xl font-inter uppercase text-[#023927] mb-6 text-center">
                  Partager votre expérience
                </h3>

                {/* Name */}
                <div className="mb-5">
                  <label className="block text-sm font-inter uppercase text-gray-700 mb-2">
                    Votre nom complet
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#023927] outline-none transition-colors bg-white text-gray-900 font-inter text-sm"
                  />
                </div>

                {/* Rating */}
                <div className="mb-5">
                  <label className="block text-sm font-inter uppercase text-gray-700 mb-2">
                    Votre note
                  </label>
                  <div className="flex gap-1" onPointerLeave={handleStarLeave}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const fill = Math.max(0, Math.min(1, displayRating - (star - 1)));
                      return (
                        <span
                          key={star}
                          ref={(el) => { starRefs.current[star] = el; }}
                          className="relative inline-block w-9 h-9 cursor-pointer select-none"
                          onPointerDown={(e) => handleStarDown(star, e)}
                          onPointerMove={(e) => handleStarMove(star, e)}
                        >
                          <svg className="w-full h-full" viewBox="0 0 20 20">
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
                    <span className="ml-2 text-sm font-inter text-gray-500 self-center">
                      {displayRating > 0 ? displayRating.toFixed(1) : ''}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-inter uppercase text-gray-700 mb-2">Votre commentaire</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience avec Square Meter..."
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#023927] outline-none transition-colors bg-white text-gray-900 font-inter text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitting || !name.trim() || !comment.trim() || rating === 0}
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
                    >
                      <svg className="w-5 h-5 inline mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Merci ! Votre avis a été envoyé avec succès.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-inter text-center"
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
