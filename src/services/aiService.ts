// AI Service - Ready for GPT-4/Claude integration
// This service provides intelligent responses with fallback to local AI

export interface AIServiceConfig {
  provider: 'gpt4' | 'claude' | 'local';
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  propertyData?: any;
  intent?: string;
  confidence?: number;
}

class AIService {
  private config: AIServiceConfig;
  private conversationHistory: AIMessage[] = [];

  constructor(config: AIServiceConfig = { provider: 'local' }) {
    this.config = config;
    this.initializeSystemPrompt();
  }

  private initializeSystemPrompt() {
    const systemPrompt = `Tu es un assistant immobilier expert et amical pour Square Meter Real Estate.

PERSONNALITÉ:
- Très chaleureux et conversationnel (tu tutoies)
- Expert en immobilier français (achat, vente, investissement, location)
- Empathique et à l'écoute
- Français parfait, vocabulaire riche mais accessible
- Utilise des émojis pour rendre la conversation vivante
- Propose toujours des actions concrètes

EXPERTISE:
- Recherche et conseil sur propriétés (appartements, maisons, villas)
- Financement immobilier (prêts, capacité d'emprunt, taux)
- Aspects légaux (compromis, notaire, diagnostics)
- Quartiers et lifestyle
- Investissement locatif et rentabilité
- Estimation de biens
- Home staging et valorisation

COMPORTEMENT:
- Toujours positif et encourageant
- Pose des questions pour mieux comprendre les besoins
- Donne des exemples concrets
- Offre plusieurs options/solutions
- Se souvient du contexte de la conversation
- Aide à planifier des rendez-vous
- Rédige des documents si nécessaire

RÈGLES:
- Réponds en français
- Sois précis mais pas technique (explique le jargon)
- Maximum 200 mots par réponse (sauf si demandé)
- Propose 2-4 suggestions d'actions
- Utilise des bullet points pour la clarté
- Adapte ton ton selon le sujet (sérieux pour légal, enthousiaste pour recherche)`;

    this.conversationHistory = [{
      role: 'system',
      content: systemPrompt
    }];
  }

  async getResponse(userMessage: string, context?: any): Promise<AIResponse> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    try {
      let response: AIResponse;

      switch (this.config.provider) {
        case 'gpt4':
          response = await this.getGPT4Response(userMessage, context);
          break;
        case 'claude':
          response = await this.getClaudeResponse(userMessage, context);
          break;
        default:
          response = await this.getLocalResponse(userMessage, context);
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response.text
      });

