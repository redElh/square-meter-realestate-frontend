// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center py-12">
      <div className="container mx-auto px-6 text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-9xl font-inter text-deep-green mb-4"
          >
            404
          </motion.div>
          <div className="mx-auto w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
            <HomeIcon className="w-9 h-9 text-deep-green" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-inter uppercase text-deep-green mb-6">
          Propriété Non Trouvée
        </h1>
        
        <p className="text-xl font-didot text-gray-700 mb-8 max-w-md mx-auto leading-relaxed">
          La page que vous recherchez semble avoir été déplacée ou n'existe plus. 
          Peut-être cherchiez-vous une de nos propriétés d'exception ?
        </p>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="bg-deep-green text-ivory px-8 py-4 font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-colors rounded-lg"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/properties"
            className="border-2 border-deep-green text-deep-green px-8 py-4 font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-colors rounded-lg"
          >
            Voir nos propriétés
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <h3 className="font-inter uppercase text-deep-green mb-4">
            Rechercher une propriété
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Localisation, type de bien..."
              className="flex-1 px-4 py-3 border border-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold font-didot"
            />
            <Link
              to="/properties"
              className="bg-gold text-deep-green px-6 py-3 font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-colors rounded-lg"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="font-didot text-gray-600 mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center text-gold hover:text-deep-green font-inter uppercase text-sm tracking-wide transition-colors"
          >
            Contactez notre équipe
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;