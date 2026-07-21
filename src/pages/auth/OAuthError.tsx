// src/pages/auth/OAuthError.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';

const OAuthError: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#023927] to-[#0a4d3a]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
        <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
        <p className="text-gray-600 mb-4">There was an error during the authentication process.</p>
        <p className="text-sm text-gray-500">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default OAuthError;
