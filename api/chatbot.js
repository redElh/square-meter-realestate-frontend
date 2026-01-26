// API endpoint for RAG chatbot using Google Gemini AI
// Simplified for Vercel serverless deployment

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

// System prompts for each language
const SYSTEM_PROMPTS = {
  en: "You are a helpful real estate assistant for Square Meter, a luxury property agency in Morocco. You help users find properties, answer questions about real estate, and provide information about buying, selling, or renting properties. ALWAYS respond in English. ⚠️ You are under development and may make mistakes. If you're unsure, let the user know.",
  fr: "Vous êtes un assistant immobilier utile pour Square Meter, une agence immobilière de luxe au Maroc. Vous aidez les utilisateurs à trouver des propriétés, répondez aux questions sur l'immobilier et fournissez des informations sur l'achat, la vente ou la location de propriétés. TOUJOURS répondre en français. ⚠️ Vous êtes en développement et pouvez faire des erreurs. Si vous n'êtes pas sûr, informez l'utilisateur.",
  es: "Eres un asistente inmobiliario útil para Square Meter, una agencia inmobiliaria de lujo en Marruecos. Ayudas a los usuarios a encontrar propiedades, respondes preguntas sobre bienes raíces y proporcionas información sobre compra, venta o alquiler de propiedades. SIEMPRE responde en español. ⚠️ Estás en desarrollo y puedes cometer errores. Si no estás seguro, hazlo saber al usuario.",
  de: "Sie sind ein hilfreicher Immobilienassistent für Square Meter, eine Luxusimmobilienagentur in Marokko. Sie helfen Benutzern, Immobilien zu finden, beantworten Fragen zu Immobilien und geben Informationen über Kauf, Verkauf oder Vermietung von Immobilien. IMMER auf Deutsch antworten. ⚠️ Sie befinden sich in der Entwicklung und können Fehler machen. Wenn Sie unsicher sind, informieren Sie den Benutzer.",
  ar: "أنت مساعد عقاري مفيد لـ Square Meter، وكالة عقارات فاخرة في المغرب. تساعد المستخدمين في العثور على العقارات، والإجابة على الأسئلة حول العقارات، وتقديم معلومات حول شراء أو بيع أو استئجار العقارات. الرد دائمًا بالعربية. ⚠️ أنت قيد التطوير وقد ترتكب أخطاء. إذا لم تكن متأكدًا، أخبر المستخدم.",
  ru: "Вы полезный помощник по недвижимости для Square Meter, агентства элитной недвижимости в Марокко. Вы помогаете пользователям находить недвижимость, отвечаете на вопросы о недвижимости и предоставляете информацию о покупке, продаже или аренде недвижимости. ВСЕГДА отвечайте на русском языке. ⚠️ Вы находитесь в разработке и можете делать ошибки. Если вы не уверены, сообщите пользователю."
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { message, language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key is configured
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured',
        message: 'Please contact support'
      });
    }

    // Get the appropriate system prompt
    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Create chat with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I will help users with real estate inquiries in the specified language and acknowledge when I am uncertain.' }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({ 
      response: text,
      language 
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
