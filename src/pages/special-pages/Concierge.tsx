// src/pages/Concierge.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeModernIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

const Concierge: React.FC = () => {
  const conciergeServices = [
    {
      category: 'Services Résidentiels',
      icon: HomeModernIcon,
      services: [
        { name: 'Gestion des prestataires', description: 'Coordination de tous vos artisans et fournisseurs' },
        { name: 'Entretien régulier', description: 'Maintenance et nettoyage de prestige' },
        { name: 'Sécurité et surveillance', description: 'Systèmes de sécurité et gardiennage' },
        { name: 'Aménagement paysager', description: 'Entretien des jardins et espaces verts' }
      ]
    },
    {
      category: 'Services de Vie',
      icon: SparklesIcon,
      services: [
        { name: 'Chef à domicile', description: 'Services culinaires personnalisés' },
        { name: 'Service de majordome', description: 'Assistance personnelle au quotidien' },
        { name: 'Conciergerie hôtelière', description: 'Services 24h/24 pour vos invités' },
        { name: 'Organisation d\'événements', description: 'Réceptions et soirées privées' }
      ]
    },
    {
      category: 'Services de Voyage',
      icon: PaperAirplaneIcon,
      services: [
        { name: 'Réservations exclusives', description: 'Accès à des établissements confidentiels' },
        { name: 'Transport privé', description: 'Voitures avec chauffeur, jets privés' },
        { name: 'Planning de séjour', description: 'Itinéraires sur mesure' },
        { name: 'Assistance VIP', description: 'Services aéroport et transit' }
      ]
    },
    {
      category: 'Services Culturels',
      icon: BuildingLibraryIcon,
      services: [
        { name: 'Accès aux événements', description: 'Premières, galeries, expositions privées' },
        { name: 'Conseil en art', description: 'Acquisition et gestion de collections' },
        { name: 'Visites privées', description: 'Accès à des lieux habituellement fermés' },
        { name: 'Rencontres exclusives', description: 'Accès à des cercles privés' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-inter uppercase text-deep-green mb-6">
            Services Conciergerie
          </h1>
          <p className="text-xl font-didot text-gray-700 max-w-3xl mx-auto leading-relaxed">
            L'art de vivre Square Meter : des services sur mesure pour une expérience 
            d'exception, au quotidien comme lors de vos séjours.
          </p>
        </div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-lg p-12 mb-20 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-deep-green" />
            </div>
            <h2 className="text-3xl font-inter uppercase text-deep-green mb-6">
              L'Excellence au Quotidien
            </h2>
            <p className="font-didot text-gray-700 text-lg leading-relaxed mb-8">
              Notre service conciergerie incarne l'excellence Square Meter. 
              Nous anticipons vos besoins, simplifions votre quotidien et créons 
              des expériences uniques qui transcendent les standards du luxe.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-inter text-deep-green mb-2">24h/24</div>
                <div className="font-didot text-gray-600">Disponibilité</div>
              </div>
              <div>
                <div className="text-2xl font-inter text-deep-green mb-2">500+</div>
                <div className="font-didot text-gray-600">Prestataires certifiés</div>
              </div>
              <div>
                <div className="text-2xl font-inter text-deep-green mb-2">100%</div>
                <div className="font-didot text-gray-600">Satisfaction client</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Services Grid */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {conciergeServices.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  {(() => {
                    const Icon = category.icon as React.ElementType;
                    return (
                      <span className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-deep-green" />
                      </span>
                    );
                  })()}
                  <h3 className="text-2xl font-inter uppercase text-deep-green">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-b-0">
                      <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-inter uppercase text-deep-green text-sm mb-1">
                          {service.name}
                        </h4>
                        <p className="font-didot text-gray-600 text-sm">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-deep-green text-ivory rounded-2xl p-12 mb-20"
        >
          <h2 className="text-3xl font-inter uppercase text-center mb-12">
            Comment Ça Fonctionne ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', description: 'Analyse de vos besoins et attentes' },
              { step: '02', title: 'Personnalisation', description: 'Création de votre programme sur mesure' },
              { step: '03', title: 'Dédicace', description: 'Assignation d\'un concierge dédié' },
              { step: '04', title: 'Exécution', description: 'Mise en œuvre et suivi continu' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="text-center"
              >
                <div className="w-16 h-16 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-inter text-gold">{item.step}</span>
                </div>
                <h3 className="font-inter uppercase text-gold mb-3">{item.title}</h3>
                <p className="font-didot text-ivory text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-inter uppercase text-deep-green mb-6">
            Découvrez l'Art de Vivre Square Meter
          </h2>
          <p className="text-lg font-didot text-gray-700 mb-8 max-w-2xl mx-auto">
            Transformez votre quotidien avec nos services conciergerie sur mesure. 
            L'excellence n'attend pas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact?type=concierge"
              className="bg-deep-green text-ivory px-8 py-4 font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-colors rounded-lg"
            >
              Découvrir les forfaits
            </Link>
            <a
              href="tel:+33123456789"
              className="border-2 border-deep-green text-deep-green px-8 py-4 font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-colors rounded-lg"
            >
              Appeler un concierge
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Concierge;