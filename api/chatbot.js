// API endpoint for RAG chatbot
// Handles chat requests and property indexing

const { ragChatbotService } = require('../../src/services/ragChatbotService');
const { vectorStoreService } = require('../../src/services/vectorStoreService');
const { apimoService } = require('../../src/services/apimoService');

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
    const { action, message, language } = req.body;

    // Initialize services
    if (!ragChatbotService.openai) {
      ragChatbotService.initialize(process.env.OPENAI_API_KEY);
    }

    if (!vectorStoreService.collection) {
      await vectorStoreService.initialize();
    }

    // Set language
    if (language) {
      ragChatbotService.setLanguage(language);
    }

    switch (action) {
      case 'chat':
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }

        const response = await ragChatbotService.chat(message);
        return res.status(200).json(response);

      case 'index_properties':
        // Index all properties into vector store
        const properties = await apimoService.getProperties();
        await vectorStoreService.indexProperties(properties);
        return res.status(200).json({ 
          success: true, 
          message: `Indexed ${properties.length} properties` 
        });

      case 'get_history':
        const history = ragChatbotService.getHistory();
        return res.status(200).json({ history });

      case 'clear_history':
        ragChatbotService.clearHistory();
        return res.status(200).json({ success: true });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Chatbot API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
