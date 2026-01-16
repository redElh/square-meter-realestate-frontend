// src/pages/support/Terms.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  BuildingOffice2Icon,
  ScaleIcon,
  LockClosedIcon,
  BellAlertIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Terms: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    'Consultation de propriétés immobilières de prestige',
    'Mise en relation avec des conseillers spécialisés',
    'Services d\'estimation et de valorisation',
    'Accompagnement dans les transactions immobilières',
    'Services de gestion et conciergerie'
  ];

  const confidentialityCommitments = [
    'Les informations personnelles des Utilisateurs',
    'Les propriétés présentées en sélection confidentielle',
    'Les négociations et transactions en cours',
    'L\'identité des propriétaires et acquéreurs'
  ];

  const keyArticles = [
    {
      icon: DocumentTextIcon,
      article: 'Article 1',
      title: 'Objet',
      description: 'Les présentes conditions générales d\'utilisation (CGU) ont pour objet l\'encadrement juridique des modalités de mise à disposition des services du site Square Meter et leur utilisation par l\'Utilisateur.'
    },
    {
      icon: BuildingOffice2Icon,
      article: 'Article 2',
      title: 'Services Proposés',
      description: 'Square Meter propose des services premium d\'accompagnement dans vos projets immobiliers de prestige, incluant la consultation, l\'estimation, et la gestion de propriétés d\'exception.'
    },
    {
      icon: LockClosedIcon,
      article: 'Article 3',
      title: 'Engagement de Discrétion',
      description: 'Square Meter s\'engage à respecter une stricte confidentialité concernant vos informations, les propriétés présentées, et l\'ensemble des transactions en cours.'
    },
    {
      icon: UserCircleIcon,
      article: 'Article 4',
      title: 'Responsabilités',
      description: 'Square Meter met en œuvre tous les moyens raisonnables pour assurer l\'exactitude des informations publiées. L\'Utilisateur s\'engage à fournir des informations exactes et à utiliser les services de manière conforme.'
    },
    {
      icon: ShieldCheckIcon,
      article: 'Article 5',
      title: 'Propriété Intellectuelle',
      description: 'Tous les éléments du site Square Meter (textes, images, photographies, logos) sont protégés par le droit d\'auteur. Toute reproduction non autorisée est interdite.'
    },
    {
      icon: ScaleIcon,
      article: 'Article 9',
      title: 'Droit Applicable',
      description: 'Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux de Paris seront seuls compétents.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark Gradient */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-16 sm:py-20 lg:py-24 -mt-24 sm:-mt-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center pt-24 sm:pt-32">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm border-2 border-white/30 mb-6 sm:mb-8">
              <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
              Conditions Générales d'Utilisation
            </h1>
            <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              Bienvenue chez Square Meter. En utilisant notre plateforme, vous acceptez les présentes 
              conditions générales d'utilisation qui encadrent nos services premium.
            </p>
            <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2 text-white/70 text-sm sm:text-base">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Dernière mise à jour : 16 janvier 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Key Articles Grid */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-light text-gray-900 mb-4">
              Articles Principaux
            </h2>
            <div className="h-1 bg-[#023927] w-24 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {keyArticles.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border-2 border-gray-200 p-6 group hover:border-[#023927] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#023927] to-[#0a4d3a] flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-[#023927] font-medium uppercase tracking-wider mb-1">
                        {item.article}
                      </div>
                      <h3 className="font-inter font-medium text-gray-900 text-lg">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="font-inter text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="bg-gradient-to-br from-[#023927] to-[#0a4d3a] p-8 sm:p-10 text-white">
              <BuildingOffice2Icon className="w-12 h-12 mb-6 opacity-80" />
              <h2 className="text-2xl sm:text-3xl font-inter font-light mb-6">
                Services Proposés
              </h2>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-white/70 text-lg mt-1">•</span>
                    <p className="text-white/90 text-sm sm:text-base">{service}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 sm:p-10 border-l-4 border-[#023927]">
              <LockClosedIcon className="w-12 h-12 text-[#023927] mb-6" />
              <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-6">
                Engagement de Discrétion
              </h2>
              <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                Square Meter s'engage à respecter une stricte confidentialité concernant :
              </p>
              <div className="space-y-3">
                {confidentialityCommitments.map((commitment, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white border-l-2 border-[#023927]">
                    <ShieldCheckIcon className="w-5 h-5 text-[#023927] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{commitment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="bg-white border-2 border-gray-200 p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-8 flex items-center">
              <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#023927] mr-4" />
              Responsabilités
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-inter font-medium text-[#023927] text-lg mb-4">
                  Responsabilités de Square Meter
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Square Meter met en œuvre tous les moyens raisonnables pour assurer l'exactitude 
                  des informations publiées. Cependant, l'Utilisateur reconnaît que ces informations 
                  peuvent contenir des imprécisions. Square Meter ne pourra être tenu responsable 
                  des dommages indirects résultant de l'utilisation du site.
                </p>
              </div>
              
              <div>
                <h3 className="font-inter font-medium text-[#023927] text-lg mb-4">
                  Responsabilités de l'Utilisateur
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  L'Utilisateur s'engage à fournir des informations exactes et complètes lors 
                  de son inscription et à les maintenir à jour. Il s'engage également à utiliser 
                  les services de manière légale, conforme à l'éthique et respectueuse des présentes CGU.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Terms */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 hover:border-[#023927] transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#023927] flex items-center justify-center text-white font-bold flex-shrink-0">
                  6
                </div>
                <div>
                  <h3 className="font-inter font-medium text-gray-900 text-lg mb-3">
                    Article 6 - Données Personnelles
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Le traitement des données personnelles est régi par notre Politique de Confidentialité, 
                    qui constitue une partie intégrante des présentes CGU. Nous nous engageons à protéger 
                    vos données conformément au RGPD et aux lois applicables.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 hover:border-[#023927] transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#023927] flex items-center justify-center text-white font-bold flex-shrink-0">
                  7
                </div>
                <div>
                  <h3 className="font-inter font-medium text-gray-900 text-lg mb-3">
                    Article 7 - Limitations de Responsabilité
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    La responsabilité de Square Meter ne saurait être engagée en cas de force majeure 
                    ou de fait imprévisible et irrésistible d'un tiers. Square Meter ne garantit pas 
                    la disponibilité permanente du site et se réserve le droit d'interrompre le service 
                    pour maintenance.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 hover:border-[#023927] transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#023927] flex items-center justify-center text-white font-bold flex-shrink-0">
                  8
                </div>
                <div>
                  <h3 className="font-inter font-medium text-gray-900 text-lg mb-3 flex items-center">
                    Article 8 - Modifications des CGU
                    <BellAlertIcon className="w-5 h-5 ml-2 text-[#023927]" />
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Square Meter se réserve le droit de modifier les présentes CGU à tout moment. 
                    Les Utilisateurs seront informés des modifications significatives par email ou 
                    via la plateforme. L'utilisation continue du service après notification vaut 
                    acceptation des nouvelles conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-8 sm:p-12 text-white text-center">
            <ScaleIcon className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl sm:text-3xl font-inter font-light mb-4">
              Questions sur nos Conditions ?
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Notre équipe juridique est à votre disposition pour répondre à toutes 
              vos questions concernant nos conditions générales d'utilisation.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 border-2 border-white/30 inline-block">
              <p className="text-sm text-white/70 mb-2">Contactez notre service juridique</p>
              <p className="text-lg font-medium">Essaouira@m2squaremeter.com</p>
              <p className="text-base mt-2">+212 7 00 00 06 44</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;