// src/pages/Success.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const Success: React.FC = () => {
  const successStories = [
    {
      id: 1,
      client: 'Famille Laurent',
      project: 'Acquisition d\'une villa à Saint-Tropez',
      challenge: 'Recherche confidentielle dans un marché très fermé',
      solution: 'Accès à des propriétés non listées via notre réseau exclusif',
      result: 'Villa acquise 15% sous le prix marché, transaction discrète',
      image: '/success/laurent.jpg',
      quote: 'Square Meter a su comprendre nos attentes et nous ouvrir les portes d\'un marché habituellement inaccessible.'
    },
    {
      id: 2,
      client: 'Groupe International',
      project: 'Portefeuille d\'investissement Parisien',
      challenge: 'Diversification avec des actifs de prestige stables',
      solution: 'Sélection d\'appartements haussmanniens dans des emplacements stratégiques',
      result: 'Portefeuille de 8 biens générant 4.2% de rendement annuel',
      image: '/success/international-group.jpg',
      quote: 'L\'expertise marché de Square Meter nous a permis des acquisitions stratégiques avec une valorisation constante.'
    },
    {
      id: 3,
      client: 'Monsieur Dubois',
      project: 'Vente confidentielle d\'un domaine familial',
      challenge: 'Préserver l\'anonymat tout en maximisant la valorisation',
      solution: 'Processus de vente discrète avec présentation ciblée',
      result: 'Vente réalisée 3 mois avec une plus-value de 22%',
      image: '/success/dubois.jpg',
      quote: 'La discrétion et le professionnalisme de Square Meter ont dépassé nos attentes. Transaction parfaite.'
    }
  ];

  const stats = [
    { number: '50M€+', label: 'Volume de transactions' },
    { number: '98%', label: 'Clients satisfaits' },
    { number: '24', label: 'Heures de réponse moyenne' },
    { number: '15+', label: 'Années d\'expertise' }
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-inter uppercase text-deep-green mb-6">
            Nos Réussites
          </h1>
          <p className="text-xl font-didot text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Découvrez comment nous avons accompagné nos clients dans la réalisation 
            de leurs projets immobiliers les plus ambitieux.
          </p>
        </div>

        {/* Stats */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="text-4xl font-inter text-deep-green mb-2">{stat.number}</div>
                <div className="font-didot text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-20">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-12">
            Témoignages Clients
          </h2>
          <div className="space-y-12">
            {successStories.map((story, idx) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="aspect-video lg:aspect-square bg-gray-200"></div>
                  <div className="p-8 lg:p-12">
                    <div className="mb-6">
                      <h3 className="text-2xl font-inter uppercase text-deep-green mb-2">
                        {story.project}
                      </h3>
                      <p className="font-didot text-gold">{story.client}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-inter uppercase text-deep-green text-sm mb-2">
                          Le Défi
                        </h4>
                        <p className="font-didot text-gray-600">{story.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-inter uppercase text-deep-green text-sm mb-2">
                          Notre Solution
                        </h4>
                        <p className="font-didot text-gray-600">{story.solution}</p>
                      </div>
                      <div>
                        <h4 className="font-inter uppercase text-deep-green text-sm mb-2">
                          Le Résultat
                        </h4>
                        <p className="font-didot text-gray-600">{story.result}</p>
                      </div>
                    </div>

                    <blockquote className="border-l-4 border-gold pl-4 py-2">
                      <p className="font-didot text-gray-700 italic">
                        "{story.quote}"
                      </p>
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="mb-20">
          <h2 className="text-3xl font-inter uppercase text-deep-green text-center mb-12">
            Ce Que Disent Nos Clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sophie Martin',
                role: 'CEO, Groupe International',
                testimonial: 'Professionalisme exceptionnel et réseau impressionnant. Square Meter a transformé notre approche de l\'immobilier de prestige.',
                rating: 5
              },
              {
                name: 'Thomas Lefebvre',
                role: 'Collectionneur d\'art',
                testimonial: 'La discrétion et l\'expertise dont a fait preuve Square Meter pour la vente de notre propriété familiale étaient remarquables.',
                rating: 5
              },
              {
                name: 'Isabelle Moreau',
                role: 'Investisseur Privé',
                testimonial: 'Leur compréhension des marchés internationaux nous a permis des investissements stratégiques avec des retours excellents.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-gold" />
                  ))}
                </div>
                <p className="font-didot text-gray-600 mb-4 italic">
                  "{testimonial.testimonial}"
                </p>
                <div>
                  <div className="font-inter uppercase text-deep-green">{testimonial.name}</div>
                  <div className="font-didot text-gold text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-deep-green text-ivory rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-inter uppercase mb-6">
            Votre Prochaine Réussite Immobilière
          </h2>
          <p className="text-xl font-didot text-gold mb-8 max-w-2xl mx-auto leading-relaxed">
            Rejoignez nos clients satisfaits et confiez-nous la réalisation de votre projet immobilier. 
            L'excellence n'est pas un objectif, c'est notre standard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-gold text-deep-green px-8 py-4 font-inter uppercase tracking-wide hover:bg-ivory transition-colors rounded-lg"
            >
              Démarrer mon projet
            </Link>
            <Link
              to="/properties"
              className="border-2 border-gold text-gold px-8 py-4 font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-colors rounded-lg"
            >
              Découvrir nos biens
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Success;