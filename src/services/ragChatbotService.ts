// RAG Chatbot Service with Google Gemini AI
// Provides intelligent property search and FAQ handling
// AI calls are proxied through server-side /api/chatbot for security

import { vectorStoreService } from './vectorStoreService';
import { Property } from './apimoService';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  propertyResults?: Property[];
  actionSuggestions?: ActionSuggestion[];
}

export interface ActionSuggestion {
  type: 'book_viewing' | 'contact_agent' | 'view_property' | 'apply_filters';
  label: string;
  data?: any;
}

export interface ConversationContext {
  language: string;
  userPreferences: {
    budget?: { min?: number; max?: number };
    location?: string;
    rooms?: number;
    amenities?: string[];
  };
  lastQuery?: string;
}

class RAGChatbotService {
  private conversationHistory: ChatMessage[] = [];
  private context: ConversationContext;

  constructor() {
    this.context = {
      language: 'en',
      userPreferences: {}
    };
  }

  /**
   * Initialize Google Gemini client
   * Note: AI calls are proxied through server-side /api/chatbot for security (V6 fix)
   */
  initialize(apiKey?: string) {
    // Client-side no longer initializes Gemini directly.
    // All AI calls go through the server-side /api/chatbot endpoint.
    console.log('✅ RAG Chatbot initialized (server-side AI proxy)');
    return true;
  }

  /**
   * Set conversation language
   */
  setLanguage(language: string) {
    this.context.language = language;
  }

