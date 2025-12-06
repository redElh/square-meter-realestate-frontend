// src/pages/Investment.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  KeyIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Investment: React.FC = () => {
  const investmentOpportunities = [
    {
      id: 1,
      title: 'Résidences de Prestige Parisiennes',
      type: 'Rendement locatif',
      yield: '3.5-4.5%',
      location: 'Paris 16ème, 7ème, 8ème',
      description: 'Appartements haussmanniens dans les quartiers les plus prisés de Paris',
      minInvestment: '1 500 000 €'
    },
    {
      id: 2,
      title: 'Villas Côte d\'Azur',
      type: 'Location saisonnière',
      yield: '5-7%',
      location: 'Saint-Tropez, Cannes, Cap Ferrat',
      description: 'Villas avec piscine et vue mer pour la location haut de gamme',
      minInvestment: '3 000 000 €'
    },
    {
      id: 3,
      title: 'Domaines Viticoles',
      type: 'Patrimoine & Rendement',
      yield: '4-6%',
      location: 'Bordeaux, Bourgogne, Champagne',
      description: 'Domaines viticoles classés avec potentiel de valorisation',
      minInvestment: '5 000 000 €'
    }
  ];

  const investmentServices = [
    {
      icon: ChartBarIcon,
      title: 'Audit Patrimonial',
      description: 'Analyse complète de votre situation et objectifs d\'investissement'
    },
    {
      icon: KeyIcon,
      title: 'Sourcing Exclusif',
      description: 'Accès à des opportunités non disponibles sur le marché public'
    },
    {
      icon: AdjustmentsHorizontalIcon,
      title: 'Optimisation Fiscale',
      description: 'Stratégies fiscales adaptées à votre profil d\'investisseur'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Gestion Active',
      description: 'Suivi et optimisation continue de votre portefeuille'
    }
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-inter uppercase text-deep-green mb-6">
            Investissement Prestige
          </h1>
          <p className="text-xl font-didot text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Découvrez des opportunités d'investissement immobilier exclusives 
            alliant rendement, valorisation patrimoniale et prestige.
          </p>
        </div>

        {/* Investment Philosophy */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-inter uppercase text-deep-green mb-6">
                Notre Philosophie d'Investissement
              </h2>
              <p className="font-didot text-gray-700 mb-6 leading-relaxed">
                Chez Square Meter, nous croyons que l'immobilier de prestige représente 
                bien plus qu'un placement financier. C'est un héritage, un art de vivre, 
                et un actif tangible qui allie performance économique et valorisation patrimoniale.
              </p>
              <p className="font-didot text-gray-700 leading-relaxed">
                Notre approche combine l'expertise des marchés locaux, l'accès à des 
                opportunités exclusives et une gestion sur mesure pour maximiser 
                votre retour sur investissement.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="p-6 border border-gold rounded-lg">
                  <div className="text-3xl font-inter text-deep-green mb-2">15%</div>
                  <div className="font-didot text-gray-600">Rendement moyen annuel</div>
                </div>
                <div className="p-6 border border-gold rounded-lg">
                  <div className="text-3xl font-inter text-deep-green mb-2">98%</div>
                  <div className="font-didot text-gray-600">Taux d'occupation</div>
                </div>
                <div className="p-6 border border-gold rounded-lg">
                  <div className="text-3xl font-inter text-deep-green mb-2">24</div>
                  <div className="font-didot text-gray-600">Mois de valorisation moyenne</div>
                </div>
                <div className="p-6 border border-gold rounded-lg">
                  <div className="text-3xl font-inter text-deep-green mb-2">50M€+</div>
                  <div className="font-didot text-gray-600">Actifs sous gestion</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Opportunities */}
        <section className="mb-20">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-12">
            Opportunités d'Investissement
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {investmentOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute top-4 right-4 bg-gold text-deep-green px-3 py-1 rounded-full font-inter uppercase text-sm">
                    {opportunity.yield}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-inter uppercase text-deep-green text-lg flex-1 pr-4">
                      {opportunity.title}
                    </h3>
                    <span className="bg-deep-green text-ivory px-3 py-1 rounded-full text-xs font-inter uppercase">
                      {opportunity.type}
                    </span>
                  </div>
                  <p className="font-didot text-gold mb-3">{opportunity.location}</p>
                  <p className="font-didot text-gray-600 text-sm mb-4 leading-relaxed">
                    {opportunity.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-didot text-deep-green font-semibold">
                      Min. {opportunity.minInvestment}
                    </span>
                    <Link
                      to="/contact?type=investment"
                      className="inline-flex items-center text-gold hover:text-deep-green font-inter uppercase text-sm tracking-wide transition-colors"
                    >
                      Détails
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Investment Services */}
        <section className="mb-20">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-12">
            Nos Services d'Investissement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentServices.map((service, index) => {
              const Icon = service.icon as React.ElementType;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm p-6 text-center group hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-deep-green" />
                  </div>
                  <h3 className="font-inter uppercase text-deep-green mb-3">
                    {service.title}
                  </h3>
                  <p className="font-didot text-gray-600 text-sm">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-deep-green text-ivory rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-inter uppercase mb-6">
            Prêt à Investir dans l'Immobilier de Prestige ?
          </h2>
          <p className="text-xl font-didot text-gold mb-8 max-w-2xl mx-auto leading-relaxed">
            Rencontrez notre équipe dédiée à l'investissement pour une analyse 
            personnalisée de votre projet et l'accès à nos opportunités exclusives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact?type=investment"
              className="bg-gold text-deep-green px-8 py-4 font-inter uppercase tracking-wide hover:bg-ivory transition-colors rounded-lg"
            >
              Consultation Investissement
            </Link>
            <Link
              to="/markets"
              className="border-2 border-gold text-gold px-8 py-4 font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-colors rounded-lg"
            >
              Études de Marché
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Investment;