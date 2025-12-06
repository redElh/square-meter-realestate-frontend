import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  SparklesIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
  propertyData?: PropertySuggestion;
}

interface PropertySuggestion {
  id: string;
  title: string;
  price: string;
  location: string;
  image?: string;
}

interface UserPreferences {
  name?: string;
  budget?: string;
  location?: string;
  propertyType?: string;
  language: string;
}

const EnhancedAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Salut ! 👋 Je suis ton assistant virtuel intelligent et je suis là pour t'aider. Je peux te parler, me souvenir de tes préférences, et même te suggérer des biens qui pourraient te plaire ! Comment puis-je t'aider aujourd'hui ?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        "Chercher un appartement",
        "Estimer ma propriété",
        "Voir les nouveautés",
        "Calcul de prêt"
      ]
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    language: 'fr'
  });
  const [contextualSuggestions, setContextualSuggestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const location = useLocation();

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

  // Contextual suggestions based on current page
  useEffect(() => {
    const path = location.pathname;
    let suggestions: string[] = [];

    if (path === '/properties') {
      suggestions = [
        "Filtre par budget",
        "Propriétés avec piscine",
        "Vue sur mer disponible?",
        "Nouveaux biens cette semaine"
      ];
    } else if (path === '/owners') {
      suggestions = [
        "Comment vendre rapidement?",
        "Estimation gratuite",
        "Services inclus",
        "Durée moyenne de vente"
      ];
    } else if (path.includes('/properties/')) {
      suggestions = [
        "Visite virtuelle 3D",
        "Calculer mon prêt",
        "Quartier et commodités",
        "Propriétés similaires"
      ];
    } else if (path === '/dashboard') {
      suggestions = [
        "Mes favoris",
        "Nouvelles alertes",
        "Historique recherches",
        "Recommandations"
      ];
    } else if (path === '/') {
      suggestions = [
        "Comment ça marche?",
        "Voir les propriétés",
        "Services proposés",
        "Zones couvertes"
      ];
    }

    setContextualSuggestions(suggestions);
  }, [location]);

  // Load user preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      setUserPreferences(JSON.parse(saved));
    }
  }, []);

  // Save user preferences
  const savePreferences = (prefs: Partial<UserPreferences>) => {
    const updated = { ...userPreferences, ...prefs };
    setUserPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  };

  // Voice Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Extract user preferences from conversation
  const extractPreferences = (message: string) => {
    const lower = message.toLowerCase();
    
    // Extract name
    const nameMatch = lower.match(/je m'appelle (\w+)|mon nom est (\w+)/);
    if (nameMatch) {
      savePreferences({ name: nameMatch[1] || nameMatch[2] });
    }

    // Extract budget
    const budgetMatch = lower.match(/budget de? (\d+[k€\s]+)|(\d+)\s*(?:mille|k)/);
    if (budgetMatch) {
      savePreferences({ budget: budgetMatch[1] || budgetMatch[2] });
    }

    // Extract location preference
    const locations = ['paris', 'nice', 'lyon', 'marseille', 'cannes', 'monaco', 'bordeaux'];
    const foundLocation = locations.find(loc => lower.includes(loc));
    if (foundLocation) {
      savePreferences({ location: foundLocation });
    }

    // Extract property type
    if (lower.includes('appartement')) savePreferences({ propertyType: 'appartement' });
    if (lower.includes('maison') || lower.includes('villa')) savePreferences({ propertyType: 'maison' });
  };

  // Advanced AI Response Generator (ready for GPT-4 integration)
  const getAIResponse = async (userMessage: string): Promise<{ text: string; suggestions?: string[]; property?: PropertySuggestion }> => {
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1000));

    const lowerMessage = userMessage.toLowerCase();
    extractPreferences(userMessage);

    // Advanced conversational patterns - more natural and flexible
    const userName = userPreferences.name || '';
    const greeting = userName ? `${userName}, ` : '';

    // ==========================================
    // FLEXIBLE CONVERSATIONAL RESPONSES
    // ==========================================

    // Appointment booking / RDV
    if (lowerMessage.includes('rendez-vous') || lowerMessage.includes('rdv') || 
        lowerMessage.includes('rencontrer') || (lowerMessage.includes('visite') && lowerMessage.includes('planifier'))) {
      const greeting = userName ? `${userName}, ` : '';
      return {
        text: `${greeting}Super idée ! 📅 Je vais t'aider à planifier un rendez-vous.\n\nQu'est-ce qui t'intéresse ?\n\n• 🏠 Visite d'un bien spécifique\n• 💼 Consultation avec un expert\n• 📊 Estimation de ton bien\n• 📝 Rendez-vous notaire\n\nTu préfères quel créneau ? (matin, après-midi, en semaine, weekend)`,
        suggestions: ["Visite propriété", "Consultation expert", "Cette semaine", "Weekend"]
      };
    }

    // Help with documentation / paperwork
    if (lowerMessage.includes('document') || lowerMessage.includes('papier') || 
        lowerMessage.includes('dossier') || lowerMessage.includes('administratif')) {
      return {
        text: `${greeting}Ah les documents ! 📝 Je comprends, c'est souvent le côté moins fun de l'immobilier.\n\nJe peux t'aider à :\n\n• 📄 Préparer ton dossier de location/achat\n• ✍️ Rédiger une offre d'achat\n• 📋 Liste des documents nécessaires\n• 🏦 Documents pour la banque\n• ⚖️ Comprendre le compromis de vente\n\nQu'est-ce qui te bloque exactement ?`,
        suggestions: ["Dossier achat", "Offre d'achat", "Documents banque", "Liste complète"]
      };
    }

    // Lead qualification - understanding needs
    if (lowerMessage.includes('cherche') && (lowerMessage.includes('pas sûr') || lowerMessage.includes('sais pas') || lowerMessage.includes('hésit'))) {
      return {
        text: `${greeting}Pas de problème, c'est normal d'hésiter ! 🤔 On va clarifier ça ensemble.\n\nQuelques questions pour mieux te guider :\n\n1️⃣ C'est pour toi ou pour investir ?\n2️⃣ Tu as une idée de zone géographique ?\n3️⃣ Budget approximatif (même large) ?\n4️⃣ Plutôt appartement ou maison ?\n5️⃣ Critère absolu : ce qui est NON-NÉGOCIABLE pour toi ?\n\nRéponds comme tu veux, même en vrac ! 😊`,
        suggestions: ["Résidence principale", "Investissement", "J'ai un budget", "Je ne sais pas encore"]
      };
    }

    // Financial advice
    if (lowerMessage.includes('finance') || lowerMessage.includes('banque') || 
        lowerMessage.includes('emprunt') || lowerMessage.includes('taux')) {
      return {
        text: `${greeting}Les questions financières, c'est crucial ! 💰\n\nJe peux t'éclairer sur :\n\n• 📈 Taux actuels et tendances\n• 💳 Capacité d'emprunt (simulation)\n• 🏦 Meilleures banques du moment\n• 💸 Frais à prévoir (notaire, agence...)\n• 🎯 Optimisation fiscale\n• ⚡ Apport personnel : combien ?\n\nPar exemple, avec ton profil, tu veux qu'on estime ta capacité d'emprunt ?`,
        suggestions: ["Simuler ma capacité", "Taux actuels", "Frais totaux", "Conseil banque"]
      };
    }

    // Neighborhood / lifestyle questions
    if (lowerMessage.includes('quartier') || lowerMessage.includes('coin') || 
        lowerMessage.includes('secteur') || lowerMessage.includes('ambiance') ||
        lowerMessage.includes('vie')) {
      return {
        text: `${greeting}Le quartier, c'est presque plus important que le bien lui-même ! 🌆\n\nJe peux te donner :\n\n• 🎭 Ambiance et vie locale\n• 🏫 Écoles et crèches (notes et avis)\n• 🚇 Transports en commun\n• 🛒 Commerces et services\n• 🌳 Espaces verts et parcs\n• 👥 Profil des résidents\n• 📈 Évolution du quartier\n• 🔒 Sécurité et tranquillité\n\nQuel quartier ou ville t'intéresse ?`,
        suggestions: ["Centre-ville", "Quartiers familiaux", "Près de la plage", "Calme et résidentiel"]
      };
    }

    // Legal questions
    if (lowerMessage.includes('légal') || lowerMessage.includes('loi') || 
        lowerMessage.includes('juridique') || lowerMessage.includes('notaire') ||
        lowerMessage.includes('droit')) {
      return {
        text: `${greeting}Les aspects légaux, c'est important de bien comprendre ! ⚖️\n\nJe peux t'expliquer :\n\n• 📜 Promesse vs compromis de vente\n• ⏱️ Délais et conditions suspensives\n• 🔍 Diagnostics obligatoires\n• 👥 Co-propriété : ce qu'il faut savoir\n• 💰 Qui paie quoi ? (frais de notaire, etc.)\n• 🏛️ Plus-value immobilière\n• 📋 Servitudes et contraintes\n\nQuelle question juridique te tracasse ?`,
        suggestions: ["Compromis de vente", "Frais de notaire", "Diagnostics", "Questions copropriété"]
      };
    }

    // Renovation / work
    if (lowerMessage.includes('travaux') || lowerMessage.includes('réno') || 
        lowerMessage.includes('rénov') || lowerMessage.includes('transformer')) {
      return {
        text: `${greeting}Ah, un projet de rénovation ! 🛠️ Excitant !\n\nJe peux t'aider avec :\n\n• 💰 Estimation budget travaux\n• 🏗️ Trouver artisans de confiance\n• 📐 Idées et inspiration\n• 🎨 Architecte d'intérieur\n• ⚡ Travaux prioritaires (vs. optionnels)\n• 📋 Autorisations nécessaires\n• 💡 Valorisation du bien après travaux\n\nC'est pour rénover avant d'acheter ou un bien que tu as déjà ?`,
        suggestions: ["Budget travaux", "Trouver artisans", "Avant achat", "Valoriser pour vendre"]
      };
    }

    // First-time buyer
    if (lowerMessage.includes('première fois') || lowerMessage.includes('premier achat') || 
        lowerMessage.includes('jamais acheté') || lowerMessage.includes('débutant')) {
      return {
        text: `${greeting}Premier achat immobilier ! 🎉 C'est super excitant ! Je vais te guider pas à pas.\n\n**Ton parcours simplifié :**\n\n1️⃣ **Définir budget** : Simulation capacité d'emprunt\n2️⃣ **Chercher le bien** : Visites et coup de cœur\n3️⃣ **Faire une offre** : Je t'aide à négocier\n4️⃣ **Compromis de vente** : On vérifie tout ensemble\n5️⃣ **Prêt bancaire** : Je t'accompagne\n6️⃣ **Signature chez notaire** : Les clés ! 🔑\n\n**Où en es-tu ?** Budget défini ? Déjà des visites prévues ?\n\nJe suis là pour CHAQUE étape ! 😊`,
        suggestions: ["Calculer mon budget", "Trouver des biens", "Comprendre le process", "Aide négociation"]
      };
    }

    // Selling tips
    if (lowerMessage.includes('conseil') && lowerMessage.includes('vend')) {
      return {
        text: `${greeting}Vendre au meilleur prix, c'est tout un art ! 🎯\n\n**Mes meilleurs conseils :**\n\n✨ **Home staging** : 2000€ investis = 10-15% de plus-value\n📸 **Photos pro** : Absolument crucial (on s'en occupe !)\n💰 **Prix juste** : Ni trop haut (ça traîne), ni trop bas (tu perds)\n⏰ **Timing** : Printemps/automne = meilleure période\n🏡 **Petits travaux** : Peinture fraîche fait des miracles\n📱 **Visibilité** : On diffuse partout (web, agences, réseaux)\n\n**Ton bien :**\nLocalisation ? Surface ? État général ?\nJe te fais une estimation gratuite ! 💎`,
        suggestions: ["Estimation gratuite", "Home staging", "Photos pro", "Meilleure période"]
      };
    }

    // Personal situation / life events
    if (lowerMessage.includes('divorce') || lowerMessage.includes('sépar') || 
        lowerMessage.includes('décès') || lowerMessage.includes('héritage') ||
        lowerMessage.includes('mutation') || lowerMessage.includes('déménage')) {
      return {
        text: `${greeting}Je comprends, ce sont des moments qui peuvent être compliqués. Je suis là pour simplifier au maximum la partie immobilière. 💙\n\nChaque situation a ses spécificités :\n\n• 💔 **Séparation** : Rachat de soulte, vente amiable...\n• 📜 **Succession** : Timing, indivision, fiscalité...\n• 🚚 **Mutation pro** : Vente rapide, aide à l'achat...\n• 👨‍👩‍👧‍👦 **Agrandissement famille** : Besoins changeants...\n\nDiscrétion et accompagnement personnalisé garantis.\n\nComment puis-je t'aider concrètement ?`,
        suggestions: ["Vente rapide", "Conseil situation", "Contact conseiller", "Estimation discrète"]
      };
    }

    // Personalized greeting with name
    if (lowerMessage.includes('salut') || lowerMessage.includes('bonjour') || lowerMessage.includes('coucou') || lowerMessage.includes('hello')) {
      const greetings = [
        `Hey ${userName}! 😄 ${userPreferences.budget ? `Je me souviens - budget ${userPreferences.budget}, ` : ''}${userPreferences.location ? `secteur ${userPreferences.location}. ` : ''}Quoi de neuf aujourd'hui ?`,
        `Salut ${userName}! 👋 Content de te revoir ! ${messages.length > 3 ? 'On avance bien dans ta recherche ! ' : ''}Comment puis-je t'aider ?`,
        `Coucou ${userName}! 🌟 ${new Date().getHours() < 12 ? 'Belle matinée' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonne soirée'} ! Qu'est-ce qui t'amène ?`
      ];
      return {
        text: greetings[Math.floor(Math.random() * greetings.length)],
        suggestions: userPreferences.budget ? 
          ["Nouveaux biens dans mon budget", "Organiser une visite", "Questions budget"] :
          ["Voir les propriétés", "Estimer mon budget", "Comment ça marche ?"]
      };
    }

    // Smart search with AI
    if (lowerMessage.includes('cherche') || lowerMessage.includes('recherche') || 
        lowerMessage.includes('trouve') || lowerMessage.includes('appartement') || 
        lowerMessage.includes('maison') || lowerMessage.includes('villa')) {
      
      // Extract search criteria
      let response = "Super ! 🔍 Je vais t'aider à trouver le bien parfait. ";
      const suggestions = [];

      if (userPreferences.budget) {
        response += `Avec ton budget de ${userPreferences.budget}, `;
        suggestions.push(`Biens sous ${userPreferences.budget}`);
      }
      
      if (userPreferences.location) {
        response += `je peux te montrer d'excellentes options à ${userPreferences.location}. `;
        suggestions.push(`Propriétés à ${userPreferences.location}`);
      } else {
        response += "dans quelle ville cherches-tu ? ";
        suggestions.push("Paris", "Nice", "Lyon", "Cannes");
      }

      response += "\n\nJe peux filtrer par : prix, localisation, surface, nombre de pièces, avec piscine, vue mer... Qu'est-ce qui est important pour toi ?";
      
      suggestions.push("Avec piscine", "Vue sur mer", "Terrasse");

      return {
        text: response,
        suggestions,
        property: {
          id: '1',
          title: 'Appartement 3 pièces - Vue Mer',
          price: '450 000 €',
          location: 'Nice, Promenade des Anglais',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
        }
      };
    }

    // Calculate mortgage
    if (lowerMessage.includes('prêt') || lowerMessage.includes('crédit') || 
        lowerMessage.includes('mensualité') || lowerMessage.includes('calcul')) {
      return {
        text: "Excellente idée ! 💰 Notre calculateur de prêt est super pratique. Tu me donnes :\n\n📊 Le prix du bien\n💵 Ton apport personnel\n📅 La durée souhaitée (15, 20, 25 ans)\n\nEt je te calcule tes mensualités avec les meilleurs taux du marché ! Tu veux qu'on commence ?",
        suggestions: ["Prix 300k, apport 60k", "Prix 500k, apport 100k", "Voir simulateur"]
      };
    }

    // 3D Virtual tour
    if (lowerMessage.includes('visite') || lowerMessage.includes('3d') || 
        lowerMessage.includes('virtuelle') || lowerMessage.includes('voir')) {
      return {
        text: "Les visites virtuelles 3D c'est génial ! 🏡✨\n\nTu peux explorer les biens comme si tu y étais :\n• Vue 360° de toutes les pièces\n• Mode maison de poupée\n• Mesures précises\n• Navigation fluide\n\nC'est parfait pour faire un premier tri avant les visites physiques ! Je t'active ça ?",
        suggestions: ["Activer la visite 3D", "Voir en réalité augmentée", "Mode 360°"]
      };
    }

    // Property valuation
    if (lowerMessage.includes('estim') || lowerMessage.includes('vaut') || 
        (lowerMessage.includes('prix') && lowerMessage.includes('bien'))) {
      return {
        text: "Estimation de bien, parfait ! 🎯\n\nNotre IA analyse :\n• Les ventes récentes dans ton secteur\n• Les caractéristiques de ton bien\n• L'état du marché actuel\n• Les tendances futures\n\nTu peux avoir une estimation gratuite en 2 minutes ! Je te guide ?",
        suggestions: ["Commencer l'estimation", "Voir exemple", "Facteurs de prix"]
      };
    }

    // Neighborhood info
    if (lowerMessage.includes('quartier') || lowerMessage.includes('secteur') || 
        lowerMessage.includes('commodité')) {
      return {
        text: "Excellent point ! 🗺️ Le quartier c'est super important !\n\nJe te donne :\n• 🏫 Écoles et crèches à proximité\n• 🚇 Transports en commun\n• 🛒 Commerces et services\n• 🌳 Espaces verts\n• 📊 Évolution des prix\n• 👥 Avis des résidents\n\nC'est comme avoir un guide local ! Quel quartier t'intéresse ?",
        suggestions: ["Centre-ville", "Proche plage", "Zone résidentielle"]
      };
    }

    // Investment advice
    if (lowerMessage.includes('investir') || lowerMessage.includes('investissement') || 
        lowerMessage.includes('rentabilité') || lowerMessage.includes('roi')) {
      return {
        text: "L'investissement immobilier, excellent choix ! 📈💎\n\nJe peux t'aider avec :\n• Calcul du ROI (rendement locatif)\n• Projection sur 5-10-20 ans\n• Zones à fort potentiel\n• Optimisation fiscale\n• Comparaison d'opportunités\n\nL'immobilier reste une valeur sûre ! Tu cherches du locatif ou de la plus-value ?",
        suggestions: ["Locatif rentable", "Plus-value long terme", "Zones prometteuses"]
      };
    }

    // Favorites and saved
    if (lowerMessage.includes('favori') || lowerMessage.includes('sauvegard') || 
        lowerMessage.includes('aimé')) {
      return {
        text: "Tes favoris c'est ton espace perso ! ❤️\n\nTu peux :\n• Sauvegarder des biens\n• Ajouter des notes privées\n• Comparer côte à côte\n• Recevoir des alertes si baisse de prix\n• Partager avec ta famille\n\nC'est comme ton carnet de bord immobilier ! Je te montre ?",
        suggestions: ["Voir mes favoris", "Comparer 2 biens", "Créer une alerte"]
      };
    }

    // AR/VR features
    if (lowerMessage.includes('réalité') || lowerMessage.includes('augmentée') || 
        lowerMessage.includes('ar') || lowerMessage.includes('vr')) {
      return {
        text: "La réalité augmentée c'est l'avenir ! 🚀📱\n\nAvec ton smartphone tu peux :\n• Voir le bien projeté dans ton salon\n• Changer les meubles virtuellement\n• Mesurer les espaces\n• Visualiser différentes décos\n\nC'est magique pour se projeter ! Tu veux essayer ?",
        suggestions: ["Activer AR", "Voir démo", "Mode VR"]
      };
    }

    // ==========================================
    // INTELLIGENT DEFAULT - Context-aware & Natural
    // ==========================================
    
    // Try to understand intent even if not exact match
    const topics = {
      price: ['prix', 'coût', 'combien', 'cher', 'euro', '€'],
      location: ['où', 'quelle ville', 'secteur', 'zone', 'région'],
      features: ['caractéristique', 'équipement', 'inclus', 'avec'],
      process: ['comment', 'étape', 'processus', 'démarche', 'procédure'],
      time: ['quand', 'délai', 'combien de temps', 'durée'],
      comparison: ['différence', 'mieux', 'versus', 'comparer'],
      opinion: ['penses', 'avis', 'recommand', 'conseil']
    };

    let detectedTopic = '';
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(kw => lowerMessage.includes(kw))) {
        detectedTopic = topic;
        break;
      }
    }

    // Generate contextual response based on detected intent
    if (detectedTopic === 'price') {
      return {
        text: `${greeting}Question de budget, je comprends ! 💶\n\nTu veux savoir :\n• Le prix d'un bien en particulier ?\n• Ton budget max selon tes revenus ?\n• Les prix dans un secteur ?\n• Les frais annexes (notaire, agence...) ?\n\nDonne-moi un peu plus de détails et je te réponds précisément !`,
        suggestions: ["Prix par secteur", "Mon budget max", "Frais totaux", "Comparer des prix"]
      };
    }

    if (detectedTopic === 'location') {
      return {
        text: `${greeting}Tu cherches dans quelle zone ? 🗺️\n\nJe connais super bien :\n• 🌊 Côte d'Azur (Nice, Cannes, Monaco...)\n• 🏛️ Paris et Île-de-France\n• 🍷 Lyon, Bordeaux, Sud-Ouest\n• ⛷️ Stations de montagne\n• 🌍 Autres villes françaises\n\nOu peut-être tu veux des conseils pour choisir LE bon secteur selon ton lifestyle ?`,
        suggestions: ["Côte d'Azur", "Paris", "Lyon/Bordeaux", "Aide à choisir"]
      };
    }

    if (detectedTopic === 'process') {
      return {
        text: `${greeting}Bonne question ! Le processus peut sembler complexe mais je vais te le simplifier. 📋\n\nTu veux comprendre :\n• Comment acheter un bien (étapes) ?\n• Comment vendre ?\n• Le rôle de l'agence ?\n• Les démarches administratives ?\n• Le parcours de financement ?\n\nDis-moi ce qui t'intéresse et je t'explique tout en détail !`,
        suggestions: ["Process achat", "Process vente", "Rôle agence", "Financement"]
      };
    }

    if (detectedTopic === 'time') {
      return {
        text: `${greeting}Les délais en immobilier, ça varie ! ⏰\n\nEn général :\n• **Recherche** : 2-6 mois (selon critères)\n• **Offre → Compromis** : 1-2 semaines\n• **Compromis → Signature** : 2-3 mois\n• **Vente d'un bien** : 3-6 mois en moyenne\n• **Obtention prêt** : 4-8 semaines\n\nMais on peut accélérer selon urgence !\n\nTu as un timing particulier en tête ?`,
        suggestions: ["Achat rapide", "Vente rapide", "Pas pressé", "Timing idéal"]
      };
    }

    if (detectedTopic === 'opinion') {
      return {
        text: `${greeting}Mon avis ? Avec plaisir ! 🎯\n\nPour te conseiller au mieux, dis-moi :\n\n• C'est sur quel sujet ? (quartier, type de bien, investissement...)\n• Tes critères principaux ?\n• Tes doutes ou hésitations ?\n\nJe suis hyper franc et je te donne mon vrai avis, pas de langue de bois ! 😊\n\nAlors, sur quoi tu veux mon conseil ?`,
        suggestions: ["Bon investissement ?", "Quel quartier choisir ?", "Type de bien", "Timing achat"]
      };
    }

    // If still nothing specific detected, be genuinely helpful
    const naturalResponses = [
      {
        text: `${greeting}J'ai pas totalement saisi ta question, mais je veux vraiment t'aider ! 😊\n\nJe suis expert en :\n• **Recherche de biens** (je trouve ce qui te correspond)\n• **Conseils achat/vente** (process, timing, négo...)\n• **Aspects financiers** (budget, prêt, frais...)\n• **Quartiers & lifestyle** (où vivre selon tes besoins)\n• **Aspects légaux** (compromis, notaire...)\n• **Investissement** (rentabilité, fiscalité...)\n\nReformule ta question ou choisis un thème, je suis tout ouïe ! 👂`,
        suggestions: ["Chercher un bien", "Conseils budget", "Comprendre le process", "Questions quartier"]
      },
      {
        text: `${greeting}Hmm, je veux m'assurer de bien te répondre ! 🤔\n\nTu peux :\n• Me poser une question plus précise\n• Me dire ce que tu cherches exactement\n• Choisir un thème ci-dessous\n• Ou juste me dire "je sais pas" et on discute !\n\nL'immobilier c'est vaste, mais ensemble on va trouver ce qu'il te faut ! 💪`,
        suggestions: contextualSuggestions.length > 0 ? contextualSuggestions : [
          "J'ai une question sur...",
          "Je cherche un bien",
          "Combien je peux emprunter ?",
          "Aide-moi à démarrer"
        ]
      },
      {
        text: `${greeting}Je veux être sûr de bien t'aider ! 💡\n\nQuelques exemples de ce que tu peux me demander :\n\n💬 "Combien je peux emprunter avec 3000€/mois ?"\n💬 "C'est quoi les meilleurs quartiers pour une famille à Nice ?"\n💬 "Comment ça marche un compromis de vente ?"\n💬 "Je veux investir 200k, t'as quoi ?"\n💬 "Aide-moi à vendre rapidement"\n\nVas-y, lance-toi ! Je suis là pour ça 😊`,
        suggestions: ["Simulation budget", "Conseil quartier", "Comprendre le jargon", "Je veux investir"]
      }
    ];

    return naturalResponses[Math.floor(Math.random() * naturalResponses.length)];
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
      const response = await getAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: response.suggestions,
        propertyData: response.property
      };
      setMessages((prev) => [...prev, aiMessage]);
      
      // Auto-speak if enabled
      // speak(response.text); // Uncomment to enable auto-speak
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oups, j'ai un petit souci technique là... 😅 Réessaie dans un instant !",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Assistant Button with pulse effect */}
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
              className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              IA
            </motion.div>
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-amber-400"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Enhanced Header with avatar */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 text-white p-4 flex items-center justify-between relative overflow-hidden">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center"
                  >
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Assistant IA Pro</h3>
                  <p className="text-xs text-amber-100 flex items-center gap-1">
                    <span className="animate-pulse">●</span> En ligne · Intelligent
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 relative z-10">
                {isSpeaking && (
                  <motion.button
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    onClick={stopSpeaking}
                    className="hover:bg-amber-800 rounded-full p-2"
                  >
                    <SpeakerWaveIcon className="w-5 h-5" />
                  </motion.button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-amber-800 rounded-full p-2 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* User Info Bar (if name is known) */}
            {userPreferences.name && (
              <div className="bg-amber-50 px-4 py-2 text-sm text-amber-800 border-b border-amber-100">
                👋 Salut {userPreferences.name} ! 
                {userPreferences.budget && ` · Budget: ${userPreferences.budget}`}
                {userPreferences.location && ` · ${userPreferences.location}`}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message, index) => (
                <div key={message.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${message.sender === 'user' ? '' : 'space-y-2'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                            : 'bg-white text-gray-800 border border-gray-200 shadow-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
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

                      {/* Property Suggestion Card */}
                      {message.propertyData && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow"
                        >
                          <img 
                            src={message.propertyData.image} 
                            alt={message.propertyData.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-3">
                            <h4 className="font-semibold text-sm text-gray-800">{message.propertyData.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{message.propertyData.location}</p>
                            <p className="text-amber-600 font-bold mt-2">{message.propertyData.price}</p>
                            <button className="mt-2 w-full bg-amber-600 text-white text-xs py-2 rounded-lg hover:bg-amber-700 transition-colors">
                              Voir le bien
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* AI Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 px-3 py-2 rounded-full hover:from-amber-100 hover:to-orange-100 transition-all border border-amber-200 flex items-center gap-1 shadow-sm"
                            >
                              <LightBulbIcon className="w-3 h-3" />
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-800 border border-gray-200 shadow-md rounded-2xl px-4 py-3">
                    <div className="flex space-x-2 items-center">
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
                      <span className="text-xs text-gray-500 ml-2">L'IA réfléchit...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Contextual Quick Actions */}
            {contextualSuggestions.length > 0 && messages.length <= 2 && (
              <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100">
                <p className="text-xs text-amber-700 mb-2 flex items-center gap-1">
                  <LightBulbIcon className="w-3 h-3" />
                  Suggestions pour cette page :
                </p>
                <div className="flex flex-wrap gap-2">
                  {contextualSuggestions.slice(0, 3).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(action)}
                      className="text-xs bg-white text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors border border-amber-200 shadow-sm"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Input with voice */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "🎤 Je t'écoute..." : "Écris ou parle..."}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
                
                {/* Voice button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={isListening ? stopListening : startListening}
                  className={`rounded-full p-3 transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <MicrophoneIcon className="w-5 h-5" />
                </motion.button>

                {/* Send button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full p-3 hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </motion.button>
              </div>
              
              <p className="text-xs text-gray-400 mt-2 text-center">
                💡 Astuce: Utilise la voix ou tape ton message
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedAIAssistant;
