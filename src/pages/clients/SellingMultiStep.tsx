// src/pages/SellingMultiStep.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  BuildingOffice2Icon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  MapPinIcon as MapPinIconSolid,
  HomeModernIcon as HomeModernIconSolid
} from '@heroicons/react/24/solid';

const SellingMultiStep: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(parseInt(searchParams.get('step') || '1'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

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

  const [completion, setCompletion] = useState({
    step1: 0,
    step2: 0,
    step3: 0,
    step4: 0
  });

  // Premium estimation hero slides
  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Estimation d'Exception",
      subtitle: "Découvrez la valeur réelle de votre patrimoine",
      description: "Notre expertise exclusive dans le marché du luxe garantit la meilleure valorisation"
    },
    {
      image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Expertise Sur Mesure",
      subtitle: "Analyse approfondie de votre bien immobilier",
      description: "Évaluation précise basée sur les dernières tendances du marché premium"
    },
    {
      image: "https://images.pexels.com/photos/7031612/pexels-photo-7031612.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Confidentialité Absolue",
      subtitle: "Votre projet traité avec la plus grande discrétion",
      description: "Processus sécurisé et respectueux de votre vie privée"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    let slideInterval: NodeJS.Timeout;
    if (isPlaying) {
      slideInterval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }

    return () => clearInterval(slideInterval);
  }, [isPlaying, heroSlides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const steps = [
    { 
      number: 1, 
      title: 'Votre Bien', 
      description: 'Caractéristiques principales',
      icon: HomeModernIcon
    },
    { 
      number: 2, 
      title: 'Équipements', 
      description: 'Commodités et prestations',
      icon: SparklesIcon
    },
    { 
      number: 3, 
      title: 'Votre Projet', 
      description: 'Motivations et délais',
      icon: CalendarIcon
    },
    { 
      number: 4, 
      title: 'Contact', 
      description: 'Informations personnelles',
      icon: UserIcon
    }
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Appartement', icon: BuildingOfficeIcon },
    { value: 'house', label: 'Maison', icon: HomeIcon },
    { value: 'villa', label: 'Villa', icon: BuildingLibraryIcon },
    { value: 'loft', label: 'Loft', icon: CubeIcon },
    { value: 'penthouse', label: 'Penthouse', icon: BuildingOffice2Icon },
    { value: 'castle', label: 'Château', icon: CastleIcon },
    { value: 'other', label: 'Autre', icon: BuildingStorefrontIcon }
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent état', description: 'Rénovation récente, état neuf' },
    { value: 'very-good', label: 'Très bon état', description: 'Bien entretenu, prêt à vivre' },
    { value: 'good', label: 'Bon état', description: 'Quelques travaux de rafraîchissement' },
    { value: 'renovation', label: 'À rénover', description: 'Projet de rénovation nécessaire' }
  ];

  const features = [
    { value: 'terrace', label: 'Terrasse', icon: ArrowsPointingOutIcon },
    { value: 'balcony', label: 'Balcon', icon: BuildingOfficeIcon },
    { value: 'garden', label: 'Jardin', icon: SparklesIcon },
    { value: 'pool', label: 'Piscine', icon: CurrencyEuroIcon },
    { value: 'parking', label: 'Parking', icon: MapPinIcon },
    { value: 'elevator', label: 'Ascenseur', icon: ChevronRightIcon },
    { value: 'fireplace', label: 'Cheminée', icon: HomeIcon },
    { value: 'ac', label: 'Climatisation', icon: SparklesIcon },
    { value: 'alarm', label: 'Alarme', icon: ShieldCheckIcon },
    { value: 'smart-home', label: 'Domotique', icon: HomeModernIcon },
    { value: 'wine-cellar', label: 'Cave à vin', icon: CubeIcon },
    { value: 'gym', label: 'Salle de sport', icon: UserIcon }
  ];

  const timelines = [
    { value: 'urgent', label: 'Urgent (1-3 mois)', description: 'Vente rapide souhaitée' },
    { value: 'medium', label: 'Moyen (3-6 mois)', description: 'Délai standard' },
    { value: 'flexible', label: 'Flexible (6+ mois)', description: 'Pas de contrainte de temps' },
    { value: 'undefined', label: 'À définir', description: 'En fonction du marché' }
  ];

  // Calculate completion percentage for each step
  useEffect(() => {
    const newCompletion = { ...completion };
    
    // Step 1 completion
    const step1Fields = [formData.address, formData.propertyType, formData.surface, formData.rooms, formData.bedrooms, formData.condition];
    newCompletion.step1 = Math.round((step1Fields.filter(field => field).length / step1Fields.length) * 100);

    // Step 2 completion
    newCompletion.step2 = Math.min(formData.features.length * 10, 100);

    // Step 3 completion
    const step3Fields = [formData.timeline, formData.motivation, formData.priceExpectation];
    newCompletion.step3 = Math.round((step3Fields.filter(field => field).length / step3Fields.length) * 100);

    // Step 4 completion
    const step4Fields = [formData.firstName, formData.lastName, formData.email, formData.phone];
    newCompletion.step4 = Math.round((step4Fields.filter(field => field).length / step4Fields.length) * 100);

    setCompletion(newCompletion);
  }, [formData]);

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
          <div className="space-y-8">
            {/* Address Section */}
            <div className="group">
              <label className="block font-light uppercase text-gray-900 text-sm mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-3 text-gray-600" />
                Adresse du bien *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="123 Avenue de Luxe, 75008 Paris"
                className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light text-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Property Type */}
              <div className="group">
                <label className="block font-light uppercase text-gray-900 text-sm mb-4 flex items-center">
                  <BuildingStorefrontIcon className="w-5 h-5 mr-3 text-gray-600" />
                  Type de bien *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {propertyTypes.map(type => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, propertyType: type.value }))}
                        className={`p-6 border-2 rounded-2xl text-center transition-all duration-500 transform hover:scale-105 ${
                          formData.propertyType === type.value
                            ? 'border-gray-900 bg-gray-900 bg-opacity-5 text-gray-900 shadow-lg'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <IconComponent className={`w-8 h-8 mb-3 mx-auto ${
                          formData.propertyType === type.value ? 'text-gray-900' : 'text-gray-600'
                        }`} />
                        <div className="font-light text-sm">{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Surface & Rooms */}
              <div className="space-y-6">
                <div className="group">
                  <label className="block font-light uppercase text-gray-900 text-sm mb-3 flex items-center">
                    <ArrowsPointingOutIcon className="w-5 h-5 mr-3 text-gray-600" />
                    Surface (m²) *
                  </label>
                  <input
                    type="number"
                    name="surface"
                    value={formData.surface}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 120"
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block font-light uppercase text-gray-900 text-sm mb-3">
                      Pièces *
                    </label>
                    <input
                      type="number"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleChange}
                      required
                      placeholder="Ex: 5"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                    />
                  </div>

                  <div className="group">
                    <label className="block font-light uppercase text-gray-900 text-sm mb-3">
                      Chambres *
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      required
                      placeholder="Ex: 3"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Condition */}
            <div className="group">
              <label className="block font-light uppercase text-gray-900 text-sm mb-4">
                État du bien *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conditions.map(condition => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, condition: condition.value }))}
                    className={`p-6 border-2 rounded-2xl text-left transition-all duration-500 transform hover:scale-105 ${
                      formData.condition === condition.value
                        ? 'border-gray-900 bg-gray-900 bg-opacity-5 text-gray-900 shadow-lg'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-light uppercase text-gray-900 mb-2">
                      {condition.label}
                    </div>
                    <div className="font-light text-gray-600 text-sm">
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
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-light uppercase text-gray-900 mb-4">
                Équipements & Prestations
              </h3>
              <p className="font-light text-gray-600 text-lg">
                Sélectionnez les équipements qui valorisent votre bien
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {features.map(feature => {
                const FeatureIcon = feature.icon;
                return (
                  <button
                    key={feature.value}
                    type="button"
                    onClick={() => handleFeatureToggle(feature.value)}
                    className={`group p-6 border-2 rounded-2xl text-center transition-all duration-500 transform hover:scale-105 ${
                      formData.features.includes(feature.value)
                        ? 'border-gray-900 bg-gray-900 bg-opacity-5 text-gray-900 shadow-lg'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <FeatureIcon className={`w-8 h-8 mb-3 mx-auto transform transition-transform duration-300 ${
                      formData.features.includes(feature.value) ? 'scale-110 text-gray-900' : 'text-gray-600'
                    }`} />
                    <div className="font-light text-sm group-hover:text-gray-900 transition-colors duration-300">
                      {feature.label}
                    </div>
                    {formData.features.includes(feature.value) && (
                      <div className="mt-2">
                        <CheckCircleIconSolid className="w-5 h-5 text-gray-900 mx-auto" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Features Summary */}
            {formData.features.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200 mt-8">
                <h4 className="font-light uppercase text-gray-900 text-sm mb-4">
                  Équipements sélectionnés ({formData.features.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map(featureValue => {
                    const feature = features.find(f => f.value === featureValue);
                    const FeatureIcon = feature?.icon;
                    return feature ? (
                      <span key={feature.value} className="bg-gray-900/10 text-gray-900 px-3 py-2 rounded-full font-light text-sm flex items-center space-x-2">
                        {FeatureIcon && <FeatureIcon className="w-4 h-4" />}
                        <span>{feature.label}</span>
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Timeline */}
              <div className="group">
                <label className="block font-light uppercase text-gray-900 text-sm mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-3 text-gray-600" />
                  Délai de vente souhaité *
                </label>
                <div className="space-y-4">
                  {timelines.map(timeline => (
                    <button
                      key={timeline.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, timeline: timeline.value }))}
                      className={`w-full p-4 border-2 rounded-2xl text-left transition-all duration-500 transform hover:scale-105 ${
                        formData.timeline === timeline.value
                          ? 'border-gray-900 bg-gray-900 bg-opacity-5 text-gray-900 shadow-lg'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-light uppercase text-gray-900 mb-1">
                        {timeline.label}
                      </div>
                      <div className="font-light text-gray-600 text-sm">
                        {timeline.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Expectation */}
              <div className="space-y-6">
                <div className="group">
                  <label className="block font-light uppercase text-gray-900 text-sm mb-3 flex items-center">
                    <CurrencyEuroIcon className="w-5 h-5 mr-3 text-gray-600" />
                    Fourchette de prix envisagée
                  </label>
                  <input
                    type="text"
                    name="priceExpectation"
                    value={formData.priceExpectation}
                    onChange={handleChange}
                    placeholder="Ex: 1,200,000 - 1,500,000 €"
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                  />
                </div>

                <div className="group">
                  <label className="block font-light uppercase text-gray-900 text-sm mb-3">
                    Disponibilités pour les visites
                  </label>
                  <input
                    type="text"
                    name="visitAvailability"
                    value={formData.visitAvailability}
                    onChange={handleChange}
                    placeholder="Ex: Weekends, en semaine après 18h..."
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="group">
              <label className="block font-light uppercase text-gray-900 text-sm mb-4">
                Motivation de la vente *
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Décrivez brièvement les raisons de votre projet de vente (déménagement, investissement, succession...)"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm resize-none transition-all duration-300 hover:border-gray-400 leading-relaxed"
              ></textarea>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="font-light uppercase text-gray-900 text-lg mb-6 flex items-center">
                  <UserIcon className="w-6 h-6 mr-3 text-gray-600" />
                  Informations personnelles
                </h3>
                
                <div className="group">
                  <label className="block font-light uppercase text-gray-900 text-sm mb-3">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                  />
                </div>

                <div className="group">
                  <label className="block font-light uppercase text-gray-900 text-sm mb-3">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="font-light uppercase text-gray-900 text-lg mb-6 flex items-center">
                  <EnvelopeIcon className="w-6 h-6 mr-3 text-gray-600" />
                  Coordonnées
                </h3>

                <div className="group">
                  <label className="block font-light uppercase text-gray-900 text-sm mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                  />
                </div>

                <div className="group">
                  <label className="block font-light uppercase text-gray-900 text-sm mb-3">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
              <h4 className="font-light uppercase text-gray-900 text-lg mb-6 flex items-center">
                <DocumentTextIcon className="w-6 h-6 mr-3 text-gray-600" />
                Récapitulatif de votre demande
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="font-light uppercase text-gray-900 text-xs mb-2">BIEN IMMOBILIER</div>
                  <div className="font-light text-gray-700 space-y-1">
                    <div>{formData.address}</div>
                    <div>{propertyTypes.find(t => t.value === formData.propertyType)?.label}</div>
                    <div>{formData.surface} m² • {formData.rooms} pièces • {formData.bedrooms} chambres</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-light uppercase text-gray-900 text-xs mb-2">VOTRE PROJET</div>
                  <div className="font-light text-gray-700 space-y-1">
                    <div>{timelines.find(t => t.value === formData.timeline)?.label}</div>
                    <div>{formData.priceExpectation && `Budget: ${formData.priceExpectation}`}</div>
                    <div>{formData.features.length} équipements sélectionnés</div>
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
      {/* Enhanced Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/50 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex items-center justify-center h-full text-white">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {/* Elegant Typography */}
              <div className="text-center mb-8">
                <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/20">
                  <span className="text-sm uppercase tracking-widest font-light">Estimation Prestige</span>
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-light uppercase mb-6 text-center tracking-tight">
                Votre Estimation
              </h1>
              
              {/* Current Slide Info */}
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight">
                  {heroSlides[activeSlide].title}
                </h2>
                <p className="text-xl md:text-2xl text-gray-200 mb-6 font-light">
                  {heroSlides[activeSlide].subtitle}
                </p>
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  {heroSlides[activeSlide].description}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="max-w-md mx-auto mb-12">
                <div className="flex justify-between text-sm text-white/80 mb-2">
                  <span>Étape {currentStep} sur {steps.length}</span>
                  <span>{Math.round((currentStep / steps.length) * 100)}% complété</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-gold to-amber-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="group relative bg-white text-gray-900 px-16 py-5 font-light uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    <span>Commencer l'estimation</span>
                    <ChevronRightIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-6">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:text-gold transition-colors duration-300"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeSlide 
                    ? 'bg-gold scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="text-white hover:text-gold transition-colors duration-300"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="text-white hover:text-gold transition-colors duration-300"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
      </section>

      {/* Main Form Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Enhanced Progress Steps */}
          <div className="mb-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-8 lg:space-y-0">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;
                
                return (
                  <div key={step.number} className="flex items-center space-x-6 group cursor-pointer" onClick={() => setCurrentStep(step.number)}>
                    {/* Step Number & Icon */}
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 transform group-hover:scale-110 ${
                        isActive 
                          ? 'bg-gradient-to-br from-gray-900 to-gray-700 border-gray-900 text-white shadow-lg' 
                          : isCompleted
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'border-gray-300 text-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircleIconSolid className="w-8 h-8" />
                        ) : (
                          <StepIcon className="w-8 h-8" />
                        )}
                      </div>
                      
                      {/* Completion Ring */}
                      {!isCompleted && !isActive && (
                        <div className="absolute -inset-2 border-2 border-gray-300 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </div>
                    
                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-light uppercase text-sm mb-1 transition-colors duration-300 ${
                        isActive ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        Étape {step.number}
                      </div>
                      <div className={`font-light uppercase text-lg mb-1 ${
                        isActive ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                      <div className="font-light text-gray-500 text-sm">
                        {step.description}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-gray-900 to-gray-700 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${completion[`step${step.number}` as keyof typeof completion]}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
            <div className="max-w-4xl mx-auto">
              {/* Step Content */}
              <div className="mb-12">
                {renderStep()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-3 px-8 py-4 font-light uppercase tracking-wider transition-all duration-300 rounded-2xl ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 transform hover:scale-105'
                  }`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  <span>Précédent</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="group relative bg-gradient-to-r from-gray-900 to-gray-700 text-white px-12 py-4 font-light uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden rounded-2xl"
                >
                  {/* white overlay scales in on hover so the background becomes the previous text color */}
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 flex items-center space-x-3 text-white transition-colors duration-300 group-hover:text-gray-900">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Traitement...</span>
                      </>
                    ) : currentStep === steps.length ? (
                      <>
                        <span>Soumettre</span>
                        <CheckCircleIcon className="w-5 h-5 text-current" />
                      </>
                    ) : (
                      <>
                        <span>Continuer</span>
                        <ChevronRightIcon className="w-5 h-5 text-current transform group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellingMultiStep;