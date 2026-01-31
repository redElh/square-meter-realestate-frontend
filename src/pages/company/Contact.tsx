// src/pages/Contact.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  CheckCircleIcon as CheckCircleIconSolid,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contactType = searchParams.get('type');
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
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

  // Map query params to subject values
  useEffect(() => {
    if (contactType) {
      const subjectMap: Record<string, string> = {
        'visit': 'visit',
        'info': 'info',
        'estimation': 'estimation',
        'appointment': 'buy',
        'confidential': 'confidential'
      };
      
      const mappedSubject = subjectMap[contactType] || contactType;
      setFormData(prev => ({ ...prev, subject: mappedSubject }));
    }
  }, [contactType]);

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: t('contact.contactMethods.email.title'),
      details: t('contact.contactMethods.email.details'),
      description: t('contact.contactMethods.email.description'),
      action: 'mailto:Essaouira@m2squaremeter.com'
    },
    {
      icon: PhoneIcon,
      title: t('contact.contactMethods.phone.title'),
      details: t('contact.contactMethods.phone.details'),
      description: t('contact.contactMethods.phone.description'),
      action: 'tel:+212700000644'
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

  // Validation functions
  const validateField = (name: string, value: any): string => {
    // First name validation
    if (name === 'firstName') {
      if (!value || value.trim() === '') return t('validation.required');
      if (value.trim().length < 2) return t('validation.minLength', { min: 2 });
      if (value.trim().length > 50) return t('validation.maxLength', { max: 50 });
      if (!/^[a-zA-Z\u00C0-\u017F\s'-]+$/.test(value)) return t('validation.lettersOnly');
    }

    // Last name validation
    if (name === 'lastName') {
      if (!value || value.trim() === '') return t('validation.required');
      if (value.trim().length < 2) return t('validation.minLength', { min: 2 });
      if (value.trim().length > 50) return t('validation.maxLength', { max: 50 });
      if (!/^[a-zA-Z\u00C0-\u017F\s'-]+$/.test(value)) return t('validation.lettersOnly');
    }

    // Email validation
    if (name === 'email') {
      if (!value || value.trim() === '') return t('validation.required');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return t('validation.email');
      if (value.length > 100) return t('validation.maxLength', { max: 100 });
    }

    // Phone validation (optional but if provided must be valid)
    if (name === 'phone' && value && value.trim() !== '') {
      // Use Google's libphonenumber-js for real-world phone number validation
      // This validates against actual country codes and phone number formats
      // Examples: +212 6 23 09 42 46 (Morocco), +33 1 23 45 67 89 (France), +1 555 123 4567 (USA)
      try {
        // Check if it's a valid phone number format
        if (!isValidPhoneNumber(value)) {
          return t('validation.phone');
        }
        
        // Parse the phone number to get detailed info
        const phoneNumber = parsePhoneNumber(value);
        
        // Ensure it has a valid country code
        if (!phoneNumber || !phoneNumber.country) {
          return t('validation.phone');
        }
        
        // Additional check: phone number must be possible (valid length for the country)
        if (!phoneNumber.isPossible()) {
          return t('validation.phone');
        }
      } catch (error) {
        // If parsing fails, the phone number is invalid
        return t('validation.phone');
      }
    }

    // Subject validation
    if (name === 'subject') {
      if (!value || value === '') return t('validation.required');
    }

    // Message validation
    if (name === 'message') {
      if (!value || value.trim() === '') return t('validation.required');
      if (value.trim().length < 10) return t('validation.minLength', { min: 10 });
      if (value.trim().length > 2000) return t('validation.maxLength', { max: 2000 });
    }

    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    const fields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });

    // Validate phone if provided
    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate email content in French
      const emailContent = generateFrenchEmailContent();
      
      const response = await fetch('/api/send-property-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailContent.subject,
          content: emailContent.content,
          formData: formData,
          currentLanguage: 'fr',
          type: 'contact'
        }),
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // API endpoint not available (development mode or not deployed)
        console.warn('API endpoint not available. Email data:', {
          subject: emailContent.subject,
          content: emailContent.content,
          formData: formData
        });
        
        // Simulate success in development
        setAlertType('success');
        setAlertMessage(t('contact.email.successMessage'));
        setShowAlert(true);
        setIsSubmitting(false);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
        return;
      }
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Show success alert
        setAlertType('success');
        setAlertMessage(t('contact.email.successMessage'));
        setShowAlert(true);
        setIsSubmitting(false);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setAlertType('error');
      setAlertMessage(t('contact.email.errorMessage'));
      setShowAlert(true);
      setIsSubmitting(false);
    }
  };

  const generateFrenchEmailContent = () => {
    // Generate email in French
    const subjectMap: Record<string, string> = {
      'visit': 'Demande de visite privée',
      'info': 'Demande d\'information',
      'buy': 'Demande d\'achat',
      'sell': 'Demande de vente',
      'rent': 'Demande de location',
      'management': 'Demande de gestion',
      'estimation': 'Demande d\'estimation',
      'confidential': 'Demande confidentielle',
      'partnership': 'Demande de partenariat',
      'other': 'Autre demande'
    };

    const propertyTypeMap: Record<string, string> = {
      'apartment': 'Appartement',
      'villa': 'Villa',
      'house': 'Maison',
      'land': 'Terrain',
      'commercial': 'Commercial',
      'other': 'Autre'
    };

    const budgetMap: Record<string, string> = {
      '1M': '1M€ - 2M€',
      '2M': '2M€ - 5M€',
      '5M': '5M€ - 10M€',
      '10M': '10M€+'
    };

    const timelineMap: Record<string, string> = {
      'urgent': 'Urgent (1-3 mois)',
      'medium': 'Moyen (3-6 mois)',
      'flexible': 'Flexible (6+ mois)'
    };

    const subject = `Nouveau message de contact - ${subjectMap[formData.subject] || formData.subject}`;
    
    const content = `
Bonjour,

Vous avez reçu un nouveau message de contact via le formulaire du site web Square Meter.

INFORMATIONS DU CONTACT

Nom complet : ${formData.firstName} ${formData.lastName}
Email : ${formData.email}
Téléphone : ${formData.phone || 'Non fourni'}
${formData.company ? `Société : ${formData.company}\n` : ''}

OBJET DE LA DEMANDE

Type de demande : ${subjectMap[formData.subject] || formData.subject}
${
  formData.propertyType || formData.budget || formData.timeline
    ? `\nDÉTAILS DU PROJET\n${
  formData.propertyType
    ? `\nType de bien : ${propertyTypeMap[formData.propertyType] || formData.propertyType}`
    : ''
}${
  formData.budget
    ? `\nBudget : ${budgetMap[formData.budget] || formData.budget}`
    : ''
}${
  formData.timeline
    ? `\nDélai souhaité : ${timelineMap[formData.timeline] || formData.timeline}`
    : ''
}\n`
    : ''
}

MESSAGE DU CLIENT

${formData.message}


---
Ce message a été envoyé automatiquement depuis le formulaire de contact du site Square Meter.
Merci de répondre directement à l'adresse email du client : ${formData.email}

Cordialement,
Square Meter - Système de notification automatique
    `.trim();
    
    return { subject, content };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
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
      {/* Alert Notification */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`px-8 py-6 border-2 shadow-2xl max-w-md w-full ${
            alertType === 'success' 
              ? 'bg-white border-green-600' 
              : 'bg-white border-red-600'
          }`}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex-shrink-0">
                {alertType === 'success' ? (
                  <CheckCircleIconSolid className="w-16 h-16 text-green-600" />
                ) : (
                  <XMarkIcon className="w-16 h-16 text-red-600" />
                )}
              </div>
              <div className={`font-light text-lg ${
                alertType === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>{alertMessage}</div>
              <button
                onClick={() => setShowAlert(false)}
                className={`px-8 py-3 font-medium uppercase tracking-wider text-sm transition-all duration-300 border-2 ${
                  alertType === 'success'
                    ? 'border-green-600 text-green-700 hover:bg-green-600 hover:text-white'
                    : 'border-red-600 text-red-700 hover:bg-red-600 hover:text-white'
                }`}
              >
                {t('contact.email.closeButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-8 sm:py-10 lg:py-12 lg:mt-14 md:mt-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
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
                      onBlur={handleBlur}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 focus:outline-none font-inter bg-white transition-all duration-300 text-sm sm:text-base ${
                        touched.firstName && errors.firstName
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-gray-200 focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 hover:border-gray-300'
                      }`}
                      placeholder={t('contact.form.firstNamePlaceholder')}
                    />
                    {touched.firstName && errors.firstName && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                        <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.firstName}</span>
                      </div>
                    )}
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
                      onBlur={handleBlur}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 focus:outline-none font-inter bg-white transition-all duration-300 text-sm sm:text-base ${
                        touched.lastName && errors.lastName
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-gray-200 focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 hover:border-gray-300'
                      }`}
                      placeholder={t('contact.form.lastNamePlaceholder')}
                    />
                    {touched.lastName && errors.lastName && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                        <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.lastName}</span>
                      </div>
                    )}
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
                      onBlur={handleBlur}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 focus:outline-none font-inter bg-white transition-all duration-300 text-sm sm:text-base ${
                        touched.email && errors.email
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-gray-200 focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 hover:border-gray-300'
                      }`}
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                    {touched.email && errors.email && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                        <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.email}</span>
                      </div>
                    )}
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
                      onBlur={handleBlur}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 focus:outline-none font-inter bg-white transition-all duration-300 text-sm sm:text-base ${
                        touched.phone && errors.phone
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-gray-200 focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 hover:border-gray-300'
                      }`}
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                    {touched.phone && errors.phone && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                        <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.phone}</span>
                      </div>
                    )}
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
                      onBlur={handleBlur}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 focus:outline-none font-inter bg-white transition-all duration-300 text-sm sm:text-base ${
                        touched.subject && errors.subject
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-gray-200 focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 hover:border-gray-300'
                      }`}
                    >
                      <option value="">{t('contact.form.subjectPlaceholder')}</option>
                      <option value="visit">{t('contact.subjects.visit')}</option>
                      <option value="info">{t('contact.subjects.info')}</option>
                      <option value="buy">{t('contact.subjects.buy')}</option>
                      <option value="sell">{t('contact.subjects.sell')}</option>
                      <option value="rent">{t('contact.subjects.rent')}</option>
                      <option value="management">{t('contact.subjects.management')}</option>
                      <option value="estimation">{t('contact.subjects.estimation')}</option>
                      <option value="confidential">{t('contact.subjects.confidential')}</option>
                      <option value="partnership">{t('contact.subjects.partnership')}</option>
                      <option value="other">{t('contact.subjects.other')}</option>
                    </select>
                    {touched.subject && errors.subject && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                        <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.subject}</span>
                      </div>
                    )}
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
                          <option value="other">{t('contact.propertyTypes.other')}</option>
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
                          <option value="1M">{t('contact.budgets.1M')}</option>
                          <option value="2M">{t('contact.budgets.2M')}</option>
                          <option value="5M">{t('contact.budgets.5M')}</option>
                          <option value="10M">{t('contact.budgets.10M')}</option>
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
                    onBlur={handleBlur}
                    rows={5}
                    placeholder={t('contact.form.messagePlaceholder')}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 focus:outline-none font-inter bg-white transition-all duration-300 resize-none text-sm sm:text-base ${
                      touched.message && errors.message
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 hover:border-gray-300'
                    }`}
                  ></textarea>
                  {touched.message && errors.message && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                      <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{errors.message}</span>
                    </div>
                  )}
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
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white flex items-center justify-center text-lg sm:text-2xl font-inter font-medium mb-3 sm:mb-4 mx-auto relative z-10">
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
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-x-1/2 z-0"></div>
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