  /**
   * Extract search parameters from natural language query
   * 🔬 MICROSCOPICALLY SPECIFIC QUERY PARSER
   */
  private async extractSearchIntent(query: string): Promise<{
    isPropertySearch: boolean;
    wantsMultiple: boolean; // Does client want ONE property or MULTIPLE?
    specificCount?: number; // Exact number requested (e.g., "show me 3 properties")
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      minRooms?: number;
      maxRooms?: number;
      minBedrooms?: number;
      maxBedrooms?: number;
      location?: string;
      amenities?: string[];
      propertyType?: string; // EXACT type: apartment, villa, riad, house
    };
    outsideEssaouira?: boolean; // Is location outside Essaouira?
    intent: 'search' | 'faq' | 'booking' | 'general';
  }> {
    const lowerQuery = query.toLowerCase();

    // ========== GEOGRAPHIC VALIDATION ==========
    const essaouiraTerms = ['essaouira', 'mogador'];
    const outsideLocations = ['marrakech', 'casablanca', 'rabat', 'tangier', 'agadir', 'fes', 'fez', 'meknes', 'tetouan'];
    const outsideEssaouira = outsideLocations.some(loc => lowerQuery.includes(loc)) && 
                             !essaouiraTerms.some(term => lowerQuery.includes(term));

    // ========== QUANTITY DETECTION ==========
    let wantsMultiple = true;
    let specificCount: number | undefined;
    
    // Singular indicators - client wants ONE specific property
    const singularTerms = [
      'a property', 'one property', 'single property', 'the best', 'the cheapest', 'the most expensive',
      'find me a', 'show me a', 'i want a', 'i need a', 'looking for a',
      'une propriété', 'la meilleure', 'la moins chère', 'la plus chère'
    ];
    
    if (singularTerms.some(term => lowerQuery.includes(term))) {
      wantsMultiple = false;
      specificCount = 1;
    }
    
    // Explicit count - "show me 3 properties"
    const countMatch = lowerQuery.match(/(\d+)\s*(properties|villas|apartments|houses|riads)/);
    if (countMatch) {
      specificCount = parseInt(countMatch[1]);
      wantsMultiple = specificCount > 1;
    }
    
    // Superlatives indicate wanting ONE best option
    const superlatives = ['cheapest', 'most expensive', 'biggest', 'smallest', 'best', 'nearest'];
    if (superlatives.some(term => lowerQuery.includes(term))) {
      wantsMultiple = false;
      specificCount = 1;
    }

    // ========== PROPERTY TYPE DETECTION (MICROSCOPICALLY SPECIFIC) ==========
    let propertyType: string | undefined;
    
    // Map all possible property type variations to exact types
    const propertyTypeMap: { [key: string]: string } = {
      'apartment': 'apartment',
      'apartments': 'apartment',
      'flat': 'apartment',
      'flats': 'apartment',
      'apt': 'apartment',
      'villa': 'villa',
      'villas': 'villa',
      'house': 'house',
      'houses': 'house',
      'home': 'house',
      'riad': 'riad',
      'riads': 'riad',
      'traditional house': 'riad',
      'penthouse': 'penthouse',
      'studio': 'studio',
      'duplex': 'duplex',
      'triplex': 'triplex',
      'townhouse': 'townhouse',
      'cottage': 'cottage',
      'bungalow': 'bungalow',
      'mansion': 'mansion',
      'estate': 'estate',
      'land': 'land',
      'plot': 'land',
      'commercial': 'commercial',
      'office': 'commercial',
      'shop': 'commercial'
    };

    // Find exact property type in query
    for (const [keyword, type] of Object.entries(propertyTypeMap)) {
      if (lowerQuery.includes(keyword)) {
        propertyType = type;
        break;
      }
    }

    // ========== PRICE RANGE DETECTION (PRECISE) ==========
    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    // "under X" or "less than X" or "below X" or "max X"
    const maxPriceMatch = lowerQuery.match(/(?:under|less\s+than|below|max|maximum|up\s+to)\s+[€$]?\s*([\d,]+)(?:k|m)?/i);
    if (maxPriceMatch) {
      let value = parseFloat(maxPriceMatch[1].replace(/,/g, ''));
      if (lowerQuery.includes('k')) value *= 1000;
      if (lowerQuery.includes('m')) value *= 1000000;
      maxPrice = value;
    }

    // "over X" or "more than X" or "above X" or "min X"
    const minPriceMatch = lowerQuery.match(/(?:over|more\s+than|above|min|minimum|starting\s+at)\s+[€$]?\s*([\d,]+)(?:k|m)?/i);
    if (minPriceMatch) {
      let value = parseFloat(minPriceMatch[1].replace(/,/g, ''));
      if (lowerQuery.includes('k')) value *= 1000;
      if (lowerQuery.includes('m')) value *= 1000000;
      minPrice = value;
    }

    // "between X and Y"
    const betweenPriceMatch = lowerQuery.match(/between\s+[€$]?\s*([\d,]+)(?:k|m)?\s+and\s+[€$]?\s*([\d,]+)(?:k|m)?/i);
    if (betweenPriceMatch) {
      let min = parseFloat(betweenPriceMatch[1].replace(/,/g, ''));
      let max = parseFloat(betweenPriceMatch[2].replace(/,/g, ''));
      if (lowerQuery.includes('k')) { min *= 1000; max *= 1000; }
      if (lowerQuery.includes('m')) { min *= 1000000; max *= 1000000; }
      minPrice = min;
      maxPrice = max;
    }

    // "cheapest" or "affordable" - set max price filter
    if (lowerQuery.includes('cheapest') || lowerQuery.includes('affordable') || lowerQuery.includes('budget')) {
      maxPrice = maxPrice || 500000;
    }

    // "expensive" or "luxury" - set min price filter
    if (lowerQuery.includes('expensive') || lowerQuery.includes('luxury') || lowerQuery.includes('premium')) {
      minPrice = minPrice || 1000000;
    }

    // ========== BEDROOMS/ROOMS DETECTION (EXACT) ==========
    let minBedrooms: number | undefined;
    let maxBedrooms: number | undefined;
    let minRooms: number | undefined;
    let maxRooms: number | undefined;

    // "X bedroom" or "X-bedroom"
    const bedroomsMatch = lowerQuery.match(/(\d+)[\s-]*(bedroom|bed|br)/i);
    if (bedroomsMatch) {
      minBedrooms = parseInt(bedroomsMatch[1]);
      maxBedrooms = minBedrooms; // Exact match
    }

    // "at least X bedrooms"
    const minBedroomsMatch = lowerQuery.match(/(?:at\s+least|minimum|min)\s+(\d+)\s+bedroom/i);
    if (minBedroomsMatch) {
      minBedrooms = parseInt(minBedroomsMatch[1]);
      maxBedrooms = undefined; // No upper limit
    }

    // "X rooms"
    const roomsMatch = lowerQuery.match(/(\d+)[\s-]*room/i);
    if (roomsMatch && !lowerQuery.includes('bedroom')) {
      minRooms = parseInt(roomsMatch[1]);
      maxRooms = minRooms; // Exact match
    }

    // ========== LOCATION DETECTION ==========
    const locationMatch = lowerQuery.match(/in\s+([a-z\s]+?)(?:\s+under|\s+with|\s+between|\s+less|\s*$)/i);
    const location = locationMatch ? locationMatch[1].trim() : undefined;

    // ========== AMENITIES DETECTION ==========
    const amenities: string[] = [];
    const amenityKeywords: { [key: string]: string } = {
      'pool': 'pool',
      'swimming pool': 'pool',
      'parking': 'parking',
      'garage': 'parking',
      'garden': 'garden',
      'yard': 'garden',
      'terrace': 'terrace',
      'balcony': 'terrace',
      'sea view': 'sea view',
      'ocean view': 'sea view',
      'beach': 'beach access',
      'mountain view': 'mountain view',
      'air conditioning': 'air conditioning',
      'heating': 'heating',
      'fireplace': 'fireplace',
      'wifi': 'wifi',
      'furnished': 'furnished',
      'elevator': 'elevator',
      'security': 'security',
      'gym': 'gym',
      'fitness': 'gym'
    };

    for (const [keyword, amenity] of Object.entries(amenityKeywords)) {
      if (lowerQuery.includes(keyword)) {
        amenities.push(amenity);
      }
    }

    // ========== INTENT DETECTION ==========
    const searchKeywords = ['find', 'search', 'looking for', 'show me', 'i want', 'i need', 'available'];
    const isPropertySearch = searchKeywords.some(kw => lowerQuery.includes(kw)) || propertyType !== undefined;

    let intent: 'search' | 'faq' | 'booking' | 'general' = 'general';
    if (isPropertySearch) {
      intent = 'search';
    } else if (lowerQuery.includes('book') || lowerQuery.includes('visit') || lowerQuery.includes('viewing')) {
      intent = 'booking';
    } else if (
      lowerQuery.includes('how') ||
      lowerQuery.includes('what') ||
      lowerQuery.includes('legal') ||
      lowerQuery.includes('process')
    ) {
      intent = 'faq';
    }

    console.log('🔍 Query Analysis:', {
      propertyType,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minRooms,
      maxRooms,
      location,
      amenities,
      wantsMultiple,
      specificCount,
      outsideEssaouira
    });

    return {
      isPropertySearch,
      wantsMultiple,
      specificCount,
      outsideEssaouira,
      filters: isPropertySearch ? {
        propertyType,
        minPrice,
        maxPrice,
        minRooms,
        maxRooms,
        minBedrooms,
        maxBedrooms,
        location,
        amenities: amenities.length > 0 ? amenities : undefined
      } : undefined,
      intent
    };
  }

  /**
   * Get FAQ response
   */
  private getFAQResponse(query: string, language: string): string {
    const lowerQuery = query.toLowerCase();

    const faqs: Record<string, { en: string; fr: string; es: string; de: string }> = {
      buying_process: {
        en: `**Buying Process in France:**\n\n1. **Property Search** - Browse listings and schedule viewings\n2. **Make an Offer** - Submit a written offer (offre d'achat)\n3. **Preliminary Contract** - Sign compromis de vente (10% deposit)\n4. **Cooling-off Period** - 10-day withdrawal period\n5. **Mortgage Application** - Secure financing (if needed)\n6. **Final Contract** - Sign acte de vente at notary\n7. **Transfer Ownership** - Receive keys and title deed\n\n**Timeline:** Typically 2-3 months from offer to completion.`,
        fr: `**Processus d'achat en France:**\n\n1. **Recherche** - Parcourir les annonces et planifier des visites\n2. **Faire une offre** - Soumettre une offre écrite\n3. **Compromis de vente** - Signer le compromis (dépôt de 10%)\n4. **Délai de rétractation** - Période de 10 jours\n5. **Demande de prêt** - Obtenir le financement\n6. **Acte de vente** - Signature chez le notaire\n7. **Transfert** - Réception des clés et titre de propriété\n\n**Délai:** Généralement 2-3 mois.`,
        es: `**Proceso de compra en Francia:**\n\n1. **Búsqueda** - Explorar propiedades y programar visitas\n2. **Hacer una oferta** - Presentar oferta por escrito\n3. **Contrato preliminar** - Firmar compromis de vente (depósito 10%)\n4. **Período de reflexión** - 10 días de retracto\n5. **Solicitud hipoteca** - Obtener financiación\n6. **Contrato final** - Firma ante notario\n7. **Transferencia** - Recibir llaves y escritura\n\n**Plazo:** Normalmente 2-3 meses.`,
        de: `**Kaufprozess in Frankreich:**\n\n1. **Immobiliensuche** - Angebote durchsuchen und Besichtigungen\n2. **Angebot** - Schriftliches Angebot einreichen\n3. **Vorvertrag** - Compromis de vente (10% Anzahlung)\n4. **Widerrufsfrist** - 10 Tage Bedenkzeit\n5. **Kreditantrag** - Finanzierung sichern\n6. **Kaufvertrag** - Unterzeichnung beim Notar\n7. **Eigentumsübertragung** - Schlüssel und Urkunde\n\n**Zeitrahmen:** Typischerweise 2-3 Monate.`
      },
      legal_requirements: {
        en: `**Legal Requirements:**\n\n- Valid passport or ID\n- French bank account (recommended)\n- Proof of funds\n- Tax identification number\n- Notary fees: 7-8% of purchase price\n- No residency requirement for EU citizens\n\n**Foreign Buyers:** Non-EU citizens can buy but may need additional documentation.`,
        fr: `**Exigences légales:**\n\n- Passeport ou carte d'identité valide\n- Compte bancaire français (recommandé)\n- Justificatif de fonds\n- Numéro d'identification fiscale\n- Frais de notaire: 7-8% du prix\n- Pas d'exigence de résidence pour citoyens UE\n\n**Acheteurs étrangers:** Les non-UE peuvent acheter avec documents supplémentaires.`,
        es: `**Requisitos legales:**\n\n- Pasaporte o ID válido\n- Cuenta bancaria francesa (recomendado)\n- Prueba de fondos\n- Número de identificación fiscal\n- Gastos notariales: 7-8% del precio\n- Sin requisito de residencia para ciudadanos UE\n\n**Compradores extranjeros:** Los no-UE pueden comprar con documentación adicional.`,
        de: `**Rechtliche Anforderungen:**\n\n- Gültiger Reisepass oder Ausweis\n- Französisches Bankkonto (empfohlen)\n- Vermögensnachweis\n- Steueridentifikationsnummer\n- Notargebühren: 7-8% des Kaufpreises\n- Keine Wohnsitzpflicht für EU-Bürger\n\n**Ausländische Käufer:** Nicht-EU-Bürger können kaufen, benötigen ggf. zusätzliche Unterlagen.`
      },
      fees_costs: {
        en: `**Costs & Fees:**\n\n**Notary Fees:** 7-8% of purchase price\n**Agency Fees:** Typically 5-10% (often included in price)\n**Mortgage Fees:** ~1% if financing\n**Property Tax:** Varies by location\n**Insurance:** Required (building insurance)\n\n**Total Additional Costs:** Expect 10-15% on top of purchase price.`,
        fr: `**Coûts et frais:**\n\n**Frais de notaire:** 7-8% du prix\n**Honoraires d'agence:** 5-10% (souvent inclus)\n**Frais d'emprunt:** ~1% si financement\n**Taxe foncière:** Variable selon localisation\n**Assurance:** Obligatoire\n\n**Coûts totaux:** Prévoir 10-15% en plus du prix.`,
        es: `**Costos y tasas:**\n\n**Gastos notariales:** 7-8% del precio\n**Honorarios agencia:** 5-10% (a menudo incluidos)\n**Gastos hipoteca:** ~1% si hay financiación\n**Impuesto inmobiliario:** Varía según ubicación\n**Seguro:** Obligatorio\n\n**Costos totales adicionales:** Esperar 10-15% adicional.`,
        de: `**Kosten & Gebühren:**\n\n**Notargebühren:** 7-8% des Kaufpreises\n**Maklergebühren:** 5-10% (oft im Preis enthalten)\n**Hypothekengebühren:** ~1% bei Finanzierung\n**Grundsteuer:** Variiert nach Standort\n**Versicherung:** Pflicht\n\n**Gesamtzusatzkosten:** Erwarten Sie 10-15% zusätzlich.`
      }
    };

    // Match query to FAQ
    if (lowerQuery.includes('buy') || lowerQuery.includes('purchase') || lowerQuery.includes('process')) {
      return faqs.buying_process[language as 'en'] || faqs.buying_process.en;
    }
    if (lowerQuery.includes('legal') || lowerQuery.includes('requirement') || lowerQuery.includes('document')) {
      return faqs.legal_requirements[language as 'en'] || faqs.legal_requirements.en;
    }
    if (lowerQuery.includes('fee') || lowerQuery.includes('cost') || lowerQuery.includes('tax') || lowerQuery.includes('price')) {
      return faqs.fees_costs[language as 'en'] || faqs.fees_costs.en;
    }

    return '';
  }

  /**
   * Chat with RAG-enhanced AI
   */
  async chat(userMessage: string): Promise<ChatMessage> {
    const timestamp = new Date();

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp
    });

    try {
      // Extract intent from query
      const intent = await this.extractSearchIntent(userMessage);

      let responseContent = '';
      let propertyResults: Property[] | undefined;
      let actionSuggestions: ActionSuggestion[] = [];

      // ========== CHECK FOR LOCATIONS OUTSIDE ESSAOUIRA ==========
      if (intent.outsideEssaouira) {
        responseContent = this.context.language === 'fr'
          ? "Je suis désolé, mais Square Meter Real Estate opère exclusivement à Essaouira. Nous sommes spécialisés dans les meilleures propriétés de cette magnifique ville côtière. Puis-je vous montrer nos propriétés disponibles à Essaouira ?"
          : "I apologize, but Square Meter Real Estate operates exclusively in Essaouira. We specialize in the finest properties in this beautiful coastal city. May I show you our available properties in Essaouira?";
      }
      // ========== HANDLE PROPERTY SEARCH ==========
      else if (intent.intent === 'search' && intent.filters) {
        // Determine how many results to fetch
        const resultsToFetch = intent.specificCount || (intent.wantsMultiple ? 5 : 1);
        
        propertyResults = await vectorStoreService.searchProperties(
          userMessage,
          resultsToFetch,
          intent.filters
        );

        if (propertyResults.length > 0) {
          // Use server-side AI to create a personalized response (V6 fix: no client-side API key)
          try {
            const propertyDescriptions = propertyResults.map((p, idx) => 
              `${idx + 1}. ${p.title} - €${p.price?.toLocaleString()} - ${p.rooms} rooms, ${p.bedrooms} bedrooms - ${p.location || p.city}`
            ).join('\n');
            
            const enrichedMessage = `User asked: "${userMessage}"\n\nWe found ${propertyResults.length} matching properties:\n${propertyDescriptions}\n\nRecommend the most suitable property and explain why. Keep response under 100 words.`;

            const res = await fetch('/api/chatbot', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: enrichedMessage, language: this.context.language }),
            });
            const data = await res.json();
            responseContent = data.response || this.formatSearchResponse(propertyResults, intent.filters, this.context.language);
          } catch (error) {
            console.error('AI response generation error:', error);
            responseContent = this.formatSearchResponse(propertyResults, intent.filters, this.context.language);
          }
          
          // Add actions based on context
          if (propertyResults.length === 1 || !intent.wantsMultiple) {
            actionSuggestions = [
              { type: 'view_property', label: 'View Full Details', data: { propertyId: propertyResults[0].id } },
              { type: 'book_viewing', label: 'Book a Viewing', data: { propertyId: propertyResults[0].id } }
            ];
          } else {
            actionSuggestions = [
              { type: 'contact_agent', label: 'Discuss These Properties', data: {} }
            ];
          }
          
          // If user wanted ONE but we found multiple, only return the best match
          if (!intent.wantsMultiple && propertyResults.length > 1) {
            propertyResults = [propertyResults[0]];
          }
        } else {
          responseContent = this.getNoResultsMessage(this.context.language);
        }
      }
      // Handle FAQ - Redirect to property focus
      else if (intent.intent === 'faq') {
        responseContent = this.context.language === 'fr'
          ? "Je suis spécialisé dans la recherche de propriétés à Essaouira. Pour des questions juridiques ou de procédures, je vous recommande de contacter directement notre équipe. Puis-je vous aider à trouver une propriété ?"
          : "I specialize in helping you find properties in Essaouira. For legal or procedural questions, I recommend contacting our team directly. May I help you find a property?";
        actionSuggestions = [
          { type: 'contact_agent', label: 'Contact Agent', data: {} }
        ];
      }
      // Handle booking
      else if (intent.intent === 'booking') {
        responseContent = this.getBookingMessage(this.context.language);
        actionSuggestions = [
          { type: 'contact_agent', label: 'Schedule Viewing', data: {} }
        ];
      }

      // If no specific handler, redirect to property search focus
      if (!responseContent) {
        // Use server-side AI proxy (V6 fix)
        try {
          const res = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage, language: this.context.language }),
          });
          const data = await res.json();
          responseContent = data.response || '';
        } catch (aiError: any) {
          console.error('AI proxy error:', aiError);
          responseContent = '';
        }
      }

      // Fallback if Gemini not available
      if (!responseContent) {
        responseContent = this.context.language === 'fr' 
          ? "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler?"
          : "I'm sorry, I couldn't process your request. Could you rephrase it?";
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        propertyResults,
        actionSuggestions: actionSuggestions.length > 0 ? actionSuggestions : undefined
      };

      this.conversationHistory.push(assistantMessage);

      return assistantMessage;
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: this.getErrorMessage(this.context.language),
        timestamp: new Date()
      };

      this.conversationHistory.push(errorMessage);
      return errorMessage;
    }
  }

  /**
   * Format search response
   */
  private formatSearchResponse(properties: Property[], filters: any, language: string): string {
    const messages: Record<string, string> = {
      en: `Great! I found ${properties.length} properties matching your criteria:`,
      fr: `Super ! J'ai trouvé ${properties.length} propriétés correspondant à vos critères:`,
      es: `¡Genial! Encontré ${properties.length} propiedades que coinciden con sus criterios:`,
      de: `Großartig! Ich habe ${properties.length} Immobilien gefunden, die Ihren Kriterien entsprechen:`,
      ar: `رائع! وجدت ${properties.length} عقارات تطابق معاييرك:`,
      ru: `Отлично! Я нашел ${properties.length} объектов, соответствующих вашим критериям:`
    };

    return messages[language] || messages.en;
  }

  private getNoResultsMessage(language: string): string {
    const messages: Record<string, string> = {
      en: "I couldn't find properties matching those exact criteria, but I'd be happy to show you similar options or adjust the search parameters.",
      fr: "Je n'ai pas trouvé de propriétés correspondant exactement à ces critères, mais je serais ravi de vous montrer des options similaires.",
      es: "No encontré propiedades que coincidan exactamente con esos criterios, pero estaría encantado de mostrarle opciones similares.",
      de: "Ich konnte keine Immobilien finden, die genau diesen Kriterien entsprechen, aber ich zeige Ihnen gerne ähnliche Optionen.",
      ar: "لم أتمكن من العثور على عقارات تطابق هذه المعايير بالضبط، لكن يسعدني أن أريك خيارات مماثلة.",
      ru: "Я не смог найти объекты, точно соответствующие этим критериям, но с удовольствием покажу вам похожие варианты."
    };
    return messages[language] || messages.en;
  }

  private getBookingMessage(language: string): string {
    const messages: Record<string, string> = {
      en: "I'd be happy to help you schedule a viewing! Please provide:\n\n1. Your preferred date and time\n2. Contact information\n3. Any specific questions for the viewing\n\nOr click 'Contact Agent' to connect directly with our team.",
      fr: "Je serais ravi de vous aider à planifier une visite ! Veuillez fournir:\n\n1. Votre date et heure préférées\n2. Vos coordonnées\n3. Questions spécifiques pour la visite\n\nOu cliquez sur 'Contacter l'agent' pour contacter directement notre équipe.",
      es: "¡Estaré encantado de ayudarle a programar una visita! Por favor proporcione:\n\n1. Su fecha y hora preferidas\n2. Información de contacto\n3. Preguntas específicas para la visita\n\nO haga clic en 'Contactar agente' para conectarse directamente con nuestro equipo.",
      de: "Ich helfe Ihnen gerne bei der Terminvereinbarung! Bitte geben Sie an:\n\n1. Ihr bevorzugtes Datum und Uhrzeit\n2. Kontaktinformationen\n3. Spezifische Fragen zur Besichtigung\n\nOder klicken Sie auf 'Agent kontaktieren', um direkt mit unserem Team zu sprechen.",
      ar: "يسعدني مساعدتك في جدولة معاينة! يرجى تقديم:\n\n1. التاريخ والوقت المفضلين\n2. معلومات الاتصال\n3. أي أسئلة محددة للمعاينة\n\nأو انقر على 'الاتصال بالوكيل' للتواصل مباشرة مع فريقنا.",
      ru: "Я буду рад помочь вам запланировать просмотр! Пожалуйста, предоставьте:\n\n1. Предпочитаемую дату и время\n2. Контактную информацию\n3. Любые конкретные вопросы по просмотру\n\nИли нажмите 'Связаться с агентом', чтобы связаться напрямую с нашей командой."
    };
    return messages[language] || messages.en;
  }

  private getErrorMessage(language: string): string {
    const messages: Record<string, string> = {
      en: "I'm currently working in offline mode, but I can still help you! I can search for properties, answer common questions about real estate, and schedule viewings. What would you like to know?",
      fr: "Je fonctionne actuellement en mode hors ligne, mais je peux quand même vous aider ! Je peux rechercher des propriétés, répondre aux questions courantes sur l'immobilier et planifier des visites. Que souhaitez-vous savoir ?",
      es: "Actualmente estoy trabajando en modo fuera de línea, ¡pero aún puedo ayudarte! Puedo buscar propiedades, responder preguntas comunes sobre bienes raíces y programar visitas. ¿Qué te gustaría saber?",
      de: "Ich arbeite derzeit im Offline-Modus, kann Ihnen aber trotzdem helfen! Ich kann nach Immobilien suchen, häufige Fragen zu Immobilien beantworten und Besichtigungen planen. Was möchten Sie wissen?",
      ar: "أعمل حالياً في وضع عدم الاتصال، لكن لا يزال بإمكاني مساعدتك! يمكنني البحث عن العقارات والإجابة على الأسئلة الشائعة حول العقارات وجدولة المعاينات. ماذا تريد أن تعرف؟",
      ru: "Я сейчас работаю в автономном режиме, но все еще могу вам помочь! Я могу искать объекты недвижимости, отвечать на распространенные вопросы о недвижимости и планировать просмотры. Что вы хотите узнать?"
    };
    return messages[language] || messages.en;
  }

  private getSystemPrompt(language: string): string {
    const prompts: Record<string, string> = {
      en: `You are an intelligent real estate assistant for Square Meter Real Estate in Essaouira, Morocco.

⚠️ DISCLAIMER: You are under development and may make mistakes. Users should verify important information with the human team.

STRICT OPERATIONAL BOUNDARIES:
- ONLY help with: Property information, viewing details, and booking viewings
- GEOGRAPHIC SCOPE: Essaouira, Morocco ONLY - if asked about other cities, politely explain we only serve Essaouira
- NEVER discuss: General questions, market analysis, investment advice, legal matters beyond basics, or topics unrelated to our properties

YOUR EXPERTISE:
- Deep knowledge of Essaouira's real estate market
- Understanding client needs from subtle cues in their questions
- Recommending the PERFECT property, not just any property
- Being conversational while staying professional

CRITICAL RULES:
1. ALWAYS respond in English - this is the user's selected language
2. Analyze what the client TRULY wants - if they say "the cheapest", show ONE property, not five
3. If they want "a villa", they want ONE recommendation, not a list
4. If they say "properties" (plural), show multiple options
5. Match your response tone to their urgency and specificity
6. ALWAYS search our actual database - NEVER make up properties
7. Keep responses under 100 words - be concise and helpful
8. Focus ONLY on property search, viewing, and booking

Tone: Professional real estate expert who listens carefully and provides exactly what clients need.`,
      fr: `Vous êtes un assistant immobilier intelligent pour Square Meter Real Estate à Essaouira, Maroc.

⚠️ AVERTISSEMENT: Vous êtes en développement et pouvez faire des erreurs. Les utilisateurs doivent vérifier les informations importantes avec l'équipe humaine.

LIMITES OPÉRATIONNELLES STRICTES:
- SEULEMENT: Informations sur les propriétés, détails des visites, et réservation de visites
- ZONE GÉOGRAPHIQUE: Essaouira, Maroc UNIQUEMENT - si demandé pour d'autres villes, expliquez poliment que nous ne servons qu'Essaouira
- JAMAIS discuter: Questions générales, analyse de marché, conseils d'investissement, questions juridiques au-delà des bases

VOTRE EXPERTISE:
- Connaissance approfondie du marché immobilier d'Essaouira
- Compréhension des besoins clients à partir de leurs questions
- Recommander LA propriété PARFAITE, pas n'importe laquelle
- Être conversationnel tout en restant professionnel

RÈGLES CRITIQUES:
1. TOUJOURS répondre en français - c'est la langue sélectionnée par l'utilisateur
2. Analysez ce que le client veut VRAIMENT - s'ils disent "la moins chère", montrez UNE propriété, pas cinq
3. S'ils veulent "une villa", ils veulent UNE recommandation, pas une liste
4. S'ils disent "propriétés" (pluriel), montrez plusieurs options
5. Adaptez votre réponse à leur urgence et spécificité
6. TOUJOURS chercher dans notre base - NE JAMAIS inventer
7. Réponses de moins de 100 mots - concis et utile
8. Focus UNIQUEMENT sur recherche, visite et réservation

Ton: Expert immobilier professionnel qui écoute attentivement et fournit exactement ce dont les clients ont besoin.`,
      es: `Eres un asistente inmobiliario inteligente para Square Meter Real Estate en Essaouira, Marruecos.

⚠️ DESCARGO: Estás en desarrollo y puedes cometer errores. Los usuarios deben verificar la información importante con el equipo humano.

LÍMITES OPERACIONALES ESTRICTOS:
- SOLO ayuda con: Información de propiedades, detalles de visitas y reserva de visitas
- ÁMBITO GEOGRÁFICO: Essaouira, Marruecos ÚNICAMENTE - si preguntan por otras ciudades, explica cortésmente que solo servimos Essaouira
- NUNCA discutas: Preguntas generales, análisis de mercado, asesoramiento de inversión, asuntos legales más allá de lo básico

TU EXPERIENCIA:
- Conocimiento profundo del mercado inmobiliario de Essaouira
- Comprensión de las necesidades del cliente a partir de pistas sutiles
- Recomendar la propiedad PERFECTA, no cualquiera
- Ser conversacional mientras se mantiene profesional

REGLAS CRÍTICAS:
1. SIEMPRE responde en español - este es el idioma seleccionado por el usuario
2. Analiza lo que el cliente REALMENTE quiere - si dice "la más barata", muestra UNA propiedad, no cinco
3. Si quieren "una villa", quieren UNA recomendación, no una lista
4. Si dicen "propiedades" (plural), muestra múltiples opciones
5. Adapta tu tono a su urgencia y especificidad
6. SIEMPRE busca en nuestra base de datos - NUNCA inventes
7. Respuestas de menos de 100 palabras - conciso y útil
8. Enfócate SOLO en búsqueda, visita y reserva

Tono: Experto inmobiliario profesional que escucha con atención y proporciona exactamente lo que los clientes necesitan.`,
      de: `Sie sind ein intelligenter Immobilienassistent für Square Meter Real Estate in Essaouira, Marokko.

⚠️ HAFTUNGSAUSSCHLUSS: Sie befinden sich in der Entwicklung und können Fehler machen. Benutzer sollten wichtige Informationen mit dem menschlichen Team überprüfen.

STRIKTE BETRIEBSGRENZEN:
- NUR helfen mit: Immobilieninformationen, Besichtigungsdetails und Buchung von Besichtigungen
- GEOGRAFISCHER BEREICH: Nur Essaouira, Marokko - wenn nach anderen Städten gefragt wird, erklären Sie höflich, dass wir nur Essaouira bedienen
- NIEMALS diskutieren: Allgemeine Fragen, Marktanalysen, Anlageberatung, rechtliche Angelegenheiten über Grundlagen hinaus

IHRE EXPERTISE:
- Tiefes Wissen über den Immobilienmarkt von Essaouira
- Verständnis der Kundenbedürfnisse aus subtilen Hinweisen
- Empfehlung der PERFEKTEN Immobilie, nicht irgendeiner
- Gesprächig sein und dabei professionell bleiben

KRITISCHE REGELN:
1. IMMER auf Deutsch antworten - dies ist die vom Benutzer gewählte Sprache
2. Analysieren Sie, was der Kunde WIRKLICH will - wenn sie "die günstigste" sagen, zeigen Sie EINE Immobilie, nicht fünf
3. Wenn sie "eine Villa" wollen, wollen sie EINE Empfehlung, keine Liste
4. Wenn sie "Immobilien" (Plural) sagen, zeigen Sie mehrere Optionen
5. Passen Sie Ihren Ton an ihre Dringlichkeit und Spezifität an
6. IMMER in unserer Datenbank suchen - NIEMALS erfinden
7. Antworten unter 100 Wörtern - prägnant und hilfreich
8. Fokus NUR auf Suche, Besichtigung und Buchung

Ton: Professioneller Immobilienexperte, der aufmerksam zuhört und genau das liefert, was Kunden brauchen.`,
      ar: `أنت مساعد عقاري ذكي لـ Square Meter Real Estate في الصويرة، المغرب.

⚠️ إخلاء المسؤولية: أنت قيد التطوير وقد ترتكب أخطاء. يجب على المستخدمين التحقق من المعلومات المهمة مع الفريق البشري.

الحدود التشغيلية الصارمة:
- فقط المساعدة في: معلومات العقارات، تفاصيل المعاينة، وحجز المعاينات
- النطاق الجغرافي: الصويرة، المغرب فقط - إذا سُئلت عن مدن أخرى، اشرح بأدب أننا نخدم الصويرة فقط
- لا تناقش أبداً: أسئلة عامة، تحليل السوق، نصائح استثمارية، أمور قانونية تتجاوز الأساسيات

خبرتك:
- معرفة عميقة بسوق العقارات في الصويرة
- فهم احتياجات العملاء من إشارات دقيقة في أسئلتهم
- التوصية بالعقار المثالي، وليس أي عقار
- كن محادثاً مع الحفاظ على الاحترافية

القواعد الحاسمة:
1. الرد دائماً بالعربية - هذه هي اللغة المختارة من قبل المستخدم
2. حلل ما يريده العميل حقاً - إذا قالوا "الأرخص"، اعرض عقار واحد، وليس خمسة
3. إذا أرادوا "فيلا"، فهم يريدون توصية واحدة، وليس قائمة
4. إذا قالوا "عقارات" (الجمع)، اعرض خيارات متعددة
5. طابق نبرة ردك مع إلحاحهم ودقتهم
6. ابحث دائماً في قاعدة بياناتنا - لا تخترع أبداً
7. ردود أقل من 100 كلمة - موجز ومفيد
8. ركز فقط على البحث والمعاينة والحجز

النبرة: خبير عقاري محترف يستمع بعناية ويقدم بالضبط ما يحتاجه العملاء.`,
      ru: `Вы интеллектуальный помощник по недвижимости для Square Meter Real Estate в Эс-Сувейре, Марокко.

⚠️ ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ: Вы находитесь в разработке и можете совершать ошибки. Пользователи должны проверять важную информацию с командой людей.

СТРОГИЕ ОПЕРАЦИОННЫЕ ГРАНИЦЫ:
- ТОЛЬКО помощь с: Информация об объектах, детали просмотра и бронирование просмотров
- ГЕОГРАФИЧЕСКИЙ ОХВАТ: Только Эс-Сувейра, Марокко - если спрашивают о других городах, вежливо объясните, что мы обслуживаем только Эс-Сувейру
- НИКОГДА не обсуждайте: Общие вопросы, анализ рынка, инвестиционные советы, юридические вопросы сверх основ

ВАША ЭКСПЕРТИЗА:
- Глубокое знание рынка недвижимости Эс-Сувейры
- Понимание потребностей клиентов из тонких намеков в их вопросах
- Рекомендация ИДЕАЛЬНОГО объекта, а не любого
- Быть разговорчивым, оставаясь профессиональным

КРИТИЧЕСКИЕ ПРАВИЛА:
1. ВСЕГДА отвечайте на русском - это выбранный пользователем язык
2. Анализируйте, что клиент ДЕЙСТВИТЕЛЬНО хочет - если они говорят "самый дешевый", покажите ОДИН объект, а не пять
3. Если они хотят "виллу", они хотят ОДНУ рекомендацию, а не список
4. Если они говорят "объекты" (множественное число), покажите несколько вариантов
5. Соответствуйте тон вашего ответа их срочности и конкретности
6. ВСЕГДА ищите в нашей базе данных - НИКОГДА не выдумывайте
7. Ответы менее 100 слов - кратко и полезно
8. Фокус ТОЛЬКО на поиске, просмотре и бронировании

Тон: Профессиональный эксперт по недвижимости, который внимательно слушает и предоставляет именно то, что нужно клиентам.`
    };
    return prompts[language] || prompts.en;
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  /**
   * Clear conversation
   */
  clearHistory() {
    this.conversationHistory = [];
    this.context.userPreferences = {};
  }

  /**
   * Update user preferences based on conversation
   */
  updatePreferences(preferences: Partial<ConversationContext['userPreferences']>) {
    this.context.userPreferences = {
      ...this.context.userPreferences,
      ...preferences
    };
  }
}

export const ragChatbotService = new RAGChatbotService();
