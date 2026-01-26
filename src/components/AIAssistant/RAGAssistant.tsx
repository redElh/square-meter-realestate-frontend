// Enhanced AI Assistant with RAG Capabilities
// Intelligent property search, FAQ handling, and viewing booking

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  SparklesIcon,
  HomeIcon,
  CalendarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { ChatMessage, ragChatbotService } from '../../services/ragChatbotService';
import { Property } from '../../services/apimoService';
import { Link } from 'react-router-dom';

interface RAGAssistantProps {
  initialOpen?: boolean;
}

export const RAGAssistant: React.FC<RAGAssistantProps> = ({ initialOpen = false }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chatbot
  useEffect(() => {
    ragChatbotService.initialize();
    ragChatbotService.setLanguage(i18n.language);

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Update language when changed
  useEffect(() => {
    ragChatbotService.setLanguage(i18n.language);
  }, [i18n.language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = (): string => {
    const messages: Record<string, string> = {
      en: "👋 Hello! I'm your AI real estate assistant. I can help you:\n\n• Find properties matching your criteria\n• Answer questions about buying in Morocco\n• Book property viewings\n• Explain legal requirements and costs\n\n⚠️ **Please note:** I'm still under development and may occasionally make mistakes. Always verify important information with our team.\n\nTry asking: *'Find me a 3-bedroom villa in Essaouira under €800k with a pool'*",
      fr: "👋 Bonjour ! Je suis votre assistant immobilier IA. Je peux vous aider à:\n\n• Trouver la propriété parfaite à Essaouira\n• Voir les détails des propriétés\n• Réserver des visites\n\n⚠️ **Note importante:** Je suis encore en développement et peux parfois faire des erreurs. Vérifiez toujours les informations importantes avec notre équipe.\n\nEssayez: *'Trouve-moi la villa la moins chère à Essaouira'* ou *'Je veux un appartement 3 chambres'*",
      es: "👋 ¡Hola! Soy su asistente inmobiliario IA. Puedo ayudarle a:\n\n• Encontrar la propiedad perfecta en Essaouira\n• Ver detalles de propiedades\n• Reservar visitas\n\n⚠️ **Nota importante:** Todavía estoy en desarrollo y puedo cometer errores ocasionalmente. Siempre verifique la información importante con nuestro equipo.\n\nPruebe: *'Encuéntrame la villa más barata en Essaouira'* o *'Quiero un apartamento de 3 dormitorios'*",
      de: "👋 Hallo! Ich bin Ihr KI-Immobilienassistent. Ich kann Ihnen helfen:\n\n• Die perfekte Immobilie in Essaouira zu finden\n• Immobiliendetails anzuzeigen\n• Besichtigungen zu buchen\n\n⚠️ **Wichtiger Hinweis:** Ich befinde mich noch in der Entwicklung und kann gelegentlich Fehler machen. Überprüfen Sie wichtige Informationen immer mit unserem Team.\n\nVersuchen Sie: *'Finde mir die günstigste Villa in Essaouira'* oder *'Ich möchte eine 3-Zimmer-Wohnung'*",
      ar: "👋 مرحباً! أنا مساعدك العقاري بالذكاء الاصطناعي. يمكنني مساعدتك في:\n\n• العثور على العقارات المناسبة لمعاييرك\n• عرض تفاصيل العقارات\n• حجز المعاينات\n\n⚠️ **ملاحظة هامة:** لا زلت قيد التطوير وقد أرتكب أخطاء أحياناً. تحقق دائماً من المعلومات المهمة مع فريقنا.\n\nجرب: *'أريد فيلا 3 غرف نوم في الصويرة'*",
      ru: "👋 Здравствуйте! Я ваш AI-помощник по недвижимости. Я могу помочь вам:\n\n• Найти недвижимость, соответствующую вашим критериям\n• Посмотреть детали объектов\n• Забронировать просмотры\n\n⚠️ **Важное примечание:** Я все еще в разработке и иногда могу совершать ошибки. Всегда проверяйте важную информацию с нашей командой.\n\nПопробуйте: *'Найди виллу с 3 спальнями в Эс-Сувейре'*"
    };
    return messages[i18n.language] || messages.en;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Get AI response
      const response = await ragChatbotService.chat(userMessage);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: t('chat.error') || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = i18n.language + '-' + i18n.language.toUpperCase();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleActionClick = (action: any) => {
    if (action.type === 'view_property') {
      window.location.href = `/properties/${action.data.propertyId}`;
    } else if (action.type === 'contact_agent') {
      window.location.href = '/contact';
    } else if (action.type === 'book_viewing') {
      window.location.href = `/contact?type=viewing&property=${action.data.propertyId}`;
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#023927] to-[#0a4d3a] rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
          >
            <div className="relative">
              <ChatBubbleLeftRightIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-full max-w-[95vw] sm:max-w-[420px] h-[85vh] sm:h-[600px] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white">
              <div className="p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm">{t('chat.title')}</h3>
                    <p className="text-[10px] sm:text-xs text-white/80">{t('chat.subtitle')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
                >
                  <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              {/* Beta Disclaimer */}
              <div className="px-3 sm:px-4 pb-2 sm:pb-3">
                <div className="bg-yellow-500/20 border border-yellow-300/30 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-start space-x-1.5 sm:space-x-2">
                  <span className="text-yellow-300 text-[10px] sm:text-xs mt-0.5">⚠️</span>
                  <p className="text-[10px] sm:text-xs text-yellow-100 leading-relaxed">
                    {t('chat.betaWarning')}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[85%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                        msg.role === 'user'
                          ? 'bg-[#023927] text-white'
                          : 'bg-white border-2 border-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="text-xs sm:text-sm whitespace-pre-line">
                        {msg.content}
                      </div>
                      <div
                        className={`text-[10px] sm:text-xs mt-1 ${
                          msg.role === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString(i18n.language, {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Property Results */}
                  {msg.propertyResults && msg.propertyResults.length > 0 && (
                    <div className="mt-2 sm:mt-3 space-y-2">
                      {msg.propertyResults.map((property) => (
                        <Link
                          key={property.id}
                          to={`/properties/${property.id}`}
                          className="block bg-white border-2 border-gray-200 rounded-xl p-2 sm:p-3 hover:border-[#023927] transition-all duration-200"
                        >
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            {property.images && property.images[0] && (
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                                {property.title}
                              </h4>
                              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
                                {property.location || property.city}
                              </p>
                              <div className="flex items-center space-x-2 mt-1 sm:mt-2">
                                <span className="text-xs sm:text-sm font-bold text-[#023927]">
                                  €{property.price?.toLocaleString()}
                                </span>
                                {property.rooms && (
                                  <span className="text-[10px] sm:text-xs text-gray-500">
                                    • {property.rooms} rooms
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Action Suggestions */}
                  {msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                      {msg.actionSuggestions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          onClick={() => handleActionClick(action)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-[#023927] text-[#023927] rounded-lg text-[10px] sm:text-xs font-medium hover:bg-[#023927] hover:text-white transition-all duration-200 flex items-center space-x-1"
                        >
                          {action.type === 'view_property' && (
                            <HomeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                          {action.type === 'book_viewing' && (
                            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                          {action.type === 'contact_agent' && (
                            <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-white border-t-2 border-gray-200">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chat.placeholder') || 'Type your message...'}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023927] transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={startVoiceInput}
                  disabled={isLoading || isListening}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <MicrophoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-[#023927] text-white rounded-xl flex items-center justify-center hover:bg-[#0a4d3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RAGAssistant;
