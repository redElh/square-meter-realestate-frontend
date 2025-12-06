import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CubeIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  SunIcon,
  MoonIcon,
  ArrowsPointingOutIcon,
  VideoCameraIcon,
  MapIcon,
  PaintBrushIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

interface ImmersiveViewerProps {
  propertyId?: string;
  images?: string[];
}

type ViewMode = '3d' | '360' | 'ar' | 'drone' | 'floorplan' | 'staging';
type TimeOfDay = 'day' | 'night' | 'sunset';
type StagingStyle = 'modern' | 'classic' | 'minimalist' | 'luxury' | 'current';

const ImmersiveViewer: React.FC<ImmersiveViewerProps> = ({ 
  propertyId = '1',
  images = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
  ]
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [stagingStyle, setStagingStyle] = useState<StagingStyle>('current');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [rotation, setRotation] = useState(0);

  const viewModes = [
    { id: '3d' as ViewMode, name: 'Visite 3D', icon: CubeIcon, description: 'Navigation libre 360°' },
    { id: '360' as ViewMode, name: 'Vue 360°', icon: ArrowsPointingOutIcon, description: 'Panorama interactif' },
    { id: 'ar' as ViewMode, name: 'Réalité Augmentée', icon: DevicePhoneMobileIcon, description: 'Via smartphone' },
    { id: 'drone' as ViewMode, name: 'Vue Drone', icon: VideoCameraIcon, description: 'Vue aérienne' },
    { id: 'floorplan' as ViewMode, name: 'Plan 3D', icon: MapIcon, description: 'Maison de poupée' },
    { id: 'staging' as ViewMode, name: 'Virtual Staging', icon: PaintBrushIcon, description: 'Différents styles' }
  ];

  const stagingStyles = [
    { id: 'current' as StagingStyle, name: 'Actuel', color: 'gray' },
    { id: 'modern' as StagingStyle, name: 'Moderne', color: 'blue' },
    { id: 'classic' as StagingStyle, name: 'Classique', color: 'amber' },
    { id: 'minimalist' as StagingStyle, name: 'Minimaliste', color: 'slate' },
    { id: 'luxury' as StagingStyle, name: 'Luxe', color: 'purple' }
  ];

  const rotate360 = () => {
    setRotation(prev => prev + 90);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderViewContent = () => {
    switch (viewMode) {
      case '3d':
        return (
          <motion.div
            key="3d-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden"
          >
            <img
              src={images[currentImageIndex]}
              alt="3D View"
              className="w-full h-full object-cover"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            
            {/* 3D Navigation Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-32 h-32 border-4 border-white rounded-full"
              />
            </div>

            {/* Room Labels */}
            <div className="absolute top-20 left-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-semibold">📍 Salon Principal</p>
              <p className="text-xs text-gray-600">45 m²</p>
            </div>

            {/* Hotspots */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center cursor-pointer shadow-xl"
              whileHover={{ scale: 1.3 }}
            >
              <EyeIcon className="w-5 h-5 text-white" />
            </motion.div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentImageIndex === 0}
                className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-medium hover:bg-white transition-all disabled:opacity-50 shadow-lg"
              >
                ← Précédent
              </button>
              <button
                onClick={rotate360}
                className="bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition-all shadow-lg"
              >
                🔄 Tourner
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => Math.min(images.length - 1, prev + 1))}
                disabled={currentImageIndex === images.length - 1}
                className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-medium hover:bg-white transition-all disabled:opacity-50 shadow-lg"
              >
                Suivant →
              </button>
            </div>
          </motion.div>
        );

      case '360':
        return (
          <motion.div
            key="360-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full bg-black rounded-2xl overflow-hidden"
          >
            <motion.img
              src={images[currentImageIndex]}
              alt="360 View"
              className="w-full h-full object-cover cursor-move"
              drag
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              whileDrag={{ scale: 1.05 }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
              >
                <ArrowsPointingOutIcon className="w-16 h-16 mx-auto opacity-50" />
              </motion.div>
              <p className="mt-4 text-sm opacity-75">Glisse pour explorer 360°</p>
            </div>
          </motion.div>
        );

      case 'ar':
        return (
          <motion.div
            key="ar-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl overflow-hidden flex items-center justify-center"
          >
            <div className="text-center text-white p-12">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-8"
              >
                <DevicePhoneMobileIcon className="w-32 h-32 mx-auto" />
              </motion.div>
              <h3 className="text-3xl font-bold mb-4">Réalité Augmentée</h3>
              <p className="text-lg mb-8 opacity-90">
                Scanne ce QR code avec ton smartphone pour voir le bien en AR
              </p>
              <div className="bg-white p-8 rounded-2xl inline-block">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <CameraIcon className="w-16 h-16 text-gray-400" />
                  <p className="absolute text-sm text-gray-600 mt-24">QR Code AR</p>
                </div>
              </div>
              <div className="mt-8 space-y-3 text-sm opacity-75">
                <p>✓ Visualise le bien dans ton espace</p>
                <p>✓ Change les meubles virtuellement</p>
                <p>✓ Prends des mesures précises</p>
              </div>
            </div>
          </motion.div>
        );

      case 'drone':
        return (
          <motion.div
            key="drone-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full bg-sky-900 rounded-2xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"
              alt="Drone View"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
            
            {/* Drone UI Overlay */}
            <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg">
              <p className="text-xs mb-2">🚁 VUE DRONE</p>
              <p className="font-mono text-sm">ALT: 45m</p>
              <p className="font-mono text-sm">DIST: 120m</p>
            </div>

            <div className="absolute top-6 right-6 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              ● REC
            </div>

            {/* Map Overlay */}
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-xl">
              <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                <MapIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-xs text-center mt-2">Carte satellite</p>
            </div>

            {/* Info Box */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-sm">
              <h4 className="font-bold mb-2">Environnement</h4>
              <ul className="text-sm space-y-1">
                <li>🌳 Parc à 200m</li>
                <li>🏫 École à 500m</li>
                <li>🛒 Commerces à 300m</li>
                <li>🚇 Métro à 400m</li>
              </ul>
            </div>
          </motion.div>
        );

      case 'floorplan':
        return (
          <motion.div
            key="floorplan-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center p-8"
          >
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full">
              <h3 className="text-2xl font-bold mb-6 text-center">Plan 3D Interactif</h3>
              
              {/* Simplified 3D Floor Plan */}
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border-2 border-gray-300">
                <div className="grid grid-cols-3 gap-4">
                  {/* Room blocks */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-amber-100 p-6 rounded-lg border-2 border-amber-300 cursor-pointer"
                  >
                    <p className="font-bold text-sm">Salon</p>
                    <p className="text-xs text-gray-600">35 m²</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-100 p-6 rounded-lg border-2 border-blue-300 cursor-pointer"
                  >
                    <p className="font-bold text-sm">Cuisine</p>
                    <p className="text-xs text-gray-600">18 m²</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-green-100 p-6 rounded-lg border-2 border-green-300 cursor-pointer"
                  >
                    <p className="font-bold text-sm">Chambre 1</p>
                    <p className="text-xs text-gray-600">22 m²</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-green-100 p-6 rounded-lg border-2 border-green-300 cursor-pointer"
                  >
                    <p className="font-bold text-sm">Chambre 2</p>
                    <p className="text-xs text-gray-600">20 m²</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-purple-100 p-6 rounded-lg border-2 border-purple-300 cursor-pointer"
                  >
                    <p className="font-bold text-sm">SDB</p>
                    <p className="text-xs text-gray-600">8 m²</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-pink-100 p-6 rounded-lg border-2 border-pink-300 cursor-pointer"
                  >
                    <p className="font-bold text-sm">Terrasse</p>
                    <p className="text-xs text-gray-600">25 m²</p>
                  </motion.div>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <div className="text-sm text-gray-600">
                  <p className="font-bold mb-2">Légende:</p>
                  <div className="space-y-1">
                    <p>🟨 Pièces de vie</p>
                    <p>🟦 Cuisine</p>
                    <p>🟩 Chambres</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'staging':
        return (
          <motion.div
            key="staging-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full rounded-2xl overflow-hidden"
          >
            <motion.img
              key={stagingStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={images[currentImageIndex]}
              alt={`${stagingStyle} staging`}
              className="w-full h-full object-cover"
              style={{
                filter: 
                  stagingStyle === 'modern' ? 'saturate(1.3) contrast(1.1)' :
                  stagingStyle === 'classic' ? 'sepia(0.3) saturate(1.2)' :
                  stagingStyle === 'minimalist' ? 'grayscale(0.2) brightness(1.1)' :
                  stagingStyle === 'luxury' ? 'saturate(1.4) contrast(1.2) brightness(1.05)' :
                  'none'
              }}
            />

            {/* Staging Style Selector */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl">
              <p className="text-sm font-semibold mb-3 text-center">🎨 Choisir un style</p>
              <div className="flex gap-2">
                {stagingStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setStagingStyle(style.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      stagingStyle === style.id
                        ? `bg-${style.color}-600 text-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Tag */}
            <div className="absolute top-6 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-bold">✨ Virtual Staging IA</p>
              <p className="text-xs opacity-90">Visualise différentes ambiances</p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Expérience Immersive 360°
        </h1>
        <p className="text-gray-600">
          Explore ce bien comme si tu y étais avec nos technologies de pointe
        </p>
      </div>

      {/* View Mode Selector */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-6 gap-3">
        {viewModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(mode.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                viewMode === mode.id
                  ? 'border-amber-600 bg-amber-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-amber-300'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${
                viewMode === mode.id ? 'text-amber-600' : 'text-gray-600'
              }`} />
              <p className={`text-xs font-semibold mb-1 ${
                viewMode === mode.id ? 'text-amber-600' : 'text-gray-800'
              }`}>
                {mode.name}
              </p>
              <p className="text-xs text-gray-500">{mode.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Main Viewer */}
      <motion.div
        layout
        className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'
        }`}
      >
        {/* Controls Bar */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Time of Day */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimeOfDay('day')}
                      className={`p-2 rounded-lg transition-all ${
                        timeOfDay === 'day' ? 'bg-yellow-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <SunIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setTimeOfDay('sunset')}
                      className={`p-2 rounded-lg transition-all ${
                        timeOfDay === 'sunset' ? 'bg-orange-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      🌅
                    </button>
                    <button
                      onClick={() => setTimeOfDay('night')}
                      className={`p-2 rounded-lg transition-all ${
                        timeOfDay === 'night' ? 'bg-indigo-900 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <MoonIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
                  >
                    <ArrowsPointingOutIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowControls(false)}
                    className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Content */}
        <div className="w-full h-full">
          <AnimatePresence mode="wait">
            {renderViewContent()}
          </AnimatePresence>
        </div>

        {/* Show Controls Button */}
        {!showControls && (
          <button
            onClick={() => setShowControls(true)}
            className="absolute top-4 right-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-10"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        )}
      </motion.div>

      {/* Features Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <CubeIcon className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">Navigation 3D Fluide</h3>
          <p className="text-sm text-blue-700">
            Explore chaque pièce librement avec une qualité photo-réaliste
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <DevicePhoneMobileIcon className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-purple-900 mb-2">Réalité Augmentée</h3>
          <p className="text-sm text-purple-700">
            Visualise le bien dans ton propre espace via smartphone
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
          <PaintBrushIcon className="w-8 h-8 text-amber-600 mb-3" />
          <h3 className="font-bold text-amber-900 mb-2">Virtual Staging IA</h3>
          <p className="text-sm text-amber-700">
            Découvre différents styles de déco générés par l'IA
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveViewer;
