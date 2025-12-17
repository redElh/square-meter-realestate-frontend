// src/pages/Careers.tsx
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserGroupIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  LightBulbIcon,
  BriefcaseIcon,
  HeartIcon,
  MapPinIcon,
  DocumentArrowUpIcon,
  PaperAirplaneIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

const Careers: React.FC = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    region: '',
    experience: '',
    cv: null as File | null
  });

  const careerPoints = [
    {
      icon: UserGroupIcon,
      title: t('careers.points.teamSpirit.title'),
      description: t('careers.points.teamSpirit.description')
    },
    {
      icon: RocketLaunchIcon,
      title: t('careers.points.realProspects.title'),
      description: t('careers.points.realProspects.description')
    },
    {
      icon: AcademicCapIcon,
      title: t('careers.points.recognizedExpertise.title'),
      description: t('careers.points.recognizedExpertise.description')
    },
    {
      icon: LightBulbIcon,
      title: t('careers.points.innovativeSpirit.title'),
      description: t('careers.points.innovativeSpirit.description')
    },
    {
      icon: BriefcaseIcon,
      title: t('careers.points.variedMissions.title'),
      description: t('careers.points.variedMissions.description')
    },
    {
      icon: HeartIcon,
      title: t('careers.points.humanJob.title'),
      description: t('careers.points.humanJob.description')
    }
  ];

  const regions = [
    t('careers.regions.paris'),
    t('careers.regions.coteDazur'),
    t('careers.regions.paca'),
    t('careers.regions.auvergneRhone'),
    t('careers.regions.occitanie'),
    t('careers.regions.nouvelleAquitaine'),
    t('careers.regions.bretagne'),
    t('careers.regions.international')
  ];

  const experienceOptions = [
    t('careers.experienceLevels.beginner'),
    t('careers.experienceLevels.intermediate'),
    t('careers.experienceLevels.confirmed'),
    t('careers.experienceLevels.expert'),
    t('careers.experienceLevels.none')
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        region: '',
        experience: '',
        cv: null
      });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        cv: e.target.files![0]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Success Message */}
      {isSubmitted && (
        <div className="fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in px-4 w-full max-w-md">
          <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white px-4 sm:px-8 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 border-2 border-white shadow-2xl">
            <CheckCircleIconSolid className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-inter font-medium text-sm sm:text-lg">{t('careers.form.successMessage')}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
              {t('careers.hero.title')}
            </h1>
            <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-lg sm:text-xl lg:text-2xl font-inter font-light text-white mb-3 sm:mb-4 px-4">
              {t('careers.hero.subtitle')}
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {t('careers.hero.description')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Career Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {careerPoints.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <div 
                key={index}
                className="bg-white border-2 border-gray-200 p-4 sm:p-6 lg:p-8 group hover:border-[#023927] transition-all duration-300"
              >
                <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#023927] flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-inter font-light text-[#023927] mb-1 sm:mb-2">
                      {index + 1}.
                    </div>
                    <h3 className="font-inter font-medium text-gray-900 text-base sm:text-lg mb-1 sm:mb-2">
                      {point.title}
                    </h3>
                  </div>
                </div>
                <p className="font-inter text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Join Us Section */}
        <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-6 sm:p-8 lg:p-12 text-white mb-8 sm:mb-12 lg:mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-inter font-light text-white mb-4 sm:mb-6 px-4">
              {t('careers.joinUs.title')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 mb-6 sm:mb-8 leading-relaxed px-4">
              {t('careers.joinUs.description')}
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-inter font-light text-gray-900">
                {t('careers.form.title')}
              </h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                    {t('careers.form.firstName')} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    placeholder={t('careers.form.firstNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                    {t('careers.form.lastName')} *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    placeholder={t('careers.form.lastNamePlaceholder')}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                    {t('careers.form.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    placeholder={t('careers.form.emailPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                    {t('careers.form.region')}
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                  >
                    <option value="">{t('careers.form.regionPlaceholder')}</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                  {t('careers.form.experience')} *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                >
                  <option value="">{t('careers.form.experiencePlaceholder')}</option>
                  {experienceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* CV Upload */}
              <div>
                <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                  {t('careers.form.cvUpload')} * {t('careers.form.cvMaxSize')}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="cv"
                    id="cv-upload"
                    onChange={handleFileChange}
                    required
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus-within:border-[#023927] focus-within:ring-2 focus-within:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base flex items-center cursor-pointer"
                  >
                    <span className="inline-block mr-2 sm:mr-4 py-1.5 sm:py-2 px-2 sm:px-4 bg-[#023927] text-white font-inter text-xs sm:text-sm cursor-pointer">
                      {t('careers.form.chooseFile')}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {formData.cv ? formData.cv.name : t('careers.form.noFileChosen')}
                    </span>
                  </label>
                  {formData.cv && (
                    <div className="flex items-center space-x-2 mt-2 text-xs sm:text-sm text-gray-600">
                      <DocumentArrowUpIcon className="w-4 h-4" />
                      <span>{formData.cv.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-3 sm:py-4 font-inter font-medium hover:from-[#0a4d3a] hover:to-[#023927] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group text-sm sm:text-base"
              >
                <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-current"></div>
                      <span>{t('careers.form.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('careers.form.submitButton')}</span>
                      <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Stats section removed per request */}
        </div>
      </div>
    </div>
  );
};

export default Careers;