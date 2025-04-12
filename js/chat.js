/**
 * Chat Widget - Assistant virtuel intelligent pour Mohamed.com
 * Permet une interaction en plusieurs langues avec les visiteurs du portfolio
 */

// Importer la configuration
import config from './config.js';

// Configuration spécifique au chat
const chatConfig = {
    // API Gemini - Configuration mise à jour
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    GEMINI_API_KEY: 'AIzaSyBjsNVH2vrQVILEsk0BTkYwH8HUX-qMYio',
    
    // Paramètres de connexion
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    TIMEOUT: 15000,
    
    // Paramètres d'inactivité
    INACTIVITY_TIMEOUT: 300000 // 5 minutes
};

class ChatWidget {
    constructor() {
        // Éléments DOM
        this.widget = document.querySelector('.ai-chat-widget');
        this.toggle = document.querySelector('.ai-chat-toggle');
        this.messagesContainer = document.querySelector('.chat-messages');
        this.input = document.querySelector('.chat-input textarea');
        this.sendButton = document.querySelector('.send-btn');
        this.minimizeBtn = document.querySelector('.minimize-btn');
        this.clearBtn = document.querySelector('.clear-btn');
        
        // État du widget
        this.isOpen = false;
        this.isMinimized = false;
        this.inactivityTimeout = null;
        this.conversationHistory = [];
        this.isAPIConnected = false; // État de la connexion API
        
        // Configuration des langues
        this.supportedLanguages = {
            en: {
                name: 'English',
                welcomeMessage: 'Hello! How can I help you today?',
                resetMessage: 'The conversation has been reset. How can I help you?',
                errorMessage: 'Sorry, I\'m having trouble connecting to the server right now. Please try again in a moment.'
            },
            fr: {
                name: 'Français',
                welcomeMessage: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
                resetMessage: 'La conversation a été réinitialisée. Comment puis-je vous aider ?',
                errorMessage: 'Désolé, j\'ai des difficultés à me connecter au serveur en ce moment. Veuillez réessayer dans un instant.'
            },
            tr: {
                name: 'Türkçe',
                welcomeMessage: 'Merhaba! Size nasıl yardımcı olabilirim?',
                resetMessage: 'Konuşma sıfırlandı. Size nasıl yardımcı olabilirim?',
                errorMessage: 'Üzgünüm, şu anda sunucuya bağlanmakta sorun yaşıyorum. Lütfen biraz sonra tekrar deneyin.'
            },
            ar: {
                name: 'العربية',
                welcomeMessage: 'مرحباً! كيف يمكنني مساعدتك؟',
                resetMessage: 'تم إعادة تعيين المحادثة. كيف يمكنني مساعدتك؟',
                errorMessage: 'عذراً، أواجه مشكلة في الاتصال بالخادم حالياً. يرجى المحاولة مرة أخرى بعد قليل.'
            }
        };
        
        this.currentLanguage = 'fr'; // Langue par défaut
        
        // Initialiser le chat
        this.init();
    }

