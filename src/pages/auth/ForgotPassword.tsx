import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EnvelopeIcon, ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../contexts/ToastContext';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/auth/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast('error', data.error || t('auth.forgotPassword.errorMessage'));
      } else {
        showToast('success', t('auth.forgotPassword.successMessage'));
      }
    } catch {
      showToast('error', t('auth.forgotPassword.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
              {t('auth.forgotPassword.title')}
            </h1>
            <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-4 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {t('auth.forgotPassword.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="max-w-lg mx-auto">
          <div className="bg-white border-2 border-gray-200 p-4 sm:p-6 lg:p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                  {t('auth.forgotPassword.emailLabel')}
                </label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.forgotPassword.emailPlaceholder')}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-3 sm:py-4 font-inter font-medium hover:from-[#0a4d3a] hover:to-[#023927] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? t('auth.forgotPassword.sendingButton') : t('auth.forgotPassword.submitButton')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/auth"
                className="font-inter text-[#023927] hover:text-[#0a4d3a] transition-colors duration-300 text-sm font-medium inline-flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                {t('auth.forgotPassword.backToLogin')}
              </Link>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheckIcon className="w-6 h-6" />
              <h3 className="font-inter font-medium text-lg">{t('auth.forgotPassword.securityTitle')}</h3>
            </div>
            <p className="font-inter text-white/90 text-sm leading-relaxed">
              {t('auth.forgotPassword.securityDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
