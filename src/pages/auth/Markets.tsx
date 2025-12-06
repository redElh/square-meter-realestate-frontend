// src/pages/Markets.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const Markets: React.FC = () => {
  const featuredMarkets = [
    {
      id: 1,
      name: 'Paris',
      image: '/markets/paris.jpg',
      description: 'Le marché de l\'immobilier de prestige parisien, des appartements haussmanniens aux penthouses contemporains',
      priceTrend: '+5.2%',
      avgPrice: '15,000 €/m²',
      properties: 45
    },
    {
      id: 2,
      name: 'Côte d\'Azur',
      image: '/markets/cote-azur.jpg',
      description: 'Villas et domaines d\'exception entre Saint-Tropez, Cannes et Monaco',
      priceTrend: '+7.8%',
      avgPrice: '12,500 €/m²',
      properties: 32
    },
    {
      id: 3,
      name: 'Alpes Françaises',
      image: '/markets/alpes.jpg',
      description: 'Chalets et résidences de montagne dans les stations les plus prestigieuses',
      priceTrend: '+6.1%',
      avgPrice: '9,800 €/m²',
      properties: 28
    },
    {
      id: 4,
      name: 'Provence',
      image: '/markets/provence.jpg',
      description: 'Mas et domaines provençaux au cœur des paysages emblématiques de Luberon',
      priceTrend: '+4.9%',
      avgPrice: '6,500 €/m²',
      properties: 23
    }
  ];

  const internationalMarkets = [
    { name: 'Londres', trend: '+3.2%', description: 'Prime Central London' },
    { name: 'Genève', trend: '+4.1%', description: 'Lac Léman et vieille ville' },
    { name: 'Miami', trend: '+8.5%', description: 'Waterfront properties' },
    { name: 'Dubai', trend: '+6.7%', description: 'Palm Jumeirah & Downtown' },
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-inter uppercase text-deep-green mb-6">
            Nos Marchés
          </h1>
          <p className="text-xl font-didot text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Expertise locale, vision globale. Découvrez notre connaissance approfondie 
            des marchés immobiliers les plus prestigieux de France et d'Europe.
          </p>
        </div>

        {/* Featured Markets */}
        <section className="mb-20">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-12">
            Marchés Français
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredMarkets.map((market, idx) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-6">
                    <h3 className="text-2xl font-inter uppercase text-ivory mb-2">{market.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="bg-green-500 text-ivory px-3 py-1 rounded-full text-sm font-inter">
                        {market.priceTrend}
                      </span>
                      <span className="font-didot text-gold">{market.avgPrice}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-didot text-gray-600 mb-4 leading-relaxed">
                    {market.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-didot text-gold">
                      {market.properties} propriétés disponibles
                    </span>
                    <Link
                      to={`/properties?location=${market.name}`}
                      className="inline-flex items-center text-deep-green hover:text-gold font-inter uppercase text-sm tracking-wide transition-colors"
                    >
                      Explorer
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* International Markets */}
        <section className="mb-20">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-12">
            Marchés Internationaux
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {internationalMarkets.map((market, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm p-6 text-center group hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <GlobeAltIcon className="w-8 h-8 text-deep-green" />
                </div>
                <h3 className="font-inter uppercase text-deep-green mb-2">{market.name}</h3>
                <div className="text-green-500 font-inter text-sm mb-2">{market.trend}</div>
                <p className="font-didot text-gray-600 text-sm">{market.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Market Insights */}
        <section className="bg-deep-green text-ivory rounded-2xl p-12 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-inter uppercase mb-6">
              Insights du Marché
            </h2>
            <p className="text-xl font-didot text-gold mb-8 leading-relaxed">
              Notre équipe d'analystes suit en temps réel l'évolution des marchés 
              immobiliers de prestige pour vous offrir une expertise actualisée.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-inter mb-2">98%</div>
                <div className="font-didot text-gold">Taux de réussite</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-inter mb-2">15+</div>
                <div className="font-didot text-gold">Marchés maîtrisés</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-inter mb-2">24h</div>
                <div className="font-didot text-gold">Analyse personnalisée</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-inter uppercase text-deep-green mb-6">
            Expertise sur Mesure
          </h2>
          <p className="text-lg font-didot text-gray-700 mb-8 max-w-2xl mx-auto">
            Bénéficiez d'une analyse personnalisée du marché de votre choix 
            et découvrez les opportunités d'investissement les plus prometteuses.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-deep-green text-ivory px-8 py-4 font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-colors rounded-lg"
          >
            Obtenir une analyse personnalisée
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Markets;