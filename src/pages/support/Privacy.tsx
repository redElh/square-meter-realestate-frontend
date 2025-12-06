// src/pages/Privacy.tsx
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-inter uppercase text-deep-green mb-4">
            Politique de Confidentialité
          </h1>
          <p className="font-didot text-gray-600">
            Dernière mise à jour : 15 janvier 2024
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                1. Introduction
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                Chez Square Meter, la confidentialité de nos clients est au cœur de nos préoccupations. 
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons 
                vos informations personnelles.
              </p>
            </section>

            {/* Data Collection */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                2. Informations Collectées
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                Nous collectons les informations suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 font-didot text-gray-700">
                <li>Informations d'identification (nom, prénom, email, téléphone)</li>
                <li>Informations professionnelles (société, poste)</li>
                <li>Préférences immobilières (budget, localisation, type de bien)</li>
                <li>Données de navigation et d'utilisation de notre plateforme</li>
                <li>Communications et échanges avec notre équipe</li>
              </ul>
            </section>

            {/* Usage */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                3. Utilisation des Informations
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                Vos informations sont utilisées pour :
              </p>
              <ul className="list-disc list-inside space-y-2 font-didot text-gray-700">
                <li>Vous proposer des propriétés correspondant à vos critères</li>
                <li>Personnaliser votre expérience sur notre plateforme</li>
                <li>Vous envoyer des communications relatives à vos demandes</li>
                <li>Améliorer nos services et votre satisfaction</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </section>

            {/* Confidentiality */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                4. Confidentialité et Discrétion
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                Conformément à notre engagement d'excellence et de discrétion :
              </p>
              <ul className="list-disc list-inside space-y-2 font-didot text-gray-700">
                <li>Vos informations ne sont jamais partagées sans votre consentement explicite</li>
                <li>Les propriétés confidentielles sont présentées sous stricte anonymat</li>
                <li>Seuls les conseillers directement impliqués dans votre projet ont accès à vos informations</li>
                <li>Nous utilisons des systèmes de sécurité de niveau bancaire</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                5. Conservation des Données
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                Nous conservons vos informations pendant la durée nécessaire à la réalisation 
                des finalités pour lesquelles elles sont collectées, et conformément aux 
                obligations légales.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                6. Vos Droits
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 font-didot text-gray-700">
                <li>Droit d'accès à vos informations personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                7. Contact
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                Pour toute question concernant cette politique de confidentialité 
                ou pour exercer vos droits, contactez notre Délégué à la Protection des Données :
              </p>
              <div className="bg-ivory p-4 rounded-lg">
                <p className="font-didot text-gray-700">
                  <strong>Email :</strong> dpo@squaremeter.com<br/>
                  <strong>Téléphone :</strong> +33 1 23 45 67 89<br/>
                  <strong>Adresse :</strong> 123 Avenue de Luxe, 75008 Paris
                </p>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                8. Modifications
              </h2>
              <p className="font-didot text-gray-700">
                Nous nous réservons le droit de modifier cette politique de confidentialité. 
                Les changements significatifs seront notifiés par email ou via notre plateforme.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;