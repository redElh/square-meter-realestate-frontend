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
  CheckCircleIcon
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-ivory/50 py-12">
      {/* Success Message */}
      {isSubmitted && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 flex items-center space-x-3">
            <CheckCircleIcon className="w-6 h-6" />
            <span className="font-didot text-lg">Message envoyé avec succès!</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6">
        {/* Enhanced Header */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-9xl font-didot">✉️</div>
          </div>
          <h1 className="text-6xl md:text-7xl font-inter uppercase text-deep-green mb-8 relative">
            Contact
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-amber-600 mx-auto mb-8"></div>
          <p className="text-2xl font-didot text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Votre projet immobilier mérite une attention exceptionnelle. 
            Notre équipe d'experts se tient à votre disposition pour concrétiser vos ambitions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Enhanced Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Methods */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gold/20 sticky top-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-8 relative">
                <span className="relative z-10">Nos Coordonnées</span>
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gold"></div>
              </h2>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.action}
                      className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gold/5 hover:to-transparent transition-all duration-500 border border-transparent hover:border-gold/30"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-gold to-amber-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                        <IconComponent className="w-6 h-6 text-deep-green" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-inter uppercase text-deep-green mb-1 group-hover:text-gold transition-colors duration-300">
                          {method.title}
                        </h3>
                        <p className="font-didot text-gray-700 text-lg">{method.details}</p>
                        <p className="font-didot text-gold text-sm">{method.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-12 pt-8 border-t border-gold/30">
                <h3 className="font-inter uppercase text-deep-green mb-6 relative">
                  <span className="relative z-10">Actions Rapides</span>
                  <div className="absolute bottom-0 left-0 w-8 h-1 bg-gold"></div>
                </h3>
                <div className="space-y-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.type)}
                        className="w-full group text-left p-4 rounded-2xl border border-gold/20 hover:border-gold hover:bg-gradient-to-r hover:from-gold/5 hover:to-transparent transition-all duration-500 transform hover:scale-105"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-ivory rounded-xl flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                            <IconComponent className="w-5 h-5 text-deep-green group-hover:text-ivory transition-colors duration-300" />
                          </div>
                          <div>
                            <div className="font-inter uppercase text-deep-green text-sm mb-1 group-hover:text-gold transition-colors duration-300">
                              {action.title}
                            </div>
                            <div className="font-didot text-gray-600 text-xs">
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

            {/* Statistics Card - Removed as requested */}
          </div>

          {/* Enhanced Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gold/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-inter uppercase text-deep-green relative">
                  <span className="relative z-10">Envoyez-nous un message</span>
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-gold"></div>
                </h2>
                <div className="flex items-center space-x-2 text-gold">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="font-didot text-sm">100% confidentiel</span>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                      <UserIcon className="w-4 h-4 inline mr-2" />
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="group">
                    <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                      <UserIcon className="w-4 h-4 inline mr-2" />
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                      <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="group">
                    <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                      <PhoneIcon className="w-4 h-4 inline mr-2" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                {/* Company & Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                      <BuildingOfficeIcon className="w-4 h-4 inline mr-2" />
                      Société
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
                      placeholder="Nom de votre société"
                    />
                  </div>
                  <div className="group">
                    <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                      <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                      Sujet *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
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
                <div className="group">
                  <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 inline mr-2" />
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
                          <div className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            formData.preferredContact === method.value
                              ? 'border-gold bg-gradient-to-r from-gold/10 to-transparent shadow-lg'
                              : 'border-gold/30 hover:border-gold/50'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                                formData.preferredContact === method.value
                                  ? 'bg-gold text-deep-green'
                                  : 'bg-ivory text-deep-green'
                              }`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <span className="font-didot text-gray-700">{method.label}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Fields */}
                {(formData.subject === 'buy' || formData.subject === 'sell') && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-gold/5 to-transparent rounded-2xl border border-gold/20">
                    <div className="group">
                      <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                        Type de bien
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
                      >
                        <option value="">Type de bien</option>
                        <option value="apartment">Appartement</option>
                        <option value="villa">Villa</option>
                        <option value="house">Maison</option>
                        <option value="land">Terrain</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                        Budget
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
                      >
                        <option value="">Budget</option>
                        <option value="1M">1M€ - 2M€</option>
                        <option value="2M">2M€ - 5M€</option>
                        <option value="5M">5M€ - 10M€</option>
                        <option value="10M">10M€+</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                        <ClockIcon className="w-4 h-4 inline mr-2" />
                        Délai
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
                      >
                        <option value="">Délai</option>
                        <option value="urgent">Urgent (1-3 mois)</option>
                        <option value="medium">Moyen (3-6 mois)</option>
                        <option value="flexible">Flexible (6+ mois)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="group">
                  <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                    <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Décrivez votre projet, vos attentes, ou toute information pertinente..."
                    className="w-full px-4 py-4 border-2 border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative bg-gradient-to-r from-deep-green to-emerald-800 text-ivory py-5 font-inter uppercase tracking-wider hover:from-gold hover:to-amber-600 hover:text-deep-green transition-all duration-500 transform hover:scale-105 rounded-2xl shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-3">
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

            {/* Additional Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div key={index} className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gold/20 group hover:bg-gradient-to-br hover:from-gold/5 hover:to-transparent transition-all duration-500">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <IconComponent className="w-6 h-6 text-deep-green" />
                    </div>
                    <h4 className="font-inter uppercase text-deep-green text-sm mb-2 group-hover:text-gold transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="font-didot text-gray-600 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;