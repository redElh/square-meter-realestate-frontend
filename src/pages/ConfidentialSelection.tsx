// src/pages/ConfidentialSelection.tsx
import React, { useState } from 'react';

const ConfidentialSelection: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    budget: '',
    location: '',
    propertyType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle confidential access request
    console.log('Confidential access request:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-inter uppercase text-deep-green mb-6">
            Sélection Confidentielle
          </h1>
          <p className="text-xl font-didot text-gray-700 leading-relaxed">
            Accédez à notre portefeuille de propriétés exclusives, réservé à une clientèle discrète et exigeante. 
            Ces biens d'exception ne sont pas présentés publiquement afin de préserver l'intimité de leurs propriétaires.
          </p>
        </div>

        {/* Authentication Gate */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-deep-green text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
              Accès Réservé
            </h2>
            <p className="font-didot text-gray-600">
              Veuillez remplir ce formulaire pour que notre équipe puisse évaluer votre demande d'accès 
              à notre sélection confidentielle.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-didot text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
                />
              </div>
              <div>
                <label className="block font-didot text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-didot text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
                />
              </div>
              <div>
                <label className="block font-didot text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
                />
              </div>
            </div>

            <div>
              <label className="block font-didot text-gray-700 mb-2">
                Société / Fondation
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-didot text-gray-700 mb-2">
                  Budget approximatif
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
                >
                  <option value="">Sélectionnez</option>
                  <option value="1-3M">1M€ - 3M€</option>
                  <option value="3-5M">3M€ - 5M€</option>
                  <option value="5-10M">5M€ - 10M€</option>
                  <option value="10M+">10M€ et plus</option>
                </select>
              </div>
              <div>
                <label className="block font-didot text-gray-700 mb-2">
                  Type de bien recherché
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
                >
                  <option value="">Sélectionnez</option>
                  <option value="villa">Villa</option>
                  <option value="appartement">Appartement</option>
                  <option value="domaine">Domaine</option>
                  <option value="chateau">Château</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-didot text-gray-700 mb-2">
                Localisation recherchée
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Paris, Côte d'Azur, Alpes..."
                className="w-full px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
              />
            </div>

            <div>
              <label className="block font-didot text-gray-700 mb-2">
                Message (optionnel)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot resize-none"
                placeholder="Décrivez brièvement votre projet et vos attentes spécifiques..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-deep-green text-ivory px-12 py-4 font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-colors rounded-lg"
              >
                Demander l'accès confidentiel
              </button>
            </div>
          </form>
        </div>

        {/* Confidentiality Notice */}
        <div className="bg-deep-green text-ivory rounded-2xl p-8 text-center">
          <h3 className="font-inter uppercase text-xl mb-4">
            Confidentialité Assurée
          </h3>
          <p className="font-didot text-gold leading-relaxed">
            Toutes les informations partagées restent strictement confidentielles. 
            Notre équipe vous contactera sous 24 heures pour échanger sur votre projet 
            et vous présenter les propriétés correspondant à vos critères.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfidentialSelection;