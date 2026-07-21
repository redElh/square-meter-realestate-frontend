import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const PROPERTY_STATS_AUTH_KEY = 'property_stats_team_authenticated';

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

interface PropertyStatsProtectedRouteProps {
  children: React.ReactNode;
}

const PropertyStatsProtectedRoute: React.FC<PropertyStatsProtectedRouteProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem(PROPERTY_STATS_AUTH_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const validatePasswordInput = (candidate: string): string | null => {
    if (!candidate) {
      return t('statsProtection.emptyPasswordError', {
        defaultValue: 'Please enter your password.',
      });
    }

    if (candidate.length < MIN_PASSWORD_LENGTH) {
      return t('statsProtection.tooShortError', {
        min: MIN_PASSWORD_LENGTH,
        defaultValue: 'Password input must contain at least {{min}} characters.',
      });
    }

    if (candidate.length > MAX_PASSWORD_LENGTH) {
      return t('statsProtection.tooLongError', {
        max: MAX_PASSWORD_LENGTH,
        defaultValue: 'Password input cannot exceed {{max}} characters.',
      });
    }

    if (/[^\x20-\x7E]/.test(candidate)) {
      return t('statsProtection.invalidCharactersError', {
        defaultValue: 'Invalid characters detected. Use only supported ASCII symbols.',
      });
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPassword = password.normalize('NFKC');
    const validationError = validatePasswordInput(normalizedPassword);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: normalizedPassword, section: 'analytics' }),
      });

      const data = await res.json();

      if (res.ok && data.authenticated) {
        sessionStorage.setItem(PROPERTY_STATS_AUTH_KEY, 'true');
        setIsAuthenticated(true);
        setError('');
        setPassword('');
      } else if (res.status === 429) {
        setError(
          t('statsProtection.lockedError', {
            seconds: data.retryAfter || 60,
            defaultValue: 'Too many failed attempts. Try again in {{seconds}} seconds.',
          })
        );
        setPassword('');
      } else if (res.status === 401) {
        const remaining = data.remainingAttempts ?? 0;
        setError(
          t('statsProtection.invalidPasswordWithAttempts', {
            remainingAttempts: remaining,
            defaultValue: 'Invalid password. {{remainingAttempts}} attempt(s) remaining.',
          })
        );
        setPassword('');
      } else {
        setError(data.error || 'Authentication failed');
        setPassword('');
      }
    } catch {
      setError('Network error. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-emerald-200/25 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <section className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-[10px] sm:text-xs font-semibold tracking-[0.12em] uppercase">
              <ShieldCheckIcon className="w-3.5 h-3.5 sm:w-4 h-4" />
              {t('statsProtection.eyebrow', { defaultValue: 'Secure Area' })}
            </div>

            <h1 className="mt-4 sm:mt-5 text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {t('statsProtection.title', { defaultValue: 'Team Access Required' })}
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-gray-600 leading-relaxed">
              {t('statsProtection.subtitle', {
                defaultValue:
                  'The Analytics page is reserved for agency team members who have the internal access password.',
              })}
            </p>

            <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-amber-900">
                    {t('statsProtection.disclaimerTitle', { defaultValue: 'Notice for visitors' })}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-amber-800 leading-relaxed">
                    {t('statsProtection.disclaimerBody', {
                      defaultValue:
                        'If you are not part of the Square Meter team, this page is not accessible. Please continue browsing the public sections of the website.',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-3 sm:p-4">
                <ChartBarIcon className="w-4 h-4 sm:w-5 h-5 text-[#023927] mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  {t('statsProtection.analyticsCardTitle', { defaultValue: 'Property Analytics' })}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-3 sm:p-4">
                <ShieldCheckIcon className="w-4 h-4 sm:w-5 h-5 text-[#023927] mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  {t('statsProtection.teamCardTitle', { defaultValue: 'Internal Team Access' })}
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#023927] hover:text-[#04553d] transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {t('statsProtection.backLabel', { defaultValue: 'Back to homepage' })}
            </Link>
          </section>

          <section className="bg-white/90 backdrop-blur-xl border border-gray-200/70 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#023927] to-[#0a4d3a] flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <LockClosedIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>

              <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-semibold text-gray-900">
                {t('statsProtection.authenticationTitle', { defaultValue: 'Authentication' })}
              </h2>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                {t('statsProtection.helperBody', {
                  defaultValue: 'Please contact an internal administrator for credentials.',
                })}
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                <div>
                  <label htmlFor="property-stats-password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    {t('statsProtection.passwordLabel', { defaultValue: 'Team password' })}
                  </label>
                  <div className="relative">
                    <input
                      id="property-stats-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (error) {
                          setError('');
                        }
                      }}
                      placeholder={t('statsProtection.passwordPlaceholder', {
                        defaultValue: 'Enter access password',
                      })}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 sm:py-3 pr-12 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#023927] focus:ring-4 focus:ring-[#023927]/10 transition-all"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      maxLength={MAX_PASSWORD_LENGTH}
                      aria-invalid={Boolean(error)}
                      autoFocus
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((currentValue) => !currentValue)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={t('statsProtection.togglePasswordVisibility', {
                        defaultValue: 'Toggle password visibility',
                      })}
                    >
                      {showPassword ? <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 sm:py-3">
                    <p className="text-xs sm:text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#023927] to-[#0a4d3a] px-5 py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold shadow-lg shadow-emerald-900/20 hover:from-[#04553d] hover:to-[#0f6248] transition-all disabled:opacity-50"
                >
                  {loading ? '...' : t('statsProtection.button', { defaultValue: 'Access Analytics Page' })}
                </button>
              </form>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
              <p className="text-[10px] sm:text-xs text-gray-500">
                {t('statsProtection.footerNote', {
                  defaultValue: 'Access is restricted to authorized agency team members only.',
                })}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-gray-400">
                {t('statsProtection.helperTitle', { defaultValue: 'Need access?' })}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PropertyStatsProtectedRoute;
