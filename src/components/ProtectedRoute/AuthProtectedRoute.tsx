import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie, refreshAccessToken } from '../../utils/auth';

const AuthProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'redirect'>('loading');

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (getCookie('accessToken')) {
        if (!cancelled) setStatus('ready');
        return;
      }

      if (!getCookie('refreshToken')) {
        if (!cancelled) setStatus('redirect');
        return;
      }

      const refreshed = await refreshAccessToken();
      if (!cancelled) setStatus(refreshed ? 'ready' : 'redirect');
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'redirect') return <Navigate to="/auth" replace />;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProtectedRoute;