    /**
     * Initialise le chat widget et attache les événements
     */
    init() {
        // Gestion du bouton d'ouverture/fermeture
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat();
        });
        
        // Gestion de l'envoi de messages
        this.sendButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.sendMessage();
        });
        
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Empêcher la fermeture lors du clic dans le chat
        this.widget.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Fermer le chat lors du clic en dehors
        document.addEventListener('click', () => {
            if (this.isOpen) {
                this.closeChat();
            }
        });

        // Gestion des boutons supplémentaires
        this.minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeChat();
        });
        
        this.clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearChat();
        });

        // Gestion de l'inactivité
        document.addEventListener('mousemove', () => this.resetInactivityTimer());
        document.addEventListener('keypress', () => this.resetInactivityTimer());

        // Mise à jour de l'icône du robot
        this.updateRobotIcon();
        
        // Message de bienvenue par défaut
        const defaultMessage = `Bonjour ! Je suis là pour vous parler des compétences, projets et disponibilité de Mohamed. Comment puis-je vous aider aujourd'hui ?`;
        
        this.addMessage({
            type: 'assistant',
            content: defaultMessage
        });
        
        this.conversationHistory.push({
            role: 'assistant',
            content: defaultMessage
        });
    }

    /**
     * Teste la connexion à l'API Gemini
     * @returns {Promise<boolean>} true si la connexion est réussie, false sinon
     */
    async testAPIConnection() {
        try {
            console.log("Test de connexion à l'API...");
            
            // Construire l'URL de l'API
            const apiEndpoint = new URL(chatConfig.API_URL);
            apiEndpoint.searchParams.append('key', chatConfig.GEMINI_API_KEY);
            
            // Préparer une requête simple
            const testRequestBody = {
                contents: [{
                    parts: [{
                        text: "Test de connexion"
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 5
                }
            };
            
            // Envoyer la requête avec un court timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout court pour le test
            
            const response = await fetch(apiEndpoint.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testRequestBody),
                signal: controller.signal,
                mode: 'cors',
                cache: 'no-cache'
            });
            
            clearTimeout(timeoutId);
            
            // Mettre à jour l'état de connexion et l'indicateur visuel
            this.isAPIConnected = response.ok;
            this.updateConnectionStatus();
            
            return response.ok;
        } catch (error) {
            console.error("Test de connexion à l'API échoué:", error);
            
            // Mettre à jour l'état de connexion et l'indicateur visuel
            this.isAPIConnected = false;
            this.updateConnectionStatus();
            
            return false;
        }
    }

    /**
     * Met à jour l'animation de l'icône du robot
     */
    updateRobotIcon() {
        const robotIcons = document.querySelectorAll('.robot-icon');
        robotIcons.forEach(icon => {
            icon.style.backgroundImage = 'url("./assets/robot-animation.gif")';
            icon.style.backgroundSize = 'contain';
            icon.style.backgroundRepeat = 'no-repeat';
            icon.style.backgroundPosition = 'center';
        });
    }

    /**
     * Réinitialise le minuteur d'inactivité
     */
    resetInactivityTimer() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        if (this.isOpen) {
            this.inactivityTimeout = setTimeout(() => {
                this.closeChat();
            }, chatConfig.INACTIVITY_TIMEOUT);
        }
    }

    /**
     * Ferme le chat
     */
    closeChat() {
        if (this.isOpen) {
            this.isOpen = false;
            this.widget.classList.remove('active');
            this.toggle.querySelector('.robot-icon').style.transform = 'rotate(0deg)';
            
            if (this.inactivityTimeout) {
                clearTimeout(this.inactivityTimeout);
            }
        }
    }

    /**
     * Ouvre ou ferme le chat
     */
    toggleChat() {
        this.isOpen = !this.isOpen;
        this.widget.classList.toggle('active', this.isOpen);
        
        if (this.isOpen) {
            this.input.focus();
            this.toggle.querySelector('.robot-icon').style.transform = 'rotate(360deg)';
            this.resetInactivityTimer();
        } else {
            this.toggle.querySelector('.robot-icon').style.transform = 'rotate(0deg)';
            if (this.inactivityTimeout) {
                clearTimeout(this.inactivityTimeout);
            }
        }
    }

    /**
     * Gère l'envoi d'un message par l'utilisateur
     */
    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Ajouter le message de l'utilisateur
        this.addMessage({
            type: 'user',
            content: message
        });

        // Sauvegarder le message dans l'historique
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // Réinitialiser l'input
        this.input.value = '';
        
        // Afficher l'indicateur de frappe
        this.showTypingIndicator();

        try {
            // Obtenir une réponse de l'API
            const response = await this.getAIResponse();
            
            this.hideTypingIndicator();
            
            if (response) {
                // Ajouter la réponse au chat
                this.addMessage({
                    type: 'assistant',
                    content: response
                });
                
                // Sauvegarder la réponse dans l'historique
                this.conversationHistory.push({
                    role: 'assistant',
                    content: response
                });
            } else {
                // Si l'API ne répond pas, utiliser une réponse de secours
                const lastMessage = this.conversationHistory[this.conversationHistory.length - 1].content;
                const fallbackResponse = this.getFallbackResponse(lastMessage);
                
                this.addMessage({
                    type: 'assistant',
                    content: fallbackResponse
                });
                
                this.conversationHistory.push({
                    role: 'assistant',
                    content: fallbackResponse
                });
            }
        } catch (error) {
            console.error('Erreur lors de la communication avec l\'API:', error);
            this.hideTypingIndicator();
            
            // En cas d'erreur, utiliser une réponse de secours
            const lastMessage = this.conversationHistory[this.conversationHistory.length - 1].content;
            const fallbackResponse = this.getFallbackResponse(lastMessage);
            
            this.addMessage({
                type: 'assistant',
                content: fallbackResponse
            });
            
            this.conversationHistory.push({
                role: 'assistant',
                content: fallbackResponse
            });
        }
    }

    async getAIResponse() {
        // Détecter la langue du dernier message
        const lastMessage = this.conversationHistory[this.conversationHistory.length - 1].content;
        const detectedLanguage = this.detectLanguage(lastMessage);
        this.currentLanguage = detectedLanguage;
        
        // Limiter l'historique pour éviter de dépasser la limite de tokens
        const recentHistory = this.conversationHistory.slice(-8);
        
        // Créer le prompt pour que l'assistant réponde comme une vraie personne
        const prompt = `
Tu es l'assistant personnel de Mohamed, un développeur Full Stack talentueux. Tu dois répondre comme une vraie personne et non comme une IA.

INSTRUCTIONS IMPORTANTES:
1. Tu dois TOUJOURS répondre en ${this.supportedLanguages[detectedLanguage].name}
2. Réponds comme une VRAIE PERSONNE, pas comme un assistant IA
3. Sois naturel, chaleureux et empathique dans tes réponses
4. Ne commence JAMAIS par "En tant que..." ou "Je suis l'assistant..."
5. Ne mentionne JAMAIS que tu es une IA, un modèle ou un assistant
6. Sois bref et concis

INFOS SUR MOHAMED:
- Développeur Full Stack avec +2 ans d'expérience
- Expert en React, Node.js, JavaScript, Python et intégration IA
- Plus de 50 projets réalisés (e-commerce, web apps, intégration IA)
- Polyglotte: français (natif), anglais, turc, arabe, hausa, djerma, kanuri
- Contact: personelmomo1@gmail.com | +90 555 078 11 18
- Basé à Istanbul, Turquie
- Disponible pour des projets freelance et collaborations

CONVERSATION RÉCENTE:
${recentHistory.map(msg => `${msg.role === 'user' ? 'Visiteur' : 'Moi'}: ${msg.content}`).join('\n\n')}

QUESTION ACTUELLE: ${lastMessage}

Réponds comme si tu étais un vrai assistant humain qui représente Mohamed.`;

        // Essayer d'obtenir une réponse de l'API avec une seule tentative
        try {
            return await this.callGeminiAPI(prompt);
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API:", error);
            return null;
        }
    }

    /**
     * Appelle l'API Gemini avec gestion des erreurs
     * @param {string} prompt - Le prompt à envoyer à l'API
     * @returns {Promise<string|null>} La réponse de l'API ou null en cas d'échec
     */
    async callGeminiAPI(prompt) {
        try {
            // Construire l'URL de l'API
            const apiEndpoint = new URL(chatConfig.API_URL);
            apiEndpoint.searchParams.append('key', chatConfig.GEMINI_API_KEY);
            
            // Préparer la requête avec le format optimisé pour gemini-2.0-flash
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 1000,
                    topP: 0.9,
                    topK: 40,
                    candidateCount: 1
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };
            
            // Envoyer la requête à l'API
            const response = await fetch(apiEndpoint.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': chatConfig.GEMINI_API_KEY
                },
                mode: 'cors',
                body: JSON.stringify(requestBody)
            });

            // Vérifier si la réponse est valide
            if (!response.ok) {
                console.error('Erreur API:', response.status, response.statusText);
                const errorData = await response.text();
                console.error('Détails de l\'erreur:', errorData);
                throw new Error(`Erreur API: ${response.status}`);
            }

            // Traiter la réponse
            const data = await response.json();
            console.log('Réponse API reçue:', data);
            
            if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error('Format de réponse invalide:', data);
                throw new Error('Format de réponse invalide');
            }
        } catch (error) {
            console.error('Erreur détaillée API Gemini:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                console.error('Erreur réseau - Vérifiez votre connexion Internet');
            } else if (error.message.includes('403')) {
                console.error('Erreur d\'authentification - Vérifiez votre clé API');
            } else if (error.message.includes('429')) {
                console.error('Limite de requêtes atteinte - Attendez un moment');
            }
            return null;
        }
    }

    /**
     * Fournit une réponse de secours quand l'API n'est pas disponible
     * @param {string} prompt - Le prompt original
     * @returns {string} Une réponse prédéfinie basée sur le contenu du prompt
     */
    getFallbackResponse(prompt) {
        // Détecter la langue pour la réponse
        const detectedLang = this.detectPromptLanguage(prompt);
        
        // Réponses prédéfinies par langue
        const fallbackResponses = {
            fr: [
                "Je suis là pour vous parler des compétences et des projets de Mohamed. Comment puis-je vous aider aujourd'hui ?",
                "Mohamed est un développeur full-stack avec plus de 2 ans d'expérience. Il a réalisé plus de 50 projets et maîtrise React, Node.js et l'intégration IA.",
                "Vous pouvez contacter Mohamed à personelmomo1@gmail.com ou au +90 555 078 11 18 pour discuter de vos projets.",
                "Mohamed est polyglotte et parle français, anglais, turc, arabe et plusieurs autres langues.",
                "Les projets de Mohamed comprennent des applications web, des sites e-commerce et des solutions d'IA. Vous pouvez les voir dans la section portfolio."
            ],
            en: [
                "I'm here to tell you about Mohamed's skills and projects. How can I help you today?",
                "Mohamed is a full-stack developer with over 2 years of experience. He has completed more than 50 projects and is proficient in React, Node.js, and AI integration.",
                "You can contact Mohamed at personelmomo1@gmail.com or +90 555 078 11 18 to discuss your projects.",
                "Mohamed is multilingual and speaks French, English, Turkish, Arabic, and several other languages.",
                "Mohamed's projects include web applications, e-commerce sites, and AI solutions. You can see them in the portfolio section."
            ],
            tr: [
                "Size Mohamed'in becerileri ve projeleri hakkında bilgi verebilirim. Bugün size nasıl yardımcı olabilirim?",
                "Mohamed, 2 yıldan fazla deneyime sahip bir full-stack geliştiricidir. 50'den fazla proje tamamladı ve React, Node.js ve yapay zeka entegrasyonunda uzmandır.",
                "Projelerinizi görüşmek için Mohamed'e personelmomo1@gmail.com adresinden veya +90 555 078 11 18 numaralı telefondan ulaşabilirsiniz.",
                "Mohamed çok dilli ve Fransızca, İngilizce, Türkçe, Arapça ve birkaç başka dil konuşmaktadır.",
                "Mohamed'in projeleri web uygulamaları, e-ticaret siteleri ve yapay zeka çözümlerini içerir. Bunları portföy bölümünde görebilirsiniz."
            ],
            ar: [
                "أنا هنا لأخبرك عن مهارات ومشاريع محمد. كيف يمكنني مساعدتك اليوم؟",
                "محمد مطور ويب متكامل بخبرة تزيد عن عامين. أكمل أكثر من 50 مشروعًا ويتقن React و Node.js وتكامل الذكاء الاصطناعي.",
                "يمكنك التواصل مع محمد على personelmomo1@gmail.com أو +90 555 078 11 18 لمناقشة مشاريعك.",
                "محمد متعدد اللغات ويتحدث الفرنسية والإنجليزية والتركية والعربية وعدة لغات أخرى.",
                "تشمل مشاريع محمد تطبيقات الويب ومواقع التجارة الإلكترونية وحلول الذكاء الاصطناعي. يمكنك رؤيتها في قسم المحفظة."
            ]
        };
        
        // Extraire des mots-clés du prompt
        const promptLowerCase = prompt.toLowerCase();
        let bestResponse = fallbackResponses[detectedLang][0]; // Réponse par défaut
        
        if (promptLowerCase.includes('projet') || promptLowerCase.includes('project') || promptLowerCase.includes('proje')) {
            bestResponse = fallbackResponses[detectedLang][1];
        } else if (promptLowerCase.includes('contact') || promptLowerCase.includes('email') || promptLowerCase.includes('mail')) {
            bestResponse = fallbackResponses[detectedLang][2];
        } else if (promptLowerCase.includes('langue') || promptLowerCase.includes('language') || promptLowerCase.includes('dil')) {
            bestResponse = fallbackResponses[detectedLang][3];
        } else if (promptLowerCase.includes('portfolio') || promptLowerCase.includes('showcase') || promptLowerCase.includes('work')) {
            bestResponse = fallbackResponses[detectedLang][4];
        }
        
        return bestResponse;
    }
    
    /**
     * Détecte la langue d'un prompt pour les réponses de secours
     * @param {string} prompt - Le prompt à analyser
     * @returns {string} Code de langue ('fr', 'en', 'tr', 'ar')
     */
    detectPromptLanguage(prompt) {
        // Version simplifiée de détection de langue
        const arabicPattern = /[\u0600-\u06FF]/;
        const turkishPattern = /[ğĞıİöÖüÜşŞçÇ]/;
        
        if (arabicPattern.test(prompt)) return 'ar';
        if (turkishPattern.test(prompt)) return 'tr';
        
        // Mots communs en anglais
        const englishPattern = /\b(hello|hi|hey|thanks|thank|you|please|help|can|what|how|who|which|when|where)\b/i;
        if (englishPattern.test(prompt)) return 'en';
        
        // Par défaut, français
        return 'fr';
    }

    /**
     * Ajoute un message au conteneur de messages
     * @param {Object} param0 - Les paramètres du message
     * @param {string} param0.type - Le type de message ('user' ou 'assistant')
     * @param {string} param0.content - Le contenu du message
     */
    addMessage({ type, content }) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${type}-message`);
        
        if (type === 'assistant') {
            messageElement.innerHTML = `
                <div class="ai-avatar">
                    <div class="robot-icon"></div>
                </div>
                <div class="message-content">
                    <div class="message-text">${content}</div>
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-content user-bubble">
                    <div class="message-text">${content}</div>
                </div>
            `;
        }

        // Ajouter une animation d'apparition
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        this.messagesContainer.appendChild(messageElement);
        
        // Déclencher l'animation après l'ajout
        setTimeout(() => {
            messageElement.style.transition = 'all 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 50);

        this.scrollToBottom();
    }

    /**
     * Affiche l'indicateur de frappe
     */
    showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = `
            <div class="ai-avatar">
                <div class="robot-icon"></div>
            </div>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.messagesContainer.appendChild(typingIndicator);
        this.scrollToBottom();
    }

    /**
     * Masque l'indicateur de frappe
     */
    hideTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Fait défiler les messages jusqu'en bas
     */
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    /**
     * Minimise ou maximise le chat
     */
    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        this.widget.classList.toggle('minimized', this.isMinimized);
        
        // Changer l'icône du bouton
        const icon = this.minimizeBtn.querySelector('i');
        icon.classList.toggle('fa-minus');
        icon.classList.toggle('fa-plus');
    }

    /**
     * Efface l'historique des messages
     */
    async clearChat() {
        this.messagesContainer.style.opacity = '0';
        this.conversationHistory = [];
        
        setTimeout(() => {
            this.messagesContainer.innerHTML = '';
            this.messagesContainer.style.opacity = '1';
            
            // Générer un nouveau message d'accueil via l'API
            this.generateWelcomeMessage();
        }, 300);
    }

    /**
     * Génère un message d'accueil à partir de l'API
     */
    async generateWelcomeMessage() {
        this.showTypingIndicator();
        
        try {
            // Construire un prompt pour le message d'accueil
            const welcomePrompt = `
Tu es l'assistant personnel de Mohamed, un développeur Full Stack talentueux.

INSTRUCTIONS IMPORTANTES:
1. Réponds en français
2. Réponds comme une VRAIE PERSONNE, pas comme un assistant IA
3. Écris un court message d'accueil (2-3 phrases maximum)
4. Mentionne que tu peux parler des projets, compétences et disponibilités de Mohamed
5. Ne mentionne JAMAIS que tu es une IA, un modèle ou un assistant
6. Sois chaleureux et professionnel

Écris simplement un message d'accueil bref et efficace.`;

            // Obtenir une réponse de l'API avec gestion d'erreur
            try {
                console.log("Tentative d'obtention du message d'accueil via l'API");
                const response = await this.callGeminiAPI(welcomePrompt);
                this.hideTypingIndicator();
                
                if (response) {
                    console.log("Message d'accueil obtenu avec succès");
                    // Ajouter la réponse au chat
                    this.addMessage({
                        type: 'assistant',
                        content: response
                    });
                    
                    // Sauvegarder la réponse dans l'historique
                    this.conversationHistory.push({
                        role: 'assistant',
                        content: response
                    });
                    return;
                }
            } catch (error) {
                console.error("Erreur lors de l'obtention du message d'accueil:", error);
                // En cas d'erreur, on continue avec le message par défaut
            }
            
            // Message de bienvenue par défaut en cas d'échec
            console.log("Utilisation du message d'accueil par défaut");
            const defaultMessage = `Bonjour ! Je suis là pour vous parler des compétences, projets et disponibilité de Mohamed. Comment puis-je vous aider aujourd'hui ?`;
            
            this.hideTypingIndicator();
            this.addMessage({
                type: 'assistant',
                content: defaultMessage
            });
            
            this.conversationHistory.push({
                role: 'assistant',
                content: defaultMessage
            });
        } catch (error) {
            console.error('Erreur lors de la génération du message d\'accueil:', error);
            this.hideTypingIndicator();
            
            // Message de bienvenue par défaut en cas d'erreur
            const defaultMessage = `Bonjour ! Je suis là pour vous parler des compétences, projets et disponibilité de Mohamed. Comment puis-je vous aider aujourd'hui ?`;
            
            this.addMessage({
                type: 'assistant',
                content: defaultMessage
            });
            
            this.conversationHistory.push({
                role: 'assistant',
                content: defaultMessage
            });
        }
    }

    /**
     * Détecte la langue d'un texte
     * @param {string} text - Le texte à analyser
     * @returns {string} Le code de langue détecté ('fr', 'en', 'tr', 'ar')
     */
    detectLanguage(text) {
        // Détection basée sur les caractères spécifiques
        const arabicPattern = /[\u0600-\u06FF]/;
        const turkishPattern = /[ğĞıİöÖüÜşŞçÇ]/;
        
        if (arabicPattern.test(text)) return 'ar';
        if (turkishPattern.test(text)) return 'tr';
        
        // Détection basée sur les mots communs en anglais
        const englishWords = /\b(hello|hi|hey|thanks|thank you|please|help|can you|what|how|who|which|when|where)\b/i;
        if (englishWords.test(text)) return 'en';
        
        // Par défaut, on utilise le français
        return 'fr';
    }

    /**
     * Met à jour l'indicateur visuel de l'état de connexion
     */
    updateConnectionStatus() {
        // Vérifier si l'indicateur existe déjà
        let statusIndicator = this.widget.querySelector('.connection-status');
        
        // Si l'indicateur n'existe pas, le créer
        if (!statusIndicator) {
            statusIndicator = document.createElement('div');
            statusIndicator.className = 'connection-status';
            this.widget.querySelector('.chat-header').appendChild(statusIndicator);
        }
        
        // Mettre à jour la classe selon l'état de connexion
        statusIndicator.classList.toggle('status-connected', this.isAPIConnected);
        statusIndicator.classList.toggle('status-disconnected', !this.isAPIConnected);
        
        // Ajouter un titre explicatif
        statusIndicator.title = this.isAPIConnected ? 
            'Connecté au serveur' : 
            'Mode hors ligne - Réponses prédéfinies';
    }
    
    /**
     * Affiche un message d'erreur dans le chat
     * @param {string} errorText - Le texte d'erreur à afficher
     */
    showErrorMessage(errorText) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorText;
        
        this.messagesContainer.appendChild(errorElement);
        this.scrollToBottom();
        
        // Faire disparaître le message après quelques secondes
        setTimeout(() => {
            errorElement.style.opacity = '0';
            setTimeout(() => errorElement.remove(), 500);
        }, 5000);
    }
    
    /**
     * Affiche une notification de mode secours
     */
    showFallbackNotification() {
        if (this.widget.querySelector('.fallback-notification')) return;
        
        const notificationElement = document.createElement('div');
        notificationElement.className = 'fallback-notification';
        notificationElement.textContent = 'Mode hors ligne actif - Réponses limitées';
        
        this.messagesContainer.appendChild(notificationElement);
        this.scrollToBottom();
        
        // Faire disparaître la notification après quelques secondes
        setTimeout(() => {
            notificationElement.style.opacity = '0';
            setTimeout(() => notificationElement.remove(), 500);
        }, 10000);
    }
}

// Initialise le widget de chat quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
}); 