// src/pages/Auth.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import zxcvbn from 'zxcvbn';

// --- Schemas ---
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirm: z.string().min(1, 'Confirmez le mot de passe'),
    acceptTerms: z.boolean().refine((v) => v === true, { message: 'Vous devez accepter les CGU' }),
  })
  .refine((data) => data.password === data.confirm, { path: ['confirm'], message: 'Les mots de passe ne correspondent pas' });

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

const strengthLabel = (score: number) => ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'][score] || '';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-inter uppercase text-gray-900 mb-4 tracking-wide">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h1>
            <div className="w-24 h-1 bg-gray-300 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {isLogin 
                ? 'Bienvenue de retour. Accédez à votre espace personnel et gérez vos propriétés.' 
                : 'Rejoignez notre communauté exclusive et accédez à des propriétés d\'exception.'}
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 md:p-12 max-w-3xl mx-auto"
          >
            {/* Tab Switcher */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setIsLogin(true)} 
                  className={`px-8 py-3 rounded-lg font-inter uppercase text-sm tracking-wide transition-all duration-300 ${
                    isLogin 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Connexion
                </button>
                <button 
                  onClick={() => setIsLogin(false)} 
                  className={`px-8 py-3 rounded-lg font-inter uppercase text-sm tracking-wide transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Inscription
                </button>
              </div>
            </div>

            {/* Forms */}
            <div className="mb-8">
              {isLogin ? <LoginForm /> : <SignupForm />}
            </div>

            {/* Social Login */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">Ou continuer avec</p>
              <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 hover:border-gray-300 hover:shadow-md transition-all duration-300 bg-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 1.86 6.48 1.86 12.07 1.86 16.5 5.06 20.24 9.26 21v-7.25H7.08v-2.68h2.18V9.69c0-2.16 1.29-3.35 3.25-3.35.94 0 1.94.17 1.94.17v2.13h-1.09c-1.08 0-1.42.67-1.42 1.36v1.62h2.42l-.39 2.68h-2.03V21c4.2-.76 7.4-4.5 7.4-8.93z" fill="#3b5998"/>
                  </svg>
                  <span className="font-medium text-gray-700">Facebook</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 hover:border-gray-300 hover:shadow-md transition-all duration-300 bg-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.8 0 6.5 1.6 8.5 3l6.2-6.2C35.5 3 30.1 1 24 1 14 1 5.4 6.6 1.9 14.8l7.6 5.9C11.2 14.1 17 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.9c-.6 3.2-2.5 5.9-5.3 7.7l8 6.2C43.9 39.3 46.1 32.4 46.1 24.5z"/>
                    <path fill="#4A90E2" d="M8.1 28.8c-.5-1.4-.8-2.9-.8-4.4 0-1.5.3-3 .8-4.4L.7 14.1C-.4 16.8-.4 20.2.7 23c1.1 2.9 3.3 5.5 7.4 7.8l0-.0z"/>
                    <path fill="#FBBC05" d="M24 46.9c6.1 0 11.5-2 15.9-5.5l-8-6.2c-2.2 1.5-5 2.3-7.9 2.3-7 0-12.7-4.6-14.8-11.1L1.9 33.2C5.4 41.4 14 46.9 24 46.9z"/>
                  </svg>
                  <span className="font-medium text-gray-700">Google</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginValues) => {
    // TODO: call API
    window.alert(`Connexion mock: ${data.email}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            {...register('email')} 
            type="email" 
            placeholder="votre@email.com"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
          />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
        <div className="relative">
          <input 
            {...register('password')} 
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full px-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(s => !s)} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-2 focus:ring-gray-900" />
          <span className="text-sm text-gray-600">Se souvenir de moi</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-gray-900 hover:text-gray-600 transition-colors duration-200 font-medium">
          Mot de passe oublié ?
        </Link>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full py-4 rounded-xl bg-gray-900 text-white font-inter uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Se connecter
      </button>
    </form>
  );
}

function SignupForm() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { acceptTerms: false },
  });
  const [showPassword, setShowPassword] = useState(false);
  const password = watch('password') || '';

  const result = useMemo(() => zxcvbn(password || ''), [password]);
  const score = result?.score ?? 0;

  const onSubmit = async (data: SignupValues) => {
    // TODO: call signup API
    window.alert(`Inscription mock: ${data.email}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
          <input 
            {...register('firstName')} 
            placeholder="Jean"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
          />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
          <input 
            {...register('lastName')} 
            placeholder="Dupont"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
          />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            {...register('email')} 
            type="email" 
            placeholder="votre@email.com"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
          />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
        <div className="relative">
          <input 
            {...register('password')} 
            type={showPassword ? 'text' : 'password'} 
            placeholder="••••••••"
            className="w-full px-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(s => !s)} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}

        {/* Password strength meter */}
        {password && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Force du mot de passe</span>
              <span className={`font-medium ${score >= 4 ? 'text-green-600' : score >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                {strengthLabel(score)}
              </span>
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-2 transition-all duration-300 ${score >= 4 ? 'bg-green-500' : score >= 2 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                style={{ width: `${(score / 4) * 100}%` }} 
              />
            </div>
            {result?.feedback?.warning && <p className="text-xs text-yellow-600 mt-2">{result.feedback.warning}</p>}
            {result?.feedback?.suggestions?.length > 0 && <p className="text-xs text-gray-500 mt-1">{result.feedback.suggestions[0]}</p>}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
        <input 
          {...register('confirm')} 
          type={showPassword ? 'text' : 'password'} 
          placeholder="••••••••"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
        />
        {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
      </div>

      <label className="flex items-start space-x-3 cursor-pointer">
        <input 
          {...register('acceptTerms')} 
          type="checkbox" 
          className="w-4 h-4 mt-1 border-2 border-gray-300 rounded focus:ring-2 focus:ring-gray-900" 
        />
        <span className="text-sm text-gray-600">
          J'accepte les <Link to="/terms" className="text-gray-900 hover:text-gray-600 font-medium transition-colors duration-200">conditions générales</Link> et la <Link to="/privacy" className="text-gray-900 hover:text-gray-600 font-medium transition-colors duration-200">politique de confidentialité</Link>
        </span>
      </label>
      {errors.acceptTerms && <p className="text-xs text-red-500 mt-1">{errors.acceptTerms.message}</p>}

      <button 
        type="submit" 
        disabled={isSubmitting || score < 2} 
        className="w-full py-4 rounded-xl bg-gray-900 text-white font-inter uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Créer un compte
      </button>
    </form>
  );
}

export default Auth;