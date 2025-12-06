// src/pages/Services.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeModernIcon, BuildingStorefrontIcon, CurrencyEuroIcon, SparklesIcon, ChartBarIcon, WrenchScrewdriverIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const Services: React.FC = () => {
  const mainServices = [
    {
      icon: HomeModernIcon,
      title: 'Achat & Vente',
      description: 'Acquisition et cession de biens d\'exception avec une expertise marché incomparable',
      features: ['Évaluation précise', 'Mise en valeur premium', 'Réseau d\'acquéreurs internationaux', 'Négociation experte'],
      link: '/properties?type=buy'
    },
    {
      icon: BuildingStorefrontIcon,
      title: 'Location Prestige',
      description: 'Location saisonnière et longue durée de propriétés d\'exception',
      features: ['Gestion complète', 'Sélection locataire rigoureuse', 'Services conciergerie', 'Optimisation des revenus'],
      link: '/properties?type=rent'
    },
    {
      icon: CurrencyEuroIcon,
      title: 'Gestion de Patrimoine',
      description: 'Optimisation et gestion de votre patrimoine immobilier de prestige',
      features: ['Audit patrimonial', 'Stratégie d\'investissement', 'Gestion locative', 'Conseil fiscal'],
      link: '/owners'
    }
  ];

  const additionalServices = [
    {
      icon: SparklesIcon,
      title: 'Services Conciergerie',
      description: 'Services sur mesure pour une expérience de vie et de séjour exceptionnelle'
    },
    {
      icon: ChartBarIcon,
      title: 'Étude de Marché',
      description: 'Analyses approfondies des marchés immobiliers de prestige'
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Rénovation & Décoration',
      description: 'Accompagnement dans la rénovation et la décoration de votre propriété'
    },
    {
      icon: GlobeAltIcon,
      title: 'Recherche Internationale',
      description: 'Recherche de biens exclusifs à l\'international'
    }
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6">
        {/* Hero */}
        <header className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h1 className="text-5xl font-inter uppercase text-deep-green mb-4">Nos Prestations</h1>
            <p className="text-lg font-didot text-gray-700 max-w-3xl leading-relaxed">
              Découvrez l'étendue de notre expertise et nos services sur mesure, conçus pour
              répondre aux attentes les plus exigeantes du marché immobilier de prestige.
            </p>
            <div className="mt-6 flex gap-4">
              <Link to="/contact" className="inline-flex items-center gap-3 bg-deep-green text-ivory px-6 py-3 rounded-lg shadow-lg hover:bg-gold hover:text-deep-green transition-colors">
                Prendre rendez-vous
              </Link>
              <Link to="/agency" className="inline-flex items-center gap-3 border-2 border-deep-green text-deep-green px-6 py-3 rounded-lg hover:bg-deep-green hover:text-ivory transition-colors">
                Rencontrer l'équipe
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            {/* Decorative illustration: subtle skyline/svg to match brand */}
            <svg className="w-72 h-48" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#f8e8d2" />
                  <stop offset="100%" stopColor="#fff" />
                </linearGradient>
              </defs>
              <rect width="600" height="400" rx="24" fill="url(#g1)" />
              <g opacity="0.9">
                <circle cx="110" cy="220" r="36" fill="#fde68a" />
                <rect x="220" y="140" width="44" height="120" rx="8" fill="#c7f9cc" />
                <rect x="280" y="100" width="70" height="160" rx="10" fill="#c7f9cc" />
                <rect x="370" y="160" width="38" height="100" rx="8" fill="#d1f7f3" />
              </g>
            </svg>
          </div>
        </header>

        {/* Services grid */}
        <section className="mb-14">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-8">Services Principaux</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainServices.map((service, idx) => (
              <motion.article key={idx} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 200 }} className="bg-white rounded-2xl shadow-lg p-8 overflow-hidden">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl" style={{background: 'linear-gradient(135deg,#fbe7c3,#e6f9f0)'}}>
                    {(() => {
                      const Icon = service.icon as any;
                      return <Icon className="w-8 h-8 text-gold" aria-hidden />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-inter uppercase text-deep-green mb-2">{service.title}</h3>
                    <p className="font-didot text-gray-600 mb-4 text-sm md:text-base">{service.description}</p>
                    <ul className="grid grid-cols-1 gap-2 text-sm text-gray-700 mb-4">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-gold rounded-full shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2">
                      <Link to={service.link} className="inline-flex items-center gap-2 text-gold hover:text-deep-green font-inter uppercase text-sm tracking-wide">
                        Découvrir
                        <span className="transform transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="mb-14">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-8">Services Complémentaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((s, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-sm p-5 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl" style={{background: 'linear-gradient(135deg,#fff7ed,#e8fdf5)'}}>
                  {(() => { const Icon = s.icon as any; return <Icon className="w-6 h-6 text-gold" aria-hidden /> })()}
                </div>
                <h3 className="font-inter uppercase text-deep-green text-sm">{s.title}</h3>
                <p className="font-didot text-gray-600 text-sm">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-14">
          <div className="bg-deep-green text-ivory rounded-2xl p-10">
            <h2 className="text-3xl font-inter uppercase text-center mb-8">Notre Processus d'Accompagnement</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[{ step: '01', title: 'Consultation', description: 'Analyse de vos besoins et objectifs' }, { step: '02', title: 'Recherche', description: 'Sélection de biens correspondant à vos critères' }, { step: '03', title: 'Présentation', description: 'Visites et analyses détaillées' }, { step: '04', title: 'Finalisation', description: 'Accompagnement jusqu\'à la signature' }].map((item, k) => (
                <div key={k} className="text-center p-4">
                  <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <span className="font-inter text-deep-green">{item.step}</span>
                  </div>
                  <h3 className="font-inter uppercase text-ivory mb-2">{item.title}</h3>
                  <p className="font-didot text-ivory text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-inter uppercase text-deep-green mb-4">Prêt à concrétiser votre projet ?</h2>
          <p className="text-lg font-didot text-gray-700 mb-6 max-w-2xl mx-auto">Rencontrons-nous pour discuter de vos ambitions et découvrir comment nous pouvons vous accompagner vers l'excellence.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-gold text-deep-green px-8 py-3 font-inter uppercase tracking-wide rounded-lg shadow-md hover:shadow-xl transition-all">Prendre rendez-vous</Link>
            <Link to="/agency" className="border-2 border-deep-green text-deep-green px-8 py-3 font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-colors rounded-lg">Rencontrer l'équipe</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;