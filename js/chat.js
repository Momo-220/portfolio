// Configuration
const config = {
    API_URL: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash :generateContent',
    GEMINI_API_KEY: 'AIzaSyBGWbgv--fopgyiJvv6_qPB3RM83PR7WVg'
};

class ChatWidget {
    constructor() {
        this.widget = document.querySelector('.ai-chat-widget');
        this.toggle = document.querySelector('.ai-chat-toggle');
        this.messagesContainer = document.querySelector('.chat-messages');
        this.input = document.querySelector('.chat-input textarea');
        this.sendButton = document.querySelector('.send-btn');
        this.minimizeBtn = document.querySelector('.minimize-btn');
        this.clearBtn = document.querySelector('.clear-btn');
        
        this.isOpen = false;
        this.isMinimized = false;
        this.inactivityTimeout = null;
        this.conversationHistory = [];
        this.apiUrl = config.API_URL;
        this.apiKey = config.GEMINI_API_KEY;
        
        // Assistant context configuration
        this.systemContext = {
            role: 'system',
            content: `I am Mohamed's multilingual virtual assistant, a passionate Full Stack Developer.

Technical Skills:
- Web development expertise (React, Node.js, JavaScript, Python)
- AI integration and new technologies
- Over 50 completed projects, including Shopify e-commerce sites
- DevOps and performance optimization

Language Skills:
🌍 I am fluent in:
- English (Professional)
- French (Native)
- Turkish (Fluent)
- Arabic (Native)
- Hausa (Native)
- Djerma (Native)
- Kanuri (Fluent)

This linguistic diversity allows me to:
- Communicate effectively in an international environment
- Understand cultural nuances of different markets
- Adapt solutions to local needs
- Facilitate multicultural collaboration

I can inform you about:
- His detailed technical expertise
- His projects and achievements
- His education and background
- His availability for new projects
- His ability to work in an international context

I strive to be courteous, professional, and precise in my responses. Feel free to ask questions in any of the languages mentioned above.`
        };
        
        // Supported languages configuration
        this.supportedLanguages = {
            en: {
                name: 'English',
                welcomeMessage: 'Hello! How can I help you?',
                resetMessage: 'The conversation has been reset. How can I help you?',
                errorMessage: 'Sorry, an error occurred. Please try again.'
            },
            fr: {
                name: 'Français',
                welcomeMessage: 'Bonjour ! Comment puis-je vous aider ?',
                resetMessage: 'La conversation a été réinitialisée. Comment puis-je vous aider ?',
                errorMessage: 'Désolé, une erreur est survenue. Veuillez réessayer.'
            },
            tr: {
                name: 'Türkçe',
                welcomeMessage: 'Merhaba! Size nasıl yardımcı olabilirim?',
                resetMessage: 'Konuşma sıfırlandı. Size nasıl yardımcı olabilirim?',
                errorMessage: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
            },
            ar: {
                name: 'العربية',
                welcomeMessage: 'مرحباً! كيف يمكنني مساعدتك؟',
                resetMessage: 'تم إعادة تعيين المحادثة. كيف يمكنني مساعدتك؟',
                errorMessage: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
            }
        };
        
        this.currentLanguage = 'en'; // Default language
        
        this.init();
    }

