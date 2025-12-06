// Multi-language translation service
// Supports instant translation for the AI assistant

export type SupportedLanguage = 'fr' | 'en' | 'es' | 'de' | 'it';

export interface TranslationConfig {
  defaultLanguage: SupportedLanguage;
  autoDetect?: boolean;
}

class TranslationService {
  private currentLanguage: SupportedLanguage = 'fr';
  private translations: Record<SupportedLanguage, Record<string, string>> = {
    fr: {
      greeting: 'Salut ! 👋',
      help: 'Comment puis-je t\'aider ?',
      search: 'Rechercher',
      appointment: 'Rendez-vous',
      estimate: 'Estimation',
      budget: 'Budget',
      property: 'Propriété',
      neighborhood: 'Quartier',
      contact: 'Contacter',
      send: 'Envoyer',
      close: 'Fermer',
      typing: 'L\'IA réfléchit...',
      placeholder: 'Écris ton message...',
      voicePlaceholder: '🎤 Je t\'écoute...',
      suggestions: 'Suggestions :',
      quickQuestions: 'Questions rapides :',
      assistant: 'Assistant IA',
      online: 'En ligne',
    },
    en: {
      greeting: 'Hello! 👋',
      help: 'How can I help you?',
      search: 'Search',
      appointment: 'Appointment',
      estimate: 'Estimate',
      budget: 'Budget',
      property: 'Property',
      neighborhood: 'Neighborhood',
      contact: 'Contact',
      send: 'Send',
      close: 'Close',
      typing: 'AI is thinking...',
      placeholder: 'Type your message...',
      voicePlaceholder: '🎤 Listening...',
      suggestions: 'Suggestions:',
      quickQuestions: 'Quick questions:',
      assistant: 'AI Assistant',
      online: 'Online',
    },
    es: {
      greeting: '¡Hola! 👋',
      help: '¿Cómo puedo ayudarte?',
      search: 'Buscar',
      appointment: 'Cita',
      estimate: 'Estimación',
      budget: 'Presupuesto',
      property: 'Propiedad',
      neighborhood: 'Barrio',
      contact: 'Contactar',
      send: 'Enviar',
      close: 'Cerrar',
      typing: 'La IA está pensando...',
      placeholder: 'Escribe tu mensaje...',
      voicePlaceholder: '🎤 Te escucho...',
      suggestions: 'Sugerencias:',
      quickQuestions: 'Preguntas rápidas:',
      assistant: 'Asistente IA',
      online: 'En línea',
    },
    de: {
      greeting: 'Hallo! 👋',
      help: 'Wie kann ich dir helfen?',
      search: 'Suchen',
      appointment: 'Termin',
      estimate: 'Schätzung',
      budget: 'Budget',
      property: 'Immobilie',
      neighborhood: 'Viertel',
      contact: 'Kontakt',
      send: 'Senden',
      close: 'Schließen',
      typing: 'KI denkt nach...',
      placeholder: 'Schreibe deine Nachricht...',
      voicePlaceholder: '🎤 Ich höre zu...',
      suggestions: 'Vorschläge:',
      quickQuestions: 'Schnelle Fragen:',
      assistant: 'KI-Assistent',
      online: 'Online',
    },
    it: {
      greeting: 'Ciao! 👋',
      help: 'Come posso aiutarti?',
      search: 'Cerca',
      appointment: 'Appuntamento',
      estimate: 'Stima',
      budget: 'Budget',
      property: 'Proprietà',
      neighborhood: 'Quartiere',
      contact: 'Contatta',
      send: 'Invia',
      close: 'Chiudi',
      typing: 'L\'IA sta pensando...',
      placeholder: 'Scrivi il tuo messaggio...',
      voicePlaceholder: '🎤 Ti ascolto...',
      suggestions: 'Suggerimenti:',
      quickQuestions: 'Domande rapide:',
      assistant: 'Assistente IA',
      online: 'Online',
    },
  };

  constructor(config?: TranslationConfig) {
    if (config?.defaultLanguage) {
      this.currentLanguage = config.defaultLanguage;
    }
  }

  setLanguage(language: SupportedLanguage) {
    this.currentLanguage = language;
  }

  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  t(key: string): string {
    return this.translations[this.currentLanguage]?.[key] || key;
  }

  detectLanguage(text: string): SupportedLanguage {
    const lower = text.toLowerCase();
    
    // Simple language detection based on common words
    const patterns = {
      fr: ['bonjour', 'salut', 'merci', 'oui', 'non', 'appartement', 'maison'],
      en: ['hello', 'thanks', 'yes', 'no', 'apartment', 'house', 'property'],
      es: ['hola', 'gracias', 'sí', 'no', 'apartamento', 'casa'],
      de: ['hallo', 'danke', 'ja', 'nein', 'wohnung', 'haus'],
      it: ['ciao', 'grazie', 'sì', 'no', 'appartamento', 'casa'],
    };

    let maxMatches = 0;
    let detectedLang: SupportedLanguage = 'fr';

    for (const [lang, keywords] of Object.entries(patterns)) {
      const matches = keywords.filter(kw => lower.includes(kw)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedLang = lang as SupportedLanguage;
      }
    }

    return detectedLang;
  }

  async translateMessage(message: string, targetLang: SupportedLanguage): Promise<string> {
    // In production, integrate with Google Translate API or DeepL
    // For now, return original message with language marker
    if (targetLang === this.currentLanguage) {
      return message;
    }

    // Placeholder for real translation API
    console.log(`Would translate to ${targetLang}: ${message}`);
    return `[${targetLang.toUpperCase()}] ${message}`;
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return ['fr', 'en', 'es', 'de', 'it'];
  }

  getLanguageName(code: SupportedLanguage): string {
    const names: Record<SupportedLanguage, string> = {
      fr: 'Français',
      en: 'English',
      es: 'Español',
      de: 'Deutsch',
      it: 'Italiano',
    };
    return names[code];
  }

  getLanguageFlag(code: SupportedLanguage): string {
    const flags: Record<SupportedLanguage, string> = {
      fr: '🇫🇷',
      en: '🇬🇧',
      es: '🇪🇸',
      de: '🇩🇪',
      it: '🇮🇹',
    };
    return flags[code];
  }
}

// Singleton instance
let translationServiceInstance: TranslationService | null = null;

export function getTranslationService(config?: TranslationConfig): TranslationService {
  if (!translationServiceInstance) {
    translationServiceInstance = new TranslationService(config);
  }
  return translationServiceInstance;
}

export default TranslationService;
