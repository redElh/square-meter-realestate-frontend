// Simplified RAG Chatbot Service - Uses serverless API
// This version calls the /api/chatbot endpoint instead of using Gemini directly

import { Property } from './apimoService';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  propertyResults?: Property[];
}

class RAGChatbotService {
  private conversationHistory: ChatMessage[] = [];
  private language: string = 'en';

  /**
   * Initialize is not needed - we use the API endpoint
   */
  initialize() {
    console.log('✅ RAG Chatbot initialized (API mode)');
    return true;
  }

  /**
   * Set conversation language
   */
  setLanguage(language: string) {
    this.language = language;
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Send a chat message using the API endpoint
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
      // Call the serverless API endpoint
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: this.language
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Create assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };

      // Add to history
      this.conversationHistory.push(assistantMessage);

      return assistantMessage;

    } catch (error) {
      console.error('Chat error:', error);
      
      // Return error message in appropriate language
      const errorMessage = this.getErrorMessage(this.language);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      };

      this.conversationHistory.push(assistantMessage);
      return assistantMessage;
    }
  }

  /**
   * Get welcome message in the current language
   */
  getWelcomeMessage(): string {
    const messages: Record<string, string> = {
      en: "Hello! Welcome to Square Meter Real Estate. How can I help you find your ideal property in Essaouira today? Are you looking for something specific, or would you like to browse our listings?",
      fr: "Bonjour! Bienvenue chez Square Meter Real Estate. Comment puis-je vous aider à trouver votre propriété idéale à Essaouira aujourd'hui? Cherchez-vous quelque chose de spécifique, ou souhaitez-vous parcourir nos annonces?",
      es: "¡Hola! Bienvenido a Square Meter Real Estate. ¿Cómo puedo ayudarte a encontrar tu propiedad ideal en Essaouira hoy? ¿Buscas algo específico o te gustaría explorar nuestros anuncios?",
      de: "Hallo! Willkommen bei Square Meter Real Estate. Wie kann ich Ihnen heute helfen, Ihre ideale Immobilie in Essaouira zu finden? Suchen Sie etwas Bestimmtes oder möchten Sie unsere Angebote durchstöbern?",
      ar: "مرحباً! أهلاً بك في سكوير ميتر للعقارات. كيف يمكنني مساعدتك في العثور على عقارك المثالي في الصويرة اليوم؟ هل تبحث عن شيء محدد، أم ترغب في تصفح قوائمنا؟",
      ru: "Здравствуйте! Добро пожаловать в Square Meter Real Estate. Как я могу помочь вам найти идеальную недвижимость в Эс-Сувейре сегодня? Вы ищете что-то конкретное или хотите просмотреть наши предложения?"
    };

    return messages[this.language] || messages.en;
  }

  /**
   * Get error message in the current language
   */
  private getErrorMessage(language: string): string {
    const messages: Record<string, string> = {
      en: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to browse our properties directly.",
      fr: "Je m'excuse, mais j'ai du mal à me connecter en ce moment. Veuillez réessayer dans un instant, ou n'hésitez pas à parcourir nos propriétés directement.",
      es: "Disculpa, pero estoy teniendo problemas para conectarme en este momento. Por favor, inténtalo de nuevo en un momento, o siéntete libre de explorar nuestras propiedades directamente.",
      de: "Entschuldigung, aber ich habe gerade Verbindungsprobleme. Bitte versuchen Sie es in einem Moment erneut, oder durchstöbern Sie unsere Immobilien direkt.",
      ar: "أعتذر، لكنني أواجه مشكلة في الاتصال الآن. يرجى المحاولة مرة أخرى بعد لحظة، أو لا تتردد في تصفح عقاراتنا مباشرة.",
      ru: "Прошу прощения, но у меня сейчас проблемы с подключением. Пожалуйста, попробуйте еще раз через мгновение, или просмотрите наши объекты напрямую."
    };

    return messages[language] || messages.en;
  }
}

// Export singleton instance
export const ragChatbotService = new RAGChatbotService();
export default ragChatbotService;
