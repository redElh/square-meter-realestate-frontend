// src/pages/Careers.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  GiftIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

const Careers: React.FC = () => {
  const openPositions = [
    {
      id: 1,
      title: 'Conseiller Immobilier Prestige',
      location: 'Paris',
      type: 'CDI',
      department: 'Ventes',
      description: 'Rejoignez notre équipe de conseillers experts dans l\'immobilier de prestige parisien.',
      requirements: ['5+ ans d\'expérience en immobilier haut de gamme', 'Réseau de clients HNWI', 'Bilingue français/anglais']
    },
    {
      id: 2,
      title: 'Responsable Marché Côte d\'Azur',
      location: 'Saint-Tropez',
      type: 'CDI',
      department: 'Développement',
      description: 'Développez notre présence sur la Côte d\'Azur et managez notre portefeuille de villas exclusives.',
      requirements: ['Expérience en gestion de biens de prestige', 'Connaissance du marché azuréen', 'Leadership et management']
    },
    {
      id: 3,
      title: 'Spécialiste Investissement International',
      location: 'Paris/Londres',
      type: 'CDI',
      department: 'Investissement',
      description: 'Analysez et développez nos opportunités d\'investissement à l\'international.',
      requirements: ['Background en finance/analyse de marchés', 'Expérience internationale', 'Maîtrise de 3 langues']
    }
  ];

  const benefits = [
    { icon: BanknotesIcon, title: 'Rémunération attractive', description: 'Package compétitif avec intéressement aux transactions' },
    { icon: RocketLaunchIcon, title: 'Évolution rapide', description: 'Plan de carrière et formations d\'excellence' },
    { icon: GlobeAltIcon, title: 'Réseau international', description: 'Travail sur des marchés prestigieux worldwide' },
    { icon: BuildingOffice2Icon, title: 'Environnement d\'exception', description: 'Bureaux premium et outils haut de gamme' },
    { icon: GiftIcon, title: 'Avantages sociaux', description: 'Mutuelle premium, véhicule de fonction, etc.' },
    { icon: BoltIcon, title: 'Projets stimulants', description: 'Accompagnement de clients prestigieux' }
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-inter uppercase text-deep-green mb-6">
            Carrières
          </h1>
          <p className="text-xl font-didot text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Rejoignez une équipe d'exception et participez à la redéfinition 
            des standards de l'immobilier de prestige.
          </p>
        </div>

        {/* Why Join Us */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-inter uppercase text-deep-green mb-6">
                Pourquoi Rejoindre Square Meter ?
              </h2>
              <p className="font-didot text-gray-700 mb-6 leading-relaxed">
                Chez Square Meter, nous croyons que notre plus grande force réside dans notre équipe. 
                Nous recherchons des talents exceptionnels partageant notre passion pour l'excellence 
                et notre engagement envers un service d'exception.
              </p>
              <p className="font-didot text-gray-700 leading-relaxed">
                Rejoindre Square Meter, c'est intégrer une famille professionnelle où l'innovation, 
                la discrétion et l'expertise sont au cœur de notre culture d'entreprise.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="p-6 border border-gold rounded-lg">
                  <div className="text-3xl font-inter text-deep-green mb-2">50+</div>
                  <div className="font-didot text-gray-600">Collaborateurs</div>
                </div>
                <div className="p-6 border border-gold rounded-lg">
                  <div className="text-3xl font-inter text-deep-green mb-2">15</div>
                  <div className="font-didot text-gray-600">Nationalités</div>
                </div>
                <div className="p-6 border border-gold rounded-lg">
                  <div className="text-3xl font-inter text-deep-green mb-2">95%</div>
                  <div className="font-didot text-gray-600">Rétention</div>
                </div>
                <div className="p-6 border border-gold rounded-lg">
                  <div className="text-3xl font-inter text-deep-green mb-2">4.8/5</div>
                  <div className="font-didot text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-12">
            Nos Avantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon as React.ElementType;
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
                    {benefit.title}
                  </h3>
                  <p className="font-didot text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-20">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-12">
            Postes Ouverts
          </h2>
          <div className="space-y-6">
            {openPositions.map((position) => (
              <div key={position.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-inter uppercase text-deep-green mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gold bg-opacity-20 text-deep-green px-3 py-1 rounded-full text-sm font-inter">
                        {position.location}
                      </span>
                      <span className="bg-deep-green bg-opacity-10 text-deep-green px-3 py-1 rounded-full text-sm font-inter">
                        {position.type}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-inter">
                        {position.department}
                      </span>
                    </div>
                    <p className="font-didot text-gray-600 mb-4">
                      {position.description}
                    </p>
                  </div>
                  <Link
                    to={`/contact?type=careers&position=${position.id}`}
                    className="bg-deep-green text-ivory px-6 py-3 font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-colors rounded-lg whitespace-nowrap"
                  >
                    Postuler
                  </Link>
                </div>
                <div>
                  <h4 className="font-inter uppercase text-deep-green text-sm mb-3">
                    Profil Recherché :
                  </h4>
                  <ul className="space-y-2">
                    {position.requirements.map((requirement, idx) => (
                      <li key={idx} className="flex items-center font-didot text-gray-600 text-sm">
                        <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spontaneous Application */}
        <section className="bg-deep-green text-ivory rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-inter uppercase mb-6">
            Candidature Spontanée
          </h2>
          <p className="text-xl font-didot text-gold mb-8 max-w-2xl mx-auto leading-relaxed">
            Vous ne trouvez pas le poste qui vous correspond ? 
            Nous sommes toujours à la recherche de talents exceptionnels. 
            Envoyez-nous votre candidature et rejoignez notre réseau.
          </p>
          <Link
            to="/contact?type=careers"
            className="inline-block bg-gold text-deep-green px-8 py-4 font-inter uppercase tracking-wide hover:bg-ivory transition-colors rounded-lg"
          >
            Déposer sa candidature
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Careers;