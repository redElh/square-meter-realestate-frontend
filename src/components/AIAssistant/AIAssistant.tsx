import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Salut ! 👋 Je suis ton assistant virtuel et je suis là pour t'aider. N'hésite pas à me poser toutes tes questions sur Square Meter Real Estate - que ce soit pour trouver un bien, vendre ta propriété, ou juste discuter immobilier ! Comment puis-je t'aider aujourd'hui ?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

    const lowerMessage = userMessage.toLowerCase();

    // Friendly conversational responses in French
    
    // Properties / Biens
    if (lowerMessage.includes('propriété') || lowerMessage.includes('propriétés') || 
        lowerMessage.includes('bien') || lowerMessage.includes('biens') ||
        lowerMessage.includes('maison') || lowerMessage.includes('appartement')) {
      const responses = [
        "Ah, tu cherches un bien immobilier ? Super ! 🏡 Sur la page Propriétés, tu vas trouver notre sélection exclusive. Tu peux filtrer par ville, budget, type de bien... C'est hyper pratique ! Chaque annonce a des photos magnifiques et même des visites virtuelles. Je t'aide à chercher quelque chose en particulier ?",
        "Cool, l'immobilier t'intéresse ! 😊 Notre catalogue est vraiment top - tu peux rechercher par localisation, prix, nombre de pièces... Tout est là pour te faciliter la vie. Et si tu vois un bien qui te plaît, tu peux le sauvegarder dans ton espace perso. Tu veux que je t'explique comment ça marche ?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Selling / Vendre
    if (lowerMessage.includes('vendre') || lowerMessage.includes('vente') || 
        lowerMessage.includes('vend') || lowerMessage.includes('vendeur')) {
      const responses = [
        "Tu veux vendre ton bien ? Génial ! 🎯 On a un processus super complet pour valoriser au max ta propriété. Va voir la section 'Pour les Propriétaires' - tu y trouveras notre guide étape par étape. Photos pro, analyse de marché, accompagnement perso... On s'occupe de tout ! Je t'en dis plus ?",
        "Ah, la vente ! C'est une grande étape 😊 Notre équipe est là pour t'accompagner du début à la fin. On a même un système multi-étapes qui rend tout ça hyper simple. Estimation gratuite, mise en valeur du bien, négociation... T'es entre de bonnes mains ! Envie d'en savoir plus ?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Owners / Propriétaires
    if (lowerMessage.includes('propriétaire') || lowerMessage.includes('proprio')) {
      return "La section Propriétaires, c'est vraiment ton espace privilégié ! 👑 Tu peux gérer ton bien, accéder aux stats du marché, suivre tes demandes... C'est comme avoir une agence dans ta poche. Et notre équipe d'experts est toujours dispo pour te conseiller. Je t'explique une fonctionnalité en particulier ?";
    }

    // Travel / Voyage
    if (lowerMessage.includes('voyage') || lowerMessage.includes('vacances') || 
        lowerMessage.includes('location') || lowerMessage.includes('séjour')) {
      return "Oh, tu penses à des vacances ? 🌴 L'Espace Voyageur c'est le paradis ! Des villas de luxe, des apparts de rêve pour des séjours courts... avec en plus des services de conciergerie pour tout organiser. Imagine, tu arrives et tout est déjà prêt ! Ça te tente de voir ce qu'on propose ?";
    }

    // Contact
    if (lowerMessage.includes('contact') || lowerMessage.includes('joindre') || 
        lowerMessage.includes('appeler') || lowerMessage.includes('écrire')) {
      return "Besoin de parler à quelqu'un ? Pas de souci ! 📞 Va sur la page Contact, tu trouveras tous nos bureaux, numéros de téléphone et emails. Tu peux aussi remplir le formulaire et l'équipe te répond généralement en moins de 24h. Ils sont super réactifs ! Y'a autre chose que je peux faire pour toi ?";
    }

    // Auth / Compte
    if (lowerMessage.includes('compte') || lowerMessage.includes('connexion') || 
        lowerMessage.includes('connecter') || lowerMessage.includes('inscription') ||
        lowerMessage.includes('auth')) {
      return "Pour ton compte perso, c'est par là ! 🔐 Une fois connecté, tu as accès à ton tableau de bord, tes biens favoris, tes alertes... C'est vraiment pratique pour suivre toutes tes recherches. Pas encore inscrit ? Ça prend 2 minutes et c'est gratuit ! Besoin d'aide pour te connecter ?";
    }

    // Dashboard / Tableau de bord
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('tableau de bord')) {
      return "Ton Dashboard, c'est ton QG personnel ! 📊 Tu y retrouves tous tes favoris, tes recherches sauvegardées, les nouvelles alertes... On te fait même des suggestions personnalisées selon tes goûts. C'est comme avoir ton agent immobilier perso qui te connaît par cœur ! Cool non ?";
    }

    // Markets / Marchés
    if (lowerMessage.includes('marché') || lowerMessage.includes('marchés') || 
        lowerMessage.includes('tendance')) {
      return "Ah, les tendances du marché ! 📈 C'est passionnant ! Notre section Marchés te donne accès à des analyses complètes, l'évolution des prix, les opportunités par région... C'est super utile pour investir au bon moment. Tu t'intéresses à un marché en particulier ?";
    }

    // Investment / Investissement
    if (lowerMessage.includes('investir') || lowerMessage.includes('investissement') || 
        lowerMessage.includes('placement')) {
      return "L'investissement immobilier, excellent choix ! 💰 Notre page dédiée regroupe tout ce qu'il faut : calculateurs de rentabilité, analyses de marché, conseils d'experts... On t'aide à trouver les biens à fort potentiel. L'immobilier, c'est un placement sûr quand c'est bien fait ! Je t'explique notre approche ?";
    }

    // Concierge
    if (lowerMessage.includes('conciergerie') || lowerMessage.includes('concierge')) {
      return "La Conciergerie, c'est notre service premium ! ✨ Imagine : visites organisées, aide au déménagement, déco d'intérieur, support juridique... On gère TOUT de A à Z pour que ce soit fluide et agréable. C'est vraiment du sur-mesure, comme dans les grands hôtels ! Ça t'intéresse ?";
    }

    // Agency / Agence
    if (lowerMessage.includes('agence') || lowerMessage.includes('qui êtes') || 
        lowerMessage.includes('à propos')) {
      return "Tu veux en savoir plus sur nous ? 😊 Va faire un tour sur notre page Agence ! Tu découvriras notre histoire, l'équipe (on est une belle bande !), nos valeurs... Ce qui nous passionne c'est l'immobilier de luxe et surtout rendre nos clients heureux. On est fiers de ce qu'on fait !";
    }

    // Help / Aide
    if (lowerMessage.includes('aide') || lowerMessage.includes('aidez') || 
        lowerMessage.includes('support')) {
      return "Je suis là pour ça ! 🤗 Le Centre d'Aide regroupe aussi plein de FAQ et tutos si tu préfères. Et pour des questions spécifiques, l'équipe support répond vite via le formulaire de contact. Dis-moi ce qui te bloque, on va résoudre ça ensemble !";
    }

    // Language/Settings
    if (lowerMessage.includes('langue') || lowerMessage.includes('paramètres') || 
        lowerMessage.includes('devise') || lowerMessage.includes('settings')) {
      return "Tu peux personnaliser ton expérience dans les Paramètres ! 🌍 Choisis ta langue, ta devise préférée... On est une agence internationale alors on a pensé à tout ! C'est dans le menu tout en haut. Simple et rapide !";
    }

    // Magazine
    if (lowerMessage.includes('magazine') || lowerMessage.includes('mag') || 
        lowerMessage.includes('article')) {
      return "Notre Magazine, c'est ma section préférée ! 📰 Articles inspirants, portfolios de biens d'exception, tendances déco, lifestyle luxe... C'est un vrai plaisir à parcourir. Parfait avec un bon café ! Tu vas adorer, crois-moi !";
    }

    // Careers / Carrières
    if (lowerMessage.includes('carrière') || lowerMessage.includes('emploi') || 
        lowerMessage.includes('job') || lowerMessage.includes('recrutement') ||
        lowerMessage.includes('travailler')) {
      return "Tu veux rejoindre l'aventure ? 🚀 C'est génial ! Va voir notre page Carrières pour les postes ouverts. On cherche toujours des talents passionnés par l'immobilier et le service client. L'ambiance est top et les projets sont excitants ! Envoie ta candidature !";
    }

    // Navigation / Comment utiliser
    if (lowerMessage.includes('comment') || lowerMessage.includes('utiliser') || 
        lowerMessage.includes('naviguer') || lowerMessage.includes('fonctionne')) {
      return "Pas de panique, je vais t'expliquer ! 😉 Le menu principal en haut te donne accès à tout : Propriétés, Espace Propriétaires, Voyageur, Agence, Magazine, Contact... Et ton compte perso c'est dans le coin en haut à droite. C'est vraiment intuitif ! Tu cherches une section en particulier ?";
    }

    // Thanks
    if (lowerMessage.includes('merci') || lowerMessage.includes('thanks')) {
      return "Mais de rien, c'est un plaisir ! 😊 N'hésite vraiment pas si t'as d'autres questions, je suis là pour ça. Bonne exploration sur Square Meter ! 🏠💫";
    }

    // Greetings
    if (lowerMessage.includes('salut') || lowerMessage.includes('bonjour') || 
        lowerMessage.includes('coucou') || lowerMessage.includes('hello') || 
        lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const responses = [
        "Salut ! 😄 Ça fait plaisir de te voir ! Alors, qu'est-ce qui t'amène aujourd'hui ? Tu cherches un bien, tu veux vendre, ou juste explorer nos services ? Je suis tout ouïe !",
        "Hey ! 👋 Content de discuter avec toi ! Je suis là pour t'aider avec tout ce qui concerne l'immobilier de luxe. Achat, vente, location vacances... Dis-moi tout, qu'est-ce qui t'intéresse ?",
        "Coucou ! 🌟 Ravi de te rencontrer ! Tu sais, Square Meter c'est vraiment une super plateforme pour l'immobilier haut de gamme. Je peux t'aider à y naviguer, répondre à tes questions... Par où on commence ?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Casual conversation
    if (lowerMessage.includes('ça va') || lowerMessage.includes('comment vas')) {
      return "Ça roule merci ! 😊 Toujours prêt à aider avec l'immobilier. Et toi, tout va bien ? Tu cherches quelque chose en particulier aujourd'hui ?";
    }

    // Price / Prix
    if (lowerMessage.includes('prix') || lowerMessage.includes('coût') || 
        lowerMessage.includes('combien') || lowerMessage.includes('tarif')) {
      return "Question budget, je comprends ! � Les prix varient selon le type de bien, la localisation, la surface... Sur notre page Propriétés, tu peux filtrer par tranche de prix pour voir ce qui correspond à ton budget. Et notre équipe peut te faire une estimation gratuite si tu veux vendre. Je t'en dis plus ?";
    }

    // Location / Area
    if (lowerMessage.includes('où') || lowerMessage.includes('localisation') || 
        lowerMessage.includes('quartier') || lowerMessage.includes('ville')) {
      return "Pour la localisation, on couvre plein de secteurs premium ! 🌍 Paris, Côte d'Azur, stations de ski, capitales européennes... Tu as une région qui te fait rêver ? Je peux te guider vers nos biens dans cette zone !";
    }

    // Default friendly response - varied and conversational
    const defaultResponses = [
      "Hmm, bonne question ! 🤔 Je peux t'aider sur plein de sujets : trouver un bien, vendre ta propriété, nos services, l'investissement immobilier, gérer ton compte... Dis-moi ce qui te tracasse et on va clarifier ça ensemble !",
      "Intéressant ! 😊 Tu sais, je suis là pour discuter de tout ce qui touche à l'immobilier. Recherche de biens, vente, location vacances, investissement, navigation sur le site... N'hésite pas à être plus précis, je suis là pour t'aider !",
      "Ah, je vois ! 💡 Pour que je puisse t'aider au mieux, dis-moi ce qui t'intéresse : acheter, vendre, investir, louer pour les vacances ? Ou peut-être juste comprendre comment marche la plateforme ? Je suis tout ouïe !",
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oups, j'ai un petit souci technique là... 😅 Réessaie dans un instant ou contacte notre équipe support si ça persiste. Désolé pour le dérangement !",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Comment chercher un bien ?",
    "Je veux vendre ma propriété",
    "Quels sont vos services ?",
    "C'est quoi l'Espace Voyageur ?",
  ];

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full p-4 shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
            aria-label="Open AI Assistant"
          >
            <SparklesIcon className="w-6 h-6" />
            <motion.div
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              AI
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <SparklesIcon className="w-8 h-8" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Assistant IA</h3>
                  <p className="text-xs text-amber-100">Toujours là pour toi</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-amber-800 rounded-full p-1 transition-colors"
                aria-label="Close Assistant"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                        : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-amber-100' : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-800 border border-gray-200 shadow-sm rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <motion.div
                        className="w-2 h-2 bg-amber-600 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-amber-600 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-amber-600 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 bg-white border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Questions rapides :</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-100 transition-colors border border-amber-200"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Écris ton message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full p-2 hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
