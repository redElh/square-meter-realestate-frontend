// src/pages/Terms.tsx
import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-inter uppercase text-deep-green mb-4">
            Conditions Générales d'Utilisation
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
                Article 1 - Objet
              </h2>
              <p className="font-didot text-gray-700">
                Les présentes conditions générales d'utilisation (CGU) ont pour objet 
                l'encadrement juridique des modalités de mise à disposition des services 
                du site Square Meter et leur utilisation par l'Utilisateur.
              </p>
            </section>

            {/* Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                Article 2 - Services Proposés
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                Square Meter propose les services suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 font-didot text-gray-700">
                <li>Consultation de propriétés immobilières de prestige</li>
                <li>Mise en relation avec des conseillers spécialisés</li>
                <li>Services d'estimation et de valorisation</li>
                <li>Accompagnement dans les transactions immobilières</li>
                <li>Services de gestion et conciergerie</li>
              </ul>
            </section>

            {/* Engagement */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                Article 3 - Engagement de Discrétion
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                Square Meter s'engage à respecter une stricte confidentialité concernant :
              </p>
              <ul className="list-disc list-inside space-y-2 font-didot text-gray-700">
                <li>Les informations personnelles des Utilisateurs</li>
                <li>Les propriétés présentées en sélection confidentielle</li>
                <li>Les négociations et transactions en cours</li>
                <li>L'identité des propriétaires et acquéreurs</li>
              </ul>
            </section>

            {/* Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                Article 4 - Responsabilités
              </h2>
              <p className="font-didot text-gray-700 mb-4">
                <strong>4.1 Responsabilités de Square Meter</strong><br/>
                Square Meter met en œuvre tous les moyens raisonnables pour assurer 
                l'exactitude des informations publiées. Cependant, l'Utilisateur 
                reconnaît que ces informations peuvent contenir des imprécisions.
              </p>
              <p className="font-didot text-gray-700">
                <strong>4.2 Responsabilités de l'Utilisateur</strong><br/>
                L'Utilisateur s'engage à fournir des informations exactes et complètes 
                et à utiliser les services de manière légale et conforme à l'éthique.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                Article 5 - Propriété Intellectuelle
              </h2>
              <p className="font-didot text-gray-700">
                Tous les éléments du site Square Meter (textes, images, photographies, 
                logos, etc.) sont protégés par le droit d'auteur et autres droits de 
                propriété intellectuelle. Toute reproduction non autorisée est interdite.
              </p>
            </section>

            {/* Personal Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                Article 6 - Données Personnelles
              </h2>
              <p className="font-didot text-gray-700">
                Le traitement des données personnelles est régi par notre Politique 
                de Confidentialité, qui constitue une partie intégrante des présentes CGU.
              </p>
            </section>

            {/* Limitations */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                Article 7 - Limitations de Responsabilité
              </h2>
              <p className="font-didot text-gray-700">
                Square Meter ne pourra être tenu responsable des dommages indirects 
                résultant de l'utilisation du site. La responsabilité de Square Meter 
                ne saurait être engagée en cas de force majeure ou de fait imprévisible 
                et irrésistible d'un tiers.
              </p>
            </section>

            {/* Modifications */}
            <section className="mb-8">
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                Article 8 - Modifications des CGU
              </h2>
              <p className="font-didot text-gray-700">
                Square Meter se réserve le droit de modifier les présentes CGU à tout 
                moment. Les Utilisateurs seront informés des modifications par email 
                ou via la plateforme.
              </p>
            </section>

            {/* Jurisdiction */}
            <section>
              <h2 className="text-2xl font-inter uppercase text-deep-green mb-4">
                Article 9 - Droit Applicable et Juridiction
              </h2>
              <p className="font-didot text-gray-700">
                Les présentes CGU sont régies par le droit français. En cas de litige, 
                les tribunaux de Paris seront seuls compétents.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;