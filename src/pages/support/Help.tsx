// src/pages/Help.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  InformationCircleIcon,
  HomeModernIcon,
  BanknotesIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const Help: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>('general');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      id: 'general',
      title: 'Informations Générales',
      icon: InformationCircleIcon,
      items: [
        {
          id: 'general-1',
          question: 'Quelle est la particularité de Square Meter ?',
          answer: 'Square Meter se spécialise dans l\'immobilier de prestige avec une approche discrète et personnalisée. Nous offrons un accès à des propriétés exclusives, souvent non listées publiquement, et un service sur mesure pour une clientèle exigeante.'
        },
        {
          id: 'general-2',
          question: 'Comment accéder à la sélection confidentielle ?',
          answer: 'L\'accès à notre sélection confidentielle nécessite une demande via notre formulaire dédié. Notre équipe évalue chaque demande sous 24h pour préserver la discrétion de nos clients et la confidentialité des propriétés.'
        },
        {
          id: 'general-3',
          question: 'Quelles zones géographiques couvrez-vous ?',
          answer: 'Nous couvrons les marchés immobiliers les plus prestigieux de France (Paris, Côte d\'Azur, Alpes, Provence) et disposons d\'un réseau international pour les transactions à l\'étranger.'
        }
      ]
    },
    {
      id: 'buying',
      title: 'Acheter avec Square Meter',
      icon: HomeModernIcon,
      items: [
        {
          id: 'buying-1',
          question: 'Comment débuter une recherche de bien ?',
          answer: 'Commencez par explorer nos propriétés en ligne, puis contactez un conseiller pour une consultation personnalisée. Nous analyserons vos besoins, votre budget et vous présenterons des biens correspondant à vos critères.'
        },
        {
          id: 'buying-2',
          question: 'Proposez-vous des visites virtuelles ?',
          answer: 'Oui, pour les clients internationaux ou dans l\'impossibilité de se déplacer, nous organisons des visites virtuelles complètes avec nos conseillers.'
        },
        {
          id: 'buying-3',
          question: 'Quels sont vos honoraires pour l\'achat ?',
          answer: 'Nos honoraires sont transparents et communiqués dès le début du processus. Ils varient selon le type de bien et la complexité de la transaction.'
        }
      ]
    },
    {
      id: 'selling',
      title: 'Vendre avec Square Meter',
      icon: BanknotesIcon,
      items: [
        {
          id: 'selling-1',
          question: 'Comment obtenir une estimation de mon bien ?',
          answer: 'Utilisez notre formulaire d\'estimation en ligne ou contactez directement un conseiller. Nous réaliserons une analyse comparative du marché et une visite pour une estimation précise.'
        },
        {
          id: 'selling-2',
          question: 'Combien de temps dure généralement une vente ?',
          answer: 'Le délai moyen varie de 2 à 6 mois selon le marché et le type de bien. Notre réseau d\'acquéreurs qualifiés nous permet souvent d\'accélérer le processus.'
        },
        {
          id: 'selling-3',
          question: 'Proposez-vous la vente confidentielle ?',
          answer: 'Absolument. Nous maîtrisons parfaitement les processus de vente discrète pour préserver l\'intimité des propriétaires et la valeur des biens.'
        }
      ]
    },
    {
      id: 'services',
      title: 'Services Additionnels',
      icon: SparklesIcon,
      items: [
        {
          id: 'services-1',
          question: 'Quels services conciergerie proposez-vous ?',
          answer: 'Notre service conciergerie inclut la gestion des prestataires, l\'entretien régulier, la mise en place de services sur mesure (chef à domicile, sécurité, etc.) et la gestion des locations saisonnières.'
        },
        {
          id: 'services-2',
          question: 'Proposez-vous des services de rénovation ?',
          answer: 'Oui, nous travaillons avec des architectes et artisans d\'exception pour la rénovation et la décoration de propriétés de prestige.'
        },
        {
          id: 'services-3',
          question: 'Comment fonctionne la gestion locative ?',
          answer: 'Nous gérons intégralement votre bien locatif : sélection des locataires, gestion administrative, entretien, et optimisation des revenus.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-inter uppercase text-deep-green mb-4">
            Centre d'Aide
          </h1>
          <p className="text-xl font-didot text-gray-700 max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions ou contactez notre équipe 
            pour un accompagnement personnalisé.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-inter uppercase text-deep-green mb-4 text-center">
              Comment pouvons-nous vous aider ?
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une question..."
                className="w-full px-6 py-4 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold">
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon = category.icon as React.ElementType;
                    return (
                      <span className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-deep-green" />
                      </span>
                    );
                  })()}
                  <h3 className="text-xl font-inter uppercase text-deep-green">
                    {category.title}
                  </h3>
                </div>
                <span className="text-gold transform transition-transform">
                  {openCategory === category.id ? '▲' : '▼'}
                </span>
              </button>

              {openCategory === category.id && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex justify-between items-center py-4 text-left hover:text-gold transition-colors"
                        >
                          <span className="font-didot text-gray-700 font-medium">
                            {item.question}
                          </span>
                          <span className="text-gold ml-4 flex-shrink-0">
                            {openItems.has(item.id) ? '−' : '+'}
                          </span>
                        </button>
                        {openItems.has(item.id) && (
                          <div className="pb-4">
                            <p className="font-didot text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-deep-green text-ivory rounded-2xl p-8 mt-12 text-center">
          <h3 className="text-2xl font-inter uppercase mb-4">
            Vous ne trouvez pas la réponse ?
          </h3>
          <p className="font-didot text-gold mb-6 max-w-2xl mx-auto">
            Notre équipe d'experts est à votre disposition pour répondre 
            à toutes vos questions et vous accompagner dans votre projet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-gold text-deep-green px-8 py-3 font-inter uppercase tracking-wide hover:bg-ivory transition-colors rounded-lg"
            >
              Nous contacter
            </Link>
            <a
              href="tel:+33123456789"
              className="border-2 border-gold text-gold px-8 py-3 font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-colors rounded-lg"
            >
              Appeler maintenant
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;