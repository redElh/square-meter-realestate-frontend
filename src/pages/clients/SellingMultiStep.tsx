// src/pages/SellingMultiStep.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPinIcon,
  HomeModernIcon,
  ArrowsPointingOutIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ShieldCheckIcon,
  CurrencyEuroIcon,
  HomeIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon as CastleIcon,
  CubeIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

const SellingMultiStep: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(parseInt(searchParams.get('step') || '1'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [formData, setFormData] = useState({
    address: searchParams.get('address') || '',
    propertyType: '',
    surface: '',
    rooms: '',
    bedrooms: '',
    condition: '',
    features: [] as string[],
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timeline: '',
    motivation: '',
    priceExpectation: '',
    visitAvailability: ''
  });

  // Premium estimation hero slides - matching Properties style
  const heroSlidesData = t('sellingMultiStep.hero.slides', { returnObjects: true }) as Array<{title: string; subtitle: string}>;
  const heroSlides = heroSlidesData.map((slide, index) => ({
    image: [
      "https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      "https://images.pexels.com/photos/7031612/pexels-photo-7031612.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800"
    ][index],
    ...slide
  }));

  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isPlaying) {
      slideInterval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [isPlaying]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const steps = t('sellingMultiStep.steps', { returnObjects: true }) as Array<{number: number; title: string; description: string}>;

  const propertyTypes = t('sellingMultiStep.propertyTypes', { returnObjects: true }) as Array<{value: string; label: string}>;

  const conditions = t('sellingMultiStep.conditions', { returnObjects: true }) as Array<{value: string; label: string; description: string}>;

  const features = t('sellingMultiStep.features', { returnObjects: true }) as Array<{value: string; label: string}>;

  const timelines = t('sellingMultiStep.timelines', { returnObjects: true }) as Array<{value: string; label: string; description: string}>;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      navigate(`/selling-multistep?address=${encodeURIComponent(formData.address)}&step=${currentStep + 1}`, { replace: true });
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      navigate(`/selling-multistep?address=${encodeURIComponent(formData.address)}&step=${currentStep - 1}`, { replace: true });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSubmitting(false);
    navigate('/contact?type=estimation&submitted=true');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Address Section */}
            <div>
              <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-4">
                {t('sellingMultiStep.step1.addressLabel')}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder={t('sellingMultiStep.step1.addressPlaceholder')}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base lg:text-lg transition-colors duration-300"
                style={{ borderRadius: '0' }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Property Type */}
              <div>
                <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-4">
                  {t('sellingMultiStep.step1.typeLabel')}
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {propertyTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, propertyType: type.value }))}
                      className={`py-3 sm:py-4 border-2 transition-all duration-500 text-sm sm:text-base font-medium ${
                        formData.propertyType === type.value
                          ? 'border-[#023927] bg-white text-[#023927]'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900 hover:text-[#023927]'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Surface & Rooms */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                    {t('sellingMultiStep.step1.surfaceLabel')}
                  </label>
                  <input
                    type="number"
                    name="surface"
                    value={formData.surface}
                    onChange={handleChange}
                    required
                    placeholder={t('sellingMultiStep.step1.surfacePlaceholder')}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  <div>
                    <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                      {t('sellingMultiStep.step1.roomsLabel')}
                    </label>
                    <input
                      type="number"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleChange}
                      required
                      placeholder={t('sellingMultiStep.step1.roomsPlaceholder')}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base transition-colors duration-300"
                      style={{ borderRadius: '0' }}
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                      {t('sellingMultiStep.step1.bedroomsLabel')}
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      required
                      placeholder={t('sellingMultiStep.step1.bedroomsPlaceholder')}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base transition-colors duration-300"
                      style={{ borderRadius: '0' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-4">
                {t('sellingMultiStep.step1.conditionLabel')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {conditions.map(condition => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, condition: condition.value }))}
                    className={`p-4 sm:p-6 border-2 text-left transition-all duration-500 ${
                      formData.condition === condition.value
                        ? 'border-[#023927] bg-white text-[#023927]'
                        : 'border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                      {condition.label}
                    </div>
                    <div className="font-light text-gray-600 text-xs sm:text-sm">
                      {condition.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 mb-2 sm:mb-4 px-2">
                {t('sellingMultiStep.step2.title')}
              </h3>
              <p className="font-light text-gray-600 text-sm sm:text-base lg:text-lg px-4">
                {t('sellingMultiStep.step2.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              {features.map(feature => (
                <button
                  key={feature.value}
                  type="button"
                  onClick={() => handleFeatureToggle(feature.value)}
                  className={`py-4 sm:py-6 border-2 text-center transition-all duration-500 ${
                    formData.features.includes(feature.value)
                      ? 'border-[#023927] bg-white text-[#023927]'
                      : 'border-gray-300 hover:border-gray-900'
                  }`}
                >
                  <div className="font-medium text-xs sm:text-sm">
                    {feature.label}
                  </div>
                  {formData.features.includes(feature.value) && (
                    <div className="mt-1 sm:mt-2">
                      <CheckCircleIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-[#023927] mx-auto" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Selected Features Summary */}
            {formData.features.length > 0 && (
              <div className="p-4 sm:p-6 border-2 border-gray-100">
                <h4 className="font-medium text-gray-900 text-base sm:text-lg mb-3 sm:mb-4">
                  {t('sellingMultiStep.step2.selectedSummary', { count: formData.features.length })}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map(featureValue => {
                    const feature = features.find(f => f.value === featureValue);
                    return feature ? (
                      <span key={feature.value} className="bg-[#023927]/10 text-[#023927] px-3 py-2 font-light text-sm">
                        {feature.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Timeline */}
              <div>
                <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-4">
                  {t('sellingMultiStep.step3.timelineLabel')}
                </label>
                <div className="space-y-3 sm:space-y-4">
                  {timelines.map(timeline => (
                    <button
                      key={timeline.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, timeline: timeline.value }))}
                      className={`w-full p-4 sm:p-6 border-2 text-left transition-all duration-500 ${
                        formData.timeline === timeline.value
                          ? 'border-[#023927] bg-white text-[#023927]'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      <div className="font-medium text-gray-900 text-sm sm:text-base mb-1">
                        {timeline.label}
                      </div>
                      <div className="font-light text-gray-600 text-xs sm:text-sm">
                        {timeline.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Expectation */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                    {t('sellingMultiStep.step3.priceLabel')}
                  </label>
                  <input
                    type="text"
                    name="priceExpectation"
                    value={formData.priceExpectation}
                    onChange={handleChange}
                    placeholder={t('sellingMultiStep.step3.pricePlaceholder')}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                    {t('sellingMultiStep.step3.availabilityLabel')}
                  </label>
                  <input
                    type="text"
                    name="visitAvailability"
                    value={formData.visitAvailability}
                    onChange={handleChange}
                    placeholder={t('sellingMultiStep.step3.availabilityPlaceholder')}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-4">
                {t('sellingMultiStep.step3.motivationLabel')}
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows={4}
                placeholder={t('sellingMultiStep.step3.motivationPlaceholder')}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base resize-none transition-colors duration-300 leading-relaxed"
                style={{ borderRadius: '0' }}
              ></textarea>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Personal Information */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="font-medium text-gray-900 text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-6">
                  {t('sellingMultiStep.step4.personalInfoTitle')}
                </h3>
                
                <div>
                  <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                    {t('sellingMultiStep.step4.firstNameLabel')}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                    {t('sellingMultiStep.step4.lastNameLabel')}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="font-medium text-gray-900 text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-6">
                  {t('sellingMultiStep.step4.contactInfoTitle')}
                </h3>

                <div>
                  <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                    {t('sellingMultiStep.step4.emailLabel')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                    {t('sellingMultiStep.step4.phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-light text-sm sm:text-base transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="p-4 sm:p-6 lg:p-8 border-2 border-gray-100">
              <h4 className="font-medium text-gray-900 text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">
                {t('sellingMultiStep.step4.summaryTitle')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base lg:text-lg">
                <div>
                  <div className="font-medium text-gray-900 mb-2 sm:mb-4 text-sm sm:text-base">{t('sellingMultiStep.step4.propertySection')}</div>
                  <div className="font-light text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                    <div>{formData.address}</div>
                    <div>{propertyTypes.find(t => t.value === formData.propertyType)?.label}</div>
                    <div>{formData.surface} m² • {formData.rooms} {t('sellingMultiStep.step1.roomsLabel').replace(' *', '')} • {formData.bedrooms} {t('sellingMultiStep.step1.bedroomsLabel').replace(' *', '')}</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900 mb-4">{t('sellingMultiStep.step4.projectSection')}</div>
                  <div className="font-light text-gray-700 space-y-2">
                    <div>{timelines.find(t => t.value === formData.timeline)?.label}</div>
                    <div>{formData.priceExpectation && `${t('sellingMultiStep.step4.budgetPrefix')} ${formData.priceExpectation}`}</div>
                    <div>{t('sellingMultiStep.step4.amenitiesCount', { count: formData.features.length })}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Properties Style */}
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden bg-white">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              {/* Title Overlay - Bottom Left */}
              <div className="absolute bottom-8 sm:bottom-16 left-4 sm:left-12 text-white max-w-2xl px-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-2 sm:mb-4">{slide.title}</h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light opacity-90">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-30 flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={prevSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 transition-all duration-300 ${
                  index === activeSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                style={{ borderRadius: '0' }}
              />
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-16 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-30 max-w-md w-full px-4">
          <div className="flex justify-between text-xs sm:text-sm text-white mb-2">
            <span>{t('sellingMultiStep.progress.step')} {currentStep} {t('sellingMultiStep.progress.of')} {steps.length}</span>
            <span className="hidden sm:inline">{Math.round((currentStep / steps.length) * 100)}% {t('sellingMultiStep.progress.completed')}</span>
          </div>
          <div className="w-full bg-white/20">
            <div 
              className="bg-white h-1.5 sm:h-2 transition-all duration-1000 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      </section>

      {/* Main Form Content */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Steps Progress */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {steps.map((step, index) => {
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;
                
                return (
                  <div key={step.number} className="text-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 flex items-center justify-center border-2 transition-all duration-500 ${
                      isActive 
                        ? 'border-[#023927] bg-white text-[#023927]' 
                        : isCompleted
                        ? 'border-[#023927] bg-[#023927] text-white'
                        : 'border-gray-300 text-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircleIconSolid className="w-6 h-6 sm:w-8 sm:h-8" />
                      ) : (
                        <span className="text-lg sm:text-2xl font-light">{step.number}</span>
                      )}
                    </div>
                    
                    <div className={`font-medium text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 ${
                      isActive ? 'text-[#023927]' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </div>
                    <div className="font-light text-gray-500 text-xs sm:text-sm hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="border-2 border-gray-100 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              {/* Step Content */}
              <div className="mb-6 sm:mb-8 lg:mb-12">
                {renderStep()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200 gap-2 sm:gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`px-4 sm:px-8 py-3 sm:py-4 font-medium uppercase tracking-wider text-xs sm:text-sm transition-all duration-500 border-2 ${
                    currentStep === 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-900 text-gray-900 hover:border-[#023927] hover:text-[#023927]'
                  }`}
                >
                  <span className="flex items-center space-x-1 sm:space-x-3">
                    <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{t('sellingMultiStep.navigation.previous')}</span>
                  </span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-[#023927] text-white px-6 sm:px-12 py-3 sm:py-4 font-medium uppercase tracking-wider text-xs sm:text-sm hover:bg-white hover:text-[#023927] transition-all duration-500 border-2 border-[#023927]"
                >
                  <span className="flex items-center space-x-1 sm:space-x-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent animate-spin" />
                        <span className="hidden sm:inline">{t('sellingMultiStep.navigation.processing')}</span>
                      </>
                    ) : currentStep === steps.length ? (
                      <>
                        <span>{t('sellingMultiStep.navigation.submit')}</span>
                        <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    ) : (
                      <>
                        <span>{t('sellingMultiStep.navigation.continue')}</span>
                        <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellingMultiStep;