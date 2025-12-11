// src/pages/Contact.tsx
import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

const Contact: React.FC = () => {
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
      title: 'Email',
      details: 'contact@squaremeter.com',
      description: 'Réponse sous 24h',
      action: 'mailto:contact@squaremeter.com'
    },
    {
      icon: PhoneIcon,
      title: 'Téléphone',
      details: '+33 1 23 45 67 89',
      description: 'Lun - Ven, 9h - 18h',
      action: 'tel:+33123456789'
    },
    {
      icon: MapPinIcon,
      title: 'Agence',
      details: '123 Avenue de Luxe, 75008 Paris',
      description: 'Sur rendez-vous',
      action: '#'
    }
  ];

  const quickActions = [
    {
      icon: DocumentTextIcon,
      title: 'Demander une estimation',
      description: 'Évaluation gratuite de votre bien',
      type: 'estimation'
    },
    {
      icon: CalendarIcon,
      title: 'Prendre rendez-vous',
      description: 'Visite privée avec un expert',
      type: 'appointment'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sélection confidentielle',
      description: 'Accès aux biens exclusifs',
      type: 'confidential'
    }
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
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white px-8 py-4 flex items-center space-x-3 border-2 border-white shadow-2xl">
            <CheckCircleIconSolid className="w-6 h-6" />
            <span className="font-inter font-medium text-lg">Message envoyé avec succès!</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-inter font-light text-white mb-6 tracking-tight">
              Contact
            </h1>
            <div className="h-1 bg-white/30 w-48 mx-auto mb-8"></div>
            <p className="text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed">
              Votre projet immobilier mérite une attention exceptionnelle. 
              Notre équipe d'experts se tient à votre disposition pour concrétiser vos ambitions.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Left Column - Contact Information */}
          <div className="lg:col-span-1">
            {/* Contact Methods Card */}
            <div className="bg-white border-2 border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-inter font-light text-gray-900 mb-8 pb-4 border-b border-gray-200">
                Nos Coordonnées
              </h2>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.action}
                      className="group flex items-start space-x-4 p-4 border-2 border-gray-100 hover:border-[#023927] transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-[#023927] flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-inter font-medium text-gray-900 mb-1 group-hover:text-[#023927] transition-colors duration-300">
                          {method.title}
                        </h3>
                        <p className="font-inter text-gray-700 text-sm">{method.details}</p>
                        <p className="font-inter text-gray-500 text-xs">{method.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="font-inter font-medium text-gray-900 mb-6">
                  Actions Rapides
                </h3>
                <div className="space-y-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.type)}
                        className="w-full text-left p-4 border-2 border-gray-200 hover:border-[#023927] hover:bg-gray-50 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-100 flex items-center justify-center group-hover:bg-[#023927] transition-colors duration-300">
                            <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div>
                            <div className="font-inter font-medium text-gray-900 text-sm mb-1 group-hover:text-[#023927] transition-colors duration-300">
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
            <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-8 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <ShieldCheckIcon className="w-6 h-6" />
                <h3 className="font-inter font-medium text-lg">Confidentialité Totale</h3>
              </div>
              <p className="font-inter text-white/90 text-sm leading-relaxed">
                Toutes vos informations sont protégées et traitées de manière strictement confidentielle. 
                Notre engagement : discrétion absolue et protection de vos données.
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            {/* Enhanced Contact Form */}
            <div className="bg-white border-2 border-gray-200 p-8 mb-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-inter font-light text-gray-900">
                  Envoyez-nous un message
                </h2>
                <div className="flex items-center space-x-2 text-[#023927]">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="font-inter text-sm font-medium">100% confidentiel</span>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                {/* Company & Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                      Société
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300"
                      placeholder="Nom de votre société"
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                      Sujet *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="buy">Acheter un bien</option>
                      <option value="sell">Vendre un bien</option>
                      <option value="rent">Louer un bien</option>
                      <option value="management">Gestion de bien</option>
                      <option value="estimation">Estimation gratuite</option>
                      <option value="confidential">Sélection confidentielle</option>
                      <option value="partnership">Partenariat</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                    Méthode de contact préférée
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'email', label: 'Email', icon: EnvelopeIcon },
                      { value: 'phone', label: 'Téléphone', icon: PhoneIcon }
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
                          <div className={`p-4 border-2 cursor-pointer transition-all duration-300 ${
                            formData.preferredContact === method.value
                              ? 'border-[#023927] bg-[#023927]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 flex items-center justify-center transition-colors duration-300 ${
                                formData.preferredContact === method.value
                                  ? 'bg-[#023927] text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <span className="font-inter text-gray-700 font-medium">{method.label}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Fields */}
                {(formData.subject === 'buy' || formData.subject === 'sell') && (
                  <div className="p-6 bg-gray-50 border-2 border-gray-200">
                    <h3 className="font-inter font-medium text-gray-900 mb-4">Détails de votre projet</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-inter text-gray-900 text-sm mb-2">
                          Type de bien
                        </label>
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white"
                        >
                          <option value="">Type de bien</option>
                          <option value="apartment">Appartement</option>
                          <option value="villa">Villa</option>
                          <option value="house">Maison</option>
                          <option value="land">Terrain</option>
                          <option value="commercial">Commercial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-inter text-gray-900 text-sm mb-2">
                          Budget
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white"
                        >
                          <option value="">Budget</option>
                          <option value="1M">1M€ - 2M€</option>
                          <option value="2M">2M€ - 5M€</option>
                          <option value="5M">5M€ - 10M€</option>
                          <option value="10M">10M€+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-inter text-gray-900 text-sm mb-2">
                          Délai
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border-2 border-gray-200 focus:outline-none focus:border-[#023927] font-inter bg-white"
                        >
                          <option value="">Délai</option>
                          <option value="urgent">Urgent (1-3 mois)</option>
                          <option value="medium">Moyen (3-6 mois)</option>
                          <option value="flexible">Flexible (6+ mois)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block font-inter text-gray-900 text-sm mb-3 font-medium">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Décrivez votre projet, vos attentes, ou toute information pertinente..."
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-[#023927] focus:ring-2 focus:ring-[#023927]/20 font-inter bg-white transition-all duration-300 hover:border-gray-300 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-4 font-inter font-medium hover:from-[#0a4d3a] hover:to-[#023927] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="flex items-center justify-center space-x-3">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: ShieldCheckIcon,
                  title: 'Confidentialité',
                  description: 'Toutes vos informations sont protégées et traitées de manière strictement confidentielle.'
                },
                {
                  icon: ClockIcon,
                  title: 'Réactivité',
                  description: 'Notre équipe s\'engage à vous répondre dans les plus brefs délais.'
                },
                {
                  icon: UserIcon,
                  title: 'Expertise',
                  description: 'Bénéficiez des conseils d\'experts avec plus de 15 ans d\'expérience.'
                }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="text-center p-6 bg-white border-2 border-gray-200 group hover:border-[#023927] transition-all duration-300">
                    <div className="w-12 h-12 bg-[#023927] flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-inter font-medium text-gray-900 text-sm mb-2">
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
      <div className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-inter font-light text-gray-900 mb-4">
              Notre Processus
            </h2>
            <p className="text-gray-600 font-inter">
              Comment nous transformons votre demande en expérience exceptionnelle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Analyse', desc: 'Évaluation approfondie de votre projet' },
              { step: '02', title: 'Conseil', desc: 'Recommandations personnalisées' },
              { step: '03', title: 'Recherche', desc: 'Sélection des meilleures opportunités' },
              { step: '04', title: 'Suivi', desc: 'Accompagnement jusqu\'à la concrétisation' }
            ].map((process, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white flex items-center justify-center text-2xl font-inter font-medium mb-4 mx-auto">
                    {process.step}
                  </div>
                  <h4 className="font-inter font-medium text-gray-900 mb-2">
                    {process.title}
                  </h4>
                  <p className="font-inter text-gray-600 text-sm">
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

export default Contact;