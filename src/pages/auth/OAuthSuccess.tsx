// src/pages/auth/OAuthSuccess.tsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      navigate('/auth', { replace: true });
      return;
    }

    fetch('/auth/exchange', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.role && data.user.id) {
            navigate(`/dashboard/${data.user.role}/${data.user.id}`, { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          navigate('/auth', { replace: true });
        }
      })
      .catch(() => navigate('/auth', { replace: true }));
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#023927] to-[#0a4d3a]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        <p className="text-white text-lg font-inter">Authenticating...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
