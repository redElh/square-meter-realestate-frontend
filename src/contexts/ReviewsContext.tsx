// src/contexts/ReviewsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchGoogleReviews, GoogleReview } from '../services/googleReviewsService';

interface ReviewsContextType {
  reviews: GoogleReview[];
  loading: boolean;
  error: string | null;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      console.log('🔄 Fetching Google Reviews (once per session)...');
      setLoading(true);
      try {
        const fetchedReviews = await fetchGoogleReviews();
        console.log('📦 Received reviews:', fetchedReviews);
        console.log('📊 Reviews count:', fetchedReviews?.length || 0);
        setReviews(fetchedReviews);
        console.log('✅ Reviews cached in context');
      } catch (err) {
        console.error('❌ Error loading reviews:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        setLoading(false);
        console.log('🏁 Finished loading reviews');
      }
    };

    loadReviews();
  }, []); // Empty dependency array - runs only once on mount

  return (
    <ReviewsContext.Provider value={{ reviews, loading, error }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
