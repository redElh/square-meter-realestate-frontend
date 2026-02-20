// src/components/SEO/SEO.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  property?: {
    price?: number;
    currency?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    location?: string;
    type?: string;
  };
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website',
  article,
  property 
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'fr';
  
  const baseUrl = 'https://squaremeter.ma';
  const defaultTitle = 'Square Meter - Agence Immobilière de Prestige à Essaouira';
  const defaultDescription = 'Agence immobilière d\'excellence à Essaouira. Villas, appartements et biens d\'exception en vente et location. Gestion locative professionnelle, conciergerie et services haut de gamme.';
  const defaultKeywords = 'immobilier Essaouira, agence immobilière Essaouira, vente villa Essaouira, location appartement Essaouira, immobilier de prestige Maroc, gestion locative Essaouira, conciergerie Essaouira, real estate Essaouira, property Morocco, Square Meter';
  const defaultImage = `${baseUrl}/logo-m2.png`;
  
  const seoTitle = title ? `${title} | Square Meter` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || defaultImage;
  const seoUrl = url ? `${baseUrl}${url}` : baseUrl;

  // Generate structured data for real estate
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'Square Meter',
      alternateName: 'M² Square Meter',
      description: seoDescription,
      url: baseUrl,
      logo: defaultImage,
      image: seoImage,
      telephone: '+212 5 24 47 60 00',
      email: 'contact@squaremeter.ma',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Essaouira',
        addressLocality: 'Essaouira',
        postalCode: '44000',
        addressRegion: 'Marrakech-Safi',
        addressCountry: 'MA'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 31.508459,
        longitude: -9.759703
      },
      areaServed: {
        '@type': 'City',
        name: 'Essaouira'
      },
      priceRange: '$$-$$$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '13:00'
        }
      ],
      sameAs: [
        'https://www.facebook.com/squaremeter',
        'https://www.instagram.com/squaremeter',
        'https://www.linkedin.com/company/squaremeter'
      ]
    };

    // Add property-specific structured data if available
    if (property) {
      return [
        baseData,
        {
          '@context': 'https://schema.org',
          '@type': property.type === 'rent' ? 'RentAction' : 'Product',
          name: title || 'Bien Immobilier',
          description: seoDescription,
          image: seoImage,
          url: seoUrl,
          ...(property.price && {
            offers: {
              '@type': 'Offer',
              price: property.price,
              priceCurrency: property.currency || 'MAD',
              availability: 'https://schema.org/InStock',
              priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
          }),
          ...(property.location && {
            location: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: property.location
              }
            }
          }),
          ...(property.area && {
            floorSize: {
              '@type': 'QuantitativeValue',
              value: property.area,
              unitCode: 'MTK'
            }
          }),
          ...(property.bedrooms && {
            numberOfRooms: property.bedrooms
          }),
          ...(property.bathrooms && {
            numberOfBathroomsTotal: property.bathrooms
          })
        }
      ];
    }

    // Add article structured data if available
    if (article && type === 'article') {
      return [
        baseData,
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: seoDescription,
          image: seoImage,
          author: {
            '@type': 'Organization',
            name: article.author || 'Square Meter'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Square Meter',
            logo: {
              '@type': 'ImageObject',
              url: defaultImage
            }
          },
          datePublished: article.publishedTime,
          dateModified: article.modifiedTime,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': seoUrl
          }
        }
      ];
    }

    return baseData;
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={currentLanguage} />
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={seoUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content="Square Meter" />
      <meta property="og:locale" content={`${currentLanguage}_${currentLanguage === 'ar' ? 'MA' : currentLanguage.toUpperCase()}`} />
      
      {/* Article specific tags */}
      {article && type === 'article' && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
};

export default SEO;
