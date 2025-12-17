// src/pages/Contact.tsx
import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const contactType = searchParams.get('type');
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: contactType || '',
    message: '',
    propertyType: '',
    budget: '',
    timeline: '',
    company: '',
    preferredContact: 'email'
  });

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: t('contact.contactMethods.email.title'),
      details: t('contact.contactMethods.email.details'),
      description: t('contact.contactMethods.email.description'),
      action: 'mailto:contact@squaremeter.com'
    },
    {
      icon: PhoneIcon,
      title: t('contact.contactMethods.phone.title'),
      details: t('contact.contactMethods.phone.details'),
      description: t('contact.contactMethods.phone.description'),
      action: 'tel:+33123456789'
    },
    {
      icon: MapPinIcon,
      title: t('contact.contactMethods.office.title'),
      details: t('contact.contactMethods.office.details'),
      description: t('contact.contactMethods.office.description'),
      action: '#'
    }
  ];

  const quickActions = [
    {
      icon: DocumentTextIcon,
      title: t('contact.quickActions.estimation.title'),
      description: t('contact.quickActions.estimation.description'),
      type: 'estimation'
    },
    {
      icon: CalendarIcon,
      title: t('contact.quickActions.appointment.title'),
      description: t('contact.quickActions.appointment.description'),
      type: 'appointment'
    },
    {
      icon: ShieldCheckIcon,
      title: t('contact.quickActions.confidential.title'),
      description: t('contact.quickActions.confidential.description'),
      type: 'confidential'
    }
  ];

  // Normalize translations that can be objects or arrays
  const _trustRaw = t('contact.trustIndicators', { returnObjects: true }) as any;
  const trustArray = Array.isArray(_trustRaw) ? _trustRaw : Object.values(_trustRaw || {});

  const _processObj = t('contact.process', { returnObjects: true }) as any;
  const processSteps = ['analysis', 'advice', 'research', 'followUp']
    .map((k) => _processObj && _processObj[k])
    .filter(Boolean);

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
        phone: '',
        subject: '',
        message: '',
        propertyType: '',
        budget: '',
        timeline: '',
        company: '',
        preferredContact: 'email'
      });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleQuickAction = (type: string) => {
    setFormData(prev => ({
      ...prev,
      subject: type
    }));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Success Message - Green theme */}
      {isSubmitted && (
        <div className="fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in px-4 max-w-full">
          <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white px-4 sm:px-8 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 border-2 border-white shadow-2xl">
            <CheckCircleIconSolid className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="font-inter font-medium text-sm sm:text-base lg:text-lg">{t('contact.successMessage')}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
              {t('contact.hero.title')}
            </h1>
            <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-4 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Column - Contact Information */}
          <div className="lg:col-span-1">
            {/* Contact Methods Card */}
            <div className="bg-white border-2 border-gray-200 p-5 sm:p-6 lg:p-8 mb-6">
              <h2 className="text-xl sm:text-2xl font-inter font-light text-gray-900 mb-5 sm:mb-6 lg:mb-8 pb-3 border-b border-gray-200">
                {t('contact.contactMethods.title')}
              </h2>
              
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.action}
                      className="group flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border-2 border-gray-100 hover:border-[#023927] transition-all duration-300"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#023927] flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-inter font-medium text-gray-900 text-sm sm:text-base mb-1 group-hover:text-[#023927] transition-colors duration-300">
                          {method.title}
                        </h3>
                        <p className="font-inter text-gray-700 text-xs sm:text-sm break-words">{method.details}</p>
                        <p className="font-inter text-gray-500 text-xs">{method.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 sm:mt-8 lg:mt-12 pt-6 border-t border-gray-200">
                <h3 className="font-inter font-medium text-gray-900 mb-4 text-sm sm:text-base">
                  {t('contact.quickActions.title')}
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.type)}
                        className="w-full text-left p-3 sm:p-4 border-2 border-gray-200 hover:border-[#023927] hover:bg-gray-50 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 flex items-center justify-center group-hover:bg-[#023927] transition-colors duration-300 flex-shrink-0">
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-inter font-medium text-gray-900 text-xs sm:text-sm mb-1 group-hover:text-[#023927] transition-colors duration-300">
                              {action.title}
                            </div>
                            <div className="font-inter text-gray-500 text-xs">
                              {action.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-4 sm:p-6 lg:p-8 text-white">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <h3 className="font-inter font-medium text-base sm:text-lg">{t('contact.confidentialityBox.title')}</h3>
              </div>
              <p className="font-inter text-white/90 text-xs sm:text-sm leading-relaxed">
                {t('contact.confidentialityBox.description')}
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            {/* Enhanced Contact Form */}
            <div className="bg-white border-2 border-gray-200 p-5 sm:p-6 lg:p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-3">
                <h2 className="text-xl sm:text-2xl font-inter font-light text-gray-900">
                  {t('contact.form.title')}
                </h2>
                <div className="flex items-center space-x-2 text-[#023927]">
                  <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-inter text-xs sm:text-sm font-medium">{t('contact.form.confidentialBadge')}</span>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 font-medium">
                      {t('contact.form.firstName')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder={t('contact.form.firstNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 font-medium">
                      {t('contact.form.lastName')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder={t('contact.form.lastNamePlaceholder')}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 font-medium">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 font-medium">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                  </div>
                </div>

                {/* Company & Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 font-medium">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder={t('contact.form.companyPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 font-medium">
                      {t('contact.form.subject')}
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    >
                      <option value="">{t('contact.form.subjectPlaceholder')}</option>
                      <option value="buy">{t('contact.subjects.buy')}</option>
                      <option value="sell">{t('contact.subjects.sell')}</option>
                      <option value="rent">{t('contact.subjects.rent')}</option>
                      <option value="management">{t('contact.subjects.management')}</option>
                      <option value="estimation">{t('contact.subjects.estimation')}</option>
                      <option value="confidential">{t('contact.subjects.confidential')}</option>
                      <option value="partnership">{t('contact.subjects.partnership')}</option>
                      <option value="other">{t('contact.subjects.other')}</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 font-medium">
                    {t('contact.form.preferredContact')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'email', label: 'Email', icon: EnvelopeIcon },
                      { value: 'phone', label: t('contact.form.preferredContactPhone'), icon: PhoneIcon }
                    ].map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <label key={method.value} className="relative">
                          <input
                            type="radio"
                            name="preferredContact"
                            value={method.value}
                            checked={formData.preferredContact === method.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`p-3 sm:p-4 border-2 cursor-pointer transition-all duration-300 ${
                            formData.preferredContact === method.value
                              ? 'border-[#023927] bg-[#023927]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors duration-300 ${
                                formData.preferredContact === method.value
                                  ? 'bg-[#023927] text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <span className="font-inter text-gray-700 font-medium text-xs sm:text-sm">{method.label}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Fields */}
                {(formData.subject === 'buy' || formData.subject === 'sell') && (
                  <div className="p-4 sm:p-5 bg-gray-50 border-2 border-gray-200">
                    <h3 className="font-inter font-medium text-gray-900 mb-3 text-sm sm:text-base">{t('contact.projectDetails.title')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2">
                          {t('contact.projectDetails.propertyType')}
                        </label>
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          className="w-full px-2.5 sm:px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white text-xs sm:text-sm"
                        >
                          <option value="">{t('contact.projectDetails.propertyType')}</option>
                          <option value="apartment">{t('contact.propertyTypes.apartment')}</option>
                          <option value="villa">{t('contact.propertyTypes.villa')}</option>
                          <option value="house">{t('contact.propertyTypes.house')}</option>
                          <option value="land">{t('contact.propertyTypes.land')}</option>
                          <option value="commercial">{t('contact.propertyTypes.commercial')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2">
                          {t('contact.projectDetails.budget')}
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-2.5 sm:px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white text-xs sm:text-sm"
                        >
                          <option value="">{t('contact.projectDetails.budget')}</option>
                          <option value="1M">{t('contact.budgets.range1')}</option>
                          <option value="2M">{t('contact.budgets.range2')}</option>
                          <option value="5M">{t('contact.budgets.range3')}</option>
                          <option value="10M">{t('contact.budgets.range4')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2">
                          {t('contact.projectDetails.timeline')}
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full px-2.5 sm:px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white text-xs sm:text-sm"
                        >
                          <option value="">{t('contact.projectDetails.timeline')}</option>
                          <option value="urgent">{t('contact.timelines.urgent')}</option>
                          <option value="medium">{t('contact.timelines.medium')}</option>
                          <option value="flexible">{t('contact.timelines.flexible')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 font-medium">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder={t('contact.form.messagePlaceholder')}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 resize-none text-sm sm:text-base"
                  ></textarea>
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
                        <span>{t('contact.form.submitting')}</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        <span>{t('contact.form.submit')}</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {trustArray.map((item: any, index: number) => {
                const icons = [ShieldCheckIcon, ClockIcon, UserIcon];
                const IconComponent = icons[index];
                return (
                  <div key={index} className="text-center p-4 sm:p-6 bg-white border-2 border-gray-200 group hover:border-[#023927] transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#023927] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h4 className="font-inter font-medium text-gray-900 text-xs sm:text-sm mb-2">
                      {item.title}
                    </h4>
                    <p className="font-inter text-gray-600 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-3 sm:mb-4">
              {t('contact.process.title')}
            </h2>
            <p className="text-gray-600 font-inter text-sm sm:text-base px-4">
              {t('contact.process.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {processSteps.map((process: any, index: number) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white flex items-center justify-center text-lg sm:text-2xl font-inter font-medium mb-3 sm:mb-4 mx-auto">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h4 className="font-inter font-medium text-gray-900 mb-2 text-sm sm:text-base">
                    {process.title}
                  </h4>
                  <p className="font-inter text-gray-600 text-xs sm:text-sm">
                    {process.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;