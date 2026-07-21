import React, { useEffect, useState } from 'react';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CLIENTS_AUTH_KEY = 'clients_space_authenticated';

interface ClientsProtectedRouteProps {
  children: React.ReactNode;
}

const ClientsProtectedRoute: React.FC<ClientsProtectedRouteProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem(CLIENTS_AUTH_KEY);
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const validate = (candidate: string) => {
    if (!candidate) {
      return t('clientsProtection.emptyPasswordError', {
        defaultValue: 'Please enter password.',
      });
    }
    if (candidate.length < 12) {
      return t('clientsProtection.tooShortError', {
        min: 12,
        defaultValue: 'Password must be at least {{min}} characters.',
      });
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate(password);
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, section: 'clients' }),
      });

      const data = await res.json();

      if (res.ok && data.authenticated) {
        sessionStorage.setItem(CLIENTS_AUTH_KEY, 'true');
        setIsAuthenticated(true);
        setError('');
        setPassword('');
      } else if (res.status === 429) {
        setError(
          t('clientsProtection.lockedForError', {
            seconds: data.retryAfter || 60,
            defaultValue: 'Too many failed attempts. Locked for {{seconds}} seconds.',
          })
        );
        setPassword('');
      } else if (res.status === 401) {
        const remaining = data.remainingAttempts ?? 0;
        if (remaining <= 0) {
          setError(
            t('clientsProtection.lockedForError', {
              seconds: 60,
              defaultValue: 'Too many failed attempts. Locked for {{seconds}} seconds.',
            })
          );
        } else {
          setError(
            t('clientsProtection.invalidPasswordWithAttempts', {
              remainingAttempts: remaining,
              defaultValue: 'Invalid password. {{remainingAttempts}} attempt(s) remaining.',
            })
          );
        }
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

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-emerald-900 rounded-lg flex items-center justify-center">
              <LockClosedIcon className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-2">
            {t('clientsProtection.title', { defaultValue: 'Client Space — Restricted Access' })}
          </h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            {t('clientsProtection.subtitle', {
              defaultValue: 'Reserved for team members. Enter the internal access password.',
            })}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('clientsProtection.passwordLabel', { defaultValue: 'Password' })}
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder={t('clientsProtection.passwordPlaceholder', {
                    defaultValue: 'Enter password',
                  })}
                  autoComplete="off"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={t('clientsProtection.togglePasswordVisibility', {
                    defaultValue: 'Toggle password visibility',
                  })}
                >
                  {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-900 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '...' : t('clientsProtection.button', { defaultValue: 'Access Client Space' })}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              {t('clientsProtection.helperBody', {
                defaultValue: 'Contact an administrator to rotate the password if needed.',
              })}
            </p>
            <Link to="/" className="text-emerald-700 font-medium">
              {t('clientsProtection.backLabel', { defaultValue: 'Back to homepage' })}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsProtectedRoute;
