// src/pages/Auth.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import zxcvbn from 'zxcvbn';

// --- Schemas ---
// Define schemas as functions that accept t for translations
const createLoginSchema = (t: any) => z.object({
  email: z.string().email(t('auth.validation.invalidEmail')),
  password: z.string().min(6, t('auth.validation.passwordTooShort')),
});

const createSignupSchema = (t: any) => z
  .object({
    firstName: z.string().min(1, t('auth.validation.firstNameRequired')),
    lastName: z.string().min(1, t('auth.validation.lastNameRequired')),
    email: z.string().email(t('auth.validation.invalidEmail')),
    userType: z.string().refine((val) => val === 'buyer' || val === 'owner', {
      message: t('auth.validation.selectAccountType'),
    }),
    password: z.string().min(8, t('auth.validation.passwordMinLength')),
    confirm: z.string().min(1, t('auth.validation.confirmPassword')),
    acceptTerms: z.boolean().refine((v) => v === true, { message: t('auth.validation.acceptTermsRequired') }),
  })
  .refine((data) => data.password === data.confirm, { path: ['confirm'], message: t('auth.validation.passwordsMismatch') });

type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;
type SignupValues = z.infer<ReturnType<typeof createSignupSchema>>;

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
              {isLogin ? t('auth.login.title') : t('auth.signup.title')}
            </h1>
            <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-4 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {isLogin ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Form Container */}
          <div className="bg-white border-2 border-gray-200 p-4 sm:p-6 lg:p-8">
            {/* Tab Switcher - Clean Green Design */}
            <div className="flex justify-center mb-8">
              <div className="flex border-2 border-gray-200">
                <button 
                  onClick={() => setIsLogin(true)} 
                  className={`px-8 py-3 font-inter uppercase text-sm tracking-wide transition-all duration-300 ${isLogin 
                    ? 'bg-[#023927] text-white border-2 border-[#023927] font-medium' 
                    : 'bg-white text-gray-700 hover:text-[#023927] hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  {t('auth.tabs.login')}
                </button>
                <button 
                  onClick={() => setIsLogin(false)} 
                  className={`px-8 py-3 font-inter uppercase text-sm tracking-wide transition-all duration-300 ${!isLogin 
                    ? 'bg-[#023927] text-white border-2 border-[#023927] font-medium' 
                    : 'bg-white text-gray-700 hover:text-[#023927] hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  {t('auth.tabs.signup')}
                </button>
              </div>
            </div>

            {/* Forms */}
            <div className="mb-8">
              {isLogin ? <LoginForm /> : <SignupForm />}
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-inter">{t('auth.social.divider')}</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 border-2 border-gray-200 py-3 hover:border-[#023927] hover:bg-gray-50 transition-all duration-300 bg-white group">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 1.86 6.48 1.86 12.07 1.86 16.5 5.06 20.24 9.26 21v-7.25H7.08v-2.68h2.18V9.69c0-2.16 1.29-3.35 3.25-3.35.94 0 1.94.17 1.94.17v2.13h-1.09c-1.08 0-1.42.67-1.42 1.36v1.62h2.42l-.39 2.68h-2.03V21c4.2-.76 7.4-4.5 7.4-8.93z" fill="#3b5998"/>
                </svg>
                <span className="font-inter font-medium text-gray-700 group-hover:text-[#023927] transition-colors duration-300">{t('auth.social.facebook')}</span>
              </button>
              <button className="flex items-center justify-center gap-3 border-2 border-gray-200 py-3 hover:border-[#023927] hover:bg-gray-50 transition-all duration-300 bg-white group">
                <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.8 0 6.5 1.6 8.5 3l6.2-6.2C35.5 3 30.1 1 24 1 14 1 5.4 6.6 1.9 14.8l7.6 5.9C11.2 14.1 17 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.9c-.6 3.2-2.5 5.9-5.3 7.7l8 6.2C43.9 39.3 46.1 32.4 46.1 24.5z"/>
                  <path fill="#4A90E2" d="M8.1 28.8c-.5-1.4-.8-2.9-.8-4.4 0-1.5.3-3 .8-4.4L.7 14.1C-.4 16.8-.4 20.2.7 23c1.1 2.9 3.3 5.5 7.4 7.8l0-.0z"/>
                  <path fill="#FBBC05" d="M24 46.9c6.1 0 11.5-2 15.9-5.5l-8-6.2c-2.2 1.5-5 2.3-7.9 2.3-7 0-12.7-4.6-14.8-11.1L1.9 33.2C5.4 41.4 14 46.9 24 46.9z"/>
                </svg>
                <span className="font-inter font-medium text-gray-700 group-hover:text-[#023927] transition-colors duration-300">{t('auth.social.google')}</span>
              </button>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-8 bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheckIcon className="w-6 h-6" />
              <h3 className="font-inter font-medium text-lg">{t('auth.security.title')}</h3>
            </div>
            <p className="font-inter text-white/90 text-sm leading-relaxed">
              {t('auth.security.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function LoginForm() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(createLoginSchema(t)),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginValues) => {
    // TODO: call API
    console.log('Login attempt:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
          {t('auth.login.emailLabel')}
        </label>
        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            {...register('email')} 
            type="email" 
            placeholder={t('auth.login.emailPlaceholder')}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
          />
        </div>
        {errors.email && <p className="font-inter text-red-500 text-xs mt-2">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
          {t('auth.login.passwordLabel')}
        </label>
        <div className="relative">
          <input 
            {...register('password')} 
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.login.passwordPlaceholder')}
            className="w-full px-4 pr-12 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(s => !s)} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="font-inter text-red-500 text-xs mt-2">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 border-2 border-gray-300 focus:ring-2 focus:ring-[#023927]" />
          <span className="font-inter text-gray-600 text-sm">{t('auth.login.rememberMe')}</span>
        </label>
        <Link to="/forgot-password" className="font-inter text-[#023927] hover:text-[#0a4d3a] transition-colors duration-300 text-sm font-medium">
          {t('auth.login.forgotPassword')}
        </Link>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-3 sm:py-4 font-inter font-medium hover:from-[#0a4d3a] hover:to-[#023927] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group text-sm sm:text-base"
      >
        <span className="flex items-center justify-center space-x-2">
          <LockClosedIcon className="w-5 h-5" />
          <span>{t('auth.login.submitButton')}</span>
        </span>
      </button>
    </form>
  );
}

function SignupForm() {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignupValues>({
    resolver: zodResolver(createSignupSchema(t)),
    defaultValues: { acceptTerms: false },
  });
  const [showPassword, setShowPassword] = useState(false);
  const password = watch('password') || '';

  const result = useMemo(() => zxcvbn(password || ''), [password]);
  const score = result?.score ?? 0;

  const strengthLabel = (score: number) => {
    const labels = [
      t('auth.passwordStrength.veryWeak'),
      t('auth.passwordStrength.weak'),
      t('auth.passwordStrength.medium'),
      t('auth.passwordStrength.strong'),
      t('auth.passwordStrength.veryStrong')
    ];
    return labels[score] || '';
  };

  const onSubmit = async (data: SignupValues) => {
    // TODO: call signup API
    console.log('Signup attempt:', data);
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-red-400';
      case 1: return 'bg-orange-400';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-blue-400';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthTextColor = (score: number) => {
    switch (score) {
      case 0: return 'text-red-600';
      case 1: return 'text-orange-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-blue-600';
      case 4: return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
            {t('auth.signup.firstNameLabel')}
          </label>
          <div className="relative">
            <UserIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              {...register('firstName')} 
              placeholder={t('auth.signup.firstNamePlaceholder')}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
            />
          </div>
          {errors.firstName && <p className="font-inter text-red-500 text-xs mt-2">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
            {t('auth.signup.lastNameLabel')}
          </label>
          <div className="relative">
            <UserIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              {...register('lastName')} 
              placeholder={t('auth.signup.lastNamePlaceholder')}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
            />
          </div>
          {errors.lastName && <p className="font-inter text-red-500 text-xs mt-2">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
          {t('auth.signup.emailLabel')}
        </label>
        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            {...register('email')} 
            type="email" 
            placeholder={t('auth.signup.emailPlaceholder')}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
          />
        </div>
        {errors.email && <p className="font-inter text-red-500 text-xs mt-2">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
          {t('auth.signup.accountTypeLabel')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="relative cursor-pointer">
            <input 
              {...register('userType')} 
              type="radio" 
              value="buyer"
              className="peer sr-only"
            />
            <div className="border-2 border-gray-200 p-4 text-center transition-all duration-300 hover:border-gray-300 peer-checked:border-[#023927] peer-checked:bg-[#023927]/5">
              <UserIcon className="w-6 h-6 mx-auto mb-2 text-gray-400 peer-checked:text-[#023927]" />
              <span className="font-inter text-gray-700 font-medium">{t('auth.signup.buyer')}</span>
            </div>
          </label>
          <label className="relative cursor-pointer">
            <input 
              {...register('userType')} 
              type="radio" 
              value="owner"
              className="peer sr-only"
            />
            <div className="border-2 border-gray-200 p-4 text-center transition-all duration-300 hover:border-gray-300 peer-checked:border-[#023927] peer-checked:bg-[#023927]/5">
              <ShieldCheckIcon className="w-6 h-6 mx-auto mb-2 text-gray-400 peer-checked:text-[#023927]" />
              <span className="font-inter text-gray-700 font-medium">{t('auth.signup.owner')}</span>
            </div>
          </label>
        </div>
        {errors.userType && <p className="font-inter text-red-500 text-xs mt-2">{errors.userType.message}</p>}
      </div>

      <div>
        <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
          {t('auth.signup.passwordLabel')}
        </label>
        <div className="relative">
          <input 
            {...register('password')} 
            type={showPassword ? 'text' : 'password'} 
            placeholder={t('auth.signup.passwordPlaceholder')}
            className="w-full px-4 pr-12 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(s => !s)} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="font-inter text-red-500 text-xs mt-2">{errors.password.message}</p>}

        {/* Password strength meter */}
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
          {t('auth.signup.confirmPasswordLabel')}
        </label>
        <input 
          {...register('confirm')} 
          type={showPassword ? 'text' : 'password'} 
          placeholder={t('auth.signup.confirmPasswordPlaceholder')}
          className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
        />
        {errors.confirm && <p className="font-inter text-red-500 text-xs mt-2">{errors.confirm.message}</p>}
      </div>

      <label className="flex items-start space-x-3 cursor-pointer">
        <input 
          {...register('acceptTerms')} 
          type="checkbox" 
          className="w-4 h-4 mt-1 border-2 border-gray-300 focus:ring-2 focus:ring-[#023927]" 
        />
        <span className="font-inter text-gray-600 text-sm flex-1">
          {t('auth.signup.acceptTerms')} <Link to="/terms" className="text-[#023927] hover:text-[#0a4d3a] font-medium transition-colors duration-300">{t('auth.signup.termsLink')}</Link> {t('auth.signup.and')} <Link to="/privacy" className="text-[#023927] hover:text-[#0a4d3a] font-medium transition-colors duration-300">{t('auth.signup.privacyLink')}</Link>
        </span>
      </label>
      {errors.acceptTerms && <p className="font-inter text-red-500 text-xs mt-2">{errors.acceptTerms.message}</p>}

      <button 
        type="submit" 
        disabled={isSubmitting || score < 2} 
        className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-3 sm:py-4 font-inter font-medium hover:from-[#0a4d3a] hover:to-[#023927] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group text-sm sm:text-base"
      >
        <span className="flex items-center justify-center space-x-2">
          <UserIcon className="w-5 h-5" />
          <span>{t('auth.signup.submitButton')}</span>
        </span>
      </button>
    </form>
  );
}

export default Auth;