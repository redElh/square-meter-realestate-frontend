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

const PROPERTY_STATS_PASSWORD = 'SM-TEAM::Analytics#2026!M2@A9qL7vR3';
const PROPERTY_STATS_AUTH_KEY = 'property_stats_team_authenticated';
const PROPERTY_STATS_ATTEMPTS_KEY = 'property_stats_team_attempts';
const PROPERTY_STATS_LOCK_KEY = 'property_stats_team_lock_until';

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000;

// Strict allow-list blocks potentially dangerous payload characters while supporting strong passwords.
const ALLOWED_PASSWORD_CHARACTERS = /^[A-Za-z0-9!@#$%^&*()_\-+=:|.?/]+$/;

const constantTimeEquals = (first: string, second: string): boolean => {
  const encoder = new TextEncoder();
  const firstBytes = encoder.encode(first);
  const secondBytes = encoder.encode(second);
  const maxLength = Math.max(firstBytes.length, secondBytes.length);

  let difference = firstBytes.length ^ secondBytes.length;

  for (let index = 0; index < maxLength; index += 1) {
    const firstByte = index < firstBytes.length ? firstBytes[index] : 0;
    const secondByte = index < secondBytes.length ? secondBytes[index] : 0;
    difference |= firstByte ^ secondByte;
  }

  return difference === 0;
};

interface PropertyStatsProtectedRouteProps {
  children: React.ReactNode;
}

const PropertyStatsProtectedRoute: React.FC<PropertyStatsProtectedRouteProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  const resetProtectionState = () => {
    setFailedAttempts(0);
    setLockUntil(null);
    sessionStorage.removeItem(PROPERTY_STATS_ATTEMPTS_KEY);
    sessionStorage.removeItem(PROPERTY_STATS_LOCK_KEY);
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem(PROPERTY_STATS_AUTH_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    const storedAttempts = Number(sessionStorage.getItem(PROPERTY_STATS_ATTEMPTS_KEY) || '0');
    if (Number.isFinite(storedAttempts) && storedAttempts > 0) {
      setFailedAttempts(storedAttempts);
    }

    const storedLockUntil = Number(sessionStorage.getItem(PROPERTY_STATS_LOCK_KEY) || '0');
    if (Number.isFinite(storedLockUntil) && storedLockUntil > Date.now()) {
      setLockUntil(storedLockUntil);
    } else {
      sessionStorage.removeItem(PROPERTY_STATS_LOCK_KEY);
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

    if (!ALLOWED_PASSWORD_CHARACTERS.test(candidate)) {
      return t('statsProtection.invalidCharactersError', {
        defaultValue: 'Invalid characters detected. Use only supported ASCII symbols.',
      });
    }

    return null;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (lockUntil && lockUntil > Date.now()) {
      const seconds = Math.ceil((lockUntil - Date.now()) / 1000);
      setError(
        t('statsProtection.lockedError', {
          seconds,
          defaultValue: 'Too many failed attempts. Try again in {{seconds}} seconds.',
        })
      );
      return;
    }

    if (lockUntil && lockUntil <= Date.now()) {
      resetProtectionState();
    }

    const normalizedPassword = password.normalize('NFKC');
    const validationError = validatePasswordInput(normalizedPassword);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (constantTimeEquals(normalizedPassword, PROPERTY_STATS_PASSWORD)) {
      sessionStorage.setItem(PROPERTY_STATS_AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
      setPassword('');
      resetProtectionState();
      return;
    }

    const updatedAttempts = failedAttempts + 1;

    if (updatedAttempts >= MAX_FAILED_ATTEMPTS) {
      const nextLockUntil = Date.now() + LOCKOUT_DURATION_MS;
      setLockUntil(nextLockUntil);
      sessionStorage.setItem(PROPERTY_STATS_LOCK_KEY, String(nextLockUntil));
      setFailedAttempts(0);
      sessionStorage.removeItem(PROPERTY_STATS_ATTEMPTS_KEY);
      setError(
        t('statsProtection.lockedError', {
          seconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
          defaultValue: 'Too many failed attempts. Try again in {{seconds}} seconds.',
        })
      );
      setPassword('');
      return;
    }

    setFailedAttempts(updatedAttempts);
    sessionStorage.setItem(PROPERTY_STATS_ATTEMPTS_KEY, String(updatedAttempts));
    setError(
      t('statsProtection.invalidPasswordWithAttempts', {
        remainingAttempts: MAX_FAILED_ATTEMPTS - updatedAttempts,
        defaultValue: 'Invalid password. {{remainingAttempts}} attempt(s) remaining.',
      })
    );
    setPassword('');
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-emerald-200/25 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <section className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold tracking-[0.12em] uppercase">
              <ShieldCheckIcon className="w-4 h-4" />
              {t('statsProtection.eyebrow', { defaultValue: 'Secure Area' })}
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {t('statsProtection.title', { defaultValue: 'Team Access Required' })}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              {t('statsProtection.subtitle', {
                defaultValue:
                  'The Analytics page is reserved for agency team members who have the internal access password.',
              })}
            </p>

            <div className="mt-8 p-5 rounded-2xl bg-amber-50/90 border border-amber-200">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-amber-900">
                    {t('statsProtection.disclaimerTitle', { defaultValue: 'Notice for visitors' })}
                  </h2>
                  <p className="mt-1 text-sm text-amber-800 leading-relaxed">
                    {t('statsProtection.disclaimerBody', {
                      defaultValue:
                        'If you are not part of the Square Meter team, this page is not accessible. Please continue browsing the public sections of the website.',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
                <ChartBarIcon className="w-5 h-5 text-[#023927] mb-2" />
                <p className="text-sm font-semibold text-gray-900">
                  {t('statsProtection.analyticsCardTitle', { defaultValue: 'Property Analytics' })}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
                <ShieldCheckIcon className="w-5 h-5 text-[#023927] mb-2" />
                <p className="text-sm font-semibold text-gray-900">
                  {t('statsProtection.teamCardTitle', { defaultValue: 'Internal Team Access' })}
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#023927] hover:text-[#04553d] transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {t('statsProtection.backLabel', { defaultValue: 'Back to homepage' })}
            </Link>
          </section>

          <section className="bg-white/90 backdrop-blur-xl border border-gray-200/70 rounded-3xl shadow-xl p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#023927] to-[#0a4d3a] flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <LockClosedIcon className="w-7 h-7 text-white" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-gray-900">
                {t('statsProtection.authenticationTitle', { defaultValue: 'Authentication' })}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t('statsProtection.helperBody', {
                  defaultValue: 'Please contact an internal administrator for credentials.',
                })}
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <div>
                  <label htmlFor="property-stats-password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#023927] focus:ring-4 focus:ring-[#023927]/10 transition-all"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      maxLength={MAX_PASSWORD_LENGTH}
                      aria-invalid={Boolean(error)}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((currentValue) => !currentValue)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={t('statsProtection.togglePasswordVisibility', {
                        defaultValue: 'Toggle password visibility',
                      })}
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#023927] to-[#0a4d3a] px-5 py-3 text-white font-semibold shadow-lg shadow-emerald-900/20 hover:from-[#04553d] hover:to-[#0f6248] transition-all"
                >
                  {t('statsProtection.button', { defaultValue: 'Access Analytics Page' })}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {t('statsProtection.footerNote', {
                  defaultValue: 'Access is restricted to authorized agency team members only.',
                })}
              </p>
              <p className="mt-1 text-xs text-gray-400">
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