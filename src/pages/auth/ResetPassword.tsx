import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LockClosedIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import zxcvbn from 'zxcvbn';
import { useToast } from '../../contexts/ToastContext';

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const result = useMemo(() => zxcvbn(password || ''), [password]);
  const score = result?.score ?? 0;

  const getStrengthColor = (s: number) => {
    switch (s) {
      case 0: return 'bg-red-400';
      case 1: return 'bg-orange-400';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-blue-400';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthTextColor = (s: number) => {
    switch (s) {
      case 0: return 'text-red-600';
      case 1: return 'text-orange-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-blue-600';
      case 4: return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const strengthLabel = (s: number) => {
    const labels = [
      t('auth.passwordStrength.veryWeak'),
      t('auth.passwordStrength.weak'),
      t('auth.passwordStrength.medium'),
      t('auth.passwordStrength.strong'),
      t('auth.passwordStrength.veryStrong'),
    ];
    return labels[s] || '';
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showToast('error', t('auth.resetPassword.invalidTokenMessage'));
      return;
    }

    if (password.length < 8) {
      showToast('error', t('auth.validation.passwordMinLength'));
      return;
    }

    if (password !== confirm) {
      showToast('error', t('auth.validation.passwordsMismatch'));
      return;
    }

    if (score < 2) {
      showToast('error', t('auth.resetPassword.errorMessage'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast('error', data.error || t('auth.resetPassword.errorMessage'));
      } else {
        showToast('success', t('auth.resetPassword.successMessage'));
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 1000);
      }
    } catch {
      showToast('error', t('auth.resetPassword.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-inter font-bold text-gray-900 mb-4">{t('auth.resetPassword.invalidTokenTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('auth.resetPassword.invalidTokenMessage')}</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="bg-[#023927] text-white px-6 py-3 font-inter font-medium hover:bg-[#0a4d3a] transition-colors"
          >
            {t('auth.resetPassword.invalidTokenButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
              {t('auth.resetPassword.title')}
            </h1>
            <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-4 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {t('auth.resetPassword.subtitle')}
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
                  {t('auth.resetPassword.newPasswordLabel')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                    required
                    className="w-full px-4 pr-12 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>

                {password && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-inter text-gray-600 text-xs">{t('auth.signup.passwordStrength')}</span>
                      <span className={`font-inter font-medium text-xs ${getStrengthTextColor(score)}`}>
                        {strengthLabel(score)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200">
                      <div
                        className={`h-1.5 transition-all duration-300 ${getStrengthColor(score)}`}
                        style={{ width: `${(score / 4) * 100}%` }}
                      />
                    </div>
                    {result?.feedback?.warning && (
                      <p className="font-inter text-yellow-600 text-xs mt-2">{result.feedback.warning}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                  {t('auth.resetPassword.confirmPasswordLabel')}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !password || !confirm || score < 2}
                className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-3 sm:py-4 font-inter font-medium hover:from-[#0a4d3a] hover:to-[#023927] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <span className="flex items-center justify-center space-x-2">
                  <LockClosedIcon className="w-5 h-5" />
                  <span>{isSubmitting ? t('auth.resetPassword.resettingButton') : t('auth.resetPassword.submitButton')}</span>
                </span>
              </button>
            </form>
          </div>

          <div className="mt-8 bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheckIcon className="w-6 h-6" />
              <h3 className="font-inter font-medium text-lg">{t('auth.resetPassword.securityTitle')}</h3>
            </div>
            <ul className="font-inter text-white/90 text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li>{t('auth.resetPassword.securityDescription1')}</li>
              <li>{t('auth.resetPassword.securityDescription2')}</li>
              <li>{t('auth.resetPassword.securityDescription3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
