// src/components/ProtectedRoute/MagProtectedRoute.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const MAG_PASSWORD = 'SquareMeter#2025!Mag';
const MAG_AUTH_KEY = 'mag_authenticated';

interface MagProtectedRouteProps {
  children: React.ReactNode;
}

const MagProtectedRoute: React.FC<MagProtectedRouteProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem(MAG_AUTH_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === MAG_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(MAG_AUTH_KEY, 'true');
      setError('');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023927] via-[#0a4d3a] to-[#023927] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#023927] rounded-full flex items-center justify-center">
              <LockClosedIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 text-center mb-2">
            Protected Content
          </h2>
          <p className="text-gray-600 text-center mb-8 font-inter">
            This page is currently under development. Please enter the password to access.
          </p>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 transition-all duration-300 font-inter pr-12"
                  placeholder="Enter password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 animate-fade-in">
                <p className="text-red-600 text-sm font-inter text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#023927] text-white py-3 rounded-lg font-inter font-medium hover:bg-[#034f38] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Access Magazine
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 text-center mt-6 font-inter">
            For authorized access only. Contact your administrator if you need the password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MagProtectedRoute;