    init() {
        // Toggle button handling
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat();
        });
        
        // Message sending handling
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

        // Prevent closing when clicking inside chat
        this.widget.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close chat when clicking outside
        document.addEventListener('click', () => {
            if (this.isOpen) {
                this.closeChat();
            }
        });

        // New buttons handling
        this.minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeChat();
        });
        
        this.clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearChat();
        });

        // Inactivity handling
        document.addEventListener('mousemove', () => this.resetInactivityTimer());
        document.addEventListener('keypress', () => this.resetInactivityTimer());

        // Update robot icon
        this.updateRobotIcon();

        // Enhanced welcome message
        this.addMessage({
            type: 'assistant',
            content: `Hello! 👋 I'm Mohamed's multilingual virtual assistant.

I can communicate in English, French, Turkish, Arabic, Hausa, Djerma, and Kanuri! 🌍

I'm here to tell you about:
• His web development and AI expertise
• His projects and achievements
• His education and background
• His availability

How can I help you today? Feel free to ask in any language! مرحبا بكم! Hoş geldiniz! 😊`
        });
    }

    updateRobotIcon() {
        const robotIcons = document.querySelectorAll('.robot-icon');
        robotIcons.forEach(icon => {
            icon.style.backgroundImage = 'url("./assets/robot-animation.gif")';
            icon.style.backgroundSize = 'contain';
            icon.style.backgroundRepeat = 'no-repeat';
            icon.style.backgroundPosition = 'center';
        });
    }

    resetInactivityTimer() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        if (this.isOpen) {
            this.inactivityTimeout = setTimeout(() => {
                this.closeChat();
            }, 300000); // 5 minutes d'inactivité
        }
    }

    closeChat() {
        if (this.isOpen) {
            this.isOpen = false;
            this.widget.classList.remove('active');
            this.toggle.querySelector('.robot-icon').style.transform = 'rotate(0deg)';
        }
    }

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
            const response = await this.getAIResponse();
            this.hideTypingIndicator();
            
            if (response) {
                this.addMessage({
                    type: 'assistant',
                    content: response
                });
                
                // Sauvegarder la réponse dans l'historique
                this.conversationHistory.push({
                    role: 'assistant',
                    content: response
                });
            }
        } catch (error) {
            console.error('Erreur lors de la communication avec l\'API:', error);
            this.hideTypingIndicator();
            this.addMessage({
                type: 'assistant',
                content: this.supportedLanguages[this.currentLanguage].errorMessage
            });
        }
    }

    async getAIResponse() {
        try {
            // Détecter la langue de la dernière question
            const lastMessage = this.conversationHistory[this.conversationHistory.length - 1].content;
            const detectedLanguage = this.detectLanguage(lastMessage);
            this.currentLanguage = detectedLanguage;

            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{
                            text: `${this.systemContext.content}\n\n
                            IMPORTANT: L'utilisateur communique en ${this.supportedLanguages[detectedLanguage].name}. 
                            Répondez UNIQUEMENT dans cette même langue.\n\n
                            Historique de la conversation:\n${
                                this.conversationHistory
                                    .map(msg => `${msg.role}: ${msg.content}`)
                                    .join('\n')
                            }\n\nDernière question: ${lastMessage}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800,
                        topP: 0.8,
                        topK: 40
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Erreur API détaillée:', errorData);
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error('Structure de réponse inattendue:', data);
                throw new Error('Format de réponse invalide');
            }
        } catch (error) {
            console.error('Erreur API détaillée:', error);
            // Retourner le message d'erreur dans la langue détectée
            return this.supportedLanguages[this.currentLanguage].errorMessage;
        }
    }

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

    hideTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        this.widget.classList.toggle('minimized', this.isMinimized);
        
        // Changer l'icône du bouton
        const icon = this.minimizeBtn.querySelector('i');
        icon.classList.toggle('fa-minus');
        icon.classList.toggle('fa-plus');
    }

    clearChat() {
        this.messagesContainer.style.opacity = '0';
        this.conversationHistory = [];
        
        setTimeout(() => {
            this.messagesContainer.innerHTML = '';
            this.messagesContainer.style.opacity = '1';
            
            this.addMessage({
                type: 'assistant',
                content: this.supportedLanguages[this.currentLanguage].resetMessage
            });
        }, 300);
    }

    // Ajouter la fonction de détection de langue
    detectLanguage(text) {
        // Détection simple basée sur les premiers caractères et mots
        const arabicPattern = /[\u0600-\u06FF]/;
        const turkishPattern = /[ğĞıİöÖüÜşŞçÇ]/;
        
        if (arabicPattern.test(text)) return 'ar';
        if (turkishPattern.test(text)) return 'tr';
        
        // Détection basée sur les mots communs
        const englishWords = /\b(hello|hi|hey|thanks|please|help|can|you|the|what|how)\b/i;
        if (englishWords.test(text)) return 'en';
        
        return 'fr'; // Par défaut
    }
}

// Initialize chat widget
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
}); 