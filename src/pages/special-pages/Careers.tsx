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
  DocumentArrowUpIcon,
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

const Careers: React.FC = () => {
  const { t, i18n } = useTranslation();
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
    { key: 'essaouira', label: t('careers.regions.essaouira') },
    { key: 'provinceEssaouira', label: t('careers.regions.provinceEssaouira') },
  ];

  const experienceOptions = [
    t('careers.experienceLevels.beginner'),
    t('careers.experienceLevels.intermediate'),
    t('careers.experienceLevels.confirmed'),
    t('careers.experienceLevels.expert'),
    t('careers.experienceLevels.none')
  ];

  // Validation function
  const validateField = (name: string, value: string | File | null): string => {
    switch (name) {
      case 'firstName':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return t('validation.required');
        }
        if (typeof value === 'string' && (value.length < 2 || value.length > 50)) {
          return t('validation.nameLengthError');
        }
        if (typeof value === 'string' && !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          return t('validation.lettersOnly');
        }
        return '';

      case 'lastName':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return t('validation.required');
        }
        if (typeof value === 'string' && (value.length < 2 || value.length > 50)) {
          return t('validation.nameLengthError');
        }
        if (typeof value === 'string' && !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          return t('validation.lettersOnly');
        }
        return '';

      case 'email':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return t('validation.required');
        }
        if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return t('validation.emailInvalid');
        }
        if (typeof value === 'string' && value.length > 100) {
          return t('validation.emailTooLong');
        }
        return '';

      case 'experience':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return t('validation.required');
        }
        return '';

      case 'cv':
        if (!value) {
          return t('validation.required');
        }
        if (value instanceof File) {
          const maxSize = 15 * 1024 * 1024; // 15MB
          if (value.size > maxSize) {
            return t('validation.cvTooLarge');
          }
          const allowedTypes = ['.pdf', '.doc', '.docx'];
          const fileExtension = value.name.substring(value.name.lastIndexOf('.')).toLowerCase();
          if (!allowedTypes.includes(fileExtension)) {
            return t('validation.cvInvalidFormat');
          }
        }
        return '';

      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'experience', 'cv'];

    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateFrenchEmailContent = () => {
    const experienceLevelMap: Record<string, string> = {
      [t('careers.experienceLevels.beginner')]: 'Débutant (moins d\'1 an)',
      [t('careers.experienceLevels.intermediate')]: 'Intermédiaire (1-3 ans)',
      [t('careers.experienceLevels.confirmed')]: 'Confirmé (3-5 ans)',
      [t('careers.experienceLevels.expert')]: 'Expert (5+ ans)',
      [t('careers.experienceLevels.none')]: 'Aucune expérience'
    };

    const subject = `Nouvelle candidature - ${formData.firstName} ${formData.lastName}`;
    const experienceInFrench = experienceLevelMap[formData.experience] || formData.experience;

    const content = `
Bonjour,

Une nouvelle candidature a été reçue via le site web.

INFORMATIONS PERSONNELLES
Prénom : ${formData.firstName}
Nom : ${formData.lastName}
Email : ${formData.email}

EXPERIENCE PROFESSIONNELLE
Niveau d'expérience : ${experienceInFrench}

REGION SOUHAITEE
${formData.region || 'Non spécifiée'}

CV JOINT
Nom du fichier : ${formData.cv?.name || 'Non fourni'}

Cette candidature nécessite votre attention.

Cordialement,
Square Meter - Service de candidature
    `.trim();

    return { subject, content };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const touchedFields: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);

    // Validate form
    if (!validateForm()) {
      // Don't show alert for validation errors - errors are shown inline
      return;
    }

    setIsSubmitting(true);

    try {
      const { subject, content } = generateFrenchEmailContent();

      // Convert CV to base64 for email attachment
      let cvBase64 = '';
      if (formData.cv) {
        console.log('📄 Reading CV file:', formData.cv.name, 'Size:', formData.cv.size, 'bytes');
        const reader = new FileReader();
        cvBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1]; // Get base64 part only
            console.log('✅ CV converted to base64, length:', base64Data.length);
            resolve(base64Data);
          };
          reader.onerror = (error) => {
            console.error('❌ Error reading CV file:', error);
            reject(error);
          };
          reader.readAsDataURL(formData.cv!);
        });
      } else {
        console.warn('⚠️ No CV file selected!');
      }

      // Debug: Check what we're about to send
      const requestPayload = {
        subject,
        content,
        formData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          region: formData.region,
          experience: formData.experience,
          cvBase64,
          cvFilename: formData.cv?.name || '',
          cvMimetype: formData.cv?.type || 'application/pdf'
        },
        currentLanguage: i18n.language,
        emailType: 'careers'
      };

      console.log('📤 About to send request with payload:', {
        hasCvBase64: !!requestPayload.formData.cvBase64,
        cvBase64Length: requestPayload.formData.cvBase64?.length || 0,
        cvFilename: requestPayload.formData.cvFilename,
        payloadSize: JSON.stringify(requestPayload).length
      });

      const response = await fetch('/api/send-property-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      console.log('� Response received:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to send application: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('✅ API Success:', responseData);

      console.log('�📤 Sent careers application with CV:', {
        cvFilename: formData.cv?.name,
        cvBase64Length: cvBase64.length,
        hasCV: !!cvBase64
      });

      if (!response.ok) {
        throw new Error('Failed to send application');
      }

      // Success
      setAlertType('success');
      setAlertMessage(t('careers.form.successMessage'));
      setShowAlert(true);
      setIsSubmitting(false);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        region: '',
        experience: '',
        cv: null
      });
      setErrors({});
      setTouched({});
      
      // Reset file input
      if (formRef.current) {
        const fileInput = formRef.current.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }

      // Close alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting application:', error);
      setAlertType('error');
      setAlertMessage(t('validation.submissionError'));
      setShowAlert(true);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        cv: file
      }));
      
      // Validate file immediately
      setTouched(prev => ({ ...prev, cv: true }));
      const error = validateField('cv', file);
      setErrors(prev => ({ ...prev, cv: error }));
    }
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
                    onBlur={handleBlur}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 ${
                      touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-200'
                    } focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base`}
                    placeholder={t('careers.form.firstNamePlaceholder')}
                  />
                  {touched.firstName && errors.firstName && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                      <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{errors.firstName}</span>
                    </div>
                  )}
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
                    onBlur={handleBlur}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 ${
                      touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-200'
                    } focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base`}
                    placeholder={t('careers.form.lastNamePlaceholder')}
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
                    onBlur={handleBlur}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 ${
                      touched.email && errors.email ? 'border-red-500' : 'border-gray-200'
                    } focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base`}
                    placeholder={t('careers.form.emailPlaceholder')}
                  />
                  {touched.email && errors.email && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                      <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                    {t('careers.form.region')}
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                  >
                    <option value="">{t('careers.form.regionPlaceholder')}</option>
                    {regions.map(region => (
                      <option key={region.key} value={region.label}>{region.label}</option>
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
                  onBlur={handleBlur}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 ${
                    touched.experience && errors.experience ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base`}
                >
                  <option value="">{t('careers.form.experiencePlaceholder')}</option>
                  {experienceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {touched.experience && errors.experience && (
                  <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                    <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.experience}</span>
                  </div>
                )}
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
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label
                    htmlFor="cv-upload"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 ${
                      touched.cv && errors.cv ? 'border-red-500' : 'border-gray-200'
                    } focus-within:border-[#023927] focus-within:ring-2 focus-within:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base flex items-center cursor-pointer`}
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
                  {touched.cv && errors.cv && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fade-in">
                      <XMarkIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{errors.cv}</span>
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