      return response;
    } catch (error) {
      console.error('AI Service error:', error);
      // Fallback to local AI
      return this.getLocalResponse(userMessage, context);
    }
  }

  private async getGPT4Response(userMessage: string, context?: any): Promise<AIResponse> {
    if (!this.config.apiKey) {
      console.warn('No API key provided, falling back to local AI');
      return this.getLocalResponse(userMessage, context);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4-turbo-preview',
        messages: this.conversationHistory,
        temperature: this.config.temperature || 0.8,
        max_tokens: this.config.maxTokens || 500
      })
    });

    if (!response.ok) {
      throw new Error('GPT-4 API error');
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return {
      text,
      suggestions: this.extractSuggestions(text),
      intent: this.detectIntent(userMessage),
      confidence: 0.95
    };
  }

  private async getClaudeResponse(userMessage: string, context?: any): Promise<AIResponse> {
    if (!this.config.apiKey) {
      console.warn('No API key provided, falling back to local AI');
      return this.getLocalResponse(userMessage, context);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-opus-20240229',
        max_tokens: this.config.maxTokens || 500,
        messages: this.conversationHistory.filter(m => m.role !== 'system'),
        system: this.conversationHistory[0].content
      })
    });

    if (!response.ok) {
      throw new Error('Claude API error');
    }

    const data = await response.json();
    const text = data.content[0].text;

    return {
      text,
      suggestions: this.extractSuggestions(text),
      intent: this.detectIntent(userMessage),
      confidence: 0.95
    };
  }

  private async getLocalResponse(userMessage: string, context?: any): Promise<AIResponse> {
    // This is the enhanced local AI that works without external API
    // Same logic as in EnhancedAIAssistant but extracted for reusability
    
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

    const intent = this.detectIntent(userMessage);
    const text = this.generateContextualResponse(userMessage, intent, context);
    const suggestions = this.generateSuggestions(intent, context);

    return {
      text,
      suggestions,
      intent,
      confidence: 0.85
    };
  }

  private detectIntent(message: string): string {
    const lower = message.toLowerCase();
    
    const intents = {
      'appointment': ['rendez-vous', 'rdv', 'visite', 'rencontrer'],
      'search': ['cherche', 'trouve', 'recherche', 'appartement', 'maison'],
      'finance': ['prêt', 'crédit', 'budget', 'finance', 'banque'],
      'estimate': ['estim', 'vaut', 'prix de mon'],
      'sell': ['vendre', 'vente', 'vendeur'],
      'legal': ['légal', 'notaire', 'compromis', 'juridique'],
      'neighborhood': ['quartier', 'secteur', 'zone', 'ville'],
      'renovation': ['travaux', 'réno', 'rénov'],
      'investment': ['investir', 'investissement', 'rentabilité', 'roi'],
      'help': ['aide', 'comment', 'expliquer'],
      'greeting': ['salut', 'bonjour', 'hello', 'coucou']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(kw => lower.includes(kw))) {
        return intent;
      }
    }

    return 'general';
  }

  private generateContextualResponse(message: string, intent: string, context?: any): string {
    // Generate intelligent responses based on intent
    // This mirrors the enhanced logic from EnhancedAIAssistant
    const userName = context?.userName || '';
    const greeting = userName ? `${userName}, ` : '';

    const responses: Record<string, string[]> = {
      appointment: [
        `${greeting}Super ! 📅 Je vais t'aider à planifier un rendez-vous.\n\nQu'est-ce qui t'intéresse ?\n• 🏠 Visite d'un bien\n• 💼 Consultation expert\n• 📊 Estimation\n\nQuel créneau te convient ?`
      ],
      search: [
        `${greeting}Parfait ! 🔍 On va trouver ton bien idéal.\n\nDis-moi :\n• Type (appart/maison) ?\n• Ville/secteur ?\n• Budget ?\n• Critères essentiels ?\n\nJe te trouve les meilleures options !`
      ],
      finance: [
        `${greeting}Questions financières ! 💰\n\nJe peux t'aider avec :\n• Simulation capacité d'emprunt\n• Taux actuels\n• Frais (notaire, agence...)\n• Optimisation fiscale\n\nQu'est-ce qui t'intéresse ?`
      ],
      general: [
        `${greeting}Je suis là pour t'aider ! 🤗\n\nQuelques idées :\n• Chercher un bien\n• Calculer ton budget\n• Estimer une propriété\n• Comprendre le process\n\nOu pose-moi directement ta question !`
      ]
    };

    const intentResponses = responses[intent] || responses.general;
    return intentResponses[Math.floor(Math.random() * intentResponses.length)];
  }

  private generateSuggestions(intent: string, context?: any): string[] {
    const suggestions: Record<string, string[]> = {
      appointment: ['Visite propriété', 'Consultation expert', 'Cette semaine', 'Weekend'],
      search: ['Appartement', 'Maison', 'Définir budget', 'Voir nouveautés'],
      finance: ['Simulation prêt', 'Taux actuels', 'Frais totaux', 'Contact banque'],
      estimate: ['Estimation gratuite', 'Facteurs de prix', 'Valoriser mon bien'],
      sell: ['Process vente', 'Home staging', 'Photos pro', 'Estimation'],
      general: ['Chercher un bien', 'Mon budget', 'Comment ça marche', 'Conseils']
    };

    return suggestions[intent] || suggestions.general;
  }

  private extractSuggestions(text: string): string[] {
    // Extract suggestions from AI response (for GPT/Claude)
    const lines = text.split('\n');
    const suggestions: string[] = [];

    lines.forEach(line => {
      // Look for bullet points or numbered lists
      if (line.match(/^[•\-*\d]+\.?\s+(.+)/) && suggestions.length < 4) {
        const match = line.match(/^[•\-*\d]+\.?\s+(.+)/);
        if (match && match[1].length < 50) {
          suggestions.push(match[1].trim());
        }
      }
    });

    return suggestions.slice(0, 4);
  }

  clearHistory() {
    this.initializeSystemPrompt();
  }

  getHistory(): AIMessage[] {
    return [...this.conversationHistory];
  }

  updateConfig(config: Partial<AIServiceConfig>) {
    this.config = { ...this.config, ...config };
  }
}

// Singleton instance
let aiServiceInstance: AIService | null = null;

export function getAIService(config?: AIServiceConfig): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(config);
  } else if (config) {
    aiServiceInstance.updateConfig(config);
  }
  return aiServiceInstance;
}

export function resetAIService() {
  aiServiceInstance = null;
}

export default AIService;
