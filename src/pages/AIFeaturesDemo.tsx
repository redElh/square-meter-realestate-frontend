import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AISearchEngine from '../components/Search/AISearchEngine';
import ImmersiveViewer from '../components/Immersive/ImmersiveViewer';
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

type DemoSection = 'search' | 'immersive' | 'all';

const AIFeaturesDemo: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DemoSection>('all');

  const features = [
    {
      id: 'search' as DemoSection,
      title: 'Recherche IA Avancée',
      description: 'Recherche en langage naturel avec suggestions intelligentes',
      icon: MagnifyingGlassIcon,
      color: 'from-amber-500 to-orange-500',
      features: [
        'Langage naturel: "Appartement 3 pièces Nice vue mer 500k"',
        'Filtres intelligents auto-détectés',
        'Suggestions contextuelles',
        'Score de pertinence IA',
        'Résultats personnalisés'
      ]
    },
    {
      id: 'immersive' as DemoSection,
      title: 'Expérience Immersive',
      description: 'Visite 3D, 360°, réalité augmentée et virtual staging',
      icon: CubeIcon,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Visite virtuelle 3D interactive',
        'Vue 360° panoramique',
        'Réalité augmentée via smartphone',
        'Vue drone aérienne',
        'Virtual staging avec différents styles'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full mb-6">
            <SparklesIcon className="w-5 h-5" />
            <span className="font-semibold">Nouvelles Fonctionnalités IA</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            L'Immobilier du Futur
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvre nos technologies innovantes qui révolutionnent la recherche et la visite de biens immobiliers
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveSection(feature.id)}
                className={`bg-white rounded-2xl p-8 shadow-xl cursor-pointer transition-all ${
                  activeSection === feature.id ? 'ring-4 ring-amber-500' : ''
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <ChevronRightIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button className={`mt-6 w-full bg-gradient-to-r ${feature.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all`}>
                  Essayer maintenant
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Section Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === 'all'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Voir tout
          </button>
          <button
            onClick={() => setActiveSection('search')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === 'search'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Recherche IA
          </button>
          <button
            onClick={() => setActiveSection('immersive')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === 'immersive'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Expérience Immersive
          </button>
        </div>

        {/* Demo Sections */}
        <div className="space-y-12">
          {(activeSection === 'all' || activeSection === 'search') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl">
                  <MagnifyingGlassIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Démonstration - Recherche IA</h2>
                  <p className="text-gray-600">Essaie de chercher: "Appartement 3 chambres Nice vue mer piscine budget 600k"</p>
                </div>
              </div>
              <AISearchEngine />
            </motion.div>
          )}

          {(activeSection === 'all' || activeSection === 'immersive') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <CubeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Démonstration - Expérience Immersive</h2>
                  <p className="text-gray-600">Explore le bien en 3D, 360°, AR et plus encore</p>
                </div>
              </div>
              <ImmersiveViewer />
            </motion.div>
          )}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-blue-900 mb-2">Gain de temps</h3>
            <p className="text-sm text-blue-700">
              Trouve le bien idéal 10x plus vite avec notre IA intelligente
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-green-900 mb-2">Pertinence maximale</h3>
            <p className="text-sm text-green-700">
              Des résultats ultra-personnalisés selon tes critères exacts
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-bold text-purple-900 mb-2">Expérience immersive</h3>
            <p className="text-sm text-purple-700">
              Visite comme si tu y étais, depuis ton canapé
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Prêt à révolutionner ta recherche immobilière ?</h2>
          <p className="text-xl mb-8 opacity-90">
            L'assistant IA est disponible en bas à droite pour t'aider à tout moment ! 👋
          </p>
          <button className="bg-white text-amber-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
            Commencer maintenant
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AIFeaturesDemo;
