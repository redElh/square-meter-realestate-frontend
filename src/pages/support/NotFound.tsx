// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  MagnifyingGlassIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import {
  ShieldCheckIcon as ShieldCheckIconSolid,
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Contact Page */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated 404 - Now in white */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-9xl font-inter font-light text-white mb-6 tracking-tight"
            >
              {t('notFound.hero.number')}
            </motion.div>
            
            {/* Decorative line */}
            <div className="h-1 bg-white/30 w-48 mx-auto mb-8"></div>
            
            <h1 className="text-4xl lg:text-5xl font-inter font-light text-white mb-6 tracking-tight">
              {t('notFound.hero.title')}
            </h1>
            
            <div className="w-16 h-16 bg-white/20 flex items-center justify-center mx-auto mb-8 border border-white/30">
              <HomeIcon className="w-9 h-9 text-white" />
            </div>
            
            <p className="text-xl font-inter text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t('notFound.hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          
          {/* Left Column - Quick Actions */}
          <div className="space-y-8">
            {/* Action Cards */}
            <div className="border-2 border-gray-200 p-8 hover:border-[#023927] transition-all duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-[#023927] flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-inter font-medium text-gray-900 mb-2">
                    {t('notFound.actions.home.title')}
                  </h3>
                  <p className="font-inter text-gray-600">
                    {t('notFound.actions.home.description')}
                  </p>
                </div>
              </div>
              <Link
                to="/"
                className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-4 font-inter font-medium hover:from-[#0a4d3a] hover:to-[#023927] transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>{t('notFound.actions.home.button')}</span>
                <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Properties Directory */}
            <div className="border-2 border-gray-200 p-8 hover:border-[#023927] transition-all duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-[#023927] flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-inter font-medium text-gray-900 mb-2">
                    {t('notFound.actions.portfolio.title')}
                  </h3>
                  <p className="font-inter text-gray-600">
                    {t('notFound.actions.portfolio.description')}
                  </p>
                </div>
              </div>
              <Link
                to="/properties"
                className="w-full border-2 border-[#023927] text-[#023927] py-4 font-inter font-medium hover:bg-[#023927] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
                <span>{t('notFound.actions.portfolio.button')}</span>
              </Link>
            </div>

            {/* Contact Direct */}
            <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-8 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <ShieldCheckIconSolid className="w-6 h-6" />
                <h3 className="font-inter font-medium text-lg">{t('notFound.actions.assistance.title')}</h3>
              </div>
              <p className="font-inter text-white/90 mb-6 leading-relaxed">
                {t('notFound.actions.assistance.description')}
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+33123456789"
                  className="flex items-center space-x-3 p-3 border border-white/30 hover:bg-white/10 transition-colors duration-300"
                >
                  <PhoneIcon className="w-5 h-5" />
                  <span className="font-inter">+33 1 23 45 67 89</span>
                </a>
                <a
                  href="mailto:contact@squaremeter.com"
                  className="flex items-center space-x-3 p-3 border border-white/30 hover:bg-white/10 transition-colors duration-300"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  <span className="font-inter">contact@squaremeter.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Search & Assistance */}
          <div className="space-y-8">
            {/* Enhanced Search */}
            <div className="border-2 border-gray-200 p-8">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-[#023927] flex items-center justify-center">
                  <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-inter font-medium text-gray-900">
                  {t('notFound.search.title')}
                </h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder={t('notFound.search.locationPlaceholder')}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300"
                />
                
                <select className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300">
                  <option value="">{t('notFound.search.propertyType.label')}</option>
                  <option value="apartment">{t('notFound.search.propertyType.options.apartment')}</option>
                  <option value="villa">{t('notFound.search.propertyType.options.villa')}</option>
                  <option value="house">{t('notFound.search.propertyType.options.house')}</option>
                  <option value="land">{t('notFound.search.propertyType.options.land')}</option>
                  <option value="commercial">{t('notFound.search.propertyType.options.commercial')}</option>
                </select>
                
                <select className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300">
                  <option value="">{t('notFound.search.budget.label')}</option>
                  <option value="1M">{t('notFound.search.budget.options.upTo1M')}</option>
                  <option value="2M">{t('notFound.search.budget.options.range1to2M')}</option>
                  <option value="5M">{t('notFound.search.budget.options.range2to5M')}</option>
                  <option value="10M">{t('notFound.search.budget.options.range5to10M')}</option>
                  <option value="10M+">{t('notFound.search.budget.options.over10M')}</option>
                </select>
              </div>
              
              <Link
                to="/properties"
                className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-4 font-inter font-medium hover:from-[#0a4d3a] hover:to-[#023927] transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>{t('notFound.search.button')}</span>
                <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Trust Indicators - Matching Contact Page */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-gray-200 p-6 group hover:border-[#023927] transition-all duration-300">
                <div className="w-10 h-10 bg-[#023927] flex items-center justify-center mb-4">
                  <CheckCircleIconSolid className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-inter font-medium text-gray-900 mb-2 text-sm">
                  {t('notFound.trust.confidentiality.title')}
                </h4>
                <p className="font-inter text-gray-600 text-xs leading-relaxed">
                  {t('notFound.trust.confidentiality.description')}
                </p>
              </div>
              
              <div className="border-2 border-gray-200 p-6 group hover:border-[#023927] transition-all duration-300">
                <div className="w-10 h-10 bg-[#023927] flex items-center justify-center mb-4">
                  <ShieldCheckIconSolid className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-inter font-medium text-gray-900 mb-2 text-sm">
                  {t('notFound.trust.expertise.title')}
                </h4>
                <p className="font-inter text-gray-600 text-xs leading-relaxed">
                  {t('notFound.trust.expertise.description')}
                </p>
              </div>
            </div>

            {/* Contact Form Suggestion */}
            <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-8 text-white">
              <h3 className="text-xl font-inter font-light mb-4">
                {t('notFound.personalizedSearch.title')}
              </h3>
              <p className="font-inter text-white/90 mb-6 leading-relaxed">
                {t('notFound.personalizedSearch.description')}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center bg-white text-[#023927] px-6 py-3 font-inter font-medium hover:bg-gray-100 transition-colors duration-300 group"
              >
                <span>{t('notFound.personalizedSearch.button')}</span>
                <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Process Steps - Matching Contact Page */}
        <div className="mt-16 lg:mt-24 pt-12 border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-inter font-light text-gray-900 mb-4">
              {t('notFound.process.title')}
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              {t('notFound.process.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: t('notFound.process.steps.step1.number'), title: t('notFound.process.steps.step1.title'), description: t('notFound.process.steps.step1.description') },
              { number: t('notFound.process.steps.step2.number'), title: t('notFound.process.steps.step2.title'), description: t('notFound.process.steps.step2.description') },
              { number: t('notFound.process.steps.step3.number'), title: t('notFound.process.steps.step3.title'), description: t('notFound.process.steps.step3.description') },
              { number: t('notFound.process.steps.step4.number'), title: t('notFound.process.steps.step4.title'), description: t('notFound.process.steps.step4.description') }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white flex items-center justify-center text-2xl font-inter font-medium mb-4 mx-auto">
                  {step.number}
                </div>
                <h4 className="font-inter font-medium text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="font-inter text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;