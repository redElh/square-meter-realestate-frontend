// src/pages/ConfidentialSelection.tsx
import React, { useState, useRef } from 'react';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  HomeIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

const ConfidentialSelection: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    budget: '',
    location: '',
    propertyType: '',
    cv: null as File | null
  });

  const budgetOptions = [
    { value: '1-3M', label: '1M€ - 3M€' },
    { value: '3-5M', label: '3M€ - 5M€' },
    { value: '5-10M', label: '5M€ - 10M€' },
    { value: '10M+', label: '10M€ et plus' }
  ];

  const propertyTypes = [
    { value: 'villa', label: 'Villa' },
    { value: 'appartement', label: 'Appartement' },
    { value: 'domaine', label: 'Domaine' },
    { value: 'chateau', label: 'Château' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'commercial', label: 'Commercial' }
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
        phone: '',
        company: '',
        message: '',
        budget: '',
        location: '',
        propertyType: '',
        cv: null
      });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        <div className="fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in px-4 max-w-full">
          <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white px-4 sm:px-8 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 border-2 border-white shadow-2xl">
            <CheckCircleIconSolid className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="font-inter font-medium text-sm sm:text-base lg:text-lg">Demande d'accès envoyée avec succès!</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
              Sélection Confidentielle
            </h1>
            <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-4 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              Accédez à notre portefeuille de propriétés exclusives, réservé à une clientèle discrète et exigeante. 
              Ces biens d'exception ne sont pas présentés publiquement afin de préserver l'intimité de leurs propriétaires.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Column - Information & Benefits */}
          <div className="lg:col-span-1">
            {/* Access Requirements Card */}
            <div className="bg-white border-2 border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#023927] flex items-center justify-center flex-shrink-0">
                  <LockClosedIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-inter font-light text-gray-900">
                  Accès Réservé
                </h2>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="border-2 border-gray-100 p-3 sm:p-4">
                  <div className="flex items-start space-x-3">
                    <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#023927] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-inter font-medium text-gray-900 text-sm sm:text-base mb-1">
                        Confidentialité Totale
                      </h3>
                      <p className="font-inter text-gray-600 text-xs sm:text-sm">
                        Votre identité et vos critères sont protégés avec la plus grande discrétion.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-100 p-3 sm:p-4">
                  <div className="flex items-start space-x-3">
                    <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#023927] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-inter font-medium text-gray-900 text-sm sm:text-base mb-1">
                        Validation Personnalisée
                      </h3>
                      <p className="font-inter text-gray-600 text-xs sm:text-sm">
                        Chaque demande est étudiée individuellement par notre comité de sélection.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-100 p-3 sm:p-4">
                  <div className="flex items-start space-x-3">
                    <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#023927] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-inter font-medium text-gray-900 text-sm sm:text-base mb-1">
                        Biens Exclusifs
                      </h3>
                      <p className="font-inter text-gray-600 text-xs sm:text-sm">
                        Accès à des propriétés qui ne figurent sur aucun site ni annonce publique.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-4 sm:p-6 lg:p-8 text-white">
              <h3 className="font-inter font-medium text-base sm:text-lg mb-4 sm:mb-6">
                Contact Direct
              </h3>
              <div className="space-y-4">
                <a 
                  href="tel:+33123456789"
                  className="flex items-center space-x-3 p-3 border-2 border-white/20 hover:border-white/40 transition-all duration-300 group"
                >
                  <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-inter font-medium text-sm sm:text-base">Téléphone Privé</div>
                    <div className="font-inter text-white/80 text-xs sm:text-sm">+33 1 23 45 67 89</div>
                  </div>
                </a>

                <a 
                  href="mailto:confidential@squaremeter.com"
                  className="flex items-center space-x-3 p-3 border-2 border-white/20 hover:border-white/40 transition-all duration-300 group"
                >
                  <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-inter font-medium text-sm sm:text-base">Email Département</div>
                    <div className="font-inter text-white/80 text-xs sm:text-sm">confidential@squaremeter.com</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Confidential Access Form */}
          <div className="lg:col-span-2">
            {/* Confidential Access Form */}
            <div className="bg-white border-2 border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200 gap-3">
                <h2 className="text-xl sm:text-2xl font-inter font-light text-gray-900">
                  Demande d'Accès Confidentiel
                </h2>
                <div className="flex items-center space-x-2 text-[#023927]">
                  <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-inter text-xs sm:text-sm font-medium">Protocole de discrétion activé</span>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                    Société / Fondation / Organisation
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
                    placeholder="Nom de votre organisation"
                  />
                </div>

                {/* Search Criteria */}
                <div className="bg-gray-50 border-2 border-gray-200 p-4 sm:p-6">
                  <h3 className="font-inter font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                    Votre Recherche
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2">
                        <span className="flex items-center space-x-1">
                          <CurrencyEuroIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Budget approximatif</span>
                        </span>
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-2.5 sm:px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white text-xs sm:text-sm"
                      >
                        <option value="">Sélectionnez</option>
                        {budgetOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2">
                        <span className="flex items-center space-x-1">
                          <HomeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Type de bien</span>
                        </span>
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-2.5 sm:px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white text-xs sm:text-sm"
                      >
                        <option value="">Sélectionnez</option>
                        {propertyTypes.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2">
                        <span className="flex items-center space-x-1">
                          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Localisation</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Paris, Côte d'Azur..."
                        className="w-full px-2.5 sm:px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Documentation */}
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                    Documentation (optionnel)
                  </label>
                  <div className="border-2 border-gray-200 p-4 hover:border-[#023927] transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <DocumentArrowUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      <div>
                        <div className="font-inter font-medium text-gray-900 text-sm sm:text-base">
                          Importer des documents
                        </div>
                        <div className="font-inter text-gray-500 text-xs">
                          CV, lettre de motivation, références, ou tout autre document pertinent
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      name="cv"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="w-full px-2.5 sm:px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#023927] file:text-white file:font-inter file:text-sm file:cursor-pointer"
                    />
                    {formData.cv && (
                      <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">Document sélectionné :</span>
                        <span>{formData.cv.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block font-inter text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                    Message (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Décrivez brièvement votre projet, vos attentes spécifiques, ou toute information pertinente..."
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
                        <span>Validation en cours...</span>
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform duration-300" />
                        <span>Demander l'accès confidentiel</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>

            {/* Confidentiality Commitment */}
            <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-4 sm:p-6 lg:p-8 text-white">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <h3 className="font-inter font-medium text-base sm:text-lg">
                  Engagement de Confidentialité
                </h3>
              </div>
              <div className="space-y-4">
                <p className="font-inter text-white/90 text-xs sm:text-sm leading-relaxed">
                  Toutes les informations partagées restent strictement confidentielles et sont protégées 
                  par notre protocole de discrétion.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border-2 border-white/20 p-3">
                    <div className="font-inter font-medium text-white text-sm mb-1">Réponse sous 24h</div>
                    <div className="font-inter text-white/80 text-xs">Notre comité traite chaque demande rapidement</div>
                  </div>
                  <div className="border-2 border-white/20 p-3">
                    <div className="font-inter font-medium text-white text-sm mb-1">Protocole sécurisé</div>
                    <div className="font-inter text-white/80 text-xs">Chiffrement des données et communication sécurisée</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section - Confidential Protocol */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-3 sm:mb-4">
              Protocole d'Accès Confidentiel
            </h2>
            <p className="text-gray-600 font-inter text-sm sm:text-base px-4">
              Notre processus garantit la discrétion absolue à chaque étape
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Validation', desc: 'Analyse et validation de votre demande' },
              { step: '02', title: 'Accord de confidentialité', desc: 'Signature du protocole de discrétion' },
              { step: '03', title: 'Sélection personnalisée', desc: 'Présentation de biens correspondants' },
              { step: '04', title: 'Visites sécurisées', desc: 'Organisation de visites privées' }
            ].map((process, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white flex items-center justify-center text-lg sm:text-2xl font-inter font-medium mb-3 sm:mb-4 mx-auto">
                    {process.step}
                  </div>
                  <h4 className="font-inter font-medium text-gray-900 mb-2 text-sm sm:text-base">
                    {process.title}
                  </h4>
                  <p className="font-inter text-gray-600 text-xs sm:text-sm">
                    {process.desc}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidentialSelection;